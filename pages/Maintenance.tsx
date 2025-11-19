
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { MANAGER_NAV, properties } from '../constants';
import { PlusIcon, SearchIcon, TrashIcon, XMarkIcon, MapPinIcon, UsersIcon, ClockIcon, ChevronUpIcon, ChevronDownIcon, EllipsisVerticalIcon, WrenchScrewdriverIcon, UploadIcon, PaperAirplaneIcon } from '../components/Icons';
import type { MaintenanceRequest, Vendor, Property, Unit, Tenant, Message, Conversation } from '../types';
import { useData } from '../contexts/DataContext';

const getPriorityBadgeClass = (priority: MaintenanceRequest['priority']) => {
    switch (priority) {
        case 'Emergency': return 'bg-red-100 text-red-700';
        case 'High': return 'bg-rose-100 text-rose-700';
        case 'Medium': return 'bg-amber-100 text-amber-700';
        case 'Low': return 'bg-sky-100 text-sky-700';
        default: return 'bg-slate-100 text-slate-700';
    }
};

const getStatusBadgeClass = (status: MaintenanceRequest['status']) => {
    switch (status) {
        case 'New': return 'bg-blue-100 text-blue-700';
        case 'In Progress': return 'bg-amber-100 text-amber-700';
        case 'Pending Vendor': return 'bg-violet-100 text-violet-700';
        case 'Completed': return 'bg-green-100 text-green-700';
        default: return 'bg-slate-100 text-slate-700';
    }
};

const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + "d ago";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + "h ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + "m ago";
    }
    return Math.floor(seconds) + "s ago";
};

const ManagerNewRequestModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (newRequest: Omit<MaintenanceRequest, 'id' | 'status' | 'submittedDate'>) => void;
    properties: Property[];
}> = ({ isOpen, onClose, onSubmit, properties }) => {
    const initialState = {
        property: '', building: '', unit: '', tenant: '',
        issue: '', details: '', priority: 'Medium' as MaintenanceRequest['priority'],
        imageUrl: undefined as string | undefined,
    };
    const [formData, setFormData] = useState(initialState);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setFormData(initialState);
            setImagePreview(null);
        }
    }, [isOpen]);

    const availableBuildings = useMemo(() => {
        if (!formData.property) return [];
        return properties.find(p => p.name === formData.property)?.buildings || [];
    }, [formData.property, properties]);

    const availableUnits = useMemo(() => {
        if (!formData.building) return [];
        return availableBuildings.find(b => b.name === formData.building)?.units || [];
    }, [formData.building, availableBuildings]);
    
    const availableTenants = useMemo(() => {
        if (!formData.unit) return [];
        const unit = availableUnits.find(u => u.name === formData.unit);
        return unit ? unit.tenants.map(t => t.name) : [];
    }, [formData.unit, availableUnits]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setImagePreview(result);
                setFormData(prev => ({ ...prev, imageUrl: result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newState = { ...prev, [name]: value };
            if (name === 'property') {
                newState.building = '';
                newState.unit = '';
                newState.tenant = '';
            }
            if (name === 'building') {
                newState.unit = '';
                newState.tenant = '';
            }
            if (name === 'unit') {
                newState.tenant = '';
            }
            return newState;
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const { property, building, unit, tenant, issue, details, priority, imageUrl } = formData;
        if (property && building && unit && tenant && issue) {
            onSubmit({ property, building, unit, tenant, issue, details, priority, imageUrl });
        } else {
            alert('Please fill all required fields.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-between items-center p-6 border-b">
                        <h2 className="text-xl font-bold text-slate-800">New Maintenance Request</h2>
                        <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600"><XMarkIcon className="w-6 h-6" /></button>
                    </div>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Property</label>
                                <select name="property" value={formData.property} onChange={handleChange} required className="mt-1 w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm">
                                    <option value="" disabled>Select Property</option>
                                    {properties.map(p => <option key={p.name}>{p.name}</option>)}
                                </select>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-slate-700">Building</label>
                                <select name="building" value={formData.building} onChange={handleChange} required disabled={!formData.property} className="mt-1 w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm disabled:bg-slate-50">
                                    <option value="" disabled>Select Building</option>
                                    {availableBuildings.map(b => <option key={b.name}>{b.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Unit</label>
                                <select name="unit" value={formData.unit} onChange={handleChange} required disabled={!formData.building} className="mt-1 w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm disabled:bg-slate-50">
                                    <option value="" disabled>Select Unit</option>
                                    {availableUnits.map(u => <option key={u.name}>{u.name}</option>)}
                                </select>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-slate-700">Tenant</label>
                                <select name="tenant" value={formData.tenant} onChange={handleChange} required disabled={!formData.unit || availableTenants.length === 0} className="mt-1 w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm disabled:bg-slate-50">
                                    <option value="" disabled>Select Tenant</option>
                                    {availableTenants.map(t => <option key={t}>{t}</option>)}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Issue / Title</label>
                            <input type="text" name="issue" value={formData.issue} onChange={handleChange} required className="mt-1 w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm" placeholder="e.g., Leaky kitchen faucet" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Description</label>
                            <textarea name="details" value={formData.details} onChange={handleChange} rows={3} required className="mt-1 w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm" placeholder="Please provide as much detail as possible..."></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Priority</label>
                            <select name="priority" value={formData.priority} onChange={handleChange} className="mt-1 w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm">
                                <option>Low</option><option>Medium</option><option>High</option><option>Emergency</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Add a photo (optional)</label>
                            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-slate-900/25 px-6 py-10">
                                {imagePreview ? (
                                    <div className="text-center">
                                        <img src={imagePreview} alt="Preview" className="mx-auto max-h-40 rounded-md" />
                                        <button type="button" onClick={() => { setImagePreview(null); setFormData({...formData, imageUrl: undefined}); }} className="mt-2 text-sm text-red-600">Remove Image</button>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <UploadIcon className="mx-auto h-12 w-12 text-slate-300" />
                                        <div className="mt-4 flex text-sm leading-6 text-slate-600">
                                            <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 hover:text-blue-500">
                                                <span>Upload a file</span>
                                                <input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end p-6 bg-slate-50 border-t space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium bg-white border rounded-md hover:bg-slate-50">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Submit Request</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const MaintenanceChat: React.FC<{ requestId: string; tenantName: string }> = ({ requestId, tenantName }) => {
    const { conversations, messages, sendMessage, createConversation, tenants } = useData();
    const [newMessage, setNewMessage] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);
    
    const conversation = useMemo(() => {
        return conversations.find(c => c.contextId === requestId);
    }, [conversations, requestId]);

    const chatMessages = useMemo(() => {
        if (!conversation) return [];
        return messages
            .filter(m => m.conversationId === conversation.id)
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }, [conversation, messages]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        
        let convoId = conversation?.id;

        if (!conversation) {
            convoId = `c-m-${requestId}-${Date.now()}`;
            // Need tenant ID to link properly, looking up by name for now (simplification)
            const tenant = tenants.find(t => t.name === tenantName); 
            
            if (tenant) {
                const newConvo: Conversation = {
                    id: convoId,
                    participantId: tenant.id,
                    participantName: tenantName,
                    participantType: 'Tenant',
                    propertyInfo: `${tenant.propertyName}, ${tenant.unitName}`, // This would ideally come from request details
                    lastMessage: newMessage,
                    lastMessageTimestamp: new Date().toISOString(),
                    unreadCount: 0,
                    contextId: requestId,
                    contextType: 'maintenance'
                };
                createConversation(newConvo);
            } else {
                console.error("Could not find tenant for chat creation");
                return;
            }
        }

        sendMessage({
            id: `msg-${Date.now()}`,
            conversationId: convoId!,
            sender: 'manager',
            text: newMessage,
            timestamp: new Date().toISOString()
        });
        setNewMessage('');
    };

    return (
        <div className="flex flex-col h-full border-l border-slate-200 bg-slate-50">
            <div className="p-4 border-b border-slate-200 bg-white">
                <h4 className="font-bold text-slate-800">Conversation with {tenantName}</h4>
                <p className="text-xs text-slate-500">Regarding this maintenance request</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.length === 0 ? (
                    <div className="text-center text-slate-400 text-sm py-8">
                        <p>No messages yet.</p>
                        <p>Start the conversation to update the tenant.</p>
                    </div>
                ) : (
                    chatMessages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.sender === 'manager' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.sender === 'manager' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'}`}>
                                <p>{msg.text}</p>
                                <p className={`text-[10px] mt-1 text-right ${msg.sender === 'manager' ? 'text-blue-200' : 'text-slate-400'}`}>
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    ))
                )}
                <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="w-full pl-4 pr-12 py-2 bg-slate-100 border-none rounded-full focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    />
                    <button 
                        type="submit"
                        disabled={!newMessage.trim()} 
                        className="absolute right-1 p-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <PaperAirplaneIcon className="w-4 h-4" />
                    </button>
                </div>
            </form>
        </div>
    );
};

const MaintenanceDetailModal: React.FC<{ 
    request: MaintenanceRequest;
    onClose: () => void;
    onAssignVendor: (requestId: string, vendorId: string) => void;
    vendors: Vendor[];
}> = ({ request, onClose, onAssignVendor, vendors }) => {
    const [selectedVendor, setSelectedVendor] = useState('');

    const handleAssignClick = () => {
        if (selectedVendor) {
            onAssignVendor(request.id, selectedVendor);
        }
    };

    const assignedVendor = request.assignedTo ? vendors.find(v => v.id === request.assignedTo) : null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[85vh] flex flex-col overflow-hidden m-4" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 bg-white">
                    <div className="flex items-center">
                        <span className={`mr-3 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide rounded-full ${getStatusBadgeClass(request.status)}`}>
                            {request.status}
                        </span>
                        <h2 className="text-xl font-bold text-slate-800 mr-3">{request.issue}</h2>
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getPriorityBadgeClass(request.priority).replace('bg-', 'border-').replace('text-', 'text-')}`}>
                            {request.priority}
                        </span>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="flex flex-1 overflow-hidden">
                    {/* Left Column: Details */}
                    <div className="w-full lg:w-3/5 overflow-y-auto p-6">
                         {request.imageUrl && (
                            <div className="mb-6 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                                <img src={request.imageUrl} alt="Maintenance issue" className="w-full h-64 object-cover" />
                            </div>
                        )}
                        
                        <div className="space-y-8">
                            <section>
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 pb-2 border-b border-slate-100">Request Details</h3>
                                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{request.details}</p>
                            </section>

                            <section>
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 pb-2 border-b border-slate-100">Information</h3>
                                <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                                    <div className="flex items-start">
                                        <MapPinIcon className="w-5 h-5 text-slate-400 mr-3 mt-0.5"/>
                                        <div>
                                            <p className="text-xs font-semibold text-slate-500">Location</p>
                                            <p className="text-sm font-medium text-slate-900">{request.property}</p>
                                            <p className="text-sm text-slate-600">{request.building}, {request.unit}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <UsersIcon className="w-5 h-5 text-slate-400 mr-3 mt-0.5"/>
                                        <div>
                                            <p className="text-xs font-semibold text-slate-500">Reported By</p>
                                            <p className="text-sm font-medium text-slate-900">{request.tenant}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <ClockIcon className="w-5 h-5 text-slate-400 mr-3 mt-0.5"/>
                                        <div>
                                            <p className="text-xs font-semibold text-slate-500">Submitted</p>
                                            <p className="text-sm font-medium text-slate-900">{new Date(request.submittedDate).toLocaleString()}</p>
                                        </div>
                                    </div>
                                     {assignedVendor && (
                                        <div className="flex items-start">
                                            <WrenchScrewdriverIcon className="w-5 h-5 text-slate-400 mr-3 mt-0.5"/>
                                            <div>
                                                <p className="text-xs font-semibold text-slate-500">Assigned Vendor</p>
                                                <p className="text-sm font-medium text-slate-900">{assignedVendor.name}</p>
                                                <p className="text-sm text-slate-600">{assignedVendor.specialty}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {request.status === 'New' && (
                                <section className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                                    <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider mb-3">Assign Vendor</h3>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <select 
                                            value={selectedVendor} 
                                            onChange={(e) => setSelectedVendor(e.target.value)} 
                                            className="flex-grow text-sm bg-white border-blue-200 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="" disabled>Select a vendor...</option>
                                            {vendors.filter(v => v.status !== 'Inactive').map(vendor => (
                                                <option key={vendor.id} value={vendor.id}>
                                                    {vendor.name} ({vendor.specialty})
                                                </option>
                                            ))}
                                        </select>
                                        <button 
                                            onClick={handleAssignClick} 
                                            disabled={!selectedVendor} 
                                            className="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Assign Vendor
                                        </button>
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Chat */}
                    <div className="hidden lg:block w-2/5 h-full">
                        <MaintenanceChat requestId={request.id} tenantName={request.tenant} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const Maintenance: React.FC = () => {
    const { maintenanceRequests: requests, updateMaintenanceRequest, addMaintenanceRequest, vendors, properties } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('Active Board');
    const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
    const [propertyFilter, setPropertyFilter] = useState('All Properties');
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: string } | null>({ key: 'submittedDate', direction: 'descending' });
    const [searchParams, setSearchParams] = useSearchParams();
    const activeFilter = searchParams.get('filter');
    const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);

    useEffect(() => {
        if (activeFilter) {
            setActiveTab('All Requests');
        }
    }, [activeFilter]);

    const handleAssignVendor = (requestId: string, vendorId: string) => {
        const requestToUpdate = requests.find(req => req.id === requestId);
        if (requestToUpdate) {
            const updatedRequest = { ...requestToUpdate, assignedTo: vendorId, status: 'In Progress' as const };
            updateMaintenanceRequest(updatedRequest);
        }
        setSelectedRequest(null);
    };

    const handleSubmitRequest = (newRequestData: Omit<MaintenanceRequest, 'id' | 'status' | 'submittedDate'>) => {
        const newRequest: MaintenanceRequest = {
            id: `m${Date.now()}`,
            status: 'New',
            submittedDate: new Date().toISOString(),
            ...newRequestData,
        };
        addMaintenanceRequest(newRequest);
        setIsNewRequestModalOpen(false);
    };

    const kanbanColumns: { title: string, status: MaintenanceRequest['status'] }[] = [
        { title: 'New Request', status: 'New' },
        { title: 'In Progress', status: 'In Progress' },
        { title: 'Completed', status: 'Completed' },
    ];

    const filteredRequests = useMemo(() => {
        return requests.filter(req => {
            const matchesSearch = (req.issue.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.property.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesProperty = (propertyFilter === 'All Properties' || req.property === propertyFilter);
            const matchesFilter = !activeFilter ? true :
                activeFilter === 'open' ? ['New', 'In Progress', 'Pending Vendor'].includes(req.status) :
                activeFilter === 'urgent' ? ['Emergency', 'High'].includes(req.priority) : true;
            
            return matchesSearch && matchesProperty && matchesFilter;
        });
    }, [searchTerm, propertyFilter, activeFilter, requests]);
    
    const requestsByStatus = useMemo(() => {
        const grouped: { [key in MaintenanceRequest['status']]?: MaintenanceRequest[] } = {};
        for (const status of ['New', 'In Progress', 'Completed', 'Pending Vendor'] as MaintenanceRequest['status'][]) {
            grouped[status] = filteredRequests
                .filter(req => req.status === status)
                .sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime());
        }
        return grouped;
    }, [filteredRequests]);

    const sortedTableRequests = useMemo(() => {
        let sortableItems = [...filteredRequests];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                const key = sortConfig.key as keyof MaintenanceRequest;
                if (key === 'assignedTo') {
                    const vendorA = vendors.find(v => v.id === a.assignedTo)?.name || '';
                    const vendorB = vendors.find(v => v.id === b.assignedTo)?.name || '';
                    if (vendorA < vendorB) return sortConfig.direction === 'ascending' ? -1 : 1;
                    if (vendorA > vendorB) return sortConfig.direction === 'ascending' ? 1 : -1;
                    return 0;
                }
                if (a[key] < b[key]) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (a[key] > b[key]) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        return sortableItems;
    }, [filteredRequests, sortConfig, vendors]);

    const requestSort = (key: string) => {
        let direction = 'descending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'descending') {
            direction = 'ascending';
        } else {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };
    
    const filterBanner = activeFilter ? (
        <div className="bg-blue-100 border border-blue-200 text-blue-800 text-sm font-medium px-4 py-2 rounded-lg mb-4">
            Filtered by: <strong>{activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Requests</strong>. Select 'All Requests' to clear.
        </div>
    ) : null;

    return (
        <DashboardLayout navItems={MANAGER_NAV} activePath="/manager/maintenance">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-800">Maintenance</h2>
                <p className="text-slate-500 mt-1">Track and manage maintenance requests across your properties.</p>
            </div>

            <div className="flex justify-between items-center mb-6 bg-white p-3 rounded-xl shadow-sm border border-slate-200">
                 <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 p-1 bg-slate-100 rounded-lg">
                        {['Active Board', 'All Requests'].map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${activeTab === tab ? 'bg-white text-blue-600 shadow' : 'text-slate-600 hover:bg-slate-200'}`}>
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center space-x-2">
                        <select value={propertyFilter} onChange={e => setPropertyFilter(e.target.value)} disabled={!!activeFilter} className="text-sm bg-white border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed">
                            <option>All Properties</option>
                            {properties.map(p => <option key={p.name}>{p.name}</option>)}
                        </select>
                        <div className="flex items-center space-x-1 p-1 bg-slate-200 rounded-lg">
                            <button onClick={() => setSearchParams({})} className={`px-3 py-1 text-sm font-semibold rounded-md ${!activeFilter ? 'bg-white text-blue-600 shadow' : 'text-slate-600 hover:bg-slate-300'}`}>All</button>
                            <button onClick={() => setSearchParams({filter: 'open'})} className={`px-3 py-1 text-sm font-semibold rounded-md ${activeFilter === 'open' ? 'bg-white text-blue-600 shadow' : 'text-slate-600 hover:bg-slate-300'}`}>Open</button>
                            <button onClick={() => setSearchParams({filter: 'urgent'})} className={`px-3 py-1 text-sm font-semibold rounded-md ${activeFilter === 'urgent' ? 'bg-white text-blue-600 shadow' : 'text-slate-600 hover:bg-slate-300'}`}>Urgent</button>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon className="w-4 h-4 text-slate-400" />
                        </div>
                        <input type="text" placeholder="Search requests..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg w-72 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <button onClick={() => setIsNewRequestModalOpen(true)} className="flex items-center justify-center bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        <PlusIcon className="w-5 h-5 mr-1" />
                        Add New Request
                    </button>
                </div>
            </div>
            
            {filterBanner}

            <p className="text-sm text-slate-500 my-4">Showing {filteredRequests.length} of {requests.length} requests.</p>

            {activeTab === 'Active Board' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {kanbanColumns.map(({ title, status }) => (
                        <div key={status} className="bg-slate-100 rounded-xl">
                            <div className="p-4 border-b border-slate-200">
                                <h3 className="text-md font-semibold text-slate-700 flex items-center">
                                    {title}
                                    <span className="ml-2 text-sm font-medium text-slate-500 bg-slate-200 rounded-full px-2 py-0.5">
                                        {requestsByStatus[status]?.length || 0}
                                    </span>
                                </h3>
                            </div>
                            <div className="p-4 space-y-4">
                                {requestsByStatus[status]?.map(req => {
                                    const assignedVendor = req.assignedTo ? vendors.find(v => v.id === req.assignedTo) : null;
                                    return (
                                        <div 
                                            key={req.id} 
                                            onClick={() => setSelectedRequest(req)}
                                            className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-transform"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-slate-800 text-sm flex-1 pr-2">{req.issue}</h4>
                                                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full whitespace-nowrap ${getPriorityBadgeClass(req.priority)}`}>
                                                    {req.priority}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-500">Reported by {req.tenant}</p>
                                            {assignedVendor && (
                                                <p className="text-xs text-slate-400 mt-1">Assigned to: {assignedVendor.name}</p>
                                            )}
                                            <div className="flex justify-between items-center mt-4">
                                                <p className="text-xs text-slate-400">{timeAgo(req.submittedDate)}</p>
                                                {req.status === 'Completed' && (
                                                    <button className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full">
                                                        <TrashIcon className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            {activeTab === 'All Requests' && (
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-t border-slate-200 sticky top-0">
                            <tr className="text-xs text-slate-500 uppercase font-semibold">
                                <th className="px-6 py-3">Request</th>
                                <th className="px-6 py-3">
                                    <button onClick={() => requestSort('property')} className="flex items-center space-x-1">
                                        <span>Property</span>
                                        {sortConfig?.key === 'property' && (sortConfig.direction === 'descending' ? <ChevronDownIcon className="w-3 h-3" /> : <ChevronUpIcon className="w-3 h-3" />)}
                                    </button>
                                </th>
                                <th className="px-6 py-3">
                                    <button onClick={() => requestSort('tenant')} className="flex items-center space-x-1">
                                        <span>Tenant</span>
                                        {sortConfig?.key === 'tenant' && (sortConfig.direction === 'descending' ? <ChevronDownIcon className="w-3 h-3" /> : <ChevronUpIcon className="w-3 h-3" />)}
                                    </button>
                                </th>
                                <th className="px-6 py-3">
                                    <button onClick={() => requestSort('assignedTo')} className="flex items-center space-x-1">
                                        <span>Assigned To</span>
                                        {sortConfig?.key === 'assignedTo' && (sortConfig.direction === 'descending' ? <ChevronDownIcon className="w-3 h-3" /> : <ChevronUpIcon className="w-3 h-3" />)}
                                    </button>
                                </th>
                                 <th className="px-6 py-3">
                                    <button onClick={() => requestSort('status')} className="flex items-center space-x-1">
                                        <span>Status</span>
                                        {sortConfig?.key === 'status' && (sortConfig.direction === 'descending' ? <ChevronDownIcon className="w-3 h-3" /> : <ChevronUpIcon className="w-3 h-3" />)}
                                    </button>
                                </th>
                                <th className="px-6 py-3">
                                     <button onClick={() => requestSort('submittedDate')} className="flex items-center space-x-1">
                                        <span>Submitted</span>
                                        {sortConfig?.key === 'submittedDate' && (sortConfig.direction === 'descending' ? <ChevronDownIcon className="w-3 h-3" /> : <ChevronUpIcon className="w-3 h-3" />)}
                                    </button>
                                </th>
                                <th className="px-6 py-3 text-right"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {sortedTableRequests.map(req => {
                                const assignedVendor = req.assignedTo ? vendors.find(v => v.id === req.assignedTo) : null;
                                return (
                                <tr key={req.id} onClick={() => setSelectedRequest(req)} className="hover:bg-slate-50 transition-colors cursor-pointer">
                                    <td className="px-6 py-4 font-semibold text-slate-800 text-sm">{req.issue}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{req.property}<br/><span className="text-xs text-slate-500">{req.unit}</span></td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{req.tenant}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{assignedVendor?.name || '—'}</td>
                                    <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(req.status)}`}>{req.status}</span></td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{new Date(req.submittedDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-slate-500 hover:text-slate-700 p-1 rounded-full hover:bg-slate-200" onClick={e => e.stopPropagation()}>
                                            <EllipsisVerticalIcon className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedRequest && (
                <MaintenanceDetailModal 
                    request={selectedRequest} 
                    onClose={() => setSelectedRequest(null)}
                    onAssignVendor={handleAssignVendor}
                    vendors={vendors}
                />
            )}
            
            <ManagerNewRequestModal
                isOpen={isNewRequestModalOpen}
                onClose={() => setIsNewRequestModalOpen(false)}
                onSubmit={handleSubmitRequest}
                properties={properties}
            />
        </DashboardLayout>
    );
};

export default Maintenance;
