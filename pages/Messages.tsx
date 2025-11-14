import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { MANAGER_NAV } from '../constants';
import { SearchIcon, PaperAirplaneIcon } from '../components/Icons';
import type { Conversation, Message } from '../types';
import { useData } from '../contexts/DataContext';

const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 86400;
    if (interval > 1) {
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + "h";
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + "m";
    }
    return "now";
};


const Messages: React.FC = () => {
    const { conversations, messages, sendMessage } = useData();
    const [activeConversationId, setActiveConversationId] = useState<string | null>(conversations[0]?.id || null);
    const [newMessage, setNewMessage] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    const activeConversation = conversations.find(c => c.id === activeConversationId);
    const activeMessages = messages.filter(m => m.conversationId === activeConversationId)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    const tenantConversations = conversations.filter(c => c.participantType === 'Tenant');
    const ownerConversations = conversations.filter(c => c.participantType === 'Owner');

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [activeMessages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === '' || !activeConversationId) return;

        const newMessageObj: Message = {
            id: `msg${Date.now()}`,
            conversationId: activeConversationId,
            sender: 'manager',
            text: newMessage.trim(),
            timestamp: new Date().toISOString(),
        };

        sendMessage(newMessageObj);
        setNewMessage('');
    };

    const ConversationList = ({ title, convos }: { title: string, convos: Conversation[] }) => (
        <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase px-4 mb-2">{title}</h3>
            <ul className="space-y-1">
                {convos.map(convo => (
                    <li key={convo.id}>
                        <button
                            onClick={() => setActiveConversationId(convo.id)}
                            className={`w-full text-left flex items-center p-3 rounded-lg transition-colors ${activeConversationId === convo.id ? 'bg-blue-100' : 'hover:bg-slate-100'}`}
                        >
                            <div className="w-10 h-10 rounded-full bg-slate-300 flex-shrink-0 mr-3"></div>
                            <div className="flex-1 overflow-hidden">
                                <div className="flex justify-between items-center">
                                    <p className={`font-semibold truncate ${activeConversationId === convo.id ? 'text-blue-800' : 'text-slate-800'}`}>{convo.participantName}</p>
                                    <p className="text-xs text-slate-400 flex-shrink-0">{timeAgo(convo.lastMessageTimestamp)}</p>
                                </div>
                                <p className="text-sm text-slate-500 truncate">{convo.lastMessage}</p>
                            </div>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );

    return (
        <DashboardLayout navItems={MANAGER_NAV} activePath="/manager/messages">
            <div className="flex h-full -m-6 lg:-m-8">
                {/* Left Pane: Conversation List */}
                <aside className="w-1/3 bg-white border-r border-slate-200 flex flex-col h-full">
                    <div className="p-4 border-b border-slate-200">
                        <h2 className="text-xl font-bold text-slate-800">Messages</h2>
                        <div className="relative mt-3">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon className="w-4 h-4 text-slate-400" />
                            </div>
                            <input type="text" placeholder="Search messages..." className="pl-9 pr-3 py-2 text-sm w-full bg-slate-100 border border-slate-200 rounded-lg" />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto py-3 space-y-4">
                        <ConversationList title="Tenants" convos={tenantConversations} />
                        <ConversationList title="Owners" convos={ownerConversations} />
                    </div>
                </aside>

                {/* Center Pane: Chat Window */}
                <main className="w-2/3 flex flex-col h-full">
                    {activeConversation ? (
                        <>
                            <header className="bg-white border-b border-slate-200 p-4 flex items-center">
                                <div className="w-10 h-10 rounded-full bg-slate-300 mr-4"></div>
                                <div>
                                    <h3 className="font-bold text-slate-800">{activeConversation.participantName}</h3>
                                    <p className="text-sm text-slate-500">{activeConversation.propertyInfo}</p>
                                </div>
                            </header>

                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {activeMessages.map(msg => (
                                    <div key={msg.id} className={`flex ${msg.sender === 'manager' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-md p-3 rounded-lg ${msg.sender === 'manager' ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-800'}`}>
                                            <p>{msg.text}</p>
                                            <p className={`text-xs mt-1 ${msg.sender === 'manager' ? 'text-blue-100' : 'text-slate-500'} opacity-75`}>
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                <div ref={chatEndRef} />
                            </div>

                            <footer className="bg-white border-t border-slate-200 p-4">
                                <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={e => setNewMessage(e.target.value)}
                                        placeholder="Type a message..."
                                        className="flex-1 px-4 py-2 bg-slate-100 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button type="submit" className="bg-blue-600 text-white rounded-full p-3 hover:bg-blue-700 transition-colors">
                                        <PaperAirplaneIcon className="w-5 h-5" />
                                    </button>
                                </form>
                            </footer>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-slate-500">
                            <p>Select a conversation to start messaging</p>
                        </div>
                    )}
                </main>
            </div>
        </DashboardLayout>
    );
};

export default Messages;