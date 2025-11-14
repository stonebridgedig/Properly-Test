
import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { TENANT_NAV, savedPaymentMethods, allTenants } from '../constants';
import { UserCircleIcon, BellIcon, CreditCardIcon, PlusIcon } from '../components/Icons';

// Hardcode the tenant for this view
const currentTenant = allTenants.find(t => t.name === 'Sophia Nguyen');

const TenantSettings: React.FC = () => {
    const [activeTab, setActiveTab] = useState('Profile');

    const renderContent = () => {
        switch (activeTab) {
            case 'Profile': return <ProfileSettings />;
            case 'Notifications': return <NotificationSettings />;
            case 'Payment Methods': return <PaymentMethodsSettings />;
            default: return null;
        }
    };
    
    const tabs = [
        { name: 'Profile', icon: UserCircleIcon },
        { name: 'Notifications', icon: BellIcon },
        { name: 'Payment Methods', icon: CreditCardIcon },
    ];

    return (
        <DashboardLayout navItems={TENANT_NAV} activePath="/tenant/settings">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Settings</h2>
            <p className="text-slate-500 mb-8">Manage your profile, communication preferences, and payment methods.</p>
            
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
        <h3 className="text-xl font-bold text-slate-800 mb-1">My Profile</h3>
        <p className="text-sm text-slate-500 mb-6">Keep your personal information up to date.</p>
        <div className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700">Full Name</label>
                    <input type="text" defaultValue={currentTenant?.name} className="mt-1 w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">Email Address</label>
                    <input type="email" defaultValue={currentTenant?.email} className="mt-1 w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">Phone Number</label>
                    <input type="tel" defaultValue={currentTenant?.phone} className="mt-1 w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm" />
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

const NotificationSettings = () => {
    const notifications = [
        { category: 'Payments', items: ['Rent payment reminder', 'Payment confirmation', 'Late fee notice'] },
        { category: 'Maintenance', items: ['Request status updated', 'Scheduled maintenance reminder'] },
        { category: 'Community', items: ['General announcements'] }
    ];

    return (
        <div>
            <h3 className="text-xl font-bold text-slate-800 mb-1">Notifications</h3>
            <p className="text-sm text-slate-500 mb-6">Choose how you want to be notified about important events.</p>
            <div className="space-y-8">
                {notifications.map(section => (
                    <div key={section.category}>
                        <h4 className="text-md font-semibold text-slate-700 mb-3">{section.category}</h4>
                        <div className="space-y-3">
                            {section.items.map(item => (
                                <div key={item} className="flex justify-between items-center">
                                    <span className="text-sm text-slate-600">{item}</span>
                                     <label htmlFor={item} className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            id={item}
                                            className="sr-only peer"
                                            defaultChecked
                                        />
                                        <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
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

const PaymentMethodsSettings = () => (
    <div>
        <h3 className="text-xl font-bold text-slate-800 mb-1">Payment Methods</h3>
        <p className="text-sm text-slate-500 mb-6">Manage your saved bank accounts and credit cards for rent payments.</p>
        <div className="space-y-4">
             {savedPaymentMethods.map(method => (
                <div key={method.id} className="p-4 flex justify-between items-center rounded-lg border border-slate-200">
                    <div className="flex items-center">
                        <CreditCardIcon className="w-8 h-8 text-slate-500" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-slate-800">{method.details}</p>
                            <p className="text-xs text-slate-500">{method.type === 'Bank' ? 'Bank Account' : 'Credit/Debit Card'}</p>
                        </div>
                    </div>
                    <div>
                         {method.isPrimary && <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-700">Primary</span>}
                        <button className="ml-4 text-sm font-medium text-red-600 hover:underline">Remove</button>
                    </div>
                </div>
             ))}
             <button className="w-full mt-2 flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-dashed border-blue-300 rounded-md hover:bg-blue-100">
                <PlusIcon className="w-4 h-4 mr-2" /> Add New Payment Method
            </button>
        </div>
    </div>
);


export default TenantSettings;