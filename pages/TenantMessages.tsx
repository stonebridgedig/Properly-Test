import React, { useState, useEffect, useRef, useMemo } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { TENANT_NAV, allTenants } from '../constants';
import { PaperAirplaneIcon } from '../components/Icons';
import type { Conversation, Message } from '../types';
import { useData } from '../contexts/DataContext';

const currentTenant = allTenants.find(t => t.name === 'Sophia Nguyen');

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

const TenantMessages: React.FC = () => {
    const { conversations, messages, sendMessage } = useData();
    const tenantConversation = useMemo(() => conversations.find(c => c.participantId === currentTenant?.id), [conversations]);

    const [activeConversationId, setActiveConversationId] = useState<string | null>(tenantConversation?.id || null);
    const [newMessage, setNewMessage] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    const activeConversation = conversations.find(c => c.id === activeConversationId);
    const activeMessages = messages.filter(m => m.conversationId === activeConversationId)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
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
            sender: 'participant', // The tenant is the participant in the data model
            text: newMessage.trim(),
            timestamp: new Date().toISOString(),
        };

        sendMessage(newMessageObj);
        setNewMessage('');
    };

    return (
        <DashboardLayout navItems={TENANT_NAV} activePath="/tenant/messages">
            <div className="flex h-full -m-6 lg:-m-8">
                {/* Left Pane: Conversation List */}
                <aside className="w-1/3 bg-white border-r border-slate-200 flex flex-col h-full">
                    <div className="p-4 border-b border-slate-200">
                        <h2 className="text-xl font-bold text-slate-800">Messages</h2>
                         <p className="text-sm text-slate-500 mt-1">Conversation with your manager.</p>
                    </div>
                    <div className="flex-1 overflow-y-auto py-3">
                       <ul>
                            {tenantConversation ? (
                                <li>
                                    <button
                                        onClick={() => setActiveConversationId(tenantConversation.id)}
                                        className={`w-full text-left flex items-center p-3 rounded-lg transition-colors ${activeConversationId === tenantConversation.id ? 'bg-blue-100' : 'hover:bg-slate-100'}`}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-slate-300 flex-shrink-0 mr-3 flex items-center justify-center font-bold text-slate-600">M</div>
                                        <div className="flex-1 overflow-hidden">
                                            <div className="flex justify-between items-center">
                                                <p className={`font-semibold truncate ${activeConversationId === tenantConversation.id ? 'text-blue-800' : 'text-slate-800'}`}>Property Manager</p>
                                                <p className="text-xs text-slate-400 flex-shrink-0">{timeAgo(tenantConversation.lastMessageTimestamp)}</p>
                                            </div>
                                            <p className="text-sm text-slate-500 truncate">{tenantConversation.lastMessage}</p>
                                        </div>
                                    </button>
                                </li>
                            ) : null}
                        </ul>
                    </div>
                </aside>

                {/* Center Pane: Chat Window */}
                <main className="w-2/3 flex flex-col h-full">
                    {activeConversation ? (
                        <>
                            <header className="bg-white border-b border-slate-200 p-4 flex items-center">
                                <div className="w-10 h-10 rounded-full bg-slate-300 mr-4 flex items-center justify-center font-bold text-slate-600">M</div>
                                <div>
                                    <h3 className="font-bold text-slate-800">Property Manager</h3>
                                    <p className="text-sm text-slate-500">Replying to {activeConversation.participantName}</p>
                                </div>
                            </header>

                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {activeMessages.map(msg => (
                                    <div key={msg.id} className={`flex ${msg.sender === 'participant' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-md p-3 rounded-lg ${msg.sender === 'participant' ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-800'}`}>
                                            <p>{msg.text}</p>
                                            <p className={`text-xs mt-1 ${msg.sender === 'participant' ? 'text-blue-100' : 'text-slate-500'} opacity-75`}>
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
                            <p>No active conversations.</p>
                        </div>
                    )}
                </main>
            </div>
        </DashboardLayout>
    );
};

export default TenantMessages;