import React, { useState, useMemo } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { MANAGER_NAV } from '../constants';
import { useData } from '../contexts/DataContext';
import type { Vendor } from '../types';

const TaxCenter: React.FC = () => {
    const { vendors, maintenanceRequests } = useData();
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const FILING_THRESHOLD = 600;

    const vendorPayments = useMemo(() => {
        const paymentsByVendor = new Map<string, number>();

        const yearRequests = maintenanceRequests.filter(req => 
            req.status === 'Completed' &&
            new Date(req.submittedDate).getFullYear() === selectedYear
        );

        yearRequests.forEach(req => {
            if (req.assignedTo) {
                // Using a deterministic "mock" cost for each job for demo purposes, as cost is not in the data model.
                const mockCost = (req.id.charCodeAt(req.id.length - 1) % 15 + 2) * 50 + Math.random() * 100;
                const currentTotal = paymentsByVendor.get(req.assignedTo) || 0;
                paymentsByVendor.set(req.assignedTo, currentTotal + mockCost);
            }
        });

        return vendors.map(vendor => ({
            ...vendor,
            totalPayments: paymentsByVendor.get(vendor.id) || 0,
        })).filter(v => v.totalPayments > 0);

    }, [vendors, maintenanceRequests, selectedYear]);

    const getStatusBadge = (hasTaxId: boolean) => {
        return hasTaxId
            ? 'bg-green-100 text-green-700'
            : 'bg-amber-100 text-amber-700';
    };

    const handleGenerate1099 = (vendorName: string) => {
        alert(`Generating 1099-NEC for ${vendorName}...`);
    };
    
    // Generate a list of years for the dropdown
    const availableYears = useMemo(() => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = 0; i < 5; i++) {
            years.push(currentYear - i);
        }
        return years;
    }, []);

    return (
        <DashboardLayout navItems={MANAGER_NAV} activePath="/manager/tax-center">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Tax Center</h2>
                    <p className="text-slate-500 mt-1">Review vendor payments and generate 1099s for the tax year.</p>
                </div>
                <div>
                    <label htmlFor="tax-year" className="text-sm font-medium text-slate-700 mr-2">Tax Year:</label>
                    <select
                        id="tax-year"
                        value={selectedYear}
                        onChange={e => setSelectedYear(parseInt(e.target.value, 10))}
                        className="text-sm bg-white border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                        {availableYears.map(year => <option key={year} value={year}>{year}</option>)}
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b">
                        <tr className="text-xs text-slate-500 uppercase font-semibold">
                            <th className="px-6 py-3">Vendor</th>
                            <th className="px-6 py-3">Specialty</th>
                            <th className="px-6 py-3 text-right">Total Payments</th>
                            <th className="px-6 py-3 text-center">Tax ID Status</th>
                            <th className="px-6 py-3 text-center">Filing Requirement</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {vendorPayments.map(vendor => (
                            <tr key={vendor.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <p className="font-semibold text-slate-800 text-sm">{vendor.name}</p>
                                    <p className="text-xs text-slate-500">{vendor.contactName}</p>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">{vendor.specialty}</td>
                                <td className="px-6 py-4 text-sm font-medium text-slate-800 text-right">
                                    ${vendor.totalPayments.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(!!vendor.taxId)}`}>
                                        {vendor.taxId ? 'On File' : 'Missing'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {vendor.totalPayments >= FILING_THRESHOLD ? (
                                        <span className="text-xs font-semibold text-red-600">1099 Required</span>
                                    ) : (
                                        <span className="text-xs text-slate-500">Not Required</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {vendor.totalPayments >= FILING_THRESHOLD ? (
                                        <button
                                            onClick={() => handleGenerate1099(vendor.name)}
                                            disabled={!vendor.taxId}
                                            className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md px-3 py-1.5 disabled:bg-slate-400 disabled:cursor-not-allowed"
                                        >
                                            Generate 1099
                                        </button>
                                    ) : null}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {vendorPayments.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-slate-500">No vendor payments recorded for {selectedYear}.</p>
                    </div>
                 )}
            </div>
        </DashboardLayout>
    );
};

export default TaxCenter;
