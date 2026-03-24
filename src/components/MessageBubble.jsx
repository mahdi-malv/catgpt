import { useState } from 'react'

function UserBubble({ content }) {
  return (
    <div className="flex justify-end px-4 py-2">
      <div className="max-w-[80%] md:max-w-[60%]">
        <div className="bg-[#40414f] rounded-2xl px-4 py-3 text-gray-100 text-sm leading-relaxed whitespace-pre-wrap break-words">
          {content}
        </div>
      </div>
    </div>
  )
}

function CatGif({ gifUrl }) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  if (error) {
    return (
      <p className="text-sm text-gray-400 italic mt-3">
        *cat hid from camera*
      </p>
    )
  }

  return (
    <div className="mt-3 max-w-xs">
      {!loaded && (
        <div className="h-48 w-64 bg-[#565869] animate-pulse rounded-xl" />
      )}
      <img
        src={gifUrl}
        alt="Random cat"
        className={`rounded-xl max-w-full ${loaded ? 'block' : 'hidden'}`}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    </div>
  )
}

function CatBubble({ content, gifUrl, isStreaming }) {
  return (
    <div className="flex items-start gap-3 px-4 py-4 bg-[#444654]">
      <div className="shrink-0 w-8 h-8 rounded-full bg-[#19c37d] flex items-center justify-center text-sm font-bold select-none">
        🐱
      </div>
      <div className="flex-1 max-w-[80%] md:max-w-[60%]">
        <p
          className={`text-gray-100 text-sm leading-relaxed whitespace-pre-wrap break-words ${
            isStreaming ? 'streaming-cursor' : ''
          }`}
        >
          {content || (isStreaming ? '' : '...')}
        </p>
        {gifUrl && <CatGif gifUrl={gifUrl} />}
      </div>
    </div>
  )
}

export default function MessageBubble({ message }) {
  if (message.role === 'user') {
    return <UserBubble content={message.content} />
  }
  return (
    <CatBubble
      content={message.content}
      gifUrl={message.gifUrl}
      isStreaming={message.isStreaming}
    />
  )
}
