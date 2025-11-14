import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import type { NavItem } from '../../types';

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  activePath: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, navItems, activePath }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} showNotifications={true} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar navItems={navItems} activePath={activePath} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto bg-slate-50 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;