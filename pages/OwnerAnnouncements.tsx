import React, { useState, useMemo } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { OWNER_NAV } from '../constants';
import { SearchIcon, PinIcon } from '../components/Icons';
import type { Announcement } from '../types';
import { useData } from '../contexts/DataContext';

const currentOwner = 'Greenleaf Investments';

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

const OwnerAnnouncements: React.FC = () => {
    const { announcements: allAnnouncements, properties } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [propertyFilter, setPropertyFilter] = useState('All Properties');
    
    const ownerProperties = useMemo(() => properties.filter(p => p.owner === currentOwner), [properties]);
    const ownerPropertyNames = useMemo(() => ownerProperties.map(p => p.name), [ownerProperties]);

    const relevantAnnouncements = useMemo(() => {
        return allAnnouncements.filter(ann => {
            if (ann.status !== 'Published') return false;

            const isAudienceMatch = ann.targetAudience === 'All' || ann.targetAudience === 'Owners';
            if (!isAudienceMatch) return false;

            const isPropertyMatch = 
                ann.targetProperties.length === 0 || 
                ann.targetProperties.some(propName => ownerPropertyNames.includes(propName));
            
            return isPropertyMatch;
        });
    }, [ownerPropertyNames, allAnnouncements]);

    const filteredAnnouncements = useMemo(() => {
        return relevantAnnouncements
            .filter(ann => {
                const matchesSearch = ann.title.toLowerCase().includes(searchTerm.toLowerCase()) || ann.content.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesProperty = propertyFilter === 'All Properties' || ann.targetProperties.length === 0 || ann.targetProperties.includes(propertyFilter);
                return matchesSearch && matchesProperty;
            })
            .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
    }, [relevantAnnouncements, searchTerm, propertyFilter]);

    const pinnedAnnouncements = filteredAnnouncements.filter(a => a.isPinned);
    const regularAnnouncements = filteredAnnouncements.filter(a => !a.isPinned);

    return (
        <DashboardLayout navItems={OWNER_NAV} activePath="/owner/announcements">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Announcements</h2>
            <p className="text-slate-500 mb-6">View communications from your property manager.</p>
            
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                    <select value={propertyFilter} onChange={e => setPropertyFilter(e.target.value)} className="text-sm bg-white border-slate-300 rounded-lg shadow-sm">
                        <option>All Properties</option>
                        {ownerProperties.map(p => <option key={p.name}>{p.name}</option>)}
                    </select>
                </div>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><SearchIcon className="w-4 h-4 text-slate-400" /></div>
                    <input type="text" placeholder="Search announcements..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9 pr-3 py-2 text-sm w-72 bg-white border border-slate-300 rounded-lg" />
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
                            <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
                                <p className="text-slate-500">No announcements found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default OwnerAnnouncements;