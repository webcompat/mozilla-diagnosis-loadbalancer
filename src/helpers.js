export function isInDiagnsosisQueue(issue) {
  return issue.milestone.title == "needsdiagnosis";
}

export function isAssigned(issue) {
  return issue.assignees.length > 0;
}

export function isActionableIssue(issue, config) {
  const labels = issue.labels.map((label) => label.name);
  return config.actionable_labels.some((label) => labels.includes(label));
}

export function getRequiredCapabilities(issue, config) {
  const labels = issue.labels.map((label) => label.name);
  let requirements = [];

  for (const requirement of config.capabilities_filter) {
    if (requirement.labels.some((requirementLabel) => labels.includes(requirementLabel))) {
      requirements.push(requirement.capability);
    }
  }

  return requirements;
}

// Rejection sampling might not be the fastest way to do this, but it's probably
// not the worst implementation for a weighted randomizer either...
export function getWeightedRandomDiagnoser(diagnosers) {
  let weightedIndexTable = [];
  diagnosers.forEach((diagnoser, index) => {
    for (let i = 0; i < diagnoser.weight; i++) {
      weightedIndexTable.push(index);
    }
  });

  let targetIndex = Math.floor(Math.random() * weightedIndexTable.length);
  return diagnosers[weightedIndexTable[targetIndex]];
}
