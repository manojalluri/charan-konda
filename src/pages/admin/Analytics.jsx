import React, { useState } from 'react';
import { TrendingUp, Download, Calendar, DollarSign, ShoppingCart, Users, Package } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useShop } from '../../context/ShopContext';

const Analytics = () => {
    const { orders } = useShop();
    const [dateRange, setDateRange] = useState('7days');

    // Calculate real stats
    const totalRevenue = orders.reduce((sum, o) => sum + (o.finalAmount || 0), 0);
    const totalOrders = orders.length;
    const uniqueCustomers = new Set(orders.map(o => o.userEmail || o.customer?.phone)).size;
    const totalProductsSold = orders.reduce((sum, o) => {
        return sum + o.items.reduce((iSum, item) => iSum + (parseFloat(item.quantity) || 0), 0);
    }, 0);

    // Prepare Sales Trend Data
    const getDays = dateRange === '7days' ? 7 : dateRange === '30days' ? 30 : 90;
    const salesTrend = [...Array(getDays)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

        const dayOrders = orders.filter(o =>
            new Date(o.date).toLocaleDateString('en-IN') === d.toLocaleDateString('en-IN')
        );

        return {
            date: dateStr,
            sales: dayOrders.reduce((sum, o) => sum + (o.finalAmount || 0), 0),
            orders: dayOrders.length,
            fullDate: d
        };
    }).reverse();

    // Category Distribution
    const categoryCounts = orders.reduce((acc, o) => {
        o.items.forEach(item => {
            const cat = item.category || 'Other';
            acc[cat] = (acc[cat] || 0) + (o.finalAmount || 0);
        });
        return acc;
    }, {});

    const colors = ['#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5', '#ea580c'];
    const categoryData = Object.entries(categoryCounts).map(([name, value], i) => ({
        name,
        value: Math.round((value / totalRevenue) * 100) || 0,
        color: colors[i % colors.length]
    })).filter(c => c.value > 0);

    // Product Performance
    const productPerformance = orders.reduce((acc, o) => {
        o.items.forEach(item => {
            if (!acc[item.name]) {
                acc[item.name] = { name: item.name, sales: 0, orders: 0 };
            }
            acc[item.name].sales += (item.price * item.quantity);
            acc[item.name].orders += 1;
        });
        return acc;
    }, {});

    const topProducts = Object.values(productPerformance)
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 5);

    const stats = [
        {
            label: 'Total Revenue',
            value: `₹${totalRevenue.toLocaleString()}`,
            change: '+15.3%',
            isPositive: true,
            icon: DollarSign,
            color: 'text-green-600 bg-green-50'
        },
        {
            label: 'Total Orders',
            value: totalOrders.toString(),
            change: '+12.8%',
            isPositive: true,
            icon: ShoppingCart,
            color: 'text-blue-600 bg-blue-50'
        },
        {
            label: 'Total Customers',
            value: uniqueCustomers.toString(),
            change: '+5.2%',
            isPositive: true,
            icon: Users,
            color: 'text-purple-600 bg-purple-50'
        },
        {
            label: 'Items Sold (kg)',
            value: totalProductsSold.toFixed(1),
            change: '+18.5%',
            isPositive: true,
            icon: Package,
            color: 'text-orange-600 bg-orange-50'
        }
    ];

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
                        <p className="text-gray-500 mt-1">Track performance and insights</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                            <option value="7days">Last 7 Days</option>
                            <option value="30days">Last 30 Days</option>
                            <option value="3months">Last 3 Months</option>
                            <option value="year">This Year</option>
                        </select>
                        <button className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                            <Download className="w-5 h-5 mr-2" />
                            Export
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div className={`${stat.color} p-3 rounded-lg`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <span className={`text-sm font-medium ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                    {stat.change}
                                </span>
                            </div>
                            <h3 className="text-gray-500 text-sm font-medium mt-4">{stat.label}</h3>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                        </div>
                    );
                })}
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Sales Trend */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Sales Trend</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={salesTrend}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                            <YAxis stroke="#9ca3af" fontSize={12} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="sales" stroke="#f97316" strokeWidth={2} name="Sales (₹)" />
                            <Line type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={2} name="Orders" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Category Distribution */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Category Distribution</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, value }) => `${name} ${value}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Product Performance */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Top Products Performance</h2>
                    <div className="space-y-4">
                        {topProducts.length > 0 ? topProducts.map((product, index) => (
                            <div key={index}>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-bold text-gray-900">{product.name}</span>
                                            <span className="text-sm font-black text-gray-900">₹{product.sales.toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center justify-between mt-1">
                                            <span className="text-xs text-gray-500 font-medium uppercase tracking-tight">{product.orders} orders</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                    <div
                                        className="bg-orange-500 h-full rounded-full transition-all duration-500"
                                        style={{ width: `${(product.sales / (topProducts[0]?.sales || 1)) * 100}%` }}
                                    />
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-10 text-gray-400">No product data yet</div>
                        )}
                    </div>
                </div>

                {/* Customer Distribution Placeholder */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Status Overview</h2>
                    <div className="space-y-4">
                        {['Confirmed', 'Packed', 'Shipping', 'Delivered', 'Cancelled'].map(status => {
                            const count = orders.filter(o => o.status === status).length;
                            const percentage = (count / (orders.length || 1)) * 100;
                            return (
                                <div key={status}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium text-gray-700">{status}</span>
                                        <span className="text-sm font-bold text-gray-900">{count}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                                        <div
                                            className={`h-full rounded-full ${status === 'Delivered' ? 'bg-green-500' :
                                                status === 'Cancelled' ? 'bg-red-500' :
                                                    'bg-blue-500'
                                                }`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Quick Reports */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Quick Reports</h2>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center mr-3">
                                    <DollarSign className="w-5 h-5 text-orange-600" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-medium text-gray-900">Sales Report</p>
                                    <p className="text-xs text-gray-500">Detailed sales breakdown</p>
                                </div>
                            </div>
                            <Download className="w-5 h-5 text-gray-400" />
                        </button>

                        <button className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                                    <ShoppingCart className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-medium text-gray-900">Orders Report</p>
                                    <p className="text-xs text-gray-500">All orders summary</p>
                                </div>
                            </div>
                            <Download className="w-5 h-5 text-gray-400" />
                        </button>

                        <button className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mr-3">
                                    <Users className="w-5 h-5 text-purple-600" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-medium text-gray-900">Customer Report</p>
                                    <p className="text-xs text-gray-500">Customer insights</p>
                                </div>
                            </div>
                            <Download className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
