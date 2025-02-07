const username = "lisabergstrom";
const API_REPOS = `https://api.github.com/users/${username}/repos`;
const API_PROFILE = `https://api.github.com/users/${username}`;

// T O K E N
const options = {
  method: "GET",
  headers: {
    Authorization: "API_KEY",
  },
};
// D O M - S E L E C T O R S
const userProfile = document.getElementById("userProfile");
const projects = document.getElementById("projects");

// P R O F I L E
const fetchProfile = () => {
  fetch(API_PROFILE, options)
    .then((res) => res.json())
    .then((data) => {
      userProfile.innerHTML += `
                <img src="${data.avatar_url}" class ="pic"></img>
                <h2>${data.name} </h2>   
                <h3><a href="https://github.com/lisabergstrom">${data.login}</a></h3>
                    
`;
    });
};

// R E P O S
const fetchRepositories = () => {
  fetch(API_REPOS, options)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      const forkedRepos = data.filter(
        (repo) => repo.fork && repo.name.startsWith("project-")
      );

      forkedRepos.forEach((repo) => {
        projects.innerHTML += `
  <div class="repos">
  <a href="${repo.html_url}">
  <h3>${repo.name} <br> </h3>
  <p> Latest push: ${new Date(repo.pushed_at).toLocaleString("sv-SE", {
    dateStyle: "short",
  })} </p>
  <p> Deafult branch: ${repo.default_branch} <p/>
  <p id="commit-${repo.name}">Commits:</p>
  </a>
  </div>
  `;
      });

      fetchPullRequestsArray(forkedRepos);

      drawChart(forkedRepos.length);
    });
};

const fetchPullRequestsArray = (allRepositories) => {
  allRepositories.forEach((repo) => {
    const PULL_URL = `https://api.github.com/repos/Technigo/${repo.name}/pulls?per_page=100`;

    fetch(PULL_URL, options)
      .then((res) => res.json())
      .then((data) => {
        const myPullRequest = data.find(
          (pull) => pull.user.login === repo.owner.login
        );
        console.log(myPullRequest);

        if (myPullRequest) {
          fetchCommits(myPullRequest.commits_url, repo.name);
        } else {
          document.getElementById(`commit-${repo.name}`).innerHTML =
            "No pull requests made";
        }
      });
  });
};

const fetchCommits = (myCommitsUrl, myRepoName) => {
  fetch(myCommitsUrl, options)
    .then((res) => res.json())
    .then((data) => {
      document.getElementById(`commit-${myRepoName}`).innerHTML += data.length;
    });
};

fetchProfile();
fetchRepositories();
