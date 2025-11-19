
import React, { useState, useRef } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { MANAGER_NAV, allTenants } from '../constants';
import { PlusIcon, DocumentTextIcon, ClockIcon, SparklesIcon, PaperAirplaneIcon, TrashIcon, PencilIcon, UploadIcon } from '../components/Icons';
import type { LeaseTemplate, Tenant } from '../types';
import { useData } from '../contexts/DataContext';
import LeaseTemplateModal from '../components/modals/LeaseTemplateModal';
import DraftLeaseModal from '../components/modals/DraftLeaseModal';

const LeaseTemplates: React.FC = () => {
    const { leaseTemplates, saveLeaseTemplate, deleteLeaseTemplate, setDefaultLeaseTemplate, sendLease } = useData();
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);
    
    const [templateToEdit, setTemplateToEdit] = useState<LeaseTemplate | null>(null);
    const [templateToDraft, setTemplateToDraft] = useState<LeaseTemplate | null>(null);
    const [draftTenant, setDraftTenant] = useState<Tenant | null>(null); // For the Draft Modal

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleCreateNew = () => {
        setTemplateToEdit(null);
        setIsEditorOpen(true);
    };

    const handleEdit = (template: LeaseTemplate) => {
        setTemplateToEdit(template);
        setIsEditorOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this template?")) {
            deleteLeaseTemplate(id);
        }
    };

    const handleSetDefault = (id: string) => {
        setDefaultLeaseTemplate(id);
    };

    const handleDraftLease = (template: LeaseTemplate) => {
        setTemplateToDraft(template);
        const demoTenant = allTenants.find(t => t.status === 'Active' || t.status === 'Pending');
        if (demoTenant) {
            setDraftTenant(demoTenant);
            setIsDraftModalOpen(true);
        } else {
            alert("No tenants available to draft a lease for.");
        }
    };

    const handleSendLease = (leaseData: { templateId: string, startDate: string, endDate: string, rent: number, deposit: number }) => {
        if (draftTenant) {
            sendLease(draftTenant.id, leaseData);
            setIsDraftModalOpen(false);
            setDraftTenant(null);
            alert(`Lease sent to ${draftTenant.name} successfully!`);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const fileName = file.name.replace(/\.[^/.]+$/, ""); // remove extension
            
            // Mock extraction of content from file
            const mockContent = `
                <h1>${fileName}</h1>
                <p><em>Imported from ${file.name} on ${new Date().toLocaleDateString()}</em></p>
                <hr />
                <h3>1. PARTIES</h3>
                <p>This Lease Agreement (the "Agreement") is entered into on {{lease.date}}, by and between {{owner.name}} ("Landlord") and {{tenant.name}} ("Tenant").</p>
                <h3>2. PROPERTY</h3>
                <p>The Landlord agrees to lease to the Tenant the premises located at {{property.address}}, Unit {{unit.name}} (the "Premises").</p>
                <h3>3. TERM</h3>
                <p>The term of this Lease shall begin on {{lease.startDate}} and end on {{lease.endDate}}.</p>
                <h3>4. RENT</h3>
                <p>The Tenant agrees to pay the Landlord monthly rent in the amount of {{lease.rentAmount}}, payable on the 1st day of each month.</p>
                <h3>5. SECURITY DEPOSIT</h3>
                <p>Upon execution of this Agreement, the Tenant shall deposit with the Landlord the sum of {{lease.securityDeposit}} as security for the performance of the Tenant's obligations.</p>
            `;

            const newTemplateId = `ltpl_import_${Date.now()}`;
            const newTemplate = { id: newTemplateId, name: fileName, content: mockContent };
            
            saveLeaseTemplate(newTemplate);
            
            // Automatically open the editor for the new template
            setTemplateToEdit({ ...newTemplate, isDefault: false });
            setIsEditorOpen(true);
            
            // Reset input
            e.target.value = '';
        }
    };

    const ActionButton = ({ onClick, icon: Icon, title, variant = 'default' }: { onClick: () => void, icon: React.FC<{ className?: string }>, title: string, variant?: 'default' | 'danger' }) => (
        <button 
            onClick={(e) => { e.stopPropagation(); onClick(); }} 
            className={`p-1.5 rounded-md transition-all shadow-sm border ${
                variant === 'danger' 
                ? 'bg-white text-red-500 border-red-100 hover:bg-red-50' 
                : 'bg-white text-slate-500 border-slate-200 hover:text-blue-600 hover:border-blue-200'
            }`}
            title={title}
        >
            <Icon className="w-4 h-4" />
        </button>
    );

    return (
        <DashboardLayout navItems={MANAGER_NAV} activePath="/manager/lease-templates">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Lease Library</h2>
                    <p className="text-slate-500 mt-1">Create, manage, and automate your legal agreements.</p>
                </div>
                <div className="flex space-x-3">
                    <button onClick={handleUploadClick} className="flex items-center bg-white border border-slate-300 text-slate-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
                        <UploadIcon className="w-5 h-5 mr-2" /> Upload
                    </button>
                    <button onClick={handleCreateNew} className="flex items-center bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-sm hover:shadow-md">
                        <PlusIcon className="w-5 h-5 mr-2" /> Create Template
                    </button>
                </div>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                    accept=".pdf,.docx,.txt" 
                    className="hidden" 
                />
            </div>

            {leaseTemplates.length === 0 ? (
                <div className="col-span-full text-center py-20 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                    <DocumentTextIcon className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                    <h3 className="text-lg font-medium text-slate-900">No templates found</h3>
                    <p className="text-slate-500 mt-1 mb-6">Get started by creating a new lease template or uploading an existing document.</p>
                    <button onClick={handleCreateNew} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                        Create your first template
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {leaseTemplates.map(template => (
                        <div key={template.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col h-64 group relative overflow-hidden">
                            {/* Document Visual Header */}
                            <div className="h-24 bg-slate-100 border-b border-slate-200 p-4 flex items-start justify-between relative">
                                 <div className="absolute inset-0 bg-slate-50 opacity-50" style={{backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '10px 10px'}}></div>
                                 <div className="relative z-10 p-2 bg-white rounded-lg shadow-sm border border-slate-100">
                                    <DocumentTextIcon className="w-6 h-6 text-blue-500" />
                                 </div>
                                 {template.isDefault && (
                                    <span className="relative z-10 px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wide rounded-full shadow-sm">
                                        Default
                                    </span>
                                 )}
                                 <div className="absolute top-3 right-3 z-20 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <ActionButton onClick={() => handleEdit(template)} icon={PencilIcon} title="Edit Template" />
                                    {!template.isDefault && (
                                        <>
                                            <ActionButton onClick={() => handleSetDefault(template.id)} icon={SparklesIcon} title="Set as Default" />
                                            <ActionButton onClick={() => handleDelete(template.id)} icon={TrashIcon} title="Delete" variant="danger" />
                                        </>
                                    )}
                                 </div>
                            </div>

                            {/* Content */}
                            <div className="p-5 flex-1 flex flex-col">
                                <h4 className="font-bold text-slate-800 text-lg mb-1 truncate" title={template.name}>{template.name}</h4>
                                <div className="text-xs text-slate-500 mb-4 flex items-center">
                                    <ClockIcon className="w-3 h-3 mr-1" /> Last edited: Today
                                </div>
                                
                                <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                                    <span className="text-xs font-medium text-slate-400">Used 24 times</span>
                                    <button 
                                        onClick={() => handleDraftLease(template)}
                                        className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center transition-colors"
                                    >
                                        Use Template <PaperAirplaneIcon className="w-3 h-3 ml-1.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <LeaseTemplateModal
                isOpen={isEditorOpen}
                onClose={() => setIsEditorOpen(false)}
                onSave={saveLeaseTemplate}
                templateToEdit={templateToEdit}
            />

            {draftTenant && (
                <DraftLeaseModal 
                    isOpen={isDraftModalOpen}
                    onClose={() => setIsDraftModalOpen(false)}
                    tenant={draftTenant}
                    onSend={handleSendLease}
                />
            )}
        </DashboardLayout>
    );
};

export default LeaseTemplates;
