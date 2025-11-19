
import React, { useState, useEffect } from 'react';
import { UserCircleIcon, DollarIcon, HomeIcon, MegaphoneIcon, CheckCircleIcon, SearchIcon, XMarkIcon, PlusIcon } from '../Icons';
import type { Unit, Tenant, Property } from '../../types';

interface UnitEditorProps {
    unit: Unit;
    buildingName: string;
    propertyName: string;
    onSave: (updatedUnit: Unit) => void;
    onClose: () => void;
    onSyndicate: () => void;
    allTenants: Tenant[];
    allProperties: Property[];
}

const UnitEditor: React.FC<UnitEditorProps> = ({ 
    unit, 
    buildingName, 
    propertyName, 
    onSave, 
    onClose, 
    onSyndicate,
    allTenants 
}) => {
    const [formData, setFormData] = useState({
        rent: 0,
        bedrooms: 0,
        bathrooms: 0,
        status: 'Vacant' as 'Occupied' | 'Vacant',
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [showTenantSearch, setShowTenantSearch] = useState(false);

    useEffect(() => {
        if (unit) {
            setFormData({
                rent: unit.rent,
                bedrooms: unit.bedrooms,
                bathrooms: unit.bathrooms,
                status: unit.status,
            });
        }
    }, [unit]);

    const handleSave = () => {
        onSave({
            ...unit,
            ...formData,
        });
        // In a real app, you'd show a success toast here
    };

    const currentTenants = unit.tenants || [];

    return (
        <div className="bg-slate-50 h-full flex flex-col rounded-r-lg">
            <div className="p-6 border-b border-slate-200 bg-white flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Managing Unit {unit.name}</h3>
                    <p className="text-sm text-slate-500">{propertyName} • {buildingName}</p>
                </div>
                <div className="flex items-center space-x-2">
                     {formData.status === 'Vacant' && (
                        <button 
                            onClick={onSyndicate}
                            className="flex items-center px-3 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-md hover:bg-slate-50 transition-colors"
                        >
                            <MegaphoneIcon className="w-4 h-4 mr-2 text-blue-500" />
                            Syndicate
                        </button>
                    )}
                    <button 
                        onClick={handleSave}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Save Changes
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Unit Specs */}
                <section className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center">
                        <HomeIcon className="w-4 h-4 mr-2 text-slate-400" /> Specs & Financials
                    </h4>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Market Rent</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-slate-500 text-sm">$</span>
                                </div>
                                <input 
                                    type="number" 
                                    value={formData.rent} 
                                    onChange={(e) => setFormData({...formData, rent: parseInt(e.target.value) || 0})}
                                    className="pl-7 block w-full text-sm border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
                            <select 
                                value={formData.status} 
                                onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                                className="block w-full text-sm border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="Occupied">Occupied</option>
                                <option value="Vacant">Vacant</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Bedrooms</label>
                            <input 
                                type="number" 
                                value={formData.bedrooms} 
                                onChange={(e) => setFormData({...formData, bedrooms: parseInt(e.target.value) || 0})}
                                className="block w-full text-sm border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Bathrooms</label>
                            <input 
                                type="number" 
                                value={formData.bathrooms} 
                                onChange={(e) => setFormData({...formData, bathrooms: parseFloat(e.target.value) || 0})}
                                className="block w-full text-sm border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                            />
                        </div>
                    </div>
                </section>

                {/* Tenants Section */}
                <section className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center">
                            <UserCircleIcon className="w-4 h-4 mr-2 text-slate-400" /> Occupants
                        </h4>
                        {!showTenantSearch && (
                             <button 
                                onClick={() => setShowTenantSearch(true)}
                                className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center"
                            >
                                <PlusIcon className="w-3 h-3 mr-1" /> Add Tenant
                            </button>
                        )}
                    </div>

                    {currentTenants.length > 0 ? (
                        <div className="space-y-3">
                            {currentTenants.map((tenant, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                                            {tenant.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800">{tenant.name}</p>
                                            <p className="text-xs text-slate-500">Pays: ${tenant.rentPortion.toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <button className="text-xs text-red-500 hover:text-red-700 font-medium">Remove</button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-6 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                            <p className="text-sm text-slate-500">No tenants assigned to this unit.</p>
                        </div>
                    )}

                    {/* Add Tenant Search */}
                    {showTenantSearch && (
                        <div className="mt-4 p-5 bg-slate-50 rounded-xl border border-blue-200 shadow-sm">
                            <div className="flex justify-between items-center mb-3">
                                <label className="text-sm font-bold text-slate-700">Search Existing Tenants</label>
                                <button onClick={() => setShowTenantSearch(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200"><XMarkIcon className="w-5 h-5" /></button>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <SearchIcon className="w-5 h-5 text-slate-400" />
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="Search by name or email..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-11 block w-full text-base py-3 border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                                    autoFocus
                                />
                            </div>
                            
                            {searchTerm && (
                                <div className="mt-3 max-h-60 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-lg">
                                    {allTenants.filter(t => 
                                        t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                        t.email.toLowerCase().includes(searchTerm.toLowerCase())
                                    ).map(t => (
                                        <button 
                                            key={t.id}
                                            className="w-full text-left px-4 py-3 hover:bg-blue-50 flex justify-between items-center border-b border-slate-100 last:border-0 transition-colors group"
                                            onClick={() => {
                                                // Handle add logic mock
                                                setShowTenantSearch(false);
                                                setSearchTerm('');
                                            }}
                                        >
                                            <div>
                                                <p className="font-semibold text-slate-900">{t.name}</p>
                                                <p className="text-xs text-slate-500 group-hover:text-blue-600">{t.email}</p>
                                            </div>
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${t.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                                {t.status}
                                            </span>
                                        </button>
                                    ))}
                                    {allTenants.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.email.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                                        <div className="px-4 py-8 text-sm text-slate-500 text-center">
                                            <p>No tenants found.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default UnitEditor;
