

import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import StatCard from '../components/dashboard/StatCard';
import { TENANT_NAV, allTenants } from '../constants';
import { DollarIcon, WrenchIcon, MessageIcon } from '../components/Icons';
import { useData } from '../contexts/DataContext';

// Hardcode the tenant for this view
const currentTenant = allTenants.find(t => t.name === 'Sophia Nguyen');

const TenantDashboard: React.FC = () => {
    const { maintenanceRequests } = useData();
    
    const openMaintenanceCount = React.useMemo(() => {
        if (!currentTenant) return 0;
        return maintenanceRequests.filter(req => req.tenant === currentTenant.name && req.status !== 'Completed').length;
    }, [maintenanceRequests]);

    const announcements = [
        {
            title: "Community BBQ and Pool Party!",
            content: "Join us this Saturday at the main pool area! Food and drinks will be provided. We can't wait to see you there!",
            tag: "Community Event",
            tagColor: "bg-green-100 text-green-700",
        },
        {
            title: "Water Shutoff for Scheduled Maintenance",
            content: "Please be advised that the water will be shut off for all units in The Grand Apartments on Friday from 10:00 AM to 1:00 PM.",
            tag: "Maintenance",
            tagColor: "bg-blue-100 text-blue-700",
        }
    ]

  return (
    <DashboardLayout navItems={TENANT_NAV} activePath="/tenant">
      <h2 className="text-3xl font-bold text-slate-800 mb-2">Dashboard</h2>
      <p className="text-slate-500 mb-8">Welcome, {currentTenant?.name || 'Tenant'}!</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Rent Due" value="$0.00" change="No Dues" icon={<DollarIcon className="text-slate-400"/>}>
            <Link to="/tenant/payments" className="block w-full text-center px-4 py-2 mt-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                Make a Payment
            </Link>
        </StatCard>
        <StatCard title="Maintenance" value={String(openMaintenanceCount)} change="Open Requests" icon={<WrenchIcon className="text-slate-400"/>}>
            <Link to="/tenant/maintenance" className="block w-full text-center px-4 py-2 mt-2 bg-white text-slate-700 font-semibold rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors">
                Manage Requests
            </Link>
        </StatCard>
        <StatCard title="Messages" value="0" change="Unread Messages" icon={<MessageIcon className="text-slate-400"/>}>
            <Link to="/tenant/messages" className="block w-full text-center px-4 py-2 mt-2 bg-white text-slate-700 font-semibold rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors">
                View Messages
            </Link>
        </StatCard>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Announcements</h3>
        <div className="space-y-4">
            {announcements.map((ann, index) => (
                <div key={index} className="p-4 border-l-4 border-blue-500 bg-slate-50 rounded-r-md">
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="font-bold text-slate-800">{ann.title}</h4>
                            <p className="text-sm text-slate-600 mt-1">{ann.content}</p>
                        </div>
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${ann.tagColor}`}>{ann.tag}</span>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TenantDashboard;