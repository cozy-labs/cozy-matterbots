# cozy-matterbots
Bots Mattermost pour l'équipe Cozy

## Meta - Pull Request

This GH Action posts to the `Meta - Pull Request` channel and list the current PRs summary for the [cozy](https://github.com/cozy) organisation

To run it in local, run `GITHUB_API_KEY=XXX MATTERMOST_META_PULL_REQUESTS_HOOK=YYY yarn bot_pull_request`

Where:
- `XXX` is a Github token with the following rights:
  - `repo:status`
  - `public_repo`
  - `read:org`
- `YYY` is a Mattermost hook URL to the `Meta - Pull Request` channel

### Output .md files instead of sending to mattermost

For debugging purpose you can set env variable `INPUT_MATTERMOST_TO_FILE=true` to output summary into .md files instead of mattermost

```
GITHUB_API_KEY=XXX INPUT_MATTERMOST_TO_FILE=true yarn bot_pull_request
```

> **Warning**
> In this configuration, the CI will willingly fail as the `getLatestExecutionSuccessDate` is used to get the last CI success when the result has been sent to Mattermost 

### Fixtures

You can use Fixtures by commenting `prJson` and `membersJson` comments in `index.js`
