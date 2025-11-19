
import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { MANAGER_NAV } from '../constants';
import { BuildingIcon, ChevronDownIcon, SearchIcon, PlusIcon, PinIcon, MegaphoneIcon } from '../components/Icons';
import { useData } from '../contexts/DataContext';

const Announcements: React.FC = () => {
    const { announcements, properties } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [propertyFilter, setPropertyFilter] = useState('All Properties');

    const handleCreateNew = () => {
        alert("Create Announcement Modal would open here.");
    };

    const filteredAnnouncements = announcements.filter(ann => {
        const matchesSearch = ann.title.toLowerCase().includes(searchTerm.toLowerCase()) || ann.content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesProperty = 
            propertyFilter === 'All Properties' || 
            ann.targetProperties.includes(propertyFilter) || 
            (ann.targetProperties.length === 0 && ann.targetAudience === 'All');
        
        return matchesSearch && matchesProperty;
    });

    return (
        <DashboardLayout navItems={MANAGER_NAV} activePath="/manager/announcements">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800">Announcements</h2>
                        <p className="text-slate-500 mt-1">Broadcast messages to tenants and owners.</p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <div className="flex flex-1 items-center space-x-3 overflow-x-auto w-full md:w-auto p-1">
                        {/* Property Filter */}
                        <div className="relative min-w-[200px]">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <BuildingIcon className="w-5 h-5 text-slate-400" />
                            </div>
                            <select 
                                value={propertyFilter} 
                                onChange={e => setPropertyFilter(e.target.value)} 
                                className="appearance-none w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-slate-50 transition-all cursor-pointer"
                            >
                                <option>All Properties</option>
                                {properties.map(p => <option key={p.name}>{p.name}</option>)}
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <ChevronDownIcon className="w-4 h-4 text-slate-400" />
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="relative flex-1 max-w-md">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><SearchIcon className="w-5 h-5 text-slate-400" /></div>
                            <input 
                                type="text" 
                                placeholder="Search announcements..." 
                                value={searchTerm} 
                                onChange={e => setSearchTerm(e.target.value)} 
                                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400 transition-all" 
                            />
                        </div>
                    </div>

                    <button onClick={handleCreateNew} className="flex items-center bg-blue-600 text-white font-semibold px-4 py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap">
                        <PlusIcon className="w-5 h-5 mr-2" /> Create Announcement
                    </button>
                </div>

                <div className="grid gap-6">
                    {filteredAnnouncements.map(ann => (
                        <div key={ann.id} className={`bg-white p-6 rounded-xl shadow-sm border ${ann.isPinned ? 'border-blue-300 bg-blue-50/50' : 'border-slate-200'}`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center space-x-2 mb-2">
                                        {ann.isPinned && <PinIcon className="w-5 h-5 text-blue-500 transform rotate-45" />}
                                        <h3 className="text-lg font-bold text-slate-800">{ann.title}</h3>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${ann.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}>{ann.status}</span>
                                    </div>
                                    <p className="text-sm text-slate-500 mb-4">
                                        Published on {new Date(ann.publishedDate).toLocaleDateString()} • To: {ann.targetAudience}
                                        {ann.targetProperties.length > 0 && ` • ${ann.targetProperties.join(', ')}`}
                                    </p>
                                    <p className="text-slate-700">{ann.content}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredAnnouncements.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                            <MegaphoneIcon className="mx-auto h-12 w-12 text-slate-300 mb-2" />
                            <p className="text-slate-500">No announcements found.</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Announcements;
