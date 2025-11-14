import React, { useState, useMemo, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { OWNER_NAV } from '../constants';
import { SearchIcon, XMarkIcon, MapPinIcon, UsersIcon, ClockIcon, ChevronUpIcon, ChevronDownIcon, WrenchScrewdriverIcon } from '../components/Icons';
import type { MaintenanceRequest, Vendor } from '../types';
import { useData } from '../contexts/DataContext';

const currentOwner = 'Greenleaf Investments';

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

const MaintenanceDetailModal: React.FC<{
    request: MaintenanceRequest;
    onClose: () => void;
    vendors: Vendor[];
}> = ({ request, onClose, vendors }) => {
    if (!request) return null;

    const assignedVendor = request.assignedTo ? vendors.find(v => v.id === request.assignedTo) : null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl transform transition-all duration-300 m-4" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b border-slate-200">
                    <div className="flex items-center">
                        <h2 className="text-xl font-bold text-slate-800">{request.issue}</h2>
                        <span className={`ml-3 px-2 py-0.5 text-xs font-semibold rounded-full whitespace-nowrap ${getPriorityBadgeClass(request.priority)}`}>
                            {request.priority}
                        </span>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6 max-h-[80vh] overflow-y-auto">
                    {request.imageUrl && (
                        <div className="mb-6">
                            <img src={request.imageUrl} alt="Maintenance issue" className="rounded-lg max-h-80 w-full object-cover" />
                        </div>
                    )}
                    <div className="space-y-4">
                        <h3 className="text-md font-semibold text-slate-700 border-b pb-2">Details</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-start">
                                <MapPinIcon className="w-5 h-5 text-slate-400 mr-3 mt-0.5 flex-shrink-0"/>
                                <div>
                                    <p className="font-semibold text-slate-600">Location</p>
                                    <p className="text-slate-800">{request.property}</p>
                                    <p className="text-slate-500">{request.building}, {request.unit}</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <UsersIcon className="w-5 h-5 text-slate-400 mr-3 mt-0.5 flex-shrink-0"/>
                                <div>
                                    <p className="font-semibold text-slate-600">Reported By</p>
                                    <p className="text-slate-800">{request.tenant}</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <ClockIcon className="w-5 h-5 text-slate-400 mr-3 mt-0.5 flex-shrink-0"/>
                                <div>
                                    <p className="font-semibold text-slate-600">Submitted</p>
                                    <p className="text-slate-800">{new Date(request.submittedDate).toLocaleString()}</p>
                                </div>
                            </div>
                             {assignedVendor && (
                                <div className="flex items-start">
                                    <WrenchScrewdriverIcon className="w-5 h-5 text-slate-400 mr-3 mt-0.5 flex-shrink-0"/>
                                    <div>
                                        <p className="font-semibold text-slate-600">Assigned To</p>
                                        <p className="text-slate-800">{assignedVendor.name}</p>
                                        <p className="text-slate-500">{assignedVendor.specialty}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                         <div>
                            <h3 className="text-md font-semibold text-slate-700 border-b pb-2 mt-6 mb-3">Description</h3>
                            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{request.details}</p>
                        </div>
                    </div>
                </div>
                 <div className="flex justify-end items-center p-4 bg-slate-50 border-t border-slate-200 rounded-b-lg">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50">Close</button>
                </div>
            </div>
        </div>
    );
};


const OwnerMaintenance: React.FC = () => {
    const { maintenanceRequests: allOwnerRequests, properties, vendors } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [propertyFilter, setPropertyFilter] = useState('All Properties');
    const [statusFilter, setStatusFilter] = useState('All');
    const [priorityFilter, setPriorityFilter] = useState('All');
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: string } | null>({ key: 'submittedDate', direction: 'descending' });
    const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);

    const ownerProperties = useMemo(() => properties.filter(p => p.owner === currentOwner), [properties]);
    const ownerPropertyNames = useMemo(() => ownerProperties.map(p => p.name), [ownerProperties]);

    const requests = useMemo(() => {
        return allOwnerRequests.filter(p => ownerPropertyNames.includes(p.property));
    }, [allOwnerRequests, ownerPropertyNames]);

    const filteredRequests = useMemo(() => {
        return requests.filter(req => 
            (req.issue.toLowerCase().includes(searchTerm.toLowerCase()) ||
             req.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
             req.property.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (propertyFilter === 'All Properties' || req.property === propertyFilter) &&
            (statusFilter === 'All' || req.status === statusFilter) &&
            (priorityFilter === 'All' || req.priority === priorityFilter)
        );
    }, [searchTerm, propertyFilter, statusFilter, priorityFilter, requests]);
    
    const sortedRequests = useMemo(() => {
        let sortableItems = [...filteredRequests];
        if (sortConfig) {
            sortableItems.sort((a, b) => {
                const key = sortConfig.key as keyof MaintenanceRequest;
                if (a[key] < b[key]) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (a[key] > b[key]) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        return sortableItems;
    }, [filteredRequests, sortConfig]);

    const requestSort = (key: string) => {
        let direction = 'descending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'descending') {
            direction = 'ascending';
        }
        setSortConfig({ key, direction });
    };

    return (
        <DashboardLayout navItems={OWNER_NAV} activePath="/owner/maintenance">
            <h2 className="text-3xl font-bold text-slate-800">Maintenance Requests</h2>
            <p className="text-slate-500 mt-1 mb-6">View maintenance requests for your properties.</p>

            <div className="p-4 bg-white rounded-lg shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                    <label className="text-xs font-medium text-slate-600">Property</label>
                    <select value={propertyFilter} onChange={e => setPropertyFilter(e.target.value)} className="mt-1 w-full text-sm bg-white border-slate-300 rounded-md shadow-sm">
                        <option>All Properties</option>
                        {ownerProperties.map(p => <option key={p.name}>{p.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-xs font-medium text-slate-600">Status</label>
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="mt-1 w-full text-sm bg-white border-slate-300 rounded-md shadow-sm">
                        <option value="All">All Statuses</option>
                        <option>New</option><option>In Progress</option><option>Pending Vendor</option><option>Completed</option>
                    </select>
                </div>
                <div>
                    <label className="text-xs font-medium text-slate-600">Priority</label>
                    <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} className="mt-1 w-full text-sm bg-white border border-slate-300 rounded-md shadow-sm">
                        <option value="All">All Priorities</option>
                        <option>Emergency</option><option>High</option><option>Medium</option><option>Low</option>
                    </select>
                </div>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><SearchIcon className="w-4 h-4 text-slate-400" /></div>
                    <input type="text" placeholder="Search requests..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9 w-full text-sm bg-white border border-slate-300 rounded-lg" />
                </div>
            </div>

            <p className="text-sm text-slate-500 my-4">Showing {sortedRequests.length} requests.</p>
            
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b">
                        <tr className="text-xs text-slate-500 uppercase font-semibold">
                            <th className="px-6 py-3">Request</th>
                            <th className="px-6 py-3">Property & Unit</th>
                            <th className="px-6 py-3">Tenant</th>
                            <th className="px-6 py-3">Priority</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">
                                <button onClick={() => requestSort('submittedDate')} className="flex items-center space-x-1">
                                    <span>Submitted</span>
                                    {sortConfig?.key === 'submittedDate' && (sortConfig.direction === 'descending' ? <ChevronDownIcon className="w-3 h-3" /> : <ChevronUpIcon className="w-3 h-3" />)}
                                </button>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {sortedRequests.map(req => (
                            <tr
                                key={req.id}
                                onClick={() => setSelectedRequest(selectedRequest?.id === req.id ? null : req)}
                                className={`hover:bg-slate-50 transition-colors cursor-pointer ${selectedRequest?.id === req.id ? 'bg-blue-50' : ''}`}
                            >
                                <td className="px-6 py-4 font-semibold text-slate-800 text-sm">{req.issue}</td>
                                <td className="px-6 py-4 text-sm text-slate-600">{req.property} - {req.unit}</td>
                                <td className="px-6 py-4 text-sm text-slate-600">{req.tenant}</td>
                                <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityBadgeClass(req.priority)}`}>{req.priority}</span></td>
                                <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(req.status)}`}>{req.status}</span></td>
                                <td className="px-6 py-4 text-sm text-slate-600">{new Date(req.submittedDate).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedRequest && <MaintenanceDetailModal request={selectedRequest} onClose={() => setSelectedRequest(null)} vendors={vendors} />}
        </DashboardLayout>
    );
};

export default OwnerMaintenance;