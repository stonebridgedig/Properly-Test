import React, { useState, useEffect } from 'react';
import type { LeaseTemplate } from '../../types';
import { XMarkIcon } from '../Icons';

interface LeaseTemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (template: { id?: string, name: string, content: string }) => void;
    templateToEdit: LeaseTemplate | null;
}

const smartFields = [
    { field: '{{tenant.name}}', description: "Tenant's full name" },
    { field: '{{property.address}}', description: 'Full property address' },
    { field: '{{unit.name}}', description: 'Unit number/name' },
    { field: '{{lease.startDate}}', description: 'Lease start date' },
    { field: '{{lease.endDate}}', description: 'Lease end date' },
    { field: '{{lease.date}}', description: 'Date lease is generated' },
    { field: '{{lease.rentAmount}}', description: 'Monthly rent amount' },
    { field: '{{lease.securityDeposit}}', description: 'Security deposit amount' },
    { field: '{{owner.name}}', description: "Property owner's name" },
];

const LeaseTemplateModal: React.FC<LeaseTemplateModalProps> = ({ isOpen, onClose, onSave, templateToEdit }) => {
    const isEditMode = !!templateToEdit;
    const [name, setName] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        if (isOpen) {
            setName(templateToEdit?.name || '');
            setContent(templateToEdit?.content || '');
        }
    }, [isOpen, templateToEdit]);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: templateToEdit?.id, name, content });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60]">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col">
                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                    <div className="flex justify-between items-center p-6 border-b flex-shrink-0">
                        <h2 className="text-xl font-bold text-slate-800">{isEditMode ? 'Edit Lease Template' : 'Create New Lease Template'}</h2>
                        <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600"><XMarkIcon className="w-6 h-6" /></button>
                    </div>
                    <div className="flex-1 flex overflow-hidden">
                        <div className="w-2/3 p-6 flex flex-col">
                            <div className="mb-4">
                                <label htmlFor="template-name" className="block text-sm font-medium text-slate-700">Template Name</label>
                                <input
                                    id="template-name"
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    required
                                    className="mt-1 w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm"
                                    placeholder="e.g., Standard 12-Month Lease"
                                />
                            </div>
                            <div className="flex-1 flex flex-col">
                                <label htmlFor="template-content" className="block text-sm font-medium text-slate-700">Template Content</label>
                                <textarea
                                    id="template-content"
                                    value={content}
                                    onChange={e => setContent(e.target.value)}
                                    required
                                    className="mt-1 w-full flex-1 px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm font-mono text-sm"
                                    placeholder="Enter your lease text here. You can use HTML tags and smart fields."
                                />
                            </div>
                        </div>
                        <div className="w-1/3 p-6 bg-slate-50 border-l overflow-y-auto">
                            <h3 className="font-semibold text-slate-700">Smart Fields</h3>
                            <p className="text-xs text-slate-500 mb-4">Click to copy a field and paste it into your template.</p>
                            <ul className="space-y-2">
                                {smartFields.map(item => (
                                    <li key={item.field}>
                                        <button 
                                            type="button" 
                                            onClick={() => navigator.clipboard.writeText(item.field)}
                                            className="w-full text-left p-2 rounded-md bg-white border hover:bg-slate-100"
                                            title="Click to copy"
                                        >
                                            <p className="font-mono text-xs font-semibold text-blue-600">{item.field}</p>
                                            <p className="text-xs text-slate-500">{item.description}</p>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="flex justify-end items-center p-6 bg-slate-50 border-t space-x-3 flex-shrink-0">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Save Template</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LeaseTemplateModal;
