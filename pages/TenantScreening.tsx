
import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { MANAGER_NAV } from '../constants';
import { useData } from '../contexts/DataContext';
import { GaugeIcon, ShieldCheckIcon, IdCardIcon, CheckCircleIcon, XCircleIcon, ClockIcon, ArrowPathIcon } from '../components/Icons';
import type { Tenant, ScreeningInfo, ScreeningStatus } from '../types';
import DraftLeaseModal from '../components/modals/DraftLeaseModal';

const getStatusPill = (status: ScreeningStatus) => {
    switch(status) {
        case 'Not Started': return <span className="text-xs font-medium px-2 py-1 rounded-full bg-slate-100 text-slate-600">Not Started</span>;
        case 'Pending': return <span className="text-xs font-medium px-2 py-1 rounded-full bg-amber-100 text-amber-600 flex items-center"><ArrowPathIcon className="w-3 h-3 mr-1 animate-spin"/>Pending...</span>;
        case 'Completed': return <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">Completed</span>;
        case 'Verified': return <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">Verified</span>;
        case 'Error': return <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-100 text-red-600">Error</span>;
        default: return null;
    }
};

const ScreeningCard: React.FC<{
    title: string;
    icon: React.FC<{className?: string}>;
    status: ScreeningStatus;
    onRun: () => void;
    children: React.ReactNode;
    isRunnable: boolean;
}> = ({ title, icon: Icon, status, onRun, children, isRunnable }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <div className="flex justify-between items-start">
            <div>
                <div className="flex items-center space-x-3">
                    <Icon className="w-6 h-6 text-slate-500" />
                    <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
                </div>
            </div>
            {getStatusPill(status)}
        </div>
        <div className="mt-4 border-t pt-4">
            {children}
            {isRunnable && (
                <div className="mt-4 text-right">
                    <button onClick={onRun} disabled={status === 'Pending'} className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 disabled:bg-slate-400">
                        {status === 'Pending' ? 'Running...' : 'Run Check'}
                    </button>
                </div>
            )}
        </div>
    </div>
);

const TenantScreening: React.FC = () => {
    const { tenantId } = useParams<{ tenantId: string }>();
    const { tenants, updateTenantScreening, sendLease } = useData();
    const navigate = useNavigate();
    const [isLeaseModalOpen, setIsLeaseModalOpen] = useState(false);

    const tenant = useMemo(() => tenants.find(t => t.id === tenantId), [tenants, tenantId]);
    
    const handleRunCheck = (checkType: 'credit' | 'background') => {
        if (!tenant || !tenant.screening) return;

        const updatedScreening = { ...tenant.screening };
        updatedScreening[checkType].status = 'Pending';
        updateTenantScreening(tenant.id, updatedScreening);

        setTimeout(() => {
            if (!tenant || !tenant.screening) return; // Re-check tenant in closure
            const finalScreening = { ...tenant.screening };
            finalScreening[checkType].status = 'Completed';

            if (checkType === 'credit') {
                finalScreening.credit = {
                    ...finalScreening.credit,
                    score: 680 + Math.floor(Math.random() * 100),
                    recommendation: 'Fair',
                    debt: 5000 + Math.floor(Math.random() * 10000),
                    paymentHistory: 'Good',
                }
            } else { // background
                finalScreening.background = {
                    ...finalScreening.background,
                    criminalHistory: 'Clear',
                    evictionHistory: 'Clear',
                }
            }
            updateTenantScreening(tenant.id, finalScreening);
        }, 2000);
    };

    const handleVerify = (checkType: 'income' | 'rentalHistory') => {
        if (!tenant || !tenant.screening) return;
        const updatedScreening = { ...tenant.screening };
        updatedScreening[checkType].status = 'Verified';
        updateTenantScreening(tenant.id, updatedScreening);
    };

    const handleDecision = (decision: 'Approved' | 'Denied') => {
        if (!tenant || !tenant.screening) return;
        const updatedScreening = { ...tenant.screening, overallStatus: decision };
        updateTenantScreening(tenant.id, updatedScreening);
    };
    
    const handleSendLease = (leaseData: { templateId: string, startDate: string, endDate: string, rent: number, deposit: number }) => {
        if (tenant) {
            sendLease(tenant.id, leaseData);
            setIsLeaseModalOpen(false);
            alert("Lease sent! Redirecting to Tenant List...");
            navigate('/manager/tenants');
        }
    };

    if (!tenant) {
        return (
            <DashboardLayout navItems={MANAGER_NAV} activePath="/manager/tenants">
                <div className="text-center py-20">
                    <h2 className="text-2xl font-bold text-slate-700">Tenant Not Found</h2>
                    <p className="text-slate-500 mt-2">The requested tenant could not be found.</p>
                    <Link to="/manager/tenants" className="mt-6 inline-block px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700">
                        Back to Tenants
                    </Link>
                </div>
            </DashboardLayout>
        );
    }

    const screening = tenant.screening!;

    const overallStatusDisplay = {
        'Not Started': { text: 'Screening Not Started', icon: ClockIcon, color: 'text-slate-500' },
        'In Progress': { text: 'Screening In Progress', icon: ArrowPathIcon, color: 'text-amber-500' },
        'Awaiting Decision': { text: 'Awaiting Your Decision', icon: CheckCircleIcon, color: 'text-blue-500' },
        'Approved': { text: 'Applicant Approved', icon: CheckCircleIcon, color: 'text-green-500' },
        'Denied': { text: 'Applicant Denied', icon: XCircleIcon, color: 'text-red-500' },
    }[screening.overallStatus];

    const StatusIcon = overallStatusDisplay.icon;
    
    return (
        <DashboardLayout navItems={MANAGER_NAV} activePath="/manager/tenants">
            <div className="mb-8">
                <Link to="/manager/tenants" className="text-sm font-semibold text-blue-600 hover:underline mb-2 inline-block">&larr; Back to All Tenants</Link>
                <h2 className="text-3xl font-bold text-slate-800">Tenant Screening</h2>
                <p className="text-slate-500 mt-1">Applicant: <span className="font-semibold text-slate-700">{tenant.name} ({tenant.email})</span> for {tenant.propertyName}, {tenant.unitName}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 mb-8 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <StatusIcon className={`w-8 h-8 ${overallStatusDisplay.color} ${screening.overallStatus === 'In Progress' ? 'animate-spin' : ''}`} />
                    <p className={`text-xl font-bold ${overallStatusDisplay.color}`}>{overallStatusDisplay.text}</p>
                </div>
                <div className="space-x-3">
                    {screening.overallStatus === 'Awaiting Decision' || screening.overallStatus === 'In Progress' || screening.overallStatus === 'Not Started' ? (
                        <>
                            <button onClick={() => handleDecision('Approved')} className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-md shadow-sm hover:bg-green-700">Approve</button>
                            <button onClick={() => handleDecision('Denied')} className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md shadow-sm hover:bg-red-700">Deny</button>
                        </>
                    ) : null}
                    
                    {screening.overallStatus === 'Approved' && (
                        <button onClick={() => setIsLeaseModalOpen(true)} className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700">Draft Lease</button>
                    )}
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ScreeningCard title="Credit Check" icon={GaugeIcon} status={screening.credit.status} onRun={() => handleRunCheck('credit')} isRunnable={screening.credit.status === 'Not Started'}>
                    {screening.credit.status === 'Completed' && screening.credit.score && (
                        <div className="space-y-2 text-sm">
                            <p><strong>Credit Score:</strong> <span className="font-bold">{screening.credit.score}</span></p>
                            <p><strong>Recommendation:</strong> {screening.credit.recommendation}</p>
                            <p><strong>Total Debt:</strong> ${screening.credit.debt?.toLocaleString()}</p>
                            <p><strong>Payment History:</strong> {screening.credit.paymentHistory}</p>
                        </div>
                    )}
                </ScreeningCard>
                <ScreeningCard title="Background Check" icon={ShieldCheckIcon} status={screening.background.status} onRun={() => handleRunCheck('background')} isRunnable={screening.background.status === 'Not Started'}>
                    {screening.background.status === 'Completed' && (
                         <div className="space-y-2 text-sm">
                            <p><strong>Criminal History:</strong> {screening.background.criminalHistory}</p>
                            <p><strong>Eviction History:</strong> {screening.background.evictionHistory}</p>
                        </div>
                    )}
                </ScreeningCard>
                <ScreeningCard title="Income Verification" icon={IdCardIcon} status={screening.income.status} onRun={() => {}} isRunnable={false}>
                    <div className="space-y-2 text-sm">
                        <p>Manually verify applicant's income sources (e.g., pay stubs).</p>
                        {screening.income.status !== 'Verified' && (
                             <button onClick={() => handleVerify('income')} className="mt-4 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700">Mark as Verified</button>
                        )}
                    </div>
                </ScreeningCard>
                <ScreeningCard title="Rental History" icon={IdCardIcon} status={screening.rentalHistory.status} onRun={() => {}} isRunnable={false}>
                    <div className="space-y-2 text-sm">
                        <p>Contact previous landlords to verify rental history.</p>
                        {screening.rentalHistory.status !== 'Verified' && (
                             <button onClick={() => handleVerify('rentalHistory')} className="mt-4 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700">Mark as Verified</button>
                        )}
                    </div>
                </ScreeningCard>
            </div>
            
            <DraftLeaseModal 
                isOpen={isLeaseModalOpen}
                onClose={() => setIsLeaseModalOpen(false)}
                tenant={tenant}
                onSend={handleSendLease}
            />

        </DashboardLayout>
    );
};

export default TenantScreening;
