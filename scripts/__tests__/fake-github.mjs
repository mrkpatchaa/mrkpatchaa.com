// Preload for the digest script tests: `node --import ./fake-github.mjs <script>`.
// It replaces globalThis.fetch (the fetch Octokit uses) with a fake GitHub REST API kept in a JSON file.
// FAKE_GH_STATE: path of { issues: [{ number, title, body }], fail: { 'GET /issues/42': 401 } }
// FAKE_GH_LOG: path of a file that gets one JSON line per request.
// Any other host fails, so the scripts reach no real GitHub. Page fetches use node-fetch and are not affected.
import fs from 'node:fs'

const REPO_PATH = '/repos/mrkpatchaa/mrkpatchaa.com'

const json = (status, data) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8' } })

globalThis.fetch = async (input, init = {}) => {
  const url = new URL(typeof input === 'string' ? input : input.url)
  const method = (init.method || 'GET').toUpperCase()
  if (url.hostname !== 'api.github.com') throw new Error(`fake-github: blocked request to ${url.href}`)

  const statePath = process.env.FAKE_GH_STATE
  const state = JSON.parse(fs.readFileSync(statePath, 'utf8'))
  const path = url.pathname.startsWith(REPO_PATH) ? url.pathname.slice(REPO_PATH.length) : url.pathname
  const key = `${method} ${path}`
  const body = init.body ? JSON.parse(init.body) : undefined
  fs.appendFileSync(process.env.FAKE_GH_LOG, JSON.stringify({ key, query: url.search, body }) + '\n')

  const failStatus = state.fail?.[key]
  if (failStatus) return json(failStatus, { message: `fake failure ${failStatus}` })

  const save = () => fs.writeFileSync(statePath, JSON.stringify(state))
  const issueMatch = path.match(/^\/issues\/(\d+)$/)

  if (key === 'GET /issues') return json(200, state.issues)
  if (key === 'POST /issues') {
    const issue = { number: 100 + state.issues.length, title: body.title, body: body.body }
    state.issues.push(issue)
    save()
    return json(201, { ...issue, html_url: `https://github.com/x/${issue.number}` })
  }
  if (issueMatch) {
    const issue = state.issues.find((i) => i.number === Number(issueMatch[1]))
    if (!issue) return json(404, { message: 'Not Found' })
    if (method === 'GET') return json(200, issue)
    if (method === 'PATCH') {
      issue.body = body.body
      save()
      return json(200, issue)
    }
  }
  return json(500, { message: `fake-github: no route for ${key}` })
}
