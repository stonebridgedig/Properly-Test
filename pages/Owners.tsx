import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { MANAGER_NAV } from '../constants';
import { SearchIcon, PlusIcon, ChevronUpIcon, ChevronDownIcon, EllipsisVerticalIcon, XMarkIcon, MessageIcon, DocumentIcon, TrashIcon, HomeIcon, DollarIcon, WrenchIcon, UsersIcon } from '../components/Icons';
import type { Owner, Property } from '../types';
import { useData } from '../contexts/DataContext';


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

const OccupancyBar: React.FC<{ occupancy: number }> = ({ occupancy }) => {
    let barColor = 'bg-green-500';
    if (occupancy < 90 && occupancy >= 70) {
        barColor = 'bg-amber-500';
    } else if (occupancy < 70) {
        barColor = 'bg-red-500';
    }

    return (
        <div className="w-full bg-slate-200 rounded-full h-1.5">
            <div className={`${barColor} h-1.5 rounded-full`} style={{ width: `${occupancy}%` }}></div>
        </div>
    );
};

const OwnerDetailModal: React.FC<{ owner: Owner; onClose: () => void; }> = ({ owner, onClose }) => {
    const { properties, maintenanceRequests: allMaintenanceRequests } = useData();
    const [activeTab, setActiveTab] = useState('Portfolio');
    const tabs = ['Portfolio', 'Financials', 'Documents', 'Notes'];

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
            return { ...prop, totalUnits, occupiedUnits, monthlyRevenue, openMaintenance };
        });
    }, [owner, properties, allMaintenanceRequests]);

    const renderContent = () => {
        switch (activeTab) {
            case 'Portfolio':
                return (
                    <div className="space-y-4">
                        {ownerProperties.map(prop => (
                            <div key={prop.name} className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                                <h4 className="font-bold text-slate-800">{prop.name}</h4>
                                <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                    <div className="flex items-center"><HomeIcon className="w-4 h-4 mr-2 text-slate-400"/> Occupancy: <span className="font-semibold ml-auto">{`${(prop.occupiedUnits/prop.totalUnits * 100).toFixed(0)}%`}</span></div>
                                    <div className="flex items-center"><DollarIcon className="w-4 h-4 mr-2 text-slate-400"/> Revenue: <span className="font-semibold ml-auto">${prop.monthlyRevenue.toLocaleString()}</span></div>
                                    <div className="flex items-center"><UsersIcon className="w-4 h-4 mr-2 text-slate-400"/> Units: <span className="font-semibold ml-auto">{prop.occupiedUnits}/{prop.totalUnits}</span></div>
                                    <div className="flex items-center"><WrenchIcon className="w-4 h-4 mr-2 text-slate-400"/> Maintenance: <span className="font-semibold ml-auto">{prop.openMaintenance}</span></div>
                                </div>
                                <div className="mt-4 border-t pt-3">
                                    <Link to="/manager/properties" className="text-sm font-semibold text-blue-600 hover:underline">View Property Details</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'Financials': return <p className="text-slate-500">Financial details for this owner will be displayed here.</p>;
            case 'Documents': return <p className="text-slate-500">Documents related to this owner will be displayed here.</p>;
            case 'Notes': return <p className="text-slate-500">Notes and activity log for this owner will be displayed here.</p>;
            default: return null;
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
                            <h3 className="text-xl font-bold text-slate-800">{owner.name}</h3>
                            <p className="text-sm text-slate-500">{owner.email}</p>
                            <p className="text-sm text-slate-500">{owner.phone}</p>
                        </div>
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1"><XMarkIcon className="w-6 h-6"/></button>
                    </div>
                </div>
                 <nav className="border-b px-4 flex-shrink-0">
                    <div className="flex space-x-1">
                        {tabs.map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-semibold rounded-t-md ${activeTab === tab ? 'bg-slate-50 text-blue-600 border-b-2 border-blue-500' : 'text-slate-500 hover:text-slate-800'}`}>
                                {tab}
                            </button>
                        ))}
                    </div>
                </nav>
                <div className="flex-1 overflow-y-auto p-6 text-sm">
                    {renderContent()}
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
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [selectedOwners, setSelectedOwners] = useState<Set<string>>(new Set());
    const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setActiveMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
    const getInitials = (name: string) => {
        const words = name.split(' ');
        if (words.length > 1) {
            return `${words[0][0]}${words[1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const getAvatarColor = (name: string) => {
        const colors = ['bg-blue-200 text-blue-800', 'bg-green-200 text-green-800', 'bg-amber-200 text-amber-800', 'bg-violet-200 text-violet-800', 'bg-rose-200 text-rose-800'];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    const handleAddOwner = (newOwnerData: Omit<Owner, 'id'>) => {
        addOwner(newOwnerData);
        setIsAddModalOpen(false);
    };

    const handleRemoveOwner = (ownerId: string) => {
        if (window.confirm('Are you sure you want to remove this owner? This action cannot be undone.')) {
            deleteOwners([ownerId]);
            if (selectedOwner?.id === ownerId) {
                setSelectedOwner(null);
            }
        }
        setActiveMenu(null);
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

    const handleBulkRemove = () => {
        if (window.confirm(`Are you sure you want to remove ${selectedOwners.size} owners? This action cannot be undone.`)) {
            deleteOwners(Array.from(selectedOwners));
            setSelectedOwners(new Set());
        }
    };

    return (
        <DashboardLayout navItems={MANAGER_NAV} activePath="/manager/owners">
            <div className="h-full flex flex-col">
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Owners</h2>
                <p className="text-slate-500 mb-6">Manage owner information and property portfolios.</p>

                 <div className="flex justify-between items-center mb-4">
                    {selectedOwners.size > 0 ? (
                         <div className="flex items-center space-x-4 bg-slate-100 p-2 rounded-lg">
                            <span className="text-sm font-semibold text-slate-700">{selectedOwners.size} selected</span>
                            <button onClick={() => alert('Sending message...')} className="flex items-center text-sm font-medium text-slate-600 hover:text-blue-600"><MessageIcon className="w-4 h-4 mr-1.5" /> Send Message</button>
                            <button onClick={exportToCSV} className="flex items-center text-sm font-medium text-slate-600 hover:text-blue-600"><DocumentIcon className="w-4 h-4 mr-1.5" /> Export CSV</button>
                            <button onClick={handleBulkRemove} className="flex items-center text-sm font-medium text-red-600 hover:text-red-800"><TrashIcon className="w-4 h-4 mr-1.5" /> Remove</button>
                        </div>
                    ) : (
                        <div>
                            {/* Placeholder for future filters */}
                        </div>
                    )}
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon className="w-4 h-4 text-slate-400" />
                            </div>
                            <input type="text" placeholder="Search owners..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg w-72 focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <button onClick={() => setIsAddModalOpen(true)} className="flex items-center justify-center bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            <PlusIcon className="w-5 h-5 mr-2" />
                            Add Owner
                        </button>
                    </div>
                </div>

                <p className="text-sm text-slate-500 my-4">Showing {filteredOwners.length} of {owners.length} owners.</p>

                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-auto flex-1">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-t border-slate-200 sticky top-0">
                            <tr className="text-xs text-slate-500 uppercase font-semibold">
                                <th className="px-4 py-3 w-12 text-center">
                                    <input type="checkbox" checked={isAllSelected} onChange={(e) => handleSelectAll(e.target.checked)} className="h-4 w-4 rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-500" />
                                </th>
                                <th className="px-6 py-3">
                                    <button onClick={() => requestSort('name')} className="flex items-center space-x-1">
                                        <span>Owner</span>
                                        {sortConfig?.key === 'name' && (sortConfig.direction === 'ascending' ? <ChevronUpIcon className="w-3 h-3" /> : <ChevronDownIcon className="w-3 h-3" />)}
                                    </button>
                                </th>
                                <th className="px-6 py-3">
                                    <button onClick={() => requestSort('propertyCount')} className="flex items-center space-x-1">
                                        <span>Properties</span>
                                    </button>
                                </th>
                                <th className="px-6 py-3">
                                    <button onClick={() => requestSort('totalUnits')} className="flex items-center space-x-1">
                                        <span>Total Units</span>
                                    </button>
                                </th>
                                <th className="px-6 py-3">
                                    <button onClick={() => requestSort('occupancyRate')} className="flex items-center space-x-1">
                                        <span>Occupancy</span>
                                    </button>
                                </th>
                                 <th className="px-6 py-3">
                                    <button onClick={() => requestSort('estMonthlyRevenue')} className="flex items-center space-x-1">
                                        <span>Est. Monthly Revenue</span>
                                    </button>
                                </th>
                                <th className="px-6 py-3 text-right"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {filteredOwners.map(owner => {
                                const isSelectedForBulk = selectedOwners.has(owner.id);
                                return (
                                <tr key={owner.id} onClick={() => setSelectedOwner(selectedOwner?.id === owner.id ? null : owner)} className={`transition-colors cursor-pointer ${selectedOwner?.id === owner.id ? 'bg-blue-100' : isSelectedForBulk ? 'bg-slate-100' : 'hover:bg-slate-50'}`}>
                                    <td className="px-4 py-4 text-center">
                                        <input type="checkbox" checked={isSelectedForBulk} onChange={(e) => handleSelectOwner(owner.id, e.target.checked)} onClick={e => e.stopPropagation()} className="h-4 w-4 rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-500" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className={`w-10 h-10 rounded-full flex-shrink-0 mr-4 flex items-center justify-center font-bold ${getAvatarColor(owner.name)}`}>
                                                {getInitials(owner.name)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-800 text-sm">{owner.name}</p>
                                                <p className="text-xs text-slate-500">{owner.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{owner.propertyCount}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{owner.totalUnits}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-full max-w-28">
                                                <OccupancyBar occupancy={owner.occupancyRate} />
                                            </div>
                                            <span className="text-sm font-medium text-slate-600 w-12 text-right">{owner.occupancyRate.toFixed(0)}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-800">${owner.estMonthlyRevenue.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right relative">
                                        <button onClick={(e) => { e.stopPropagation(); setActiveMenu(owner.id === activeMenu ? null : owner.id); }} className="text-slate-500 hover:text-slate-700 p-1 rounded-full hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                            <EllipsisVerticalIcon className="w-5 h-5" />
                                        </button>
                                        {activeMenu === owner.id && (
                                            <div ref={menuRef} className="absolute right-8 top-full mt-1 w-48 bg-white rounded-md shadow-lg z-20 border border-slate-200 py-1 text-left">
                                                <button className="w-full text-left block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
                                                    Send Message
                                                </button>
                                                <div className="border-t border-slate-200 my-1"></div>
                                                <button onClick={(e) => { e.stopPropagation(); handleRemoveOwner(owner.id); }} className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                                    Remove Owner
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            )})}
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
        </DashboardLayout>
    );
};
export default Owners;