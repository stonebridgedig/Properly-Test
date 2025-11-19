
import React, { useState, useMemo } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { TENANT_NAV, allTenants } from '../constants';
import { SearchIcon, PinIcon } from '../components/Icons';
import type { Announcement } from '../types';
import { useData } from '../contexts/DataContext';

// Hardcode the tenant for this view - this would come from auth in a real app
const currentTenant = allTenants.find(t => t.name === 'Sophia Nguyen');

const AnnouncementCard: React.FC<{ announcement: Announcement }> = ({ announcement }) => {
    
    const AudienceTag: React.FC<{ audience: string }> = ({ audience }) => (
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{audience}</span>
    );
    
    const PropertyTag: React.FC<{ property: string }> = ({ property }) => (
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{property}</span>
    );

    return (
        <div className={`bg-white rounded-lg shadow-sm border ${announcement.isPinned ? 'border-blue-300 bg-blue-50/50' : 'border-slate-200'}`}>
            <div className="p-5">
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                           {announcement.isPinned && <PinIcon className="w-5 h-5 text-blue-500"/>}
                           <h4 className="text-lg font-bold text-slate-800">{announcement.title}</h4>
                        </div>
                        <p className="text-xs text-slate-500">
                           Published on {new Date(announcement.publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                </div>
                <p className="text-sm text-slate-600 mt-4 leading-relaxed">{announcement.content}</p>
            </div>
            <div className="px-5 py-3 bg-slate-50/50 border-t border-slate-200 rounded-b-lg flex items-center space-x-2">
                <span className="text-xs font-semibold text-slate-500">To:</span>
                <AudienceTag audience={announcement.targetAudience} />
                {announcement.targetProperties.length > 0 ? (
                    announcement.targetProperties.map(prop => <PropertyTag key={prop} property={prop} />)
                ) : (
                    <PropertyTag property="All Properties" />
                )}
            </div>
        </div>
    );
}

const TenantAnnouncements: React.FC = () => {
    const { announcements: allAnnouncements } = useData();
    const [searchTerm, setSearchTerm] = useState('');

    const relevantAnnouncements = useMemo(() => {
        if (!currentTenant) return [];
        return allAnnouncements.filter(ann => {
            if (ann.status !== 'Published') return false;

            const isAudienceMatch = ann.targetAudience === 'All' || ann.targetAudience === 'Tenants';
            if (!isAudienceMatch) return false;

            const isPropertyMatch = 
                ann.targetProperties.length === 0 || 
                ann.targetProperties.includes(currentTenant.propertyName);
            
            return isPropertyMatch;
        });
    }, [allAnnouncements]);

    const filteredAnnouncements = useMemo(() => {
        return relevantAnnouncements
            .filter(ann => {
                const matchesSearch = ann.title.toLowerCase().includes(searchTerm.toLowerCase()) || ann.content.toLowerCase().includes(searchTerm.toLowerCase());
                return matchesSearch;
            })
            .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
    }, [relevantAnnouncements, searchTerm]);

    const pinnedAnnouncements = filteredAnnouncements.filter(a => a.isPinned);
    const regularAnnouncements = filteredAnnouncements.filter(a => !a.isPinned);

    return (
        <DashboardLayout navItems={TENANT_NAV} activePath="/tenant/announcements">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Announcements</h2>
                    <p className="text-slate-500 mt-1">Important updates from your property manager.</p>
                </div>
                
                <div className="relative w-full md:w-72">
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

            <div className="space-y-8">
                {pinnedAnnouncements.length > 0 && (
                    <div>
                        <h3 className="text-sm font-semibold text-slate-500 uppercase mb-3">Pinned</h3>
                        <div className="space-y-4">
                            {pinnedAnnouncements.map(ann => <AnnouncementCard key={ann.id} announcement={ann} />)}
                        </div>
                    </div>
                )}
                <div>
                     <h3 className="text-sm font-semibold text-slate-500 uppercase mb-3">Recent</h3>
                     <div className="space-y-4">
                        {regularAnnouncements.length > 0 ? (
                           regularAnnouncements.map(ann => <AnnouncementCard key={ann.id} announcement={ann} />)
                        ) : (
                            <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                                <p className="text-slate-500">No announcements found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default TenantAnnouncements;
