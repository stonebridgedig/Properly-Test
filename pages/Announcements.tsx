import React, { useState, useMemo, useEffect, useRef } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { MANAGER_NAV, properties } from '../constants';
import { PlusIcon, SearchIcon, XMarkIcon, EllipsisVerticalIcon, PinIcon } from '../components/Icons';
import type { Announcement } from '../types';
import { useData } from '../contexts/DataContext';

const CreateAnnouncementModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (announcement: Announcement) => void;
    announcementToEdit: Announcement | null;
}> = ({ isOpen, onClose, onSave, announcementToEdit }) => {
    const isEditMode = !!announcementToEdit;
    const initialFormState = {
        title: '',
        content: '',
        targetAudience: 'All' as Announcement['targetAudience'],
        targetProperties: [] as string[],
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (isOpen) {
            if (isEditMode) {
                setFormData({
                    title: announcementToEdit.title,
                    content: announcementToEdit.content,
                    targetAudience: announcementToEdit.targetAudience,
                    targetProperties: announcementToEdit.targetProperties,
                });
            } else {
                setFormData(initialFormState);
            }
        }
    }, [isOpen, announcementToEdit]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePropertyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions, (option: HTMLOptionElement) => option.value);
        if (selectedOptions.includes("All Properties")) {
            setFormData(prev => ({...prev, targetProperties: []}));
        } else {
            setFormData(prev => ({ ...prev, targetProperties: selectedOptions }));
        }
    };
    
    const handleSave = (status: 'Published' | 'Draft') => {
        const announcement: Announcement = {
            id: isEditMode ? announcementToEdit.id : `ann${Date.now()}`,
            isPinned: isEditMode ? announcementToEdit.isPinned : false,
            publishedDate: isEditMode && announcementToEdit.status === status ? announcementToEdit.publishedDate : new Date().toISOString(),
            ...formData,
            status,
        };
        onSave(announcement);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl transform transition-all duration-300">
                <div className="flex justify-between items-center p-6 border-b border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-800">{isEditMode ? 'Edit Announcement' : 'Create New Announcement'}</h2>
                    <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600"><XMarkIcon className="w-6 h-6" /></button>
                </div>
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Title</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} required className="mt-1 w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm" placeholder="e.g., Community BBQ & Pool Party" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Content</label>
                        <textarea name="content" value={formData.content} onChange={handleChange} rows={6} required className="mt-1 w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm" placeholder="Write your announcement here..."></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Audience</label>
                        <div className="flex items-center space-x-4">
                            {['All', 'Tenants', 'Owners'].map(audience => (
                                <label key={audience} className="flex items-center text-sm">
                                    <input type="radio" name="targetAudience" value={audience} checked={formData.targetAudience === audience} onChange={handleChange} className="h-4 w-4 text-blue-600 border-slate-300"/>
                                    <span className="ml-2 text-slate-700">{audience}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Properties</label>
                        <select multiple value={formData.targetProperties.length === 0 ? ['All Properties'] : formData.targetProperties} onChange={handlePropertyChange} className="mt-1 w-full h-32 px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm">
                            <option value="All Properties">All Properties</option>
                            {properties.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                        </select>
                        <p className="text-xs text-slate-500 mt-1">Hold Ctrl/Cmd to select multiple properties. Selecting "All Properties" overrides other selections.</p>
                    </div>
                </div>
                <div className="flex justify-between items-center p-6 bg-slate-50 border-t rounded-b-lg">
                    <button onClick={() => handleSave('Draft')} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">Save as Draft</button>
                    <div className="space-x-3">
                        <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700">Cancel</button>
                        <button onClick={() => handleSave('Published')} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Publish Announcement</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Announcements: React.FC = () => {
    const { announcements, saveAnnouncement, deleteAnnouncement, togglePin } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [propertyFilter, setPropertyFilter] = useState('All Properties');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [announcementToEdit, setAnnouncementToEdit] = useState<Announcement | null>(null);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) setActiveMenu(null);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSave = (announcement: Announcement) => {
        saveAnnouncement(announcement);
        setIsModalOpen(false);
        setAnnouncementToEdit(null);
    };

    const handleCreateNew = () => {
        setAnnouncementToEdit(null);
        setIsModalOpen(true);
    };

    const handleEdit = (announcement: Announcement) => {
        setAnnouncementToEdit(announcement);
        setIsModalOpen(true);
        setActiveMenu(null);
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this announcement?")) {
            deleteAnnouncement(id);
        }
        setActiveMenu(null);
    };

    const handleTogglePin = (id: string) => {
        togglePin(id);
        setActiveMenu(null);
    };

    const filteredAnnouncements = useMemo(() => {
        return announcements
            .filter(ann => {
                const matchesSearch = ann.title.toLowerCase().includes(searchTerm.toLowerCase()) || ann.content.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesProperty = propertyFilter === 'All Properties' || ann.targetProperties.length === 0 || ann.targetProperties.includes(propertyFilter);
                return matchesSearch && matchesProperty;
            })
            .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
    }, [announcements, searchTerm, propertyFilter]);

    const pinnedAnnouncements = filteredAnnouncements.filter(a => a.isPinned);
    const regularAnnouncements = filteredAnnouncements.filter(a => !a.isPinned);

    return (
        <DashboardLayout navItems={MANAGER_NAV} activePath="/manager/announcements">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Announcements</h2>
            <p className="text-slate-500 mb-6">Create and manage communications for tenants and owners.</p>
            
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                    <select value={propertyFilter} onChange={e => setPropertyFilter(e.target.value)} className="text-sm bg-white border-slate-300 rounded-lg shadow-sm">
                        <option>All Properties</option>
                        {properties.map(p => <option key={p.name}>{p.name}</option>)}
                    </select>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center"><SearchIcon className="w-4 h-4 text-slate-400" /></div>
                        <input type="text" placeholder="Search announcements..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9 pr-3 py-2 text-sm w-72 bg-white border border-slate-300 rounded-lg" />
                    </div>
                    <button onClick={handleCreateNew} className="flex items-center bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700">
                        <PlusIcon className="w-5 h-5 mr-2" /> Create Announcement
                    </button>
                </div>
            </div>

            <div className="space-y-8">
                {pinnedAnnouncements.length > 0 && (
                    <div>
                        <h3 className="text-sm font-semibold text-slate-500 uppercase mb-3">Pinned</h3>
                        <div className="space-y-4">
                            {pinnedAnnouncements.map(ann => <AnnouncementCard key={ann.id} announcement={ann} onEdit={handleEdit} onDelete={handleDelete} onTogglePin={handleTogglePin} setActiveMenu={setActiveMenu} activeMenu={activeMenu} menuRef={menuRef} />)}
                        </div>
                    </div>
                )}
                <div>
                     <h3 className="text-sm font-semibold text-slate-500 uppercase mb-3">Recent</h3>
                     <div className="space-y-4">
                        {regularAnnouncements.length > 0 ? (
                           regularAnnouncements.map(ann => <AnnouncementCard key={ann.id} announcement={ann} onEdit={handleEdit} onDelete={handleDelete} onTogglePin={handleTogglePin} setActiveMenu={setActiveMenu} activeMenu={activeMenu} menuRef={menuRef} />)
                        ) : (
                            <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
                                <p className="text-slate-500">No announcements found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <CreateAnnouncementModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                announcementToEdit={announcementToEdit}
            />
        </DashboardLayout>
    );
};

const AnnouncementCard: React.FC<{
    announcement: Announcement;
    onEdit: (announcement: Announcement) => void;
    onDelete: (id: string) => void;
    onTogglePin: (id: string) => void;
    activeMenu: string | null;
    setActiveMenu: (id: string | null) => void;
    menuRef: React.RefObject<HTMLDivElement>;
}> = ({ announcement, onEdit, onDelete, onTogglePin, activeMenu, setActiveMenu, menuRef }) => {
    
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
                           {announcement.status === 'Draft' && <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Draft</span>}
                        </div>
                        <p className="text-xs text-slate-500">
                           Published on {new Date(announcement.publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    <div className="relative">
                        <button onClick={(e) => { e.stopPropagation(); setActiveMenu(announcement.id === activeMenu ? null : announcement.id); }} className="p-1 rounded-full text-slate-500 hover:bg-slate-200">
                            <EllipsisVerticalIcon className="w-5 h-5" />
                        </button>
                         {activeMenu === announcement.id && (
                            <div ref={menuRef} className="absolute right-0 top-full mt-1 w-40 bg-white rounded-md shadow-lg z-20 border border-slate-200 py-1 text-left">
                                <button onClick={() => onTogglePin(announcement.id)} className="w-full text-left block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">{announcement.isPinned ? 'Unpin' : 'Pin'}</button>
                                <button onClick={() => onEdit(announcement)} className="w-full text-left block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Edit</button>
                                <div className="border-t border-slate-100 my-1"></div>
                                <button onClick={() => onDelete(announcement.id)} className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50">Delete</button>
                            </div>
                        )}
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

export default Announcements;
