import React, { useState, useEffect } from 'react';
import type { Account, AccountType } from '../../types';
import { XMarkIcon } from '../Icons';

interface AccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (account: Omit<Account, 'id'>, id?: string) => void;
    accountToEdit: Account | null;
}

const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose, onSave, accountToEdit }) => {
    const isEditMode = !!accountToEdit;
    const initialFormState = {
        number: '',
        name: '',
        type: 'Expense' as AccountType,
        description: '',
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (isOpen) {
            if (isEditMode) {
                setFormData({
                    number: accountToEdit.number,
                    name: accountToEdit.name,
                    type: accountToEdit.type,
                    description: accountToEdit.description || '',
                });
            } else {
                setFormData(initialFormState);
            }
        }
    }, [isOpen, accountToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData, accountToEdit?.id);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60]">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-between items-center p-6 border-b">
                        <h2 className="text-xl font-bold text-slate-800">{isEditMode ? 'Edit Account' : 'Add New Account'}</h2>
                        <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600"><XMarkIcon className="w-6 h-6" /></button>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-1">
                                <label className="block text-sm font-medium text-slate-700">Account Number</label>
                                <input type="text" name="number" value={formData.number} onChange={handleChange} required className="mt-1 w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700">Account Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Account Type</label>
                            <select name="type" value={formData.type} onChange={handleChange} className="mt-1 w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm">
                                <option value="Asset">Asset</option>
                                <option value="Liability">Liability</option>
                                <option value="Equity">Equity</option>
                                <option value="Income">Income</option>
                                <option value="Expense">Expense</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Description (Optional)</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} rows={2} className="mt-1 w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm"></textarea>
                        </div>
                    </div>
                    <div className="flex justify-end items-center p-6 bg-slate-50 border-t space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Save Account</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AccountModal;