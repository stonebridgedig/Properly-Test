
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import StatCard from '../components/dashboard/StatCard';
import { OWNER_NAV, portfolioFinancialsData } from '../constants';
import type { Property } from '../types';
import { DollarIcon, HomeIcon, WrenchIcon, UsersIcon, DocumentIcon, MapPinIcon, XMarkIcon, MapIcon, ListBulletIcon, ChevronUpIcon, ChevronDownIcon } from '../components/Icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useData } from '../contexts/DataContext';

declare const L: any; // Use Leaflet from the global scope

// Hardcode the owner for this view
const currentOwner = 'Greenleaf Investments';

// Helper function to format large numbers
const formatCurrency = (value: number) => `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
const formatYAxis = (tickItem: number) => tickItem >= 1000 ? `$${(tickItem / 1000)}k` : `$${tickItem}`;

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

// Sub-component for the detail pane tabs
const PropertyDetailView: React.FC<{ property: Property & { totalUnits: number; occupiedUnits: number; monthlyRevenue: number; openMaintenance: number; } }> = ({ property }) => {
    const { maintenanceRequests: allMaintenanceRequests, tenants: allTenants, documents: allDocuments } = useData();
    const [expandedBuildings, setExpandedBuildings] = useState<Set<string>>(new Set([property.buildings[0]?.name || '']));

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

    const propertyTenants = useMemo(() => allTenants.filter(t => t.propertyName === property.name), [property.name, allTenants]);
    const propertyMaintenance = useMemo(() => allMaintenanceRequests.filter(req => req.property === property.name), [property.name, allMaintenanceRequests]);
    const propertyDocs = useMemo(() => allDocuments.filter(d => d.property === property.name && d.path.includes(property.name)), [property.name, allDocuments]);
    
    // Mock financial data for individual property
    const propertyFinancials = useMemo(() => {
        return portfolioFinancialsData.map(month => ({
            name: month.name,
            Income: (month.Income as number) * (0.4 + Math.random() * 0.2),
            Expenses: (month.Expenses as number) * (0.4 + Math.random() * 0.2),
        }));
    }, [property.name]);

    return (
        <>
            <div className="p-6 border-b">
                <h3 className="text-2xl font-bold text-slate-800">{property.name}</h3>
                <p className="text-sm text-slate-500 flex items-center mt-1"><MapPinIcon className="w-4 h-4 mr-1.5"/>{property.address}</p>
            </div>
            <div className="p-6 flex-1 overflow-y-auto space-y-8">
                {/* Overview Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard title="Annualized Revenue" value={formatCurrency(property.monthlyRevenue * 12)} icon={<DollarIcon className="text-green-500" />} />
                    <StatCard title="Occupancy" value={`${(property.occupiedUnits / property.totalUnits * 100).toFixed(1)}%`} change={`${property.totalUnits - property.occupiedUnits} Vacant`} icon={<HomeIcon className="text-slate-400" />} />
                    <StatCard title="Open Maintenance" value={String(property.openMaintenance)} icon={<WrenchIcon className="text-amber-500" />} />
                </div>
                
                {/* Financials Chart */}
                <div>
                    <h4 className="text-lg font-semibold text-slate-700 mb-3">Financials (YTD)</h4>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <LineChart data={propertyFinancials} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} style={{fontSize: '12px'}}/>
                                <YAxis axisLine={false} tickLine={false} tickFormatter={formatYAxis} style={{fontSize: '12px'}}/>
                                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                                <Legend iconType="circle" iconSize={8} />
                                <Line type="monotone" dataKey="Income" stroke="#10b981" strokeWidth={2} />
                                <Line type="monotone" dataKey="Expenses" stroke="#ef4444" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Units Table */}
                <div>
                    <h4 className="text-lg font-semibold text-slate-700 mb-3">Units</h4>
                    <div className="space-y-4">
                        {property.buildings.map(building => {
                            const isExpanded = expandedBuildings.has(building.name);
                            return (
                                <div key={building.name} className="bg-slate-50 rounded-lg border border-slate-200">
                                    <button type="button" onClick={() => toggleBuilding(building.name)} className="w-full flex justify-between items-center p-3 text-left">
                                        <span className="font-semibold text-slate-700">{building.name}</span>
                                        {isExpanded ? <ChevronUpIcon className="w-5 h-5 text-slate-500" /> : <ChevronDownIcon className="w-5 h-5 text-slate-500" />}
                                    </button>
                                    {isExpanded && (
                                        <div className="p-3 border-t border-slate-200">
                                            <table className="w-full text-left">
                                                <thead>
                                                    <tr className="text-xs text-slate-500 uppercase border-b">
                                                        <th className="py-3">Unit</th>
                                                        <th className="py-3">Tenant</th>
                                                        <th className="py-3">Rent</th>
                                                        <th className="py-3">Lease End</th>
                                                        <th className="py-3">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {building.units.map(unit => {
                                                        const tenant = propertyTenants.find(t => t.unitName === unit.name && t.propertyName === property.name);
                                                        return (
                                                            <tr key={unit.name} className="border-b text-sm last:border-b-0">
                                                                <td className="py-3 font-medium text-slate-800">{unit.name}</td>
                                                                <td className="py-3 text-slate-600">{tenant?.name || '—'}</td>
                                                                <td className="py-3 text-slate-600">{formatCurrency(unit.rent)}</td>
                                                                <td className="py-3 text-slate-600">{tenant?.leaseEndDate ? new Date(tenant.leaseEndDate).toLocaleDateString() : '—'}</td>
                                                                <td className="py-3">
                                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${unit.status === 'Occupied' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>{unit.status}</span>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Maintenance List */}
                 <div>
                     <h4 className="text-lg font-semibold text-slate-700 mb-3">Recent Maintenance</h4>
                     <div className="space-y-2">
                        {propertyMaintenance.slice(0, 3).map(req => (
                            <div key={req.id} className="p-3 bg-slate-50 rounded-md border text-sm flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-slate-800">{req.issue} <span className="font-normal text-slate-500">- Unit {req.unit}</span></p>
                                    <p className="text-xs text-slate-500">Submitted: {new Date(req.submittedDate).toLocaleDateString()}</p>
                                </div>
                                <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-700">{req.status}</span>
                            </div>
                        ))}
                     </div>
                </div>

                {/* Documents List */}
                 <div>
                    <h4 className="text-lg font-semibold text-slate-700 mb-3">Documents</h4>
                     <ul className="space-y-2">
                        {propertyDocs.map(doc => (
                            <li key={doc.id} className="p-3 bg-slate-50 rounded-md border text-sm flex justify-between items-center">
                                <div className="flex items-center">
                                    <DocumentIcon className="w-5 h-5 text-slate-400 mr-3"/>
                                    <div>
                                        <p className="font-semibold text-slate-800">{doc.name}</p>
                                        <p className="text-xs text-slate-500">{doc.type} - {doc.size}</p>
                                    </div>
                                </div>
                                <button className="text-xs font-semibold text-blue-600 hover:underline">Download</button>
                            </li>
                        ))}
                     </ul>
                </div>
            </div>
        </>
    );
};

const PropertyDetailModal: React.FC<{
    property: Property & { totalUnits: number; occupiedUnits: number; monthlyRevenue: number; openMaintenance: number; };
    onClose: () => void;
}> = ({ property, onClose }) => {
    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 transition-opacity duration-300"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-5xl h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 z-10">
                    <XMarkIcon className="w-6 h-6" />
                </button>
                <PropertyDetailView property={property} />
            </div>
        </div>
    );
}

const MapView: React.FC<{
    properties: (Property & { totalUnits: number; occupiedUnits: number; monthlyRevenue: number; openMaintenance: number; hasExpiringLease: boolean; })[];
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
                            <p><strong>Revenue:</strong> $${prop.monthlyRevenue.toLocaleString()}/mo</p>
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

const OwnerProperties: React.FC = () => {
    const { properties, maintenanceRequests: allMaintenanceRequests, tenants: allTenants } = useData();
    const [searchParams, setSearchParams] = useSearchParams();
    const filterParam = searchParams.get('filter');
    const propertyParam = searchParams.get('property');
    
    const [activeFilter, setActiveFilter] = useState(filterParam || 'all');
    const [selectedProperty, setSelectedProperty] = useState<(typeof ownerProperties)[0] | null>(null);
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

    const ownerProperties = useMemo(() => {
        return properties.filter(p => p.owner === currentOwner).map(prop => {
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
            const hasExpiringLease = allTenants.some(t => {
                if(t.propertyName !== prop.name || !t.leaseEndDate) return false;
                const leaseEndDate = new Date(t.leaseEndDate);
                const now = new Date();
                const ninetyDaysFromNow = new Date();
                ninetyDaysFromNow.setDate(now.getDate() + 90);
                return leaseEndDate > now && leaseEndDate <= ninetyDaysFromNow;
            });
            return { ...prop, totalUnits, occupiedUnits, monthlyRevenue, openMaintenance, hasExpiringLease };
        });
    }, [properties, allMaintenanceRequests, allTenants]);

    useEffect(() => {
        setActiveFilter(filterParam || 'all');
    }, [filterParam]);

    useEffect(() => {
        if (propertyParam) {
            const propertyToSelect = ownerProperties.find(p => p.name === propertyParam);
            if (propertyToSelect) {
                setSelectedProperty(propertyToSelect);
            }
        }
    }, [propertyParam, ownerProperties]);

    const filteredProperties = useMemo(() => {
        if (activeFilter === 'all') return ownerProperties;
        if (activeFilter === 'vacant') return ownerProperties.filter(p => p.occupiedUnits < p.totalUnits);
        if (activeFilter === 'expiring_soon') return ownerProperties.filter(p => p.hasExpiringLease);
        return ownerProperties;
    }, [ownerProperties, activeFilter]);

    const handleFilterChange = (filter: string) => {
        setActiveFilter(filter);
        const newSearchParams = new URLSearchParams(searchParams);
        if (filter === 'all') {
            newSearchParams.delete('filter');
        } else {
            newSearchParams.set('filter', filter);
        }
        setSearchParams(newSearchParams, { replace: true });
    };

    const handleCloseModal = () => {
        setSelectedProperty(null);
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete('property');
        setSearchParams(newSearchParams, { replace: true });
    };

    return (
        <DashboardLayout navItems={OWNER_NAV} activePath="/owner/properties">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">My Properties</h2>
            <p className="text-slate-500 mb-8">A detailed overview of each property in your portfolio.</p>
            
             <div className="mb-6 flex justify-between items-center">
                <div className="flex items-center space-x-1 p-1 bg-slate-200 rounded-lg w-fit">
                    <button onClick={() => handleFilterChange('all')} className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${activeFilter === 'all' ? 'bg-white text-blue-600 shadow' : 'text-slate-600 hover:bg-slate-300'}`}>All</button>
                    <button onClick={() => handleFilterChange('vacant')} className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${activeFilter === 'vacant' ? 'bg-white text-blue-600 shadow' : 'text-slate-600 hover:bg-slate-300'}`}>With Vacancies</button>
                    <button onClick={() => handleFilterChange('expiring_soon')} className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${activeFilter === 'expiring_soon' ? 'bg-white text-blue-600 shadow' : 'text-slate-600 hover:bg-slate-300'}`}>Leases Expiring</button>
                </div>
                <div className="flex items-center space-x-1 p-1 bg-slate-200 rounded-lg">
                    <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white text-blue-600 shadow' : 'text-slate-600 hover:bg-slate-300'}`}><ListBulletIcon className="w-5 h-5"/></button>
                    <button onClick={() => setViewMode('map')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'map' ? 'bg-white text-blue-600 shadow' : 'text-slate-600 hover:bg-slate-300'}`}><MapIcon className="w-5 h-5"/></button>
                </div>
            </div>
            
            <div className={`bg-white rounded-lg shadow-sm border border-slate-200 flex-1 ${viewMode === 'list' ? 'overflow-auto' : 'overflow-hidden'}`}>
                {viewMode === 'list' ? (
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b">
                            <tr className="text-xs text-slate-500 uppercase font-semibold">
                                <th className="px-6 py-3">Property</th>
                                <th className="px-6 py-3">Occupancy</th>
                                <th className="px-6 py-3 text-center">Monthly Revenue</th>
                                <th className="px-6 py-3 text-center">Open Maintenance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {filteredProperties.map(prop => {
                                const occupancyPercentage = prop.totalUnits > 0 ? (prop.occupiedUnits / prop.totalUnits) * 100 : 0;
                                return (
                                    <tr 
                                        key={prop.name} 
                                        onClick={() => setSelectedProperty(prop)} 
                                        className="hover:bg-slate-50 transition-colors cursor-pointer"
                                    >
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-slate-800 text-sm">{prop.name}</p>
                                            <p className="text-xs text-slate-500">{prop.address}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-full max-w-28">
                                                    <OccupancyBar occupancy={occupancyPercentage} />
                                                </div>
                                                <span className="text-sm font-medium text-slate-600 w-12 text-right">{occupancyPercentage.toFixed(0)}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-800 text-center">{formatCurrency(prop.monthlyRevenue)}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-800 text-center">{prop.openMaintenance}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                ) : (
                    <MapView properties={filteredProperties} onSelectProperty={setSelectedProperty} />
                )}
                 {filteredProperties.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-slate-500">No properties match the selected filter.</p>
                    </div>
                 )}
            </div>

            {selectedProperty && (
                <PropertyDetailModal 
                    property={selectedProperty} 
                    onClose={handleCloseModal}
                />
            )}
        </DashboardLayout>
    );
};

export default OwnerProperties;
