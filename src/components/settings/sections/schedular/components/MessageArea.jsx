import React from 'react'

function MessageArea({message,setMessage}) {
  return (
    <div className ="flex w-full h-full py-4">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message..."
              className="flex-1 w-full resize-none bg-transparent hide-scrollbar px-4 py-3.5 text-sm leading-6 text-text-secondary placeholder:text-text-tertiary outline-none"
            />

          </div>
  )
}

export default MessageArea