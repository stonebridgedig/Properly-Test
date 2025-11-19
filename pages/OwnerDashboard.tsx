
import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import StatCard from '../components/dashboard/StatCard';
import { 
    OWNER_NAV, 
    allTenants
} from '../constants';
import { DollarIcon, HomeIcon, ClockIcon, CheckCircleIcon, DocumentIcon, WrenchIcon, MessageIcon } from '../components/Icons';
import { useData } from '../contexts/DataContext';

// Let's hardcode the owner for this view
const currentOwner = 'Greenleaf Investments';

const OwnerDashboard: React.FC = () => {
    const { maintenanceRequests, properties, capitalProjects, notifications } = useData();

    // 1. Filter and calculate data for the owner's portfolio
    const ownerProperties = React.useMemo(() => properties.filter(p => p.owner === currentOwner), [properties]);

    const portfolioMetrics = React.useMemo(() => {
        let totalUnits = 0;
        let occupiedUnits = 0;
        let totalRevenue = 0;

        ownerProperties.forEach(prop => {
            prop.buildings.forEach(building => {
                totalUnits += building.units.length;
                building.units.forEach(unit => {
                    if (unit.status === 'Occupied') {
                        occupiedUnits++;
                        totalRevenue += unit.rent;
                    }
                });
            });
        });

        // Mock expenses to calculate NOI
        const mockTotalExpenses = totalRevenue * 0.45 * 12; // 45% of annualized revenue
        const totalAnnualRevenue = totalRevenue * 12;
        const noi = totalAnnualRevenue - mockTotalExpenses;
        const occupancy = totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0;

        return { noi, occupancy, totalUnits, occupiedUnits };
    }, [ownerProperties]);

    const upcomingVacancies = React.useMemo(() => {
        const now = new Date();
        const ninetyDaysFromNow = new Date();
        ninetyDaysFromNow.setDate(now.getDate() + 90);

        return allTenants.filter(tenant => {
            const isOwnerTenant = ownerProperties.some(p => p.name === tenant.propertyName);
            if (!isOwnerTenant || tenant.status !== 'Active' || !tenant.leaseEndDate) return false;
            
            const leaseEndDate = new Date(tenant.leaseEndDate);
            return leaseEndDate > now && leaseEndDate <= ninetyDaysFromNow;
        }).length;
    }, [ownerProperties]);
    
    const approvalsNeeded = React.useMemo(() => {
        return capitalProjects.filter(p => 
            p.status === 'Proposed' && ownerProperties.some(op => op.name === p.property)
        ).length;
    }, [ownerProperties, capitalProjects]);

    const propertyPerformanceData = React.useMemo(() => {
        return ownerProperties.map(prop => {
            let totalUnits = 0;
            let occupiedUnits = 0;
            let monthlyRevenue = 0;

            prop.buildings.forEach(building => {
                totalUnits += building.units.length;
                building.units.forEach(unit => {
                    if (unit.status === 'Occupied') {
                        occupiedUnits++;
                        monthlyRevenue += unit.rent;
                    }
                });
            });
            
            const occupancy = totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0;
            const noiYTD = (monthlyRevenue * 12) * (1 - (0.4 + Math.random() * 0.1)); // Mock NOI

            const openMaintenance = maintenanceRequests.filter(req => 
                req.property === prop.name &&
                req.status !== 'Completed' &&
                (req.priority === 'High' || req.priority === 'Emergency')
            ).length;

            return {
                name: prop.name,
                occupancy,
                noiYTD,
                openMaintenance,
            };
        });
    }, [ownerProperties, maintenanceRequests]);

    const activeCapitalProjects = React.useMemo(() => {
        return capitalProjects.filter(p =>
            p.status !== 'Completed' && ownerProperties.some(op => op.name === p.property)
        );
    }, [ownerProperties, capitalProjects]);
    
    const timeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        
        let interval = seconds / 86400;
        if (interval > 1) {
            return Math.floor(interval) + "d ago";
        }
        interval = seconds / 3600;
        if (interval > 1) {
            return Math.floor(interval) + "h ago";
        }
        interval = seconds / 60;
        if (interval > 1) {
            return Math.floor(interval) + "m ago";
        }
        return Math.floor(seconds) + "s ago";
    };

    const recentActivity = React.useMemo(() => {
        return notifications.slice(0, 4).map(n => {
            let icon;
            switch (n.type) {
                case 'maintenance': icon = WrenchIcon; break;
                case 'financial': icon = DollarIcon; break;
                case 'lease': icon = DocumentIcon; break;
                case 'message': icon = MessageIcon; break;
                default: icon = DocumentIcon;
            }
            return {
                type: n.type,
                text: n.text,
                time: timeAgo(n.timestamp),
                icon: icon
            };
        });
    }, [notifications]);
    
    const ProgressBar = ({ progress }: { progress: number }) => {
        return (
            <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
        );
    };

    const OccupancyBar = ({ occupancy }: { occupancy: number }) => {
        let barColor = 'bg-green-500';
        if (occupancy < 90 && occupancy >= 70) {
            barColor = 'bg-amber-500';
        } else if (occupancy < 70) {
            barColor = 'bg-red-500';
        }
    
        return (
            <div className="w-full bg-slate-200 rounded-full h-1.5">
                <div className={`${barColor} h-1.5 rounded-full`} style={{ width: `${occupancy}%` }}></div>
            </div>
        );
    };

  return (
    <DashboardLayout navItems={OWNER_NAV} activePath="/owner">
      <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome, {currentOwner}!</h2>
      <p className="text-slate-500 mb-8">Here's a summary of your portfolio's performance.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link to="/owner/financial-overview">
            <StatCard title="Net Operating Income (YTD)" value={`$${portfolioMetrics.noi.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} icon={<DollarIcon className="text-slate-400" />} />
        </Link>
        <Link to="/owner/properties?filter=vacant">
            <StatCard title="Portfolio Occupancy" value={`${portfolioMetrics.occupancy.toFixed(1)}%`} change={`${portfolioMetrics.totalUnits - portfolioMetrics.occupiedUnits} Vacant Units`} icon={<HomeIcon className="text-slate-400" />} />
        </Link>
        <Link to="/owner/properties?filter=expiring_soon">
            <StatCard title="Upcoming Vacancies (90d)" value={String(upcomingVacancies)} change="Leases ending soon" icon={<ClockIcon className="text-slate-400" />} />
        </Link>
        <Link to="/owner/capital-projects?filter=proposed">
            <StatCard title="Approvals Needed" value={String(approvalsNeeded)} change="Projects awaiting review" icon={<CheckCircleIcon className="text-slate-400" />} />
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 mb-8">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Property Performance</h3>
        <table className="w-full text-left">
            <thead>
                <tr className="text-xs text-slate-500 uppercase border-b border-slate-200">
                    <th className="py-3 font-semibold">Property</th>
                    <th className="py-3 font-semibold">Occupancy</th>
                    <th className="py-3 text-center font-semibold">NOI (YTD)</th>
                    <th className="py-3 text-center font-semibold">Open Maintenance</th>
                    <th className="py-3 text-right font-semibold">Actions</th>
                </tr>
            </thead>
            <tbody>
                {propertyPerformanceData.map(prop => (
                    <tr key={prop.name} className="border-b border-slate-200 text-sm last:border-b-0 hover:bg-slate-50 transition-colors">
                        <td className="py-3 font-medium text-slate-800">{prop.name}</td>
                        <td className="py-3">
                           <div className="flex items-center space-x-3">
                                <div className="w-24">
                                    <OccupancyBar occupancy={prop.occupancy} />
                                </div>
                                <span className="font-medium text-slate-600 w-12 text-right">{prop.occupancy.toFixed(1)}%</span>
                            </div>
                        </td>
                        <td className="py-3 text-center text-slate-600">${prop.noiYTD.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                        <td className="py-3 text-center text-slate-600 font-medium">{prop.openMaintenance}</td>
                        <td className="py-3 text-right">
                            <Link to={`/owner/properties?property=${encodeURIComponent(prop.name)}`} className="text-xs font-semibold text-blue-600 hover:underline">
                                View Details
                            </Link>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Active Capital Projects</h3>
            <div className="space-y-4">
                {activeCapitalProjects.length > 0 ? activeCapitalProjects.map(project => (
                    <div key={project.name}>
                        <div className="flex justify-between items-center text-sm mb-1">
                            <p className="font-semibold text-slate-700">{project.name}</p>
                            <p className="text-slate-500">${project.cost.toLocaleString()}</p>
                        </div>
                        <ProgressBar progress={project.progress} />
                    </div>
                )) : (
                    <p className="text-sm text-slate-500 text-center py-4">No active capital projects.</p>
                )}
            </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Activity & Documents</h3>
            <ul className="space-y-4">
                {recentActivity.map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                    <li key={index} className="flex items-start space-x-3">
                        <div className="bg-slate-100 rounded-full p-2">
                            <Icon className="w-4 h-4 text-slate-500" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-700">{activity.text}</p>
                            <p className="text-xs text-slate-400">{activity.time}</p>
                        </div>
                    </li>
                    );
                })}
            </ul>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OwnerDashboard;
