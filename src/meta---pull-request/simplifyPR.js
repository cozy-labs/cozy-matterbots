export const simplifyPR = (pull) => {
  return {
    url: pull.html_url,
    title: pull.title,
    user: pull.user.login,
    created_at: pull.created_at,
    closed_at: pull.closed_at,
    repository: pull.repository_url.split('/').pop(),
    draft: pull.draft,
  }
}
