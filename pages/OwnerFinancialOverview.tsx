import React, { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Sector } from 'recharts';
import DashboardLayout from '../components/layout/DashboardLayout';
import StatCard from '../components/dashboard/StatCard';
import { OWNER_NAV } from '../constants';
import { DollarIcon } from '../components/Icons';
import type { FinancialBreakdownItem, Transaction } from '../types';
import { useData } from '../contexts/DataContext';

const currentOwner = 'Greenleaf Investments';

// Helper function to format large numbers
const formatCurrency = (value: number) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
const formatYAxis = (tickItem: number) => tickItem >= 1000 ? `$${(tickItem / 1000)}k` : `$${tickItem}`;

// Donut Chart Custom Active Label
const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props;

  return (
    <g>
      <text x={cx} y={cy - 10} textAnchor="middle" fill="#334155" fontSize="14px">
        {payload.name}
      </text>
       <text x={cx} y={cy + 10} textAnchor="middle" fill={fill} fontSize="16px" fontWeight="bold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

const BreakdownChart: React.FC<{ data: FinancialBreakdownItem[], title: string }> = ({ data, title }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    const onPieEnter = (_: any, index: number) => {
        setActiveIndex(index);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">{title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                activeIndex={activeIndex}
                                activeShape={renderActiveShape}
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                onMouseEnter={onPieEnter}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div>
                    <ul className="space-y-2">
                        {data.map((item, index) => (
                            <li key={index} className="flex items-center justify-between text-sm">
                                <div className="flex items-center">
                                    <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                                    <span className="text-slate-600">{item.name}</span>
                                </div>
                                <span className="font-medium text-slate-800">{formatCurrency(item.value)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};


const OwnerFinancialOverview: React.FC = () => {
    const { transactions, properties } = useData();
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: string } | null>({ key: 'noi', direction: 'descending' });

    const ownerProperties = useMemo(() => properties.filter(p => p.owner === currentOwner), [properties]);

    const ownerTransactions = useMemo(() => {
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        return transactions.filter(t => 
            t.owner === currentOwner &&
            new Date(t.date) >= startOfYear
        );
    }, [transactions]);
    
    const summaryStats = useMemo(() => {
        const totalRevenue = ownerTransactions.filter(t => t.category === 'Income').reduce((acc, t) => acc + t.amount, 0);
        const totalExpenses = ownerTransactions.filter(t => t.category === 'Expense').reduce((acc, t) => acc + t.amount, 0);
        const noi = totalRevenue - totalExpenses;
        const profitMargin = totalRevenue > 0 ? (noi / totalRevenue) * 100 : 0;
        return { totalRevenue, totalExpenses, noi, profitMargin };
    }, [ownerTransactions]);

    const monthlyChartData = useMemo(() => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthlyData = months.map(m => ({ name: m, Income: 0, Expenses: 0 }));
        ownerTransactions.forEach(t => {
            const monthIndex = new Date(t.date).getMonth();
            if (t.category === 'Income') monthlyData[monthIndex].Income += t.amount;
            else monthlyData[monthIndex].Expenses += t.amount;
        });
        return monthlyData;
    }, [ownerTransactions]);

    const incomeBreakdown = useMemo(() => {
        const breakdown = ownerTransactions.filter(t => t.category === 'Income')
            .reduce((acc, t) => {
                acc[t.type] = (acc[t.type] || 0) + t.amount;
                return acc;
            }, {} as Record<string, number>);
        
        const colors = { 'Rent': '#10b981', 'Late Fee': '#3b82f6', 'Parking': '#8b5cf6', 'Other': '#f59e0b'};
        return Object.entries(breakdown).map(([name, value]) => ({ name, value, color: colors[name as keyof typeof colors] || '#6b7280' }));
    }, [ownerTransactions]);

    const expenseBreakdown = useMemo(() => {
        const breakdown = ownerTransactions.filter(t => t.category === 'Expense')
            .reduce((acc, t) => {
                acc[t.type] = (acc[t.type] || 0) + t.amount;
                return acc;
            }, {} as Record<string, number>);
        
        const colors = { 'Maintenance': '#ef4444', 'Taxes': '#f97316', 'Utilities': '#f59e0b', 'Management Fee': '#6b7280', 'Insurance': '#3b82f6', 'Other': '#8b5cf6' };
        return Object.entries(breakdown).map(([name, value]) => ({ name, value, color: colors[name as keyof typeof colors] || '#d1d5db' }));
    }, [ownerTransactions]);

    const propertyFinancials = useMemo(() => {
        const financials: {[key: string]: {revenue: number, expenses: number}} = {};
        ownerTransactions.forEach(t => {
            if (!financials[t.property]) financials[t.property] = { revenue: 0, expenses: 0 };
            if (t.category === 'Income') financials[t.property].revenue += t.amount;
            else financials[t.property].expenses += t.amount;
        });
        return Object.entries(financials).map(([name, {revenue, expenses}]) => ({
            name, revenue, expenses, noi: revenue - expenses,
        }));
    }, [ownerTransactions]);

     const sortedProperties = useMemo(() => {
        let sortableItems = [...propertyFinancials];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [propertyFinancials, sortConfig]);

    const requestSort = (key: string) => {
        let direction = 'descending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'descending') {
            direction = 'ascending';
        }
        setSortConfig({ key, direction });
    };

    return (
        <DashboardLayout navItems={OWNER_NAV} activePath="/owner/financial-overview">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Financial Overview</h2>
            <p className="text-slate-500 mb-8">An annual summary of your portfolio's financial performance.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Revenue (YTD)" value={formatCurrency(summaryStats.totalRevenue)} icon={<DollarIcon className="text-green-500" />} />
                <StatCard title="Total Expenses (YTD)" value={formatCurrency(summaryStats.totalExpenses)} icon={<DollarIcon className="text-red-500" />} />
                <StatCard title="Net Operating Income (YTD)" value={formatCurrency(summaryStats.noi)} icon={<DollarIcon className="text-blue-500" />} />
                <StatCard title="Profit Margin" value={`${summaryStats.profitMargin.toFixed(1)}%`} icon={<DollarIcon className="text-slate-400" />} />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 mb-8">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Income vs. Expenses (YTD)</h3>
                <div style={{ width: '100%', height: 350 }}>
                    <ResponsiveContainer>
                        <LineChart data={monthlyChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} style={{fontSize: '12px'}}/>
                            <YAxis axisLine={false} tickLine={false} tickFormatter={formatYAxis} style={{fontSize: '12px'}}/>
                            <Tooltip formatter={(value) => formatCurrency(value as number)} />
                            <Legend iconType="circle" iconSize={8} />
                            <Line type="monotone" dataKey="Income" stroke="#10b981" strokeWidth={2} activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="Expenses" stroke="#ef4444" strokeWidth={2} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <BreakdownChart data={incomeBreakdown} title="Income Sources Breakdown" />
                <BreakdownChart data={expenseBreakdown} title="Expense Categories Breakdown" />
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 p-6">Property Performance (YTD)</h3>
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-t border-slate-200">
                        <tr className="text-xs text-slate-500 uppercase font-semibold">
                            <th className="px-6 py-3">Property</th>
                            <th className="px-6 py-3">Revenue</th>
                            <th className="px-6 py-3">Expenses</th>
                            <th className="px-6 py-3">NOI</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {sortedProperties.map(prop => (
                            <tr key={prop.name} className="hover:bg-slate-50 transition-colors text-sm">
                                <td className="px-6 py-4 font-semibold text-slate-800">{prop.name}</td>
                                <td className="px-6 py-4 text-green-600">{formatCurrency(prop.revenue)}</td>
                                <td className="px-6 py-4 text-red-600">{formatCurrency(prop.expenses)}</td>
                                <td className="px-6 py-4 font-medium text-blue-600">{formatCurrency(prop.noi)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
};

export default OwnerFinancialOverview;