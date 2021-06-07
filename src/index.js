const core = require("@actions/core");
const github = require("@actions/github");

const GithubApi = require("./github_api");
const Helpers = require("./helpers");

async function run() {
  try {
    const repo = github.context.repo;
    const issue = github.context.payload.issue;

    if (!Helpers.isInDiagnsosisQueue(issue)) {
      console.log("Issue is not in diagnosis queue, skipping.");
      return;
    }

    if (Helpers.isAssigned(issue)) {
      console.log("Issue is already assigned, skipping.");
      return;
    }

    const token = core.getInput("repo-token", { required: true });
    const client = github.getOctokit(token);
    const config = await GithubApi.getConfig(client, repo);

    if (!Helpers.isActionableIssue(issue, config)) {
      console.log("Issue is not actionable for Mozilla staff, skipping.");
      return;
    }

    let availableDiagnosers = config.diagnosers;

    const requiredCapabilities = Helpers.getRequiredCapabilities(issue, config);
    if (requiredCapabilities.length > 0) {
      console.log(`Issue needs special diagnosis capabilities: ${requiredCapabilities.join(", ")}.`);
      availableDiagnosers = availableDiagnosers.filter((diagnoser) => {
        return requiredCapabilities.every((requirement) => diagnoser.capabilities.includes(requirement));
      });
    }

    let assignee = Helpers.getWeightedRandomDiagnoser(availableDiagnosers);

    console.log({
      issue,
      config,
      requiredCapabilities,
      availableDiagnosers,
      assignee,
    });

    if (config.comment_instead_of_assigning) {
      await GithubApi.leaveComment(client, repo, issue, assignee.username);
    } else {
      await GithubApi.assignIssue(client, repo, issue, assignee.username);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
