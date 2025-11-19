import React, { useState, useMemo, useEffect, useRef } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { MANAGER_NAV, properties } from '../constants';
import { SearchIcon, PlusIcon, EllipsisVerticalIcon, XMarkIcon, UploadIcon, DocumentTextIcon, FolderIcon, EyeIcon, DownloadIcon, TrashIcon } from '../components/Icons';
import type { Document, Unit } from '../types';
import { useData } from '../contexts/DataContext';


const NewFolderModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onCreate: (folderName: string) => void;
}> = ({ isOpen, onClose, onCreate }) => {
    const [folderName, setFolderName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCreate(folderName);
        setFolderName('');
    };
    
    useEffect(() => {
        if (isOpen) {
            setFolderName('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-between items-center p-6 border-b">
                        <h2 className="text-xl font-bold text-slate-800">Create New Folder</h2>
                        <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600"><XMarkIcon className="w-6 h-6" /></button>
                    </div>
                    <div className="p-6">
                        <label htmlFor="folderName" className="block text-sm font-medium text-slate-700">Folder Name</label>
                        <input
                            id="folderName"
                            type="text"
                            value={folderName}
                            onChange={e => setFolderName(e.target.value)}
                            required
                            autoFocus
                            className="mt-1 w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm"
                            placeholder="e.g., Leases 2024"
                        />
                    </div>
                    <div className="flex justify-end items-center p-6 bg-slate-50 border-t space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Create Folder</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const UploadDocumentModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onUpload: (doc: Omit<Document, 'id' | 'size' | 'uploadDate' | 'path' | 'property' | 'unit'>) => void;
}> = ({ isOpen, onClose, onUpload }) => {
    const initialState = { name: '', type: 'Lease' as Document['type'] };
    const [formData, setFormData] = useState(initialState);
    const [fileName, setFileName] = useState('');

    useEffect(() => { if (isOpen) {
        setFormData(initialState);
        setFileName('');
    } }, [isOpen]);
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFileName(file.name);
            setFormData(prev => ({ ...prev, name: file.name.replace(/\.[^/.]+$/, "") })); // Pre-fill name without extension
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.name && formData.type && fileName) {
            onUpload(formData);
        } else {
            alert("Please select a file and provide a document name.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-between items-center p-6 border-b">
                        <h2 className="text-2xl font-bold text-slate-800">Upload Document</h2>
                        <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600"><XMarkIcon className="w-6 h-6" /></button>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="mt-4 flex justify-center rounded-lg border border-dashed border-slate-900/25 px-6 py-10">
                            <div className="text-center">
                                <UploadIcon className="mx-auto h-12 w-12 text-slate-300" />
                                <div className="mt-4 flex text-sm leading-6 text-slate-600">
                                    <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500">
                                        <span>Upload a file</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                {fileName ? (
                                    <p className="text-sm font-medium text-slate-800 mt-2">{fileName}</p>
                                ) : (
                                    <p className="text-xs leading-5 text-slate-600">PNG, JPG, PDF up to 10MB</p>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Document Name</label>
                            <input type="text" name="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="mt-1 w-full px-3 py-2 bg-white border border-slate-300 rounded-md" placeholder="e.g., Lease Agreement - O. Martinez" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Document Type</label>
                            <select name="type" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as Document['type']})} className="mt-1 w-full px-3 py-2 bg-white border border-slate-300 rounded-md">
                                <option>Lease</option><option>Inspection Report</option><option>Invoice</option><option>Legal</option><option>Other</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end items-center p-6 bg-slate-50 border-t space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Upload Document</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const Documents: React.FC = () => {
    const { documents, addDocument, addFolder, deleteDocument } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof Document; direction: string } | null>({ key: 'name', direction: 'ascending' });
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
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

    const handleUpload = (docData: Omit<Document, 'id'|'size'|'uploadDate'|'path'|'property'|'unit'>) => {
        const propertyName = currentPath.split('/')[1] || 'All Properties';
        const newDoc: Document = {
            id: `doc${Date.now()}`,
            size: `${(Math.random() * 5 + 0.5).toFixed(1)} MB`,
            uploadDate: new Date().toISOString(),
            path: currentPath,
            property: propertyName,
            ...docData
        };
        addDocument(newDoc);
        setIsUploadModalOpen(false);
    };
    
    const handleNewFolder = (folderName: string) => {
        if (!folderName.trim()) return;
        const propertyName = currentPath.split('/')[1] || 'All Properties';
        const newFolder: Document = {
            id: `folder-${Date.now()}`,
            name: folderName.trim(),
            type: 'Folder',
            property: propertyName,
            path: currentPath,
            uploadDate: new Date().toISOString()
        };
        addFolder(newFolder);
        setIsNewFolderModalOpen(false);
    }

    const handleDelete = (id: string) => {
        if(window.confirm("Are you sure you want to delete this document? This may include sub-folders and files if it is a folder.")) {
            deleteDocument(id);
        }
        setActiveMenu(null);
    }
    
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
        const items = documents
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
    }, [documents, currentPath, searchTerm, sortConfig]);


    const requestSort = (key: keyof Document) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') direction = 'descending';
        setSortConfig({ key, direction });
    };

    return (
        <DashboardLayout navItems={MANAGER_NAV} activePath="/manager/documents">
            <div className="h-full flex flex-col">
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Documents</h2>
                <p className="text-slate-500 mb-6">Manage leases, inspections, and other property-related files.</p>
                
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
                         <div className="flex items-center space-x-2">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><SearchIcon className="w-4 h-4 text-slate-400" /></div>
                                <input type="text" placeholder="Search in this folder..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9 pr-3 py-2 text-sm w-64 bg-white border border-slate-300 rounded-lg" />
                            </div>
                            <button onClick={() => setIsNewFolderModalOpen(true)} className="flex items-center text-sm text-slate-600 font-semibold bg-slate-100 px-3 py-2 rounded-lg hover:bg-slate-200">
                                <PlusIcon className="w-4 h-4 mr-2" /> New Folder
                            </button>
                            <button onClick={() => setIsUploadModalOpen(true)} className="flex items-center text-sm bg-blue-600 text-white font-semibold px-3 py-2 rounded-lg hover:bg-blue-700">
                                <UploadIcon className="w-4 h-4 mr-2" /> Upload
                            </button>
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
                                    <tr key={doc.id} onClick={() => setCurrentPath(`${doc.path}${doc.name}/`)} className="hover:bg-slate-50 transition-colors cursor-pointer">
                                        <td className="px-6 py-3">
                                            <div className="flex items-center text-left">
                                                <FolderIcon className="w-5 h-5 mr-3 text-blue-500 flex-shrink-0" />
                                                <p className="font-semibold text-slate-800 text-sm">{doc.name}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 text-sm text-slate-600">—</td>
                                        <td className="px-6 py-3 text-sm text-slate-600">{new Date(doc.uploadDate).toLocaleDateString()}</td>
                                        <td className="px-6 py-3 text-right">
                                            {/* Actions for folders if needed */}
                                        </td>
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
                                                    <div className="border-t my-1"></div>
                                                    <button onClick={() => handleDelete(doc.id)} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"><TrashIcon className="w-4 h-4 mr-2" /> Delete</button>
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
                                <p className="mt-1 text-sm text-slate-500">Upload a document or create a new folder.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <UploadDocumentModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} onUpload={handleUpload} />
            <NewFolderModal isOpen={isNewFolderModalOpen} onClose={() => setIsNewFolderModalOpen(false)} onCreate={handleNewFolder} />
        </DashboardLayout>
    );
};

export default Documents;