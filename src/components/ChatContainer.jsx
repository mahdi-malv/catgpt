import { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'

function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
      <div className="text-6xl mb-4 select-none">🐱</div>
      <h1 className="text-3xl font-semibold text-gray-100 mb-2">CatGPT</h1>
      <p className="text-gray-400 text-sm max-w-xs">
        Every question deserves a meow.
      </p>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg w-full">
        {[
          'What is the meaning of life?',
          'Tell me a joke',
          'Help me with my homework',
          'What should I have for dinner?',
        ].map((suggestion) => (
          <div
            key={suggestion}
            className="px-4 py-3 rounded-xl border border-[#4e4f60] text-sm text-gray-300 text-left cursor-default hover:bg-[#40414f] transition-colors duration-150"
          >
            {suggestion}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ChatContainer({ messages }) {
  const containerRef = useRef(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const distFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight
    if (distFromBottom < 120) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  if (!messages || messages.length === 0) {
    return <EmptyState />
  }

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto pb-8">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
