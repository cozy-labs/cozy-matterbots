import formatDistanceToNow from 'date-fns/formatDistanceToNow/index.js'
import format from 'date-fns/format/index.js'
import frLocale from 'date-fns/locale/fr/index.js'

const HOURS = 1000 * 60 * 60
const DAYS = 24 * HOURS
const WEEKS = 7 * DAYS

const getDateString = (dateISOStr) => {
  const date = new Date(dateISOStr)

  return `il y a ${formatDistanceToNow(date, { locale: frLocale })}`
}

const getDateEmoji = (dateISOStr) => {
  const date = new Date(dateISOStr)
  const age = Date.now() - date

  if (age > 2 * WEEKS) {
    return ':skull:'
  } else if (age > 4 * DAYS) {
    return ':hot_face:'
  } else if (age > 4 * HOURS) {
    return ':neutral_face:'
  }

  return ':slightly_smiling_face:'
}

const formatPRList = pulls => {
  return pulls.map(pull => {
    const { title, repository, created_at, url, user } = pull
    const markdownUrl = `[${title}](${url})`
    const emoji = getDateEmoji(created_at)
    const date = getDateString(created_at)

    return `- ${emoji} [${repository}] ${markdownUrl} | par \`${user}\` | ${date}`
  }).join('\n')
}

const formatClosedPRList = (pulls, emoji) => {
  return pulls.map(pull => {
    const { title, repository, closed_at, url, user } = pull
    const markdownUrl = `[${title}](${url})`
    const date = getDateString(closed_at)

    return `- ${emoji} [${repository}] ${markdownUrl} | par \`${user}\` | ${date}`
  }).join('\n')
}

export const formatExternalPulls = (pulls) => {
  let output = ''

  output += '### PR externes'
  output += '\n\n'
  output += `${pulls.outOrg.length} PR ouvertes`
  output += '\n\n'
  output += formatPRList(pulls.outOrg)

  return output
}

export const formatInternalPulls = (pulls) => {
  let output = ''

  output += '### PR internes'
  output += '\n\n'
  output += `${pulls.inOrg.length} PR ouvertes`
  output += '\n\n'
  output += formatPRList(pulls.inOrg)

  return output
}

export const formatBotPulls = (pulls, org) => {
  const botURLs = pulls.botNames.map(bot =>
    `[${bot}](https://github.com/pulls?q=is%3Aopen+is%3Apr+archived%3Afalse+user%3A${org}+author%3Aapp%2F${bot})`
  )

  let output = ''

  output += '### PR de bots'
  output += '\n\n'
  output += `${pulls.bots.length} PR ouvertes: (${botURLs.join(', ')})`

  return output
}

export const formatClosedPulls = (mergedPulls, closedPulls, previousRunDateIsoStr) => {
  let output = ''

  const previousRun = format(
    new Date(previousRunDateIsoStr),
    'dd/MM/yyyy à HH:mm',
    { locale: frLocale }
  )

  output += `### PR mergées ou fermées depuis le dernier run (${previousRun})`
  output += '\n\n'
  output += `${mergedPulls.length} PR mergées`
  output += '\n\n'
  output += formatClosedPRList(mergedPulls, ':merged_pr:')
  output += '\n\n'
  output += `${closedPulls.length} PR fermées`
  output += '\n\n'
  output += formatClosedPRList(closedPulls, ':closed_pr:')

  return output
}

export const formatCurrentRunTitle = () => {
  const currentRun = format(new Date(), 'dd/MM/yyyy à HH:mm', { locale: frLocale })
  return `# Résumé du ${currentRun}`
}
