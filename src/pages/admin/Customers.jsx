import React, { useState } from 'react';
import { Search, Filter, Eye, Mail, Phone, MapPin, ShoppingBag, DollarSign, Users } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

const Customers = () => {
    const { orders } = useShop();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    // Derive unique customers from orders
    const customerMap = orders.reduce((acc, order) => {
        const key = order.customer?.phone || order.userEmail || 'Guest';
        if (!acc[key]) {
            acc[key] = {
                id: key,
                name: order.customer?.name || 'Guest Customer',
                email: order.userEmail || order.customer?.email || 'N/A',
                phone: order.customer?.phone || 'N/A',
                address: `${order.customer?.address || ''}, ${order.customer?.city || ''}`,
                totalOrders: 0,
                totalSpend: 0,
                lastOrder: order.date,
                status: 'Active',
                orders: []
            };
        }
        acc[key].totalOrders += 1;
        acc[key].totalSpend += (order.finalAmount || 0);
        acc[key].orders.push({
            id: order.id,
            date: new Date(order.date).toLocaleDateString(),
            items: order.items.map(i => i.name).join(', '),
            total: order.finalAmount,
            status: order.status
        });
        if (new Date(order.date) > new Date(acc[key].lastOrder)) {
            acc[key].lastOrder = order.date;
        }
        return acc;
    }, {});

    const customersList = Object.values(customerMap).filter(customer =>
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalRevenue = orders.reduce((sum, o) => sum + (o.finalAmount || 0), 0);

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
                <p className="text-gray-500 mt-1">Manage your customer base</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Total Customers</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{Object.keys(customerMap).length}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                            <Users className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Customer Orders</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{orders.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                            <ShoppingBag className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">₹{totalRevenue.toLocaleString()}</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by name, email, or phone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    />
                </div>
            </div>

            {/* Customers Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    {/* Desktop View Table */}
                    <table className="w-full hidden md:table">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spend</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Order</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {customersList.map((customer) => (
                                <tr key={customer.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                                                <span className="text-white font-semibold text-sm">
                                                    {customer.name.split(' ').map(n => n[0]).join('')}
                                                </span>
                                            </div>
                                            <div className="ml-3">
                                                <div className="text-sm font-bold text-gray-900">{customer.name}</div>
                                                <div className="text-[10px] text-gray-400 font-mono">{customer.id.length > 20 ? customer.id.substring(0, 10) + '...' : customer.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{customer.email}</div>
                                        <div className="text-xs text-gray-500">{customer.phone}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.totalOrders}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-gray-900">₹{customer.totalSpend.toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(customer.lastOrder).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <button
                                            onClick={() => setSelectedCustomer(customer)}
                                            className="inline-flex items-center px-3 py-1.5 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-600 hover:text-white transition-all text-xs font-bold uppercase tracking-wider"
                                        >
                                            <Eye className="w-4 h-4 mr-1" />
                                            View Profile
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Mobile View Card List */}
                    <div className="md:hidden divide-y divide-gray-200">
                        {customersList.map((customer) => (
                            <div key={customer.id} className="p-4 bg-white hover:bg-gray-50 flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mr-3">
                                        <span className="text-white font-bold text-sm">
                                            {customer.name.split(' ').map(n => n[0]).join('')}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{customer.name}</p>
                                        <p className="text-xs text-gray-500">{customer.phone}</p>
                                        <p className="text-[10px] text-orange-600 font-bold mt-1 uppercase">₹{customer.totalSpend.toLocaleString()} • {customer.totalOrders} Orders</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedCustomer(customer)}
                                    className="p-2 bg-orange-50 text-orange-600 rounded-full"
                                >
                                    <Eye className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pagination Placeholder */}
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <p className="text-sm text-gray-500 font-medium">Showing {customersList.length} customers</p>
                </div>
            </div>

            {/* Customer Details Modal */}
            {selectedCustomer && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">Customer Profile</h2>
                                <button
                                    onClick={() => setSelectedCustomer(null)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Customer Info */}
                            <div className="flex items-start space-x-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-xl">
                                        {selectedCustomer.name.split(' ').map(n => n[0]).join('')}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900">{selectedCustomer.name}</h3>
                                    <div className="mt-2 space-y-2">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                            {selectedCustomer.email}
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                            {selectedCustomer.phone}
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                            {selectedCustomer.address}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-xs text-gray-500 font-medium">Total Orders</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{selectedCustomer.totalOrders}</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-xs text-gray-500 font-medium">Total Spend</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">₹{selectedCustomer.totalSpend.toLocaleString()}</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-xs text-gray-500 font-medium">Avg. Order</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">₹{Math.round(selectedCustomer.totalSpend / selectedCustomer.totalOrders)}</p>
                                </div>
                            </div>

                            {/* Order History */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-3">Order History</h3>
                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Order ID</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Date</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Items</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Total</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {selectedCustomer.orders.map((order) => (
                                                <tr key={order.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{order.id}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-700">{order.date}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-700">{order.items}</td>
                                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">₹{order.total}</td>
                                                    <td className="px-4 py-3 text-sm">
                                                        <span className={`inline-flex text-xs px-2 py-0.5 rounded-full font-medium ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                            }`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200 flex justify-end">
                            <button
                                onClick={() => setSelectedCustomer(null)}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Customers;
