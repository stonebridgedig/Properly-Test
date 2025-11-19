
import React, { useState, useMemo, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { TENANT_NAV, savedPaymentMethods, allTenants } from '../constants';
import { CreditCardIcon, PlusIcon } from '../components/Icons';
import { useData } from '../contexts/DataContext';
import type { TenantLedgerItem } from '../types';

// Hardcode the tenant for this view - this would come from auth in a real app
const currentTenantId = 't007'; // Sophia Nguyen

const TenantPayments: React.FC = () => {
    const { rentRoll, transactions, logPayment, tenants } = useData();
    const [activeTab, setActiveTab] = useState('History');
    const [paymentAmount, setPaymentAmount] = useState('0.00');
    const [isAutopay, setIsAutopay] = useState(false); // Mock state

    const currentTenant = useMemo(() => tenants.find(t => t.id === currentTenantId), [tenants]);

    const tenantRentInfo = useMemo(() => {
        if (!currentTenant) return null;
        return rentRoll.find(item => item.id.split('-')[1] === currentTenant.id);
    }, [rentRoll, currentTenant]);

    const amountDue = useMemo(() => {
        if (!tenantRentInfo) return 0;
        if (tenantRentInfo.status === 'Overdue') return tenantRentInfo.balance;
        if (tenantRentInfo.status === 'Upcoming') return tenantRentInfo.rent;
        return 0;
    }, [tenantRentInfo]);
    
    useEffect(() => {
        setPaymentAmount(amountDue.toFixed(2));
    }, [amountDue]);

    const dueDate = tenantRentInfo ? new Date(tenantRentInfo.dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A';

    const handlePay = () => {
        if (tenantRentInfo && tenantRentInfo.status !== 'Paid' && parseFloat(paymentAmount) > 0) {
            logPayment(tenantRentInfo.id);
            alert(`Payment of $${paymentAmount} processed successfully!`);
        }
    };

    const paymentHistory = useMemo(() => {
        if (!currentTenant) return [];
        return transactions
            .filter(t => t.category === 'Income' && t.description.includes(currentTenant.name))
            .map(t => ({
                id: t.id,
                date: new Date(t.date).toLocaleDateString(),
                amount: t.amount,
                method: 'Online Payment', // Mocking this part
                status: 'Completed'
            }))
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [transactions, currentTenant]);

    const fullLedger = useMemo(() => {
        if (!currentTenant) return [];
    
        const charges = rentRoll
            .filter(item => item.id.split('-')[1] === currentTenant.id)
            .map(item => ({
                id: `charge-${item.id}`,
                date: item.dueDate,
                description: `Rent for ${new Date(item.dueDate).toLocaleString('default', { month: 'long' })}`,
                charge: item.rent,
                payment: null,
            }));
    
        const payments = transactions
            .filter(t => t.category === 'Income' && t.description.includes(currentTenant.name))
            .map(t => ({
                id: `payment-${t.id}`,
                date: t.date,
                description: 'Payment Received',
                charge: null,
                payment: t.amount,
            }));
        
        const combined = [...charges, ...payments].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
        let balance = 0;
        const ledgerWithBalance: TenantLedgerItem[] = combined.map(item => {
            if (item.charge) balance += item.charge;
            if (item.payment) balance -= item.payment;
            return { ...item, id: item.id, balance };
        });
    
        return ledgerWithBalance.reverse();
    }, [transactions, currentTenant, rentRoll]);


    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Completed': return 'bg-green-100 text-green-700';
            case 'Pending': return 'bg-amber-100 text-amber-700';
            case 'Failed': return 'bg-red-100 text-red-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <DashboardLayout navItems={TENANT_NAV} activePath="/tenant/payments">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Payments</h2>
            <p className="text-slate-500 mb-8">Manage your payments, view history, and set up autopay.</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-8">
                    {/* Make a Payment Card */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-800 mb-1">Make a Payment</h3>
                        <p className="text-sm text-slate-500">Your current balance is due by {dueDate}.</p>
                        
                        <div className="my-6 text-center">
                            <p className="text-sm text-slate-500">Amount Due</p>
                            <p className="text-5xl font-bold text-slate-800">${amountDue.toFixed(2)}</p>
                        </div>

                        <div className="space-y-2 text-sm border-t border-b py-3">
                             <div className="flex justify-between"><span className="text-slate-600">Rent</span><span>${(tenantRentInfo?.rent || 0).toFixed(2)}</span></div>
                             {/* Mocked data for demo */}
                             <div className="flex justify-between"><span className="text-slate-600">Utilities</span><span>$0.00</span></div>
                             <div className="flex justify-between text-green-600"><span>Credits</span><span>-$0.00</span></div>
                        </div>

                        <div className="mt-6 space-y-4">
                            <div>
                                <label htmlFor="paymentAmount" className="block text-sm font-medium text-slate-700">Payment Amount</label>
                                <div className="relative mt-1">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><span className="text-slate-500 sm:text-sm">$</span></div>
                                    <input type="number" id="paymentAmount" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} className="block w-full rounded-md border border-slate-300 bg-white pl-7 pr-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="paymentMethod" className="block text-sm font-medium text-slate-700">Payment Method</label>
                                <select id="paymentMethod" className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                    {savedPaymentMethods.map(method => (
                                        <option key={method.id} value={method.id}>{method.details}</option>
                                    ))}
                                </select>
                            </div>
                            <button onClick={handlePay} disabled={amountDue === 0} className="w-full text-center px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed">
                                Pay ${paymentAmount}
                            </button>
                        </div>
                    </div>

                    {/* AutoPay Card */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                         <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-800">Auto-Pay</h3>
                                <p className="text-sm text-slate-500">
                                    {isAutopay ? `Enabled with ${savedPaymentMethods.find(m => m.isPrimary)?.details}` : 'Disabled'}
                                </p>
                            </div>
                            <label htmlFor="autopay-toggle" className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    id="autopay-toggle"
                                    className="sr-only peer"
                                    checked={isAutopay}
                                    onChange={() => setIsAutopay(!isAutopay)}
                                />
                                <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>
                     {/* Saved Payment Methods Card */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Saved Payment Methods</h3>
                        <div className="space-y-3">
                            {savedPaymentMethods.map(method => (
                                <div key={method.id} className="p-3 flex justify-between items-center rounded-lg border border-slate-200">
                                    <div className="flex items-center">
                                        <CreditCardIcon className="w-8 h-8 text-slate-400" />
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-slate-800">{method.details}</p>
                                            <p className="text-xs text-slate-500">{method.type === 'Bank' ? 'Bank Account' : 'Credit/Debit Card'}</p>
                                        </div>
                                    </div>
                                    {method.isPrimary && <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-700">Primary</span>}
                                </div>
                            ))}
                            <button className="w-full mt-2 flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-dashed border-blue-300 rounded-md hover:bg-blue-100">
                                <PlusIcon className="w-4 h-4 mr-2" /> Add New Payment Method
                            </button>
                        </div>
                    </div>
                </div>

                {/* Payment Activity */}
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <div className="flex justify-between items-center border-b border-slate-200 pb-4 mb-4">
                        <h3 className="text-lg font-semibold text-slate-800">Payment Activity</h3>
                        <div className="flex items-center space-x-1 p-1 bg-slate-100 rounded-lg">
                            <button onClick={() => setActiveTab('History')} className={`px-4 py-1.5 text-sm font-semibold rounded-md ${activeTab === 'History' ? 'bg-white shadow' : ''}`}>Payment History</button>
                            <button onClick={() => setActiveTab('Ledger')} className={`px-4 py-1.5 text-sm font-semibold rounded-md ${activeTab === 'Ledger' ? 'bg-white shadow' : ''}`}>Full Ledger</button>
                        </div>
                    </div>
                    {activeTab === 'History' && (
                        <table className="w-full text-left text-sm">
                            <thead><tr className="border-b"><th className="py-2">Date</th><th className="py-2">Amount</th><th className="py-2">Method</th><th className="py-2">Status</th></tr></thead>
                            <tbody>
                                {paymentHistory.map(item => (
                                    <tr key={item.id} className="border-b last:border-0">
                                        <td className="py-3">{item.date}</td>
                                        <td className="py-3">${item.amount.toFixed(2)}</td>
                                        <td className="py-3">{item.method}</td>
                                        <td className="py-3"><span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(item.status)}`}>{item.status}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {activeTab === 'Ledger' && (
                         <table className="w-full text-left text-sm">
                            <thead><tr className="border-b"><th className="py-2">Date</th><th className="py-2">Description</th><th className="py-2 text-right">Charge</th><th className="py-2 text-right">Payment</th><th className="py-2 text-right">Balance</th></tr></thead>
                            <tbody>
                                {fullLedger.map(item => (
                                    <tr key={item.id} className="border-b last:border-0">
                                        <td className="py-3">{new Date(item.date).toLocaleDateString()}</td>
                                        <td className="py-3">{item.description}</td>
                                        <td className={`py-3 text-right ${item.charge && item.charge > 0 ? 'text-red-600' : 'text-green-600'}`}>{item.charge ? `$${item.charge.toFixed(2)}` : '—'}</td>
                                        <td className="py-3 text-right text-green-600">{item.payment ? `$${item.payment.toFixed(2)}` : '—'}</td>
                                        <td className="py-3 text-right font-semibold">${item.balance.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default TenantPayments;
