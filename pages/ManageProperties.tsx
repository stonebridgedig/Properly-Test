import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { MANAGER_NAV } from '../constants';
import { SearchIcon, PlusIcon, XMarkIcon, BuildingIcon, ChevronUpIcon, ChevronDownIcon, EllipsisVerticalIcon, TrashIcon, BriefcaseIcon, DocumentIcon, MapIcon, ListBulletIcon, ZillowIcon, TruliaIcon, ApartmentsIcon } from '../components/Icons';
import type { Property, Unit, Building, TenantInUnit, Tenant, Owner, SyndicationListing } from '../types';
import { useData } from '../contexts/DataContext';
import SyndicationModal from '../components/modals/SyndicationModal';

declare const L: any; // Use Leaflet from the global scope

type UnitFormData = {
    name: string;
    bedrooms: string;
    bathrooms: string;
    rent: string;
};

type BuildingFormData = {
  id: number;
  name: string;
  numberOfUnits: number;
  units: UnitFormData[];
};

const SimpleInviteModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSendInvite: (email: string) => void;
}> = ({ isOpen, onClose, onSendInvite }) => {
    const [email, setEmail] = useState('');

    useEffect(() => {
        if (isOpen) {
            setEmail('');
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            onSendInvite(email);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60]">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-between items-center p-6 border-b">
                        <h2 className="text-xl font-bold text-slate-800">Invite New Tenant</h2>
                        <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600"><XMarkIcon className="w-6 h-6" /></button>
                    </div>
                    <div className="p-6">
                        <label htmlFor="invite-email" className="block text-sm font-medium text-slate-700">Tenant's Email Address</label>
                        <input
                            id="invite-email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            autoFocus
                            className="mt-1 w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm"
                            placeholder="e.g., new.tenant@email.com"
                        />
                         <p className="text-xs text-slate-500 mt-2">An invitation link to join the platform will be sent to this email.</p>
                    </div>
                    <div className="flex justify-end items-center p-6 bg-slate-50 border-t space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Send Invitation</button>
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

const AssignOwnerModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onAssign: (ownerName: string) => void;
    owners: Owner[];
    selectedCount: number;
}> = ({ isOpen, onClose, onAssign, owners, selectedCount }) => {
    const [selectedOwner, setSelectedOwner] = useState('');

    useEffect(() => { if(isOpen) setSelectedOwner(''); }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedOwner) onAssign(selectedOwner);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60]">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-between items-center p-6 border-b">
                        <h2 className="text-xl font-bold text-slate-800">Assign Owner</h2>
                        <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600"><XMarkIcon className="w-6 h-6" /></button>
                    </div>
                    <div className="p-6">
                        <p className="text-sm text-slate-600 mb-4">Assign an owner to the {selectedCount} selected properties.</p>
                        <label className="block text-sm font-medium text-slate-700">Select Owner</label>
                        <select
                            value={selectedOwner}
                            onChange={e => setSelectedOwner(e.target.value)}
                            required
                            className="mt-1 w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm"
                        >
                            <option value="" disabled>Choose an owner...</option>
                            {owners.map(owner => <option key={owner.id} value={owner.name}>{owner.name}</option>)}
                        </select>
                    </div>
                    <div className="flex justify-end items-center p-6 bg-slate-50 border-t space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Assign Owner</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const ManageUnitModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (property: Property, building: Building, unit: Unit, tenants: TenantInUnit[]) => void;
    unitData: { property: Property; building: Building; unit: Unit } | null;
    allTenants: Tenant[];
    allProperties: Property[];
    onInviteNew: () => void;
}> = ({ isOpen, onClose, onSave, unitData, allTenants, allProperties, onInviteNew }) => {
    const [tenants, setTenants] = useState<TenantInUnit[]>([]);
    const [tenantToAdd, setTenantToAdd] = useState('');
    const [newTenantRent, setNewTenantRent] = useState('');
    const [showAssignForm, setShowAssignForm] = useState(false);

    useEffect(() => {
        if (isOpen && unitData) {
            setTenants([...unitData.unit.tenants]);
            setTenantToAdd('');
            setNewTenantRent('');
            setShowAssignForm(false);
        }
    }, [isOpen, unitData]);

    const assignedRent = useMemo(() => tenants.reduce((sum, t) => sum + Number(t.rentPortion || 0), 0), [tenants]);
    const marketRent = unitData?.unit.rent || 0;
    const rentDifference = marketRent - assignedRent;

    const availableTenants = useMemo(() => {
        if (!unitData) return [];

        const globallyAssignedTenantNames = new Set(
            allProperties.flatMap(p => p.buildings.flatMap(b => b.units.flatMap(u => u.tenants.map(t => t.name))))
        );

        const globallyUnassignedTenants = allTenants.filter(t => !globallyAssignedTenantNames.has(t.name) && t.status !== 'Pending');

        const tenantsInThisUnitInitially = unitData.unit.tenants;
        
        const removedInThisSession = tenantsInThisUnitInitially.filter(
            initialTenant => !tenants.some(currentTenant => currentTenant.name === initialTenant.name)
        );

        const removedTenantObjects = allTenants.filter(t => 
            removedInThisSession.some(rt => rt.name === t.name)
        );

        const potentialTenants = [...globallyUnassignedTenants, ...removedTenantObjects];
        
        const tenantsInModalNames = new Set(tenants.map(t => t.name));
        const finalAvailableTenants = potentialTenants.filter(t => !tenantsInModalNames.has(t.name));

        return Array.from(new Set(finalAvailableTenants.map(t => t.id)))
            .map(id => finalAvailableTenants.find(t => t.id === id))
            .filter((t): t is Tenant => !!t);

    }, [allTenants, allProperties, tenants, unitData]);

    const handleRentChange = (index: number, value: string) => {
        const newTenants = [...tenants];
        newTenants[index] = { ...newTenants[index], rentPortion: Number(value) };
        setTenants(newTenants);
    };

    const handleRemoveTenant = (index: number) => {
        setTenants(tenants.filter((_, i) => i !== index));
    };

    const handleAddTenant = () => {
        if (tenantToAdd && newTenantRent) {
            setTenants([...tenants, { name: tenantToAdd, rentPortion: Number(newTenantRent) }]);
            setTenantToAdd('');
            setNewTenantRent('');
        }
    };

    const handleSave = () => {
        if (unitData) {
            onSave(unitData.property, unitData.building, unitData.unit, tenants);
        }
    };

    if (!isOpen || !unitData) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl transform">
                <div className="flex justify-between items-center p-6 border-b">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Manage Tenants for Unit {unitData.unit.name}</h2>
                        <p className="text-sm text-slate-500">{unitData.property.name}, {unitData.building.name}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><XMarkIcon className="w-6 h-6" /></button>
                </div>
                <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">{tenants.length > 0 ? 'Current Tenants' : 'Invite Tenant'}</h3>
                        <div className="space-y-3">
                            {tenants.map((tenant, index) => (
                                <div key={index} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-md">
                                    <span className="flex-1 font-medium text-slate-700">{tenant.name}</span>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><span className="text-slate-500">$</span></div>
                                        <input type="number" value={tenant.rentPortion} onChange={e => handleRentChange(index, e.target.value)} className="w-32 pl-7 pr-2 py-1.5 text-sm border-slate-300 rounded-md" />
                                    </div>
                                    <button onClick={() => handleRemoveTenant(index)} className="text-red-500 hover:text-red-700 font-semibold text-sm">Remove</button>
                                </div>
                            ))}
                            {tenants.length === 0 && (
                                <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-lg">
                                    <h4 className="text-md font-semibold text-slate-700">This unit is vacant.</h4>
                                    <p className="text-sm text-slate-500 mt-1">Assign an existing tenant or invite a new one.</p>
                                    <div className="mt-4 flex justify-center space-x-3">
                                        <button onClick={onInviteNew} className="px-4 py-2 font-semibold text-sm text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700">Invite New Tenant</button>
                                        <button onClick={() => setShowAssignForm(true)} className="px-4 py-2 font-semibold text-sm text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">Assign Existing Tenant</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    {(tenants.length > 0 || showAssignForm) && (
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold text-slate-800 mb-2">Add Tenant</h3>
                            <div className="flex items-end space-x-3 p-3 bg-slate-50 rounded-md">
                                <div className="flex-1">
                                    <label className="block text-xs font-medium text-slate-600">Select Tenant</label>
                                    <select value={tenantToAdd} onChange={e => setTenantToAdd(e.target.value)} className="mt-1 w-full text-sm border-slate-300 rounded-md">
                                        <option value="" disabled>Choose an available tenant</option>
                                        {availableTenants.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-600">Rent Portion</label>
                                    <div className="relative mt-1">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><span className="text-slate-500">$</span></div>
                                        <input type="number" value={newTenantRent} onChange={e => setNewTenantRent(e.target.value)} className="w-32 pl-7 pr-2 py-1.5 text-sm border-slate-300 rounded-md" />
                                    </div>
                                </div>
                                <button type="button" onClick={handleAddTenant} disabled={!tenantToAdd || !newTenantRent} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 disabled:bg-slate-400">Add</button>
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex justify-between items-center p-6 bg-slate-50 border-t rounded-b-lg">
                    <div className="text-sm">
                        <p>Market Rent: <span className="font-semibold">${marketRent.toLocaleString()}</span></p>
                        <p>Assigned Rent: <span className="font-semibold">${assignedRent.toLocaleString()}</span></p>
                        <p className={`font-bold ${rentDifference === 0 ? 'text-green-600' : 'text-red-600'}`}>
                            Difference: ${rentDifference.toLocaleString()}
                        </p>
                    </div>
                    <div>
                        <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">Cancel</button>
                        <button onClick={handleSave} className="ml-3 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    );
};


const PropertyFormModal = ({ isOpen, onClose, onSaveProperty, propertyToEdit }) => {
    const isEditMode = !!propertyToEdit;
    const [step, setStep] = useState(1);
    const [propertyName, setPropertyName] = useState('');
    const [address, setAddress] = useState('');
    const [buildings, setBuildings] = useState<BuildingFormData[]>([
        { id: Date.now(), name: 'Main Building', numberOfUnits: 1, units: [] }
    ]);
    const [expandedAccordion, setExpandedAccordion] = useState<number | null>(null);

    useEffect(() => {
        if (isOpen) {
            if (isEditMode) {
                setPropertyName(propertyToEdit.name);
                setAddress(propertyToEdit.address);
                const buildingsFormData = propertyToEdit.buildings.map(b => ({
                    id: Date.now() + Math.random(),
                    name: b.name,
                    numberOfUnits: b.units.length,
                    units: b.units.map(u => ({
                        name: u.name,
                        bedrooms: String(u.bedrooms),
                        bathrooms: String(u.bathrooms),
                        rent: String(u.rent)
                    }))
                }));
                setBuildings(buildingsFormData);
            } else {
                // Reset for add mode
                setPropertyName('');
                setAddress('');
                setBuildings([{ id: Date.now(), name: 'Main Building', numberOfUnits: 1, units: [] }]);
            }
            setStep(1);
            setExpandedAccordion(null);
        }
    }, [isOpen, propertyToEdit]);


    const handleNextStep2 = () => setStep(2);

    const handleNextStep3 = () => {
        const buildingsWithUnits = buildings.map(b => ({
            ...b,
            units: Array.from({ length: Math.max(1, b.numberOfUnits) }, (_, i) => {
                // Try to preserve existing unit data if number of units hasn't changed or increased
                const existingUnit = b.units[i];
                return existingUnit || { name: `Unit ${i + 1}`, bedrooms: '2', bathrooms: '1', rent: '1500' };
            })
        }));
        setBuildings(buildingsWithUnits);
        setExpandedAccordion(buildingsWithUnits[0]?.id || null);
        setStep(3);
    };

    const handleAddBuilding = () => {
        setBuildings(prev => [...prev, { id: Date.now(), name: `Building ${prev.length + 1}`, numberOfUnits: 1, units: [] }]);
    };
    
    const handleRemoveBuilding = (id: number) => {
        setBuildings(prev => prev.filter(b => b.id !== id));
    };

    const handleBuildingChange = (id: number, field: 'name' | 'numberOfUnits', value: string) => {
        const isNumericField = field === 'numberOfUnits';
        setBuildings(prev => prev.map(b => b.id === id ? { ...b, [field]: isNumericField ? Math.max(1, parseInt(value, 10) || 1) : value } : b));
    };

    const handleUnitChange = (buildingId: number, unitIndex: number, field: keyof UnitFormData, value: string) => {
        setBuildings(prevBuildings =>
            prevBuildings.map(b => {
                if (b.id !== buildingId) return b;
                const updatedUnits = [...b.units];
                updatedUnits[unitIndex] = { ...updatedUnits[unitIndex], [field]: value };
                return { ...b, units: updatedUnits };
            })
        );
    };

    const handleSave = () => {
        const finalBuildings: Building[] = buildings.map(b => ({
            name: b.name,
            units: b.units.map(u => ({
                name: u.name,
                status: 'Vacant', // Default status for new/edited units
                tenants: [],
                rent: parseInt(u.rent, 10) || 0,
                bedrooms: parseInt(u.bedrooms, 10) || 0,
                bathrooms: parseFloat(u.bathrooms) || 0,
            }))
        }));
        onSaveProperty({ name: propertyName, address, buildings: finalBuildings }, propertyToEdit?.name);
        onClose();
    };

    const totalCalculations = useMemo(() => {
        return buildings.reduce((acc, building) => {
            acc.totalUnits += (building.units || []).length;
            acc.combinedRent += (building.units || []).reduce((rentAcc, unit) => rentAcc + (parseInt(unit.rent, 10) || 0), 0);
            return acc;
        }, { totalUnits: 0, combinedRent: 0 });
    }, [buildings, step]);


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl transform transition-all duration-300">
                {step === 1 && (
                    <div>
                        <div className="flex justify-between items-center p-6 border-b border-slate-200">
                            <h2 className="text-2xl font-bold text-slate-800">{isEditMode ? 'Edit Property' : 'Add New Property'} (Step 1 of 3)</h2>
                            <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><XMarkIcon className="w-6 h-6" /></button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <label htmlFor="propertyName" className="block text-sm font-medium text-slate-700">Property Name</label>
                                <input type="text" id="propertyName" value={propertyName} onChange={e => setPropertyName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm" placeholder="e.g., The Grand Apartments" />
                            </div>
                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-slate-700">Address</label>
                                <input type="text" id="address" value={address} onChange={e => setAddress(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm" placeholder="e.g., 123 Main St, Anytown, USA" />
                            </div>
                        </div>
                        <div className="flex justify-end items-center p-6 bg-slate-50 border-t border-slate-200 rounded-b-lg">
                            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50">Cancel</button>
                            <button onClick={handleNextStep2} className="ml-3 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700">Next: Add Buildings</button>
                        </div>
                    </div>
                )}
                {step === 2 && (
                    <div>
                         <div className="flex justify-between items-center p-6 border-b border-slate-200">
                            <h2 className="text-2xl font-bold text-slate-800">Add Buildings (Step 2 of 3)</h2>
                            <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><XMarkIcon className="w-6 h-6" /></button>
                        </div>
                        <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                            {buildings.map((building) => (
                                <div key={building.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700">Building Name</label>
                                        <input type="text" value={building.name} onChange={e => handleBuildingChange(building.id, 'name', e.target.value)} className="mt-1 block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md shadow-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700">Number of Units</label>
                                        <input type="number" min="1" value={building.numberOfUnits} onChange={e => handleBuildingChange(building.id, 'numberOfUnits', e.target.value)} className="mt-1 block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md shadow-sm" />
                                    </div>
                                    {buildings.length > 1 && (
                                        <div className="md:col-span-3 text-right">
                                            <button onClick={() => handleRemoveBuilding(building.id)} className="text-xs text-red-600 hover:text-red-800 font-semibold">Remove Building</button>
                                        </div>
                                    )}
                                </div>
                            ))}
                             <button onClick={handleAddBuilding} className="w-full mt-2 flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-dashed border-blue-300 rounded-md hover:bg-blue-100">
                                <PlusIcon className="w-4 h-4 mr-2" /> Add Another Building
                            </button>
                        </div>
                         <div className="flex justify-between items-center p-6 bg-slate-50 border-t border-slate-200 rounded-b-lg">
                            <button onClick={() => setStep(1)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50">Back</button>
                            <button onClick={handleNextStep3} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700">Next: Configure Units</button>
                        </div>
                    </div>
                )}
                {step === 3 && (
                     <div>
                        <div className="flex justify-between items-center p-6 border-b border-slate-200">
                            <h2 className="text-2xl font-bold text-slate-800">Configure Units (Step 3 of 3)</h2>
                            <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><XMarkIcon className="w-6 h-6" /></button>
                        </div>
                        <div className="p-6 space-y-2 max-h-[60vh] overflow-y-auto">
                            {buildings.map((building) => (
                                <div key={building.id} className="border border-slate-200 rounded-lg">
                                    <button onClick={() => setExpandedAccordion(expandedAccordion === building.id ? null : building.id)} className="w-full flex justify-between items-center p-3 text-left bg-slate-50 hover:bg-slate-100 rounded-t-lg">
                                        <span className="font-semibold text-slate-700">{building.name} ({building.units.length} units)</span>
                                        {expandedAccordion === building.id ? <ChevronUpIcon className="w-5 h-5 text-slate-500" /> : <ChevronDownIcon className="w-5 h-5 text-slate-500" />}
                                    </button>
                                    {expandedAccordion === building.id && (
                                        <div className="p-4 space-y-4">
                                            {building.units.map((unit, index) => (
                                                <div key={index} className="grid grid-cols-12 gap-4 items-center border-b border-slate-200 pb-4 last:border-b-0 last:pb-0">
                                                    <div className="col-span-3">
                                                        <label className="block text-xs font-medium text-slate-600">Unit Name</label>
                                                        <input type="text" value={unit.name} onChange={e => handleUnitChange(building.id, index, 'name', e.target.value)} className="mt-1 block w-full px-2 py-1.5 text-sm bg-white border border-slate-300 rounded-md shadow-sm" />
                                                    </div>
                                                    <div className="col-span-2">
                                                        <label className="block text-xs font-medium text-slate-600">Beds</label>
                                                        <input type="number" value={unit.bedrooms} onChange={e => handleUnitChange(building.id, index, 'bedrooms', e.target.value)} className="mt-1 block w-full px-2 py-1.5 text-sm bg-white border border-slate-300 rounded-md shadow-sm" />
                                                    </div>
                                                    <div className="col-span-2">
                                                        <label className="block text-xs font-medium text-slate-600">Baths</label>
                                                        <input type="number" step="0.5" value={unit.bathrooms} onChange={e => handleUnitChange(building.id, index, 'bathrooms', e.target.value)} className="mt-1 block w-full px-2 py-1.5 text-sm bg-white border border-slate-300 rounded-md shadow-sm" />
                                                    </div>
                                                    <div className="col-span-5">
                                                        <label className="block text-xs font-medium text-slate-600">Monthly Rent</label>
                                                        <div className="relative mt-1">
                                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2"><span className="text-slate-500 sm:text-sm">$</span></div>
                                                            <input type="number" value={unit.rent} onChange={e => handleUnitChange(building.id, index, 'rent', e.target.value)} className="block w-full pl-6 pr-2 py-1.5 text-sm bg-white border border-slate-300 rounded-md shadow-sm" />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                         <div className="flex justify-between items-center p-6 bg-slate-50 border-t border-slate-200 rounded-b-lg">
                            <div>
                                <span className="text-sm font-medium text-slate-700">Total Units: {totalCalculations.totalUnits}</span>
                                <span className="mx-3 text-slate-300">|</span>
                                <span className="text-sm font-medium text-slate-700">Combined Rent: ${totalCalculations.combinedRent.toLocaleString()}/mo</span>
                            </div>
                            <div>
                                <button onClick={() => setStep(2)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50">Back</button>
                                <button onClick={handleSave} className="ml-3 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700">{isEditMode ? 'Save Changes' : 'Create Property'}</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const OccupancyBar = ({ occupied, total }) => {
    const percentage = total > 0 ? (occupied / total) * 100 : 0;
    let barColor = 'bg-green-500';
    if (percentage < 80 && percentage >= 50) {
        barColor = 'bg-amber-500';
    } else if (percentage < 50) {
        barColor = 'bg-red-500';
    }

    return (
        <div className="w-full bg-slate-200 rounded-full h-1.5">
            <div className={`${barColor} h-1.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
        </div>
    );
};

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'Occupied': return 'bg-green-100 text-green-700';
        case 'Vacant': return 'bg-slate-100 text-slate-700';
        default: return 'bg-slate-100 text-slate-700';
    }
};

const PropertyDetailModal = ({ property, onClose, totalUnits, occupiedUnits, revenue, onManageUnit, onEdit, onBulkRentAdjust, onSyndicate, onUnpublish }) => {
    const [expandedBuildings, setExpandedBuildings] = useState<Set<string>>(new Set());

    const toggleBuilding = (buildingName: string) => {
        setExpandedBuildings(prev => {
            const newSet = new Set(prev);
            if (newSet.has(buildingName)) {
                newSet.delete(buildingName);
            } else {
                newSet.add(buildingName);
            }
            return newSet;
        });
    };

    const occupancyPercentage = totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0;

    const PlatformLogos = ({ platforms }) => (
        <div className="flex items-center space-x-1">
            {platforms.includes('Zillow') && <ZillowIcon className="w-5 h-5" />}
            {platforms.includes('Trulia') && <TruliaIcon className="w-5 h-5" />}
            {platforms.includes('Apartments.com') && <ApartmentsIcon className="w-5 h-5" />}
        </div>
    );

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 transition-opacity duration-300"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-5xl h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 border-b border-slate-200 relative flex-shrink-0">
                    <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-slate-800">{property.name}</h3>
                        <div className="mt-2 flex items-center justify-center space-x-2">
                            <button onClick={() => onEdit(property)} className="text-sm font-medium text-slate-700 bg-white border border-slate-300 px-3 py-1.5 rounded-lg hover:bg-slate-50">Edit Property</button>
                            <button onClick={() => onBulkRentAdjust(property)} className="text-sm font-medium text-slate-700 bg-white border border-slate-300 px-3 py-1.5 rounded-lg hover:bg-slate-50">Bulk Rent Adjustment</button>
                        </div>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-semibold">Occupancy</p>
                            <p className="text-lg font-bold text-slate-800">{occupancyPercentage.toFixed(1)}%</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-semibold">Units</p>
                            <p className="text-lg font-bold text-slate-800">{occupiedUnits}/{totalUnits}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-semibold">Revenue</p>
                            <p className="text-lg font-bold text-slate-800">${revenue.toLocaleString()}/mo</p>
                        </div>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <h4 className="text-sm font-semibold text-slate-600 uppercase">Buildings</h4>
                    {property.buildings.map(building => {
                        const isExpanded = expandedBuildings.has(building.name);
                        return (
                            <div key={building.name} className="bg-slate-50 rounded-lg border border-slate-200">
                                <button onClick={() => toggleBuilding(building.name)} className="w-full flex justify-between items-center p-3 text-left">
                                    <span className="font-semibold text-slate-700">{building.name}</span>
                                    {isExpanded ? <ChevronUpIcon className="w-5 h-5 text-slate-500" /> : <ChevronDownIcon className="w-5 h-5 text-slate-500" />}
                                </button>
                                {isExpanded && (
                                    <div className="p-3 border-t border-slate-200">
                                        <table className="w-full text-sm">
                                            <thead className="text-left">
                                                <tr className="text-xs text-slate-500 uppercase">
                                                    <th className="pb-2 font-medium">Unit</th>
                                                    <th className="pb-2 font-medium">Status</th>
                                                    <th className="pb-2 font-medium">Tenant</th>
                                                    <th className="pb-2 font-medium">Rent</th>
                                                    <th className="pb-2 font-medium text-center">Marketing</th>
                                                    <th className="pb-2 font-medium text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {building.units.map(unit => (
                                                    <tr key={unit.name} className="border-t border-slate-200">
                                                        <td className="py-2 font-medium text-slate-800">{unit.name}</td>
                                                        <td className="py-2"><span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(unit.status)}`}>{unit.status}</span></td>
                                                        <td className="py-2 text-slate-600">{unit.tenants.map(t => t.name).join(', ') || '—'}</td>
                                                        <td className="py-2 text-slate-600">${unit.rent.toLocaleString()}</td>
                                                        <td className="py-2 text-center">
                                                            {unit.status === 'Vacant' ? (
                                                                unit.syndication ? (
                                                                    <div className="flex items-center justify-center space-x-2">
                                                                        <PlatformLogos platforms={unit.syndication.platforms} />
                                                                        <button onClick={() => onUnpublish(property, building, unit)} className="text-red-500 hover:text-red-700 p-1 rounded-full" title="Unpublish">
                                                                            <XMarkIcon className="w-4 h-4" />
                                                                        </button>
                                                                    </div>
                                                                ) : (
                                                                    <button onClick={() => onSyndicate(property, building, unit)} className="text-blue-600 hover:underline text-xs font-semibold">Publish</button>
                                                                )
                                                            ) : (
                                                                <span className="text-xs text-slate-400">—</span>
                                                            )}
                                                        </td>
                                                        <td className="py-2 text-right">
                                                            <button onClick={() => onManageUnit(property, building, unit)} className="text-blue-600 hover:underline text-xs font-semibold">Manage Tenants</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

const BulkRentAdjustModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onApply: (property: Property, updatedUnits: Unit[]) => void;
    property: Property | null;
}> = ({ isOpen, onClose, onApply, property }) => {
    const [type, setType] = useState<'increase' | 'decrease'>('increase');
    const [mode, setMode] = useState<'percentage' | 'flat'>('percentage');
    const [value, setValue] = useState<number>(0);

    useEffect(() => {
        if (isOpen) {
            setType('increase');
            setMode('percentage');
            setValue(0);
        }
    }, [isOpen]);

    const allUnits = useMemo(() => property?.buildings.flatMap(b => b.units) || [], [property]);

    const adjustedUnits = useMemo(() => {
        if (!value || value <= 0) return allUnits.map(u => ({ ...u, newRent: u.rent }));

        return allUnits.map(unit => {
            let newRent = unit.rent;
            const adjustment = type === 'increase' ? 1 : -1;

            if (mode === 'percentage') {
                newRent = newRent * (1 + (adjustment * value / 100));
            } else { // flat
                newRent = newRent + (adjustment * value);
            }
            return { ...unit, newRent: Math.max(0, newRent) }; // Ensure rent doesn't go below 0
        });
    }, [allUnits, type, mode, value]);

    const handleApply = () => {
        const finalUnits = adjustedUnits.map(({ newRent, ...rest }) => ({ ...rest, rent: newRent }));
        onApply(property!, finalUnits);
    };

    if (!isOpen || !property) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60]">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-bold text-slate-800">Bulk Rent Adjustment for {property.name}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><XMarkIcon className="w-6 h-6" /></button>
                </div>
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-3 gap-4 items-end">
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Action</label>
                            <select value={type} onChange={(e) => setType(e.target.value as any)} className="w-full text-sm border-slate-300 rounded-md">
                                <option value="increase">Increase</option>
                                <option value="decrease">Decrease</option>
                            </select>
                        </div>
                         <div className="col-span-1">
                            <label className="block text-sm font-medium text-slate-700 mb-1">By</label>
                            <select value={mode} onChange={(e) => setMode(e.target.value as any)} className="w-full text-sm border-slate-300 rounded-md">
                                <option value="percentage">Percentage (%)</option>
                                <option value="flat">Flat Amount ($)</option>
                            </select>
                        </div>
                        <div className="col-span-1">
                             <label className="block text-sm font-medium text-slate-700 mb-1">Value</label>
                            <input type="number" value={value} onChange={e => setValue(Number(e.target.value))} className="w-full text-sm border-slate-300 rounded-md" />
                        </div>
                    </div>
                    <div className="border-t pt-4">
                        <h3 className="text-md font-semibold text-slate-800 mb-2">Preview Changes</h3>
                         <div className="max-h-60 overflow-y-auto border rounded-lg">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 sticky top-0">
                                    <tr>
                                        <th className="p-3 font-medium">Unit</th>
                                        <th className="p-3 font-medium text-right">Current Rent</th>
                                        <th className="p-3 font-medium text-right">New Rent</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {adjustedUnits.map(unit => (
                                        <tr key={unit.name}>
                                            <td className="p-3">{unit.name}</td>
                                            <td className="p-3 text-right">${unit.rent.toLocaleString()}</td>
                                            <td className="p-3 text-right font-semibold text-blue-600">${unit.newRent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                         </div>
                    </div>
                </div>
                <div className="flex justify-end items-center p-6 bg-slate-50 border-t space-x-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">Cancel</button>
                    <button onClick={handleApply} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Apply Changes</button>
                </div>
            </div>
        </div>
    );
};

const MapView: React.FC<{
    properties: (Property & { totalUnits: number; occupiedUnits: number; vacantUnits: number; revenue: number; })[];
    onSelectProperty: (property: Property) => void;
}> = ({ properties, onSelectProperty }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);
    const markersRef = useRef<any[]>([]);

    useEffect(() => {
        if (mapRef.current || !mapContainerRef.current) return;
        
        mapRef.current = L.map(mapContainerRef.current).setView([39.8283, -98.5795], 4);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapRef.current);
        
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);
    
    useEffect(() => {
        if (!mapRef.current) return;
        
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];
        
        const validProperties = properties.filter(p => p.latitude != null && p.longitude != null);
        
        if (validProperties.length > 0) {
            validProperties.forEach(prop => {
                const marker = L.marker([prop.latitude, prop.longitude]).addTo(mapRef.current);
                
                const occupancy = prop.totalUnits > 0 ? (prop.occupiedUnits / prop.totalUnits * 100).toFixed(1) : 0;
                
                const popupContent = `
                    <div class="font-sans">
                        <h3 class="font-bold text-md mb-1">${prop.name}</h3>
                        <p class="text-sm text-slate-600">${prop.address}</p>
                        <div class="text-sm mt-2 pt-2 border-t">
                            <p><strong>Occupancy:</strong> ${occupancy}%</p>
                            <p><strong>Revenue:</strong> $${prop.revenue.toLocaleString()}/mo</p>
                        </div>
                        <button id="popup-btn-${prop.name.replace(/\s+/g, '-')}" class="mt-3 w-full text-center text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 p-2 rounded-md">View Details</button>
                    </div>
                `;

                marker.bindPopup(popupContent);
                
                marker.on('popupopen', () => {
                    const button = document.getElementById(`popup-btn-${prop.name.replace(/\s+/g, '-')}`);
                    if (button) {
                        button.onclick = () => onSelectProperty(prop);
                    }
                });
                markersRef.current.push(marker);
            });

            const bounds = L.latLngBounds(validProperties.map(p => [p.latitude!, p.longitude!]));
            mapRef.current.fitBounds(bounds, { padding: [50, 50] });
        }
        
    }, [properties, onSelectProperty]);
    
    return <div ref={mapContainerRef} className="w-full h-full rounded-lg" />;
};

const ManageProperties: React.FC = () => {
    const { properties, tenants: allTenants, owners, updateProperty, addTenant, addProperty, deleteProperties, assignOwnerToProperties } = useData();
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchParams] = useSearchParams();
    const filterParam = searchParams.get('filter');
    const [activeFilter, setActiveFilter] = useState('All');
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: string } | null>({ key: 'name', direction: 'ascending' });
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isManageUnitModalOpen, setIsManageUnitModalOpen] = useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [unitToManage, setUnitToManage] = useState<{ property: Property; building: Building; unit: Unit } | null>(null);
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
    const [propertyToEdit, setPropertyToEdit] = useState<Property | null>(null);
    const [selectedProperties, setSelectedProperties] = useState<Set<string>>(new Set());
    const [isBulkRentModalOpen, setIsBulkRentModalOpen] = useState(false);
    const [propertyToAdjust, setPropertyToAdjust] = useState<Property | null>(null);
    const [isAssignOwnerModalOpen, setIsAssignOwnerModalOpen] = useState(false);
    const [isConfirmRemoveOpen, setIsConfirmRemoveOpen] = useState(false);
    const [isSyndicationModalOpen, setIsSyndicationModalOpen] = useState(false);
    const [unitToSyndicate, setUnitToSyndicate] = useState<{ property: Property; building: Building; unit: Unit } | null>(null);

    useEffect(() => {
        if (filterParam === 'vacant') {
            setActiveFilter('With Vacancies');
        }
    }, [filterParam]);

    const handleSaveProperty = (propertyData: Omit<Property, 'owner'>, originalName?: string) => {
        if (originalName) { // Edit mode
            const existingProperty = properties.find(p => p.name === originalName);
            const updatedProperty = { ...existingProperty, ...propertyData };
            updateProperty(updatedProperty, originalName);
            if (selectedProperty && selectedProperty.name === originalName) {
                setSelectedProperty(updatedProperty);
            }
        } else { // Add mode
            const newProperty: Property = { ...propertyData, owner: '' };
            addProperty(newProperty);
        }
    };
    
    const handleSaveUnitTenants = (property: Property, building: Building, unit: Unit, updatedTenants: TenantInUnit[]) => {
        const newStatus = updatedTenants.length > 0 ? 'Occupied' : 'Vacant';
        const updatedUnit = { ...unit, tenants: updatedTenants, status: newStatus };

        const updatedBuilding = {
            ...building,
            units: building.units.map(u => u.name === unit.name ? updatedUnit : u),
        };

        const updatedProp = {
            ...property,
            buildings: property.buildings.map(b => b.name === building.name ? updatedBuilding : b),
        };
        
        updateProperty(updatedProp, property.name);

        if (selectedProperty && selectedProperty.name === property.name) {
            setSelectedProperty(updatedProp);
        }
        
        setIsManageUnitModalOpen(false);
    };

    const handleSendInvite = (email: string) => {
        if (!unitToManage) return;

        const newTenant: Tenant = {
            id: `t-${Date.now()}`,
            name: `(Pending) ${email.split('@')[0]}`,
            email,
            phone: '',
            propertyName: unitToManage.property.name,
            unitName: unitToManage.unit.name,
            leaseEndDate: '',
            leaseType: 'Fixed',
            status: 'Pending',
            rentStatus: 'N/A',
        };
        
        addTenant(newTenant);

        const newTenantInUnit: TenantInUnit = {
            name: newTenant.name,
            rentPortion: unitToManage.unit.rent, // Default to full rent
        };

        const { property, building, unit } = unitToManage;
        handleSaveUnitTenants(property, building, unit, [newTenantInUnit]);

        setIsInviteModalOpen(false);
    };

    const handleAddNewClick = () => {
        setPropertyToEdit(null);
        setIsFormModalOpen(true);
    };

    const handleEditClick = (property: Property) => {
        setPropertyToEdit(property);
        setIsFormModalOpen(true);
    };

    const handleManageUnitClick = (property: Property, building: Building, unit: Unit) => {
        setUnitToManage({ property, building, unit });
        setIsManageUnitModalOpen(true);
    };

    const handleOpenBulkRentModal = (property: Property) => {
        setPropertyToAdjust(property);
        setIsBulkRentModalOpen(true);
    };

    const handleApplyBulkRentChange = (propertyToUpdate: Property, updatedUnits: Unit[]) => {
        const updatedBuildings = propertyToUpdate.buildings.map(b => ({
            ...b,
            units: b.units.map(u => {
                const updatedUnitData = updatedUnits.find(uu => uu.name === u.name && uu.bedrooms === u.bedrooms);
                return updatedUnitData ? { ...u, rent: updatedUnitData.rent } : u;
            })
        }));

        const finalUpdatedProperty = { ...propertyToUpdate, buildings: updatedBuildings };
        updateProperty(finalUpdatedProperty, propertyToUpdate.name);
        
        if (selectedProperty && selectedProperty.name === propertyToUpdate.name) {
            setSelectedProperty(finalUpdatedProperty);
        }
        
        setIsBulkRentModalOpen(false);
        setPropertyToAdjust(null);
    };

    const handleConfirmRemove = () => {
        deleteProperties(Array.from(selectedProperties));
        if (selectedProperty && selectedProperties.has(selectedProperty.name)) {
            setSelectedProperty(null);
        }
        setSelectedProperties(new Set());
        setIsConfirmRemoveOpen(false);
    };
    
    const handleAssignOwner = (ownerName: string) => {
        assignOwnerToProperties(Array.from(selectedProperties), ownerName);
        setSelectedProperties(new Set());
        setIsAssignOwnerModalOpen(false);
    };

    const handleOpenSyndicationModal = (property: Property, building: Building, unit: Unit) => {
        setUnitToSyndicate({ property, building, unit });
        setIsSyndicationModalOpen(true);
    };

    const handleUpdateUnitSyndication = (listing: SyndicationListing | null) => {
        if (!unitToSyndicate) return;

        const { property, building, unit } = unitToSyndicate;
        
        const updatedUnit = { ...unit, syndication: listing };
        
        const updatedBuilding = {
            ...building,
            units: building.units.map(u => u.name === unit.name ? updatedUnit : u),
        };
        
        const updatedProp = {
            ...property,
            buildings: property.buildings.map(b => b.name === building.name ? updatedBuilding : b),
        };
        
        updateProperty(updatedProp, property.name);
        
        if (selectedProperty && selectedProperty.name === property.name) {
            setSelectedProperty(updatedProp);
        }
        
        setIsSyndicationModalOpen(false);
        setUnitToSyndicate(null);
    };


    const propertiesWithCalculatedFields = useMemo(() => {
        return properties.map(prop => {
            let totalUnits = 0;
            let occupiedUnits = 0;
            let revenue = 0;
            prop.buildings.forEach(building => {
                totalUnits += building.units.length;
                building.units.forEach(unit => {
                    if (unit.status === 'Occupied') {
                        occupiedUnits++;
                        revenue += unit.rent;
                    }
                });
            });
            const vacantUnits = totalUnits - occupiedUnits;
            return { ...prop, totalUnits, occupiedUnits, vacantUnits, revenue };
        });
    }, [properties]);


    const sortedProperties = useMemo(() => {
        let sortableItems = [...propertiesWithCalculatedFields];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [propertiesWithCalculatedFields, sortConfig]);

    const filteredProperties = useMemo(() => {
        return sortedProperties.filter(prop => {
            const matchesFilter = activeFilter === 'All' ||
                (activeFilter === 'Fully Occupied' && prop.occupiedUnits === prop.totalUnits) ||
                (activeFilter === 'With Vacancies' && prop.occupiedUnits < prop.totalUnits);

            const matchesSearch = searchTerm === '' ||
                prop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                prop.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                prop.owner.toLowerCase().includes(searchTerm.toLowerCase());
                
            return matchesFilter && matchesSearch;
        });
    }, [sortedProperties, searchTerm, activeFilter]);
    
    const requestSort = (key: string) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const selectedPropertyWithCalculations = useMemo(() => {
        if (!selectedProperty) return null;
        return propertiesWithCalculatedFields.find(p => p.name === selectedProperty.name);
    }, [selectedProperty, propertiesWithCalculatedFields]);

    const handleSelectProperty = (propertyName: string, isSelected: boolean) => {
        setSelectedProperties(prev => {
            const newSet = new Set(prev);
            if (isSelected) {
                newSet.add(propertyName);
            } else {
                newSet.delete(propertyName);
            }
            return newSet;
        });
    };

    const handleSelectAll = (isChecked: boolean) => {
        if (isChecked) {
            setSelectedProperties(new Set(filteredProperties.map(p => p.name)));
        } else {
            setSelectedProperties(new Set());
        }
    };
    
    const isAllSelected = filteredProperties.length > 0 && selectedProperties.size === filteredProperties.length;
    
    const exportToCSV = () => {
        const selectedData = propertiesWithCalculatedFields.filter(p => selectedProperties.has(p.name));
        const headers = ['Name', 'Address', 'Owner', 'Total Units', 'Occupied Units', 'Vacant Units', 'Revenue'];
        const csvContent = [
            headers.join(','),
            ...selectedData.map(p => [p.name, `"${p.address}"`, p.owner, p.totalUnits, p.occupiedUnits, p.vacantUnits, p.revenue].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.href) {
            URL.revokeObjectURL(link.href);
        }
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.setAttribute('download', 'properties_export.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <DashboardLayout navItems={MANAGER_NAV} activePath="/manager/properties">
            <div className="p-6 lg:p-8 h-full flex flex-col">
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Properties</h2>
                <p className="text-slate-500 mb-6">Review occupancy, units, and invite tenants.</p>

                <div className="flex justify-between items-center mb-4">
                    {selectedProperties.size > 0 ? (
                        <div className="flex items-center space-x-4 bg-slate-100 p-2 rounded-lg">
                            <span className="text-sm font-semibold text-slate-700">{selectedProperties.size} selected</span>
                            <button onClick={() => setIsAssignOwnerModalOpen(true)} className="flex items-center text-sm font-medium text-slate-600 hover:text-blue-600"><BriefcaseIcon className="w-4 h-4 mr-1.5" /> Assign Owner</button>
                            <button onClick={exportToCSV} className="flex items-center text-sm font-medium text-slate-600 hover:text-blue-600"><DocumentIcon className="w-4 h-4 mr-1.5" /> Export CSV</button>
                            <button onClick={() => setIsConfirmRemoveOpen(true)} className="flex items-center text-sm font-medium text-red-600 hover:text-red-800"><TrashIcon className="w-4 h-4 mr-1.5" /> Remove</button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-1 p-1 bg-slate-200 rounded-lg">
                            {['All', 'Fully Occupied', 'With Vacancies'].map(filter => (
                                <button key={filter} onClick={() => setActiveFilter(filter)} className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${activeFilter === filter ? 'bg-white text-blue-600 shadow' : 'text-slate-600 hover:bg-slate-300'}`}>
                                    {filter}
                                </button>
                            ))}
                        </div>
                    )}
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1 p-1 bg-slate-200 rounded-lg">
                            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white text-blue-600 shadow' : 'text-slate-600 hover:bg-slate-300'}`}><ListBulletIcon className="w-5 h-5"/></button>
                            <button onClick={() => setViewMode('map')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'map' ? 'bg-white text-blue-600 shadow' : 'text-slate-600 hover:bg-slate-300'}`}><MapIcon className="w-5 h-5"/></button>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon className="w-4 h-4 text-slate-400" />
                            </div>
                            <input type="text" placeholder="Search properties..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg w-72 focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <button onClick={handleAddNewClick} className="flex items-center justify-center bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            <PlusIcon className="w-5 h-5 mr-2" />
                            Add Property
                        </button>
                    </div>
                </div>

                <div className={`bg-white rounded-lg shadow-sm border border-slate-200 flex-1 ${viewMode === 'list' ? 'overflow-auto' : 'overflow-hidden'}`}>
                    {viewMode === 'list' ? (
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-t border-slate-200 sticky top-0">
                                <tr className="text-xs text-slate-500 uppercase font-semibold">
                                    <th className="px-4 py-3 w-12 text-center">
                                        <input type="checkbox" checked={isAllSelected} onChange={(e) => handleSelectAll(e.target.checked)} className="h-4 w-4 rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-500" />
                                    </th>
                                    <th className="px-6 py-3">
                                        <button onClick={() => requestSort('name')} className="flex items-center space-x-1">
                                            <span>Property</span>
                                            {sortConfig?.key === 'name' && (sortConfig.direction === 'ascending' ? <ChevronUpIcon className="w-3 h-3" /> : <ChevronDownIcon className="w-3 h-3" />)}
                                        </button>
                                    </th>
                                    <th className="px-6 py-3">
                                        <button onClick={() => requestSort('owner')} className="flex items-center space-x-1">
                                            <span>Owner</span>
                                            {sortConfig?.key === 'owner' && (sortConfig.direction === 'ascending' ? <ChevronUpIcon className="w-3 h-3" /> : <ChevronDownIcon className="w-3 h-3" />)}
                                        </button>
                                    </th>
                                    <th className="px-6 py-3 text-right">
                                        <button onClick={() => requestSort('totalUnits')} className="flex items-center space-x-1">
                                            <span>Units</span>
                                            {sortConfig?.key === 'totalUnits' && (sortConfig.direction === 'ascending' ? <ChevronUpIcon className="w-3 h-3" /> : <ChevronDownIcon className="w-3 h-3" />)}
                                        </button>
                                    </th>
                                    <th className="px-6 py-3 text-right">
                                        <button onClick={() => requestSort('vacantUnits')} className="flex items-center space-x-1">
                                            <span>Vacant</span>
                                            {sortConfig?.key === 'vacantUnits' && (sortConfig.direction === 'ascending' ? <ChevronUpIcon className="w-3 h-3" /> : <ChevronDownIcon className="w-3 h-3" />)}
                                        </button>
                                    </th>
                                    <th className="px-6 py-3">Occupancy</th>
                                    <th className="px-6 py-3 text-right">
                                        <button onClick={() => requestSort('revenue')} className="flex items-center space-x-1">
                                            <span>Revenue</span>
                                            {sortConfig?.key === 'revenue' && (sortConfig.direction === 'ascending' ? <ChevronUpIcon className="w-3 h-3" /> : <ChevronDownIcon className="w-3 h-3" />)}
                                        </button>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProperties.map(prop => {
                                    const isSelected = selectedProperties.has(prop.name);
                                    const occupancyPercentage = prop.totalUnits > 0 ? (prop.occupiedUnits / prop.totalUnits) * 100 : 0;
                                    return (
                                        <tr 
                                            key={prop.name}
                                            onClick={() => setSelectedProperty(prop)} 
                                            className={`border-b border-slate-200 last:border-b-0 cursor-pointer transition-colors ${selectedProperty?.name === prop.name ? 'bg-blue-100' : isSelected ? 'bg-slate-100' : 'hover:bg-slate-50'}`}
                                        >
                                            <td className="px-4 py-4 text-center">
                                                <input type="checkbox" checked={isSelected} onChange={(e) => handleSelectProperty(prop.name, e.target.checked)} onClick={(e) => e.stopPropagation()} className="h-4 w-4 rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-500" />
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-semibold text-slate-800">{prop.name}</p>
                                                <p className="text-sm text-slate-500">{prop.address}</p>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600">{prop.owner}</td>
                                            <td className="px-6 py-4 text-sm text-slate-600 text-right">{prop.totalUnits}</td>
                                            <td className="px-6 py-4 text-sm text-slate-600 text-right">{prop.vacantUnits}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-full max-w-28">
                                                        <OccupancyBar occupied={prop.occupiedUnits} total={prop.totalUnits} />
                                                    </div>
                                                    <span className="text-sm font-medium text-slate-600 w-12 text-right">{occupancyPercentage.toFixed(0)}%</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600 text-right">${prop.revenue.toLocaleString()}/mo</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    ) : (
                        <MapView properties={filteredProperties} onSelectProperty={setSelectedProperty} />
                    )}
                </div>
            </div>

            {selectedPropertyWithCalculations && (
                <PropertyDetailModal 
                    property={selectedPropertyWithCalculations} 
                    onClose={() => setSelectedProperty(null)}
                    totalUnits={selectedPropertyWithCalculations.totalUnits}
                    occupiedUnits={selectedPropertyWithCalculations.occupiedUnits}
                    revenue={selectedPropertyWithCalculations.revenue}
                    onManageUnit={handleManageUnitClick}
                    onEdit={handleEditClick}
                    onBulkRentAdjust={handleOpenBulkRentModal}
                    onSyndicate={handleOpenSyndicationModal}
                    onUnpublish={(property, building, unit) => handleUpdateUnitSyndication(null)}
                />
            )}
            
            <PropertyFormModal 
                isOpen={isFormModalOpen} 
                onClose={() => setIsFormModalOpen(false)} 
                onSaveProperty={handleSaveProperty} 
                propertyToEdit={propertyToEdit}
            />

            <ManageUnitModal
                isOpen={isManageUnitModalOpen}
                onClose={() => setIsManageUnitModalOpen(false)}
                onSave={handleSaveUnitTenants}
                unitData={unitToManage}
                allTenants={allTenants}
                allProperties={properties}
                onInviteNew={() => setIsInviteModalOpen(true)}
            />
            
            <SimpleInviteModal 
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                onSendInvite={handleSendInvite}
            />

            <BulkRentAdjustModal
                isOpen={isBulkRentModalOpen}
                onClose={() => setIsBulkRentModalOpen(false)}
                onApply={handleApplyBulkRentChange}
                property={propertyToAdjust}
            />

            <AssignOwnerModal 
                isOpen={isAssignOwnerModalOpen}
                onClose={() => setIsAssignOwnerModalOpen(false)}
                onAssign={handleAssignOwner}
                owners={owners}
                selectedCount={selectedProperties.size}
            />

            <ConfirmModal 
                isOpen={isConfirmRemoveOpen}
                onClose={() => setIsConfirmRemoveOpen(false)}
                onConfirm={handleConfirmRemove}
                title="Remove Properties"
                message={<p>Are you sure you want to remove the {selectedProperties.size} selected properties? This will also remove all associated units, tenants, and maintenance history. This action cannot be undone.</p>}
            />

            <SyndicationModal
                isOpen={isSyndicationModalOpen}
                onClose={() => setIsSyndicationModalOpen(false)}
                onPublish={handleUpdateUnitSyndication}
                unitData={unitToSyndicate}
            />

        </DashboardLayout>
    );
};

export default ManageProperties;