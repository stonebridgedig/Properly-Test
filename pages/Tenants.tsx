
import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { MANAGER_NAV, properties } from '../constants';
import { SearchIcon, PlusIcon, ChevronUpIcon, ChevronDownIcon, XMarkIcon, MessageIcon, DocumentIcon, TrashIcon } from '../components/Icons';
import type { Tenant, Unit } from '../types';
import { useData } from '../contexts/DataContext';


const InviteTenantModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSendInvite: (invite: { email: string, propertyName: string, unitName: string }) => void;
    properties: typeof properties;
}> = ({ isOpen, onClose, onSendInvite, properties }) => {
    const [email, setEmail] = useState('');
    const [selectedProperty, setSelectedProperty] = useState('');
    const [selectedUnit, setSelectedUnit] = useState('');
    const [availableUnits, setAvailableUnits] = useState<Unit[]>([]);

    useEffect(() => {
        if (isOpen) {
            setEmail('');
            setSelectedProperty('');
            setSelectedUnit('');
            setAvailableUnits([]);
        }
    }, [isOpen]);

    useEffect(() => {
        if (selectedProperty) {
            const prop = properties.find(p => p.name === selectedProperty);
            if (prop) {
                const vacantUnits = prop.buildings.flatMap(b => b.units.filter(u => u.status === 'Vacant'));
                setAvailableUnits(vacantUnits);
                setSelectedUnit(''); // Reset unit selection
            }
        } else {
            setAvailableUnits([]);
        }
    }, [selectedProperty, properties]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email && selectedProperty && selectedUnit) {
            onSendInvite({ email, propertyName: selectedProperty, unitName: selectedUnit });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg transform transition-all duration-300">
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-between items-center p-6 border-b border-slate-200">
                        <h2 className="text-2xl font-bold text-slate-800">Invite New Tenant</h2>
                        <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="p-6 space-y-4">
                        <p className="text-sm text-slate-600">Send an invitation to a prospective tenant. They will receive an email to create their account and complete their profile.</p>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700">Tenant Email</label>
                            <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm" placeholder="e.g., tenant@email.com" />
                        </div>
                        <div>
                            <label htmlFor="property" className="block text-sm font-medium text-slate-700">Property</label>
                            <select id="property" value={selectedProperty} onChange={e => setSelectedProperty(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm">
                                <option value="" disabled>Select property</option>
                                {properties.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="unit" className="block text-sm font-medium text-slate-700">Unit</label>
                            <select id="unit" value={selectedUnit} onChange={e => setSelectedUnit(e.target.value)} required disabled={!selectedProperty} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm disabled:bg-slate-50">
                                <option value="" disabled>Select unit</option>
                                {availableUnits.map(u => <option key={u.name} value={u.name}>{u.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end items-center p-6 bg-slate-50 border-t border-slate-200 rounded-b-lg space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700">Send Invitation</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const getRentStatusBadge = (status: Tenant['rentStatus']) => {
    switch (status) {
        case 'Paid': return 'bg-green-100 text-green-700';
        case 'Upcoming': return 'bg-blue-100 text-blue-700';
        case 'Overdue': return 'bg-red-100 text-red-700';
        case 'N/A': return 'bg-slate-100 text-slate-700';
        default: return 'bg-slate-100 text-slate-700';
    }
};

const getLeaseTypeBadge = (type: Tenant['leaseType']) => {
    switch (type) {
        case 'Fixed': return 'bg-gray-100 text-gray-700';
        case 'Month-to-Month': return 'bg-purple-100 text-purple-700';
        default: return 'bg-slate-100 text-slate-700';
    }
};

const TenantDetailModal: React.FC<{ 
    tenant: Tenant | null; 
    onClose: () => void; 
    onUpdate: (tenant: Tenant) => void;
}> = ({ tenant, onClose, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Tenant | null>(null);

    useEffect(() => {
        if (tenant) {
            setFormData(tenant);
        }
        setIsEditing(false); // Reset edit mode when tenant changes
    }, [tenant]);

    if (!tenant || !formData) return null;

    const handleSave = () => {
        onUpdate(formData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData(tenant); // Revert changes
        setIsEditing(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const newFormData = { ...formData, [name]: value };

        if (name === 'leaseType' && value === 'Month-to-Month') {
            newFormData.leaseEndDate = '';
        }

        setFormData(newFormData as Tenant);
    };

    const property = properties.find(p => p.name === tenant.propertyName);
    const unitInfo = property?.buildings
        .flatMap(b => b.units)
        .find(u => u.name === tenant.unitName);
    const tenantInUnit = unitInfo?.tenants.find(t => t.name === tenant.name);

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 transition-opacity duration-300"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-lg h-auto flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 border-b border-slate-200">
                    <div className="flex justify-between items-start">
                        <div>
                            {isEditing ? (
                                <input name="name" value={formData.name} onChange={handleChange} className="text-xl font-bold text-slate-800 border rounded-md px-2 py-1 mb-1 w-full" />
                            ) : (
                                <h3 className="text-xl font-bold text-slate-800">{tenant.name}</h3>
                            )}
                            {isEditing ? (
                                <input name="email" value={formData.email} onChange={handleChange} className="text-sm text-slate-500 border rounded-md px-2 py-1 w-full mb-1" />
                            ) : (
                                <p className="text-sm text-slate-500">{tenant.email}</p>
                            )}
                            {isEditing ? (
                                <input name="phone" value={formData.phone} onChange={handleChange} className="text-sm text-slate-500 border rounded-md px-2 py-1 w-full" />
                            ) : (
                                <p className="text-sm text-slate-500">{tenant.phone}</p>
                            )}
                        </div>
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1"><XMarkIcon className="w-6 h-6" /></button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6 text-sm space-y-4">
                    <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                        <h4 className="font-bold text-slate-800 mb-2">Lease & Rent Details</h4>
                        {isEditing ? (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-700">Lease Type</label>
                                        <select name="leaseType" value={formData.leaseType} onChange={handleChange} className="mt-1 w-full border rounded-md px-2 py-1.5 text-sm">
                                            <option value="Fixed">Fixed</option>
                                            <option value="Month-to-Month">Month-to-Month</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-700">Lease End Date</label>
                                        <input 
                                            type="date" 
                                            name="leaseEndDate" 
                                            value={formData.leaseEndDate} 
                                            onChange={handleChange} 
                                            disabled={formData.leaseType === 'Month-to-Month'}
                                            className="mt-1 w-full font-semibold text-slate-800 border rounded-md px-2 py-1.5 text-sm disabled:bg-slate-100 disabled:cursor-not-allowed" 
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-between"><span className="text-slate-600">Property:</span><span className="font-semibold text-slate-800">{tenant.propertyName}</span></div>
                                <div className="flex justify-between"><span className="text-slate-600">Unit:</span><span className="font-semibold text-slate-800">{tenant.unitName}</span></div>
                                <div className="flex justify-between"><span className="text-slate-600">Rent Portion:</span><span className="font-semibold text-slate-800">${tenantInUnit?.rentPortion.toLocaleString() || 'N/A'}</span></div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <div className="flex justify-between"><span className="text-slate-600">Property:</span><span className="font-semibold text-slate-800">{tenant.propertyName}</span></div>
                                <div className="flex justify-between"><span className="text-slate-600">Unit:</span><span className="font-semibold text-slate-800">{tenant.unitName}</span></div>
                                <div className="flex justify-between items-center"><span className="text-slate-600">Lease Type:</span>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLeaseTypeBadge(tenant.leaseType)}`}>
                                        {tenant.leaseType}
                                    </span>
                                </div>
                                <div className="flex justify-between"><span className="text-slate-600">Lease End:</span><span className="font-semibold text-slate-800">{tenant.leaseType === 'Fixed' && tenant.leaseEndDate ? new Date(tenant.leaseEndDate).toLocaleDateString() : 'N/A'}</span></div>
                                <div className="flex justify-between"><span className="text-slate-600">Rent Portion:</span><span className="font-semibold text-slate-800">${tenantInUnit?.rentPortion.toLocaleString() || 'N/A'}</span></div>
                                <div className="flex justify-between items-center"><span className="text-slate-600">Rent Status:</span>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRentStatusBadge(tenant.rentStatus)}`}>
                                        {tenant.rentStatus}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                 <div className="flex justify-end p-4 bg-slate-50 border-t rounded-b-lg">
                    {isEditing ? (
                        <div className="space-x-2">
                            <button onClick={handleCancel} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">Cancel</button>
                            <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Save Changes</button>
                        </div>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Edit</button>
                    )}
                </div>
            </div>
        </div>
    );
};

const Tenants: React.FC = () => {
    const { tenants, addTenant, updateTenant, rentRoll, deleteTenants } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [propertyFilter, setPropertyFilter] = useState('All Properties');
    const [statusFilter, setStatusFilter] = useState('All Statuses');
    const [leaseTypeFilter, setLeaseTypeFilter] = useState('All Types');
    const [sortConfig, setSortConfig] = useState<{ key: keyof Tenant; direction: string } | null>({ key: 'name', direction: 'ascending' });
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [selectedTenants, setSelectedTenants] = useState<Set<string>>(new Set());
    const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const activePrimaryFilter = searchParams.get('filter');

    const handleSendInvite = ({ email, propertyName, unitName }: { email: string; propertyName: string; unitName: string }) => {
        const newTenant: Tenant = {
            id: `t${Date.now()}`,
            name: '(Pending Invitation)',
            email: email,
            phone: 'N/A',
            propertyName: propertyName,
            unitName: unitName,
            leaseEndDate: '',
            leaseType: 'Fixed',
            status: 'Pending',
            rentStatus: 'N/A',
        };
        addTenant(newTenant);
        setIsInviteModalOpen(false);
    };

    const getStatusBadge = (status: Tenant['status']) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-700';
            case 'Past': return 'bg-slate-100 text-slate-700';
            case 'Future': return 'bg-blue-100 text-blue-700';
            case 'Pending': return 'bg-amber-100 text-amber-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const tenantsWithLiveRentStatus = useMemo(() => {
        return tenants.map(tenant => {
            const rentInfo = rentRoll.find(rr => rr.id.split('-')[1] === tenant.id);
            return {
                ...tenant,
                rentStatus: rentInfo ? rentInfo.status : 'N/A'
            };
        });
    }, [tenants, rentRoll]);

    const sortedTenants = useMemo(() => {
        let sortableItems = [...tenantsWithLiveRentStatus];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                const key = sortConfig.key;
                if (a[key] < b[key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[key] > b[key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [tenantsWithLiveRentStatus, sortConfig]);

    const filteredTenants = useMemo(() => {
        return sortedTenants.filter(tenant => {
            let matchesPrimaryFilter = true;
            if (activePrimaryFilter === 'expiring_soon') {
                if (tenant.status !== 'Active' || !tenant.leaseEndDate) return false;
                const leaseEndDate = new Date(tenant.leaseEndDate);
                const now = new Date();
                const ninetyDaysFromNow = new Date();
                ninetyDaysFromNow.setDate(now.getDate() + 90);
                matchesPrimaryFilter = leaseEndDate > now && leaseEndDate <= ninetyDaysFromNow;
            } else if (activePrimaryFilter === 'rent_due') {
                matchesPrimaryFilter = tenant.rentStatus === 'Upcoming' || tenant.rentStatus === 'Overdue';
            }

            const matchesSecondaryFilters =
                (propertyFilter === 'All Properties' || tenant.propertyName === propertyFilter) &&
                (statusFilter === 'All Statuses' || tenant.status === statusFilter) &&
                (leaseTypeFilter === 'All Types' || tenant.leaseType === leaseTypeFilter);

            const matchesSearch = searchTerm === '' ||
                tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                tenant.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
                tenant.propertyName.toLowerCase().includes(searchTerm.toLowerCase());
                
            return matchesPrimaryFilter && (!!activePrimaryFilter || matchesSecondaryFilters) && matchesSearch;
        });
    }, [sortedTenants, searchTerm, propertyFilter, statusFilter, leaseTypeFilter, activePrimaryFilter]);
    
    const requestSort = (key: keyof Tenant) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const handleSelectTenant = (tenantId: string, isSelected: boolean) => {
        setSelectedTenants(prev => {
            const newSet = new Set(prev);
            if (isSelected) {
                newSet.add(tenantId);
            } else {
                newSet.delete(tenantId);
            }
            return newSet;
        });
    };

    const handleSelectAll = (isChecked: boolean) => {
        if (isChecked) {
            setSelectedTenants(new Set(filteredTenants.map(t => t.id)));
        } else {
            setSelectedTenants(new Set());
        }
    };

    const isAllSelected = filteredTenants.length > 0 && selectedTenants.size === filteredTenants.length;

    const exportToCSV = () => {
        const selectedData = tenants.filter(t => selectedTenants.has(t.id));
        const headers = ['Name', 'Email', 'Phone', 'Property', 'Unit', 'Lease Type', 'Lease End Date', 'Status', 'Rent Status'];
        const csvContent = [
            headers.join(','),
            ...selectedData.map(t => [t.name, t.email, t.phone, t.propertyName, t.unitName, t.leaseType, t.leaseEndDate, t.status, t.rentStatus].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.setAttribute('download', 'tenants_export.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleBulkRemove = () => {
        if (window.confirm(`Are you sure you want to remove ${selectedTenants.size} tenants? This will also remove all their associated data. This action cannot be undone.`)) {
            deleteTenants(Array.from(selectedTenants));
            setSelectedTenants(new Set());
        }
    };

    const filterBanner = activePrimaryFilter ? (
        <div className="bg-blue-100 border border-blue-200 text-blue-800 text-sm font-medium px-4 py-2 rounded-lg mb-4">
            Filtered by: <strong>{activePrimaryFilter === 'expiring_soon' ? 'Leases Expiring Soon' : 'Tenants with Rent Due'}</strong>. Select 'All Tenants' to clear.
        </div>
    ) : null;

    const selectedTenantWithLiveStatus = useMemo(() => {
        if (!selectedTenant) return null;
        const rentInfo = rentRoll.find(rr => rr.id.split('-')[1] === selectedTenant.id);
        return {
            ...selectedTenant,
            rentStatus: rentInfo ? rentInfo.status : 'N/A'
        };
    }, [selectedTenant, rentRoll]);


    return (
        <DashboardLayout navItems={MANAGER_NAV} activePath="/manager/tenants">
            <div className="h-full flex flex-col">
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Tenants</h2>
                <p className="text-slate-500 mb-6">Manage tenant information, leases, and communication.</p>
                
                <div className="flex justify-between items-center mb-4">
                    {selectedTenants.size > 0 ? (
                        <div className="flex items-center space-x-4 bg-slate-100 p-2 rounded-lg">
                            <span className="text-sm font-semibold text-slate-700">{selectedTenants.size} selected</span>
                            <button onClick={() => alert('Sending message...')} className="flex items-center text-sm font-medium text-slate-600 hover:text-blue-600"><MessageIcon className="w-4 h-4 mr-1.5" /> Send Message</button>
                            <button onClick={exportToCSV} className="flex items-center text-sm font-medium text-slate-600 hover:text-blue-600"><DocumentIcon className="w-4 h-4 mr-1.5" /> Export CSV</button>
                            <button onClick={handleBulkRemove} className="flex items-center text-sm font-medium text-red-600 hover:text-red-800"><TrashIcon className="w-4 h-4 mr-1.5" /> Remove</button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1 p-1 bg-slate-200 rounded-lg">
                                <button onClick={() => setSearchParams({})} className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${!activePrimaryFilter ? 'bg-white text-blue-600 shadow' : 'text-slate-600 hover:bg-slate-300'}`}>All Tenants</button>
                                <button onClick={() => setSearchParams({ filter: 'expiring_soon' })} className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${activePrimaryFilter === 'expiring_soon' ? 'bg-white text-blue-600 shadow' : 'text-slate-600 hover:bg-slate-300'}`}>Expiring Soon</button>
                                <button onClick={() => setSearchParams({ filter: 'rent_due' })} className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${activePrimaryFilter === 'rent_due' ? 'bg-white text-blue-600 shadow' : 'text-slate-600 hover:bg-slate-300'}`}>Rent Due</button>
                            </div>
                            <div>
                                <label htmlFor="property-filter" className="sr-only">Filter by Property</label>
                                <select id="property-filter" value={propertyFilter} onChange={e => setPropertyFilter(e.target.value)} disabled={!!activePrimaryFilter} className="text-sm bg-white border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed">
                                    <option>All Properties</option>
                                    {properties.map(p => <option key={p.name}>{p.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="leasetype-filter" className="sr-only">Filter by Lease Type</label>
                                <select id="leasetype-filter" value={leaseTypeFilter} onChange={e => setLeaseTypeFilter(e.target.value)} disabled={!!activePrimaryFilter} className="text-sm bg-white border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed">
                                    <option>All Types</option>
                                    <option>Fixed</option>
                                    <option>Month-to-Month</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="status-filter" className="sr-only">Filter by Status</label>
                                <select id="status-filter" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} disabled={!!activePrimaryFilter} className="text-sm bg-white border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed">
                                    <option>All Statuses</option>
                                    <option>Active</option>
                                    <option>Pending</option>
                                    <option>Past</option>
                                    <option>Future</option>
                                </select>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon className="w-4 h-4 text-slate-400" />
                            </div>
                            <input type="text" placeholder="Search tenants..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg w-72 focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <button onClick={() => setIsInviteModalOpen(true)} className="flex items-center justify-center bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            <PlusIcon className="w-5 h-5 mr-2" />
                            Invite Tenant
                        </button>
                    </div>
                </div>

                {filterBanner}

                <p className="text-sm text-slate-500 my-4">Showing {filteredTenants.length} of {tenants.length} tenants.</p>

                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-auto flex-1">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-t border-slate-200 sticky top-0">
                            <tr className="text-xs text-slate-500 uppercase font-semibold">
                                <th className="px-4 py-3 w-12 text-center">
                                    <input type="checkbox" checked={isAllSelected} onChange={(e) => handleSelectAll(e.target.checked)} className="h-4 w-4 rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-500" />
                                </th>
                                <th className="px-6 py-3"><button onClick={() => requestSort('name')} className="flex items-center space-x-1"><span>Name</span></button></th>
                                <th className="px-6 py-3"><button onClick={() => requestSort('propertyName')} className="flex items-center space-x-1"><span>Property</span></button></th>
                                <th className="px-6 py-3"><button onClick={() => requestSort('leaseType')} className="flex items-center space-x-1"><span>Lease Type</span></button></th>
                                <th className="px-6 py-3"><button onClick={() => requestSort('leaseEndDate')} className="flex items-center space-x-1"><span>Lease End</span></button></th>
                                <th className="px-6 py-3">Lease Status</th>
                                <th className="px-6 py-3">Rent Status</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {filteredTenants.map(tenant => {
                                const isSelected = selectedTenants.has(tenant.id);
                                return (
                                <tr 
                                    key={tenant.id}
                                    className={`transition-colors ${selectedTenant?.id === tenant.id ? 'bg-blue-100' : isSelected ? 'bg-slate-100' : 'hover:bg-slate-50'}`}
                                >
                                    <td className="px-4 py-4 text-center">
                                        <input type="checkbox" checked={isSelected} onChange={(e) => handleSelectTenant(tenant.id, e.target.checked)} onClick={(e) => e.stopPropagation()} className="h-4 w-4 rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-500" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-semibold text-slate-800 text-sm">{tenant.name}</p>
                                        <p className="text-xs text-slate-500">{tenant.email}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-slate-800 text-sm">{tenant.propertyName}</p>
                                        <p className="text-xs text-slate-500">{tenant.unitName}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLeaseTypeBadge(tenant.leaseType)}`}>
                                            {tenant.leaseType}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {tenant.leaseType === 'Fixed' && tenant.leaseEndDate ? new Date(tenant.leaseEndDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(tenant.status)}`}>
                                            {tenant.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRentStatusBadge(tenant.rentStatus)}`}>
                                            {tenant.rentStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {tenant.status === 'Pending' ? (
                                            <Link to={`/manager/tenants/${tenant.id}/screening`} className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-md">
                                                Screen Tenant
                                            </Link>
                                        ) : (
                                            <button onClick={() => setSelectedTenant(tenant)} className="text-sm font-semibold text-blue-600 hover:underline">
                                                View Details
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <TenantDetailModal tenant={selectedTenantWithLiveStatus} onClose={() => setSelectedTenant(null)} onUpdate={updateTenant} />
            
            <InviteTenantModal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                onSendInvite={handleSendInvite}
                properties={properties}
            />
        </DashboardLayout>
    );
};
export default Tenants;
