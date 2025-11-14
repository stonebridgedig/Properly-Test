import React, { useEffect, useRef, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { WrenchIcon, DollarIcon, DocumentIcon, MessageIcon } from '../Icons';
import type { Notification } from '../../types';

interface NotificationCenterProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const NotificationIcon: React.FC<{ type: Notification['type'] }> = ({ type }) => {
    switch (type) {
        case 'maintenance': return <WrenchIcon className="w-5 h-5 text-amber-500" />;
        case 'financial': return <DollarIcon className="w-5 h-5 text-green-500" />;
        case 'lease': return <DocumentIcon className="w-5 h-5 text-blue-500" />;
        case 'message': return <MessageIcon className="w-5 h-5 text-violet-500" />;
        default: return null;
    }
};

const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return `${Math.floor(interval)}y ago`;
    interval = seconds / 2592000;
    if (interval > 1) return `${Math.floor(interval)}mo ago`;
    interval = seconds / 86400;
    if (interval > 1) return `${Math.floor(interval)}d ago`;
    interval = seconds / 3600;
    if (interval > 1) return `${Math.floor(interval)}h ago`;
    interval = seconds / 60;
    if (interval > 1) return `${Math.floor(interval)}m ago`;
    return `${Math.floor(seconds)}s ago`;
};


const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, setIsOpen }) => {
    const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useData();
    const navigate = useNavigate();
    const location = useLocation();
    const dropdown = useRef<HTMLDivElement>(null);

    const basePath = useMemo(() => {
        if (location.pathname.startsWith('/manager')) return '/manager';
        if (location.pathname.startsWith('/owner')) return '/owner';
        if (location.pathname.startsWith('/tenant')) return '/tenant';
        return '/';
    }, [location.pathname]);

    useEffect(() => {
        const clickHandler = ({ target }: MouseEvent) => {
            if (!isOpen || dropdown.current?.contains(target as Node)) return;
            setIsOpen(false);
        };
        document.addEventListener('click', clickHandler);
        return () => document.removeEventListener('click', clickHandler);
    });
    
    useEffect(() => {
        const keyHandler = ({ keyCode }: KeyboardEvent) => {
            if (!isOpen || keyCode !== 27) return;
            setIsOpen(false);
        };
        document.addEventListener('keydown', keyHandler);
        return () => document.removeEventListener('keydown', keyHandler);
    });

    const handleNotificationClick = (notification: Notification) => {
        markNotificationAsRead(notification.id);
        setIsOpen(false);
        if (notification.link) {
            navigate(notification.link);
        }
    };

    const unreadCount = useMemo(() => notifications.filter(n => !n.isRead).length, [notifications]);

    return (
        <div
            ref={dropdown}
            className={`origin-top-right absolute top-full right-0 w-80 sm:w-96 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden mt-1 z-50 transition-all duration-200 ease-in-out ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
        >
            <div className="text-xs font-semibold text-slate-400 uppercase pt-1.5 pb-2 px-4 flex justify-between items-center">
                <span>Notifications</span>
                {unreadCount > 0 && <button onClick={() => markAllNotificationsAsRead()} className="text-blue-500 hover:underline text-xs font-semibold">Mark all as read</button>}
            </div>
            <ul className="max-h-80 overflow-y-auto">
                 {notifications.map(notification => (
                    <li key={notification.id} className={`border-b border-slate-200 last:border-0 ${!notification.isRead ? 'bg-slate-50' : ''}`}>
                        <button className="w-full text-left py-3 px-4 transition-colors hover:bg-slate-100" onClick={() => handleNotificationClick(notification)}>
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                                    <NotificationIcon type={notification.type} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-slate-700 leading-snug">{notification.text}</p>
                                    <p className="text-xs text-slate-500 mt-1">{timeAgo(notification.timestamp)}</p>
                                </div>
                            </div>
                        </button>
                    </li>
                 ))}
                 {notifications.length === 0 && <li className="p-4 text-sm text-slate-500 text-center">No new notifications.</li>}
            </ul>
             <div className="border-t border-slate-200 text-center py-2">
                <Link
                    to={`${basePath}/notifications`}
                    onClick={() => setIsOpen(false)}
                    className="text-sm font-semibold text-blue-600 hover:underline"
                >
                    View all notifications
                </Link>
            </div>
        </div>
    );
};

export default NotificationCenter;