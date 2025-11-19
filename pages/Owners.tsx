
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { MANAGER_NAV } from '../constants';
import { SearchIcon, PlusIcon, ChevronUpIcon, ChevronDownIcon, XMarkIcon, MessageIcon, DocumentIcon, TrashIcon, HomeIcon, DollarIcon, WrenchIcon, UsersIcon, DocumentTextIcon, UserCircleIcon, PencilIcon, DownloadIcon, BuildingIcon, MapPinIcon } from '../components/Icons';
import type { Owner, Property, Transaction } from '../types';
import { useData } from '../contexts/DataContext';

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

const OccupancyBar: React.FC<{ occupancy: number }> = ({ occupancy }) => {
    let barColor = 'bg-green-500';
    if (occupancy < 90 && occupancy >= 70) {
        barColor = 'bg-amber-500';
    } else if (occupancy < 70) {
        barColor = 'bg-red-500';
    }

    return (
        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className={`${barColor} h-full rounded-full transition-all duration-500`} style={{ width: `${occupancy}%` }}></div>
        </div>
    );
};

const AddOwnerModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onAddOwner: (owner: Omit<Owner, 'id'>) => void;
    properties: Property[];
}> = ({ isOpen, onClose, onAddOwner, properties }) => {
    const initialState = { name: '', email: '', phone: '', properties: [] as string[] };
    const [formData, setFormData] = useState(initialState);

    useEffect(() => {
        if (isOpen) {
            setFormData(initialState);
        }
    }, [isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePropertyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions, (option: HTMLOptionElement) => option.value);
        setFormData(prev => ({ ...prev, properties: selectedOptions }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.name && formData.email) {
            onAddOwner(formData);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg transform transition-all duration-300">
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-between items-center p-6 border-b border-slate-200">
                        <h2 className="text-2xl font-bold text-slate-800">Add New Owner</h2>
                        <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700">Owner/Company Name</label>
                            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm" placeholder="e.g., Prime Properties LLC" />
                        </div>
                         <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700">Contact Email</label>
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm" placeholder="e.g., contact@primeprop.com" />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-slate-700">Contact Phone</label>
                            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm" placeholder="e.g., 555-0201" />
                        </div>
                        <div>
                            <label htmlFor="properties" className="block text-sm font-medium text-slate-700">Assign Properties</label>
                            <select id="properties" multiple value={formData.properties} onChange={handlePropertyChange} className="mt-1 block w-full h-32 px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm">
                                {properties.filter(p => !p.owner).map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                            </select>
                            <p className="text-xs text-slate-500 mt-1">Hold Ctrl/Cmd to select multiple unassigned properties.</p>
                        </div>
                    </div>
                    <div className="flex justify-end items-center p-6 bg-slate-50 border-t border-slate-200 rounded-b-lg space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700">Add Owner</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ConfirmModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: React.ReactNode;
}> = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60]">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center p-6 border-b">
                    <div className="flex items-center space-x-3">
                         <div className="w-10 h-10 flex items-center justify-center bg-red-100 rounded-full">
                            <TrashIcon className="w-5 h-5 text-red-600" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">{title}</h2>
                    </div>
                    <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600"><XMarkIcon className="w-6 h-6" /></button>
                </div>
                <div className="p-6">
                    {message}
                </div>
                <div className="flex justify-end items-center p-6 bg-slate-50 border-t space-x-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">Cancel</button>
                    <button type="button" onClick={onConfirm} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">Remove</button>
                </div>
            </div>
        </div>
    );
};

const OwnerDetailModal: React.FC<{ owner: Owner; onClose: () => void; }> = ({ owner, onClose }) => {
    const { properties, maintenanceRequests: allMaintenanceRequests, transactions, documents } = useData();

    const financialSummary = useMemo(() => {
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1);

        const ownerTransactions = transactions.filter(t =>
            t.owner === owner.name &&
            new Date(t.date) >= startOfYear
        );

        const totalRevenue = ownerTransactions.filter(t => t.category === 'Income').reduce((sum, t) => sum + t.amount, 0);
        const totalExpenses = ownerTransactions.filter(t => t.category === 'Expense').reduce((sum, t) => sum + t.amount, 0);
        const noi = totalRevenue - totalExpenses;

        return { totalRevenue, totalExpenses, noi };
    }, [owner, transactions]);

    const ownerProperties = useMemo(() => {
        return properties.filter(p => p.owner === owner.name).map(prop => {
            let totalUnits = 0, occupiedUnits = 0, monthlyRevenue = 0;
            prop.buildings.forEach(b => {
                totalUnits += b.units.length;
                b.units.forEach(u => {
                    if (u.status === 'Occupied') {
                        occupiedUnits++;
                        monthlyRevenue += u.rent;
                    }
                });
            });
            const openMaintenance = allMaintenanceRequests.filter(req => req.property === prop.name && req.status !== 'Completed').length;
            const occupancyRate = totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0;
            return { ...prop, totalUnits, occupiedUnits, monthlyRevenue, openMaintenance, occupancyRate };
        });
    }, [owner, properties, allMaintenanceRequests]);

    const totalUnits = ownerProperties.reduce((acc, p) => acc + p.totalUnits, 0);
    const totalOccupied = ownerProperties.reduce((acc, p) => acc + p.occupiedUnits, 0);
    const overallOccupancy = totalUnits > 0 ? (totalOccupied / totalUnits) * 100 : 0;

    const recentDocuments = useMemo(() => {
        return documents
            .filter(doc => owner.properties.includes(doc.property) && doc.type !== 'Folder')
            .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
            .slice(0, 4);
    }, [owner, documents]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 ring-1 ring-slate-900/5">
                
                {/* Header */}
                <div className="flex-shrink-0 px-8 py-6 bg-gradient-to-r from-white to-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-10">
                    <div className="flex items-center gap-6">
                        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-sm ring-4 ring-white ${getAvatarColor(owner.name)}`}>
                             {getInitials(owner.name)}
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{owner.name}</h2>
                            <div className="flex flex-col sm:flex-row sm:items-center mt-2 text-sm font-medium text-slate-500 gap-2 sm:gap-6">
                                <div className="flex items-center hover:text-blue-600 transition-colors cursor-pointer group">
                                    <div className="p-1.5 bg-white border border-slate-200 rounded-full mr-2 group-hover:border-blue-200 group-hover:text-blue-600 transition-colors shadow-sm"><MessageIcon className="w-3.5 h-3.5"/></div>
                                    {owner.email}
                                </div>
                                <div className="flex items-center hover:text-blue-600 transition-colors cursor-pointer group">
                                    <div className="p-1.5 bg-white border border-slate-200 rounded-full mr-2 group-hover:border-blue-200 group-hover:text-blue-600 transition-colors shadow-sm"><UserCircleIcon className="w-3.5 h-3.5"/></div>
                                    {owner.phone}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 self-start sm:self-auto">
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
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Portfolio Size</p>
                            <div className="flex items-baseline">
                                <span className="text-2xl font-bold text-slate-800">{owner.properties.length}</span>
                                <span className="text-sm font-medium text-slate-500 ml-1.5">Properties</span>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200/60 flex flex-col justify-between hover:border-blue-200 transition-colors">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Units</p>
                            <div className="flex items-baseline">
                                <span className="text-2xl font-bold text-slate-800">{totalUnits}</span>
                                <span className="text-sm font-medium text-slate-500 ml-1.5">Units</span>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200/60 flex flex-col justify-between hover:border-blue-200 transition-colors">
                             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Avg Occupancy</p>
                             <div className="flex items-center gap-3 mt-1">
                                <span className={`text-2xl font-bold ${overallOccupancy >= 90 ? 'text-green-600' : overallOccupancy >= 70 ? 'text-amber-600' : 'text-red-600'}`}>
                                    {overallOccupancy.toFixed(0)}%
                                </span>
                                <div className="w-20">
                                    <OccupancyBar occupancy={overallOccupancy} />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200/60 flex flex-col justify-between hover:border-blue-200 transition-colors">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">NOI (YTD)</p>
                             <div className="flex items-baseline">
                                <span className="text-2xl font-bold text-blue-600">${financialSummary.noi.toLocaleString(undefined, { notation: 'compact' })}</span>
                                <span className="text-sm font-medium text-slate-500 ml-1.5">Net Income</span>
                            </div>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                         {/* Left: Properties List */}
                         <div className="xl:col-span-2 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-slate-800">Properties</h3>
                                <div className="flex space-x-2">
                                    <span className="text-xs font-semibold text-slate-500 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-200">{ownerProperties.length} Active</span>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                {ownerProperties.map(prop => (
                                    <div key={prop.name} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pl-2">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 border border-blue-100">
                                                    <BuildingIcon className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{prop.name}</h4>
                                                    <p className="text-sm text-slate-500 flex items-center mt-0.5"><MapPinIcon className="w-3 h-3 mr-1"/>{prop.address}</p>
                                                    <div className="flex items-center gap-4 mt-3 text-xs font-medium text-slate-600">
                                                        <span className="flex items-center bg-slate-100 px-2 py-0.5 rounded border border-slate-200"><HomeIcon className="w-3 h-3 mr-1 text-slate-400"/> {prop.totalUnits} Units</span>
                                                        <span className="flex items-center bg-slate-100 px-2 py-0.5 rounded border border-slate-200"><DollarIcon className="w-3 h-3 mr-1 text-slate-400"/> ${prop.monthlyRevenue.toLocaleString()}/mo</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex flex-row sm:flex-col items-center sm:items-end gap-4 sm:gap-1 min-w-[140px]">
                                                <div className="text-right">
                                                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Occupancy</p>
                                                    <div className="flex items-center gap-2 justify-end">
                                                        <span className="text-sm font-bold text-slate-700">{prop.occupancyRate.toFixed(0)}%</span>
                                                        <div className="w-16">
                                                            <OccupancyBar occupancy={prop.occupancyRate} />
                                                        </div>
                                                    </div>
                                                </div>
                                                {prop.openMaintenance > 0 && (
                                                    <div className="mt-2 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold flex items-center border border-amber-100">
                                                        <WrenchIcon className="w-3 h-3 mr-1.5"/> {prop.openMaintenance} Issues
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {ownerProperties.length === 0 && (
                                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                                        <p className="text-slate-500">No properties assigned to this owner.</p>
                                    </div>
                                )}
                            </div>
                         </div>

                         {/* Right: Financial Summary & Recent Docs */}
                         <div className="space-y-6">
                             {/* Financial Breakdown Widget */}
                             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                 <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Financial Summary (YTD)</h3>
                                 <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3 rounded-lg bg-green-50/50 border border-green-100">
                                        <span className="text-sm font-medium text-green-700">Income</span>
                                        <span className="text-sm font-bold text-green-800">+${financialSummary.totalRevenue.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 rounded-lg bg-red-50/50 border border-red-100">
                                        <span className="text-sm font-medium text-red-700">Expenses</span>
                                        <span className="text-sm font-bold text-red-800">-${financialSummary.totalExpenses.toLocaleString()}</span>
                                    </div>
                                    <div className="border-t border-slate-100 pt-3 mt-1 flex justify-between items-center">
                                        <span className="text-sm font-bold text-slate-800">Net Operating Income</span>
                                        <span className="text-lg font-bold text-blue-600">${financialSummary.noi.toLocaleString()}</span>
                                    </div>
                                 </div>
                             </div>

                             {/* Recent Documents Widget */}
                             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                 <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Recent Documents</h3>
                                    <button className="text-xs font-bold text-blue-600 hover:underline">View All</button>
                                 </div>
                                 <div className="space-y-3">
                                     {recentDocuments.length > 0 ? (
                                         recentDocuments.map(doc => (
                                            <div key={doc.id} className="flex items-start gap-3 p-2 rounded hover:bg-slate-50 transition-colors cursor-pointer group">
                                                <div className="mt-0.5 text-slate-400 group-hover:text-blue-500 transition-colors">
                                                    <DocumentTextIcon className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-slate-700 truncate group-hover:text-blue-600 transition-colors">{doc.name}</p>
                                                    <p className="text-xs text-slate-400">{new Date(doc.uploadDate).toLocaleDateString()} • {doc.property}</p>
                                                </div>
                                                <button className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-600 transition-opacity">
                                                    <DownloadIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                         ))
                                     ) : (
                                         <p className="text-sm text-slate-400 italic">No recent documents.</p>
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


const Owners: React.FC = () => {
    const { owners, properties, addOwner, deleteOwners } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof Owner | 'propertyCount' | 'totalUnits' | 'occupancyRate' | 'estMonthlyRevenue'; direction: string } | null>({ key: 'name', direction: 'ascending' });
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedOwners, setSelectedOwners] = useState<Set<string>>(new Set());
    const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
    const [isConfirmRemoveOpen, setIsConfirmRemoveOpen] = useState(false);

    const handleAddOwner = (newOwnerData: Omit<Owner, 'id'>) => {
        addOwner(newOwnerData);
        setIsAddModalOpen(false);
    };

    const ownersWithCalculatedData = useMemo(() => {
        return owners.map(owner => {
            let totalUnits = 0;
            let occupiedUnits = 0;
            let estMonthlyRevenue = 0;

            const ownerProperties = properties.filter(p => p.owner === owner.name);

            ownerProperties.forEach(prop => {
                prop.buildings.forEach(building => {
                    totalUnits += building.units.length;
                    building.units.forEach(unit => {
                        if (unit.status === 'Occupied') {
                            occupiedUnits++;
                            estMonthlyRevenue += unit.rent;
                        }
                    });
                });
            });

            const occupancyRate = totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0;

            return {
                ...owner,
                propertyCount: ownerProperties.length,
                totalUnits,
                occupiedUnits,
                occupancyRate,
                estMonthlyRevenue,
            };
        });
    }, [owners, properties]);

    const sortedOwners = useMemo(() => {
        let sortableItems = [...ownersWithCalculatedData];
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
    }, [ownersWithCalculatedData, sortConfig]);

    const filteredOwners = useMemo(() => {
        return sortedOwners.filter(owner => {
            return searchTerm === '' ||
                owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                owner.email.toLowerCase().includes(searchTerm.toLowerCase());
        });
    }, [sortedOwners, searchTerm]);
    
    const requestSort = (key: (typeof sortConfig)['key']) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const handleSelectOwner = (ownerId: string, isSelected: boolean) => {
        setSelectedOwners(prev => {
            const newSet = new Set(prev);
            if (isSelected) {
                newSet.add(ownerId);
            } else {
                newSet.delete(ownerId);
            }
            return newSet;
        });
    };

    const handleSelectAll = (isChecked: boolean) => {
        if (isChecked) {
            setSelectedOwners(new Set(filteredOwners.map(o => o.id)));
        } else {
            setSelectedOwners(new Set());
        }
    };
    
    const isAllSelected = filteredOwners.length > 0 && selectedOwners.size === filteredOwners.length;
    
    const exportToCSV = () => {
        const selectedData = ownersWithCalculatedData.filter(o => selectedOwners.has(o.id));
        const headers = ['Name', 'Email', 'Phone', 'Property Count', 'Total Units', 'Occupancy Rate (%)', 'Est. Monthly Revenue'];
        const csvContent = [
            headers.join(','),
            ...selectedData.map(o => [o.name, o.email, o.phone, o.propertyCount, o.totalUnits, o.occupancyRate.toFixed(2), o.estMonthlyRevenue].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.setAttribute('download', 'owners_export.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const handleConfirmRemove = () => {
        deleteOwners(Array.from(selectedOwners));
        setSelectedOwners(new Set());
        setIsConfirmRemoveOpen(false);
    };

    return (
        <DashboardLayout navItems={MANAGER_NAV} activePath="/manager/owners">
            <div className="h-full flex flex-col">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800">Owners</h2>
                        <p className="text-slate-500 mt-1">Manage owner information and property portfolios.</p>
                    </div>
                    <div className="flex items-center space-x-3 self-start md:self-auto">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon className="w-4 h-4 text-slate-400" />
                            </div>
                            <input 
                                type="text" 
                                placeholder="Search owners..." 
                                value={searchTerm} 
                                onChange={e => setSearchTerm(e.target.value)} 
                                className="pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg w-64 focus:ring-blue-500 focus:border-blue-500 shadow-sm" 
                            />
                        </div>
                        <button 
                            onClick={() => setIsAddModalOpen(true)} 
                            className="flex items-center justify-center bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap"
                        >
                            <PlusIcon className="w-5 h-5 mr-1.5" />
                            Add Owner
                        </button>
                    </div>
                </div>

                 {selectedOwners.size > 0 && (
                     <div className="mb-4 flex items-center space-x-2 bg-slate-100 p-2 rounded-lg">
                        <span className="text-sm font-semibold text-slate-700 px-2">{selectedOwners.size} selected</span>
                        <button onClick={exportToCSV} className="px-3 py-1.5 text-sm font-semibold bg-white text-slate-700 rounded-md border border-slate-300 hover:bg-slate-50 flex items-center">
                            <DocumentIcon className="w-4 h-4 mr-1.5" /> Export CSV
                        </button>
                        <button onClick={() => setIsConfirmRemoveOpen(true)} className="px-3 py-1.5 text-sm font-semibold bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center">
                            <TrashIcon className="w-4 h-4 mr-1.5" /> Remove
                        </button>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-auto flex-1">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-t border-slate-200 sticky top-0 z-10">
                            <tr className="text-xs text-slate-500 uppercase font-semibold">
                                <th className="px-6 py-3 w-12 text-center">
                                    <input type="checkbox" checked={isAllSelected} onChange={(e) => handleSelectAll(e.target.checked)} className="h-4 w-4 rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-500" />
                                </th>
                                <th className="px-6 py-3">
                                    <button onClick={() => requestSort('name')} className="flex items-center space-x-1 hover:text-slate-700">
                                        <span>Owner</span>
                                        {sortConfig?.key === 'name' && (sortConfig.direction === 'ascending' ? <ChevronUpIcon className="w-3 h-3" /> : <ChevronDownIcon className="w-3 h-3" />)}
                                    </button>
                                </th>
                                <th className="px-6 py-3 text-center">
                                    <button onClick={() => requestSort('propertyCount')} className="flex items-center space-x-1 hover:text-slate-700 mx-auto">
                                        <span>Properties</span>
                                        {sortConfig?.key === 'propertyCount' && (sortConfig.direction === 'ascending' ? <ChevronUpIcon className="w-3 h-3" /> : <ChevronDownIcon className="w-3 h-3" />)}
                                    </button>
                                </th>
                                <th className="px-6 py-3 text-center">
                                    <button onClick={() => requestSort('totalUnits')} className="flex items-center space-x-1 hover:text-slate-700 mx-auto">
                                        <span>Total Units</span>
                                        {sortConfig?.key === 'totalUnits' && (sortConfig.direction === 'ascending' ? <ChevronUpIcon className="w-3 h-3" /> : <ChevronDownIcon className="w-3 h-3" />)}
                                    </button>
                                </th>
                                <th className="px-6 py-3 w-48">
                                    <button onClick={() => requestSort('occupancyRate')} className="flex items-center space-x-1 hover:text-slate-700">
                                        <span>Occupancy</span>
                                        {sortConfig?.key === 'occupancyRate' && (sortConfig.direction === 'ascending' ? <ChevronUpIcon className="w-3 h-3" /> : <ChevronDownIcon className="w-3 h-3" />)}
                                    </button>
                                </th>
                                 <th className="px-6 py-3 text-center">
                                    <button onClick={() => requestSort('estMonthlyRevenue')} className="flex items-center space-x-1 hover:text-slate-700 mx-auto">
                                        <span>Est. Monthly Revenue</span>
                                        {sortConfig?.key === 'estMonthlyRevenue' && (sortConfig.direction === 'ascending' ? <ChevronUpIcon className="w-3 h-3" /> : <ChevronDownIcon className="w-3 h-3" />)}
                                    </button>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {filteredOwners.map(owner => {
                                const isSelectedForBulk = selectedOwners.has(owner.id);
                                return (
                                <tr key={owner.id} onClick={(e) => {
                                    if (e.target instanceof HTMLInputElement) return;
                                    setSelectedOwner(selectedOwner?.id === owner.id ? null : owner)
                                }} className={`transition-colors cursor-pointer group ${selectedOwner?.id === owner.id ? 'bg-blue-50/70' : isSelectedForBulk ? 'bg-slate-50' : 'hover:bg-slate-50'}`}>
                                    <td className="px-4 py-4 text-center">
                                        <input type="checkbox" checked={isSelectedForBulk} onChange={(e) => handleSelectOwner(owner.id, e.target.checked)} onClick={e => e.stopPropagation()} className="h-4 w-4 rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-500" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className={`w-10 h-10 rounded-full flex-shrink-0 mr-4 flex items-center justify-center font-bold text-sm ${getAvatarColor(owner.name)}`}>
                                                {getInitials(owner.name)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-800 text-sm group-hover:text-blue-700 transition-colors">{owner.name}</p>
                                                <p className="text-xs text-slate-500">{owner.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 text-center font-medium">{owner.propertyCount}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600 text-center font-medium">{owner.totalUnits}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-full max-w-28">
                                                <OccupancyBar occupancy={owner.occupancyRate} />
                                            </div>
                                            <span className="text-sm font-medium text-slate-600 w-12 text-right">{owner.occupancyRate.toFixed(0)}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-800 text-center">${owner.estMonthlyRevenue.toLocaleString()}</td>
                                </tr>
                            )})}
                            {filteredOwners.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                        No owners found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {selectedOwner && <OwnerDetailModal owner={selectedOwner} onClose={() => setSelectedOwner(null)} />}

            <AddOwnerModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAddOwner={handleAddOwner}
                properties={properties}
            />
            <ConfirmModal 
                isOpen={isConfirmRemoveOpen}
                onClose={() => setIsConfirmRemoveOpen(false)}
                onConfirm={handleConfirmRemove}
                title="Remove Owners"
                message={<p>Are you sure you want to remove the {selectedOwners.size} selected owners? This action cannot be undone.</p>}
            />
        </DashboardLayout>
    );
};
export default Owners;
