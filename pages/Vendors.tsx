
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { MANAGER_NAV } from '../constants';
import { WrenchScrewdriverIcon, ChevronDownIcon, CheckCircleIcon, SearchIcon, PlusIcon, UsersIcon, StarIcon, XMarkIcon, PhoneIcon, EnvelopeIcon, TrashIcon, PencilIcon } from '../components/Icons';
import type { Vendor } from '../types';
import { useData } from '../contexts/DataContext';

// --- Helper Components ---

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex space-x-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon key={star} className={`w-4 h-4 ${star <= rating ? 'text-amber-400' : 'text-slate-200'}`} filled={star <= rating} />
        ))}
    </div>
);

const StarRatingInput: React.FC<{ rating: number, onChange: (r: number) => void }> = ({ rating, onChange }) => (
    <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
            <button
                key={star}
                type="button"
                onClick={() => onChange(star)}
                className="focus:outline-none hover:scale-110 transition-transform"
            >
                <StarIcon 
                    className={`w-6 h-6 transition-colors ${star <= rating ? 'text-amber-400' : 'text-slate-300 hover:text-amber-200'}`} 
                    filled={star <= rating} 
                />
            </button>
        ))}
    </div>
);

// --- Modals ---

const AddVendorModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onAdd: (vendor: Vendor) => void;
}> = ({ isOpen, onClose, onAdd }) => {
    const initialState: Vendor = {
        id: '',
        name: '',
        specialty: 'General',
        contactName: '',
        email: '',
        phone: '',
        rating: 0,
        status: 'Active',
        taxId: '',
        insuranceExpiry: '',
        licenseNumber: ''
    };
    const [formData, setFormData] = useState<Vendor>(initialState);

    useEffect(() => {
        if (isOpen) setFormData({ ...initialState, id: `v${Date.now()}` });
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd(formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-between items-center p-6 border-b border-slate-100">
                        <h2 className="text-xl font-bold text-slate-800">Add New Vendor</h2>
                        <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors">
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>
                    
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Company Name</label>
                            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="e.g. Acme Plumbing" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Specialty</label>
                                <select value={formData.specialty} onChange={e => setFormData({...formData, specialty: e.target.value as any})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                                    <option>General</option><option>Plumbing</option><option>Electrical</option><option>HVAC</option><option>Appliances</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Status</label>
                                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                                    <option>Active</option><option>Inactive</option><option>Preferred</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Contact Person</label>
                            <input required type="text" value={formData.contactName} onChange={e => setFormData({...formData, contactName: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="e.g. John Doe" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
                                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone</label>
                                <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                            </div>
                        </div>
                        
                        <div className="pt-4 border-t border-slate-100">
                            <p className="text-sm font-semibold text-slate-800 mb-3">Compliance Details</p>
                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Tax ID</label>
                                    <input type="text" value={formData.taxId || ''} onChange={e => setFormData({...formData, taxId: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm" placeholder="XX-XXXXXXX" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">License #</label>
                                    <input type="text" value={formData.licenseNumber || ''} onChange={e => setFormData({...formData, licenseNumber: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
                        <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-colors">Create Vendor</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const VendorDetailModal: React.FC<{
    vendor: Vendor;
    onClose: () => void;
}> = ({ vendor, onClose }) => {
    const { updateVendor, addVendor } = useData(); // Using addVendor/updateVendor logic via context
    // Mock delete for now as context doesn't strictly export deleteVendor in types yet, can be added easily.
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Vendor>(vendor);

    useEffect(() => {
        setFormData(vendor);
    }, [vendor]);

    const handleSave = () => {
        updateVendor(formData);
        setIsEditing(false);
    };

    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to remove ${vendor.name}?`)) {
            // In a real app: deleteVendor(vendor.id);
            // For now, we'll just close as delete isn't exposed in context types for vendors yet
            alert("Vendor deleted (simulated)");
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="flex justify-between items-start p-6 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 rounded-xl bg-blue-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-blue-200">
                            {vendor.name.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">{vendor.name}</h2>
                            <div className="flex items-center space-x-2 mt-1">
                                <span className={`px-2 py-0.5 text-xs font-bold uppercase rounded-full ${
                                    vendor.status === 'Preferred' ? 'bg-blue-100 text-blue-700' : 
                                    vendor.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'
                                }`}>
                                    {vendor.status}
                                </span>
                                <span className="text-slate-300">•</span>
                                <span className="text-sm text-slate-500 font-medium">{vendor.specialty}</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-200 transition-colors">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto flex-1">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-800">Vendor Details</h3>
                        {!isEditing ? (
                            <div className="flex space-x-2">
                                <button onClick={handleDelete} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete Vendor">
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                                <button onClick={() => setIsEditing(true)} className="flex items-center px-3 py-1.5 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                                    <PencilIcon className="w-4 h-4 mr-1.5" /> Edit
                                </button>
                            </div>
                        ) : (
                            <div className="flex space-x-2">
                                <button onClick={() => { setIsEditing(false); setFormData(vendor); }} className="px-3 py-1.5 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
                                    Cancel
                                </button>
                                <button onClick={handleSave} className="px-3 py-1.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors">
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        {/* Contact Info */}
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Contact Name</label>
                                    {isEditing ? (
                                        <input type="text" value={formData.contactName} onChange={e => setFormData({...formData, contactName: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500" />
                                    ) : (
                                        <p className="text-sm font-medium text-slate-800">{formData.contactName}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Email</label>
                                    {isEditing ? (
                                        <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500" />
                                    ) : (
                                        <div className="flex items-center text-sm font-medium text-slate-800">
                                            <EnvelopeIcon className="w-4 h-4 mr-2 text-slate-400" />
                                            <a href={`mailto:${formData.email}`} className="hover:text-blue-600 transition-colors">{formData.email}</a>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Phone</label>
                                    {isEditing ? (
                                        <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500" />
                                    ) : (
                                        <div className="flex items-center text-sm font-medium text-slate-800">
                                            <PhoneIcon className="w-4 h-4 mr-2 text-slate-400" />
                                            {formData.phone}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Rating</label>
                                    {isEditing ? (
                                        <StarRatingInput rating={formData.rating} onChange={r => setFormData({...formData, rating: r})} />
                                    ) : (
                                        <StarRating rating={formData.rating} />
                                    )}
                                </div>
                                {isEditing && (
                                    <>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Status</label>
                                            <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500">
                                                <option>Active</option><option>Inactive</option><option>Preferred</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Specialty</label>
                                            <select value={formData.specialty} onChange={e => setFormData({...formData, specialty: e.target.value as any})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500">
                                                <option>General</option><option>Plumbing</option><option>Electrical</option><option>HVAC</option><option>Appliances</option>
                                            </select>
                                        </div>
                                    </>
                                )}
                            </div>
                        </section>

                        {/* Compliance Info */}
                        <section className="pt-6 border-t border-slate-100">
                            <h4 className="text-sm font-bold text-slate-800 mb-4">Compliance & Legal</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <p className="text-xs text-slate-500 mb-1">Tax ID (EIN/SSN)</p>
                                    {isEditing ? (
                                        <input type="text" value={formData.taxId || ''} onChange={e => setFormData({...formData, taxId: e.target.value})} className="w-full text-sm bg-white border border-slate-200 rounded px-2 py-1" />
                                    ) : (
                                        <p className="text-sm font-mono font-medium text-slate-700">{formData.taxId || '—'}</p>
                                    )}
                                </div>
                                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <p className="text-xs text-slate-500 mb-1">License Number</p>
                                    {isEditing ? (
                                        <input type="text" value={formData.licenseNumber || ''} onChange={e => setFormData({...formData, licenseNumber: e.target.value})} className="w-full text-sm bg-white border border-slate-200 rounded px-2 py-1" />
                                    ) : (
                                        <p className="text-sm font-mono font-medium text-slate-700">{formData.licenseNumber || '—'}</p>
                                    )}
                                </div>
                                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <p className="text-xs text-slate-500 mb-1">Insurance Expiry</p>
                                    {isEditing ? (
                                        <input type="date" value={formData.insuranceExpiry ? new Date(formData.insuranceExpiry).toISOString().split('T')[0] : ''} onChange={e => setFormData({...formData, insuranceExpiry: e.target.value})} className="w-full text-sm bg-white border border-slate-200 rounded px-2 py-1" />
                                    ) : (
                                        <p className={`text-sm font-medium ${formData.insuranceExpiry && new Date(formData.insuranceExpiry) < new Date() ? 'text-red-600' : 'text-slate-700'}`}>
                                            {formData.insuranceExpiry ? new Date(formData.insuranceExpiry).toLocaleDateString() : '—'}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};


const Vendors: React.FC = () => {
    const { vendors, addVendor } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [specialtyFilter, setSpecialtyFilter] = useState('All Specialties');
    const [statusFilter, setStatusFilter] = useState('All Statuses');
    
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

    const filteredVendors = vendors.filter(vendor => {
        const matchesSearch = 
            vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vendor.contactName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSpecialty = specialtyFilter === 'All Specialties' || vendor.specialty === specialtyFilter;
        const matchesStatus = statusFilter === 'All Statuses' || vendor.status === statusFilter;
        
        return matchesSearch && matchesSpecialty && matchesStatus;
    });

    const handleAddVendor = (vendor: Vendor) => {
        addVendor(vendor);
    };

    return (
        <DashboardLayout navItems={MANAGER_NAV} activePath="/manager/vendors">
            <div className="max-w-7xl mx-auto h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800">Vendors</h2>
                        <p className="text-slate-500 mt-1">Manage service providers and contractors.</p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <div className="flex flex-1 items-center space-x-3 overflow-x-auto w-full md:w-auto p-1">
                        {/* Specialty Filter */}
                        <div className="relative min-w-[180px]">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <WrenchScrewdriverIcon className="w-5 h-5 text-slate-400" />
                            </div>
                            <select 
                                onChange={e => setSpecialtyFilter(e.target.value)} 
                                className="appearance-none w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-slate-50 transition-all cursor-pointer"
                            >
                                <option>All Specialties</option><option>Plumbing</option><option>Electrical</option><option>HVAC</option><option>General</option><option>Appliances</option>
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
                                onChange={e => setStatusFilter(e.target.value)} 
                                className="appearance-none w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-slate-50 transition-all cursor-pointer"
                            >
                                <option>All Statuses</option><option>Active</option><option>Inactive</option><option>Preferred</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <ChevronDownIcon className="w-4 h-4 text-slate-400" />
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="relative flex-1 max-w-md">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><SearchIcon className="w-5 h-5 text-slate-400" /></div>
                            <input 
                                type="text" 
                                placeholder="Search vendors..." 
                                value={searchTerm} 
                                onChange={e => setSearchTerm(e.target.value)} 
                                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400 transition-all" 
                            />
                        </div>
                    </div>

                    <button onClick={() => setIsAddModalOpen(true)} className="flex items-center bg-blue-600 text-white font-semibold px-4 py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap">
                        <PlusIcon className="w-5 h-5 mr-2" /> Add Vendor
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
                    <div className="overflow-auto flex-1">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                                <tr className="text-xs text-slate-500 uppercase font-semibold">
                                    <th className="px-6 py-3">Vendor</th>
                                    <th className="px-6 py-3">Specialty</th>
                                    <th className="px-6 py-3">Contact</th>
                                    <th className="px-6 py-3">Rating</th>
                                    <th className="px-6 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {filteredVendors.map(vendor => (
                                    <tr 
                                        key={vendor.id} 
                                        onClick={() => setSelectedVendor(vendor)}
                                        className="hover:bg-slate-50 transition-colors cursor-pointer group"
                                    >
                                        <td className="px-6 py-4 font-medium text-slate-800 group-hover:text-blue-600 transition-colors">{vendor.name}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{vendor.specialty}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            <p className="font-medium">{vendor.contactName}</p>
                                            <p className="text-xs text-slate-400">{vendor.email}</p>
                                            <p className="text-xs text-slate-400">{vendor.phone}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            <StarRating rating={vendor.rating} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-bold rounded-full uppercase ${
                                                vendor.status === 'Active' ? 'bg-green-100 text-green-700' : 
                                                vendor.status === 'Preferred' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                                            }`}>
                                                {vendor.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {filteredVendors.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                            <UsersIcon className="mx-auto h-12 w-12 text-slate-300 mb-2" />
                                            No vendors found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            {selectedVendor && (
                <VendorDetailModal 
                    vendor={selectedVendor} 
                    onClose={() => setSelectedVendor(null)} 
                />
            )}

            <AddVendorModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
                onAdd={handleAddVendor} 
            />
        </DashboardLayout>
    );
};

export default Vendors;
