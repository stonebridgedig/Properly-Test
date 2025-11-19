
import React, { useState, useEffect, useRef } from 'react';
import type { LeaseTemplate } from '../../types';
import { XMarkIcon, DocumentTextIcon, BoltIcon, UserCircleIcon, BuildingIcon, CalendarIcon, DollarIcon, PencilIcon, EyeIcon } from '../Icons';

interface LeaseTemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (template: { id?: string, name: string, content: string }) => void;
    templateToEdit: LeaseTemplate | null;
}

// Grouped Smart Fields for better UX
const fieldGroups = [
    {
        title: 'Tenant Info',
        icon: UserCircleIcon,
        fields: [
            { tag: '{{tenant.name}}', label: 'Full Name' },
            { tag: '{{tenant.email}}', label: 'Email Address' },
            { tag: '{{tenant.phone}}', label: 'Phone Number' },
        ]
    },
    {
        title: 'Property Details',
        icon: BuildingIcon,
        fields: [
            { tag: '{{property.address}}', label: 'Full Address' },
            { tag: '{{unit.name}}', label: 'Unit Number' },
            { tag: '{{property.city}}', label: 'City' },
            { tag: '{{owner.name}}', label: 'Owner Name' },
        ]
    },
    {
        title: 'Lease Terms',
        icon: CalendarIcon,
        fields: [
            { tag: '{{lease.startDate}}', label: 'Start Date' },
            { tag: '{{lease.endDate}}', label: 'End Date' },
            { tag: '{{lease.duration}}', label: 'Duration (Months)' },
            { tag: '{{lease.date}}', label: 'Signing Date' },
        ]
    },
    {
        title: 'Financials',
        icon: DollarIcon,
        fields: [
            { tag: '{{lease.rentAmount}}', label: 'Monthly Rent' },
            { tag: '{{lease.securityDeposit}}', label: 'Security Deposit' },
            { tag: '{{lease.lateFee}}', label: 'Late Fee Amount' },
        ]
    }
];

const LeaseTemplateModal: React.FC<LeaseTemplateModalProps> = ({ isOpen, onClose, onSave, templateToEdit }) => {
    const isEditMode = !!templateToEdit;
    const [name, setName] = useState('');
    const [content, setContent] = useState('');
    const [activeTab, setActiveTab] = useState<'Editor' | 'Automation'>('Editor');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Automation States (Mock)
    const [autoSend, setAutoSend] = useState(false);
    const [linkedProperty, setLinkedProperty] = useState('All Properties');

    useEffect(() => {
        if (isOpen) {
            setName(templateToEdit?.name || '');
            setContent(templateToEdit?.content || '');
            setActiveTab('Editor');
        }
    }, [isOpen, templateToEdit]);

    const handleInsertField = (tag: string) => {
        if (textareaRef.current) {
            const start = textareaRef.current.selectionStart;
            const end = textareaRef.current.selectionEnd;
            const newContent = content.substring(0, start) + tag + content.substring(end);
            setContent(newContent);
            
            // Restore focus and move cursor
            setTimeout(() => {
                if (textareaRef.current) {
                    textareaRef.current.focus();
                    textareaRef.current.setSelectionRange(start + tag.length, start + tag.length);
                }
            }, 0);
        } else {
            setContent(prev => prev + tag);
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: templateToEdit?.id, name, content });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                
                {/* Top Bar */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 bg-white z-10">
                    <div className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <DocumentTextIcon className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col">
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="text-lg font-bold text-slate-800 border-none p-0 focus:ring-0 placeholder-slate-400"
                                placeholder="Untitled Lease Template"
                            />
                            <p className="text-xs text-slate-400">Last saved: Just now</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                         <div className="flex bg-slate-100 rounded-lg p-1">
                            <button 
                                onClick={() => setActiveTab('Editor')}
                                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'Editor' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <PencilIcon className="w-3 h-3 inline mr-1.5" /> Editor
                            </button>
                            <button 
                                onClick={() => setActiveTab('Automation')}
                                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'Automation' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <BoltIcon className="w-3 h-3 inline mr-1.5" /> Automation
                            </button>
                         </div>
                         <div className="h-8 w-px bg-slate-200 mx-2"></div>
                        <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">Cancel</button>
                        <button onClick={handleSubmit} className="px-6 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 transition-colors">Save Template</button>
                    </div>
                </div>

                <div className="flex-1 flex overflow-hidden bg-slate-50">
                    {activeTab === 'Editor' ? (
                        <>
                             {/* Main Editor Area */}
                            <div className="flex-1 p-8 overflow-y-auto flex justify-center">
                                <div className="bg-white w-full max-w-[8.5in] min-h-[11in] shadow-sm border border-slate-200 p-12 relative">
                                    <textarea
                                        ref={textareaRef}
                                        value={content}
                                        onChange={e => setContent(e.target.value)}
                                        className="w-full h-full min-h-[800px] resize-none outline-none border-none text-slate-800 font-serif text-sm leading-relaxed p-0 placeholder-slate-300"
                                        placeholder="Start typing your lease agreement here..."
                                    />
                                </div>
                            </div>

                            {/* Smart Fields Sidebar */}
                            <div className="w-80 bg-white border-l border-slate-200 flex flex-col z-10 shadow-xl shadow-slate-200/50">
                                <div className="p-5 border-b border-slate-100">
                                    <h3 className="font-bold text-slate-800 text-sm">Smart Fields</h3>
                                    <p className="text-xs text-slate-500 mt-1">Click to insert variable into document.</p>
                                </div>
                                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                                    {fieldGroups.map(group => (
                                        <div key={group.title}>
                                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center">
                                                <group.icon className="w-3 h-3 mr-1.5" /> {group.title}
                                            </h4>
                                            <div className="grid grid-cols-1 gap-2">
                                                {group.fields.map(field => (
                                                    <button
                                                        key={field.tag}
                                                        onClick={() => handleInsertField(field.tag)}
                                                        className="group flex items-center justify-between w-full px-3 py-2.5 text-left text-xs font-medium text-slate-600 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-lg transition-all"
                                                    >
                                                        <span>{field.label}</span>
                                                        <span className="opacity-0 group-hover:opacity-100 text-blue-500 font-bold">+</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        /* Automation Settings Tab */
                        <div className="flex-1 p-12 max-w-3xl mx-auto">
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                                <div className="flex items-start space-x-4 mb-6">
                                    <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                                        <BoltIcon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800">Workflow Automation</h3>
                                        <p className="text-sm text-slate-500 mt-1">Configure how and when this template is used automatically.</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50">
                                        <div>
                                            <label className="text-sm font-bold text-slate-800 block">Auto-Send on Approval</label>
                                            <p className="text-xs text-slate-500 mt-1">Automatically draft and email this lease when a tenant screening is approved.</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" checked={autoSend} onChange={() => setAutoSend(!autoSend)} className="sr-only peer" />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>

                                    {autoSend && (
                                        <div className="animate-in fade-in slide-in-from-top-2">
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Apply to Properties</label>
                                            <select 
                                                value={linkedProperty} 
                                                onChange={(e) => setLinkedProperty(e.target.value)}
                                                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option>All Properties</option>
                                                <option>Oakwood Lofts</option>
                                                <option>Sunset Villas</option>
                                                <option>The Grand Apartments</option>
                                            </select>
                                            <p className="text-xs text-slate-500 mt-2">
                                                When a tenant application for <span className="font-semibold">{linkedProperty}</span> is marked "Approved", this template will be used.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LeaseTemplateModal;
