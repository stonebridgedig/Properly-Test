
import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'increase' | 'decrease';
  children?: React.ReactNode;
  icon?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, changeType, children, icon }) => {
  const changeColor = changeType === 'increase' ? 'text-green-500' : 'text-red-500';

  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200 flex flex-col justify-between h-full transition-shadow hover:shadow-md">
        <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-slate-500">{title}</h4>
            {icon}
        </div>
      <div className="mt-2">
        <p className="text-3xl font-bold text-slate-800">{value}</p>
        {change && (
          <p className={`text-sm font-medium ${changeColor}`}>
            {change}
          </p>
        )}
      </div>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
};

export default StatCard;