import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Filter, Eye, ChevronDown, Package, RefreshCcw } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

const Orders = () => {
    const { orders, updateOrderStatus, fetchAllOrders } = useShop();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const location = useLocation();

    useEffect(() => {
        if (location.state?.selectedOrderId && orders.length > 0) {
            const order = orders.find(o => o.id === location.state.selectedOrderId);
            if (order) setSelectedOrder(order);
        }
    }, [location.state, orders]);

    useEffect(() => {
        // Initial fetch
        if (fetchAllOrders) fetchAllOrders();

        // Poll every 30 seconds
        const interval = setInterval(() => {
            if (fetchAllOrders) fetchAllOrders();
        }, 30000);

        return () => clearInterval(interval);
    }, [fetchAllOrders]);

    const handleRefresh = async () => {
        if (fetchAllOrders) {
            setIsRefreshing(true);
            await fetchAllOrders();
            setTimeout(() => setIsRefreshing(false), 500);
        }
    };

    const statuses = ['All', 'Pending', 'Confirmed', 'Processing', 'Packed', 'Shipping', 'Delivered', 'Cancelled'];

    const getStatusColor = (status) => {
        const colors = {
            'Confirmed': 'bg-blue-100 text-blue-700',
            'Packed': 'bg-indigo-100 text-indigo-700',
            'Shipping': 'bg-purple-100 text-purple-700',
            'Delivered': 'bg-green-100 text-green-700',
            'Cancelled': 'bg-red-100 text-red-700',
            'Pending': 'bg-yellow-100 text-yellow-700',
            'Processing': 'bg-blue-100 text-blue-700',
            'Shipped': 'bg-purple-100 text-purple-700',
            'Placed': 'bg-yellow-100 text-yellow-700'
        };
        return colors[status] || 'bg-gray-100 text-gray-700';
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleStatusUpdate = (orderId, newStatus) => {
        if (updateOrderStatus) {
            updateOrderStatus(orderId, newStatus);
            // Update selected order if it's open
            if (selectedOrder && selectedOrder.id === orderId) {
                setSelectedOrder(prevOrder => ({
                    ...prevOrder,
                    status: newStatus
                }));
            }
        }
    };

    // Filter and search orders
    const filteredOrders = orders.filter(order => {
        const matchesSearch = !searchQuery ||
            order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customer?.phone?.includes(searchQuery);

        const matchesStatus = filterStatus === 'All' || order.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
                    <p className="text-gray-500 mt-1">Manage and track all customer orders ({orders.length} total)</p>
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
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by ID, name, or phone..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="relative w-full md:w-64">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none text-sm bg-white"
                        >
                            {statuses.map(status => (
                                <option key={status} value={status}>{status === 'All' ? 'All Orders' : `${status} Orders`}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Found</h3>
                    <p className="text-gray-500">
                        {searchQuery || filterStatus !== 'All'
                            ? 'Try adjusting your search or filters'
                            : 'No customer orders yet. Orders will appear here once customers place them.'}
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        {/* Desktop View Table */}
                        <table className="w-full hidden md:table">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900 font-mono">{order.id}</div>
                                            <div className="text-xs text-gray-500">{formatDate(order.date)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{order.customer?.name || 'N/A'}</div>
                                            <div className="text-xs text-gray-500">{order.customer?.phone || 'N/A'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-700">
                                                {order.items && order.items.length > 0 ? (
                                                    <>
                                                        {order.items.slice(0, 2).map((item, idx) => (
                                                            <div key={idx}>
                                                                {item.name} ({item.cut}) - {item.quantity}kg
                                                            </div>
                                                        ))}
                                                        {order.items.length > 2 && (
                                                            <div className="text-xs text-gray-500">+{order.items.length - 2} more</div>
                                                        )}
                                                    </>
                                                ) : (
                                                    <span className="text-gray-400">No items</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            ₹{order.finalAmount || order.total || 0}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                className={`text-xs px-2.5 py-1.5 rounded-full font-bold border-0 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer shadow-sm ${getStatusColor(order.status)}`}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Confirmed">Confirmed</option>
                                                <option value="Processing">Processing</option>
                                                <option value="Packed">Packed</option>
                                                <option value="Shipping">Shipping</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                                {/* Compatibility fallbacks */}
                                                {!['Pending', 'Confirmed', 'Processing', 'Packed', 'Shipping', 'Delivered', 'Cancelled'].includes(order.status) && (
                                                    <option value={order.status}>{order.status}</option>
                                                )}
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="inline-flex items-center px-3 py-1.5 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors text-sm font-medium"
                                            >
                                                <Eye className="w-4 h-4 mr-1" />
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Mobile View Cards */}
                        <div className="md:hidden divide-y divide-gray-200">
                            {filteredOrders.map((order) => (
                                <div key={order.id} className="p-4 bg-white hover:bg-gray-50">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <div className="text-sm font-bold text-gray-900 font-mono">{order.id}</div>
                                            <div className="text-xs text-gray-500">{formatDate(order.date)}</div>
                                        </div>
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                            className={`text-[10px] px-2 py-1 rounded-full font-bold border-0 focus:outline-none shadow-sm ${getStatusColor(order.status)}`}
                                        >
                                            <option value="Confirmed">Confirmed</option>
                                            <option value="Packed">Packed</option>
                                            <option value="Shipping">Shipping</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div className="text-sm">
                                            <p className="font-medium text-gray-800">{order.customer?.name || 'Guest'}</p>
                                            <p className="text-xs text-gray-500 line-clamp-1">
                                                {order.items.length} items • ₹{order.finalAmount || order.final_amount || 0}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="text-orange-600 font-bold text-xs uppercase tracking-wider bg-orange-50 px-3 py-1.5 rounded-lg"
                                        >
                                            Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pagination Info */}
                    <div className="px-6 py-4 border-t border-gray-200">
                        <p className="text-sm text-gray-500">
                            Showing {filteredOrders.length} of {orders.length} orders
                        </p>
                    </div>
                </div>
            )}

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="text-gray-400 hover:text-gray-600 text-2xl"
                                >
                                    ✕
                                </button>
                            </div>
                            <p className="text-sm text-gray-500 font-mono mt-1">{selectedOrder.id}</p>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Customer Info */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-3">Customer Information</h3>
                                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                    <p className="text-sm"><span className="font-medium">Name:</span> {selectedOrder.customer?.name || 'N/A'}</p>
                                    <p className="text-sm"><span className="font-medium">Phone:</span> {selectedOrder.customer?.phone || 'N/A'}</p>
                                    <p className="text-sm"><span className="font-medium">Email:</span> {selectedOrder.userEmail || 'N/A'}</p>
                                    <p className="text-sm"><span className="font-medium">Address:</span> {selectedOrder.customer?.address}, {selectedOrder.customer?.city} - {selectedOrder.customer?.pincode}</p>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-3">Order Items</h3>
                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                    {selectedOrder.items && selectedOrder.items.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-4 border-b border-gray-200 last:border-0">
                                            <div className="flex items-center">
                                                <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center mr-3">
                                                    {item.image ? (
                                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Package className="w-6 h-6 text-gray-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                                    <p className="text-xs text-gray-500">
                                                        Preparation: {item.cut} • Quantity: {item.quantity}kg
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="text-sm font-medium text-gray-900">₹{item.price * item.quantity}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Billing Summary */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-3">Billing Summary</h3>
                                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Item Total</span>
                                        <span className="font-medium text-gray-900">₹{selectedOrder.itemTotal || selectedOrder.item_total || 0}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Delivery Charges</span>
                                        <span className="font-medium text-gray-900">₹{selectedOrder.deliveryFee || selectedOrder.delivery_fee || 0}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Taxes & Charges</span>
                                        <span className="font-medium text-gray-900">₹{selectedOrder.taxesAndCharges || selectedOrder.taxes_and_charges || 0}</span>
                                    </div>
                                    <div className="flex justify-between text-base font-semibold pt-2 border-t border-gray-300">
                                        <span className="text-gray-900">Total</span>
                                        <span className="text-orange-600">₹{selectedOrder.finalAmount || selectedOrder.final_amount || 0}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Status Update */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-3">Update Order Status</h3>
                                <select
                                    value={selectedOrder.status}
                                    onChange={(e) => handleStatusUpdate(selectedOrder.id, e.target.value)}
                                    className={`w-full px-4 py-3 rounded-xl font-bold border-2 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${getStatusColor(selectedOrder.status)}`}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Confirmed">Confirmed</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Packed">Packed</option>
                                    <option value="Shipping">Shipping</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200 flex justify-end">
                            <button
                                onClick={() => setSelectedOrder(null)}
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

export default Orders;
