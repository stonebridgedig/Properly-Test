import React, { useState, useMemo, useEffect, useRef } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { OWNER_NAV, properties } from '../constants';
import { SearchIcon, EllipsisVerticalIcon, DocumentTextIcon, FolderIcon, EyeIcon, DownloadIcon } from '../components/Icons';
import type { Document } from '../types';
import { useData } from '../contexts/DataContext';

const currentOwner = 'Greenleaf Investments';

const OwnerDocuments: React.FC = () => {
    const { documents } = useData();
    
    const ownerProperties = useMemo(() => properties.filter(p => p.owner === currentOwner).map(p => p.name), []);

    const ownerDocuments = useMemo(() => {
        return documents.filter(doc => {
            if (doc.property === 'All Properties') return true;
            return ownerProperties.includes(doc.property);
        });
    }, [ownerProperties, documents]);

    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof Document; direction: string } | null>({ key: 'name', direction: 'ascending' });
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [currentPath, setCurrentPath] = useState('/');
    const menuRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) setActiveMenu(null);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    const breadcrumbs = useMemo(() => {
        const pathParts = currentPath.split('/').filter(p => p);
        const crumbs = [{ name: 'All Documents', path: '/' }];
        let currentLink = '/';
        for (const part of pathParts) {
            currentLink += `${part}/`;
            crumbs.push({ name: part, path: currentLink });
        }
        return crumbs;
    }, [currentPath]);

    const { foldersInView, filesInView } = useMemo(() => {
        const items = ownerDocuments
            .filter(doc => doc.path === currentPath)
            .filter(doc => doc.name.toLowerCase().includes(searchTerm.toLowerCase()));
        
        let folders = items.filter(item => item.type === 'Folder');
        let files = items.filter(item => item.type !== 'Folder');

        if (sortConfig) {
            const sortArray = (arr: Document[], key: keyof Document, direction: string) => {
                arr.sort((a, b) => {
                    if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
                    if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
                    return 0;
                });
            };
            sortArray(folders, sortConfig.key, sortConfig.direction);
            sortArray(files, sortConfig.key, sortConfig.direction);
        }
        
        return { foldersInView: folders, filesInView: files };
    }, [ownerDocuments, currentPath, searchTerm, sortConfig]);


    const requestSort = (key: keyof Document) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') direction = 'descending';
        setSortConfig({ key, direction });
    };

    return (
        <DashboardLayout navItems={OWNER_NAV} activePath="/owner/documents">
            <div className="h-full flex flex-col">
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Documents</h2>
                <p className="text-slate-500 mb-6">Access leases, reports, and other files for your properties.</p>
                
                <div className="flex-1 flex flex-col bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    <div className="flex-shrink-0 flex justify-between items-center p-4 border-b border-slate-200">
                        <div className="flex items-center text-sm font-medium">
                            {breadcrumbs.map((crumb, index) => (
                                <React.Fragment key={crumb.path}>
                                    {index > 0 && <span className="mx-2 text-slate-400">/</span>}
                                    <button 
                                      onClick={() => setCurrentPath(crumb.path)} 
                                      className={`${index === breadcrumbs.length - 1 ? 'text-slate-800 font-semibold' : 'text-slate-500 hover:text-blue-600'}`}
                                      disabled={index === breadcrumbs.length - 1}
                                    >
                                      {crumb.name}
                                    </button>
                                </React.Fragment>
                            ))}
                        </div>
                         <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><SearchIcon className="w-4 h-4 text-slate-400" /></div>
                            <input type="text" placeholder="Search in this folder..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9 pr-3 py-2 text-sm w-64 bg-white border border-slate-300 rounded-lg" />
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
                                <tr className="text-xs text-slate-500 uppercase font-semibold">
                                    <th className="px-6 py-3 w-2/5"><button onClick={() => requestSort('name')} className="flex items-center space-x-1"><span>Name</span></button></th>
                                    <th className="px-6 py-3"><button onClick={() => requestSort('size')} className="flex items-center space-x-1"><span>Size</span></button></th>
                                    <th className="px-6 py-3"><button onClick={() => requestSort('uploadDate')} className="flex items-center space-x-1"><span>Date Added</span></button></th>
                                    <th className="px-6 py-3 text-right"><span className="sr-only">Actions</span></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {foldersInView.map(doc => (
                                    <tr key={doc.id} onDoubleClick={() => setCurrentPath(`${doc.path}${doc.name}/`)} className="hover:bg-slate-50 transition-colors cursor-pointer">
                                        <td className="px-6 py-3">
                                            <button onClick={() => setCurrentPath(`${doc.path}${doc.name}/`)} className="flex items-center text-left">
                                                <FolderIcon className="w-5 h-5 mr-3 text-blue-500 flex-shrink-0" />
                                                <p className="font-semibold text-slate-800 text-sm">{doc.name}</p>
                                            </button>
                                        </td>
                                        <td className="px-6 py-3 text-sm text-slate-600">—</td>
                                        <td className="px-6 py-3 text-sm text-slate-600">{new Date(doc.uploadDate).toLocaleDateString()}</td>
                                        <td className="px-6 py-3 text-right"></td>
                                    </tr>
                                ))}
                                {filesInView.map(doc => (
                                    <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-3">
                                            <div className="flex items-center">
                                                <DocumentTextIcon className="w-5 h-5 mr-3 text-slate-400 flex-shrink-0" />
                                                <div>
                                                    <p className="font-semibold text-slate-800 text-sm">{doc.name}</p>
                                                    <p className="text-xs text-slate-500">{doc.type}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 text-sm text-slate-600">{doc.size}</td>
                                        <td className="px-6 py-3 text-sm text-slate-600">{new Date(doc.uploadDate).toLocaleDateString()}</td>
                                        <td className="px-6 py-3 text-right relative">
                                            <button onClick={() => setActiveMenu(doc.id === activeMenu ? null : doc.id)} className="p-1 rounded-full hover:bg-slate-200">
                                                <EllipsisVerticalIcon className="w-5 h-5 text-slate-500" />
                                            </button>
                                            {activeMenu === doc.id && (
                                                <div ref={menuRef} className="absolute right-8 top-full mt-1 w-32 bg-white rounded-md shadow-lg z-20 border py-1 text-left">
                                                    <button className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"><EyeIcon className="w-4 h-4 mr-2" /> View</button>
                                                    <button className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"><DownloadIcon className="w-4 h-4 mr-2" /> Download</button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {foldersInView.length === 0 && filesInView.length === 0 && (
                            <div className="text-center py-16">
                                <FolderIcon className="mx-auto h-12 w-12 text-slate-300" />
                                <h3 className="mt-2 text-sm font-semibold text-slate-900">This folder is empty</h3>
                                <p className="mt-1 text-sm text-slate-500">No documents have been shared here yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default OwnerDocuments;