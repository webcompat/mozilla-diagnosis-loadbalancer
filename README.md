# mozilla-diagnosis-loadbalancer

A GitHub action assigning web-bugs in needsdiagnosis fairly accross Mozilla team members. Unless you're an administating member of Mozilla's Web Compatibility team, this repo isn't too interesting for you. :)

## Setup

In the `web-bugs` repo, a new GitHub Action workflow that runs on all issue's `milestoned` event needs to be set up. For that, create `.github/workflows/mozilla-diagnosis-loadbalancer.yml` with

```yml
on:
  issues:
    types: [milestoned]

jobs:
  mozilla_diagnosis_loadbalancer:
    runs-on: ubuntu-latest
    name: Assign a Mozilla team member for diagnosis
    steps:
      - name: Assign Mozilla team member
        uses: webcompat/mozilla-diagnosis-loadbalancer@v1.0.1
```

In addition, make sure the configuration file (see below) exists.

## Configuration

Configuration happens inside the `web-bugs` repo, in a file at `.github/mozilla-diagnosis-loadbalancer.yml`. Here's an example with all available flags:

```yml
# Parameters for automatically assigning a Mozilla team member for issues in
# need of diagnosis, see https://github.com/webcompat/mozilla-diagnosis-loadbalancer

# Allow-list of labels Mozilla team members can look at.
actionable_labels:
  - browser-android-components
  - browser-fenix
  - browser-firefox
  - browser-firefox-esr
  - browser-firefox-focus
  - browser-firefox-ios
  - browser-firefox-mobile
  - browser-firefox-reality
  - browser-firefox-tablet
  - browser-focus-geckoview

# List of Mozilla diagnosis team members, along with their workload-weight
# and diagnosis capabilities.
diagnosers:
  - username: denschub
    weight: 125
    capabilities:
      - android
      - ios
      - virtual_reality
  - username: karlcow
    weight: 75
    capabilities:
      - android
      - ios
  - username: ksy36
    weight: 100
    capabilities:
      - android
      - ios
  - username: wisniewskit
    weight: 100
    capabilities:
      - android
      - virtual_reality

# A list of per-label capability filters to avoid assigning issues to team
# members without required hardware to test. Each entry contains a list of
# affected labels, as well as a list of required capabilities.
capabilities_filter:
  - labels:
      - browser-android-components
      - browser-fenix
      - browser-firefox-focus
      - browser-firefox-mobile
      - browser-firefox-tablet
      - browser-focus-geckoview
    capability: android

  - labels:
      - browser-firefox-ios
    capability: ios

  - labels:
      - browser-firefox-reality
    capability: virtual_reality

# For debugging only: leave a comment instead of assignign issues.
comment_instead_of_assigning: false
```

## Development

All source files are located inside `src`. Since GitHub doesn't run `npm install` for actions, we can either always check in the `node_modules` directory, or have a dedicated build script. Since checking in the `node_modules` folder is a bit dirty, this repo uses `ncc` to build all dependencies into a single JS file.

After you changed sources and want to release a new version, run `npm run build`, which updates the files inside the `dist` folder. The GitHub action is set up to only look at the `dist/index.js`, so changes won't be in effect without that step.

In addition, the workflow definition allows for a semver-based version lock. For that to work, the version needs to be tagged and released via GitHub's Release feature.

## License

MPL-2.0.
