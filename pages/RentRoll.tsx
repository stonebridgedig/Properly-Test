import React, { useState, useMemo, useRef, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { MANAGER_NAV, properties } from '../constants';
import { SearchIcon, ChevronUpIcon, ChevronDownIcon, MessageIcon } from '../components/Icons';
import type { RentRollItem } from '../types';
import { useData } from '../contexts/DataContext';

const RentRoll: React.FC = () => {
    const { rentRoll, logPayment } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [propertyFilter, setPropertyFilter] = useState('All Properties');
    const [statusFilter, setStatusFilter] = useState('All Statuses');
    const [sortConfig, setSortConfig] = useState<{ key: keyof RentRollItem; direction: string } | null>({ key: 'dueDate', direction: 'ascending' });
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
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

    const getStatusBadge = (status: RentRollItem['status']) => {
        switch (status) {
            case 'Paid': return 'bg-green-100 text-green-700';
            case 'Upcoming': return 'bg-blue-100 text-blue-700';
            case 'Overdue': return 'bg-red-100 text-red-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const sortedRentRoll = useMemo(() => {
        let sortableItems = [...rentRoll];
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
        return filteredRentRoll.reduce((acc, item) => {
            acc.totalRent += item.rent;
            if (item.status === 'Overdue') acc.totalOverdue += item.balance;
            if (item.status === 'Paid') acc.totalPaid += item.rent;
            return acc;
        }, { totalRent: 0, totalOverdue: 0, totalPaid: 0});
    }, [filteredRentRoll]);

    return (
        <DashboardLayout navItems={MANAGER_NAV} activePath="/manager/rent-roll">
            <div className="h-full flex flex-col">
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Rent Roll</h2>
                <p className="text-slate-500 mb-6">Track and manage rent payments across all properties.</p>
                
                 <div className="flex justify-between items-center mb-4">
                    {selectedItems.size > 0 ? (
                         <div className="flex items-center space-x-4 bg-slate-100 p-2 rounded-lg">
                            <span className="text-sm font-semibold text-slate-700">{selectedItems.size} selected</span>
                            <button onClick={() => alert('Sending reminders...')} className="flex items-center text-sm font-medium text-slate-600 hover:text-blue-600"><MessageIcon className="w-4 h-4 mr-1.5" /> Send Reminder</button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-4">
                             <select value={propertyFilter} onChange={e => setPropertyFilter(e.target.value)} className="text-sm bg-white border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500">
                                <option>All Properties</option>
                                {properties.map(p => <option key={p.name}>{p.name}</option>)}
                            </select>
                            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="text-sm bg-white border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500">
                                <option>All Statuses</option>
                                <option>Paid</option><option>Upcoming</option><option>Overdue</option>
                            </select>
                        </div>
                    )}

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon className="w-4 h-4 text-slate-400" />
                        </div>
                        <input type="text" placeholder="Search by tenant, property..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg w-72 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 my-4">
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                        <p className="text-sm text-blue-700 font-semibold">Total Rent Due</p>
                        <p className="text-2xl font-bold text-blue-900">${summary.totalRent.toLocaleString()}</p>
                    </div>
                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                        <p className="text-sm text-green-700 font-semibold">Total Collected</p>
                        <p className="text-2xl font-bold text-green-900">${summary.totalPaid.toLocaleString()}</p>
                    </div>
                     <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                        <p className="text-sm text-red-700 font-semibold">Total Overdue</p>
                        <p className="text-2xl font-bold text-red-900">${summary.totalOverdue.toLocaleString()}</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-auto flex-1">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-t border-slate-200 sticky top-0">
                            <tr className="text-xs text-slate-500 uppercase font-semibold">
                                <th className="px-4 py-3 w-12 text-center">
                                    <input type="checkbox" checked={isAllSelected} onChange={(e) => handleSelectAll(e.target.checked)} className="h-4 w-4 rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-500" />
                                </th>
                                <th className="px-6 py-3"><button onClick={() => requestSort('tenantName')} className="flex items-center space-x-1"><span>Tenant</span></button></th>
                                <th className="px-6 py-3"><button onClick={() => requestSort('propertyName')} className="flex items-center space-x-1"><span>Property</span></button></th>
                                <th className="px-6 py-3"><button onClick={() => requestSort('rent')} className="flex items-center space-x-1"><span>Rent</span></button></th>
                                <th className="px-6 py-3"><button onClick={() => requestSort('balance')} className="flex items-center space-x-1"><span>Balance</span></button></th>
                                <th className="px-6 py-3"><button onClick={() => requestSort('dueDate')} className="flex items-center space-x-1"><span>Due Date</span></button></th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3"><button onClick={() => requestSort('paidDate')} className="flex items-center space-x-1"><span>Paid On</span></button></th>
                                <th className="px-6 py-3 text-right"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {filteredRentRoll.map(item => {
                                const isSelected = selectedItems.has(item.id);
                                return (
                                <tr key={item.id} className={`transition-colors ${isSelected ? 'bg-slate-100' : 'hover:bg-slate-50'}`}>
                                    <td className="px-4 py-4 text-center">
                                        <input type="checkbox" checked={isSelected} onChange={(e) => handleSelectItem(item.id, e.target.checked)} className="h-4 w-4 rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-500" />
                                    </td>
                                    <td className="px-6 py-4"><p className="font-semibold text-slate-800 text-sm">{item.tenantName}</p></td>
                                    <td className="px-6 py-4"><p className="text-sm text-slate-600">{item.propertyName}, {item.unitName}</p></td>
                                    <td className="px-6 py-4 text-sm text-slate-600">${item.rent.toLocaleString()}</td>
                                    <td className={`px-6 py-4 text-sm font-semibold ${item.balance > 0 ? 'text-red-600' : 'text-slate-600'}`}>${item.balance.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{new Date(item.dueDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(item.status)}`}>{item.status}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{item.paidDate ? new Date(item.paidDate).toLocaleDateString() : '—'}</td>
                                    <td className="px-6 py-4 text-right">
                                        {item.status !== 'Paid' && (
                                            <button onClick={() => logPayment(item.id)} className="text-xs font-semibold text-blue-600 hover:underline">Log Payment</button>
                                        )}
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default RentRoll;