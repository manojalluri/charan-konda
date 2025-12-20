import React, { useState } from 'react';
import { Search, Filter, Truck, Package, Save, CheckCircle2, ChevronDown, RefreshCcw } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

const Tracking = () => {
    const { orders, updateOrderTracking, fetchAllOrders } = useShop();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('Shipping');
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Tracking form state for a specific order
    const [editingTracking, setEditingTracking] = useState(null);
    const [trackingForm, setTrackingForm] = useState({
        trackingId: '',
        courierPartner: ''
    });

    const handleRefresh = async () => {
        setIsRefreshing(true);
        if (fetchAllOrders) await fetchAllOrders();
        setTimeout(() => setIsRefreshing(false), 500);
    };

    const handleEditTracking = (order) => {
        setEditingTracking(order.id);
        setTrackingForm({
            trackingId: order.trackingId || '',
            courierPartner: order.courierPartner || ''
        });
    };

    const handleSaveTracking = async (orderId) => {
        const result = await updateOrderTracking(orderId, trackingForm);
        if (result.success) {
            setEditingTracking(null);
            // Show a temporary success state if needed
        } else {
            alert('Failed to update tracking information');
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'Confirmed': 'bg-blue-100 text-blue-700',
            'Packed': 'bg-indigo-100 text-indigo-700',
            'Shipping': 'bg-purple-100 text-purple-700',
            'Delivered': 'bg-green-100 text-green-700',
            'Cancelled': 'bg-red-100 text-red-700',
        };
        return colors[status] || 'bg-gray-100 text-gray-700';
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = !searchQuery ||
            order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = filterStatus === 'All' || order.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Order Tracking</h1>
                    <p className="text-gray-500 mt-1">Manage delivery details for active orders</p>
                </div>
                <button
                    onClick={handleRefresh}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                    <RefreshCcw size={16} className={isRefreshing ? "animate-spin" : ""} />
                    Refresh
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by Order ID or Customer Name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                        />
                    </div>

                    <div className="relative w-full md:w-64">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none text-sm bg-white"
                        >
                            <option value="All">All Statuses</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Packed">Packed</option>
                            <option value="Shipping">Shipping</option>
                            <option value="Delivered">Delivered</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Tracking Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tracking Details</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredOrders.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center">
                                        <Truck className="w-12 h-12 text-gray-300 mb-2" />
                                        <p className="text-gray-500">No matching orders found</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 font-mono">{order.id}</div>
                                        <div className="text-xs text-gray-500">{new Date(order.date).toLocaleDateString()}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{order.customer?.name}</div>
                                        <div className="text-xs text-gray-500">{order.customer?.city}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {editingTracking === order.id ? (
                                            <div className="flex flex-col gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Tracking ID"
                                                    value={trackingForm.trackingId}
                                                    onChange={(e) => setTrackingForm({ ...trackingForm, trackingId: e.target.value })}
                                                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Courier Partner"
                                                    value={trackingForm.courierPartner}
                                                    onChange={(e) => setTrackingForm({ ...trackingForm, courierPartner: e.target.value })}
                                                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                                />
                                            </div>
                                        ) : (
                                            <div>
                                                {order.trackingId ? (
                                                    <div className="space-y-1">
                                                        <div className="flex items-center text-xs text-gray-700 font-medium">
                                                            <Package size={12} className="mr-1 text-orange-500" />
                                                            ID: {order.trackingId}
                                                        </div>
                                                        <div className="flex items-center text-xs text-gray-500">
                                                            <Truck size={12} className="mr-1" />
                                                            {order.courierPartner || 'Not specified'}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-gray-400 italic">No tracking info</span>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        {editingTracking === order.id ? (
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setEditingTracking(null)}
                                                    className="p-1.5 text-gray-400 hover:text-gray-600"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => handleSaveTracking(order.id)}
                                                    className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 transition-colors"
                                                >
                                                    <Save size={14} />
                                                    SAVE
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleEditTracking(order)}
                                                className="inline-flex items-center px-3 py-1.5 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors text-xs font-bold uppercase tracking-wider"
                                            >
                                                {order.trackingId ? 'Edit Info' : 'Add Tracking'}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Tracking;
