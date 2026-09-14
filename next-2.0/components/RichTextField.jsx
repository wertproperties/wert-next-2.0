'use client';

import { useEffect, useRef } from 'react';
import { looksLikeHtml, messagePlainText, sanitizeHtml } from '@/lib/inquiryMessage';

const EDITOR_CLASS =
  'inquiry-html min-h-[10.5rem] max-h-80 overflow-y-auto outline-none ' +
  '[&_h1]:text-base [&_h1]:font-bold [&_h1]:mt-2 [&_h1]:mb-2 ' +
  '[&_h2]:text-base [&_h2]:font-bold [&_h2]:mt-2 [&_h2]:mb-2 ' +
  '[&_h3]:text-sm [&_h3]:font-bold [&_h3]:mt-2 [&_h3]:mb-2 ' +
  '[&_p]:mb-2 [&_p:last-child]:mb-0 ' +
  '[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ul]:my-2 ' +
  '[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1 [&_ol]:my-2 ' +
  '[&_li]:leading-relaxed ' +
  '[&_strong]:font-semibold [&_b]:font-semibold';

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function runCommand(command) {
  document.execCommand(command, false);
}

export default function RichTextField({ name = 'message', value, onChange, required = false }) {
  const editorRef = useRef(null);
  const skipSync = useRef(false);
  const isEmpty = !messagePlainText(value);

  useEffect(() => {
    if (!editorRef.current) return;
    if (!messagePlainText(value)) {
      if (editorRef.current.innerHTML) editorRef.current.innerHTML = '';
      skipSync.current = false;
      return;
    }
    if (skipSync.current) skipSync.current = false;
  }, [value]);

  const emit = () => {
    if (!editorRef.current) return;
    skipSync.current = true;
    const html = sanitizeHtml(editorRef.current.innerHTML);
    const plain = messagePlainText(html);
    onChange(plain ? html : '');
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const html = e.clipboardData.getData('text/html');
    const text = e.clipboardData.getData('text/plain');
    const fragment = html && looksLikeHtml(html)
      ? sanitizeHtml(html)
      : escapeHtml(text).replace(/\n/g, '<br>');
    document.execCommand('insertHTML', false, fragment);
    emit();
  };

  const handleToolbar = (command) => (e) => {
    e.preventDefault();
    editorRef.current?.focus();
    runCommand(command);
    emit();
  };

  return (
    <div className="input-field !p-0 overflow-hidden focus-within:border-amber-500">
      <div className="flex items-center gap-1 px-2 py-1.5 border-b border-stone-200 bg-stone-50">
        <button type="button" onMouseDown={handleToolbar('bold')} className="px-2 py-1 text-xs font-bold text-stone-600 hover:bg-white hover:text-stone-900 rounded" title="Bold">
          B
        </button>
        <button type="button" onMouseDown={handleToolbar('italic')} className="px-2 py-1 text-xs italic text-stone-600 hover:bg-white hover:text-stone-900 rounded" title="Italic">
          I
        </button>
        <button type="button" onMouseDown={handleToolbar('insertUnorderedList')} className="px-2 py-1 text-xs text-stone-600 hover:bg-white hover:text-stone-900 rounded" title="Bullet list">
          • List
        </button>
        <button type="button" onMouseDown={handleToolbar('insertOrderedList')} className="px-2 py-1 text-xs text-stone-600 hover:bg-white hover:text-stone-900 rounded" title="Numbered list">
          1. List
        </button>
      </div>
      <div className="relative">
        {isEmpty && (
          <span className="pointer-events-none absolute left-4 top-3 text-sm text-stone-400">
            Paste keeps headings, lists and bold formatting.
          </span>
        )}
        <div
          ref={editorRef}
          role="textbox"
          aria-multiline="true"
          contentEditable
          className={`input-field border-0 ${EDITOR_CLASS}`}
          onInput={emit}
          onPaste={handlePaste}
          onBlur={emit}
        />
      </div>
      <textarea
        name={name}
        value={messagePlainText(value)}
        required={required}
        minLength={required ? 10 : undefined}
        tabIndex={-1}
        aria-hidden="true"
        className="sr-only"
        onChange={() => {}}
        onFocus={() => editorRef.current?.focus()}
      />
    </div>
  );
}
