import React, { useState, useRef, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { MANAGER_NAV } from '../constants';
import { PlusIcon, EllipsisVerticalIcon } from '../components/Icons';
import type { LeaseTemplate } from '../types';
import { useData } from '../contexts/DataContext';
import LeaseTemplateModal from '../components/modals/LeaseTemplateModal';

const LeaseTemplates: React.FC = () => {
    const { leaseTemplates, saveLeaseTemplate, deleteLeaseTemplate, setDefaultLeaseTemplate } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [templateToEdit, setTemplateToEdit] = useState<LeaseTemplate | null>(null);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setActiveMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleCreateNew = () => {
        setTemplateToEdit(null);
        setIsModalOpen(true);
    };

    const handleEdit = (template: LeaseTemplate) => {
        setTemplateToEdit(template);
        setIsModalOpen(true);
        setActiveMenu(null);
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this template?")) {
            deleteLeaseTemplate(id);
        }
        setActiveMenu(null);
    };

    const handleSetDefault = (id: string) => {
        setDefaultLeaseTemplate(id);
        setActiveMenu(null);
    };

    return (
        <DashboardLayout navItems={MANAGER_NAV} activePath="/manager/lease-templates">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Lease Templates</h2>
                    <p className="text-slate-500 mt-1">Create and manage reusable lease agreements for your properties.</p>
                </div>
                <button onClick={handleCreateNew} className="flex items-center bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700">
                    <PlusIcon className="w-5 h-5 mr-2" /> Create New Template
                </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <div className="space-y-3">
                    {leaseTemplates.map(template => (
                        <div key={template.id} className="p-4 flex justify-between items-center rounded-lg border border-slate-200 bg-slate-50">
                            <div>
                                <p className="font-semibold text-slate-800">{template.name}</p>
                                {template.isDefault && <span className="text-xs font-semibold px-2 py-0.5 mt-1 inline-block rounded-full bg-blue-100 text-blue-700">Default</span>}
                            </div>
                            <div className="relative">
                                <button onClick={() => setActiveMenu(template.id === activeMenu ? null : template.id)} className="p-1.5 rounded-full hover:bg-slate-200">
                                    <EllipsisVerticalIcon className="w-5 h-5 text-slate-500" />
                                </button>
                                {activeMenu === template.id && (
                                    <div ref={menuRef} className="absolute right-0 top-full mt-1 w-40 bg-white rounded-md shadow-lg z-20 border border-slate-200 py-1 text-left">
                                        <button onClick={() => handleEdit(template)} className="w-full text-left block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Edit</button>
                                        {!template.isDefault && <button onClick={() => handleSetDefault(template.id)} className="w-full text-left block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Set as Default</button>}
                                        {!template.isDefault && <div className="border-t border-slate-100 my-1"></div>}
                                        {!template.isDefault && <button onClick={() => handleDelete(template.id)} className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50">Delete</button>}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <LeaseTemplateModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={saveLeaseTemplate}
                templateToEdit={templateToEdit}
            />
        </DashboardLayout>
    );
};

export default LeaseTemplates;