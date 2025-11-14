import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import type { NavItem } from '../../types';
import { ChevronDownIcon, ChevronUpIcon } from '../Icons';

interface SidebarProps {
  navItems: NavItem[];
  activePath: string;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ navItems, activePath, sidebarOpen, setSidebarOpen }) => {
  const sidebar = useRef<HTMLElement>(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !sidebarOpen || sidebar.current.contains(target as Node)) {
        return;
      }
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });
  
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());

  // Automatically open the section containing the active link
  useEffect(() => {
    // Find the best match for the current path (to handle sub-routes)
    const activeItem = navItems
      .slice()
      .reverse()
      .find(item => activePath.startsWith(item.path));
      
    const activeSection = activeItem?.section;
    if (activeSection) {
      setOpenSections(new Set([activeSection]));
    }
  }, [activePath, navItems]);


  const handleToggleSection = (section: string) => {
    setOpenSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const sections = navItems.reduce((acc: Record<string, NavItem[]>, item) => {
    const key = item.section;
    if (acc[key]) {
      acc[key].push(item);
    } else {
      acc[key] = [item];
    }
    return acc;
  }, {} as Record<string, NavItem[]>);

  const mainItems = sections['MAIN'] || [];
  const otherSections = Object.entries(sections).filter(([section]) => section !== 'MAIN');

  const NavLink: React.FC<{item: NavItem}> = ({ item }) => {
    const Icon = item.icon;
    const isActive = item.path === activePath;
    const className = `w-full flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
      isActive
        ? 'bg-blue-600 text-white'
        : 'text-slate-600 hover:bg-slate-100'
    }`;
    return (
      <Link to={item.path} className={className} onClick={() => setSidebarOpen(false)}>
        <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-slate-500'}`} />
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Sidebar backdrop (mobile only) */}
      <div
        className={`fixed inset-0 bg-slate-900 bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
        onClick={() => setSidebarOpen(false)}
      ></div>

      <aside
        id="sidebar"
        ref={sidebar}
        className={`absolute left-0 top-0 z-40 h-full w-64 flex-shrink-0 flex flex-col transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0 bg-white border-r border-slate-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 overflow-y-auto">
          {mainItems.length > 0 && (
            <ul className="space-y-1 mb-4">
              {mainItems.map((item) => <li key={item.path}><NavLink item={item} /></li>)}
            </ul>
          )}
          <div className="space-y-2">
            {otherSections.map(([section, items]) => {
              const isOpen = openSections.has(section);
              return (
                <div key={section}>
                  <button
                    onClick={() => handleToggleSection(section)}
                    className="w-full flex justify-between items-center px-2 py-1 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider rounded-md hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <span>{section}</span>
                    {isOpen ? <ChevronUpIcon className="w-4 h-4 text-slate-500" /> : <ChevronDownIcon className="w-4 h-4 text-slate-500" />}
                  </button>
                  {isOpen && (
                    <ul className="space-y-1 mt-2 pl-2">
                      {(items as NavItem[]).map((item) => <li key={item.path}><NavLink item={item} /></li>)}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;