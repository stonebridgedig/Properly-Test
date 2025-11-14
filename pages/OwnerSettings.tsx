import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { OWNER_NAV } from '../constants';
import { UserCircleIcon, BellIcon, CreditCardIcon, PlusIcon } from '../components/Icons';

const OwnerSettings: React.FC = () => {
    const [activeTab, setActiveTab] = useState('Profile');

    const renderContent = () => {
        switch (activeTab) {
            case 'Profile': return <ProfileSettings />;
            case 'Notifications': return <NotificationSettings />;
            case 'Bank Accounts': return <BankSettings />;
            default: return null;
        }
    };
    
    const tabs = [
        { name: 'Profile', icon: UserCircleIcon },
        { name: 'Notifications', icon: BellIcon },
        { name: 'Bank Accounts', icon: CreditCardIcon },
    ];

    return (
        <DashboardLayout navItems={OWNER_NAV} activePath="/owner/settings">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Settings</h2>
            <p className="text-slate-500 mb-8">Manage your profile, communication preferences, and bank accounts.</p>
            
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
        <p className="text-sm text-slate-500 mb-6">This is how your information will be displayed to the property manager.</p>
        <div className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700">Company Name</label>
                    <input type="text" defaultValue="Greenleaf Investments" className="mt-1 w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">Contact Email Address</label>
                    <input type="email" defaultValue="invest@greenleaf.com" className="mt-1 w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">Contact Phone Number</label>
                    <input type="tel" defaultValue="555-0202" className="mt-1 w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm" />
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
        { category: 'Maintenance', items: ['High-priority request submitted', 'Request status changed to "Completed"'] },
        { category: 'Financial', items: ['Monthly financial statement is ready', 'A large expense has been recorded'] },
        { category: 'Projects', items: ['New capital project proposed', 'Project status has been updated'] },
        { category: 'Communication', items: ['New message from manager', 'New announcement for your properties'] }
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
                                <div key={item} className="grid grid-cols-3 items-center">
                                    <span className="col-span-2 text-sm text-slate-600">{item}</span>
                                    <div className="col-span-1 flex items-center justify-end">
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

const BankSettings = () => (
    <div>
        <h3 className="text-xl font-bold text-slate-800 mb-1">Bank Accounts</h3>
        <p className="text-sm text-slate-500 mb-6">Manage bank accounts for receiving rental income disbursements.</p>
        <div className="space-y-4">
            <div className="p-4 flex justify-between items-center rounded-lg border border-slate-200">
                <div className="flex items-center">
                    <CreditCardIcon className="w-8 h-8 text-slate-500" />
                    <div className="ml-4">
                        <p className="text-sm font-medium text-slate-800">Chase Bank - Checking</p>
                        <p className="text-xs text-slate-500">**** **** **** 5678</p>
                    </div>
                </div>
                <div>
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-700">Primary</span>
                    <button className="ml-4 text-sm font-medium text-red-600 hover:underline">Remove</button>
                </div>
            </div>
            <div className="p-4 flex justify-between items-center rounded-lg border border-slate-200">
                <div className="flex items-center">
                    <CreditCardIcon className="w-8 h-8 text-slate-500" />
                    <div className="ml-4">
                        <p className="text-sm font-medium text-slate-800">Bank of America - Savings</p>
                        <p className="text-xs text-slate-500">**** **** **** 9012</p>
                    </div>
                </div>
                <div>
                    <button className="text-sm font-medium text-blue-600 hover:underline">Set as Primary</button>
                    <button className="ml-4 text-sm font-medium text-red-600 hover:underline">Remove</button>
                </div>
            </div>
             <button className="w-full mt-2 flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-dashed border-blue-300 rounded-md hover:bg-blue-100">
                <PlusIcon className="w-4 h-4 mr-2" /> Add New Bank Account
            </button>
        </div>
    </div>
);


export default OwnerSettings;