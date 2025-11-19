
import React, { useState, useRef, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { MANAGER_NAV, billingHistory } from '../constants';
import { UserCircleIcon, BellIcon, CreditCardIcon, BuildingIcon, DownloadIcon, DocumentTextIcon, PlusIcon, EllipsisVerticalIcon, TrashIcon, LinkIcon, QuickBooksIcon, XeroIcon } from '../components/Icons';
import type { BillingHistoryItem, LeaseTemplate, IntegrationName } from '../types';
import { useData } from '../contexts/DataContext';

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
            <div className="max-w-5xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-slate-800">Settings</h2>
                    <p className="text-slate-500 mt-1">Manage your account, company details, and preferences.</p>
                </div>
                
                {/* Horizontal Tabs */}
                <div className="border-b border-slate-200 mb-8">
                    <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.name;
                            return (
                                <button
                                    key={tab.name}
                                    onClick={() => setActiveTab(tab.name)}
                                    className={`
                                        group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap
                                        ${isActive 
                                            ? 'border-blue-600 text-blue-600' 
                                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}
                                    `}
                                >
                                    <Icon className={`
                                        -ml-0.5 mr-2 h-5 w-5
                                        ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-500'}
                                    `} />
                                    {tab.name}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Content Area */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                    {renderContent()}
                </div>
            </div>
        </DashboardLayout>
    );
};

const ProfileSettings = () => (
    <div className="animate-in fade-in duration-300">
        <h3 className="text-xl font-bold text-slate-800 mb-1">Profile</h3>
        <p className="text-sm text-slate-500 mb-8">Manage your personal information and password.</p>
        
        <div className="space-y-8">
            <div className="flex items-center space-x-6 pb-8 border-b border-slate-100">
                <img className="h-24 w-24 rounded-full object-cover border-4 border-slate-50 shadow-sm" src="https://i.pravatar.cc/150?u=manager" alt="Profile" />
                <div>
                    <button className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">Change Photo</button>
                    <p className="text-xs text-slate-400 mt-2">JPG, GIF or PNG. 1MB max.</p>
                </div>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                    <input type="text" defaultValue="John Manager" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                    <input type="email" defaultValue="john.manager@properly.com" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
                </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
                <h4 className="text-lg font-bold text-slate-800 mb-4">Change Password</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">New Password</label>
                        <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
                    </div>
                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Confirm New Password</label>
                        <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
                    </div>
                </div>
            </div>
        </div>
        
        <div className="flex justify-end mt-10 pt-6 border-t border-slate-100">
             <button className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl shadow-sm hover:bg-blue-700 transition-colors">Save Changes</button>
        </div>
    </div>
);

const CompanySettings = () => (
    <div className="animate-in fade-in duration-300">
        <h3 className="text-xl font-bold text-slate-800 mb-1">Company</h3>
        <p className="text-sm text-slate-500 mb-8">Update your company's branding and information.</p>
        
        <div className="space-y-6 max-w-2xl">
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Company Name</label>
                <input type="text" defaultValue="Properly Management Inc." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
            </div>
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Company Address</label>
                <input type="text" defaultValue="123 Property Lane, Suite 100, Anytown, USA 12345" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
            </div>
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Company Logo</label>
                <div className="flex items-center space-x-6 p-6 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                    <div className="w-32 h-16 flex items-center justify-center bg-white rounded-lg shadow-sm border border-slate-100">
                        <span className="text-xl font-bold text-slate-800">Properly</span>
                    </div>
                    <div>
                        <button className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">Upload New Logo</button>
                        <p className="text-xs text-slate-400 mt-2">Recommended size: 200x50px</p>
                    </div>
                </div>
            </div>
        </div>
        
         <div className="flex justify-end mt-10 pt-6 border-t border-slate-100">
             <button className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl shadow-sm hover:bg-blue-700 transition-colors">Save Changes</button>
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
        <div className="animate-in fade-in duration-300">
            <h3 className="text-xl font-bold text-slate-800 mb-1">Notifications</h3>
            <p className="text-sm text-slate-500 mb-8">Choose how you want to be notified.</p>
            
            <div className="space-y-8">
                {notifications.map(section => (
                    <div key={section.category} className="bg-slate-50/50 rounded-xl p-6 border border-slate-100">
                        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">{section.category}</h4>
                        <div className="space-y-4">
                            {section.items.map(item => (
                                <div key={item} className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-600">{item}</span>
                                    <div className="flex items-center space-x-6">
                                        <label className="flex items-center cursor-pointer">
                                            <div className="relative">
                                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                            </div>
                                            <span className="ml-2 text-xs font-medium text-slate-500">In-App</span>
                                        </label>
                                         <label className="flex items-center cursor-pointer">
                                            <div className="relative">
                                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                            </div>
                                            <span className="ml-2 text-xs font-medium text-slate-500">Email</span>
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            
             <div className="flex justify-end mt-10 pt-6 border-t border-slate-100">
                 <button className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl shadow-sm hover:bg-blue-700 transition-colors">Save Changes</button>
            </div>
        </div>
    );
};

const BillingSettings = () => (
    <div className="animate-in fade-in duration-300">
        <h3 className="text-xl font-bold text-slate-800 mb-1">Billing</h3>
        <p className="text-sm text-slate-500 mb-8">Manage your subscription and payment methods.</p>
        
        <div className="space-y-8">
            {/* Current Plan */}
            <div className="p-6 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
                <div className="flex justify-between items-start">
                    <div>
                        <h4 className="text-lg font-bold text-blue-900">Current Plan: Pro</h4>
                        <p className="text-sm text-blue-700 mt-1">Billed monthly. Next invoice on <span className="font-semibold">June 1, 2024</span> for <span className="font-semibold">$99.00</span>.</p>
                    </div>
                    <span className="px-3 py-1 bg-white text-blue-700 text-xs font-bold uppercase tracking-wide rounded-full shadow-sm">Active</span>
                </div>
                <div className="mt-6 flex space-x-4">
                    <button className="text-sm font-bold text-blue-700 hover:text-blue-800 bg-white px-4 py-2 rounded-lg shadow-sm border border-blue-100 transition-colors">Change Plan</button>
                    <button className="text-sm font-bold text-red-600 hover:text-red-700 px-4 py-2 transition-colors">Cancel Subscription</button>
                </div>
            </div>

            {/* Payment Method */}
            <div>
                <h4 className="text-lg font-bold text-slate-800 mb-4">Payment Method</h4>
                <div className="p-5 flex justify-between items-center rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center">
                        <div className="p-3 bg-slate-100 rounded-lg mr-4">
                            <CreditCardIcon className="w-6 h-6 text-slate-600" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-800">Visa ending in 1234</p>
                            <p className="text-xs text-slate-500">Expires 12/2026</p>
                        </div>
                    </div>
                    <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">Update</button>
                </div>
            </div>

            {/* Billing History */}
             <div>
                <h4 className="text-lg font-bold text-slate-800 mb-4">Billing History</h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="p-4 font-semibold text-slate-600">Date</th>
                                <th className="p-4 font-semibold text-slate-600">Description</th>
                                <th className="p-4 font-semibold text-slate-600">Amount</th>
                                <th className="p-4 font-semibold text-slate-600">Status</th>
                                <th className="p-4 font-semibold text-slate-600 text-right">Invoice</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {billingHistory.map(item => (
                                <tr key={item.id} className="hover:bg-slate-50">
                                    <td className="p-4 text-slate-700">{item.date}</td>
                                    <td className="p-4 text-slate-700 font-medium">{item.description}</td>
                                    <td className="p-4 text-slate-700">${item.amount.toFixed(2)}</td>
                                    <td className="p-4"><span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-green-100 text-green-700 uppercase tracking-wide">{item.status}</span></td>
                                    <td className="p-4 text-right">
                                        <button className="text-slate-400 hover:text-blue-600 transition-colors"><DownloadIcon className="w-5 h-5" /></button>
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
        <div className="animate-in fade-in duration-300">
            <h3 className="text-xl font-bold text-slate-800 mb-1">Integrations</h3>
            <p className="text-sm text-slate-500 mb-8">Connect Properly with your favorite accounting tools.</p>
            
            <div className="grid grid-cols-1 gap-6">
                {integrations.map(integration => {
                    const { icon: Icon, description } = integrationMap[integration.name];
                    return (
                        <div key={integration.name} className="flex flex-col sm:flex-row justify-between items-center p-6 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center mb-4 sm:mb-0">
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 mr-5">
                                    <Icon className="w-10 h-10" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-slate-800">{integration.name}</h4>
                                    <p className="text-sm text-slate-500 mt-1 max-w-md">{description}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => toggleIntegration(integration.name)}
                                className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-colors shadow-sm ${
                                    integration.connected
                                        ? 'bg-white text-red-600 border border-red-200 hover:bg-red-50'
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
