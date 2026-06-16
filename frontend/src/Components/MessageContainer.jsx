import React, { useEffect, useRef } from 'react';

const MessageContainer = ({ messages, currentUser }) => {
    const scrollRef = useRef();

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (messages.length === 0) {
        return <div className="text-center text-gray-500 mt-10">No messages yet. Say hi!</div>;
    }

    return (
        <div className="flex flex-col space-y-4">
            {messages.map((m, index) => {
                const isOwn = (m.senderId === currentUser._id) || (m.senderId === currentUser.id);
                return (
                    <div 
                        key={index} 
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                        ref={scrollRef}
                    >
                        <div className={`max-w-[70%] rounded-lg px-4 py-2 ${isOwn ? 'bg-[#ff6a3d] text-white rounded-br-none' : 'bg-white border text-gray-800 rounded-bl-none'}`}>
                            <p className="break-words">{m.text}</p>
                            <span className={`text-xs mt-1 block ${isOwn ? 'text-orange-100 text-right' : 'text-gray-400'}`}>
                                {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default MessageContainer;
