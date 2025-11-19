
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { MANAGER_NAV } from '../constants';
import { SearchIcon, PlusIcon, ChevronUpIcon, ChevronDownIcon, MapIcon, ListBulletIcon, BuildingIcon, MapPinIcon, XMarkIcon, PencilIcon, DollarIcon, TrashIcon } from '../components/Icons';
import type { Property, Building } from '../types';
import { useData } from '../contexts/DataContext';
import SyndicationModal from '../components/modals/SyndicationModal';
import UnitEditor from '../components/editors/UnitEditor';

declare const L: any; // Use Leaflet from the global scope

const OccupancyBar: React.FC<{ occupied: number, total: number }> = ({ occupied, total }) => {
    const percentage = total > 0 ? (occupied / total) * 100 : 0;
    let barColor = 'bg-green-500';
    if (percentage < 90 && percentage >= 70) {
        barColor = 'bg-amber-500';
    } else if (percentage < 70) {
        barColor = 'bg-red-500';
    }

    return (
        <div className="w-full bg-slate-200 rounded-full h-1.5">
            <div className={`${barColor} h-1.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
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

const BulkRentUpdateModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    property: Property | null;
}> = ({ isOpen, onClose, property }) => {
    const [amount, setAmount] = useState('');
    const [type, setType] = useState<'increase' | 'decrease'>('increase');
    const [mode, setMode] = useState<'percentage' | 'flat'>('percentage');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Simulating Bulk Rent Update for ${property?.name}:\n${type === 'increase' ? 'Increasing' : 'Decreasing'} all unit rents by ${amount}${mode === 'percentage' ? '%' : '$'}`);
        onClose();
    };

    if (!isOpen || !property) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[80]">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-between items-center p-6 border-b">
                        <h3 className="text-xl font-bold text-slate-800">Bulk Rent Adjustment</h3>
                        <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"><XMarkIcon className="w-6 h-6" /></button>
                    </div>
                    <div className="p-6 space-y-4">
                        <p className="text-sm text-slate-600 mb-2">Apply a rent change to all units in <strong>{property.name}</strong>.</p>
                        
                        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-5">
                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Adjustment Type</label>
                                    <select 
                                        value={type} 
                                        onChange={(e) => setType(e.target.value as any)} 
                                        className="w-full px-4 py-3 text-base border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow shadow-sm"
                                    >
                                        <option value="increase">Increase Rent</option>
                                        <option value="decrease">Decrease Rent</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Mode</label>
                                    <select 
                                        value={mode} 
                                        onChange={(e) => setMode(e.target.value as any)} 
                                        className="w-full px-4 py-3 text-base border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow shadow-sm"
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="flat">Flat Amount ($)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                 <label className="block text-sm font-bold text-slate-700 mb-2">Amount</label>
                                 <div className="relative">
                                     {mode === 'flat' && <span className="absolute left-4 top-3.5 text-slate-400 text-base">$</span>}
                                     <input 
                                        type="number" 
                                        value={amount} 
                                        onChange={(e) => setAmount(e.target.value)} 
                                        className={`w-full ${mode === 'flat' ? 'pl-8' : 'pl-4'} pr-4 py-3 text-base border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow shadow-sm`}
                                        placeholder={mode === 'percentage' ? 'e.g. 5' : 'e.g. 50'}
                                        required
                                     />
                                     {mode === 'percentage' && <span className="absolute right-4 top-3.5 text-slate-400 text-base">%</span>}
                                 </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end items-center p-6 bg-slate-50 border-t space-x-3 rounded-b-lg">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-sm transition-colors">Cancel</button>
                        <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 transition-colors">Apply Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const EditPropertyInfoModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    property: Property | null;
}> = ({ isOpen, onClose, property }) => {
    const { updateProperty } = useData();
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');

    useEffect(() => {
        if (property && isOpen) {
            setName(property.name);
            setAddress(property.address);
        }
    }, [property, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (property) {
            updateProperty({ ...property, name, address }, property.name);
            onClose();
        }
    };

    if (!isOpen || !property) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[90]">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-between items-center p-6 border-b">
                        <h3 className="text-lg font-bold text-slate-800">Edit Property Details</h3>
                        <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600"><XMarkIcon className="w-6 h-6" /></button>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                             <label className="block text-xs font-medium text-slate-700 mb-1">Property Name</label>
                             <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full text-sm border-slate-300 rounded-md" required />
                        </div>
                        <div>
                             <label className="block text-xs font-medium text-slate-700 mb-1">Address</label>
                             <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full text-sm border-slate-300 rounded-md" required />
                        </div>
                    </div>
                    <div className="flex justify-end items-center p-6 bg-slate-50 border-t space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const AddBuildingModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    property: Property | null;
}> = ({ isOpen, onClose, property }) => {
    const { updateProperty } = useData();
    
    // New Building State
    const [newBuildingName, setNewBuildingName] = useState('');
    const [newBuildingUnitCount, setNewBuildingUnitCount] = useState('');
    const [newBuildingRent, setNewBuildingRent] = useState('');
    const [newBuildingBeds, setNewBuildingBeds] = useState('');
    const [newBuildingBaths, setNewBuildingBaths] = useState('');

    useEffect(() => {
        if (isOpen) {
            // Reset form
            setNewBuildingName('');
            setNewBuildingUnitCount('');
            setNewBuildingRent('');
            setNewBuildingBeds('');
            setNewBuildingBaths('');
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (property && newBuildingName.trim()) {
            const unitCount = parseInt(newBuildingUnitCount) || 0;
            const rentAmount = parseInt(newBuildingRent) || 0;
            const beds = parseInt(newBuildingBeds) || 1;
            const baths = parseFloat(newBuildingBaths) || 1;
            
            const newUnits = Array.from({ length: unitCount }, (_, i) => ({
                name: `Unit ${i + 1}`,
                status: 'Vacant' as const,
                tenants: [],
                rent: rentAmount,
                bedrooms: beds,
                bathrooms: baths,
            }));

            const newBuilding: Building = { name: newBuildingName.trim(), units: newUnits };
            const updatedBuildings = [...(property.buildings || []), newBuilding];

            updateProperty({
                ...property,
                buildings: updatedBuildings
            }, property.name);
            
            onClose();
        }
    };

    if (!isOpen || !property) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[80]">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-between items-center p-6 border-b">
                        <div>
                            <h3 className="text-xl font-bold text-slate-800">Add Building</h3>
                            <p className="text-sm text-slate-500">Adding to: <span className="font-medium">{property.name}</span></p>
                        </div>
                        <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"><XMarkIcon className="w-6 h-6" /></button>
                    </div>
                    <div className="p-6 space-y-4">
                         <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Building Name</label>
                                <input 
                                    type="text" 
                                    value={newBuildingName} 
                                    onChange={(e) => setNewBuildingName(e.target.value)} 
                                    placeholder="e.g. Annex or Building B" 
                                    className="w-full px-4 py-3 text-base border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow shadow-sm"
                                    required
                                    autoFocus
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                     <label className="block text-sm font-medium text-slate-600 mb-2">Number of Units</label>
                                     <input 
                                        type="number" 
                                        value={newBuildingUnitCount} 
                                        onChange={(e) => setNewBuildingUnitCount(e.target.value)} 
                                        placeholder="e.g. 4" 
                                        className="w-full px-4 py-3 text-base border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-2">Default Rent</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-3.5 text-slate-400 text-base">$</span>
                                        <input 
                                            type="number" 
                                            value={newBuildingRent} 
                                            onChange={(e) => setNewBuildingRent(e.target.value)} 
                                            placeholder="e.g. 1500" 
                                            className="w-full pl-8 pr-4 py-3 text-base border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow shadow-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                     <label className="block text-sm font-medium text-slate-600 mb-2">Default Beds</label>
                                     <input 
                                        type="number" 
                                        value={newBuildingBeds} 
                                        onChange={(e) => setNewBuildingBeds(e.target.value)} 
                                        placeholder="e.g. 2" 
                                        className="w-full px-4 py-3 text-base border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-2">Default Baths</label>
                                    <input 
                                        type="number" 
                                        value={newBuildingBaths} 
                                        onChange={(e) => setNewBuildingBaths(e.target.value)} 
                                        placeholder="e.g. 1.5" 
                                        className="w-full px-4 py-3 text-base border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow shadow-sm"
                                    />
                                </div>
                            </div>
                            <div className="pt-2">
                                <p className="text-xs text-slate-500 italic">
                                    * Units will be automatically generated based on these defaults. You can edit them individually later.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end items-center p-6 bg-slate-50 border-t space-x-3 rounded-b-lg">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-sm transition-colors">Cancel</button>
                        <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 transition-colors">Add Building & Generate Units</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const PropertyDetailModal: React.FC<{
    property: Property & { occupiedUnits: number, totalUnits: number, revenue: number, vacantUnits: number };
    onClose: () => void;
    onSyndicate: (unit: any) => void;
    onAddBuilding: () => void;
    onBulkRent: () => void;
    onEditInfo: () => void;
    allTenants: any[];
    allProperties: Property[];
}> = ({ property, onClose, onSyndicate, onAddBuilding, onBulkRent, onEditInfo, allTenants, allProperties }) => {
    const { updateProperty } = useData();
    const [expandedBuildings, setExpandedBuildings] = useState<Set<string>>(new Set());
    const [selectedUnit, setSelectedUnit] = useState<{ buildingName: string, unit: any } | null>(null);

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
    
    const handleUnitClick = (buildingName: string, unit: any) => {
        setSelectedUnit({ buildingName, unit });
    };

    const handleDeleteBuilding = (buildingName: string) => {
        if (window.confirm(`Are you sure you want to delete "${buildingName}"? All units inside will be lost.`)) {
             const updatedBuildings = property.buildings.filter(b => b.name !== buildingName);
             updateProperty({
                 ...property,
                 buildings: updatedBuildings
             }, property.name);
             
             // If selected unit was in this building, deselect it
             if (selectedUnit?.buildingName === buildingName) {
                 setSelectedUnit(null);
             }
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b flex justify-between items-start bg-slate-50">
                    <div>
                        <div className="flex items-center gap-2 group">
                            <h2 className="text-2xl font-bold text-slate-800">{property.name}</h2>
                            <button onClick={onEditInfo} className="text-slate-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded">
                                <PencilIcon className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-slate-500 flex items-center mt-1"><MapPinIcon className="w-4 h-4 mr-1"/>{property.address}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button onClick={onBulkRent} className="flex items-center px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                            <DollarIcon className="w-4 h-4 mr-2 text-green-600" />
                            Bulk Rent
                        </button>
                        <button onClick={onAddBuilding} className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-blue-700 transition-colors">
                            <PlusIcon className="w-4 h-4 mr-2" />
                            Add Building
                        </button>
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-200 rounded-full transition-colors ml-2">
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>
                
                <div className="flex flex-1 overflow-hidden">
                    {/* Left Sidebar: Buildings & Units */}
                    <div className="w-1/3 border-r border-slate-200 overflow-y-auto bg-slate-50/50">
                         <div className="p-4 space-y-3">
                            {property.buildings.length > 0 ? (
                                property.buildings.map(building => {
                                    const isExpanded = expandedBuildings.has(building.name);
                                    return (
                                    <div key={building.name} className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white group">
                                        <div 
                                            className={`w-full flex justify-between items-center px-4 py-3 text-left transition-all ${isExpanded ? 'bg-slate-50 border-b border-slate-200' : 'bg-white hover:bg-slate-50'}`}
                                        >
                                            <button onClick={() => toggleBuilding(building.name)} className="flex items-center space-x-3 flex-1">
                                                 <div className={`p-1.5 rounded-lg ${isExpanded ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                                                    <BuildingIcon className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <span className={`block font-semibold text-sm ${isExpanded ? 'text-slate-800' : 'text-slate-600'}`}>{building.name}</span>
                                                    <span className="text-xs text-slate-500">{building.units.length} Units</span>
                                                </div>
                                            </button>
                                            <div className="flex items-center">
                                                <button onClick={() => handleDeleteBuilding(building.name)} className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full mr-1" title="Delete Building">
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => toggleBuilding(building.name)}>
                                                    {isExpanded ? <ChevronUpIcon className="w-4 h-4 text-slate-400" /> : <ChevronDownIcon className="w-4 h-4 text-slate-400" />}
                                                </button>
                                            </div>
                                        </div>

                                        {isExpanded && (
                                            <div className="divide-y divide-slate-100">
                                                {building.units.length > 0 ? (
                                                    building.units.map(unit => (
                                                        <button 
                                                            key={unit.name}
                                                            onClick={() => handleUnitClick(building.name, unit)}
                                                            className={`w-full text-left px-4 py-3 flex justify-between items-center hover:bg-slate-50 transition-colors ${selectedUnit?.unit.name === unit.name && selectedUnit?.buildingName === building.name ? 'bg-blue-50 border-l-4 border-blue-600' : 'border-l-4 border-transparent'}`}
                                                        >
                                                            <div>
                                                                <span className="block text-sm font-medium text-slate-800">{unit.name}</span>
                                                                <span className="text-xs text-slate-500">{unit.bedrooms} Bed / {unit.bathrooms} Bath</span>
                                                            </div>
                                                             <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${unit.status === 'Occupied' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                                                                {unit.status}
                                                            </span>
                                                        </button>
                                                    ))
                                                ) : (
                                                    <div className="px-4 py-3 text-xs text-slate-500 italic">No units in this building.</div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )})
                            ) : (
                                <div className="text-center p-8 text-slate-500 text-sm">
                                    <BuildingIcon className="w-10 h-10 mx-auto mb-2 opacity-20" />
                                    <p>No buildings defined.</p>
                                    <p>Click "Add Building" to start.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Content: Unit Editor or Empty State */}
                    <div className="w-2/3 overflow-y-auto p-6">
                        {selectedUnit ? (
                            <UnitEditor
                                unit={selectedUnit.unit}
                                buildingName={selectedUnit.buildingName}
                                propertyName={property.name}
                                onSave={() => {}}
                                onClose={() => setSelectedUnit(null)}
                                onSyndicate={() => onSyndicate({ property, building: property.buildings.find(b => b.name === selectedUnit.buildingName), unit: selectedUnit.unit })}
                                allTenants={allTenants}
                                allProperties={allProperties}
                            />
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                <BuildingIcon className="w-16 h-16 mb-4 opacity-20" />
                                <p className="text-lg font-semibold">Select a unit to view details</p>
                                <p className="text-sm">Expand a building on the left to see its units.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

const MapView: React.FC<{
    properties: any[];
    onSelectProperty: (property: any) => void;
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
    
    return <div ref={mapContainerRef} className="w-full h-full rounded-lg min-h-[500px]" />;
};

const ManageProperties: React.FC = () => {
    const { properties, rentRoll, tenants, deleteProperties } = useData();
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProperties, setSelectedProperties] = useState<Set<string>>(new Set());
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: string } | null>({ key: 'name', direction: 'ascending' });
    
    // Modals State
    const [selectedPropertyDetails, setSelectedPropertyDetails] = useState<Property & { occupiedUnits: number, totalUnits: number, revenue: number, vacantUnits: number } | null>(null);
    const [syndicationUnit, setSyndicationUnit] = useState<any | null>(null);
    const [isSyndicationModalOpen, setIsSyndicationModalOpen] = useState(false);
    
    // New Modals State
    const [isBulkRentModalOpen, setIsBulkRentModalOpen] = useState(false);
    const [isAddBuildingModalOpen, setIsAddBuildingModalOpen] = useState(false);
    const [isEditInfoModalOpen, setIsEditInfoModalOpen] = useState(false);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams();
    const [filterType, setFilterType] = useState<'all' | 'fully_occupied' | 'vacant'>('all');

    useEffect(() => {
        const filter = searchParams.get('filter');
        if (filter === 'vacant') setFilterType('vacant');
        else if (filter === 'fully_occupied') setFilterType('fully_occupied');
        else setFilterType('all');
    }, [searchParams]);

    const handleFilterChange = (newFilter: string) => {
        const newValue = newFilter as 'all' | 'fully_occupied' | 'vacant';
        setFilterType(newValue);
        const newParams = new URLSearchParams(searchParams);
        if (newValue === 'all') newParams.delete('filter');
        else newParams.set('filter', newValue);
        setSearchParams(newParams, { replace: true });
    };

    const propertiesWithStats = useMemo(() => {
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

            return {
                ...prop,
                totalUnits,
                occupiedUnits,
                vacantUnits: totalUnits - occupiedUnits,
                revenue
            };
        });
    }, [properties]);

    const filteredProperties = useMemo(() => {
        return propertiesWithStats.filter(prop => {
            const matchesSearch = prop.name.toLowerCase().includes(searchTerm.toLowerCase()) || prop.address.toLowerCase().includes(searchTerm.toLowerCase());
            
            let matchesFilter = true;
            if (filterType === 'fully_occupied') {
                matchesFilter = prop.vacantUnits === 0;
            } else if (filterType === 'vacant') {
                matchesFilter = prop.vacantUnits > 0;
            }

            return matchesSearch && matchesFilter;
        }).sort((a, b) => {
            if (!sortConfig) return 0;
            const { key, direction } = sortConfig;
            const valA = a[key as keyof typeof a];
            const valB = b[key as keyof typeof b];
            
            if (valA < valB) return direction === 'ascending' ? -1 : 1;
            if (valA > valB) return direction === 'ascending' ? 1 : -1;
            return 0;
        });
    }, [propertiesWithStats, searchTerm, filterType, sortConfig]);

    const requestSort = (key: string) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedProperties(new Set(filteredProperties.map(p => p.name)));
        } else {
            setSelectedProperties(new Set());
        }
    };

    const handleSelectProperty = (name: string, checked: boolean) => {
        setSelectedProperties(prev => {
            const newSet = new Set(prev);
            if (checked) newSet.add(name);
            else newSet.delete(name);
            return newSet;
        });
    };
    
    const handleOpenSyndication = (unitData: any) => {
        setSyndicationUnit(unitData);
        setIsSyndicationModalOpen(true);
    };
    
    const handlePublishSyndication = (listing: any) => {
        alert(`Published listing for ${syndicationUnit.unit.name} to ${listing.platforms.join(', ')}`);
        setIsSyndicationModalOpen(false);
    };

    const handleDeleteProperties = () => {
        if (selectedProperties.size > 0) {
            deleteProperties(Array.from(selectedProperties));
            setSelectedProperties(new Set());
            setIsConfirmDeleteOpen(false);
        }
    }

    const handleExportCSV = () => {
        const selectedData = filteredProperties.filter(p => selectedProperties.has(p.name));
        const headers = ['Name', 'Address', 'Buildings', 'Total Units', 'Occupied Units', 'Revenue'];
        const csvContent = [
            headers.join(','),
            ...selectedData.map(p => [
                `"${p.name}"`,
                `"${p.address}"`,
                p.buildings.length,
                p.totalUnits,
                p.occupiedUnits,
                p.revenue
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.setAttribute('download', 'properties_export.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const isAllSelected = filteredProperties.length > 0 && selectedProperties.size === filteredProperties.length;

    return (
        <DashboardLayout navItems={MANAGER_NAV} activePath="/manager/properties">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Properties</h2>
                    <p className="text-slate-500 mt-1">Manage your portfolio, units, and occupancy.</p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 p-1 bg-slate-200 rounded-lg">
                        <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white text-blue-600 shadow' : 'text-slate-600 hover:bg-slate-300'}`}><ListBulletIcon className="w-5 h-5"/></button>
                        <button onClick={() => setViewMode('map')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'map' ? 'bg-white text-blue-600 shadow' : 'text-slate-600 hover:bg-slate-300'}`}><MapIcon className="w-5 h-5"/></button>
                    </div>
                    <button className="flex items-center bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700">
                        <PlusIcon className="w-5 h-5 mr-2" /> Add Property
                    </button>
                </div>
            </div>

            {selectedProperties.size > 0 ? (
                <div className="mb-4 p-2 bg-slate-100 rounded-lg flex items-center space-x-4">
                    <span className="text-sm font-semibold text-slate-700 px-2">{selectedProperties.size} selected</span>
                    <button onClick={handleExportCSV} className="px-3 py-1.5 text-sm font-semibold bg-white text-slate-700 rounded-md border border-slate-300 hover:bg-slate-50">Export CSV</button>
                    <button onClick={() => setIsConfirmDeleteOpen(true)} className="px-3 py-1.5 text-sm font-semibold bg-red-500 text-white rounded-md hover:bg-red-600">Remove</button>
                </div>
            ) : (
                <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-col sm:flex-row gap-4 w-full">
                         <div className="relative w-full sm:w-72">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><SearchIcon className="w-4 h-4 text-slate-400" /></div>
                            <input type="text" placeholder="Search properties..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg w-full" />
                        </div>
                        <select 
                            value={filterType} 
                            onChange={(e) => handleFilterChange(e.target.value)}
                            className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm bg-white text-slate-700 font-medium"
                        >
                            <option value="all">All Properties</option>
                            <option value="fully_occupied">Fully Occupied</option>
                            <option value="vacant">With Vacancies</option>
                        </select>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                 {viewMode === 'list' ? (
                     <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                                    <th className="px-6 py-3 w-10">
                                        <input type="checkbox" checked={isAllSelected} onChange={(e) => handleSelectAll(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                    </th>
                                    <th className="px-6 py-3 cursor-pointer hover:text-slate-700" onClick={() => requestSort('name')}>
                                        <div className="flex items-center">Property {sortConfig?.key === 'name' && (sortConfig.direction === 'ascending' ? <ChevronUpIcon className="w-3 h-3 ml-1"/> : <ChevronDownIcon className="w-3 h-3 ml-1"/>)}</div>
                                    </th>
                                    <th className="px-6 py-3 text-center text-sm font-semibold text-slate-500">Buildings</th>
                                    <th className="px-6 py-3 text-center text-sm font-semibold text-slate-500">Units</th>
                                    <th className="px-6 py-3 cursor-pointer hover:text-slate-700" onClick={() => requestSort('vacantUnits')}>
                                         <div className="flex items-center">Occupancy {sortConfig?.key === 'vacantUnits' && (sortConfig.direction === 'ascending' ? <ChevronUpIcon className="w-3 h-3 ml-1"/> : <ChevronDownIcon className="w-3 h-3 ml-1"/>)}</div>
                                    </th>
                                    <th className="px-6 py-3 text-right cursor-pointer hover:text-slate-700" onClick={() => requestSort('revenue')}>
                                         <div className="flex items-center justify-end">Revenue {sortConfig?.key === 'revenue' && (sortConfig.direction === 'ascending' ? <ChevronUpIcon className="w-3 h-3 ml-1"/> : <ChevronDownIcon className="w-3 h-3 ml-1"/>)}</div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredProperties.length > 0 ? (
                                    filteredProperties.map(prop => {
                                        const isSelected = selectedProperties.has(prop.name);
                                        return (
                                            <tr 
                                                key={prop.name}
                                                onClick={() => setSelectedPropertyDetails(prop)}
                                                className={`transition-colors cursor-pointer group hover:bg-slate-50`}
                                            >
                                                <td className="px-6 py-4 text-center" onClick={e => e.stopPropagation()}>
                                                    <input type="checkbox" checked={isSelected} onChange={(e) => handleSelectProperty(prop.name, e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div className={`p-2 rounded-lg mr-3 bg-slate-100 text-slate-500 group-hover:bg-white group-hover:shadow-sm transition-all`}>
                                                            <BuildingIcon className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-800 text-sm">{prop.name}</p>
                                                            <p className="text-xs text-slate-500">{prop.address}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center text-sm text-slate-600">
                                                    {prop.buildings.length}
                                                </td>
                                                <td className="px-6 py-4 text-center text-sm text-slate-600">
                                                    {prop.totalUnits}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-24">
                                                            <OccupancyBar occupied={prop.occupiedUnits} total={prop.totalUnits} />
                                                        </div>
                                                        <div className="text-xs">
                                                            <span className="font-bold text-slate-700">{((prop.occupiedUnits/prop.totalUnits)*100).toFixed(0)}%</span>
                                                            <span className="text-slate-400 ml-1">({prop.vacantUnits} Vac)</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right font-medium text-slate-700">
                                                    ${prop.revenue.toLocaleString()}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                            No properties found matching your filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <MapView properties={filteredProperties} onSelectProperty={(p) => { setViewMode('list'); setSelectedPropertyDetails(p); }} />
                )}
            </div>

            {selectedPropertyDetails && (
                <PropertyDetailModal 
                    property={selectedPropertyDetails} 
                    onClose={() => setSelectedPropertyDetails(null)} 
                    onSyndicate={handleOpenSyndication}
                    onAddBuilding={() => setIsAddBuildingModalOpen(true)}
                    onBulkRent={() => setIsBulkRentModalOpen(true)}
                    onEditInfo={() => setIsEditInfoModalOpen(true)}
                    allTenants={tenants}
                    allProperties={properties}
                />
            )}
            
            <SyndicationModal
                isOpen={isSyndicationModalOpen}
                onClose={() => setIsSyndicationModalOpen(false)}
                unitData={syndicationUnit}
                onPublish={handlePublishSyndication}
            />

            <BulkRentUpdateModal 
                isOpen={isBulkRentModalOpen}
                onClose={() => setIsBulkRentModalOpen(false)}
                property={selectedPropertyDetails}
            />

            <AddBuildingModal 
                isOpen={isAddBuildingModalOpen}
                onClose={() => setIsAddBuildingModalOpen(false)}
                property={selectedPropertyDetails}
            />
            
            <EditPropertyInfoModal
                isOpen={isEditInfoModalOpen}
                onClose={() => setIsEditInfoModalOpen(false)}
                property={selectedPropertyDetails}
            />

            <ConfirmModal 
                isOpen={isConfirmDeleteOpen}
                onClose={() => setIsConfirmDeleteOpen(false)}
                onConfirm={handleDeleteProperties}
                title="Delete Properties"
                message={
                    <div className="space-y-2">
                        <p>Are you sure you want to delete <strong>{selectedProperties.size}</strong> selected properties?</p>
                        <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-100">
                            <strong>Warning:</strong> This action is permanent. All associated buildings, units, tenants, and maintenance history will be lost.
                        </p>
                    </div>
                }
            />
        </DashboardLayout>
    );
};

export default ManageProperties;
