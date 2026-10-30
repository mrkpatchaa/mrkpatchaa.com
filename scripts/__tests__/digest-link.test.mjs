// Run: node --test scripts/__tests__/*.test.mjs
import assert from 'node:assert/strict'
import { test } from 'node:test'

import { remark } from 'remark'
import html from 'remark-html'

import { checkLink, cleanDescription, cleanTitle, cutDescription } from '../digest-link.mjs'

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
  const description = cleanDescription(rawDescription) || cutDescription(title)
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

test('a backtick is escaped in the title and the description', () => {
  assert.equal(cleanTitle('a`b'), 'a\\`b')
  assert.equal(cleanDescription('a`b'), 'a\\`b')
})

test('cutDescription cuts at 500 characters on whole graphemes', () => {
  const a = (n) => 'a'.repeat(n)
  // A 4-code-unit emoji with a skin-tone modifier is kept whole or dropped whole.
  const emoji = cutDescription(a(499) + '\u{1F44D}\u{1F3FD}')
  assert.equal(emoji, a(499))
  assert.ok(emoji.isWellFormed())
  // e + combining acute accent is one grapheme.
  assert.equal(cutDescription(a(499) + 'e\u0301'), a(499))
  assert.equal(cutDescription(a(500)), a(500))
  assert.equal(cutDescription(a(501)), a(500))
})

test('cutDescription on long text with entities, escapes, emoji and combining marks keeps every rule', async () => {
  // Already-clean tokens: entities and escapes as cleanDescription/cleanTitle write them, plus multi-code-unit
  // graphemes (ZWJ family, flags, skin tone, VS16, keycap, combining marks, French and Kabiyè letters).
  const clean = ['&amp;', '&lt;', '&gt;', '\\[', '\\]', '\\`', '\\\\', 'a', ' ', ';', '&amp;\u0301', '\\[\u0301']
  clean.push('👨‍👩‍👧‍👦', '🇫🇷', '🇹🇬', '👍🏽', '❤️', '1️⃣', 'e\u0301', 'ɛ̀', 'ɔ́', 'ʊ̃', 'ç', 'œ')
  const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' })
  const random = mulberry32(20261020)
  const any = (list) => list[Math.floor(random() * list.length)]
  const problems = []
  for (let i = 0; i < 2000; i++) {
    let text = 'a'
    const target = 490 + (i % 31)
    while (text.length < target) text += any(clean)
    const out = cutDescription(text)
    const boundaries = new Set([0, ...[...segmenter.segment(text)].map((s) => s.index), text.length])
    const longest = Math.max(...[...boundaries].filter((b) => b <= 500))
    const why = []
    if (text.length <= 500 && out !== text) why.push('short text changed')
    if (out.length > 500) why.push('longer than 500')
    if (!out.isWellFormed()) why.push('lone surrogate')
    if (!text.startsWith(out)) why.push('not a prefix')
    if (!boundaries.has(out.length)) why.push('ends inside a grapheme')
    if (/&[a-z]*$/.test(out)) why.push('ends inside an entity')
    if (out.match(/\\*$/)[0].length % 2) why.push('ends on a lone backslash')
    // At most a partial entity (4 code units) and the spaces before it are dropped after the grapheme cut.
    if (out.length < text.slice(0, Math.max(0, longest - 4)).trimEnd().length) why.push('cut too much')
    if (why.length)
      problems.push(`${why.join(', ')} | in=${JSON.stringify(text.slice(480))} out=${JSON.stringify(out.slice(480))}`)
  }

  // Raw long hostile text through the clean + cut + render path, as a description and as the title fallback.
  const raw = ['[', ']', '(', ')', '\\', '&', '<', '>', '*', '/', '----', '`', 'a', ' ', '\n', '👨‍👩‍👧‍👦', '🇹🇬', 'e\u0301']
  for (let i = 0; i < 300; i++) {
    let text = ''
    while (text.length < 150 + i) text += any(raw)
    for (const found of [
      ...(await problemsWith('t', 'https://example.com/a', text)),
      ...(await problemsWith(text, 'https://example.com/a', '')),
    ]) {
      problems.push(`[render ${i}] ${found}`)
    }
  }
  assert.deepEqual(problems.slice(0, 8), [], `${problems.length} problem(s), first 8 listed`)
})

test('checkLink refuses any userinfo, accepts @ outside the authority and normalizes the scheme', () => {
  for (const link of [
    'https://user:pass@example.com/',
    'https://user@example.com/',
    'https://:pass@example.com/',
    'https://user:@example.com/',
    'https://%75ser@example.com/',
    'https://%40@example.com/',
    'HTTPS://USER@EXAMPLE.COM/',
    'http://user@example.com:8080/',
    'https://google.com@evil.example/',
  ]) {
    assert.throws(() => checkLink(link), /username or password/, link)
  }
  // An @ in the path (Medium profile links), query or fragment is not userinfo.
  assert.equal(checkLink('https://medium.com/@user/post'), 'https://medium.com/@user/post')
  assert.equal(checkLink('https://example.com/?q=a@b'), 'https://example.com/?q=a@b')
  assert.equal(checkLink('https://example.com/#a@b'), 'https://example.com/#a@b')
  // A backslash ends the authority in http(s): the host is google.com, the @ moves into the path.
  assert.equal(checkLink('https://google.com\\@evil.example/'), 'https://google.com/@evil.example/')
  // An empty userinfo is dropped by new URL, so the written link holds no @.
  assert.equal(checkLink('https://:@example.com/'), 'https://example.com/')
  assert.equal(checkLink('https://@example.com/'), 'https://example.com/')
  assert.equal(checkLink('HTTPS://example.com/'), 'https://example.com/')
})

test('checkLink drops tracking parameters and keeps the ones that name the page, in order', () => {
  assert.equal(
    checkLink(
      'https://charpeni.com/blog/post?ck_subscriber_id=1866546960&utm_source=convertkit&utm_campaign=%E2%9A%9B'
    ),
    'https://charpeni.com/blog/post'
  )
  assert.equal(
    checkLink('https://www.youtube.com/watch?utm_medium=email&v=abc&fbclid=x&t=42#c'),
    'https://www.youtube.com/watch?v=abc&t=42#c'
  )
  assert.equal(checkLink('https://x.com/user/status/1?s=20&t=abc'), 'https://x.com/user/status/1')
  assert.equal(checkLink('https://example.com/?q=a%20b&UTM_SOURCE=x'), 'https://example.com/?q=a%20b')
})
