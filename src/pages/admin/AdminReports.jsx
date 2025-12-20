import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Download, TrendingUp, DollarSign, Package, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export const AdminReports = () => {
    const revenueData = [
        { month: 'Jan', revenue: 250000 },
        { month: 'Feb', revenue: 280000 },
        { month: 'Mar', revenue: 320000 },
        { month: 'Apr', revenue: 350000 },
        { month: 'May', revenue: 390000 },
        { month: 'Jun', revenue: 420000 },
    ];

    const orderTrends = [
        { month: 'Jan', orders: 320 },
        { month: 'Feb', orders: 380 },
        { month: 'Mar', orders: 450 },
        { month: 'Apr', orders: 490 },
        { month: 'May', orders: 520 },
        { month: 'Jun', orders: 580 },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-dark mb-2">Reports & Analytics</h1>
                    <p className="text-gray-600">Business insights and performance metrics</p>
                </div>
                <Button variant="primary">
                    <Download size={18} />
                    Export Report
                </Button>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                            <h3 className="text-3xl font-bold text-dark">₹42L</h3>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                            <DollarSign size={24} className="text-white" />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <TrendingUp size={16} className="text-green-600" />
                        <span className="text-green-600 font-medium">+18%</span>
                        <span className="text-gray-500">vs last month</span>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                            <h3 className="text-3xl font-bold text-dark">2,540</h3>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                            <Package size={24} className="text-white" />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <TrendingUp size={16} className="text-green-600" />
                        <span className="text-green-600 font-medium">+12%</span>
                        <span className="text-gray-500">vs last month</span>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Active Partners</p>
                            <h3 className="text-3xl font-bold text-dark">45</h3>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-600 rounded-xl flex items-center justify-center">
                            <Users size={24} className="text-white" />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <TrendingUp size={16} className="text-green-600" />
                        <span className="text-green-600 font-medium">+5</span>
                        <span className="text-gray-500">new this month</span>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Avg Order Value</p>
                            <h3 className="text-3xl font-bold text-dark">₹1,650</h3>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <TrendingUp size={24} className="text-white" />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <TrendingUp size={16} className="text-green-600" />
                        <span className="text-green-600 font-medium">+8%</span>
                        <span className="text-gray-500">vs last month</span>
                    </div>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-8">
                {/* Revenue Trend */}
                <Card>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold text-dark">Revenue Trend</h3>
                        <select className="input py-2 px-3 text-sm">
                            <option>Last 6 Months</option>
                            <option>Last 12 Months</option>
                            <option>This Year</option>
                        </select>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="month" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px'
                                }}
                                formatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                            />
                            <Line
                                type="monotone"
                                dataKey="revenue"
                                stroke="#FC8019"
                                strokeWidth={3}
                                dot={{ fill: '#FC8019', r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>

                {/* Order Trends */}
                <Card>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold text-dark">Order Growth</h3>
                        <select className="input py-2 px-3 text-sm">
                            <option>Last 6 Months</option>
                            <option>Last 12 Months</option>
                            <option>This Year</option>
                        </select>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={orderTrends}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="month" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px'
                                }}
                            />
                            <Bar dataKey="orders" fill="#2ECC71" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            {/* Reports List */}
            <Card>
                <h3 className="text-xl font-semibold text-dark mb-6">Available Reports</h3>
                <div className="space-y-3">
                    {[
                        { name: 'Monthly Sales Report', date: 'December 2025' },
                        { name: 'Restaurant Partner Analysis', date: 'Q4 2025' },
                        { name: 'Product Performance Report', date: 'December 2025' },
                        { name: 'Delivery Performance Report', date: 'December 2025' },
                        { name: 'Revenue by Category', date: 'December 2025' }
                    ].map((report, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-primary hover:bg-primary-50 transition-all">
                            <div>
                                <p className="font-medium text-dark">{report.name}</p>
                                <p className="text-sm text-gray-500">{report.date}</p>
                            </div>
                            <Button variant="outline" className="py-2">
                                <Download size={16} />
                                Download
                            </Button>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};
