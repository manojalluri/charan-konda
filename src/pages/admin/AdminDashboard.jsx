import { Card } from '../../components/ui/Card';
import { TrendingUp, Package, Store, Truck } from 'lucide-react';
import { dashboardStats, chartData } from '../../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const AdminDashboard = () => {
    const stats = [
        {
            title: "Today's Orders",
            value: dashboardStats.todayOrders,
            icon: Package,
            color: 'from-blue-500 to-blue-600',
            change: '+12%'
        },
        {
            title: 'Total Restaurants',
            value: dashboardStats.totalRestaurants,
            icon: Store,
            color: 'from-primary to-primary-600',
            change: '+3'
        },
        {
            title: 'Pending Deliveries',
            value: dashboardStats.pendingDeliveries,
            icon: Truck,
            color: 'from-yellow-500 to-yellow-600',
            change: '-2'
        },
        {
            title: "Today's Quantity",
            value: `${dashboardStats.todayQuantity}kg`,
            icon: TrendingUp,
            color: 'from-fresh to-fresh-600',
            change: '+8%'
        }
    ];

    const COLORS = ['#FC8019', '#2ECC71', '#3498DB', '#F39C12'];

    return (
        <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <Card
                        key={stat.title}
                        className={`animate-slide-up`}
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                                <h3 className="text-3xl font-bold text-dark">{stat.value}</h3>
                            </div>
                            <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                                <stat.icon size={24} className="text-white" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-fresh font-medium">{stat.change}</span>
                            <span className="text-gray-500">vs yesterday</span>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-8">
                {/* Daily Orders */}
                <Card>
                    <h3 className="text-xl font-semibold text-dark mb-6">Daily Orders</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData.dailyOrders}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="date" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px'
                                }}
                            />
                            <Bar dataKey="orders" fill="#FC8019" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>

                {/* Product Demand */}
                <Card>
                    <h3 className="text-xl font-semibold text-dark mb-6">Product Demand</h3>
                    <div className="flex items-center justify-between">
                        <ResponsiveContainer width="60%" height={300}>
                            <PieChart>
                                <Pie
                                    data={chartData.productDemand}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="quantity"
                                >
                                    {chartData.productDemand.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="space-y-3">
                            {chartData.productDemand.map((item, index) => (
                                <div key={item.product} className="flex items-center gap-3">
                                    <div
                                        className="w-4 h-4 rounded-full"
                                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                    />
                                    <div>
                                        <p className="text-sm font-medium text-dark">{item.product}</p>
                                        <p className="text-xs text-gray-500">{item.quantity}kg</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <h3 className="text-xl font-semibold text-dark mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button className="p-4 border-2 border-gray-200 rounded-xl hover:border-primary hover:bg-primary-50 transition-all text-center">
                        <Package size={24} className="mx-auto mb-2 text-primary" />
                        <p className="text-sm font-medium text-dark">New Order</p>
                    </button>
                    <button className="p-4 border-2 border-gray-200 rounded-xl hover:border-primary hover:bg-primary-50 transition-all text-center">
                        <Store size={24} className="mx-auto mb-2 text-primary" />
                        <p className="text-sm font-medium text-dark">Add Restaurant</p>
                    </button>
                    <button className="p-4 border-2 border-gray-200 rounded-xl hover:border-primary hover:bg-primary-50 transition-all text-center">
                        <Truck size={24} className="mx-auto mb-2 text-primary" />
                        <p className="text-sm font-medium text-dark">Schedule Delivery</p>
                    </button>
                    <button className="p-4 border-2 border-gray-200 rounded-xl hover:border-primary hover:bg-primary-50 transition-all text-center">
                        <TrendingUp size={24} className="mx-auto mb-2 text-primary" />
                        <p className="text-sm font-medium text-dark">View Reports</p>
                    </button>
                </div>
            </Card>
        </div>
    );
};
