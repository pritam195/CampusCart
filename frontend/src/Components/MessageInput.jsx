import React, { useState } from 'react';

const MessageInput = ({ onSendMessage }) => {
    const [text, setText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.trim()) {
            onSendMessage(text);
            setText('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2">
            <input 
                type="text" 
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message..." 
                className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff6a3d]"
            />
            <button 
                type="submit"
                disabled={!text.trim()}
                className="bg-[#ff6a3d] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#e55a2d] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Send
            </button>
        </form>
    );
};

export default MessageInput;
