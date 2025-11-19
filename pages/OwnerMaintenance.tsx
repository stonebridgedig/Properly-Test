
import React, { useState, useMemo } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { OWNER_NAV } from '../constants';
import { BuildingIcon, ChevronDownIcon, CheckCircleIcon, SearchIcon, BellIcon, WrenchIcon, XMarkIcon } from '../components/Icons';
import { useData } from '../contexts/DataContext';
import type { MaintenanceRequest } from '../types';

const currentOwner = 'Greenleaf Investments';

const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
        case 'Emergency': return 'bg-red-100 text-red-700';
        case 'High': return 'bg-rose-100 text-rose-700';
        case 'Medium': return 'bg-amber-100 text-amber-700';
        case 'Low': return 'bg-sky-100 text-sky-700';
        default: return 'bg-slate-100 text-slate-700';
    }
};

const getStatusBadgeClass = (status: string) => {
    switch (status) {
        case 'New': return 'bg-blue-100 text-blue-700';
        case 'In Progress': return 'bg-amber-100 text-amber-700';
        case 'Pending Vendor': return 'bg-violet-100 text-violet-700';
        case 'Completed': return 'bg-green-100 text-green-700';
        default: return 'bg-slate-100 text-slate-700';
    }
};

const MaintenanceDetailModal: React.FC<{ request: MaintenanceRequest | null; onClose: () => void }> = ({ request, onClose }) => {
    if (!request) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">{request.issue}</h2>
                         <p className="text-sm text-slate-500 mt-1">{request.property} • {request.unit}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200 transition-colors">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="p-6 max-h-[75vh] overflow-y-auto">
                     {request.imageUrl && (
                        <div className="mb-6 rounded-lg overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
                            <img src={request.imageUrl} alt="Maintenance Issue" className="w-full h-64 object-contain bg-slate-900/5" />
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status</p>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${getStatusBadgeClass(request.status)}`}>
                                {request.status}
                            </span>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Priority</p>
                             <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase border ${getPriorityBadgeClass(request.priority).replace('bg-', 'border-').replace('text-', 'text-')}`}>
                                {request.priority}
                            </span>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Reported Date</p>
                            <p className="text-sm font-medium text-slate-700">{new Date(request.submittedDate).toLocaleDateString()}</p>
                        </div>
                         <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tenant</p>
                            <p className="text-sm font-medium text-slate-700">{request.tenant}</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-slate-900 mb-2">Description</h3>
                        <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
                            {request.details}
                        </p>
                    </div>
                </div>
                
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

const OwnerMaintenance: React.FC = () => {
    const { maintenanceRequests, properties } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [propertyFilter, setPropertyFilter] = useState('All Properties');
    const [statusFilter, setStatusFilter] = useState('All Statuses');
    const [priorityFilter, setPriorityFilter] = useState('All Priorities');
    const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);

    const ownerProperties = useMemo(() => properties.filter(p => p.owner === currentOwner), [properties]);
    const ownerPropertyNames = useMemo(() => ownerProperties.map(p => p.name), [ownerProperties]);

    const filteredRequests = useMemo(() => {
        return maintenanceRequests.filter(req => {
            if (!ownerPropertyNames.includes(req.property)) return false;

            const matchesSearch = req.issue.toLowerCase().includes(searchTerm.toLowerCase()) || req.details.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesProperty = propertyFilter === 'All Properties' || req.property === propertyFilter;
            const matchesStatus = statusFilter === 'All Statuses' || req.status === statusFilter;
            const matchesPriority = priorityFilter === 'All Priorities' || req.priority === priorityFilter;
            return matchesSearch && matchesProperty && matchesStatus && matchesPriority;
        });
    }, [maintenanceRequests, searchTerm, propertyFilter, statusFilter, priorityFilter, ownerPropertyNames]);

    return (
        <DashboardLayout navItems={OWNER_NAV} activePath="/owner/maintenance">
             <div className="max-w-7xl mx-auto h-full flex flex-col">
                <div className="mb-6">
                    <h2 className="text-3xl font-bold text-slate-800">Maintenance</h2>
                    <p className="text-slate-500 mt-1">View active and past maintenance requests on your properties.</p>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <div className="flex flex-1 items-center space-x-3 overflow-x-auto w-full md:w-auto p-1">
                        {/* Property Filter */}
                        <div className="relative min-w-[180px]">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <BuildingIcon className="w-5 h-5 text-slate-400" />
                            </div>
                            <select
                                value={propertyFilter}
                                onChange={e => setPropertyFilter(e.target.value)}
                                className="appearance-none w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-slate-50 transition-all cursor-pointer"
                            >
                                <option>All Properties</option>
                                {ownerProperties.map(p => <option key={p.name}>{p.name}</option>)}
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <ChevronDownIcon className="w-4 h-4 text-slate-400" />
                            </div>
                        </div>

                        {/* Status Filter */}
                        <div className="relative min-w-[160px]">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <CheckCircleIcon className="w-5 h-5 text-slate-400" />
                            </div>
                            <select
                                value={statusFilter}
                                onChange={e => setStatusFilter(e.target.value)}
                                className="appearance-none w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-slate-50 transition-all cursor-pointer"
                            >
                                <option value="All Statuses">All Statuses</option>
                                <option>New</option>
                                <option>In Progress</option>
                                <option>Pending Vendor</option>
                                <option>Completed</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <ChevronDownIcon className="w-4 h-4 text-slate-400" />
                            </div>
                        </div>

                        {/* Priority Filter */}
                        <div className="relative min-w-[160px]">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <BellIcon className="w-5 h-5 text-slate-400" />
                            </div>
                            <select
                                value={priorityFilter}
                                onChange={e => setPriorityFilter(e.target.value)}
                                className="appearance-none w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-slate-50 transition-all cursor-pointer"
                            >
                                <option value="All Priorities">All Priorities</option>
                                <option>Emergency</option>
                                <option>High</option>
                                <option>Medium</option>
                                <option>Low</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <ChevronDownIcon className="w-4 h-4 text-slate-400" />
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="relative flex-1 max-w-md">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon className="w-5 h-5 text-slate-400" />
                            </div>
                            <input 
                                type="text" 
                                placeholder="Search requests..." 
                                value={searchTerm} 
                                onChange={e => setSearchTerm(e.target.value)} 
                                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400 transition-all" 
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
                    <div className="overflow-auto flex-1">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b sticky top-0 z-10">
                                <tr className="text-xs text-slate-500 uppercase font-semibold">
                                    <th className="px-6 py-3">Issue</th>
                                    <th className="px-6 py-3">Location</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Submitted</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {filteredRequests.map(req => (
                                    <tr 
                                        key={req.id} 
                                        onClick={() => setSelectedRequest(req)}
                                        className="hover:bg-slate-50 transition-colors cursor-pointer group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <p className="font-semibold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">{req.issue}</p>
                                                <span className={`ml-3 px-2 py-0.5 rounded-full text-xs font-bold border ${getPriorityBadgeClass(req.priority).replace('bg-', 'border-').replace('text-', 'text-')}`}>
                                                    {req.priority}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium text-slate-700">{req.property}</p>
                                            <p className="text-xs text-slate-500">{req.unit}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(req.status)}`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {new Date(req.submittedDate).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                                {filteredRequests.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                            <WrenchIcon className="mx-auto h-12 w-12 text-slate-300 mb-2" />
                                            No maintenance requests found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            {selectedRequest && (
                <MaintenanceDetailModal 
                    request={selectedRequest} 
                    onClose={() => setSelectedRequest(null)} 
                />
            )}
        </DashboardLayout>
    );
};

export default OwnerMaintenance;
