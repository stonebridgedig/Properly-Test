
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
             <div className="max-w-5xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-slate-800">Settings</h2>
                    <p className="text-slate-500 mt-1">Manage your profile, communication preferences, and bank accounts.</p>
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
        <p className="text-sm text-slate-500 mb-8">This is how your information will be displayed to the property manager.</p>
        
        <div className="space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Company Name</label>
                    <input type="text" defaultValue="Greenleaf Investments" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Contact Email</label>
                    <input type="email" defaultValue="invest@greenleaf.com" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Contact Phone</label>
                    <input type="tel" defaultValue="555-0202" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
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

const NotificationSettings = () => {
    const notifications = [
        { category: 'Maintenance', items: ['High-priority request submitted', 'Request status changed to "Completed"'] },
        { category: 'Financial', items: ['Monthly financial statement is ready', 'A large expense has been recorded'] },
        { category: 'Projects', items: ['New capital project proposed', 'Project status has been updated'] },
        { category: 'Communication', items: ['New message from manager', 'New announcement for your properties'] }
    ];

    return (
        <div className="animate-in fade-in duration-300">
            <h3 className="text-xl font-bold text-slate-800 mb-1">Notifications</h3>
            <p className="text-sm text-slate-500 mb-8">Choose how you want to be notified about important events.</p>
            
            <div className="space-y-8">
                {notifications.map(section => (
                    <div key={section.category} className="bg-slate-50/50 rounded-xl p-6 border border-slate-100">
                        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">{section.category}</h4>
                        <div className="space-y-4">
                            {section.items.map(item => (
                                <div key={item} className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-600">{item}</span>
                                    <label className="flex items-center cursor-pointer">
                                        <div className="relative">
                                            <input type="checkbox" defaultChecked className="sr-only peer" />
                                            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                        </div>
                                        <span className="ml-2 text-xs font-medium text-slate-500">Email</span>
                                    </label>
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

const BankSettings = () => (
    <div className="animate-in fade-in duration-300">
        <h3 className="text-xl font-bold text-slate-800 mb-1">Bank Accounts</h3>
        <p className="text-sm text-slate-500 mb-8">Manage bank accounts for receiving rental income disbursements.</p>
        
        <div className="space-y-4">
            <div className="p-5 flex justify-between items-center rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center">
                    <div className="p-3 bg-slate-100 rounded-lg mr-4">
                        <CreditCardIcon className="w-8 h-8 text-slate-600" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-800">Chase Bank - Checking</p>
                        <p className="text-xs text-slate-500">**** **** **** 5678</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wide rounded-full">Primary</span>
                    <button className="text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">Remove</button>
                </div>
            </div>
            
            <div className="p-5 flex justify-between items-center rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center">
                    <div className="p-3 bg-slate-100 rounded-lg mr-4">
                        <CreditCardIcon className="w-8 h-8 text-slate-600" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-800">Bank of America - Savings</p>
                        <p className="text-xs text-slate-500">**** **** **** 9012</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">Set as Primary</button>
                    <button className="text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">Remove</button>
                </div>
            </div>
            
             <button className="w-full mt-4 flex items-center justify-center px-4 py-3 text-sm font-bold text-blue-600 bg-blue-50 border border-dashed border-blue-300 rounded-xl hover:bg-blue-100 transition-all">
                <PlusIcon className="w-5 h-5 mr-2" /> Add New Bank Account
            </button>
        </div>
    </div>
);

export default OwnerSettings;
