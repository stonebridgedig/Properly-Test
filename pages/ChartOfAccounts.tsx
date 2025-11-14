import React, { useState, useMemo } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { MANAGER_NAV } from '../constants';
import { PlusIcon, ChevronUpIcon, ChevronDownIcon, TrashIcon } from '../components/Icons';
import type { Account, AccountType } from '../types';
import { useData } from '../contexts/DataContext';
import AccountModal from '../components/modals/AccountModal';

const ChartOfAccounts: React.FC = () => {
    const { chartOfAccounts, saveAccount, deleteAccount } = useData();
    const [sortConfig, setSortConfig] = useState<{ key: keyof Account; direction: string } | null>({ key: 'number', direction: 'ascending' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [accountToEdit, setAccountToEdit] = useState<Account | null>(null);

    const sortedAccounts = useMemo(() => {
        let sortableItems = [...chartOfAccounts];
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
    }, [chartOfAccounts, sortConfig]);

    const requestSort = (key: keyof Account) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const handleOpenModal = (account?: Account) => {
        setAccountToEdit(account || null);
        setIsModalOpen(true);
    };

    const handleSave = (accountData: Omit<Account, 'id'>, id?: string) => {
        saveAccount(accountData, id);
        setIsModalOpen(false);
    };
    
    const handleDelete = (id: string) => {
        if(window.confirm("Are you sure you want to delete this account? System accounts cannot be deleted.")) {
            deleteAccount(id);
        }
    };

    const getAccountTypeBadge = (type: AccountType) => {
        const colors = {
            Asset: 'bg-green-100 text-green-700',
            Liability: 'bg-red-100 text-red-700',
            Equity: 'bg-indigo-100 text-indigo-700',
            Income: 'bg-blue-100 text-blue-700',
            Expense: 'bg-amber-100 text-amber-700',
        };
        return colors[type] || 'bg-slate-100 text-slate-700';
    };

    return (
        <DashboardLayout navItems={MANAGER_NAV} activePath="/manager/chart-of-accounts">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Chart of Accounts</h2>
                    <p className="text-slate-500 mt-1">Manage the financial accounts for your bookkeeping.</p>
                </div>
                <button onClick={() => handleOpenModal()} className="flex items-center bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700">
                    <PlusIcon className="w-5 h-5 mr-2" /> Add Account
                </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b">
                        <tr className="text-xs text-slate-500 uppercase font-semibold">
                            <th className="px-6 py-3"><button onClick={() => requestSort('number')} className="flex items-center space-x-1"><span>Number</span></button></th>
                            <th className="px-6 py-3"><button onClick={() => requestSort('name')} className="flex items-center space-x-1"><span>Name</span></button></th>
                            <th className="px-6 py-3"><button onClick={() => requestSort('type')} className="flex items-center space-x-1"><span>Type</span></button></th>
                            <th className="px-6 py-3">Description</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {sortedAccounts.map(account => (
                            <tr key={account.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 text-sm font-mono text-slate-600">{account.number}</td>
                                <td className="px-6 py-4 font-semibold text-slate-800 text-sm">{account.name}</td>
                                <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-medium rounded-full ${getAccountTypeBadge(account.type)}`}>{account.type}</span></td>
                                <td className="px-6 py-4 text-sm text-slate-500">{account.description}</td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => handleOpenModal(account)} className="text-xs font-semibold text-blue-600 hover:underline">Edit</button>
                                    {!account.isSystemAccount && (
                                        <>
                                            <span className="mx-2 text-slate-300">|</span>
                                            <button onClick={() => handleDelete(account.id)} className="text-xs font-semibold text-red-600 hover:underline">Delete</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <AccountModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                accountToEdit={accountToEdit}
            />
        </DashboardLayout>
    );
};

export default ChartOfAccounts;