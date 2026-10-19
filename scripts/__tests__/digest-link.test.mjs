// Run: node --test scripts/__tests__/*.test.mjs
import assert from 'node:assert/strict'
import { test } from 'node:test'

import { remark } from 'remark'
import html from 'remark-html'

import { checkLink, cleanDescription, cleanTitle } from '../digest-link.mjs'

// Same pipeline as lib/markdownToHtml.ts and the same greedy regex as lib/api.ts.
const METADATA = /(\/\*----)([\s\S]*)(----\*\/)/
const render = async (markdown) => String(await remark().use(html, { sanitize: false }).process(markdown))
const ISSUE_HEAD = '/*----\nslug: digest-week-202642\nexcerpt: Weekly digest.\ntags: Digest\n----*/'
// Tags remark-html makes from Markdown alone. Anything else is raw HTML that got through.
const MARKDOWN_TAGS = new Set(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'em', 'strong', 'code', 'pre'])
for (const tag of ['ul', 'ol', 'li', 'hr', 'br', 'blockquote']) MARKDOWN_TAGS.add(tag)

// Build the digest entry the way add-link-to-week-digest.mjs does, then list what breaks.
async function problemsWith(rawTitle, rawLink, rawDescription) {
  let link
  try {
    link = checkLink(rawLink)
  } catch {
    return []
  }
  let title = cleanTitle(rawTitle)
  const description = cleanDescription(rawDescription) || title
  if (!title && !description) return []
  if (!title) title = new URL(link).hostname
  const body = `${ISSUE_HEAD}\nㅤ\n### [${title}](${link})\n${description}`

  const problems = []
  if (body.match(METADATA)[2] !== ISSUE_HEAD.match(METADATA)[2]) problems.push('digest text moved into the metadata')
  const out = await render(body.replace(METADATA, ''))
  const linkHref = (await render(`[x](${link})`)).match(/href="([^"]*)"/)[1]
  for (const [, href] of out.matchAll(/href="([^"]*)"/g)) {
    if (href !== linkHref) problems.push(`foreign href ${href}`)
  }
  for (const [, tag] of out.matchAll(/<([a-zA-Z][\w-]*)/g)) {
    if (!MARKDOWN_TAGS.has(tag.toLowerCase())) problems.push(`raw HTML tag <${tag}>`)
  }
  if (description.length > 500) problems.push('description longer than 500')
  if (/&[a-z#0-9]*$/.test(description)) problems.push('description ends inside an entity')
  return problems.map(
    (p) =>
      `${p} | title=${JSON.stringify(rawTitle)} link=${JSON.stringify(rawLink)} ` +
      `description=${JSON.stringify(rawDescription)} | html=${JSON.stringify(out)}`
  )
}

// Small seeded PRNG so a failure prints the same inputs on every run.
function mulberry32(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

test('hostile title, description or link renders no raw HTML, no foreign link and no metadata shift', async () => {
  const fixed = [
    // Spec 3, Done means: must hold.
    ['<img src=x onerror=alert(1)>', 'https://example.com/digest-test-1', '[x](https://evil.example) ----*/'],
    ['a"; echo pwned; "b', 'https://example.com/a_(b)', ''],
    ['<script>alert(1)</script>', 'https://example.com/a', '<iframe src=//evil.example>'],
    ['t', 'https://example.com/a', '&#60;img src=x onerror=alert(1)&#62;'],
    ['t', 'https://example.com/a', '[x]: https://evil.example'],
    ['t', 'https://example.com/a', '![x](https://evil.example/i.png)'],
    ['t', 'https://example.com/a', '/*/*--------*/*/ slug: hijack'],
    ['t', 'https://example.com/a', 'x\r\n\r\n----*/\r\nslug: hijack'],
    // A backslash before the escaped bracket cancels the escape: \[ becomes \\[.
    ['t', 'https://example.com/a', '\\[x\\](https://evil.example)'],
    ['t', 'https://example.com/a', '\\[click\\](javascript:alert(1))'],
    // Removing ( ) [ ] from the title after the marker removal rebuilds a marker.
    ['----(*/', 'https://example.com/a', 'd'],
    ['x ----[]*/ y', 'https://example.com/a', 'd'],
    // The link is not cleaned of the metadata markers.
    ['t', 'https://example.com/----*/', 'd'],
    // 500-character cut next to an entity and a split \[.
    ['t', 'https://example.com/a', 'a'.repeat(497) + '&&&&'],
    ['t', 'https://example.com/a', 'a'.repeat(499) + '[[[['],
  ]
  const problems = []
  for (const [title, link, description] of fixed) problems.push(...(await problemsWith(title, link, description)))

  // Randomised: short strings over the characters that matter to Markdown, HTML and the metadata regex.
  const alphabet = [
    '[',
    ']',
    '(',
    ')',
    '\\',
    '&',
    '<',
    '>',
    '*',
    '/',
    '-',
    '----',
    ':',
    '`',
    '!',
    'a',
    ' ',
    '\n',
    'js:',
  ]
  const random = mulberry32(20261019)
  const pick = (n) => Array.from({ length: n }, () => alphabet[Math.floor(random() * alphabet.length)]).join('')
  for (let i = 0; i < 1500; i++) {
    const found = await problemsWith(pick(1 + (i % 12)), `https://example.com/${pick(i % 6)}`, pick(1 + (i % 20)))
    problems.push(...found.map((p) => `[random ${i}] ${p}`))
  }

  assert.deepEqual(problems.slice(0, 12), [], `${problems.length} problem(s), first 12 listed`)
})
