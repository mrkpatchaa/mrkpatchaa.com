// Shared checks for the week digest scripts.

const MAX_LINK_LENGTH = 2000
const MAX_DESCRIPTION_LENGTH = 500

// Accept only http(s) links of at most 2,000 characters. Throws with the reason.
export function checkLink(raw) {
  if (!raw) throw new Error('no link given')
  if (raw.length > MAX_LINK_LENGTH) throw new Error(`link is longer than ${MAX_LINK_LENGTH} characters`)
  let url
  try {
    url = new URL(raw)
  } catch {
    throw new Error(`link is not a valid URL: ${raw}`)
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new Error(`link protocol must be http or https, got ${url.protocol}`)
  }
  if (url.username || url.password) throw new Error('link must not contain a username or password')
  // No ( ) to break the Markdown link, no * to rebuild a ----*/ metadata marker.
  return url.href.replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A')
}

function escapeText(raw) {
  return (raw || '')
    .replace(/[\r\n]+/g, ' ')
    .replace(/\\/g, '\\\\')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/`/g, '\\`')
}

// Last step: repeat, because removing one marker can join the parts of another.
function removeMarkers(text) {
  while (/\/\*----|----\*\//.test(text)) text = text.replace(/\/\*----|----\*\//g, '')
  return text.trim()
}

export function cleanTitle(raw) {
  return removeMarkers(escapeText(raw).replace(/[[\]()]/g, ''))
}

export function cleanDescription(raw) {
  return cutDescription(removeMarkers(escapeText(raw).replace(/\[/g, '\\[').replace(/\]/g, '\\]')))
}

// Cut already-clean text to at most 500 characters (UTF-16 code units), on whole graphemes.
export function cutDescription(text) {
  if (text.length <= MAX_DESCRIPTION_LENGTH) return text
  let cut = ''
  for (const { segment } of new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(text)) {
    if (cut.length + segment.length > MAX_DESCRIPTION_LENGTH) break
    cut += segment
  }
  // Do not end inside an entity (&amp; &lt; &gt;).
  const amp = cut.lastIndexOf('&')
  if (amp > cut.lastIndexOf(';')) cut = cut.slice(0, amp)
  // Do not end on the backslash of a split \[ or \].
  if (/(^|[^\\])(\\\\)*\\$/.test(cut)) cut = cut.slice(0, -1)
  return cut.trim()
}
