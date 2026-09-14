const HTML_CLASS =
  'inquiry-html text-sm text-stone-800 leading-relaxed break-words ' +
  '[&_h1]:text-base [&_h1]:font-bold [&_h1]:mt-3 [&_h1]:mb-2 ' +
  '[&_h2]:text-base [&_h2]:font-bold [&_h2]:mt-3 [&_h2]:mb-2 ' +
  '[&_h3]:text-sm [&_h3]:font-bold [&_h3]:mt-3 [&_h3]:mb-2 ' +
  '[&_p]:mb-3 [&_p:last-child]:mb-0 ' +
  '[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_ul]:my-3 ' +
  '[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2 [&_ol]:my-3 ' +
  '[&_li]:leading-relaxed ' +
  '[&_strong]:font-semibold [&_b]:font-semibold ' +
  '[&_a]:text-amber-600 [&_a]:underline ' +
  '[&_blockquote]:border-l-2 [&_blockquote]:border-stone-300 [&_blockquote]:pl-3 [&_blockquote]:italic';

const ALLOWED_TAGS = new Set([
  'P', 'BR', 'UL', 'OL', 'LI', 'STRONG', 'B', 'EM', 'I', 'U',
  'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'A', 'BLOCKQUOTE', 'DIV', 'PRE', 'CODE', 'HR',
]);

const BLOCKED_TAGS = new Set(['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'LINK', 'META', 'FORM', 'INPUT', 'IMG']);

export function messagePlainText(text) {
  return String(text || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#*_>`]+/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

export function previewInquiryMessage(text, max = 48) {
  const plain = messagePlainText(text);
  return plain.length > max ? `${plain.slice(0, max)}…` : plain;
}

export function looksLikeHtml(text) {
  return /<\/?(?:p|br|ul|ol|li|div|span|h[1-6]|strong|b|em|i|blockquote|a|table|tr|td)\b/i.test(text || '');
}

export function InquiryMessageBody({ text }) {
  if (!text) return <span>—</span>;

  const html = looksLikeHtml(text) ? sanitizeHtml(text) : markdownToHtml(text);

  if (!html) return <span>—</span>;

  return (
    <div
      className={HTML_CLASS}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function clipboardHtmlToMarkdown(html) {
  const clean = sanitizeHtml(html);
  if (typeof window === 'undefined' || !clean) return '';
  const doc = new DOMParser().parseFromString(clean, 'text/html');
  return nodeToMarkdown(doc.body).replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

export function applyFormattedPaste(event, currentValue, onInsert) {
  const html = event.clipboardData?.getData('text/html');
  if (!html || !looksLikeHtml(html)) return;
  const formatted = clipboardHtmlToMarkdown(html);
  if (!formatted) return;
  event.preventDefault();
  const el = event.target;
  const start = el.selectionStart ?? currentValue.length;
  const end = el.selectionEnd ?? currentValue.length;
  onInsert(`${currentValue.slice(0, start)}${formatted}${currentValue.slice(end)}`);
}

function markdownToHtml(raw) {
  const normalized = String(raw)
    .replace(/\r\n/g, '\n')
    .replace(/^\s*\*\*\*(.+?):\*\*\s*/gm, '- **$1:** ');

  return parseInquiryBlocks(normalized).map((block) => {
    if (block.type === 'h1' || block.type === 'h2' || block.type === 'h3') {
      return `<h2>${inlineMd(block.text)}</h2>`;
    }
    if (block.type === 'ul') {
      return `<ul>${block.items.map((item) => `<li>${inlineMd(item)}</li>`).join('')}</ul>`;
    }
    if (block.type === 'ol') {
      return `<ol>${block.items.map((item) => `<li>${inlineMd(item)}</li>`).join('')}</ol>`;
    }
    return `<p>${inlineMd(block.text)}</p>`;
  }).join('');
}

function inlineMd(text) {
  return escapeHtml(text).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function parseInquiryBlocks(src) {
  const lines = src.split('\n');
  const blocks = [];
  let para = [];
  let list = null;

  const flushPara = () => {
    if (!para.length) return;
    blocks.push({ type: 'p', text: para.join(' ').replace(/\s+/g, ' ').trim() });
    para = [];
  };
  const flushList = () => {
    if (!list) return;
    blocks.push(list);
    list = null;
  };

  const headingRe = /^(#{1,3})\s+(.*)$/;
  const ulItemRe = /^\s*(?:[-•]|\*(?!\*))\s+(.*)$/;
  const olItemRe = /^\s*\d+[.)]\s+(.*)$/;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      flushPara();
      flushList();
      continue;
    }

    const heading = trimmed.match(headingRe);
    if (heading) {
      flushPara();
      flushList();
      blocks.push({ type: `h${heading[1].length}`, text: heading[2].trim() });
      continue;
    }

    const ulItem = line.match(ulItemRe);
    if (ulItem) {
      flushPara();
      if (!list || list.type !== 'ul') {
        flushList();
        list = { type: 'ul', items: [] };
      }
      list.items.push(ulItem[1].trim());
      continue;
    }

    const olItem = line.match(olItemRe);
    if (olItem) {
      flushPara();
      if (!list || list.type !== 'ol') {
        flushList();
        list = { type: 'ol', items: [] };
      }
      list.items.push(olItem[1].trim());
      continue;
    }

    if (list) {
      list.items[list.items.length - 1] += ` ${trimmed}`;
      continue;
    }

    para.push(trimmed);
  }

  flushPara();
  flushList();
  return blocks;
}

export function sanitizeHtml(dirty) {
  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
    return escapeHtml(dirty);
  }

  const doc = new DOMParser().parseFromString(String(dirty), 'text/html');
  const clean = sanitizeNode(doc.body, doc);
  const wrap = doc.createElement('div');
  wrap.appendChild(clean);
  return wrap.innerHTML;
}

function sanitizeNode(node, doc) {
  if (node.nodeType === Node.TEXT_NODE) {
    return doc.createTextNode(node.textContent);
  }
  if (node.nodeType !== Node.ELEMENT_NODE) {
    return doc.createDocumentFragment();
  }

  const tag = node.tagName;
  if (BLOCKED_TAGS.has(tag)) {
    return doc.createDocumentFragment();
  }

  let el = null;
  if (ALLOWED_TAGS.has(tag)) {
    el = doc.createElement(tag.toLowerCase());
    if (tag === 'A') {
      const href = (node.getAttribute('href') || '').trim();
      if (/^(https?:|mailto:)/i.test(href)) {
        el.setAttribute('href', href);
        el.setAttribute('rel', 'noopener noreferrer');
        el.setAttribute('target', '_blank');
      }
    }
  }

  const target = el || doc.createDocumentFragment();
  node.childNodes.forEach((child) => {
    target.appendChild(sanitizeNode(child, doc));
  });
  return el || target;
}

function nodeToMarkdown(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent.replace(/\s+/g, ' ');
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return '';

  const inner = Array.from(node.childNodes).map(nodeToMarkdown).join('');
  switch (node.tagName) {
    case 'H1':
    case 'H2':
    case 'H3':
    case 'H4':
    case 'H5':
    case 'H6':
      return `\n\n## ${inner.trim()}\n\n`;
    case 'P':
    case 'DIV':
      return `\n\n${inner.trim()}\n\n`;
    case 'BR':
      return '\n';
    case 'UL':
    case 'OL':
      return `\n\n${inner}\n`;
    case 'LI':
      return `- ${inner.trim()}\n`;
    case 'STRONG':
    case 'B':
      return `**${inner.trim()}**`;
    default:
      return inner;
  }
}
