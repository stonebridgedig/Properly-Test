import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { MANAGER_NAV, OWNER_NAV, TENANT_NAV } from '../constants';
import { useData } from '../contexts/DataContext';
import { WrenchIcon, DollarIcon, DocumentIcon, MessageIcon } from '../components/Icons';
import type { Notification } from '../types';

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

const NotificationsPage: React.FC = () => {
    const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useData();
    const navigate = useNavigate();
    const location = useLocation();

    const { navItems, activePath } = React.useMemo(() => {
        if (location.pathname.startsWith('/manager')) {
            return { navItems: MANAGER_NAV, activePath: '/manager/notifications' };
        }
        if (location.pathname.startsWith('/owner')) {
            return { navItems: OWNER_NAV, activePath: '/owner/notifications' };
        }
        if (location.pathname.startsWith('/tenant')) {
            return { navItems: TENANT_NAV, activePath: '/tenant/notifications' };
        }
        return { navItems: [], activePath: '' }; // Fallback
    }, [location.pathname]);

    const handleNotificationClick = (notification: Notification) => {
        markNotificationAsRead(notification.id);
        if (notification.link) {
            navigate(notification.link);
        }
    };
    
    const unreadCount = React.useMemo(() => notifications.filter(n => !n.isRead).length, [notifications]);
    
    // Reverse chronological order
    const sortedNotifications = React.useMemo(() => 
        [...notifications].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()), 
        [notifications]
    );

    return (
        <DashboardLayout navItems={navItems} activePath={activePath}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-slate-800">All Notifications</h2>
                {unreadCount > 0 && (
                    <button onClick={markAllNotificationsAsRead} className="text-sm font-semibold text-blue-600 hover:underline">
                        Mark all as read
                    </button>
                )}
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200">
                <ul className="divide-y divide-slate-200">
                    {sortedNotifications.length > 0 ? (
                        sortedNotifications.map(notification => (
                            <li key={notification.id} className={!notification.isRead ? 'bg-blue-50/50' : ''}>
                                <button
                                    className="w-full text-left p-4 transition-colors hover:bg-slate-50"
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                                            <NotificationIcon type={notification.type} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-slate-800 leading-snug">{notification.text}</p>
                                            <p className="text-xs text-slate-500 mt-1">{timeAgo(notification.timestamp)}</p>
                                        </div>
                                    </div>
                                </button>
                            </li>
                        ))
                    ) : (
                        <li className="p-6 text-center text-slate-500">You have no notifications.</li>
                    )}
                </ul>
            </div>
        </DashboardLayout>
    );
};

export default NotificationsPage;