
import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { MANAGER_NAV } from '../constants';
import { 
    DollarIcon, HomeIcon, WrenchIcon, 
    MapPinIcon, ChevronRightIcon,
    SearchIcon, CheckCircleIcon, UsersIcon
} from '../components/Icons';
import { useData } from '../contexts/DataContext';

const StatCardEnhanced: React.FC<{
    title: string;
    value: string;
    children?: React.ReactNode;
    icon: React.ReactNode;
    iconColorClass: string;
}> = ({ title, value, children, icon, iconColorClass }) => (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-full transition-all hover:shadow-md group relative overflow-hidden">
        <div className="flex items-center justify-between mb-4 relative z-10">
            <div className={`p-2.5 rounded-xl ${iconColorClass} transition-transform group-hover:scale-105`}>
                {icon}
            </div>
            <div className="text-right">
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">{title}</p>
                 <h4 className="text-2xl font-extrabold text-slate-800 tracking-tight">{value}</h4>
            </div>
        </div>
        <div className="relative z-10 mt-auto">
            {children}
        </div>
        {/* Decorative Background Element */}
        <div className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-10 ${iconColorClass.replace('text', 'bg')}`}></div>
    </div>
);

const ProgressBar: React.FC<{ percentage: number, colorClass?: string }> = ({ percentage, colorClass = "bg-blue-500" }) => (
    <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
        <div className={`${colorClass} h-1.5 rounded-full transition-all duration-1000`} style={{ width: `${percentage}%` }}></div>
    </div>
);

// --- List View Component ---
const PropertyHealthRow: React.FC<{
    name: string;
    address: string;
    occupancyRate: number;
    openMaintenance: { total: number; critical: number };
    collectionRate: number;
    onNavigate: () => void;
}> = ({ name, address, occupancyRate, openMaintenance, collectionRate, onNavigate }) => {
    
    const occupancyColor = occupancyRate >= 90 ? 'bg-green-500' : (occupancyRate >= 70 ? 'bg-amber-500' : 'bg-red-500');

    return (
        <div 
            onClick={onNavigate}
            className="group bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors p-4 grid grid-cols-12 gap-4 items-center cursor-pointer last:border-0"
        >
            {/* Property Name & Address */}
            <div className="col-span-4">
                <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{name}</h4>
                <div className="flex items-center text-xs text-slate-500 mt-0.5">
                    <MapPinIcon className="w-3 h-3 mr-1" />
                    <span className="truncate">{address}</span>
                </div>
            </div>

            {/* Occupancy Bar */}
            <div className="col-span-3 pr-4">
                 <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-500">Occupancy</span>
                    <span className="font-bold text-slate-700">{Math.round(occupancyRate)}%</span>
                 </div>
                 <div className="w-full bg-slate-200 rounded-full h-1.5">
                    <div className={`${occupancyColor} h-1.5 rounded-full`} style={{ width: `${occupancyRate}%` }}></div>
                 </div>
            </div>

            {/* Maintenance Badges */}
            <div className="col-span-2">
                 {openMaintenance.total === 0 ? (
                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircleIcon className="w-3 h-3 mr-1" /> All Good
                     </span>
                 ) : (
                     <div className="flex space-x-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            {openMaintenance.total} Open
                        </span>
                     </div>
                 )}
            </div>

            {/* Collections */}
            <div className="col-span-2 text-right">
                <span className="text-sm font-bold text-blue-600">{Math.round(collectionRate)}%</span>
                <span className="text-xs text-slate-400 block">Collected</span>
            </div>

            {/* Action */}
            <div className="col-span-1 flex justify-end">
                <ChevronRightIcon className="w-5 h-5 text-slate-300 group-hover:text-blue-500" />
            </div>
        </div>
    );
};

const PropertyManagerDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { maintenanceRequests, rentRoll, properties, tenants } = useData();
    
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'fully_occupied' | 'vacant'>('all');

    // --- Derived State ---

    // 1. Financial Stats (Global)
    const rentStats = useMemo(() => {
        const totalDue = rentRoll.reduce((sum, item) => sum + item.rent, 0);
        const totalCollected = rentRoll.filter(item => item.status === 'Paid').reduce((sum, item) => sum + item.rent, 0);
        const percentage = totalDue > 0 ? (totalCollected / totalDue) * 100 : 0;
        return { 
            totalCollected, 
            percentage,
            percentageDisplay: percentage.toFixed(0) + '%' 
        };
    }, [rentRoll]);

    // 2. Occupancy Stats (Global)
    const portfolioMetrics = useMemo(() => {
        let totalUnits = 0;
        let occupiedUnits = 0;
        properties.forEach(prop => {
            prop.buildings.forEach(building => {
                totalUnits += building.units.length;
                occupiedUnits += building.units.filter(u => u.status === 'Occupied').length;
            });
        });
        const occupancy = totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 100;
        const vacantCount = totalUnits - occupiedUnits;
        return { occupancy: occupancy.toFixed(1) + '%', vacantCount };
    }, [properties]);

    // 3. Leasing Stats
    const leasingStats = useMemo(() => {
        const applicants = tenants.filter(t => t.status === 'Pending');
        const activeApplicants = applicants.length;
        // Assuming 'Approved' status in screening
        const approvedApplicants = applicants.filter(t => t.screening?.overallStatus === 'Approved').length;
        return { active: activeApplicants, approved: approvedApplicants };
    }, [tenants]);

    // 4. Maintenance Stats (Global)
    const maintenanceStats = useMemo(() => {
        const openRequests = maintenanceRequests.filter(r => r.status !== 'Completed');
        const criticalCount = openRequests.filter(r => r.priority === 'Emergency' || r.priority === 'High').length;
        const routineCount = openRequests.length - criticalCount;
        return { openTotal: openRequests.length, criticalCount, routineCount };
    }, [maintenanceRequests]);

    // 5. Per Property Health Data
    const propertyHealthData = useMemo(() => {
        const data = properties.map(prop => {
            // Occupancy
            let pTotalUnits = 0;
            let pOccupiedUnits = 0;
            prop.buildings.forEach(b => {
                pTotalUnits += b.units.length;
                pOccupiedUnits += b.units.filter(u => u.status === 'Occupied').length;
            });
            const occupancyRate = pTotalUnits > 0 ? (pOccupiedUnits / pTotalUnits) * 100 : 0;

            // Maintenance
            const pOpenRequests = maintenanceRequests.filter(req => req.property === prop.name && req.status !== 'Completed');
            const pCritical = pOpenRequests.filter(req => req.priority === 'Emergency' || req.priority === 'High').length;

            // Collections
            const pRentItems = rentRoll.filter(item => item.propertyName === prop.name);
            const pTotalRent = pRentItems.reduce((sum, item) => sum + item.rent, 0);
            const pCollectedRent = pRentItems.filter(item => item.status === 'Paid').reduce((sum, item) => sum + item.rent, 0);
            const collectionRate = pTotalRent > 0 ? (pCollectedRent / pTotalRent) * 100 : 100;

            return {
                name: prop.name,
                address: prop.address,
                occupancyRate,
                openMaintenance: { total: pOpenRequests.length, critical: pCritical },
                collectionRate
            };
        });

        // Apply Filters
        return data.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.address.toLowerCase().includes(searchTerm.toLowerCase());
            
            let matchesFilter = true;
            if (filterType === 'fully_occupied') {
                matchesFilter = p.occupancyRate === 100;
            } else if (filterType === 'vacant') {
                matchesFilter = p.occupancyRate < 100;
            }

            return matchesSearch && matchesFilter;
        });

    }, [properties, maintenanceRequests, rentRoll, searchTerm, filterType]);

    return (
        <DashboardLayout navItems={MANAGER_NAV} activePath="/manager">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* 1. Personalized Header */}
                <header className="flex flex-col md:flex-row md:items-center md:justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Good morning, John</h1>
                        <p className="text-slate-500 mt-1 flex items-center text-sm">
                            Here's what's happening with your portfolio today.
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center space-x-6">
                        <div className="text-right hidden sm:block">
                            <p className="text-lg font-bold text-slate-800">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</p>
                            <p className="text-sm text-slate-500">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                    </div>
                </header>

                {/* 2. Stat Cards Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link to="/manager/rent-roll">
                        <StatCardEnhanced 
                            title="Rent Collected" 
                            value={rentStats.totalCollected.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })} 
                            icon={<DollarIcon className="w-6 h-6 text-blue-600" />} 
                            iconColorClass="bg-blue-50"
                        >
                            <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1">
                                <span>{rentStats.percentageDisplay} collected</span>
                                <span>Goal: 100%</span>
                            </div>
                            <ProgressBar percentage={rentStats.percentage} colorClass="bg-blue-600" />
                        </StatCardEnhanced>
                    </Link>
                    
                    <Link to="/manager/properties?filter=vacant">
                        <StatCardEnhanced 
                            title="Occupancy" 
                            value={portfolioMetrics.occupancy} 
                            icon={<HomeIcon className="w-6 h-6 text-blue-600" />} 
                            iconColorClass="bg-blue-50"
                        >
                             <div className="flex flex-col mt-2">
                                <div className="flex items-center mb-2">
                                    <span className={`flex h-2 w-2 rounded-full mr-2 ${portfolioMetrics.vacantCount > 0 ? 'bg-red-500' : 'bg-green-500'}`}></span>
                                    <span className="text-sm font-medium text-slate-600">
                                        {portfolioMetrics.vacantCount > 0 ? `${portfolioMetrics.vacantCount} Vacant Units` : 'Fully Occupied'}
                                    </span>
                                </div>
                                
                                {portfolioMetrics.vacantCount > 0 && (
                                    <div className="flex items-center text-xs space-x-3 pt-2 border-t border-slate-50">
                                        <div className="flex items-center text-slate-500">
                                            <UsersIcon className="w-3 h-3 mr-1 text-slate-400" />
                                            <span className="font-semibold text-slate-700 mr-1">{leasingStats.active}</span> Leads
                                        </div>
                                         <div className="flex items-center text-slate-500">
                                            <CheckCircleIcon className="w-3 h-3 mr-1 text-green-500" />
                                            <span className="font-semibold text-slate-700 mr-1">{leasingStats.approved}</span> Approved
                                        </div>
                                    </div>
                                )}
                            </div>
                        </StatCardEnhanced>
                    </Link>

                    <Link to="/manager/maintenance">
                         <StatCardEnhanced 
                            title="Maintenance" 
                            value={String(maintenanceStats.openTotal)} 
                            icon={<WrenchIcon className="w-6 h-6 text-amber-600" />} 
                            iconColorClass="bg-amber-50"
                        >
                            <div className="flex space-x-4 mt-2">
                                <div className="flex items-center">
                                    <span className="w-2 h-2 bg-red-500 rounded-full mr-1.5"></span>
                                    <span className="text-xs font-semibold text-slate-600">{maintenanceStats.criticalCount} Critical</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-1.5"></span>
                                    <span className="text-xs font-semibold text-slate-600">{maintenanceStats.routineCount} Routine</span>
                                </div>
                            </div>
                        </StatCardEnhanced>
                    </Link>
                </div>

                {/* 3. Portfolio Health Matrix / List */}
                <div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                        <div className="flex items-center space-x-3">
                             <h2 className="text-xl font-bold text-slate-800">Portfolio Health</h2>
                             <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">{propertyHealthData.length}</span>
                        </div>
                        
                        {/* Controls Toolbar */}
                        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
                            {/* Search */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <SearchIcon className="w-4 h-4 text-slate-400" />
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="Find property..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full md:w-48 shadow-sm" 
                                />
                            </div>

                            {/* Filter Dropdown */}
                            <select 
                                value={filterType} 
                                onChange={(e) => setFilterType(e.target.value as any)}
                                className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm bg-white text-slate-700 font-medium"
                            >
                                <option value="all">All Properties</option>
                                <option value="fully_occupied">Fully Occupied</option>
                                <option value="vacant">With Vacancies</option>
                            </select>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                        {propertyHealthData.length > 0 ? (
                            <div className="divide-y divide-slate-100">
                                {propertyHealthData.map(prop => (
                                    <PropertyHealthRow 
                                        key={prop.name}
                                        {...prop}
                                        onNavigate={() => navigate(`/manager/properties?search=${encodeURIComponent(prop.name)}`)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-slate-500">
                                No properties found matching your filters.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default PropertyManagerDashboard;
