import React, { useState, useRef, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { MANAGER_NAV, billingHistory } from '../constants';
import { UserCircleIcon, BellIcon, CreditCardIcon, BuildingIcon, DownloadIcon, DocumentTextIcon, PlusIcon, EllipsisVerticalIcon, TrashIcon, LinkIcon, QuickBooksIcon, XeroIcon } from '../components/Icons';
import type { BillingHistoryItem, LeaseTemplate, IntegrationName } from '../types';
import { useData } from '../contexts/DataContext';
import LeaseTemplateModal from '../components/modals/LeaseTemplateModal';

const Settings: React.FC = () => {
    const [activeTab, setActiveTab] = useState('Profile');

    const renderContent = () => {
        switch (activeTab) {
            case 'Profile': return <ProfileSettings />;
            case 'Company': return <CompanySettings />;
            case 'Notifications': return <NotificationSettings />;
            case 'Billing': return <BillingSettings />;
            case 'Integrations': return <IntegrationSettings />;
            default: return null;
        }
    };
    
    const tabs = [
        { name: 'Profile', icon: UserCircleIcon },
        { name: 'Company', icon: BuildingIcon },
        { name: 'Notifications', icon: BellIcon },
        { name: 'Billing', icon: CreditCardIcon },
        { name: 'Integrations', icon: LinkIcon },
    ];

    return (
        <DashboardLayout navItems={MANAGER_NAV} activePath="/manager/settings">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Settings</h2>
            <p className="text-slate-500 mb-8">Manage your account, company, and billing preferences.</p>
            
            <div className="flex">
                <div className="w-1/4 pr-8">
                    <nav className="space-y-1">
                        {tabs.map(tab => {
                            const Icon = tab.icon;
                            return (
                                <button 
                                    key={tab.name}
                                    onClick={() => setActiveTab(tab.name)}
                                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                        activeTab === tab.name 
                                        ? 'bg-blue-100 text-blue-700' 
                                        : 'text-slate-600 hover:bg-slate-100'
                                    }`}
                                >
                                    <Icon className={`w-5 h-5 mr-3 ${activeTab === tab.name ? 'text-blue-600' : 'text-slate-500'}`} />
                                    <span>{tab.name}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>
                <div className="w-3/4">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

const ProfileSettings = () => (
    <div>
        <h3 className="text-xl font-bold text-slate-800 mb-1">Profile</h3>
        <p className="text-sm text-slate-500 mb-6">Manage your personal information and password.</p>
        <div className="space-y-6">
            <div className="flex items-center space-x-6">
                <img className="h-20 w-20 rounded-full object-cover" src="https://i.pravatar.cc/150?u=manager" alt="Profile" />
                <div>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700">Change Photo</button>
                    <p className="text-xs text-slate-500 mt-2">JPG, GIF or PNG. 1MB max.</p>
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700">Full Name</label>
                    <input type="text" defaultValue="John Manager" className="mt-1 w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">Email Address</label>
                    <input type="email" defaultValue="john.manager@properly.com" className="mt-1 w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm" />
                </div>
            </div>
            <div>
                <h4 className="text-md font-semibold text-slate-700 border-t pt-4 mt-6">Change Password</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                     <div>
                        <label className="block text-sm font-medium text-slate-700">New Password</label>
                        <input type="password" placeholder="••••••••" className="mt-1 w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700">Confirm New Password</label>
                        <input type="password" placeholder="••••••••" className="mt-1 w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm" />
                    </div>
                </div>
            </div>
        </div>
        <div className="flex justify-end mt-8 border-t pt-6">
             <button className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700">Save Changes</button>
        </div>
    </div>
);

const CompanySettings = () => (
    <div>
        <h3 className="text-xl font-bold text-slate-800 mb-1">Company</h3>
        <p className="text-sm text-slate-500 mb-6">Update your company's branding and information.</p>
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-slate-700">Company Name</label>
                <input type="text" defaultValue="Properly Management Inc." className="mt-1 w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm" />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700">Company Address</label>
                <input type="text" defaultValue="123 Property Lane, Suite 100, Anytown, USA 12345" className="mt-1 w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm" />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700">Company Logo</label>
                <div className="mt-2 flex items-center space-x-6 p-4 border-2 border-dashed border-slate-200 rounded-md">
                    <div className="w-24 h-12 flex items-center justify-center bg-slate-100 rounded-md">
                        <span className="text-lg font-bold text-slate-700">Properly</span>
                    </div>
                    <button className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">Change Logo</button>
                </div>
            </div>
        </div>
         <div className="flex justify-end mt-8 border-t pt-6">
             <button className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700">Save Changes</button>
        </div>
    </div>
);

const NotificationSettings = () => {
    const notifications = [
        { category: 'Maintenance', items: ['New Request Submitted', 'Request Status Changed', 'Vendor Assigned'] },
        { category: 'Financial', items: ['Rent Payment Received', 'Overdue Rent Notice', 'New Invoice from Vendor'] },
        { category: 'Communication', items: ['New Message from Tenant', 'New Message from Owner', 'New Announcement Published'] }
    ];

    return (
        <div>
            <h3 className="text-xl font-bold text-slate-800 mb-1">Notifications</h3>
            <p className="text-sm text-slate-500 mb-6">Choose how you want to be notified.</p>
            <div className="space-y-8">
                {notifications.map(section => (
                    <div key={section.category}>
                        <h4 className="text-md font-semibold text-slate-700 mb-3">{section.category}</h4>
                        <div className="space-y-3">
                            {section.items.map(item => (
                                <div key={item} className="grid grid-cols-3 items-center">
                                    <span className="col-span-1 text-sm text-slate-600">{item}</span>
                                    <div className="col-span-2 flex items-center justify-end space-x-8">
                                        <label className="flex items-center text-sm">
                                            <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300 text-blue-600" />
                                            <span className="ml-2">In-App</span>
                                        </label>
                                         <label className="flex items-center text-sm">
                                            <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300 text-blue-600" />
                                            <span className="ml-2">Email</span>
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
             <div className="flex justify-end mt-8 border-t pt-6">
                 <button className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700">Save Changes</button>
            </div>
        </div>
    );
};

const BillingSettings = () => (
    <div>
        <h3 className="text-xl font-bold text-slate-800 mb-1">Billing</h3>
        <p className="text-sm text-slate-500 mb-6">Manage your subscription and payment methods.</p>
        <div className="space-y-6">
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <h4 className="font-semibold text-blue-800">Current Plan: Pro</h4>
                <p className="text-sm text-blue-700 mt-1">Your plan renews on June 1, 2024. Next invoice will be for $99.00.</p>
                <div className="mt-3">
                    <button className="text-sm font-semibold text-blue-600 hover:underline">Change Plan</button>
                    <span className="mx-2 text-blue-300">|</span>
                    <button className="text-sm font-semibold text-red-600 hover:underline">Cancel Subscription</button>
                </div>
            </div>
            <div>
                <h4 className="text-md font-semibold text-slate-700">Payment Method</h4>
                <div className="mt-3 p-4 flex justify-between items-center rounded-lg border border-slate-200">
                    <div className="flex items-center">
                        <CreditCardIcon className="w-8 h-8 text-slate-500" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-slate-800">Visa ending in 1234</p>
                            <p className="text-xs text-slate-500">Expires 12/2026</p>
                        </div>
                    </div>
                    <button className="text-sm font-medium text-blue-600 hover:underline">Update</button>
                </div>
            </div>
             <div>
                <h4 className="text-md font-semibold text-slate-700">Billing History</h4>
                <div className="mt-3 border rounded-lg overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="p-3 font-medium text-slate-600">Date</th>
                                <th className="p-3 font-medium text-slate-600">Description</th>
                                <th className="p-3 font-medium text-slate-600">Amount</th>
                                <th className="p-3 font-medium text-slate-600">Status</th>
                                <th className="p-3 font-medium text-slate-600 text-right">Invoice</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {billingHistory.map(item => (
                                <tr key={item.id}>
                                    <td className="p-3 text-slate-700">{item.date}</td>
                                    <td className="p-3 text-slate-700">{item.description}</td>
                                    <td className="p-3 text-slate-700">${item.amount.toFixed(2)}</td>
                                    <td className="p-3"><span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700">{item.status}</span></td>
                                    <td className="p-3 text-right">
                                        <button className="text-blue-600 hover:underline"><DownloadIcon className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
);

const IntegrationSettings = () => {
    const { integrations, toggleIntegration } = useData();

    const integrationMap: { [key in IntegrationName]: { icon: React.FC<{ className?: string }>, description: string } } = {
        QuickBooks: { icon: QuickBooksIcon, description: "Sync invoices, payments, and expenses with QuickBooks Online." },
        Xero: { icon: XeroIcon, description: "Connect your Xero account to automatically sync financial data." },
    };

    return (
        <div>
            <h3 className="text-xl font-bold text-slate-800 mb-1">Integrations</h3>
            <p className="text-sm text-slate-500 mb-6">Connect Properly with your favorite third-party apps.</p>
            <div className="space-y-4">
                {integrations.map(integration => {
                    const { icon: Icon, description } = integrationMap[integration.name];
                    return (
                        <div key={integration.name} className="p-4 flex justify-between items-center rounded-lg border border-slate-200">
                            <div className="flex items-center">
                                <Icon className="w-10 h-10 mr-4" />
                                <div>
                                    <p className="font-semibold text-slate-800">{integration.name}</p>
                                    <p className="text-sm text-slate-500">{description}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => toggleIntegration(integration.name)}
                                className={`px-4 py-2 text-sm font-semibold rounded-md ${
                                    integration.connected
                                        ? 'bg-white text-red-600 border border-red-300 hover:bg-red-50'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                            >
                                {integration.connected ? 'Disconnect' : 'Connect'}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


export default Settings;