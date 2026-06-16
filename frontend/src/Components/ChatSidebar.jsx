import React from 'react';
import { getImageUrl } from '../services/imageUrl';

const ChatSidebar = ({ conversations, currentChatId, onlineUsers, currentUser, onSelectChat }) => {
    
    
    const visibleConversations = conversations.filter(
        c => c.lastMessage || c._id === currentChatId
    );

    if (visibleConversations.length === 0) {
        return <div className="p-4 text-gray-500 text-center">No conversations yet.</div>;
    }

    return (
        <div className="flex flex-col">
            {visibleConversations.map((chat) => {
                const otherUser = chat.participants.find((p) => (p._id || p) !== (currentUser._id || currentUser.id));
                const isOnline = onlineUsers.includes(otherUser?._id);
                
                
                const unreadCount = chat.unreadCount?.[currentUser._id || currentUser.id] || 0;
                
                return (
                    <div 
                        key={chat._id} 
                        onClick={() => onSelectChat(chat._id)}
                        className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition ${currentChatId === chat._id ? 'bg-orange-50 border-l-4 border-brand-orange' : ''}`}
                    >
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <img 
                                    src={getImageUrl(otherUser?.avatar)} 
                                    alt={otherUser?.name} 
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                {isOnline && (
                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h4 className={`font-bold truncate ${unreadCount > 0 ? 'text-slate-900' : 'text-slate-700'}`}>{otherUser?.name}</h4>
                                    {unreadCount > 0 && (
                                        <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-rose-500 rounded-full">
                                            {unreadCount}
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-brand-orange font-medium truncate mb-0.5">{chat.productId?.title}</p>
                                {chat.lastMessage && (
                                    <p className={`text-sm truncate ${unreadCount > 0 ? 'text-slate-800 font-semibold' : 'text-slate-500'}`}>
                                        {chat.lastMessage}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ChatSidebar;
