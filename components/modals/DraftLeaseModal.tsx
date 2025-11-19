
import React, { useState, useMemo, useEffect } from 'react';
import type { Tenant, LeaseTemplate, Property, Unit } from '../../types';
import { XMarkIcon, DocumentTextIcon, CheckCircleIcon, CalendarIcon, DollarIcon } from '../Icons';
import { useData } from '../../contexts/DataContext';

interface DraftLeaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    tenant: Tenant;
    onSend: (leaseData: { templateId: string, startDate: string, endDate: string, rent: number, deposit: number }) => void;
}

const DraftLeaseModal: React.FC<DraftLeaseModalProps> = ({ isOpen, onClose, tenant, onSend }) => {
    const { leaseTemplates, properties } = useData();
    const [selectedTemplateId, setSelectedTemplateId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [rent, setRent] = useState<number>(0);
    const [deposit, setDeposit] = useState<number>(0);
    const [step, setStep] = useState(1);

    // Find property and unit info for placeholders
    const property = useMemo(() => properties.find(p => p.name === tenant.propertyName), [properties, tenant.propertyName]);
    const unit = useMemo(() => property?.buildings.flatMap(b => b.units).find(u => u.name === tenant.unitName), [property, tenant.unitName]);
    const selectedTemplate = useMemo(() => leaseTemplates.find(t => t.id === selectedTemplateId), [leaseTemplates, selectedTemplateId]);

    useEffect(() => {
        if (isOpen) {
            const defaultTemplate = leaseTemplates.find(t => t.isDefault);
            setSelectedTemplateId(defaultTemplate?.id || leaseTemplates[0]?.id || '');
            
            // Default dates
            const today = new Date();
            const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
            const nextYear = new Date(nextMonth.getFullYear() + 1, nextMonth.getMonth(), 0); // 1 year lease
            
            setStartDate(nextMonth.toISOString().split('T')[0]);
            setEndDate(nextYear.toISOString().split('T')[0]);
            
            if (unit) {
                setRent(unit.rent);
                setDeposit(unit.rent); // Default deposit = 1 month rent
            }
            setStep(1);
        }
    }, [isOpen, leaseTemplates, unit]);

    const previewContent = useMemo(() => {
        if (!selectedTemplate) return '';
        let content = selectedTemplate.content;
        
        // Simple replacement for preview
        const replacements: {[key: string]: string} = {
            '{{tenant.name}}': tenant.name,
            '{{property.address}}': property?.address || tenant.propertyName,
            '{{unit.name}}': tenant.unitName,
            '{{lease.startDate}}': new Date(startDate).toLocaleDateString(),
            '{{lease.endDate}}': new Date(endDate).toLocaleDateString(),
            '{{lease.date}}': new Date().toLocaleDateString(),
            '{{lease.rentAmount}}': `$${rent.toLocaleString()}`,
            '{{lease.securityDeposit}}': `$${deposit.toLocaleString()}`,
            '{{owner.name}}': property?.owner || 'Landlord',
        };

        Object.entries(replacements).forEach(([key, value]) => {
            content = content.replace(new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), `<span class="bg-yellow-100 px-1 rounded font-semibold">${value}</span>`);
        });

        return content;
    }, [selectedTemplate, tenant, property, startDate, endDate, rent, deposit]);

    const handleSend = () => {
        onSend({
            templateId: selectedTemplateId,
            startDate,
            endDate,
            rent,
            deposit
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[70]">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b bg-slate-50">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Draft Lease Agreement</h2>
                        <p className="text-sm text-slate-500">For {tenant.name} at {tenant.propertyName}, {tenant.unitName}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200"><XMarkIcon className="w-6 h-6" /></button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar Controls */}
                    <div className="w-1/3 bg-white border-r border-slate-200 p-6 overflow-y-auto flex flex-col gap-6">
                        
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center">
                                <DocumentTextIcon className="w-4 h-4 mr-2" /> Template
                            </h3>
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">Select Template</label>
                                <select 
                                    value={selectedTemplateId} 
                                    onChange={(e) => setSelectedTemplateId(e.target.value)}
                                    className="w-full text-sm border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                >
                                    {leaseTemplates.map(t => (
                                        <option key={t.id} value={t.id}>{t.name} {t.isDefault ? '(Default)' : ''}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center">
                                <CalendarIcon className="w-4 h-4 mr-2" /> Terms
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">Start Date</label>
                                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full text-sm border-slate-300 rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">End Date</label>
                                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full text-sm border-slate-300 rounded-lg" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center">
                                <DollarIcon className="w-4 h-4 mr-2" /> Financials
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">Monthly Rent</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2 text-slate-500 text-sm">$</span>
                                        <input type="number" value={rent} onChange={e => setRent(Number(e.target.value))} className="w-full pl-6 py-2 text-sm border-slate-300 rounded-lg" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">Security Deposit</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2 text-slate-500 text-sm">$</span>
                                        <input type="number" value={deposit} onChange={e => setDeposit(Number(e.target.value))} className="w-full pl-6 py-2 text-sm border-slate-300 rounded-lg" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <h4 className="text-blue-800 font-semibold text-sm mb-1">Next Steps</h4>
                            <p className="text-blue-600 text-xs leading-relaxed">
                                Sending this lease will email {tenant.name} a link to sign digitally. Once signed, the tenant status will update to 'Active'.
                            </p>
                        </div>
                    </div>

                    {/* Preview Area */}
                    <div className="w-2/3 bg-slate-50 p-8 overflow-y-auto">
                        <div className="bg-white shadow-sm border border-slate-200 min-h-[800px] p-10 mx-auto max-w-[210mm]">
                            {selectedTemplate ? (
                                <div 
                                    className="prose prose-sm max-w-none font-serif"
                                    dangerouslySetInnerHTML={{ __html: previewContent }} 
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-slate-400">
                                    Select a template to preview
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-white border-t flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">Cancel</button>
                    <button onClick={handleSend} className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-lg shadow-sm hover:bg-green-700 flex items-center">
                        <CheckCircleIcon className="w-4 h-4 mr-2" /> Send for Signature
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DraftLeaseModal;
