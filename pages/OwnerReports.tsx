
import React, { useState, useMemo } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { OWNER_NAV, allTenants, allMaintenanceRequests, rentRollData } from '../constants';
import { DownloadIcon, ClockIcon, PaperAirplaneIcon, DocumentIcon, UsersIcon, WrenchIcon, ArrowLeftIcon, StarIcon, ChartBarIcon, ClipboardListIcon } from '../components/Icons';
import { useData } from '../contexts/DataContext';

// Hardcode the owner for this view
const currentOwner = 'Greenleaf Investments';

const reportCategories = [
    'Financial',
    'Leasing',
    'Operations'
];

const allReports = [
    { id: 'rent-roll', title: 'Rent Roll', description: 'Detailed list of all tenants, rent amounts, and payment statuses.', category: 'Financial', icon: ClipboardListIcon, isPopular: true },
    { id: 'pnl', title: 'Profit & Loss Statement', description: 'Summary of revenues, costs, and expenses over a period.', category: 'Financial', icon: ChartBarIcon, isPopular: true },
    { id: 'tenant-directory', title: 'Tenant Directory', description: 'A complete contact list of all current tenants.', category: 'Leasing', icon: UsersIcon, isPopular: false },
    { id: 'lease-expiration', title: 'Lease Expiration', description: 'Upcoming lease expirations to help manage renewals.', category: 'Leasing', icon: ClockIcon, isPopular: true },
    { id: 'vacancy', title: 'Vacancy Report', description: 'Current vacant units with market rent and days vacant.', category: 'Leasing', icon: DocumentIcon, isPopular: false },
    { id: 'open-maintenance', title: 'Open Maintenance', description: 'All active maintenance requests and their current status.', category: 'Operations', icon: WrenchIcon, isPopular: true },
    { id: 'maintenance-history', title: 'Maintenance History', description: 'Historical log of all completed work orders.', category: 'Operations', icon: WrenchIcon, isPopular: false },
];

const OwnerReports: React.FC = () => {
    const { properties, transactions } = useData();
    const [selectedReport, setSelectedReport] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState('Financial');
    const [filters, setFilters] = useState({
        dateFrom: '',
        dateTo: '',
        property: 'All Properties',
        format: 'PDF',
    });

    // Pre-filter all data sources for the current owner
    const ownerProperties = useMemo(() => properties.filter(p => p.owner === currentOwner), [properties]);
    const ownerPropertyNames = useMemo(() => ownerProperties.map(p => p.name), [ownerProperties]);

    const ownerRentRollData = useMemo(() => rentRollData.filter(item => ownerPropertyNames.includes(item.propertyName)), [ownerPropertyNames]);
    const ownerTransactions = useMemo(() => transactions.filter(t => t.owner === currentOwner), [transactions]);
    const ownerTenants = useMemo(() => allTenants.filter(t => ownerPropertyNames.includes(t.propertyName)), [ownerPropertyNames]);
    const ownerMaintenanceRequests = useMemo(() => allMaintenanceRequests.filter(req => ownerPropertyNames.includes(req.property)), [ownerPropertyNames]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const previewData = useMemo(() => {
        if (!selectedReport) return { columns: [], data: [] };

        const { dateFrom, dateTo, property } = filters;
        const startDate = dateFrom ? new Date(dateFrom) : null;
        const endDate = dateTo ? new Date(dateTo) : null;

        switch (selectedReport) {
            case 'Rent Roll':
                return {
                    columns: ['Tenant', 'Property', 'Unit', 'Rent', 'Balance', 'Due Date', 'Status'],
                    data: ownerRentRollData.filter(item => 
                        (property === 'All Properties' || item.propertyName === property) &&
                        (!startDate || new Date(item.dueDate) >= startDate) &&
                        (!endDate || new Date(item.dueDate) <= endDate)
                    )
                };
            
            case 'Profit & Loss Statement':
                const filteredTransactions = ownerTransactions.filter(t => 
                    (property === 'All Properties' || t.property === property) &&
                    (!startDate || new Date(t.date) >= startDate) &&
                    (!endDate || new Date(t.date) <= endDate)
                );
                const income = filteredTransactions.filter(t => t.category === 'Income').reduce((sum, t) => sum + t.amount, 0);
                const expense = filteredTransactions.filter(t => t.category === 'Expense').reduce((sum, t) => sum + t.amount, 0);
                return {
                    columns: ['Category', 'Amount'],
                    data: [
                        { Category: 'Total Income', Amount: income },
                        { Category: 'Total Expenses', Amount: expense },
                        { Category: 'Net Operating Income', Amount: income - expense },
                    ]
                };

            case 'Tenant Directory':
                return {
                    columns: ['Name', 'Email', 'Phone', 'Property', 'Unit', 'Status'],
                    data: ownerTenants.filter(t => property === 'All Properties' || t.propertyName === property)
                };

            case 'Lease Expiration':
                return {
                    columns: ['Tenant', 'Property', 'Unit', 'Lease End Date'],
                    data: ownerTenants.filter(t => {
                        if (t.status !== 'Active' || !t.leaseEndDate) return false;
                        if (property !== 'All Properties' && t.propertyName !== property) return false;
                        const leaseEndDate = new Date(t.leaseEndDate);
                        return (!startDate || leaseEndDate >= startDate) && (!endDate || leaseEndDate <= endDate);
                    }).map(t => ({ Tenant: t.name, Property: t.propertyName, Unit: t.unitName, 'Lease End Date': t.leaseEndDate }))
                };
            
            case 'Vacancy Report':
                 const vacancies = ownerProperties.flatMap(prop => 
                    prop.buildings.flatMap(b => 
                        b.units.filter(u => u.status === 'Vacant')
                               .map(u => ({ Property: prop.name, Unit: u.name, 'Market Rent': u.rent, Beds: u.bedrooms, Baths: u.bathrooms }))
                    )
                ).filter(v => property === 'All Properties' || v.Property === property);
                return {
                    columns: ['Property', 'Unit', 'Market Rent', 'Beds', 'Baths'],
                    data: vacancies
                };
            
            case 'Open Maintenance':
                return {
                    columns: ['Issue', 'Property', 'Unit', 'Priority', 'Status', 'Submitted'],
                    data: ownerMaintenanceRequests.filter(req => 
                        req.status !== 'Completed' &&
                        (property === 'All Properties' || req.property === property)
                    ).map(r => ({ ...r, Submitted: new Date(r.submittedDate).toLocaleDateString() }))
                };
            
            case 'Maintenance History':
                 return {
                    columns: ['Issue', 'Property', 'Unit', 'Priority', 'Status', 'Submitted'],
                    data: ownerMaintenanceRequests.filter(req => 
                        (property === 'All Properties' || req.property === property) &&
                        (!startDate || new Date(req.submittedDate) >= startDate) &&
                        (!endDate || new Date(req.submittedDate) <= endDate)
                    ).map(r => ({ ...r, Submitted: new Date(r.submittedDate).toLocaleDateString() }))
                };

            default:
                return { columns: [], data: [] };
        }
    }, [selectedReport, filters, ownerProperties, ownerRentRollData, ownerTransactions, ownerTenants, ownerMaintenanceRequests]);

    const popularReports = allReports.filter(r => r.isPopular);
    const categoryReports = allReports.filter(r => r.category === activeCategory);

    if (!selectedReport) {
        return (
            <DashboardLayout navItems={OWNER_NAV} activePath="/owner/reports">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-slate-800">Reports Center</h2>
                        <p className="text-slate-500 mt-1">Generate insights and export data for your portfolio.</p>
                    </div>

                    {/* Most Popular Section */}
                    <div className="mb-10">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center">
                            <StarIcon className="w-4 h-4 mr-2 text-amber-400" /> Most Popular
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {popularReports.map(report => (
                                <button 
                                    key={report.id} 
                                    onClick={() => setSelectedReport(report.title)}
                                    className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 text-left hover:shadow-md hover:border-blue-300 transition-all group"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                                            <report.icon className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{report.title}</h4>
                                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{report.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tabbed Category View */}
                    <div>
                        <div className="border-b border-slate-200 mb-6">
                            <nav className="-mb-px flex space-x-8">
                                {reportCategories.map(category => (
                                    <button
                                        key={category}
                                        onClick={() => setActiveCategory(category)}
                                        className={`
                                            whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                                            ${activeCategory === category
                                                ? 'border-blue-600 text-blue-600'
                                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}
                                        `}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {categoryReports.map(report => (
                                <div 
                                    key={report.id} 
                                    onClick={() => setSelectedReport(report.title)}
                                    className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all group"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-2.5 bg-slate-50 text-slate-600 rounded-lg group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                            <report.icon className="w-6 h-6" />
                                        </div>
                                        <ArrowLeftIcon className="w-4 h-4 text-slate-300 rotate-180 group-hover:text-blue-500 transition-colors" />
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-700 transition-colors">{report.title}</h4>
                                    <p className="text-sm text-slate-500 leading-relaxed flex-grow">{report.description}</p>
                                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                        Run Report
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }
    
    return (
        <DashboardLayout navItems={OWNER_NAV} activePath="/owner/reports">
            <div className="h-full flex flex-col">
                <header className="p-4 flex justify-between items-center flex-shrink-0">
                     <div>
                        <button onClick={() => setSelectedReport(null)} className="flex items-center text-sm font-semibold text-blue-600 hover:underline mb-2">
                           <ArrowLeftIcon className="w-4 h-4 mr-2" /> Back to all reports
                        </button>
                        <h3 className="text-2xl font-bold text-slate-800">{selectedReport}</h3>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button onClick={() => alert('Scheduling not yet implemented.')} className="flex items-center text-sm font-medium text-slate-600 bg-white border border-slate-300 px-3 py-1.5 rounded-lg hover:bg-slate-50"><ClockIcon className="w-4 h-4 mr-2" /> Schedule</button>
                        <button onClick={() => alert('Emailing not yet implemented.')} className="flex items-center text-sm font-medium text-slate-600 bg-white border border-slate-300 px-3 py-1.5 rounded-lg hover:bg-slate-50"><PaperAirplaneIcon className="w-4 h-4 mr-2" /> Email</button>
                        <button className="flex items-center justify-center bg-blue-600 text-white font-semibold px-4 py-1.5 rounded-lg hover:bg-blue-700"><DownloadIcon className="w-4 h-4 mr-2" /> Generate</button>
                    </div>
                </header>
                
                <div className="p-4 border-y border-slate-200 bg-white flex-shrink-0">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div><label className="text-xs font-medium text-slate-500 mb-1 block">From</label><input type="date" name="dateFrom" value={filters.dateFrom} onChange={handleFilterChange} className="w-full text-sm bg-white border border-slate-300 rounded-md px-3 py-2" /></div>
                        <div><label className="text-xs font-medium text-slate-500 mb-1 block">To</label><input type="date" name="dateTo" value={filters.dateTo} onChange={handleFilterChange} className="w-full text-sm bg-white border border-slate-300 rounded-md px-3 py-2" /></div>
                        <div><label className="text-xs font-medium text-slate-500 mb-1 block">Property</label><select name="property" value={filters.property} onChange={handleFilterChange} className="w-full text-sm bg-white border border-slate-300 rounded-md px-3 py-2"><option>All Properties</option>{ownerProperties.map(p => <option key={p.name}>{p.name}</option>)}</select></div>
                    </div>
                </div>

                <div className="flex-1 overflow-auto p-6 bg-slate-50">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px]">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 border-b border-slate-100"><tr className="text-xs text-slate-500 uppercase">{previewData.columns.map(col => <th key={col} className="px-6 py-3 font-semibold">{col}</th>)}</tr></thead>
                                <tbody className="divide-y divide-slate-100">
                                    {previewData.data.slice(0, 100).map((row, index) => (
                                        <tr key={index} className="hover:bg-slate-50 transition-colors">
                                            {previewData.columns.map(col => (
                                                <td key={col} className="px-6 py-3 whitespace-nowrap text-slate-700">
                                                    {typeof row[col] === 'number' ? `$${row[col].toLocaleString()}` : String(row[col])}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {previewData.data.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                                    <DocumentIcon className="w-12 h-12 mb-3 opacity-20" />
                                    <p>No data available for the selected filters.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default OwnerReports;
