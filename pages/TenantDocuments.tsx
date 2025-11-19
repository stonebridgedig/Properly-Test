import React, { useMemo, useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { TENANT_NAV, allTenants } from '../constants';
import { DocumentTextIcon, EyeIcon, DownloadIcon, ChevronUpIcon, ChevronDownIcon } from '../components/Icons';
import type { Tenant, Document } from '../types';
import { useData } from '../contexts/DataContext';

// Hardcode the tenant for this view - this would come from auth in a real app
const currentTenantName = 'Sophia Nguyen';

const TenantDocuments: React.FC = () => {
    const { documents } = useData();

    const documentsByTenancy = useMemo(() => {
        if (!currentTenantName) return [];

        // Find all tenancy records for the current tenant (current and past)
        const tenantTenancies = allTenants.filter(t => t.name === currentTenantName);
        
        return tenantTenancies.map(tenancy => {
            // Find all documents related to this specific tenancy's property and unit
            const tenancyDocs = documents.filter(doc => 
                doc.property === tenancy.propertyName &&
                (doc.unit === tenancy.unitName || !doc.unit) // Match unit-specific docs or property-level docs
            );
            return {
                tenancy,
                documents: tenancyDocs
            };
        }).sort((a, b) => (a.tenancy.status === 'Active' ? -1 : 1)); // Show active tenancy first
        
    }, [documents]);

    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        // Expand the active tenancy by default
        const activeTenancy = documentsByTenancy.find(item => item.tenancy.status === 'Active');
        if (activeTenancy) {
            setExpandedId(activeTenancy.tenancy.id);
        }
    }, [documentsByTenancy]);

    const toggleExpansion = (id: string) => {
        setExpandedId(prevId => (prevId === id ? null : id));
    };

    return (
        <DashboardLayout navItems={TENANT_NAV} activePath="/tenant/documents">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">My Documents</h2>
            <p className="text-slate-500 mb-8">Access your lease agreements and other important documents.</p>

            <div className="space-y-4">
                {documentsByTenancy.map(({ tenancy, documents }) => {
                    const isExpanded = expandedId === tenancy.id;
                    return (
                        <div key={tenancy.id} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                            <button onClick={() => toggleExpansion(tenancy.id)} className="w-full text-left p-6 hover:bg-slate-50 focus:outline-none focus:bg-slate-50 transition-colors">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-xl font-semibold text-slate-800">
                                            {tenancy.propertyName}
                                            <span className="text-lg font-normal text-slate-500"> - Unit {tenancy.unitName} </span>
                                            <span className={`ml-3 text-sm font-semibold px-2.5 py-1 rounded-full ${tenancy.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                                                {tenancy.status}
                                            </span>
                                        </h3>
                                        <p className="text-sm text-slate-500 mt-1">Lease End Date: {new Date(tenancy.leaseEndDate).toLocaleDateString()}</p>
                                    </div>
                                    {isExpanded ? <ChevronUpIcon className="w-6 h-6 text-slate-500" /> : <ChevronDownIcon className="w-6 h-6 text-slate-500" />}
                                </div>
                            </button>
                            
                            {isExpanded && (
                                <div className="px-6 pb-6 border-t border-slate-200 pt-4">
                                    {documents.length > 0 ? (
                                        <ul className="space-y-3">
                                            {documents.map(doc => (
                                                <li key={doc.id} className="p-3 flex justify-between items-center rounded-md border border-slate-200 hover:bg-slate-50">
                                                    <div className="flex items-center">
                                                        <DocumentTextIcon className="w-6 h-6 text-slate-400 mr-4" />
                                                        <div>
                                                            <p className="font-semibold text-slate-800">{doc.name}</p>
                                                            <p className="text-xs text-slate-500">{doc.type} · Uploaded on {new Date(doc.uploadDate).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-3">
                                                        <button className="text-sm font-medium text-slate-600 hover:text-blue-600 flex items-center"><EyeIcon className="w-4 h-4 mr-1.5"/> View</button>
                                                        <button className="text-sm font-medium text-slate-600 hover:text-blue-600 flex items-center"><DownloadIcon className="w-4 h-4 mr-1.5"/> Download</button>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-slate-500 text-center py-4">No documents found for this tenancy.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </DashboardLayout>
    );
};

export default TenantDocuments;