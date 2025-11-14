import React, { useState, useMemo, useEffect, useRef } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { MANAGER_NAV } from '../constants';
import { SearchIcon, PlusIcon, ChevronUpIcon, ChevronDownIcon, XMarkIcon, StarIcon, DocumentTextIcon, WrenchScrewdriverIcon, ShieldIcon, UsersIcon, ClockIcon } from '../components/Icons';
import type { Vendor, MaintenanceRequest, Document } from '../types';
import { useData } from '../contexts/DataContext';

const getStatusBadge = (status: Vendor['status']) => {
    switch (status) {
        case 'Active': return 'bg-green-100 text-green-700';
        case 'Inactive': return 'bg-slate-100 text-slate-700';
        case 'Preferred': return 'bg-blue-100 text-blue-700';
        default: return 'bg-slate-100 text-slate-700';
    }
};

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
    return (
        <div className="flex">
            {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className="w-5 h-5 text-amber-400" filled={i < rating} />
            ))}
        </div>
    );
};

const AddVendorModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onAddVendor: (vendor: Omit<Vendor, 'id'>) => void;
}> = ({ isOpen, onClose, onAddVendor }) => {
    const initialState = {
        name: '', email: '', phone: '', contactName: '',
        specialty: 'General' as Vendor['specialty'],
        rating: 3, status: 'Active' as Vendor['status'],
        taxId: ''
    };
    const [formData, setFormData] = useState(initialState);

    useEffect(() => { if (isOpen) setFormData(initialState); }, [isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.name && formData.email && formData.contactName) {
            onAddVendor({ ...formData, rating: Number(formData.rating) });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-between items-center p-6 border-b">
                        <h2 className="text-2xl font-bold text-slate-800">Add New Vendor</h2>
                        <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600"><XMarkIcon className="w-6 h-6" /></button>
                    </div>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Vendor Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., City Plumbers" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Specialty</label>
                                <select name="specialty" value={formData.specialty} onChange={handleChange} className="mt-1 w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                    <option>General</option><option>Plumbing</option><option>Electrical</option><option>HVAC</option><option>Appliances</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Contact Name</label>
                            <input type="text" name="contactName" value={formData.contactName} onChange={handleChange} required className="mt-1 w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., Frank Pipe" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Contact Email</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., frank@cityplumbers.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Contact Phone</label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., 555-0301" />
                            </div>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-slate-700">Tax ID (EIN/SSN)</label>
                            <input type="text" name="taxId" value={formData.taxId} onChange={handleChange} className="mt-1 w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm" placeholder="e.g., 12-3456789" />
                        </div>
                    </div>
                    <div className="flex justify-end items-center p-6 bg-slate-50 border-t space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Add Vendor</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const VendorDetailModal: React.FC<{
    vendor: Vendor;
    onClose: () => void;
    onUpdate: (vendor: Vendor) => void;
}> = ({ vendor, onClose, onUpdate }) => {
    const { maintenanceRequests, documents } = useData();
    const [activeTab, setActiveTab] = useState('Overview');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Vendor | null>(null);

    useEffect(() => {
        if (vendor) {
            setFormData(vendor);
        }
        setIsEditing(false); // Reset edit mode when vendor changes
    }, [vendor]);
    
    const jobHistory = useMemo(() => {
        if (!vendor) return [];
        return maintenanceRequests
            .filter(req => req.assignedTo === vendor.id)
            .sort((a,b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime());
    }, [vendor?.id, maintenanceRequests]);
    
    const vendorDocuments = useMemo(() => {
        if (!vendor) return [];
        return documents.filter(doc => doc.vendorId === vendor.id);
    }, [vendor?.id, documents]);

    if (!vendor || !formData) return null;
    
    const handleSave = () => {
        onUpdate(formData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData(vendor); // Revert changes
        setIsEditing(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }) as Vendor);
    };

    const tabs = ['Overview', 'Job History', 'Documents', 'Notes'];
    
    const isInsuranceExpired = formData.insuranceExpiry ? new Date(formData.insuranceExpiry) < new Date() : false;

    const renderContent = () => {
        switch (activeTab) {
            case 'Job History':
                return (
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50"><tr><th className="p-2">Job</th><th className="p-2">Property</th><th className="p-2">Status</th><th className="p-2">Date</th></tr></thead>
                        <tbody>
                            {jobHistory.map(job => (
                                <tr key={job.id} className="border-b">
                                    <td className="p-2 font-medium">{job.issue}</td>
                                    <td className="p-2">{job.property}</td>
                                    <td className="p-2">{job.status}</td>
                                    <td className="p-2">{new Date(job.submittedDate).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                );
            case 'Documents':
                return (
                     <ul className="space-y-2">
                        {vendorDocuments.map(doc => (
                            <li key={doc.id} className="p-3 border rounded-md flex justify-between items-center">
                                <div className="flex items-center"><DocumentTextIcon className="w-5 h-5 mr-3 text-slate-400"/><span>{doc.name}</span></div>
                                <button className="text-xs font-semibold text-blue-600">Download</button>
                            </li>
                        ))}
                    </ul>
                );
            case 'Notes':
                return <p className="text-slate-500">Private notes for this vendor will appear here.</p>
            default: // Overview
                return (
                    <div className="space-y-6 text-sm">
                        <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                            <h4 className="font-bold text-slate-800 mb-2">Contact Information</h4>
                            {isEditing ? (
                                <div className="space-y-2">
                                    <input name="contactName" value={formData.contactName} onChange={handleChange} className="w-full border rounded p-1"/>
                                    <input name="email" value={formData.email} onChange={handleChange} className="w-full border rounded p-1"/>
                                    <input name="phone" value={formData.phone} onChange={handleChange} className="w-full border rounded p-1"/>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <p><strong className="text-slate-600">Contact:</strong> {vendor.contactName}</p>
                                    <p><strong className="text-slate-600">Email:</strong> {vendor.email}</p>
                                    <p><strong className="text-slate-600">Phone:</strong> {vendor.phone}</p>
                                </div>
                            )}
                        </div>
                        <div className={`p-4 rounded-lg border ${isInsuranceExpired ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}`}>
                            <h4 className="font-bold text-slate-800 mb-2">Compliance</h4>
                             {isEditing ? (
                                <div className="space-y-2">
                                    <div><label className="text-xs">Insurance Expiry</label><input type="date" name="insuranceExpiry" value={formData.insuranceExpiry} onChange={handleChange} className="w-full border rounded p-1"/></div>
                                    <div><label className="text-xs">License #</label><input name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} className="w-full border rounded p-1"/></div>
                                    <div><label className="text-xs">Tax ID (EIN/SSN)</label><input name="taxId" value={formData.taxId || ''} onChange={handleChange} className="w-full border rounded p-1"/></div>
                                </div>
                             ) : (
                                <div className="space-y-2">
                                    <p><strong className="text-slate-600">Insurance Expiry:</strong> {vendor.insuranceExpiry ? new Date(vendor.insuranceExpiry).toLocaleDateString() : 'N/A'} {isInsuranceExpired && <span className="text-red-600 font-bold ml-2">EXPIRED</span>}</p>
                                    <p><strong className="text-slate-600">License #:</strong> {vendor.licenseNumber || 'N/A'}</p>
                                    <p><strong className="text-slate-600">Tax ID:</strong> {vendor.taxId || 'N/A'}</p>
                                </div>
                             )}
                        </div>
                    </div>
                );
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 transition-opacity duration-300"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 border-b">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-xl font-bold text-slate-800">{vendor.name}</h3>
                            <p className="text-sm text-slate-500">{vendor.specialty}</p>
                        </div>
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1"><XMarkIcon className="w-6 h-6"/></button>
                    </div>
                </div>
                <nav className="border-b px-4 flex-shrink-0">
                    <div className="flex space-x-1">{tabs.map(t => <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2 text-sm font-semibold rounded-t-md ${activeTab === t ? 'bg-slate-50 text-blue-600 border-b-2 border-blue-500' : 'text-slate-500 hover:text-slate-800'}`}>{t}</button>)}</div>
                </nav>
                <div className="flex-1 overflow-y-auto p-6">{renderContent()}</div>
                <div className="flex justify-end p-4 bg-slate-50 border-t rounded-b-lg">
                    {isEditing ? (
                        <div className="space-x-2">
                            <button onClick={handleCancel} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">Cancel</button>
                            <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Save Changes</button>
                        </div>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Edit Vendor</button>
                    )}
                </div>
            </div>
        </div>
    );
};

const Vendors: React.FC = () => {
    const { vendors, addVendor, updateVendor, maintenanceRequests } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [specialtyFilter, setSpecialtyFilter] = useState('All Specialties');
    const [statusFilter, setStatusFilter] = useState('All Statuses');
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: string } | null>({ key: 'name', direction: 'ascending' });
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
    
    const handleAddVendor = (newVendorData: Omit<Vendor, 'id'>) => {
        addVendor({ id: `v${Date.now()}`, ...newVendorData });
        setIsAddModalOpen(false);
    };

    const handleUpdateVendor = (updatedVendor: Vendor) => {
        updateVendor(updatedVendor);
        setSelectedVendor(updatedVendor); // Keep modal open with updated data
    };

    const vendorsWithJobCounts = useMemo(() => {
        const openRequests = maintenanceRequests.filter(req => req.status !== 'Completed');
        return vendors.map(vendor => ({
            ...vendor,
            openJobs: openRequests.filter(req => req.assignedTo === vendor.id).length
        }));
    }, [vendors, maintenanceRequests]);

    const filteredVendors = useMemo(() => {
        return vendorsWithJobCounts.filter(vendor => {
            const matchesFilter =
                (specialtyFilter === 'All Specialties' || vendor.specialty === specialtyFilter) &&
                (statusFilter === 'All Statuses' || vendor.status === statusFilter);

            const matchesSearch = searchTerm === '' ||
                vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                vendor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                vendor.contactName.toLowerCase().includes(searchTerm.toLowerCase());
                
            return matchesFilter && matchesSearch;
        });
    }, [vendorsWithJobCounts, searchTerm, specialtyFilter, statusFilter]);
    
     const sortedVendors = useMemo(() => {
        let sortableItems = [...filteredVendors];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                const key = sortConfig.key as keyof typeof a;
                if (a[key] < b[key]) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (a[key] > b[key]) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        return sortableItems;
    }, [filteredVendors, sortConfig]);

    const requestSort = (key: string) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') direction = 'descending';
        setSortConfig({ key, direction });
    };

    return (
        <DashboardLayout navItems={MANAGER_NAV} activePath="/manager/vendors">
            <div className="h-full flex flex-col">
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Vendors</h2>
                <p className="text-slate-500 mb-6">Manage vendor information and contacts for maintenance requests.</p>

                <div className="flex justify-between items-center mb-4">
                     <div className="flex items-center space-x-4">
                        <select onChange={e => setSpecialtyFilter(e.target.value)} className="text-sm bg-white border-slate-300 rounded-lg shadow-sm">
                            <option>All Specialties</option><option>Plumbing</option><option>Electrical</option><option>HVAC</option><option>General</option><option>Appliances</option>
                        </select>
                        <select onChange={e => setStatusFilter(e.target.value)} className="text-sm bg-white border-slate-300 rounded-lg shadow-sm">
                            <option>All Statuses</option><option>Active</option><option>Inactive</option><option>Preferred</option>
                        </select>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center"><SearchIcon className="w-4 h-4 text-slate-400" /></div>
                            <input type="text" placeholder="Search vendors..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9 pr-3 py-2 text-sm w-72 bg-white border border-slate-300 rounded-lg" />
                        </div>
                        <button onClick={() => setIsAddModalOpen(true)} className="flex items-center bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700">
                            <PlusIcon className="w-5 h-5 mr-2" /> Add Vendor
                        </button>
                    </div>
                </div>

                <p className="text-sm text-slate-500 my-4">Showing {sortedVendors.length} of {vendors.length} vendors.</p>

                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-auto flex-1">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-t border-slate-200 sticky top-0">
                            <tr className="text-xs text-slate-500 uppercase font-semibold">
                                <th className="px-6 py-3"><button onClick={() => requestSort('name')} className="flex items-center space-x-1"><span>Vendor</span>{sortConfig?.key === 'name' && (sortConfig.direction === 'ascending' ? <ChevronUpIcon className="w-3 h-3" /> : <ChevronDownIcon className="w-3 h-3" />)}</button></th>
                                <th className="px-6 py-3"><button onClick={() => requestSort('contactName')} className="flex items-center space-x-1"><span>Contact</span>{sortConfig?.key === 'contactName' && (sortConfig.direction === 'ascending' ? <ChevronUpIcon className="w-3 h-3" /> : <ChevronDownIcon className="w-3 h-3" />)}</button></th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3"><button onClick={() => requestSort('rating')} className="flex items-center space-x-1"><span>Rating</span>{sortConfig?.key === 'rating' && (sortConfig.direction === 'ascending' ? <ChevronUpIcon className="w-3 h-3" /> : <ChevronDownIcon className="w-3 h-3" />)}</button></th>
                                <th className="px-6 py-3"><button onClick={() => requestSort('openJobs')} className="flex items-center space-x-1"><span>Open Jobs</span>{sortConfig?.key === 'openJobs' && (sortConfig.direction === 'ascending' ? <ChevronUpIcon className="w-3 h-3" /> : <ChevronDownIcon className="w-3 h-3" />)}</button></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {sortedVendors.map(vendor => (
                                <tr key={vendor.id} onClick={() => setSelectedVendor(selectedVendor?.id === vendor.id ? null : vendor)} className={`hover:bg-slate-50 transition-colors cursor-pointer ${selectedVendor?.id === vendor.id ? 'bg-blue-50' : ''}`}>
                                    <td className="px-6 py-4">
                                        <p className="font-semibold text-slate-800 text-sm">{vendor.name}</p>
                                        <p className="text-xs text-slate-500">{vendor.specialty}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-slate-800 text-sm">{vendor.contactName}</p>
                                        <p className="text-xs text-slate-500">{vendor.email}</p>
                                    </td>
                                    <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(vendor.status)}`}>{vendor.status}</span></td>
                                    <td className="px-6 py-4"><StarRating rating={vendor.rating} /></td>
                                    <td className="px-6 py-4 text-sm font-medium text-center text-slate-700">{vendor.openJobs}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedVendor && <VendorDetailModal vendor={selectedVendor} onClose={() => setSelectedVendor(null)} onUpdate={handleUpdateVendor} />}
            
            <AddVendorModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAddVendor={handleAddVendor} />
        </DashboardLayout>
    );
};
export default Vendors;