import React, { useState, useMemo } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { MANAGER_NAV, properties, allTenants, allMaintenanceRequests, rentRollData, allOwners } from '../constants';
import { DownloadIcon, ClockIcon, PaperAirplaneIcon } from '../components/Icons';
import type { Tenant, Transaction, MaintenanceRequest, RentRollItem, Account } from '../types';
import { useData } from '../contexts/DataContext';

const reportSections = [
    {
        category: 'Financial Reports',
        reports: [
            { title: 'Rent Roll', description: 'Detailed list of all tenants and their rent status.' },
            { title: 'Profit & Loss Statement', description: 'Summary of revenues, costs, and expenses.' },
            { title: 'Owner Statement', description: 'A financial summary for a specific property owner.' },
        ]
    },
    {
        category: 'Tenant & Lease Reports',
        reports: [
            { title: 'Tenant Directory', description: 'A complete contact list of all tenants.' },
            { title: 'Lease Expiration Report', description: 'Lists all leases that are expiring soon.' },
            { title: 'Vacancy Report', description: 'Shows all vacant units and market rent.' },
        ]
    },
    {
        category: 'Maintenance Reports',
        reports: [
            { title: 'Open Maintenance Requests', description: 'Lists all maintenance requests that are currently open.' },
            { title: 'Maintenance History', description: 'A complete history of all maintenance requests.' },
        ]
    }
];

const PnLPreview: React.FC<{ transactions: Transaction[], chartOfAccounts: Account[] }> = ({ transactions, chartOfAccounts }) => {
    const formatCurrency = (value: number) => {
        const absValue = Math.abs(value);
        const formatted = absValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        return value < 0 ? `(${formatted})` : formatted;
    }

    const { incomeItems, totalIncome, expenseItems, totalExpense, noi } = useMemo(() => {
        const incomeAccountNames = chartOfAccounts.filter(a => a.type === 'Income').map(a => a.name);
        const expenseAccountNames = chartOfAccounts.filter(a => a.type === 'Expense').map(a => a.name);

        const transactionTypeToAccountName: { [key: string]: string } = {
            'Rent': 'Rental Income',
            'Late Fee': 'Late Fee Income',
            'Parking': 'Parking Income',
            'Maintenance': 'Repairs & Maintenance',
            'Utilities': 'Utilities',
            'Taxes': 'Property Taxes',
            'Insurance': 'Insurance',
            'Management Fee': 'Management Fees',
            'Other': 'Other Income', // Default for income
        };
        
        const expenseTypeMap = { ...transactionTypeToAccountName, 'Other': 'Miscellaneous Expense' };

        const totalsByAccount = transactions.reduce((acc, t) => {
            const accountName = t.category === 'Income'
                ? transactionTypeToAccountName[t.type] || 'Other Income'
                : expenseTypeMap[t.type] || 'Miscellaneous Expense';

            acc[accountName] = (acc[accountName] || 0) + t.amount;
            return acc;
        }, {} as { [key: string]: number });

        const incomeItems = incomeAccountNames.map(name => ({ name, amount: totalsByAccount[name] || 0 })).filter(item => item.amount !== 0);
        const expenseItems = expenseAccountNames.map(name => ({ name, amount: totalsByAccount[name] || 0 })).filter(item => item.amount !== 0);

        const totalIncome = incomeItems.reduce((sum, item) => sum + item.amount, 0);
        const totalExpense = expenseItems.reduce((sum, item) => sum + item.amount, 0);
        const noi = totalIncome - totalExpense;

        return { incomeItems, totalIncome, expenseItems, totalExpense, noi };
    }, [transactions, chartOfAccounts]);


    return (
        <div className="p-6">
            <div className="space-y-4 max-w-2xl mx-auto">
                <div>
                    <h4 className="font-semibold text-slate-800 text-md mb-2">Income</h4>
                    <div className="space-y-1 border-t pt-2">
                        {incomeItems.map(item => (
                            <div key={item.name} className="flex justify-between text-sm py-1">
                                <span className="text-slate-600">{item.name}</span>
                                <span>{formatCurrency(item.amount)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-sm font-semibold mt-2 border-t pt-2">
                        <span>Total Income</span>
                        <span>{formatCurrency(totalIncome)}</span>
                    </div>
                </div>

                <div>
                    <h4 className="font-semibold text-slate-800 text-md mb-2 mt-6">Expenses</h4>
                    <div className="space-y-1 border-t pt-2">
                        {expenseItems.map(item => (
                             <div key={item.name} className="flex justify-between text-sm py-1">
                                <span className="text-slate-600">{item.name}</span>
                                <span>{formatCurrency(item.amount)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-sm font-semibold mt-2 border-t pt-2">
                        <span>Total Expenses</span>
                        <span>{formatCurrency(totalExpense)}</span>
                    </div>
                </div>

                <div className="flex justify-between text-md font-bold mt-6 border-t-2 border-slate-800 pt-4">
                    <span>Net Operating Income</span>
                    <span className={noi >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {formatCurrency(noi)}
                    </span>
                </div>
            </div>
        </div>
    );
};


const Reports: React.FC = () => {
    const { transactions, chartOfAccounts } = useData();
    const [selectedReport, setSelectedReport] = useState<string | null>(null);
    const [filters, setFilters] = useState({
        dateFrom: '',
        dateTo: '',
        property: 'All Properties',
        owner: 'all',
        format: 'PDF',
    });

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const filteredTransactions = useMemo(() => {
        const { dateFrom, dateTo, property, owner } = filters;
        const startDate = dateFrom ? new Date(dateFrom) : null;
        const endDate = dateTo ? new Date(dateTo) : null;

        return transactions.filter(t => 
            (property === 'All Properties' || t.property === property) &&
            (selectedReport !== 'Owner Statement' || owner === 'all' || t.owner === owner) &&
            (!startDate || new Date(t.date) >= startDate) &&
            (!endDate || new Date(t.date) <= endDate)
        );
    }, [selectedReport, filters, transactions]);

    const previewData = useMemo(() => {
        if (!selectedReport) return { columns: [], data: [] };

        const { dateFrom, dateTo, property, owner } = filters;
        const startDate = dateFrom ? new Date(dateFrom) : null;
        const endDate = dateTo ? new Date(dateTo) : null;

        switch (selectedReport) {
            case 'Rent Roll':
                return {
                    columns: ['Tenant', 'Property', 'Unit', 'Rent', 'Balance', 'Due Date', 'Status'],
                    data: rentRollData.filter(item => 
                        (property === 'All Properties' || item.propertyName === property) &&
                        (!startDate || new Date(item.dueDate) >= startDate) &&
                        (!endDate || new Date(item.dueDate) <= endDate)
                    )
                };
            
            case 'Owner Statement':
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
                    data: allTenants.filter(t => property === 'All Properties' || t.propertyName === property)
                };

            case 'Lease Expiration Report':
                return {
                    columns: ['Tenant', 'Property', 'Unit', 'Lease End Date'],
                    data: allTenants.filter(t => {
                        if (t.status !== 'Active') return false;
                        if (property !== 'All Properties' && t.propertyName !== property) return false;
                        const leaseEndDate = new Date(t.leaseEndDate);
                        return (!startDate || leaseEndDate >= startDate) && (!endDate || leaseEndDate <= endDate);
                    }).map(t => ({ Tenant: t.name, Property: t.propertyName, Unit: t.unitName, 'Lease End Date': t.leaseEndDate }))
                };
            
            case 'Vacancy Report':
                 const vacancies = properties.flatMap(prop => 
                    prop.buildings.flatMap(b => 
                        b.units.filter(u => u.status === 'Vacant')
                               .map(u => ({ Property: prop.name, Unit: u.name, 'Market Rent': u.rent, Beds: u.bedrooms, Baths: u.bathrooms }))
                    )
                ).filter(v => property === 'All Properties' || v.Property === property);
                return {
                    columns: ['Property', 'Unit', 'Market Rent', 'Beds', 'Baths'],
                    data: vacancies
                };
            
            case 'Open Maintenance Requests':
                return {
                    columns: ['Issue', 'Property', 'Unit', 'Priority', 'Status', 'Submitted'],
                    data: allMaintenanceRequests.filter(req => 
                        req.status !== 'Completed' &&
                        (property === 'All Properties' || req.property === property)
                    ).map(r => ({ ...r, Submitted: new Date(r.submittedDate).toLocaleDateString() }))
                };
            
            case 'Maintenance History':
                 return {
                    columns: ['Issue', 'Property', 'Unit', 'Priority', 'Status', 'Submitted'],
                    data: allMaintenanceRequests.filter(req => 
                        (property === 'All Properties' || req.property === property) &&
                        (!startDate || new Date(req.submittedDate) >= startDate) &&
                        (!endDate || new Date(req.submittedDate) <= endDate)
                    ).map(r => ({ ...r, Submitted: new Date(r.submittedDate).toLocaleDateString() }))
                };

            default:
                return { columns: [], data: [] };
        }
    }, [selectedReport, filters, filteredTransactions]);


    return (
        <DashboardLayout navItems={MANAGER_NAV} activePath="/manager/reports">
            <div className="flex h-full -m-6 lg:-m-8">
                {/* Left Pane: Report Library */}
                <aside className="w-1/4 bg-white border-r border-slate-200 flex flex-col h-full">
                    <div className="p-4 border-b">
                        <h2 className="text-xl font-bold text-slate-800">Reports Center</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
                        {reportSections.map(section => (
                            <div key={section.category}>
                                <h3 className="text-xs font-bold text-slate-600 uppercase px-2 mb-2">{section.category}</h3>
                                <ul className="space-y-1">
                                    {section.reports.map(report => (
                                        <li key={report.title}>
                                            <button
                                                onClick={() => setSelectedReport(report.title)}
                                                className={`w-full text-left p-2 rounded-md text-sm transition-colors ${selectedReport === report.title ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-slate-100 text-slate-600'}`}
                                            >
                                                {report.title}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* Right Pane: Configuration & Preview */}
                <main className="w-3/4 flex flex-col h-full bg-slate-50">
                    {!selectedReport ? (
                        <div className="flex-1 flex items-center justify-center text-center">
                            <div>
                                <h3 className="text-2xl font-semibold text-slate-600">Select a report to get started</h3>
                                <p className="text-slate-500 mt-2">Choose from the list on the left to configure and preview your report.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col h-full">
                            <header className="p-4 border-b border-slate-200 bg-white flex justify-between items-center flex-shrink-0">
                                <h3 className="text-xl font-bold text-slate-800">{selectedReport}</h3>
                                <div className="flex items-center space-x-2">
                                    <button onClick={() => alert('Scheduling not yet implemented.')} className="flex items-center text-sm font-medium text-slate-600 bg-white border border-slate-300 px-3 py-1.5 rounded-lg hover:bg-slate-50"><ClockIcon className="w-4 h-4 mr-2" /> Schedule Report</button>
                                    <button onClick={() => alert('Emailing not yet implemented.')} className="flex items-center text-sm font-medium text-slate-600 bg-white border border-slate-300 px-3 py-1.5 rounded-lg hover:bg-slate-50"><PaperAirplaneIcon className="w-4 h-4 mr-2" /> Email Report</button>
                                    <button className="flex items-center justify-center bg-blue-600 text-white font-semibold px-4 py-1.5 rounded-lg hover:bg-blue-700"><DownloadIcon className="w-4 h-4 mr-2" /> Generate</button>
                                </div>
                            </header>
                            
                            <div className="p-4 border-b border-slate-200 bg-white flex-shrink-0">
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div><label className="text-xs font-medium">From</label><input type="date" name="dateFrom" value={filters.dateFrom} onChange={handleFilterChange} className="mt-1 w-full text-sm bg-white border border-slate-300 rounded-md shadow-sm" /></div>
                                    <div><label className="text-xs font-medium">To</label><input type="date" name="dateTo" value={filters.dateTo} onChange={handleFilterChange} className="mt-1 w-full text-sm bg-white border border-slate-300 rounded-md shadow-sm" /></div>
                                    <div><label className="text-xs font-medium">Property</label><select name="property" value={filters.property} onChange={handleFilterChange} className="mt-1 w-full text-sm bg-white border border-slate-300 rounded-md shadow-sm"><option>All Properties</option>{properties.map(p => <option key={p.name}>{p.name}</option>)}</select></div>
                                    {selectedReport === 'Owner Statement' && (
                                        <div><label className="text-xs font-medium">Owner</label><select name="owner" value={filters.owner} onChange={handleFilterChange} className="mt-1 w-full text-sm bg-white border border-slate-300 rounded-md shadow-sm"><option value="all">All Owners</option>{allOwners.map(o => <option key={o.id} value={o.name}>{o.name}</option>)}</select></div>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1 overflow-auto p-4">
                                <h4 className="text-sm font-semibold text-slate-600 mb-3">Live Preview</h4>
                                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                                    {selectedReport === 'Profit & Loss Statement' ? (
                                        <PnLPreview transactions={filteredTransactions} chartOfAccounts={chartOfAccounts} />
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left text-sm">
                                                <thead className="bg-slate-50"><tr className="text-xs text-slate-500 uppercase">{previewData.columns.map(col => <th key={col} className="px-4 py-2 font-semibold">{col}</th>)}</tr></thead>
                                                <tbody className="divide-y divide-slate-200">
                                                    {previewData.data.slice(0, 100).map((row, index) => (
                                                        <tr key={index} className="hover:bg-slate-50">
                                                            {previewData.columns.map(col => (
                                                                <td key={col} className="px-4 py-2 whitespace-nowrap">
                                                                    {typeof row[col] === 'number' ? `$${row[col].toLocaleString()}` : String(row[col])}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            {previewData.data.length === 0 && (
                                                <p className="text-center py-8 text-slate-500">No data available for the selected filters.</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </DashboardLayout>
    );
};

export default Reports;