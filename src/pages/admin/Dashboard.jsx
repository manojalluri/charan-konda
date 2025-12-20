import React from 'react';
import { Link } from 'react-router-dom';
import {
    TrendingUp,
    ShoppingCart,
    Users,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    AlertTriangle,
    Package,
    Clock
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useShop } from '../../context/ShopContext';

const Dashboard = () => {
    const { orders, products } = useShop();

    // Calculate real stats
    const totalRevenue = orders.reduce((sum, order) => sum + (order.finalAmount || 0), 0);
    const totalOrders = orders.length;
    const activeProducts = products.filter(p => p.stock).length;

    // Unique customers (by email or phone)
    const uniqueCustomers = new Set(orders.map(o => o.userEmail || o.customer?.phone)).size;

    const stats = [
        {
            name: "Total Revenue",
            value: `₹${totalRevenue.toLocaleString()}`,
            change: '+12.5%',
            isPositive: true,
            icon: DollarSign,
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600',
            href: '/admin/orders'
        },
        {
            name: 'Total Orders',
            value: totalOrders.toString(),
            change: '+8.2%',
            isPositive: true,
            icon: ShoppingCart,
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600',
            href: '/admin/orders'
        },
        {
            name: 'Active Products',
            value: activeProducts.toString(),
            change: '+5.1%',
            isPositive: true,
            icon: Package,
            bgColor: 'bg-orange-50',
            iconColor: 'text-orange-600',
            href: '/admin/products'
        },
        {
            name: 'Total Customers',
            value: Math.max(uniqueCustomers, 1).toString(),
            change: '+2.4%',
            isPositive: true,
            icon: Users,
            bgColor: 'bg-purple-50',
            iconColor: 'text-purple-600',
            href: '/admin/customers'
        }
    ];

    // Prepare chart data from real orders (last 7 days)
    const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toLocaleDateString('en-IN', { weekday: 'short' });
    }).reverse();

    const salesData = last7Days.map(day => {
        const dayOrders = orders.filter(o => {
            const date = new Date(o.date);
            return date.toLocaleDateString('en-IN', { weekday: 'short' }) === day;
        });
        const sales = dayOrders.reduce((sum, o) => sum + (o.finalAmount || 0), 0);
        return { date: day, sales };
    });

    const getStatusColor = (status) => {
        const colors = {
            'Confirmed': 'bg-blue-100 text-blue-700',
            'Packed': 'bg-indigo-100 text-indigo-700',
            'Shipping': 'bg-purple-100 text-purple-700',
            'Delivered': 'bg-green-100 text-green-700',
            'Cancelled': 'bg-red-100 text-red-700'
        };
        // Compatibility fallbacks
        if (status === 'Pending') return colors['Confirmed'];
        if (status === 'Shipped') return colors['Shipping'];
        if (status === 'Processing') return colors['Packed'];

        return colors[status] || 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="p-6">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 mt-1">Real-time overview of your store's performance.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Link
                            key={index}
                            to={stat.href}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:border-orange-200 hover:shadow-md transition-all group"
                        >
                            <div className="flex items-center justify-between">
                                <div className={`${stat.bgColor} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                                    <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                                </div>
                                <div className={`flex items-center text-sm font-medium ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                    <ArrowUpRight className="w-4 h-4 mr-1" />
                                    {stat.change}
                                </div>
                            </div>
                            <h3 className="text-gray-500 text-sm font-medium mt-4">{stat.name}</h3>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                        </Link>
                    );
                })}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Weekly Sales</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={salesData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                            <YAxis stroke="#9ca3af" fontSize={12} />
                            <Tooltip />
                            <Line type="monotone" dataKey="sales" stroke="#f97316" strokeWidth={2} dot={{ fill: '#f97316' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Order Activity</h2>
                        <Link to="/admin/orders" className="text-sm text-orange-600 hover:text-orange-700 font-bold uppercase tracking-wider">
                            View All
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {orders.length > 0 ? (
                            orders.slice(0, 5).map((order) => (
                                <Link
                                    key={order.id}
                                    to="/admin/orders"
                                    state={{ selectedOrderId: order.id }}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-orange-50 transition-colors border border-transparent hover:border-orange-100 group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-orange-100 rounded-lg text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                                            <ShoppingCart size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 group-hover:text-orange-700 transition-colors">{order.customer?.name || 'Guest'}</p>
                                            <p className="text-xs text-gray-500 font-mono">{order.id.split('-').slice(0, 2).join('-')}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-black text-gray-900">₹{order.finalAmount}</p>
                                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="text-center py-10">
                                <Package className="mx-auto text-gray-300 mb-2" size={32} />
                                <p className="text-gray-400 text-sm">No recent orders</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
