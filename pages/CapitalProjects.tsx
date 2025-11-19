
import React, { useState, useMemo } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { MANAGER_NAV } from '../constants';
import { BuildingIcon, ChevronDownIcon, CheckCircleIcon, SearchIcon, PlusIcon, ChartBarIcon } from '../components/Icons';
import { useData } from '../contexts/DataContext';

const CapitalProjects: React.FC = () => {
    const { capitalProjects, properties } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [propertyFilter, setPropertyFilter] = useState('All Properties');
    const [statusFilter, setStatusFilter] = useState('All Statuses');

    const filteredProjects = useMemo(() => {
        return capitalProjects.filter(project => {
            const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) || project.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesProperty = propertyFilter === 'All Properties' || project.property === propertyFilter;
            const matchesStatus = statusFilter === 'All Statuses' || project.status === statusFilter;
            return matchesSearch && matchesProperty && matchesStatus;
        });
    }, [capitalProjects, searchTerm, propertyFilter, statusFilter]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Proposed': return 'bg-slate-100 text-slate-600';
            case 'Approved': return 'bg-blue-100 text-blue-700';
            case 'In Progress': return 'bg-amber-100 text-amber-700';
            case 'Completed': return 'bg-green-100 text-green-700';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    return (
        <DashboardLayout navItems={MANAGER_NAV} activePath="/manager/capital-projects">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800">Capital Projects</h2>
                        <p className="text-slate-500 mt-1">Track major improvements and renovations.</p>
                    </div>
                    <button className="flex items-center bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        <PlusIcon className="w-5 h-5 mr-2" /> New Project
                    </button>
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

                        {/* Status Filter */}
                        <div className="relative min-w-[180px]">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <CheckCircleIcon className="w-5 h-5 text-slate-400" />
                            </div>
                            <select
                                value={statusFilter}
                                onChange={e => setStatusFilter(e.target.value)}
                                className="appearance-none w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-slate-50 transition-all cursor-pointer"
                            >
                                <option>All Statuses</option>
                                <option>Proposed</option>
                                <option>Approved</option>
                                <option>In Progress</option>
                                <option>Completed</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <ChevronDownIcon className="w-4 h-4 text-slate-400" />
                            </div>
                        </div>
                        
                        {/* Search Bar */}
                        <div className="relative flex-1 max-w-md">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon className="w-5 h-5 text-slate-400" />
                            </div>
                            <input 
                                type="text" 
                                placeholder="Search projects..." 
                                value={searchTerm} 
                                onChange={e => setSearchTerm(e.target.value)} 
                                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400 transition-all" 
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {filteredProjects.length > 0 ? (
                        filteredProjects.map((project, index) => (
                            <div key={index} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-1">
                                            <h3 className="text-lg font-bold text-slate-800">{project.name}</h3>
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${getStatusColor(project.status)}`}>
                                                {project.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-500 mb-4">{project.property}</p>
                                        <p className="text-slate-600 text-sm leading-relaxed mb-4">{project.description}</p>
                                        
                                        <div className="flex items-center space-x-6 text-sm text-slate-500">
                                            <div className="flex items-center">
                                                <span className="font-semibold text-slate-700 mr-2">Budget:</span>
                                                ${project.cost.toLocaleString()}
                                            </div>
                                            <div className="flex items-center">
                                                <span className="font-semibold text-slate-700 mr-2">Progress:</span>
                                                <div className="w-24 bg-slate-200 rounded-full h-2 mr-2">
                                                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${project.progress}%` }}></div>
                                                </div>
                                                {project.progress}%
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                                        <ChartBarIcon className="w-6 h-6" />
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                            <ChartBarIcon className="mx-auto h-12 w-12 text-slate-300" />
                            <h3 className="mt-2 text-sm font-semibold text-slate-900">No projects found</h3>
                            <p className="mt-1 text-sm text-slate-500">Get started by creating a new capital project.</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CapitalProjects;
