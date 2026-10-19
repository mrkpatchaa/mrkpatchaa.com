import 'dotenv/config'

import { Octokit } from '@octokit/rest'
import * as cheerio from 'cheerio'

import { checkLink, cleanDescription, cleanTitle } from './digest-link.mjs'

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args))

const REPO = 'mrkpatchaa.com'
const REPO_OWNER = 'mrkpatchaa'

// Authenticate using a personal access token
const octokit = new Octokit({ auth: process.env.GH_TOKEN })

async function addLink() {
  // Throws on a bad link, before any GitHub call.
  const link = checkLink(process.env.LINK)

  if (!process.env.ISSUE_NUMBER) throw new Error('No ISSUE_NUMBER in .env')

  const {
    data: { body },
  } = await octokit.issues.get({
    owner: REPO_OWNER,
    repo: REPO,
    issue_number: process.env.ISSUE_NUMBER,
  })

  if (!body) throw new Error('No Issue found')

  if (body.includes(`](${link})`)) {
    console.log('already in the digest')
    return
  }

  let title = cleanTitle(process.env.TITLE)
  let description = cleanDescription(process.env.DESCRIPTION)
  if (!title && !description) {
    const response = await fetch(link, { signal: AbortSignal.timeout(10_000) })
    const html = await response.text()
    const $ = cheerio.load(html)

    title = cleanTitle($('head title').text())
    description = cleanDescription(
      $('head meta[name="description"]').attr('content') || $('head meta[property="og:description"]').attr('content')
    )
  }

  description = description || title
  // For some reason We couldn't get the title or description.
  // (Article behind a paywall like Medium, ...)
  if (!title && !description) throw new Error('No title or description for the link')
  if (!title) title = new URL(link).hostname

  // Update issue with new link
  await octokit.issues.update({
    owner: REPO_OWNER,
    repo: REPO,
    issue_number: process.env.ISSUE_NUMBER,
    body:
      body +
      `
ㅤ
### [${title}](${link})
${description}`,
  })
  // NOTE: The invisible space is very important
  console.log('Issue updated, link added')
}

addLink().catch((error) => {
  console.error('Error adding the link:', error.message || error)
  process.exitCode = 1
})
