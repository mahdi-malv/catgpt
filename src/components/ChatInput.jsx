import { useRef, useEffect } from 'react'
import { SendIcon } from 'lucide-react'

export default function ChatInput({ onSend, isStreaming }) {
  const textareaRef = useRef(null)

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 200) + 'px'
  })

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  function submit() {
    const text = textareaRef.current?.value?.trim()
    if (!text || isStreaming) return
    onSend(text)
    textareaRef.current.value = ''
    textareaRef.current.style.height = 'auto'
  }

  return (
    <div className="flex-shrink-0 px-4 py-4 bg-[#343541]">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-end gap-3 bg-[#40414f] border border-[#4e4f60] rounded-xl px-4 py-3 focus-within:border-gray-400 transition-colors duration-150">
          <textarea
            ref={textareaRef}
            rows={1}
            placeholder="Message CatGPT..."
            disabled={isStreaming}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-gray-100 text-sm resize-none outline-none placeholder-gray-500 leading-relaxed disabled:opacity-50"
            style={{ maxHeight: '200px', overflowY: 'auto' }}
          />
          <button
            onClick={submit}
            disabled={isStreaming}
            className="shrink-0 p-1.5 rounded-lg bg-gray-100 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-opacity duration-150"
          >
            <SendIcon size={16} className="text-gray-900" />
          </button>
        </div>
        <p className="text-center text-xs text-gray-500 mt-2">
          CatGPT can make mistakes. Consider verifying with a real cat.
        </p>
      </div>
    </div>
  )
}
