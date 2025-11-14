import React, { useState, useMemo, useEffect, useRef } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { MANAGER_NAV } from '../constants';
import { PlusIcon, SearchIcon, ChevronUpIcon, ChevronDownIcon, XMarkIcon, DocumentIcon, DocumentTextIcon, WrenchIcon, ClockIcon } from '../components/Icons';
import type { CapitalProject, Property, Transaction, ExpenseLog } from '../types';
import { useData } from '../contexts/DataContext';

const ProposeProjectModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onAddProject: (project: Omit<CapitalProject, 'status' | 'progress' | 'dateProposed' | 'actualCost' | 'expenses' | 'documents' | 'activityLog'>) => void;
    properties: Property[];
}> = ({ isOpen, onClose, onAddProject, properties }) => {
    const initialState = {
        property: '',
        name: '',
        description: '',
        cost: '',
        lifespan: '',
    };
    const [formData, setFormData] = useState(initialState);

    useEffect(() => {
        if (isOpen) {
            setFormData(initialState);
        }
    }, [isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.property || !formData.name || !formData.cost || !formData.lifespan) {
            alert('Please fill out all required fields.');
            return;
        }
        onAddProject({
            property: formData.property,
            name: formData.name,
            description: formData.description,
            cost: Number(formData.cost),
            lifespan: Number(formData.lifespan),
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg transform transition-all duration-300">
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-between items-center p-6 border-b border-slate-200">
                        <h2 className="text-2xl font-bold text-slate-800">Propose New Capital Project</h2>
                        <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <div>
                            <label htmlFor="property" className="block text-sm font-medium text-slate-700">Property</label>
                            <select id="property" name="property" value={formData.property} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                <option value="" disabled>Select property</option>
                                {properties.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700">Project Name</label>
                            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm" placeholder="e.g., Roof Replacement - Building A" />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-slate-700">Description</label>
                            <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm" placeholder="Describe the scope of the project, why it's needed, etc."></textarea>
                        </div>
                        <div className="flex space-x-4">
                            <div className="flex-1">
                                <label htmlFor="cost" className="block text-sm font-medium text-slate-700">Estimated Cost</label>
                                <input type="number" id="cost" name="cost" value={formData.cost} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm" placeholder="e.g., 75000" />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="lifespan" className="block text-sm font-medium text-slate-700">Expected Lifespan (Years)</label>
                                <input type="number" id="lifespan" name="lifespan" value={formData.lifespan} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm" placeholder="e.g., 20" />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end items-center p-6 bg-slate-50 border-t border-slate-200 rounded-b-lg space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700">Propose Project</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ProjectDetailModal: React.FC<{
    project: CapitalProject;
    onClose: () => void;
    onUpdateProject: (updatedProject: CapitalProject) => void;
    addTransaction: (transactionData: Omit<Transaction, 'id' | 'owner'>) => void;
}> = ({ project, onClose, onUpdateProject, addTransaction }) => {
    const [activeTab, setActiveTab] = useState('Overview');
    const [expenseDescription, setExpenseDescription] = useState('');
    const [expenseAmount, setExpenseAmount] = useState('');

    const handleLogExpense = () => {
        const amount = parseFloat(expenseAmount);
        if (!expenseDescription || isNaN(amount) || amount <= 0) {
            alert("Please enter a valid description and amount.");
            return;
        }
        const newExpense: ExpenseLog = {
            id: `e${Date.now()}`,
            date: new Date().toISOString(),
            description: expenseDescription,
            amount: amount,
        };
        const newActivity = {
            id: `al${Date.now()}`,
            timestamp: new Date().toISOString(),
            activity: `Expense of $${amount.toLocaleString()} logged: ${expenseDescription}`,
        }
        const updatedProject = {
            ...project,
            expenses: [...project.expenses, newExpense],
            actualCost: project.actualCost + amount,
            activityLog: [newActivity, ...project.activityLog],
        };
        
        onUpdateProject(updatedProject);
        
        addTransaction({
            date: newExpense.date,
            description: `Project: ${project.name} - ${newExpense.description}`,
            property: project.property,
            category: 'Expense',
            type: 'Maintenance',
            amount: newExpense.amount,
        });

        setExpenseDescription('');
        setExpenseAmount('');
    };

    const tabs = ['Overview', 'Budget', 'Documents', 'Activity Log'];

    const renderContent = () => {
        switch (activeTab) {
            case 'Budget':
                const budgetDifference = project.cost - project.actualCost;
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="p-3 bg-slate-50 rounded-md border">
                                <p className="text-xs text-slate-500 font-semibold">ESTIMATED</p>
                                <p className="text-lg font-bold text-slate-800">${project.cost.toLocaleString()}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-md border">
                                <p className="text-xs text-slate-500 font-semibold">ACTUAL</p>
                                <p className="text-lg font-bold text-slate-800">${project.actualCost.toLocaleString()}</p>
                            </div>
                             <div className={`p-3 rounded-md border ${budgetDifference >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                <p className={`text-xs font-semibold ${budgetDifference >= 0 ? 'text-green-600' : 'text-red-600'}`}>REMAINING</p>
                                <p className={`text-lg font-bold ${budgetDifference >= 0 ? 'text-green-800' : 'text-red-800'}`}>${budgetDifference < 0 ? '-' : ''}${Math.abs(budgetDifference).toLocaleString()}</p>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-700 mb-2">Log New Expense</h4>
                            <div className="flex items-end space-x-2">
                                <div className="flex-grow"><label className="text-xs">Description</label><input type="text" value={expenseDescription} onChange={e => setExpenseDescription(e.target.value)} className="w-full text-sm border-slate-300 rounded-md" /></div>
                                <div className="w-28"><label className="text-xs">Amount</label><input type="number" value={expenseAmount} onChange={e => setExpenseAmount(e.target.value)} className="w-full text-sm border-slate-300 rounded-md" /></div>
                                <button onClick={handleLogExpense} className="px-3 py-2 text-sm font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700">Log</button>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-700 mt-4 mb-2">Expense History</h4>
                            <ul className="space-y-2">
                                {project.expenses.map(exp => (
                                    <li key={exp.id} className="flex justify-between items-center p-2 bg-slate-50 rounded-md text-sm">
                                        <div><p className="font-medium">{exp.description}</p><p className="text-xs text-slate-500">{new Date(exp.date).toLocaleDateString()}</p></div>
                                        <p className="font-semibold">${exp.amount.toLocaleString()}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                );
            case 'Documents':
                return (
                    <div>
                        <button className="w-full mb-4 flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-dashed border-blue-300 rounded-md hover:bg-blue-100"><PlusIcon className="w-4 h-4 mr-2" /> Upload Document</button>
                        <ul className="space-y-2">
                            {project.documents.map(doc => (
                                <li key={doc.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-slate-50">
                                    <div className="flex items-center"><DocumentTextIcon className="w-5 h-5 text-slate-400 mr-3" />
                                        <div><p className="font-medium text-sm">{doc.name}</p><p className="text-xs text-slate-500">{doc.type}</p></div>
                                    </div>
                                    <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-blue-600">View</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            case 'Activity Log':
                return (
                    <ul className="space-y-3">
                        {project.activityLog.map(log => (
                            <li key={log.id} className="flex items-start">
                                <ClockIcon className="w-4 h-4 text-slate-400 mr-3 mt-1" />
                                <div>
                                    <p className="text-sm text-slate-700">{log.activity}</p>
                                    <p className="text-xs text-slate-500">{new Date(log.timestamp).toLocaleString()}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                );
            default: // Overview
                return (
                    <div className="space-y-4">
                        <div>
                             <h4 className="font-semibold text-slate-700 mb-2">Details</h4>
                             <p className="text-sm text-slate-600">{project.description}</p>
                        </div>
                    </div>
                );
        }
    }

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 transition-opacity duration-300"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-5xl h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 border-b border-slate-200 flex-shrink-0">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-xl font-bold text-slate-800">{project.name}</h3>
                            <p className="text-sm text-slate-500">{project.property}</p>
                        </div>
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1"><XMarkIcon className="w-6 h-6" /></button>
                    </div>
                </div>
                <nav className="border-b px-4 flex-shrink-0">
                    <div className="flex space-x-1">
                        {tabs.map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-semibold rounded-t-md ${activeTab === tab ? 'bg-slate-50 text-blue-600 border-b-2 border-blue-500' : 'text-slate-500 hover:text-slate-800'}`}>
                                {tab}
                            </button>
                        ))}
                    </div>
                </nav>
                <div className="flex-1 overflow-y-auto p-6 text-sm">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

const CapitalProjects: React.FC = () => {
    const { capitalProjects, addCapitalProject, updateCapitalProject, properties, addTransaction } = useData();
    const [selectedProject, setSelectedProject] = useState<CapitalProject | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [propertyFilter, setPropertyFilter] = useState('All Properties');
    const [statusFilter, setStatusFilter] = useState('All Statuses');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof CapitalProject | 'name'; direction: string } | null>({ key: 'dateProposed', direction: 'descending' });
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) setActiveMenu(null);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleAddProject = (newProjectData: Omit<CapitalProject, 'status' | 'progress' | 'dateProposed'|'actualCost'|'expenses'|'documents'|'activityLog'>) => {
        const newProject: CapitalProject = {
            ...newProjectData,
            status: 'Proposed',
            progress: 0,
            dateProposed: new Date().toISOString().split('T')[0],
            actualCost: 0,
            expenses: [],
            documents: [],
            activityLog: [{id: `al${Date.now()}`, timestamp: new Date().toISOString(), activity: "Project Proposed"}],
        };
        addCapitalProject(newProject);
        setIsModalOpen(false);
    };
    
    const handleUpdateProject = (updatedProject: CapitalProject) => {
        updateCapitalProject(updatedProject);
        setSelectedProject(updatedProject);
    };

    const getStatusBadge = (status: CapitalProject['status']) => {
        switch (status) {
            case 'Proposed': return 'bg-blue-100 text-blue-700';
            case 'Approved': return 'bg-violet-100 text-violet-700';
            case 'In Progress': return 'bg-amber-100 text-amber-700';
            case 'Completed': return 'bg-green-100 text-green-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };
    
    const ProgressBar = ({ progress }: {progress: number}) => {
        return (
            <div className="w-full bg-slate-200 rounded-full h-1.5">
                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
        );
    };

    const filteredProjects = useMemo(() => {
        return capitalProjects.filter(project => 
            (propertyFilter === 'All Properties' || project.property === propertyFilter) &&
            (statusFilter === 'All Statuses' || project.status === statusFilter) &&
            (searchTerm === '' || project.name.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [capitalProjects, propertyFilter, statusFilter, searchTerm]);
    
    const sortedProjects = useMemo(() => {
        let sortableItems = [...filteredProjects];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        return sortableItems;
    }, [filteredProjects, sortConfig]);

    return (
        <DashboardLayout navItems={MANAGER_NAV} activePath="/manager/capital-projects">
            <div className="h-full flex flex-col">
                <div className="flex justify-between items-center mb-2">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800">Capital Projects</h2>
                        <p className="text-slate-500 mt-1">Propose and track large-scale projects for your properties.</p>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center bg-blue-600 text-white font-semibold px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                        <PlusIcon className="w-5 h-5 mr-2" /> Propose New Project
                    </button>
                </div>
                <div className="mt-6 p-4 bg-white rounded-lg shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                        <label className="text-xs font-medium text-slate-600">Property</label>
                        <select value={propertyFilter} onChange={e => setPropertyFilter(e.target.value)} className="mt-1 w-full text-sm bg-white border-slate-300 rounded-md shadow-sm">
                            <option>All Properties</option>
                            {properties.map(p => <option key={p.name}>{p.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-medium text-slate-600">Status</label>
                        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="mt-1 w-full text-sm bg-white border-slate-300 rounded-md shadow-sm">
                            <option>All Statuses</option>
                            <option>Proposed</option><option>Approved</option><option>In Progress</option><option>Completed</option>
                        </select>
                    </div>
                    <div className="md:col-span-2 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><SearchIcon className="w-4 h-4 text-slate-400" /></div>
                        <input type="text" placeholder="Search projects..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9 w-full text-sm bg-white border border-slate-300 rounded-lg" />
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-auto flex-1 mt-6">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-t border-slate-200 sticky top-0">
                            <tr className="text-xs text-slate-500 uppercase font-semibold">
                                <th className="px-6 py-3">Project Name</th>
                                <th className="px-6 py-3">Cost</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Progress</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {sortedProjects.map(project => (
                                <tr key={`${project.name}-${project.property}`} onClick={() => setSelectedProject(project)} className={`hover:bg-slate-50 transition-colors cursor-pointer ${selectedProject?.name === project.name ? 'bg-blue-50' : ''}`}>
                                    <td className="px-6 py-4">
                                        <p className="font-semibold text-slate-800 text-sm">{project.name}</p>
                                        <p className="text-xs text-slate-500">{project.property}</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">${project.cost.toLocaleString()}</td>
                                    <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(project.status)}`}>{project.status}</span></td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-full max-w-28"><ProgressBar progress={project.progress} /></div>
                                            <span className="text-sm font-medium text-slate-600 w-10 text-right">{project.progress}%</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedProject && (
                <ProjectDetailModal 
                    project={selectedProject}
                    onClose={() => setSelectedProject(null)}
                    onUpdateProject={handleUpdateProject}
                    addTransaction={addTransaction}
                />
            )}
            <ProposeProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddProject={handleAddProject} properties={properties} />
        </DashboardLayout>
    );
};

export default CapitalProjects;