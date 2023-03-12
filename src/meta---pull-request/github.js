import { Octokit } from '@octokit/rest'

const octokit = new Octokit({
  auth: process.env.GITHUB_API_KEY
})

export const fetchOrgMembers = async (org) => {
  const { data: members } = await octokit.rest.orgs.listMembers({
    org,
  })

  return members
}

const fetchPRs = async (query) => {
  let pullRequest = []
  let pageRemaining = true
  let currentPage = 1

  while (pageRemaining) {
    console.log(`fetching page ${currentPage} for '${query}'`)
    const { data } = await octokit.rest.search.issuesAndPullRequests({
      q: query,
      per_page: 100,
      page: currentPage
    })

    const { total_count, items } = data
    pullRequest = [...pullRequest, ...items]

    console.log({ total_count })
    console.log({ fetched: items.length, total_fetched: pullRequest.length })

    pageRemaining = pullRequest.length < total_count
    currentPage++

    console.log({ pageRemaining })
    console.log('')
  }

  return pullRequest
}

export const fetchPRSearch = async (org) => {
  return fetchPRs(`is:open+is:pr+archived:false+user:${org}`)
}

export const fetchClosedPRSearch = async (org, afterDate, isMerged) => {
  const mergeFilter = isMerged ? 'is:merged' : 'is:unmerged'
  return fetchPRs(`is:closed+is:pr+archived:false+user:${org}+closed:>=${afterDate}+${mergeFilter}`)
}

export const getLatestExecutionSuccessDate = async (org, repo) => {
  const result = await octokit.rest.actions.listWorkflowRuns({
    owner: org,
    repo: repo,
    workflow_id: 'meta---pull-requests.yml',
    status: 'success',
    per_page: 1
  })

  const executionDate = result?.data?.workflow_runs?.[0]?.created_at || '2023-03-10T09:10:02Z'

  return executionDate
}
