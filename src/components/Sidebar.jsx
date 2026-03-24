import { PlusIcon, TrashIcon, MessageSquareIcon } from 'lucide-react'

export default function Sidebar({ chats, activeChatId, onSelectChat, onNewChat, onDeleteChat }) {
  return (
    <div className="flex flex-col h-full bg-[#202123] text-gray-100">
      {/* New Chat Button */}
      <div className="p-3">
        <button
          onClick={onNewChat}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm hover:bg-[#2a2b32] transition-colors duration-150 border border-[#4e4f60]"
        >
          <PlusIcon size={16} />
          <span>New chat</span>
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-2">
        {chats.length === 0 ? (
          <p className="text-xs text-gray-500 text-center mt-4 px-3">No conversations yet</p>
        ) : (
          <>
            <p className="text-xs text-gray-500 px-2 py-1 mt-1">Recent</p>
            {[...chats].reverse().map((chat) => (
              <div
                key={chat.id}
                className={`group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer mb-0.5 transition-colors duration-150 ${
                  chat.id === activeChatId
                    ? 'bg-[#2a2b32]'
                    : 'hover:bg-[#2a2b32]'
                }`}
                onClick={() => onSelectChat(chat.id)}
              >
                <MessageSquareIcon size={14} className="shrink-0 text-gray-400" />
                <span className="flex-1 text-sm truncate text-gray-200">{chat.title}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); onDeleteChat(chat.id) }}
                  className="shrink-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition-opacity duration-150"
                >
                  <TrashIcon size={14} />
                </button>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-[#4e4f60]">
        <div className="flex items-center gap-3 px-3 py-2">
          <span className="text-xl">🐱</span>
          <div>
            <p className="text-sm font-medium text-gray-200">CatGPT</p>
            <p className="text-xs text-gray-500">Powered by meow</p>
          </div>
        </div>
      </div>
    </div>
  )
}
