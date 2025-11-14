import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { SearchIcon, Bars3Icon, BellIcon, UserCircleIcon } from '../Icons';
import NotificationCenter from './NotificationCenter';
import { useData } from '../../contexts/DataContext';

const NotificationBell: React.FC = () => {
  const { notifications } = useData();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const unreadCount = useMemo(() => notifications.filter(n => !n.isRead).length, [notifications]);

  return (
    <div className="relative">
      <button
        className="text-slate-500 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100"
        onClick={(e) => { e.stopPropagation(); setIsNotificationOpen(!isNotificationOpen); }}
        aria-haspopup="true"
        aria-expanded={isNotificationOpen}
      >
        <span className="sr-only">Notifications</span>
        <BellIcon className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>
      <NotificationCenter isOpen={isNotificationOpen} setIsOpen={setIsNotificationOpen} />
    </div>
  );
};

interface HeaderProps {
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
  showNotifications?: boolean;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen, showNotifications = false }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 -mb-px">
          <div className="flex items-center space-x-4">
            {/* Hamburger button */}
            {setSidebarOpen && (
              <button
                className="text-slate-500 hover:text-slate-600 lg:hidden"
                aria-controls="sidebar"
                aria-expanded={sidebarOpen}
                onClick={(e) => { e.stopPropagation(); setSidebarOpen(!sidebarOpen); }}
              >
                <span className="sr-only">Open sidebar</span>
                <Bars3Icon className="w-6 h-6 fill-current" />
              </button>
            )}
            <Link to="/">
              <h1 className="text-2xl font-bold text-slate-800">Properly</h1>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative hidden sm:block">
              <label htmlFor="header-search" className="sr-only">Search</label>
              <input 
                id="header-search" 
                className="form-input w-full pl-9 bg-white border-slate-300 focus:bg-white focus:border-blue-500" 
                type="search" 
                placeholder="Search anything..." 
              />
              <div className="absolute inset-y-0 left-0 flex items-center justify-center pl-3">
                <SearchIcon className="w-4 h-4 text-slate-400" />
              </div>
            </div>
            
            {showNotifications && <NotificationBell />}

            <div className="relative">
                <button className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                    <UserCircleIcon className="w-7 h-7 text-slate-500" />
                </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;