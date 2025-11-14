import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { OWNER_NAV } from '../constants';
import { SearchIcon, ChevronUpIcon, ChevronDownIcon, XMarkIcon, EyeIcon } from '../components/Icons';
import type { CapitalProject } from '../types';
import { useData } from '../contexts/DataContext';

const currentOwner = 'Greenleaf Investments';

const ProjectDetailModal: React.FC<{
    project: CapitalProject;
    onClose: () => void;
}> = ({ project, onClose }) => {
    if (!project) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg transform transition-all duration-300">
                <div className="flex justify-between items-center p-6 border-b border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-800">{project.name}</h2>
                    <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-sm">
                    <p><strong className="font-semibold text-slate-600">Property:</strong> {project.property}</p>
                    <p><strong className="font-semibold text-slate-600">Status:</strong> {project.status}</p>
                    <p><strong className="font-semibold text-slate-600">Estimated Cost:</strong> ${project.cost.toLocaleString()}</p>
                    <p><strong className="font-semibold text-slate-600">Expected Lifespan:</strong> {project.lifespan} years</p>
                    <p><strong className="font-semibold text-slate-600">Date Proposed:</strong> {new Date(project.dateProposed).toLocaleDateString()}</p>
                    <div>
                        <strong className="font-semibold text-slate-600">Description:</strong>
                        <p className="mt-1 text-slate-700">{project.description}</p>
                    </div>
                </div>
                <div className="flex justify-end items-center p-6 bg-slate-50 border-t border-slate-200 rounded-b-lg">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50">Close</button>
                </div>
            </div>
        </div>
    );
};

const OwnerCapitalProjects: React.FC = () => {
    const { capitalProjects, updateCapitalProject, deleteCapitalProject, properties } = useData();
    const [searchParams] = useSearchParams();
    const filterParam = searchParams.get('filter');

    const [propertyFilter, setPropertyFilter] = useState('All Properties');
    const [statusFilter, setStatusFilter] = useState(filterParam === 'proposed' ? 'Proposed' : 'All Statuses');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof CapitalProject | 'name'; direction: string } | null>({ key: 'dateProposed', direction: 'descending' });
    const [modalProject, setModalProject] = useState<CapitalProject | null>(null);
    
    const ownerProperties = useMemo(() => properties.filter(p => p.owner === currentOwner), [properties]);
    const ownerPropertyNames = useMemo(() => ownerProperties.map(p => p.name), [ownerProperties]);

    const projects = useMemo(() => capitalProjects.filter(p => ownerPropertyNames.includes(p.property)), [capitalProjects, ownerPropertyNames]);
    
    useEffect(() => {
        setStatusFilter(filterParam === 'proposed' ? 'Proposed' : 'All Statuses');
    }, [filterParam]);

    const handleApprove = (projectName: string) => {
        const projectToUpdate = projects.find(p => p.name === projectName);
        if (projectToUpdate && window.confirm(`Are you sure you want to approve the project "${projectName}"?`)) {
            updateCapitalProject({ ...projectToUpdate, status: 'Approved' });
        }
    };
    
    const handleDeny = (projectName: string) => {
        if (window.confirm(`Denying this project will remove it from the list. Are you sure?`)) {
            deleteCapitalProject(projectName);
        }
    };

    const getStatusBadge = (status: CapitalProject['status']) => {
        switch (status) {
            case 'Proposed': return 'bg-blue-100 text-blue-700';
            case 'Approved': return 'bg-violet-100 text-violet-700';
            case 'In Progress': return 'bg-amber-100 text-amber-700';
            case 'Completed': return 'bg-green-100 text-green-700';
        }
    };

    const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
        <div className="w-full bg-slate-200 rounded-full h-1.5"><div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${progress}%` }}></div></div>
    );

    const filteredProjects = useMemo(() => {
        return projects.filter(project => 
            (propertyFilter === 'All Properties' || project.property === propertyFilter) &&
            (statusFilter === 'All Statuses' || project.status === statusFilter) &&
            (searchTerm === '' || project.name.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [projects, propertyFilter, statusFilter, searchTerm]);
    
    const sortedProjects = useMemo(() => {
        let sortableItems = [...filteredProjects];
        if (sortConfig) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        return sortableItems;
    }, [filteredProjects, sortConfig]);

    const requestSort = (key: keyof CapitalProject) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    return (
        <DashboardLayout navItems={OWNER_NAV} activePath="/owner/capital-projects">
            <h2 className="text-3xl font-bold text-slate-800">Capital Projects</h2>
            <p className="text-slate-500 mt-1 mb-6">Review, approve, and track major projects for your properties.</p>

            <div className="p-4 bg-white rounded-lg shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                    <label className="text-xs font-medium text-slate-600">Property</label>
                    <select value={propertyFilter} onChange={e => setPropertyFilter(e.target.value)} className="mt-1 w-full text-sm bg-white border-slate-300 rounded-md shadow-sm">
                        <option>All Properties</option>
                        {ownerProperties.map(p => <option key={p.name}>{p.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-xs font-medium text-slate-600">Status</label>
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="mt-1 w-full text-sm bg-white border-slate-300 rounded-md shadow-sm">
                        <option>All Statuses</option>
                        <option>Proposed</option><option>Approved</option><option>In Progress</option><option>Completed</option>
                    </select>
                </div>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><SearchIcon className="w-4 h-4 text-slate-400" /></div>
                    <input type="text" placeholder="Search projects..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9 w-full text-sm bg-white border border-slate-300 rounded-lg" />
                </div>
            </div>

            <p className="text-sm text-slate-500 my-4">Showing {sortedProjects.length} projects.</p>
            
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b">
                        <tr className="text-xs text-slate-500 uppercase font-semibold">
                            <th className="px-6 py-3">Project</th>
                            <th className="px-6 py-3">Property</th>
                            <th className="px-6 py-3">Cost</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Progress</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {sortedProjects.map(project => (
                            <tr
                                key={project.name}
                                onClick={() => setModalProject(modalProject?.name === project.name ? null : project)}
                                className={`hover:bg-slate-50 transition-colors cursor-pointer ${modalProject?.name === project.name ? 'bg-blue-50' : ''}`}
                            >
                                <td className="px-6 py-4 font-semibold text-slate-800 text-sm">{project.name}</td>
                                <td className="px-6 py-4 text-sm text-slate-600">{project.property}</td>
                                <td className="px-6 py-4 text-sm text-slate-600">${project.cost.toLocaleString()}</td>
                                <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(project.status)}`}>{project.status}</span></td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-3"><div className="w-28"><ProgressBar progress={project.progress} /></div><span className="text-sm font-medium text-slate-600 w-10 text-right">{project.progress}%</span></div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {project.status === 'Proposed' && (
                                        <div className="flex justify-end space-x-2">
                                            <button onClick={(e) => { e.stopPropagation(); handleApprove(project.name); }} className="px-3 py-1 text-xs font-semibold text-white bg-green-500 hover:bg-green-600 rounded-md">Approve</button>
                                            <button onClick={(e) => { e.stopPropagation(); handleDeny(project.name); }} className="px-3 py-1 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 rounded-md">Deny</button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {sortedProjects.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-slate-500">No projects match the selected filters.</p>
                    </div>
                 )}
            </div>

            {modalProject && <ProjectDetailModal project={modalProject} onClose={() => setModalProject(null)} />}
        </DashboardLayout>
    );
};

export default OwnerCapitalProjects;