import React, { useState, useMemo, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { TENANT_NAV, allTenants } from '../constants';
import { PlusIcon, XMarkIcon, UploadIcon, EyeIcon } from '../components/Icons';
import type { MaintenanceRequest } from '../types';
import { useData } from '../contexts/DataContext';

// Hardcode the tenant for this view
const currentTenant = allTenants.find(t => t.name === 'Sophia Nguyen');

const getStatusBadgeClass = (status: MaintenanceRequest['status']) => {
    switch (status) {
        case 'New': return 'bg-blue-100 text-blue-700';
        case 'In Progress': return 'bg-amber-100 text-amber-700';
        case 'Pending Vendor': return 'bg-violet-100 text-violet-700';
        case 'Completed': return 'bg-green-100 text-green-700';
        default: return 'bg-slate-100 text-slate-700';
    }
};

const NewRequestModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (newRequest: Omit<MaintenanceRequest, 'id' | 'property' | 'building' | 'unit' | 'tenant' | 'status' | 'submittedDate'>) => void;
}> = ({ isOpen, onClose, onSubmit }) => {
    const initialState = {
        issue: '',
        details: '',
        priority: 'Medium' as MaintenanceRequest['priority'],
        imageUrl: undefined as string | undefined,
    };
    const [formData, setFormData] = useState(initialState);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setFormData(initialState);
            setImagePreview(null);
        }
    }, [isOpen]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setImagePreview(result);
                setFormData(prev => ({ ...prev, imageUrl: result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-between items-center p-6 border-b">
                        <h2 className="text-xl font-bold text-slate-800">New Maintenance Request</h2>
                        <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600"><XMarkIcon className="w-6 h-6" /></button>
                    </div>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Issue / Title</label>
                            <input type="text" value={formData.issue} onChange={e => setFormData({...formData, issue: e.target.value})} required className="mt-1 w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm" placeholder="e.g., Leaky kitchen faucet" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Description</label>
                            <textarea value={formData.details} onChange={e => setFormData({...formData, details: e.target.value})} rows={4} required className="mt-1 w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm" placeholder="Please provide as much detail as possible..."></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Priority</label>
                            <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value as MaintenanceRequest['priority']})} className="mt-1 w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm">
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                                <option>Emergency</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Add a photo (optional)</label>
                            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-slate-900/25 px-6 py-10">
                                {imagePreview ? (
                                    <div className="text-center">
                                        <img src={imagePreview} alt="Preview" className="mx-auto max-h-40 rounded-md" />
                                        <button onClick={() => { setImagePreview(null); setFormData({...formData, imageUrl: undefined}); }} className="mt-2 text-sm text-red-600">Remove Image</button>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <UploadIcon className="mx-auto h-12 w-12 text-slate-300" />
                                        <div className="mt-4 flex text-sm leading-6 text-slate-600">
                                            <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 hover:text-blue-500">
                                                <span>Upload a file</span>
                                                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-slate-600">PNG, JPG, GIF up to 10MB</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end p-6 bg-slate-50 border-t space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium bg-white border rounded-md hover:bg-slate-50">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Submit Request</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const DetailModal: React.FC<{ request: MaintenanceRequest | null; onClose: () => void }> = ({ request, onClose }) => {
    if (!request) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-bold text-slate-800">{request.issue}</h2>
                    <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600"><XMarkIcon className="w-6 h-6" /></button>
                </div>
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    {request.imageUrl && <img src={request.imageUrl} alt="Maintenance issue" className="rounded-lg max-h-60 w-full object-cover" />}
                    <p><strong className="font-semibold text-slate-600">Status:</strong> <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(request.status)}`}>{request.status}</span></p>
                    <p><strong className="font-semibold text-slate-600">Description:</strong> {request.details}</p>
                </div>
                <div className="flex justify-end p-6 bg-slate-50 border-t">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium bg-white border rounded-md hover:bg-slate-50">Close</button>
                </div>
            </div>
        </div>
    );
};


const TenantMaintenance: React.FC = () => {
    const { maintenanceRequests, addMaintenanceRequest } = useData();
    const [isNewModalOpen, setIsNewModalOpen] = useState(false);
    const [detailRequest, setDetailRequest] = useState<MaintenanceRequest | null>(null);

    const requests = useMemo(() => {
        if (!currentTenant) return [];
        return maintenanceRequests
            .filter(req => req.tenant === currentTenant.name)
            .sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime());
    }, [maintenanceRequests]);
    
    const handleSubmitRequest = (newRequestData: Omit<MaintenanceRequest, 'id' | 'property' | 'building' | 'unit' | 'tenant' | 'status' | 'submittedDate'>) => {
        if (!currentTenant) return;
        const newRequest: MaintenanceRequest = {
            id: `m${Date.now()}`,
            property: currentTenant.propertyName,
            building: 'Building H', // Mock data
            unit: currentTenant.unitName,
            tenant: currentTenant.name,
            status: 'New',
            submittedDate: new Date().toISOString(),
            ...newRequestData,
        };
        addMaintenanceRequest(newRequest);
        setIsNewModalOpen(false);
    };

    return (
        <DashboardLayout navItems={TENANT_NAV} activePath="/tenant/maintenance">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Maintenance Requests</h2>
                    <p className="text-slate-500 mt-1">Submit and track requests for your unit.</p>
                </div>
                <button onClick={() => setIsNewModalOpen(true)} className="flex items-center bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700">
                    <PlusIcon className="w-5 h-5 mr-2" /> New Request
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b">
                        <tr className="text-xs text-slate-500 uppercase font-semibold">
                            <th className="px-6 py-3">Issue</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Submitted</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {requests.map(req => (
                            <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-semibold text-slate-800 text-sm">{req.issue}</td>
                                <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(req.status)}`}>{req.status}</span></td>
                                <td className="px-6 py-4 text-sm text-slate-600">{new Date(req.submittedDate).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => setDetailRequest(req)} className="text-xs font-semibold text-blue-600 hover:underline flex items-center justify-end ml-auto">
                                        <EyeIcon className="w-4 h-4 mr-1" /> View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {requests.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-slate-500">You have no maintenance requests.</p>
                    </div>
                )}
            </div>
            
            <NewRequestModal isOpen={isNewModalOpen} onClose={() => setIsNewModalOpen(false)} onSubmit={handleSubmitRequest} />
            <DetailModal request={detailRequest} onClose={() => setDetailRequest(null)} />
        </DashboardLayout>
    );
};

export default TenantMaintenance;