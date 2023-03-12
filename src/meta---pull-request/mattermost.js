import axios from 'axios'
import fs from 'fs/promises'

let fileIndex = 1

const writeResult = async (fileName, content) => {
  await fs.mkdir('./temp/', { recursive: true })

  const filePath = `./temp/${fileName}`

  return await fs.writeFile(filePath, content)
}

export const sendToMattermost = async (title, content) => {
  if (process.env.INPUT_MATTERMOST_TO_FILE === 'true') {
    return await writeResult(`${fileIndex++}_${title}.md`, content)
  }

  return await axios({
    method: 'post',
    url: process.env.MATTERMOST_META_PULL_REQUESTS_HOOK,
    data: {
      text: content,
      username: `pr-bot - ${title}`,
      icon_emoji: 'robot'
    }
  })
}
