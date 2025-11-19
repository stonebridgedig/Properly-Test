
import React, { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SearchIcon, Bars3Icon, BellIcon, ChevronRightIcon } from '../Icons';
import NotificationCenter from './NotificationCenter';
import { useData } from '../../contexts/DataContext';

const NotificationBell: React.FC = () => {
  const { notifications } = useData();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const unreadCount = useMemo(() => notifications.filter(n => !n.isRead).length, [notifications]);

  return (
    <div className="relative">
      <button
        className="text-slate-500 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition-colors relative"
        onClick={(e) => { e.stopPropagation(); setIsNotificationOpen(!isNotificationOpen); }}
        aria-haspopup="true"
        aria-expanded={isNotificationOpen}
      >
        <span className="sr-only">Notifications</span>
        <BellIcon className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold leading-none text-white bg-red-500 rounded-full border-2 border-white">
            {unreadCount}
          </span>
        )}
      </button>
      <NotificationCenter isOpen={isNotificationOpen} setIsOpen={setIsNotificationOpen} />
    </div>
  );
};

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const { tenants } = useData();
  
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) return null;

  return (
    <nav className="hidden md:flex items-center text-sm text-slate-500 ml-6 pl-6 border-l border-slate-200 h-8">
      <ol className="flex items-center space-x-2">
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          
          let name = value.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
          
          // Custom Mappings
          if (index === 0) {
             if (['manager', 'owner', 'tenant'].includes(value)) name = 'Dashboard';
          }

          // Resolve Tenant ID for screening page
          if (pathnames[index - 1] === 'tenants' && (value.startsWith('t') || value.startsWith('id'))) {
              const tenant = tenants.find(t => t.id === value);
              if (tenant) name = tenant.name;
          }

          return (
            <React.Fragment key={to}>
              {index > 0 && <ChevronRightIcon className="w-4 h-4 text-slate-300" />}
              <li>
                {isLast ? (
                  <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">{name}</span>
                ) : (
                  <Link to={to} className="hover:text-blue-600 transition-colors hover:bg-slate-50 px-2 py-0.5 rounded-md">
                    {name}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

interface HeaderProps {
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
  showNotifications?: boolean;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen, showNotifications = false }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 h-16">
      <div className="px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center">
            {/* Hamburger button */}
            {setSidebarOpen && (
              <button
                className="text-slate-500 hover:text-slate-600 lg:hidden p-2 mr-2 -ml-2 rounded-md hover:bg-slate-100"
                aria-controls="sidebar"
                aria-expanded={sidebarOpen}
                onClick={(e) => { e.stopPropagation(); setSidebarOpen(!sidebarOpen); }}
              >
                <span className="sr-only">Open sidebar</span>
                <Bars3Icon className="w-6 h-6 stroke-2" />
              </button>
            )}
            <Link to="/" className="flex items-center space-x-2 group">
               <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:bg-blue-700 transition-colors">
                  P
               </div>
              <span className="text-xl font-bold text-slate-800 tracking-tight group-hover:text-slate-900 hidden sm:block">Properly</span>
            </Link>

            {/* Breadcrumbs */}
            <Breadcrumbs />
          </div>

          <div className="flex items-center space-x-2 sm:space-x-6">
            <div className="relative hidden lg:block w-64 xl:w-96">
              <button className="w-full flex items-center pl-4 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 text-sm hover:border-slate-300 hover:bg-white transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 group">
                <SearchIcon className="w-4 h-4 mr-3 text-slate-400 group-hover:text-slate-600" />
                <span className="flex-grow text-left">Search...</span>
                <kbd className="hidden xl:inline-block px-1.5 py-0.5 text-xs font-semibold text-slate-400 bg-slate-100 border border-slate-200 rounded">⌘K</kbd>
              </button>
            </div>
            
            <div className="flex items-center space-x-3 border-l border-slate-200 pl-6">
                {showNotifications && <NotificationBell />}

                <div className="relative group">
                    <button className="flex items-center space-x-2 p-1 rounded-full hover:bg-slate-100 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center border border-blue-200 text-blue-700 shadow-sm">
                            <span className="font-semibold text-sm">JM</span>
                        </div>
                    </button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
