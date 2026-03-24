import { useState, useEffect, useRef } from 'react'
import { MenuIcon } from 'lucide-react'
import Sidebar from './components/Sidebar'
import ChatContainer from './components/ChatContainer'
import ChatInput from './components/ChatInput'
import { useCatLogic, getCatGifUrl } from './hooks/useCatLogic'

function createChat(firstMessage) {
  return {
    id: crypto.randomUUID(),
    title: firstMessage.slice(0, 30) + (firstMessage.length > 30 ? '…' : ''),
    messages: [],
    createdAt: Date.now(),
  }
}

function loadChats() {
  try {
    const raw = localStorage.getItem('catgpt-chats')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export default function App() {
  const [chats, setChats] = useState(loadChats)
  const [activeChatId, setActiveChatId] = useState(() => loadChats()[0]?.id ?? null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const cleanupRef = useRef(null)

  const { isStreaming, streamResponse } = useCatLogic()

  // Persist chats to localStorage
  useEffect(() => {
    localStorage.setItem('catgpt-chats', JSON.stringify(chats))
  }, [chats])

  const activeChat = chats.find((c) => c.id === activeChatId)
  const messages = activeChat?.messages ?? []

  // ── Helpers ────────────────────────────────────────────────────────────────

  function updateMessage(chatId, msgId, updater) {
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id !== chatId) return chat
        return {
          ...chat,
          messages: chat.messages.map((msg) =>
            msg.id === msgId ? { ...msg, ...updater(msg) } : msg
          ),
        }
      })
    )
  }

  // ── Handlers ───────────────────────────────────────────────────────────────

  function handleNewChat() {
    setActiveChatId(null)
    setSidebarOpen(false)
  }

  function handleSelectChat(id) {
    setActiveChatId(id)
    setSidebarOpen(false)
  }

  function handleDeleteChat(id) {
    setChats((prev) => prev.filter((c) => c.id !== id))
    setActiveChatId((prev) => {
      if (prev !== id) return prev
      const remaining = chats.filter((c) => c.id !== id)
      return remaining[remaining.length - 1]?.id ?? null
    })
  }

  function handleSend(text) {
    if (isStreaming) return

    // Create new chat if none active
    let targetChatId = activeChatId
    const hasActiveChat = chats.some((c) => c.id === activeChatId)

    if (!hasActiveChat) {
      const chat = createChat(text)
      targetChatId = chat.id
      setChats((prev) => [...prev, chat])
      setActiveChatId(chat.id)
    }

    const userMsgId = crypto.randomUUID()
    const catMsgId = crypto.randomUUID()

    const userMsg = { id: userMsgId, role: 'user', content: text, gifUrl: null, isStreaming: false }
    const catMsg = { id: catMsgId, role: 'cat', content: '', gifUrl: null, isStreaming: true }

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === targetChatId
          ? { ...chat, messages: [...chat.messages, userMsg, catMsg] }
          : chat
      )
    )

    const cleanup = streamResponse(
      text,
      (accumulated) => {
        updateMessage(targetChatId, catMsgId, () => ({ content: accumulated }))
      },
      () => {
        const gifUrl = getCatGifUrl()
        updateMessage(targetChatId, catMsgId, () => ({ isStreaming: false, gifUrl }))
      }
    )
    cleanupRef.current = cleanup
  }

  useEffect(() => {
    return () => cleanupRef.current?.()
  }, [])

  return (
    <div className="flex h-screen overflow-hidden bg-[#343541] text-gray-100 font-sans">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar
          chats={chats}
          activeChatId={activeChatId}
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
          onDeleteChat={handleDeleteChat}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#4e4f60] md:hidden bg-[#343541]">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            <MenuIcon size={20} />
          </button>
          <span className="text-sm font-medium text-gray-200 truncate">
            {activeChat?.title ?? 'CatGPT'}
          </span>
        </div>

        {/* Chat + Input */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <ChatContainer messages={messages} />
          <ChatInput onSend={handleSend} isStreaming={isStreaming} />
        </div>
      </div>
    </div>
  )
}
