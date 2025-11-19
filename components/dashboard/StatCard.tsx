
import React from 'react';
import { ArrowPathIcon } from '../Icons';

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
  children?: React.ReactNode;
  icon?: React.ReactNode;
  iconColorClass?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, changeType, children, icon, iconColorClass = 'bg-blue-50 text-blue-600' }) => {
  let changeColor = 'text-slate-500';
  if (changeType === 'increase') changeColor = 'text-green-600';
  if (changeType === 'decrease') changeColor = 'text-red-600';

  return (
    <div className="bg-white p-5 rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 flex flex-col justify-between h-full transition-all duration-200 hover:shadow-md hover:border-slate-200 group">
        <div className="flex items-start justify-between mb-4">
            <div>
                 <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{title}</h4>
                 <p className="text-2xl font-bold text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">{value}</p>
            </div>
            {icon && (
                <div className={`p-2.5 rounded-lg ${iconColorClass} transition-colors`}>
                    {icon}
                </div>
            )}
        </div>
      
      {(change || children) && (
        <div className="mt-auto pt-2">
            {change && (
            <div className="flex items-center text-sm font-medium">
                {changeType === 'increase' && <span className="text-green-500 mr-1">↑</span>}
                {changeType === 'decrease' && <span className="text-red-500 mr-1">↓</span>}
                <p className={`${changeColor}`}>{change}</p>
            </div>
            )}
            {children}
        </div>
      )}
    </div>
  );
};

export default StatCard;
