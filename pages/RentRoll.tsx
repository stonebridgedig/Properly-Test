
import React, { useState, useMemo } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { MANAGER_NAV, properties } from '../constants';
import { 
    SearchIcon, ChevronUpIcon, ChevronDownIcon, MessageIcon, 
    CreditCardIcon, BellIcon, DollarIcon, DocumentTextIcon, 
    XMarkIcon, DownloadIcon 
} from '../components/Icons';
import type { RentRollItem } from '../types';
import { useData } from '../contexts/DataContext';

// Helper Functions
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

const ActionModal: React.FC<{
    item: RentRollItem;
    onClose: () => void;
    onLogPayment: (id: string) => void;
}> = ({ item, onClose, onLogPayment }) => {

    const ActionButton: React.FC<{ icon: React.FC<any>, text: string, onClick: () => void, disabled?: boolean, variant?: 'primary' | 'secondary' }> = ({ icon: Icon, text, onClick, disabled = false, variant = 'secondary' }) => (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variant === 'primary' ? 'bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300' : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'}`}
        >
            <Icon className={`w-6 h-6 mb-2 ${variant === 'primary' ? 'text-blue-600' : 'text-slate-500'}`} />
            <span className={`text-sm font-semibold ${variant === 'primary' ? 'text-blue-700' : 'text-slate-700'}`}>{text}</span>
        </button>
    );

    const handleLogPayment = () => {
        onLogPayment(item.id);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[60]" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all" onClick={e => e.stopPropagation()}>
                <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">{item.tenantName}</h2>
                        <p className="text-sm text-slate-500 mt-1">{item.propertyName} • {item.unitName}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200 transition-colors">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="p-6">
                    <div className="mb-6 p-4 rounded-lg bg-slate-50 border border-slate-100 flex justify-between items-center">
                        <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Balance Due</p>
                            <p className={`text-2xl font-bold ${item.balance > 0 ? 'text-slate-800' : 'text-green-600'}`}>${item.balance.toLocaleString()}</p>
                        </div>
                         <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                            item.status === 'Paid' ? 'bg-green-100 text-green-700' : 
                            item.status === 'Overdue' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                            {item.status}
                        </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                         {item.status !== 'Paid' && (
                            <ActionButton icon={CreditCardIcon} text="Log Payment" onClick={handleLogPayment} variant="primary" />
                         )}
                         {item.status === 'Overdue' && (
                            <>
                                <ActionButton icon={BellIcon} text="Send Reminder" onClick={() => alert('Sending reminder...')} />
                                <ActionButton icon={DollarIcon} text="Apply Late Fee" onClick={() => alert('Applying late fee...')} />
                            </>
                        )}
                        <ActionButton icon={DocumentTextIcon} text="View Ledger" onClick={() => alert('Viewing ledger...')} />
                         {item.status === 'Paid' && (
                            <ActionButton icon={MessageIcon} text="Send Receipt" onClick={() => alert('Sending receipt...')} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const RentRoll: React.FC = () => {
    const { rentRoll, logPayment } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [propertyFilter, setPropertyFilter] = useState('All Properties');
    const [statusFilter, setStatusFilter] = useState('All Statuses');
    const [sortConfig, setSortConfig] = useState<{ key: keyof RentRollItem; direction: string } | null>({ key: 'status', direction: 'ascending' }); // Default sort by status to group Overdue/Upcoming
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const [actionModalItem, setActionModalItem] = useState<RentRollItem | null>(null);

    const sortedRentRoll = useMemo(() => {
        let sortableItems = [...rentRoll];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                const key = sortConfig.key;
                if (a[key] < b[key]) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (a[key] > b[key]) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        return sortableItems;
    }, [rentRoll, sortConfig]);

    const filteredRentRoll = useMemo(() => {
        return sortedRentRoll.filter(item => {
            const matchesFilter =
                (propertyFilter === 'All Properties' || item.propertyName === propertyFilter) &&
                (statusFilter === 'All Statuses' || item.status === statusFilter);

            const matchesSearch = searchTerm === '' ||
                item.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.unitName.toLowerCase().includes(searchTerm.toLowerCase());
                
            return matchesFilter && matchesSearch;
        });
    }, [sortedRentRoll, searchTerm, propertyFilter, statusFilter]);
    
    const requestSort = (key: keyof RentRollItem) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const handleSelectItem = (itemId: string, isSelected: boolean) => {
        setSelectedItems(prev => {
            const newSet = new Set(prev);
            if (isSelected) newSet.add(itemId);
            else newSet.delete(itemId);
            return newSet;
        });
    };

    const handleSelectAll = (isChecked: boolean) => {
        setSelectedItems(isChecked ? new Set(filteredRentRoll.map(t => t.id)) : new Set());
    };

    const isAllSelected = filteredRentRoll.length > 0 && selectedItems.size === filteredRentRoll.length;
    
    const summary = useMemo(() => {
        return rentRoll.reduce((acc, item) => {
            acc.totalRent += item.rent;
            if (item.status === 'Overdue') acc.totalOverdue += item.balance;
            if (item.status === 'Paid') acc.totalPaid += item.rent;
            return acc;
        }, { totalRent: 0, totalOverdue: 0, totalPaid: 0});
    }, [rentRoll]);

    const collectionPercentage = summary.totalRent > 0 ? (summary.totalPaid / summary.totalRent) * 100 : 0;

    const handleExportCSV = () => {
         const headers = ['Tenant', 'Property', 'Unit', 'Rent', 'Balance', 'Status', 'Due Date', 'Paid Date'];
         const csvContent = [
            headers.join(','),
            ...filteredRentRoll.map(item => [
                `"${item.tenantName}"`,
                `"${item.propertyName}"`,
                item.unitName,
                item.rent,
                item.balance,
                item.status,
                item.dueDate,
                item.paidDate || ''
            ].join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.setAttribute('download', 'rent_roll.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <DashboardLayout navItems={MANAGER_NAV} activePath="/manager/rent-roll">
            <div className="h-full flex flex-col space-y-6">
                {/* Header */}
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Rent Roll</h2>
                    <p className="text-slate-500 mt-1">Manage rent collection and payment status.</p>
                </div>

                {/* Combined Controls & Metrics Toolbar */}
                 <div className="flex flex-col 2xl:flex-row gap-4 items-start 2xl:items-center">
                    
                    {/* Summary Metrics (Moved Here) */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 py-2 px-4 flex flex-wrap items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                    <path className="text-slate-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                                    <path className="text-green-500 transition-all duration-1000" strokeDasharray={`${collectionPercentage}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                                </svg>
                                <span className="absolute text-[10px] font-bold text-slate-700">{collectionPercentage.toFixed(0)}%</span>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Collection</p>
                                <p className="text-xs font-medium text-slate-800">In Progress</p>
                            </div>
                        </div>
                        
                        <div className="hidden sm:block h-8 w-px bg-slate-200"></div>

                        <div className="flex items-center gap-6">
                             <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Expected</p>
                                <p className="text-sm font-bold text-slate-700">${summary.totalRent.toLocaleString()}</p>
                            </div>
                             <div>
                                <p className="text-[10px] font-bold text-green-600 uppercase mb-0.5">Collected</p>
                                <p className="text-sm font-bold text-green-700">${summary.totalPaid.toLocaleString()}</p>
                            </div>
                             <div>
                                <p className="text-[10px] font-bold text-red-600 uppercase mb-0.5">Outstanding</p>
                                <p className="text-sm font-bold text-red-700">${summary.totalOverdue.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Filters & Search */}
                    <div className="flex-1 flex flex-wrap items-center gap-3 w-full">
                         <div className="relative flex-1 min-w-[200px] lg:max-w-md">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon className="w-4 h-4 text-slate-400" />
                            </div>
                            <input 
                                type="text" 
                                placeholder="Search tenant, property..." 
                                value={searchTerm} 
                                onChange={e => setSearchTerm(e.target.value)} 
                                className="pl-9 pr-3 py-2.5 text-sm bg-white border border-slate-200 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-shadow" 
                            />
                        </div>
                        <select 
                            value={propertyFilter} 
                            onChange={e => setPropertyFilter(e.target.value)} 
                            className="text-sm bg-white border border-slate-200 rounded-lg py-2.5 pl-3 pr-8 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer hover:bg-slate-50"
                        >
                            <option>All Properties</option>
                            {properties.map(p => <option key={p.name}>{p.name}</option>)}
                        </select>
                        <select 
                            value={statusFilter} 
                            onChange={e => setStatusFilter(e.target.value)} 
                            className="text-sm bg-white border border-slate-200 rounded-lg py-2.5 pl-3 pr-8 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer hover:bg-slate-50"
                        >
                            <option>All Statuses</option>
                            <option>Paid</option><option>Upcoming</option><option>Overdue</option>
                        </select>
                        <button onClick={handleExportCSV} className="flex items-center bg-white border border-slate-200 text-slate-700 font-medium px-4 py-2.5 rounded-lg hover:bg-slate-50 shadow-sm transition-colors text-sm ml-auto lg:ml-0">
                            <DownloadIcon className="w-4 h-4 mr-2 text-slate-500" /> Export CSV
                        </button>
                    </div>

                    {selectedItems.size > 0 && (
                        <div className="flex items-center space-x-3 bg-blue-50 border border-blue-100 px-3 py-2 rounded-lg animate-in fade-in slide-in-from-right-4 duration-200 w-full 2xl:w-auto">
                            <span className="text-sm font-bold text-blue-800">{selectedItems.size} selected</span>
                            <div className="h-4 w-px bg-blue-200"></div>
                            <button onClick={() => alert('Sending reminders...')} className="text-sm font-medium text-blue-700 hover:text-blue-900 flex items-center">
                                <BellIcon className="w-4 h-4 mr-1.5" /> Send Reminder
                            </button>
                        </div>
                    )}
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col min-h-0 overflow-hidden">
                    <div className="overflow-auto flex-1">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                                <tr className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                                    <th className="px-6 py-4 w-12 text-center">
                                        <input type="checkbox" checked={isAllSelected} onChange={(e) => handleSelectAll(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                    </th>
                                    <th className="px-6 py-4 cursor-pointer group" onClick={() => requestSort('tenantName')}>
                                        <div className="flex items-center">Tenant {sortConfig?.key === 'tenantName' && (sortConfig.direction === 'ascending' ? <ChevronUpIcon className="w-3 h-3 ml-1 text-blue-600"/> : <ChevronDownIcon className="w-3 h-3 ml-1 text-blue-600"/>)}</div>
                                    </th>
                                    <th className="px-6 py-4 cursor-pointer group" onClick={() => requestSort('propertyName')}>
                                        <div className="flex items-center">Property {sortConfig?.key === 'propertyName' && (sortConfig.direction === 'ascending' ? <ChevronUpIcon className="w-3 h-3 ml-1 text-blue-600"/> : <ChevronDownIcon className="w-3 h-3 ml-1 text-blue-600"/>)}</div>
                                    </th>
                                    <th className="px-6 py-4 cursor-pointer group" onClick={() => requestSort('status')}>
                                        <div className="flex items-center">Status {sortConfig?.key === 'status' && (sortConfig.direction === 'ascending' ? <ChevronUpIcon className="w-3 h-3 ml-1 text-blue-600"/> : <ChevronDownIcon className="w-3 h-3 ml-1 text-blue-600"/>)}</div>
                                    </th>
                                    <th className="px-6 py-4 text-right cursor-pointer group" onClick={() => requestSort('rent')}>
                                        <div className="flex items-center justify-end">Rent {sortConfig?.key === 'rent' && (sortConfig.direction === 'ascending' ? <ChevronUpIcon className="w-3 h-3 ml-1 text-blue-600"/> : <ChevronDownIcon className="w-3 h-3 ml-1 text-blue-600"/>)}</div>
                                    </th>
                                    <th className="px-6 py-4 text-right cursor-pointer group" onClick={() => requestSort('balance')}>
                                        <div className="flex items-center justify-end">Balance {sortConfig?.key === 'balance' && (sortConfig.direction === 'ascending' ? <ChevronUpIcon className="w-3 h-3 ml-1 text-blue-600"/> : <ChevronDownIcon className="w-3 h-3 ml-1 text-blue-600"/>)}</div>
                                    </th>
                                    <th className="px-6 py-4 text-right cursor-pointer group" onClick={() => requestSort('dueDate')}>
                                        <div className="flex items-center justify-end">Due Date {sortConfig?.key === 'dueDate' && (sortConfig.direction === 'ascending' ? <ChevronUpIcon className="w-3 h-3 ml-1 text-blue-600"/> : <ChevronDownIcon className="w-3 h-3 ml-1 text-blue-600"/>)}</div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredRentRoll.length > 0 ? (
                                    filteredRentRoll.map(item => {
                                        const isSelected = selectedItems.has(item.id);
                                        return (
                                        <tr 
                                            key={item.id} 
                                            onClick={() => setActionModalItem(item)}
                                            className={`group transition-all duration-150 cursor-pointer hover:bg-slate-50 ${isSelected ? 'bg-blue-50/50' : ''}`}
                                        >
                                            <td className="px-6 py-4 text-center" onClick={e => e.stopPropagation()}>
                                                <input type="checkbox" checked={isSelected} onChange={(e) => handleSelectItem(item.id, e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold mr-3 shadow-sm ${getAvatarColor(item.tenantName)}`}>
                                                        {getInitials(item.tenantName)}
                                                    </div>
                                                    <span className="font-semibold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">{item.tenantName}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-medium text-slate-700">{item.propertyName}</p>
                                                <p className="text-xs text-slate-500">{item.unitName}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                                                    item.status === 'Paid' ? 'bg-green-50 text-green-700 border-green-100' : 
                                                    item.status === 'Overdue' ? 'bg-red-50 text-red-700 border-red-100' : 
                                                    'bg-blue-50 text-blue-700 border-blue-100'
                                                }`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm text-slate-600 font-medium">
                                                ${item.rent.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className={`text-sm font-bold ${item.balance > 0 ? 'text-red-600' : 'text-slate-400'}`}>
                                                    ${item.balance.toLocaleString()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm text-slate-600">
                                                {new Date(item.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </td>
                                        </tr>
                                    )})
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-slate-500 italic">
                                            No rent records found matching your filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {actionModalItem && (
                <ActionModal
                    item={actionModalItem}
                    onClose={() => setActionModalItem(null)}
                    onLogPayment={logPayment}
                />
            )}
        </DashboardLayout>
    );
};

export default RentRoll;
