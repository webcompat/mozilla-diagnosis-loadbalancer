const yaml = require("js-yaml");

export async function getConfig(githubClient, repo) {
  try {
    const result = await githubClient.rest.repos.getContent({
      owner: repo.owner,
      repo: repo.repo,
      path: ".github/mozilla-diagnosis-loadbalancer.yml",
    });
    const configText = Buffer.from(result.data.content, "base64").toString();
    return yaml.load(configText);
  } catch (error) {
    core.setFailed("'.github/mozilla-diagnosis-loadbalancer.yml' not found!");
    throw error;
  }
}

export async function assignIssue(githubClient, repo, issue, assignee) {
  await githubClient.rest.issues.addAssignees({
    owner: repo.owner,
    repo: repo.repo,
    issue_number: issue.number,
    assignees: [assignee],
  });
}

export async function leaveComment(githubClient, repo, issue, assignee) {
  await githubClient.rest.issues.createComment({
    owner: repo.owner,
    repo: repo.repo,
    issue_number: issue.number,
    body: `This issue looks like something for @${assignee}...`,
  });
}
