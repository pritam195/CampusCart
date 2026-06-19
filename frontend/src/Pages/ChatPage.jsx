import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { io } from 'socket.io-client';
import ChatSidebar from '../Components/ChatSidebar';
import MessageContainer from '../Components/MessageContainer';
import MessageInput from '../Components/MessageInput';

const ChatPage = () => {
    const { user } = useContext(AuthContext);
    const { conversationId } = useParams();
    const navigate = useNavigate();

    const [conversations, setConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const socket = useRef();
    const activeChatIdRef = useRef(conversationId);

    useEffect(() => {
        activeChatIdRef.current = conversationId;
    }, [conversationId]);

    useEffect(() => {
        if (user) {
            
            const isProduction = import.meta.env.PROD;
            const backendUrl = import.meta.env.VITE_BACKEND_URL || (isProduction ? 'https://campuscart-ckro.onrender.com' : 'http://localhost:5000');
            socket.current = io(backendUrl);

            socket.current.emit("addUser", user._id || user.id);
            socket.current.on("getOnlineUsers", (users) => {
                setOnlineUsers(users);
            });

            socket.current.on("getMessage", (data) => {
                
                if (data.conversationId === activeChatIdRef.current) {
                    setMessages((prev) => [...prev, data]);
                }

                
                setConversations((prevConvs) => {
                    const convIndex = prevConvs.findIndex(c => c._id === data.conversationId);
                    if (convIndex > -1) {
                        const updatedConvs = [...prevConvs];
                        const conv = { ...updatedConvs[convIndex] };
                        conv.lastMessage = data.text;
                        
                        
                        if (data.conversationId !== activeChatIdRef.current) {
                            const userId = user._id || user.id;
                            if (!conv.unreadCount) conv.unreadCount = {};
                            conv.unreadCount[userId] = (conv.unreadCount[userId] || 0) + 1;
                        }
                        
                        updatedConvs.splice(convIndex, 1);
                        updatedConvs.unshift(conv); 
                        return updatedConvs;
                    }
                    return prevConvs;
                });
            });

            
            return () => {
                socket.current.disconnect();
            };
        }
    }, [user]);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const { data } = await API.get('/chat/conversations');
                if (data.success) {
                    setConversations(data.conversations);
                }
            } catch (err) {
                console.error("Failed to fetch conversations", err);
            }
        };
        fetchConversations();
    }, [user]);

    useEffect(() => {
        if (conversationId && conversations.length > 0) {
            const chat = conversations.find((c) => c._id === conversationId);
            if (chat && (!currentChat || currentChat._id !== conversationId)) {
                setCurrentChat(chat);
                fetchMessages(conversationId);

                
                setConversations((prevConvs) => {
                    const updated = [...prevConvs];
                    const idx = updated.findIndex(c => c._id === conversationId);
                    if (idx > -1) {
                        const conv = { ...updated[idx] };
                        const userId = user._id || user.id;
                        if (!conv.unreadCount) conv.unreadCount = {};
                        if (conv.unreadCount[userId] > 0) {
                            conv.unreadCount[userId] = 0;
                            updated[idx] = conv;
                            return updated;
                        }
                    }
                    return prevConvs;
                });
            }
        }
    }, [conversationId, conversations, currentChat, user]);

    const fetchMessages = async (id) => {
        try {
            const { data } = await API.get(`/chat/messages/${id}`);
            if (data.success) {
                setMessages(data.messages);
            }
        } catch (err) {
            console.error("Failed to fetch messages", err);
        }
    };

    const handleSendMessage = async (text) => {
        if (!text.trim() || !currentChat) return;

        const receiverId = currentChat.participants.find(
            (p) => (p._id || p) !== (user._id || user.id)
        )._id;

        const messageData = {
            senderId: user._id || user.id,
            text,
            conversationId: currentChat._id,
        };

        
        socket.current.emit("sendMessage", {
            ...messageData,
            receiverId,
        });

        
        try {
            const { data } = await API.post('/chat/messages', messageData);
            if (data.success) {
                setMessages((prev) => [...prev, data.message]);

                
                setConversations((prevConvs) => {
                    const convIndex = prevConvs.findIndex(c => c._id === currentChat._id);
                    if (convIndex > -1) {
                        const updatedConvs = [...prevConvs];
                        const conv = { ...updatedConvs[convIndex] };
                        conv.lastMessage = text;
                        updatedConvs.splice(convIndex, 1);
                        updatedConvs.unshift(conv); 
                        return updatedConvs;
                    }
                    return prevConvs;
                });
            }
        } catch (err) {
            console.error("Failed to send message", err);
        }
    };

    return (
        <div className="h-[calc(100vh-80px)] bg-slate-50 relative overflow-hidden flex flex-col">
            {}
            <div className="absolute top-20 -left-20 w-72 h-72 bg-brand-orange/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob pointer-events-none"></div>
            <div className="absolute bottom-20 -right-20 w-72 h-72 bg-indigo-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col min-h-0">
                <div className="flex gap-6 h-full min-h-0 flex-1 relative z-10">
                    {}
                    <div className={`w-full md:w-1/3 bg-white/80 backdrop-blur-xl border border-white rounded-3xl shadow-xl shadow-slate-200/50 flex flex-col overflow-hidden min-h-0 ${conversationId ? 'hidden md:flex' : 'flex'}`}>
                        <div className="shrink-0 p-6 border-b border-slate-100 bg-white/50">
                            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                                <span className="inline-block p-2 rounded-xl bg-brand-orange/10 text-brand-orange">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                </span>
                                Messages
                            </h2>
                        </div>
                        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
                            <ChatSidebar 
                                conversations={conversations} 
                                currentChatId={conversationId} 
                                onlineUsers={onlineUsers} 
                                currentUser={user}
                                onSelectChat={(id) => navigate(`/chat/${id}`)}
                            />
                        </div>
                    </div>

                    {}
                    <div className={`w-full md:w-2/3 bg-white/80 backdrop-blur-xl border border-white rounded-3xl shadow-xl shadow-slate-200/50 flex flex-col overflow-hidden min-h-0 ${!conversationId ? 'hidden md:flex items-center justify-center bg-white/50' : 'flex'}`}>
                        {currentChat ? (
                            <>
                                {}
                                <div className="shrink-0 p-4 sm:p-6 border-b border-slate-100 bg-white/50 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
                                    <div className="flex items-center gap-4">
                                        <button 
                                            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors"
                                            onClick={() => navigate('/chat')}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                                        </button>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 line-clamp-1">{currentChat.productId?.title}</h3>
                                            <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-rose-500">₹{currentChat.productId?.price}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold flex items-center gap-1.5 border border-emerald-100">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                            Active
                                        </div>
                                    </div>
                                </div>

                                {}
                                <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 bg-slate-50/50 custom-scrollbar">
                                    <MessageContainer 
                                        messages={messages} 
                                        currentUser={user} 
                                    />
                                </div>

                                {}
                                <div className="shrink-0 p-4 sm:p-6 border-t border-slate-100 bg-white/80 backdrop-blur-md">
                                    <MessageInput onSendMessage={handleSendMessage} />
                                </div>
                            </>
                        ) : (
                            <div className="text-center p-8 max-w-sm">
                                <div className="mx-auto w-24 h-24 bg-brand-orange/10 text-brand-orange rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-sm">
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
                                </div>
                                <h3 className="text-2xl font-extrabold text-slate-900 mb-2 tracking-tight">Your Messages</h3>
                                <p className="text-slate-500 font-medium">Select a conversation from the sidebar to start chatting with buyers or sellers.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
