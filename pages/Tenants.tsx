
import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { MANAGER_NAV } from '../constants';
import { 
    BuildingIcon, ChevronDownIcon, CheckCircleIcon, SearchIcon, PlusIcon, 
    UserCircleIcon, UsersIcon, XMarkIcon, MessageIcon, PhoneIcon, 
    EnvelopeIcon, HomeIcon, CalendarIcon, DollarIcon, WrenchIcon, 
    DocumentTextIcon, ClipboardListIcon, ChevronRightIcon, PencilIcon, TrashIcon
} from '../components/Icons';
import { useData } from '../contexts/DataContext';
import type { Tenant, RentRollItem, MaintenanceRequest, Document } from '../types';

// --- Helper Functions ---

const getInitials = (name: string) => {
    const words = name.split(' ');
    if (words.length > 1) {
        return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
};

const getAvatarColor = (name: string) => {
    const colors = ['bg-blue-100 text-blue-700', 'bg-green-100 text-green-700', 'bg-amber-100 text-amber-700', 'bg-violet-100 text-violet-700', 'bg-rose-100 text-rose-700', 'bg-cyan-100 text-cyan-700'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
};

const TenantDetailModal: React.FC<{ tenant: Tenant; onClose: () => void; }> = ({ tenant, onClose }) => {
    const { rentRoll, maintenanceRequests, documents } = useData();
    const navigate = useNavigate();

    // Filter related data
    const tenantFinancials = useMemo(() => {
        // Matching by name as ID might not be consistent in mock data, in real app use ID
        return rentRoll.filter(r => r.tenantName === tenant.name);
    }, [rentRoll, tenant]);

    const tenantMaintenance = useMemo(() => {
        return maintenanceRequests.filter(m => m.tenant === tenant.name);
    }, [maintenanceRequests, tenant]);

    const tenantDocuments = useMemo(() => {
        return documents.filter(d => 
            (d.unit === tenant.unitName && d.property === tenant.propertyName) || 
            (d.type === 'Lease' && d.name.includes(tenant.name.split(' ')[1]))
        );
    }, [documents, tenant]);

    const balance = tenantFinancials.reduce((acc, item) => acc + item.balance, 0);
    const monthlyRent = tenantFinancials.length > 0 ? tenantFinancials[0].rent : 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 ring-1 ring-slate-900/5">
                
                {/* Header */}
                <div className="flex-shrink-0 px-8 py-6 bg-gradient-to-r from-white to-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-10">
                    <div className="flex items-center gap-6">
                        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-sm ring-4 ring-white ${getAvatarColor(tenant.name)}`}>
                             {getInitials(tenant.name)}
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{tenant.name}</h2>
                            <div className="flex flex-col sm:flex-row sm:items-center mt-2 text-sm font-medium text-slate-500 gap-3 sm:gap-6">
                                <div className="flex items-center hover:text-blue-600 transition-colors cursor-pointer group">
                                    <div className="p-1.5 bg-white border border-slate-200 rounded-full mr-2 group-hover:border-blue-200 group-hover:text-blue-600 transition-colors shadow-sm"><EnvelopeIcon className="w-3.5 h-3.5"/></div>
                                    {tenant.email}
                                </div>
                                <div className="flex items-center hover:text-blue-600 transition-colors cursor-pointer group">
                                    <div className="p-1.5 bg-white border border-slate-200 rounded-full mr-2 group-hover:border-blue-200 group-hover:text-blue-600 transition-colors shadow-sm"><PhoneIcon className="w-3.5 h-3.5"/></div>
                                    {tenant.phone}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 self-start sm:self-auto">
                        {tenant.status === 'Pending' && (
                            <button 
                                onClick={() => navigate(`/manager/tenants/${tenant.id}/screening`)}
                                className="flex items-center px-4 py-2 bg-blue-600 text-white font-semibold text-sm rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                            >
                                <ClipboardListIcon className="w-4 h-4 mr-2" />
                                View Application
                            </button>
                        )}
                        <button className="flex items-center px-4 py-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold text-sm rounded-lg transition-all shadow-sm hover:shadow">
                            <PencilIcon className="w-4 h-4 mr-2 text-slate-500" />
                            Edit Profile
                        </button>
                        <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6 lg:p-8">
                    {/* Stats Grid */}
                     <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200/60 flex flex-col justify-between hover:border-blue-200 transition-colors">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Monthly Rent</p>
                            <div className="flex items-baseline">
                                <span className="text-2xl font-bold text-slate-800">${monthlyRent.toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200/60 flex flex-col justify-between hover:border-blue-200 transition-colors">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Balance Due</p>
                            <div className="flex items-baseline">
                                <span className={`text-2xl font-bold ${balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    ${balance.toLocaleString()}
                                </span>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200/60 flex flex-col justify-between hover:border-blue-200 transition-colors">
                             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Lease Ends</p>
                             <div className="flex items-center gap-2 mt-1">
                                <span className="text-lg font-bold text-slate-800">
                                    {tenant.leaseEndDate ? new Date(tenant.leaseEndDate).toLocaleDateString() : 'N/A'}
                                </span>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200/60 flex flex-col justify-between hover:border-blue-200 transition-colors">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status</p>
                             <div className="flex items-baseline">
                                <span className={`px-2.5 py-1 rounded-full text-sm font-bold uppercase ${
                                    tenant.status === 'Active' ? 'bg-green-100 text-green-700' : 
                                    tenant.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                                }`}>
                                    {tenant.status}
                                </span>
                            </div>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                         {/* Left: Lease & Unit Details */}
                         <div className="xl:col-span-2 space-y-6">
                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center">
                                    <HomeIcon className="w-4 h-4 mr-2 text-slate-400" /> Residence Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 mb-1">Property</p>
                                        <p className="text-sm font-bold text-slate-800">{tenant.propertyName}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 mb-1">Unit</p>
                                        <p className="text-sm font-bold text-slate-800">{tenant.unitName}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 mb-1">Lease Type</p>
                                        <p className="text-sm font-bold text-slate-800">{tenant.leaseType}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 mb-1">Move-in Date</p>
                                        <p className="text-sm font-bold text-slate-800">Jan 15, 2023</p>
                                    </div>
                                </div>
                            </div>

                            {/* Maintenance History */}
                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center">
                                        <WrenchIcon className="w-4 h-4 mr-2 text-slate-400" /> Recent Maintenance
                                    </h3>
                                </div>
                                {tenantMaintenance.length > 0 ? (
                                    <div className="space-y-3">
                                        {tenantMaintenance.slice(0, 3).map(req => (
                                            <div key={req.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-800">{req.issue}</p>
                                                    <p className="text-xs text-slate-500">{new Date(req.submittedDate).toLocaleDateString()}</p>
                                                </div>
                                                <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                                                    req.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                    {req.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-500 italic">No recent maintenance requests.</p>
                                )}
                            </div>
                         </div>

                         {/* Right: Financials & Docs */}
                         <div className="space-y-6">
                             {/* Payment History Widget */}
                             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                 <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center">
                                     <DollarIcon className="w-4 h-4 mr-2 text-slate-400" /> Payment History
                                 </h3>
                                 <div className="space-y-3">
                                    {tenantFinancials.slice(0, 4).map(item => (
                                        <div key={item.id} className="flex justify-between items-center p-2 rounded hover:bg-slate-50 transition-colors">
                                            <div>
                                                <p className="text-sm font-semibold text-slate-700">{new Date(item.dueDate).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}</p>
                                                <p className="text-xs text-slate-400">{item.status}</p>
                                            </div>
                                            <span className={`text-sm font-bold ${item.status === 'Paid' ? 'text-green-600' : 'text-red-500'}`}>
                                                ${item.rent.toLocaleString()}
                                            </span>
                                        </div>
                                    ))}
                                    {tenantFinancials.length === 0 && <p className="text-sm text-slate-400 italic">No payment history.</p>}
                                 </div>
                             </div>

                             {/* Documents Widget */}
                             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                 <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center">
                                     <DocumentTextIcon className="w-4 h-4 mr-2 text-slate-400" /> Documents
                                 </h3>
                                 <div className="space-y-2">
                                     {tenantDocuments.length > 0 ? (
                                         tenantDocuments.map(doc => (
                                            <div key={doc.id} className="flex items-center justify-between p-2 rounded hover:bg-slate-50 transition-colors cursor-pointer group">
                                                <div className="flex items-center overflow-hidden">
                                                    <DocumentTextIcon className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
                                                    <span className="text-sm text-slate-600 truncate group-hover:text-blue-600 transition-colors">{doc.name}</span>
                                                </div>
                                            </div>
                                         ))
                                     ) : (
                                         <p className="text-sm text-slate-400 italic">No documents found.</p>
                                     )}
                                 </div>
                             </div>
                         </div>
                     </div>
                </div>
            </div>
        </div>
    );
};

const Tenants: React.FC = () => {
    const { tenants, properties, deleteTenants } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [propertyFilter, setPropertyFilter] = useState('All Properties');
    const [statusFilter, setStatusFilter] = useState('All Statuses');
    const [activeTab, setActiveTab] = useState<'Residents' | 'Applicants'>('Residents');
    
    const [selectedTenants, setSelectedTenants] = useState<Set<string>>(new Set());
    const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
    const [isConfirmRemoveOpen, setIsConfirmRemoveOpen] = useState(false);

    const filteredTenants = useMemo(() => {
        return tenants.filter(tenant => {
            const isApplicant = tenant.status === 'Pending';
            if (activeTab === 'Residents' && isApplicant) return false;
            if (activeTab === 'Applicants' && !isApplicant) return false;

            const matchesSearch = 
                tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                tenant.unitName.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesProperty = propertyFilter === 'All Properties' || tenant.propertyName === propertyFilter;
            const matchesStatus = statusFilter === 'All Statuses' || tenant.status === statusFilter;

            return matchesSearch && matchesProperty && (activeTab === 'Applicants' ? true : matchesStatus);
        });
    }, [tenants, searchTerm, propertyFilter, statusFilter, activeTab]);

    const handleSelectTenant = (id: string, checked: boolean) => {
        setSelectedTenants(prev => {
            const newSet = new Set(prev);
            if (checked) newSet.add(id);
            else newSet.delete(id);
            return newSet;
        });
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedTenants(new Set(filteredTenants.map(t => t.id)));
        } else {
            setSelectedTenants(new Set());
        }
    };

    const isAllSelected = filteredTenants.length > 0 && selectedTenants.size === filteredTenants.length;

    const handleDelete = () => {
        deleteTenants(Array.from(selectedTenants));
        setSelectedTenants(new Set());
        setIsConfirmRemoveOpen(false);
    };

    return (
        <DashboardLayout navItems={MANAGER_NAV} activePath="/manager/tenants">
            <div className="h-full flex flex-col">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800">Tenants</h2>
                        <p className="text-slate-500 mt-1">Manage current residents and applications.</p>
                    </div>
                    <button className="flex items-center bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                        <PlusIcon className="w-5 h-5 mr-2" /> Add Tenant
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl w-fit mb-6">
                    <button 
                        onClick={() => setActiveTab('Residents')}
                        className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'Residents' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Residents
                    </button>
                    <button 
                        onClick={() => setActiveTab('Applicants')}
                        className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'Applicants' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Applicants
                    </button>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <div className="flex flex-1 items-center space-x-3 overflow-x-auto w-full md:w-auto p-1">
                        {/* Property Filter */}
                        <div className="relative min-w-[200px]">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <BuildingIcon className="w-5 h-5 text-slate-400" />
                            </div>
                            <select
                                value={propertyFilter}
                                onChange={e => setPropertyFilter(e.target.value)}
                                className="appearance-none w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-slate-50 transition-all cursor-pointer"
                            >
                                <option>All Properties</option>
                                {properties.map(p => <option key={p.name}>{p.name}</option>)}
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <ChevronDownIcon className="w-4 h-4 text-slate-400" />
                            </div>
                        </div>

                        {/* Status Filter - Only for Residents tab */}
                        {activeTab === 'Residents' && (
                            <div className="relative min-w-[180px]">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <CheckCircleIcon className="w-5 h-5 text-slate-400" />
                                </div>
                                <select
                                    value={statusFilter}
                                    onChange={e => setStatusFilter(e.target.value)}
                                    className="appearance-none w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-slate-50 transition-all cursor-pointer"
                                >
                                    <option>All Statuses</option>
                                    <option>Active</option>
                                    <option>Past</option>
                                    <option>Future</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <ChevronDownIcon className="w-4 h-4 text-slate-400" />
                                </div>
                            </div>
                        )}
                        
                        {/* Search Bar */}
                        <div className="relative flex-1 max-w-md">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon className="w-5 h-5 text-slate-400" />
                            </div>
                            <input 
                                type="text" 
                                placeholder="Search tenants..." 
                                value={searchTerm} 
                                onChange={e => setSearchTerm(e.target.value)} 
                                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400 transition-all" 
                            />
                        </div>
                    </div>
                </div>
                
                {selectedTenants.size > 0 && (
                     <div className="mb-4 flex items-center space-x-2 bg-slate-100 p-2 rounded-lg">
                        <span className="text-sm font-semibold text-slate-700 px-2">{selectedTenants.size} selected</span>
                        <button onClick={() => setIsConfirmRemoveOpen(true)} className="px-3 py-1.5 text-sm font-semibold bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center">
                            <TrashIcon className="w-4 h-4 mr-1.5" /> Remove
                        </button>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-auto flex-1">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                            <tr className="text-xs text-slate-500 uppercase font-semibold">
                                <th className="px-6 py-3 w-12 text-center">
                                    <input 
                                        type="checkbox" 
                                        checked={isAllSelected} 
                                        onChange={(e) => handleSelectAll(e.target.checked)} 
                                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                                    />
                                </th>
                                <th className="px-6 py-3">Tenant</th>
                                <th className="px-6 py-3">Property</th>
                                <th className="px-6 py-3">Contact</th>
                                <th className="px-6 py-3">Status</th>
                                {activeTab === 'Residents' && <th className="px-6 py-3">Lease End</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {filteredTenants.map(tenant => {
                                const isSelected = selectedTenants.has(tenant.id);
                                return (
                                    <tr 
                                        key={tenant.id} 
                                        onClick={() => setSelectedTenant(tenant)}
                                        className={`transition-colors cursor-pointer group ${isSelected ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}
                                    >
                                        <td className="px-6 py-4 text-center" onClick={e => e.stopPropagation()}>
                                            <input 
                                                type="checkbox" 
                                                checked={isSelected}
                                                onChange={(e) => handleSelectTenant(tenant.id, e.target.checked)}
                                                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className={`h-10 w-10 rounded-full flex-shrink-0 mr-3 flex items-center justify-center text-sm font-bold ${getAvatarColor(tenant.name)}`}>
                                                    {getInitials(tenant.name)}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">{tenant.name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium text-slate-800">{tenant.propertyName}</p>
                                            <p className="text-xs text-slate-500">{tenant.unitName}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            <p>{tenant.email}</p>
                                            <p className="text-xs text-slate-400">{tenant.phone}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 text-xs font-bold rounded-full uppercase border ${
                                                tenant.status === 'Active' ? 'bg-green-50 text-green-700 border-green-100' : 
                                                tenant.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-slate-50 text-slate-600 border-slate-100'
                                            }`}>
                                                {tenant.status}
                                            </span>
                                        </td>
                                        {activeTab === 'Residents' && (
                                            <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                                                {tenant.leaseEndDate ? new Date(tenant.leaseEndDate).toLocaleDateString() : '—'}
                                            </td>
                                        )}
                                    </tr>
                                );
                            })}
                            {filteredTenants.length === 0 && (
                                <tr>
                                    <td colSpan={activeTab === 'Residents' ? 6 : 5} className="px-6 py-12 text-center text-slate-500">
                                        <UsersIcon className="mx-auto h-12 w-12 text-slate-300 mb-2" />
                                        No tenants found matching your filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {selectedTenant && <TenantDetailModal tenant={selectedTenant} onClose={() => setSelectedTenant(null)} />}
            
            {/* Simplified Confirm Modal for demo */}
            {isConfirmRemoveOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60]">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold text-slate-800 mb-2">Delete Tenants?</h2>
                        <p className="text-slate-600 mb-6">Are you sure you want to remove {selectedTenants.size} selected tenant(s)? This action cannot be undone.</p>
                        <div className="flex justify-end space-x-3">
                            <button onClick={() => setIsConfirmRemoveOpen(false)} className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg">Cancel</button>
                            <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Remove</button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default Tenants;
