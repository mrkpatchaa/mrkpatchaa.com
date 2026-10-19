// Run: node --test scripts/__tests__/*.test.mjs
// Runs the real scripts as the workflow does (`node scripts/<name>.mjs`), with GitHub replaced by fake-github.mjs.
import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import fs from 'node:fs'
import http from 'node:http'
import os from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const FAKE = path.join(here, 'fake-github.mjs')
const HEAD = '/*----\nslug: digest-week-202642\nexcerpt: x\ntags: Digest\n----*/'
const entry = (title, link, description) => `\nㅤ\n### [${title}](${link})\n${description}`

// A fresh folder per run: the scripts read and write ./.env in their working directory.
function workspace({ issues = [{ number: 42, title: 'Digest', body: HEAD }], fail = {}, env = '' } = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'digest-test-'))
  fs.writeFileSync(path.join(dir, 'state.json'), JSON.stringify({ issues, fail }))
  if (env) fs.writeFileSync(path.join(dir, '.env'), env)
  return dir
}

function run(script, dir, vars) {
  const env = {
    PATH: process.env.PATH,
    GH_TOKEN: 'fake-token',
    FAKE_GH_STATE: path.join(dir, 'state.json'),
    FAKE_GH_LOG: path.join(dir, 'log.jsonl'),
    ...vars,
  }
  const args = ['--import', FAKE, path.join(here, '..', script)]
  fs.writeFileSync(env.FAKE_GH_LOG, '')
  return new Promise((resolve) => {
    execFile(process.execPath, args, { cwd: dir, env, timeout: 30_000 }, (error, stdout, stderr) => {
      const calls = fs.readFileSync(env.FAKE_GH_LOG, 'utf8').split('\n').filter(Boolean).map(JSON.parse)
      const state = JSON.parse(fs.readFileSync(env.FAKE_GH_STATE, 'utf8'))
      resolve({ code: error ? (error.code ?? 1) : 0, stdout, stderr, calls, state })
    })
  })
}
const addLink = (dir, vars) => run('add-link-to-week-digest.mjs', dir, vars)
const createDigest = (dir, vars) => run('create-week-digest.mjs', dir, vars)
const keys = (result) => result.calls.map((c) => c.key)

test('add-link-to-week-digest: exit codes, duplicate check and the written line', async (t) => {
  const pages = http.createServer((req, res) => {
    res.setHeader('content-type', 'text/html')
    if (req.url === '/titled') {
      res.end('<html><head><title>Page &amp; <b>T</b></title><meta name="description" content="D [x]"></head></html>')
    } else if (req.url === '/missing') {
      res.statusCode = 404
      res.end('<html><head><title>Not found</title></head></html>')
    } else res.end('<html><head></head><body>no title</body></html>')
  })
  await new Promise((resolve) => pages.listen(0, '127.0.0.1', resolve))
  const site = `http://127.0.0.1:${pages.address().port}`
  // A port that refuses connections: open a server, note its port, close it.
  const closed = http.createServer()
  await new Promise((resolve) => closed.listen(0, '127.0.0.1', resolve))
  const deadPort = closed.address().port
  await new Promise((resolve) => closed.close(resolve))
  t.after(() => pages.close())
  const withIssue = 'ISSUE_NUMBER=42'

  await t.test('a bad link exits 1 before any GitHub call', async () => {
    const long = 'https://example.com/' + 'a'.repeat(1981)
    for (const LINK of ['javascript:alert(1)', 'ftp://example.com/x', 'not a url', '', long]) {
      const r = await addLink(workspace({ env: withIssue }), { LINK, TITLE: 't' })
      assert.equal(r.code, 1, `exit code for ${JSON.stringify(LINK.slice(0, 40))}`)
      assert.deepEqual(r.calls, [], `GitHub calls for ${JSON.stringify(LINK.slice(0, 40))}`)
    }
  })

  await t.test('a link of exactly 2,000 characters is accepted', async () => {
    const LINK = 'https://example.com/' + 'a'.repeat(1980)
    const r = await addLink(workspace({ env: withIssue }), { LINK, TITLE: 't' })
    assert.equal(r.code, 0, r.stderr)
    assert.ok(r.state.issues[0].body.endsWith(entry('t', LINK, 't')))
  })

  await t.test('no ISSUE_NUMBER, an empty issue body, or a GitHub error exits 1 with no update', async () => {
    const cases = [
      [workspace(), 'no ISSUE_NUMBER'],
      [workspace({ env: withIssue, issues: [{ number: 42, title: 'Digest', body: null }] }), 'empty body'],
      [workspace({ env: withIssue, fail: { 'GET /issues/42': 401 } }), 'GET 401'],
      [workspace({ env: withIssue, fail: { 'PATCH /issues/42': 500 } }), 'PATCH 500'],
    ]
    for (const [dir, name] of cases) {
      const r = await addLink(dir, { LINK: 'https://example.com/x', TITLE: 't' })
      assert.equal(r.code, 1, name)
      assert.ok(!r.state.issues.some((i) => i.body && i.body.includes('example.com/x')), name)
    }
  })

  await t.test('the line is written as the spec gives it, with ( ) encoded and quotes kept', async () => {
    const dir = workspace({ env: withIssue })
    const r = await addLink(dir, { LINK: 'https://example.com/a_(b)', TITLE: 'a"; echo pwned; "b', DESCRIPTION: 'd' })
    assert.equal(r.code, 0, r.stderr)
    assert.equal(r.state.issues[0].body, HEAD + entry('a"; echo pwned; "b', 'https://example.com/a_%28b%29', 'd'))
  })

  await t.test('the same link twice is written once and the second run exits 0', async () => {
    const dir = workspace({ env: withIssue })
    const first = await addLink(dir, { LINK: 'https://example.com/a_(b)', TITLE: 't' })
    const second = await addLink(dir, { LINK: 'https://example.com/a_(b)', TITLE: 'other title' })
    assert.equal(first.code, 0, first.stderr)
    assert.equal(second.code, 0, second.stderr)
    assert.match(second.stdout, /already in the digest/)
    assert.deepEqual(keys(second), ['GET /issues/42'])
    assert.equal(second.state.issues[0].body, HEAD + entry('t', 'https://example.com/a_%28b%29', 't'))
  })

  await t.test('a link quoted in an earlier description is not taken for a duplicate', async () => {
    const dir = workspace({ env: withIssue })
    await addLink(dir, {
      LINK: 'https://example.com/post',
      TITLE: 'Post',
      DESCRIPTION: 'via [a](https://example.com/x)',
    })
    const r = await addLink(dir, { LINK: 'https://example.com/x', TITLE: 'X' })
    assert.equal(r.code, 0, r.stderr)
    assert.ok(r.state.issues[0].body.includes('### [X](https://example.com/x)'), `body: ${r.state.issues[0].body}`)
  })

  await t.test('no usable text fetches the page and cleans its title and description', async () => {
    const dir = workspace({ env: withIssue })
    const r = await addLink(dir, { LINK: `${site}/titled`, TITLE: '[]()', DESCRIPTION: '' })
    assert.equal(r.code, 0, r.stderr)
    const title = 'Page &amp; &lt;b&gt;T&lt;/b&gt;'
    assert.equal(r.state.issues[0].body, HEAD + entry(title, `${site}/titled`, 'D \\[x\\]'))
  })

  await t.test('a fetch error, a non-2xx page or a page with no text exits 1 with no update', async () => {
    for (const LINK of [`http://127.0.0.1:${deadPort}/`, `${site}/missing`, `${site}/empty`]) {
      const r = await addLink(workspace({ env: withIssue }), { LINK })
      assert.equal(r.code, 1, LINK)
      assert.deepEqual(keys(r), ['GET /issues/42'], LINK)
    }
  })

  await t.test('a description with no title takes the hostname as the title', async () => {
    const r = await addLink(workspace({ env: withIssue }), { LINK: 'https://Example.COM/p', DESCRIPTION: 'd' })
    assert.equal(r.code, 0, r.stderr)
    assert.ok(r.state.issues[0].body.endsWith(entry('example.com', 'https://example.com/p', 'd')))
  })
})

test('create-week-digest: link check first, exit 1 on errors, ISSUE_NUMBER handed to add-link through .env', async (t) => {
  await t.test('a bad link creates nothing and exits 1 before any GitHub call', async () => {
    const dir = workspace({ issues: [] })
    const r = await createDigest(dir, { LINK: 'javascript:alert(1)' })
    assert.equal(r.code, 1)
    assert.deepEqual(r.calls, [])
    assert.ok(!fs.existsSync(path.join(dir, '.env')))
  })

  await t.test('a list error, a create error or a .env write error exits 1', async () => {
    const envIsFolder = workspace({ issues: [] })
    fs.mkdirSync(path.join(envIsFolder, '.env'))
    const cases = [
      [workspace({ fail: { 'GET /issues': 500 } }), 'list 500'],
      [workspace({ issues: [], fail: { 'POST /issues': 422 } }), 'create 422'],
      [envIsFolder, '.env append fails'],
    ]
    for (const [dir, name] of cases) {
      const r = await createDigest(dir, { LINK: 'https://example.com/x' })
      assert.equal(r.code, 1, `${name}: ${r.stderr}`)
    }
  })

  await t.test('a new week creates one issue and add-link writes into it', async () => {
    const dir = workspace({ issues: [] })
    const created = await createDigest(dir, { LINK: 'https://example.com/x' })
    assert.equal(created.code, 0, created.stderr)
    assert.deepEqual(keys(created), ['GET /issues', 'POST /issues'])
    const added = await addLink(dir, { LINK: 'https://example.com/x', TITLE: 't' })
    assert.equal(added.code, 0, added.stderr)
    assert.equal(added.state.issues.length, 1)
    assert.ok(added.state.issues[0].body.endsWith(entry('t', 'https://example.com/x', 't')))
  })

  await t.test('an existing week issue is reused, not created again', async () => {
    const dir = workspace({ issues: [] })
    await createDigest(dir, { LINK: 'https://example.com/x' })
    fs.rmSync(path.join(dir, '.env'))
    const r = await createDigest(dir, { LINK: 'https://example.com/y' })
    assert.equal(r.code, 0, r.stderr)
    assert.deepEqual(keys(r), ['GET /issues'])
    assert.equal(r.state.issues.length, 1)
    assert.match(fs.readFileSync(path.join(dir, '.env'), 'utf8'), /^ISSUE_NUMBER=100$/m)
  })
})
