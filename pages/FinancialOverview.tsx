
import React, { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Sector } from 'recharts';
import DashboardLayout from '../components/layout/DashboardLayout';
import StatCard from '../components/dashboard/StatCard';
import { MANAGER_NAV } from '../constants';
import { DollarIcon, DownloadIcon, CalendarIcon, UserCircleIcon, BuildingIcon, ChevronDownIcon } from '../components/Icons';
import type { FinancialBreakdownItem, Transaction } from '../types';
import { useData } from '../contexts/DataContext';

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

const getPeriodDates = (period: string): { start: Date, end: Date, prevStart: Date, prevEnd: Date } => {
    const now = new Date();
    let start: Date, end: Date, prevStart: Date, prevEnd: Date;

    switch (period) {
        case 'last_30_days':
            end = new Date(now);
            start = new Date(now);
            start.setDate(now.getDate() - 30);
            prevEnd = new Date(start);
            prevStart = new Date(start);
            prevStart.setDate(start.getDate() - 30);
            break;
        case 'this_quarter':
            const quarter = Math.floor(now.getMonth() / 3);
            start = new Date(now.getFullYear(), quarter * 3, 1);
            end = new Date(start.getFullYear(), start.getMonth() + 3, 0);
            const prevQuarter = quarter === 0 ? 3 : quarter - 1;
            const prevQuarterYear = quarter === 0 ? now.getFullYear() - 1 : now.getFullYear();
            prevStart = new Date(prevQuarterYear, prevQuarter * 3, 1);
            prevEnd = new Date(prevStart.getFullYear(), prevStart.getMonth() + 3, 0);
            break;
        case 'last_quarter':
            const currentQuarter = Math.floor(now.getMonth() / 3);
            const lastQuarter = currentQuarter === 0 ? 3 : currentQuarter - 1;
            const yearOfLastQuarter = currentQuarter === 0 ? now.getFullYear() - 1 : now.getFullYear();
            start = new Date(yearOfLastQuarter, lastQuarter * 3, 1);
            end = new Date(start.getFullYear(), start.getMonth() + 3, 0);
            
            const twoQuartersAgo = lastQuarter === 0 ? 3 : lastQuarter - 1;
            const yearOfTwoQuartersAgo = lastQuarter === 0 ? yearOfLastQuarter - 1 : yearOfLastQuarter;
            prevStart = new Date(yearOfTwoQuartersAgo, twoQuartersAgo * 3, 1);
            prevEnd = new Date(prevStart.getFullYear(), prevStart.getMonth() + 3, 0);
            break;
        case 'last_year':
            start = new Date(now.getFullYear() - 1, 0, 1);
            end = new Date(now.getFullYear() - 1, 11, 31);
            prevStart = new Date(now.getFullYear() - 2, 0, 1);
            prevEnd = new Date(now.getFullYear() - 2, 11, 31);
            break;
        case 'this_year':
        default:
            start = new Date(now.getFullYear(), 0, 1);
            end = now;
            prevStart = new Date(now.getFullYear() - 1, 0, 1);
            prevEnd = new Date(now.getFullYear() - 1, 11, 31);
            break;
    }
    return { start, end, prevStart, prevEnd };
};

const FinancialOverview: React.FC = () => {
    const { transactions, properties, owners, integrations } = useData();
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: string } | null>({ key: 'noi', direction: 'descending' });
    const [dateRange, setDateRange] = useState('this_year');
    const [selectedOwner, setSelectedOwner] = useState('all');
    const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
    
    const { start, end, prevStart, prevEnd } = getPeriodDates(dateRange);

    const isQuickBooksConnected = useMemo(() => integrations.find(i => i.name === 'QuickBooks')?.connected, [integrations]);

    const filterTransactionsByDate = (txns: Transaction[], startDate: Date, endDate: Date) => {
        return txns.filter(t => {
            const tDate = new Date(t.date);
            return tDate >= startDate && tDate <= endDate;
        });
    }

    const filteredTransactions = useMemo(() => {
        return filterTransactionsByDate(transactions, start, end).filter(t => 
            (selectedOwner === 'all' || t.owner === selectedOwner) &&
            (selectedProperties.length === 0 || selectedProperties.includes(t.property))
        );
    }, [transactions, start, end, selectedOwner, selectedProperties]);
    
    const prevPeriodTransactions = useMemo(() => {
        return filterTransactionsByDate(transactions, prevStart, prevEnd).filter(t => 
            (selectedOwner === 'all' || t.owner === selectedOwner) &&
            (selectedProperties.length === 0 || selectedProperties.includes(t.property))
        );
    }, [transactions, prevStart, prevEnd, selectedOwner, selectedProperties]);

    const calculateStats = (txns: Transaction[]) => {
        const totalRevenue = txns.filter(t => t.category === 'Income').reduce((sum, t) => sum + t.amount, 0);
        const totalExpenses = txns.filter(t => t.category === 'Expense').reduce((sum, t) => sum + t.amount, 0);
        const noi = totalRevenue - totalExpenses;
        const profitMargin = totalRevenue > 0 ? (noi / totalRevenue) * 100 : 0;
        return { totalRevenue, totalExpenses, noi, profitMargin };
    };

    const summaryStats = useMemo(() => calculateStats(filteredTransactions), [filteredTransactions]);
    const prevSummaryStats = useMemo(() => calculateStats(prevPeriodTransactions), [prevPeriodTransactions]);

    const getComparisonText = (current: number, previous: number) => {
        if (previous === 0) return 'vs N/A';
        const change = ((current - previous) / Math.abs(previous)) * 100;
        return `${change >= 0 ? '+' : ''}${change.toFixed(1)}% vs prev. period`;
    };

    const monthlyChartData = useMemo(() => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthlyData = months.map(m => ({ name: m, Income: 0, Expenses: 0 }));
        filteredTransactions.forEach(t => {
            const monthIndex = new Date(t.date).getMonth();
            if (t.category === 'Income') monthlyData[monthIndex].Income += t.amount;
            else monthlyData[monthIndex].Expenses += t.amount;
        });
        return monthlyData;
    }, [filteredTransactions]);
    
    const incomeBreakdown = useMemo(() => {
        const breakdown = filteredTransactions.filter(t => t.category === 'Income')
            .reduce((acc, t) => {
                acc[t.type] = (acc[t.type] || 0) + t.amount;
                return acc;
            }, {} as Record<string, number>);
        
        const colors = { 'Rent': '#10b981', 'Late Fee': '#3b82f6', 'Parking': '#8b5cf6', 'Other': '#f59e0b'};
        return Object.entries(breakdown).map(([name, value]) => ({ name, value, color: colors[name as keyof typeof colors] || '#6b7280' }));
    }, [filteredTransactions]);

    const expenseBreakdown = useMemo(() => {
        const breakdown = filteredTransactions.filter(t => t.category === 'Expense')
            .reduce((acc, t) => {
                acc[t.type] = (acc[t.type] || 0) + t.amount;
                return acc;
            }, {} as Record<string, number>);
        
        const colors = { 'Maintenance': '#ef4444', 'Taxes': '#f97316', 'Utilities': '#f59e0b', 'Management Fee': '#6b7280', 'Insurance': '#3b82f6', 'Other': '#8b5cf6' };
        return Object.entries(breakdown).map(([name, value]) => ({ name, value, color: colors[name as keyof typeof colors] || '#d1d5db' }));
    }, [filteredTransactions]);

    const propertyFinancials = useMemo(() => {
        const financials: {[key: string]: {revenue: number, expenses: number}} = {};
        filteredTransactions.forEach(t => {
            if (!financials[t.property]) financials[t.property] = { revenue: 0, expenses: 0 };
            if (t.category === 'Income') financials[t.property].revenue += t.amount;
            else financials[t.property].expenses += t.amount;
        });
        return Object.entries(financials).map(([name, {revenue, expenses}]) => ({
            name, revenue, expenses, noi: revenue - expenses, margin: revenue > 0 ? ((revenue - expenses) / revenue) * 100 : 0
        }));
    }, [filteredTransactions]);

     const sortedProperties = useMemo(() => {
        let sortableItems = [...propertyFinancials];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key as keyof typeof a] < b[sortConfig.key as keyof typeof b]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key as keyof typeof a] > b[sortConfig.key as keyof typeof b]) {
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

    const exportTransactionsToCSV = () => {
        const headers = ['Date', 'Description', 'Property', 'Category', 'Type', 'Amount'];
        const csvRows = [
            headers.join(','),
            ...filteredTransactions.map(t => [
                new Date(t.date).toLocaleDateString(),
                `"${t.description.replace(/"/g, '""')}"`,
                t.property,
                t.category,
                t.type,
                (t.category === 'Income' ? 1 : -1) * t.amount
            ].join(','))
        ];
        
        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'quickbooks_export.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <DashboardLayout navItems={MANAGER_NAV} activePath="/manager/financial-overview">
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Financial Overview</h2>
                    <p className="text-slate-500 mt-1">Analyze and report on your portfolio's financial performance.</p>
                </div>
            </div>
            
            <div className="my-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Date Range */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CalendarIcon className="w-5 h-5 text-slate-400" />
                    </div>
                    <select 
                        value={dateRange} 
                        onChange={e => setDateRange(e.target.value)} 
                        className="w-full appearance-none bg-white border border-slate-200 text-slate-700 text-base rounded-xl pl-10 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:border-slate-300 transition-all cursor-pointer"
                    >
                        <option value="this_year">This Year</option>
                        <option value="last_year">Last Year</option>
                        <option value="this_quarter">This Quarter</option>
                        <option value="last_quarter">Last Quarter</option>
                        <option value="last_30_days">Last 30 Days</option>
                    </select>
                     <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <ChevronDownIcon className="w-4 h-4 text-slate-400" />
                    </div>
                </div>

                {/* Owner Filter */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                         <UserCircleIcon className="w-5 h-5 text-slate-400" />
                    </div>
                    <select 
                        value={selectedOwner} 
                        onChange={e => setSelectedOwner(e.target.value)} 
                        className="w-full appearance-none bg-white border border-slate-200 text-slate-700 text-base rounded-xl pl-10 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:border-slate-300 transition-all cursor-pointer"
                    >
                        <option value="all">All Owners</option>
                        {owners.map(o => <option key={o.id} value={o.name}>{o.name}</option>)}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <ChevronDownIcon className="w-4 h-4 text-slate-400" />
                    </div>
                </div>

                {/* Property Filter */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <BuildingIcon className="w-5 h-5 text-slate-400" />
                    </div>
                    <select 
                        value={selectedProperties[0] || 'all'} 
                        onChange={e => setSelectedProperties(e.target.value === 'all' ? [] : [e.target.value])} 
                        className="w-full appearance-none bg-white border border-slate-200 text-slate-700 text-base rounded-xl pl-10 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:border-slate-300 transition-all cursor-pointer"
                    >
                        <option value="all">All Properties</option>
                        {properties.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <ChevronDownIcon className="w-4 h-4 text-slate-400" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Revenue" value={formatCurrency(summaryStats.totalRevenue)} change={getComparisonText(summaryStats.totalRevenue, prevSummaryStats.totalRevenue)} changeType={summaryStats.totalRevenue >= prevSummaryStats.totalRevenue ? 'increase' : 'decrease'} icon={<DollarIcon className="text-green-500" />} />
                <StatCard title="Total Expenses" value={formatCurrency(summaryStats.totalExpenses)} change={getComparisonText(summaryStats.totalExpenses, prevSummaryStats.totalExpenses)} changeType={summaryStats.totalExpenses <= prevSummaryStats.totalExpenses ? 'increase' : 'decrease'} icon={<DollarIcon className="text-red-500" />} />
                <StatCard title="Net Operating Income" value={formatCurrency(summaryStats.noi)} change={getComparisonText(summaryStats.noi, prevSummaryStats.noi)} changeType={summaryStats.noi >= prevSummaryStats.noi ? 'increase' : 'decrease'} icon={<DollarIcon className="text-blue-500" />} />
                <StatCard title="Profit Margin" value={`${summaryStats.profitMargin.toFixed(1)}%`} change={getComparisonText(summaryStats.profitMargin, prevSummaryStats.profitMargin)} changeType={summaryStats.profitMargin >= prevSummaryStats.profitMargin ? 'increase' : 'decrease'} icon={<DollarIcon className="text-slate-400" />} />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 mb-8">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Income vs. Expenses</h3>
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

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-8">
                <h3 className="text-lg font-semibold text-slate-800 p-6">Property Performance</h3>
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-t border-slate-200">
                        <tr className="text-xs text-slate-500 uppercase font-semibold">
                            <th className="px-6 py-3">Property</th>
                            <th className="px-6 py-3"><button onClick={() => requestSort('revenue')}>Revenue</button></th>
                            <th className="px-6 py-3"><button onClick={() => requestSort('expenses')}>Expenses</button></th>
                            <th className="px-6 py-3"><button onClick={() => requestSort('noi')}>NOI</button></th>
                            <th className="px-6 py-3"><button onClick={() => requestSort('margin')}>Profit Margin</button></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {sortedProperties.map(prop => (
                            <tr key={prop.name} className="hover:bg-slate-50 transition-colors text-sm">
                                <td className="px-6 py-4 font-semibold text-slate-800">{prop.name}</td>
                                <td className="px-6 py-4 text-green-600">{formatCurrency(prop.revenue)}</td>
                                <td className="px-6 py-4 text-red-600">{formatCurrency(prop.expenses)}</td>
                                <td className="px-6 py-4 font-medium text-blue-600">{formatCurrency(prop.noi)}</td>
                                <td className="px-6 py-4 font-medium">{prop.margin.toFixed(1)}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

             <div className="bg-white rounded-lg shadow-sm border border-slate-200">
                <div className="flex justify-between items-center p-6">
                    <h3 className="text-lg font-semibold text-slate-800">Recent Transactions</h3>
                    <button
                        onClick={exportTransactionsToCSV}
                        disabled={!isQuickBooksConnected}
                        className="flex items-center text-sm font-medium text-slate-600 bg-white border border-slate-300 px-3 py-1.5 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <DownloadIcon className="w-4 h-4 mr-2" /> Export for QuickBooks
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-t border-slate-200">
                            <tr className="text-xs text-slate-500 uppercase font-semibold">
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Description</th>
                                <th className="px-6 py-3">Property</th>
                                <th className="px-6 py-3">Category</th>
                                <th className="px-6 py-3 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {filteredTransactions.slice(0, 20).map(t => (
                                <tr key={t.id} className="text-sm">
                                    <td className="px-6 py-3 text-slate-600 whitespace-nowrap">{new Date(t.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-3 font-medium text-slate-800">{t.description}</td>
                                    <td className="px-6 py-3 text-slate-600">{t.property}</td>
                                    <td className="px-6 py-3">
                                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${t.category === 'Income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {t.type}
                                        </span>
                                    </td>
                                    <td className={`px-6 py-3 text-right font-semibold ${t.category === 'Income' ? 'text-green-600' : 'text-red-600'}`}>
                                        {t.category === 'Income' ? '+' : '-'}{formatCurrency(t.amount)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default FinancialOverview;
