import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import StatCard from '../components/dashboard/StatCard';
import { MANAGER_NAV } from '../constants';
import { DollarIcon, HomeIcon, WrenchIcon, DocumentIcon } from '../components/Icons';
import { useData } from '../contexts/DataContext';

const PropertyManagerDashboard: React.FC = () => {
    const { maintenanceRequests, rentRoll, properties, tenants } = useData();

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Paid': return 'bg-green-100 text-green-700';
            case 'Overdue': return 'bg-red-100 text-red-700';
            case 'Upcoming': return 'bg-blue-100 text-blue-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };
    
    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'Emergency': return 'bg-red-100 text-red-700';
            case 'High': return 'bg-amber-100 text-amber-700';
            case 'Medium': return 'bg-blue-100 text-blue-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };
    
    const getLeaseStatusBadge = (status: string) => {
        switch (status) {
            case 'Needs Follow-up': return 'bg-amber-100 text-amber-700';
            case 'Renewal Sent': return 'bg-blue-100 text-blue-700';
            case 'Notice Given': return 'bg-slate-100 text-slate-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const rentStats = React.useMemo(() => {
        const totalDue = rentRoll.reduce((sum, item) => sum + item.rent, 0);
        const totalCollected = rentRoll.filter(item => item.status === 'Paid').reduce((sum, item) => sum + item.rent, 0);
        const percentage = totalDue > 0 ? (totalCollected / totalDue) * 100 : 0;
        return {
            totalDue,
            totalCollected,
            percentage: percentage.toFixed(0) + '%'
        };
    }, [rentRoll]);

    const portfolioMetrics = React.useMemo(() => {
        let totalUnits = 0;
        let occupiedUnits = 0;
        properties.forEach(prop => {
            prop.buildings.forEach(building => {
                totalUnits += building.units.length;
                occupiedUnits += building.units.filter(u => u.status === 'Occupied').length;
            });
        });
        const occupancy = totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 100;
        const vacantCount = totalUnits - occupiedUnits;
        return { occupancy: occupancy.toFixed(1) + '%', vacantCount };
    }, [properties]);
    
    const expiringLeases = React.useMemo(() => {
        const now = new Date();
        const ninetyDaysFromNow = new Date();
        ninetyDaysFromNow.setDate(now.getDate() + 90);

        return tenants.filter(tenant => {
            if (tenant.status !== 'Active' || !tenant.leaseEndDate) return false;
            const leaseEndDate = new Date(tenant.leaseEndDate);
            return leaseEndDate > now && leaseEndDate <= ninetyDaysFromNow;
        }).map(tenant => {
            const leaseEndDate = new Date(tenant.leaseEndDate);
            const daysLeft = Math.ceil((leaseEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            return {
                tenant: tenant.name,
                unit: `${tenant.propertyName}, ${tenant.unitName}`,
                endDate: leaseEndDate.toLocaleDateString(),
                daysLeft,
                status: 'Needs Follow-up' // Mock status for now
            };
        }).sort((a, b) => a.daysLeft - b.daysLeft);
    }, [tenants]);

    const dueTenants = React.useMemo(() => {
        return rentRoll
            .filter(item => item.status === 'Overdue' || item.status === 'Upcoming')
            .sort((a, b) => {
                if (a.status === 'Overdue' && b.status !== 'Overdue') return -1;
                if (a.status !== 'Overdue' && b.status === 'Overdue') return 1;
                return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
            })
            .slice(0, 5); // Limit to 5 for dashboard view
    }, [rentRoll]);
    
    const vacantUnits = React.useMemo(() => {
        const vacancies = [];
        properties.forEach(prop => {
            prop.buildings.forEach(building => {
                building.units.forEach(unit => {
                    if (unit.status === 'Vacant') {
                        vacancies.push({
                            ...unit,
                            propertyName: prop.name,
                            buildingName: building.name,
                        });
                    }
                });
            });
        });
        return vacancies.slice(0, 4); // Limit to a few for the dashboard view
    }, [properties]);

    const openMaintenanceCount = React.useMemo(() => maintenanceRequests.filter(r => r.status !== 'Completed').length, [maintenanceRequests]);
    const urgentMaintenanceCount = React.useMemo(() => maintenanceRequests.filter(r => r.status !== 'Completed' && (r.priority === 'Emergency' || r.priority === 'High')).length, [maintenanceRequests]);

    const urgentRequests = React.useMemo(() => {
        return maintenanceRequests.filter(req => req.priority === 'High' || req.priority === 'Emergency')
                                  .sort((a,b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime())
                                  .slice(0, 4);
    }, [maintenanceRequests]);

    return (
        <DashboardLayout navItems={MANAGER_NAV} activePath="/manager">
            <h2 className="text-3xl font-bold text-slate-800 mb-8">Dashboard</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Link to="/manager/rent-roll"><StatCard title="Rent Collected (This Month)" value={`${rentStats.totalCollected.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })} / ${rentStats.totalDue.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })}`} change={`${rentStats.percentage} Collected`} changeType="increase" icon={<DollarIcon className="text-slate-400" />} /></Link>
                <Link to="/manager/properties?filter=vacant"><StatCard title="Occupancy" value={portfolioMetrics.occupancy} change={`${portfolioMetrics.vacantCount} Vacant Units`} changeType="decrease" icon={<HomeIcon className="text-slate-400" />} /></Link>
                <Link to="/manager/maintenance?filter=open"><StatCard title="Open Maintenance" value={`${openMaintenanceCount} Open`} change={`${urgentMaintenanceCount} Urgent`} changeType="decrease" icon={<WrenchIcon className="text-slate-400" />} /></Link>
                <Link to="/manager/tenants?filter=expiring_soon"><StatCard title="Leases Expiring" value={`${expiringLeases.length} Leases`} change="in next 90 days" icon={<DocumentIcon className="text-slate-400" />} /></Link>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Row 1 */}
                <div className="xl:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="text-lg font-semibold text-slate-800">Upcoming Lease Expirations</h3>
                      <Link to="/manager/tenants?filter=expiring_soon" className="text-sm font-semibold text-blue-600 hover:underline">View All</Link>
                    </div>
                    <p className="text-sm text-slate-500 mb-4">Tenants with leases ending in the next 90 days.</p>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-xs text-slate-500 uppercase border-b border-slate-200">
                                <th className="py-3">Tenant</th>
                                <th className="py-3">Unit</th>
                                <th className="py-3">Lease End</th>
                                <th className="py-3">Days Left</th>
                                <th className="py-3">Status</th>
                                <th className="py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expiringLeases.slice(0, 3).map(lease => (
                                <tr key={lease.tenant} className="border-b border-slate-200 text-sm last:border-b-0">
                                    <td className="py-3 font-medium text-slate-800">{lease.tenant}</td>
                                    <td className="py-3 text-slate-600">{lease.unit}</td>
                                    <td className="py-3 text-slate-600">{lease.endDate}</td>
                                    <td className="py-3 text-slate-600">{lease.daysLeft}</td>
                                    <td className="py-3">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLeaseStatusBadge(lease.status)}`}>
                                            {lease.status}
                                        </span>
                                    </td>
                                    <td className="py-3 text-right">
                                        <button className="text-xs font-semibold text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-md">
                                            {lease.status === 'Renewal Sent' ? 'View Renewal' : 'Prepare Renewal'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="xl:col-span-1 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-slate-800">Recent Vacancies</h3>
                        <Link to="/manager/properties?filter=vacant" className="text-sm font-semibold text-blue-600 hover:underline">View All</Link>
                    </div>
                    {vacantUnits.length > 0 ? (
                        <ul className="space-y-3">
                            {vacantUnits.map((unit, index) => (
                                <li key={`${unit.propertyName}-${unit.name}-${index}`} className="p-3 bg-slate-50 rounded-md border border-slate-200">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800">{unit.name}, {unit.buildingName}</p>
                                            <p className="text-xs text-slate-500">{unit.propertyName}</p>
                                        </div>
                                        <p className="text-sm font-medium text-slate-700">${unit.rent.toLocaleString()}/mo</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-slate-500 text-center py-4">No vacant units.</p>
                    )}
                </div>

                {/* Row 2 */}
                <div className="xl:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                     <div className="flex justify-between items-center mb-1">
                        <h3 className="text-lg font-semibold text-slate-800">Overdue & Upcoming Rent</h3>
                         <Link to="/manager/rent-roll" className="text-sm font-semibold text-blue-600 hover:underline">View All</Link>
                    </div>
                    <p className="text-sm text-slate-500 mb-4">Track tenant balances and follow up before rent becomes overdue.</p>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-xs text-slate-500 uppercase border-b border-slate-200">
                                <th className="py-3">Tenant</th>
                                <th className="py-3">Unit</th>
                                <th className="py-3">Amount</th>
                                <th className="py-3">Due Date</th>
                                <th className="py-3">Status</th>
                                <th className="py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dueTenants.map(item => (
                                <tr key={item.id} className="border-b border-slate-200 text-sm last:border-b-0">
                                    <td className="py-3 font-medium text-slate-800">{item.tenantName}</td>
                                    <td className="py-3 text-slate-600">{item.unitName}</td>
                                    <td className="py-3 text-slate-600">${item.rent.toLocaleString()}</td>
                                    <td className="py-3 text-slate-600">{new Date(item.dueDate).toLocaleDateString()}</td>
                                    <td className="py-3">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="py-3 text-right">
                                        {item.status === 'Overdue' && <button className="text-xs font-semibold text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md">Send Reminder</button>}
                                        {item.status === 'Upcoming' && <Link to="/manager/rent-roll" className="text-xs font-semibold text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-md">Log Payment</Link>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="xl:col-span-1 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-slate-800">Urgent Maintenance Requests</h3>
                        <Link to="/manager/maintenance?filter=urgent" className="text-sm font-semibold text-blue-600 hover:underline">View All</Link>
                    </div>
                    <ul className="space-y-4">
                        {urgentRequests.map(req => (
                            <li key={req.id} className="p-3 bg-slate-50 rounded-md border border-slate-200">
                                <div className="flex justify-between items-start mb-1">
                                    <p className="text-sm font-semibold text-slate-800">{req.tenant} <span className="text-slate-500 font-normal">({req.unit})</span></p>
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getPriorityBadge(req.priority)}`}>{req.priority}</span>
                                </div>
                                <p className="text-sm text-slate-600">{req.issue}</p>
                                <p className="text-xs text-slate-400 mt-2">{new Date(req.submittedDate).toLocaleDateString()}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default PropertyManagerDashboard;