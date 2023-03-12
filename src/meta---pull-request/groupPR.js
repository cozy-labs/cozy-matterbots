import { simplifyPR } from './simplifyPR.js'

const isBot = (login) => {
  return login.includes('[bot]')
}

export const regroupPulls = (pulls, members) => {
  const memberLogins = members.map(member => member.login)

  const undraftPulls = pulls.filter(pull => !pull.draft)

  const inOrg = undraftPulls.filter(pull => {
    return memberLogins.includes(pull.user.login)
  }).map(simplifyPR)
    .sort((a, b) => a.created_at - b.created_at)

  const outOrg = undraftPulls.filter(pull => {
    return !memberLogins.includes(pull.user.login) && !isBot(pull.user.login)
  }).map(simplifyPR)

  const bots = undraftPulls.filter(pull => {
    return !memberLogins.includes(pull.user.login) && isBot(pull.user.login)
  }).map(simplifyPR)

  const botNames = bots
    .map(pull => pull.user.replace('[bot]', ''))

  return {
    inOrg, outOrg, bots, botNames: [...new Set(botNames)]
  }
}

export const filterPulls = (pulls) => {
  const filteredPulls = pulls.filter(pull => {
    return !isBot(pull.user.login)
  }).map(simplifyPR)

  return filteredPulls
}
