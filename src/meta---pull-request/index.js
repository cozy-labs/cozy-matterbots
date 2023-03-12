import { fetchClosedPRSearch, fetchOrgMembers, fetchPRSearch, getLatestExecutionSuccessDate } from './github.js'
import { formatBotPulls, formatClosedPulls, formatCurrentRunTitle, formatExternalPulls, formatInternalPulls } from './formatPR.js'
import { filterPulls, regroupPulls } from './groupPR.js'
import { sendToMattermost } from './mattermost.js'

// Switch comment for using Fixtures
/*
import prJson from './fixtures/search.js'
import membersJson from './fixtures/members.js'
//*/

const querySearch = async () => {
  const org = 'cozy'

  // Switch comment for using Fixtures
  /*
  const members = membersJson
  const pulls = prJson
  /*/
  const members = await fetchOrgMembers(org)
  const pulls = await fetchPRSearch(org)
  //*/

  const groupedPulls = regroupPulls(pulls, members)

  const currentRun = formatCurrentRunTitle()
  await sendToMattermost(`New run`, currentRun)

  const externalPRs = formatExternalPulls(groupedPulls)
  await sendToMattermost('External PRs', externalPRs)

  const internalPRs = formatInternalPulls(groupedPulls)
  await sendToMattermost('Internal PRs', internalPRs)

  const botPRs = formatBotPulls(groupedPulls, org)
  await sendToMattermost('Bots PRs', botPRs)

  const previousRun = await getLatestExecutionSuccessDate('cozy-labs', 'cozy-matterbots')
  const mergedPulls = filterPulls(await fetchClosedPRSearch(org, previousRun, true))
  const closedPulls = filterPulls(await fetchClosedPRSearch(org, previousRun, false))
  const closedPRs = formatClosedPulls(mergedPulls, closedPulls, previousRun)
  await sendToMattermost('Previously', closedPRs)
}

querySearch()
