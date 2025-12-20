import { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Search, Eye, Check } from 'lucide-react';
import { orders } from '../../data/mockData';

export const AdminOrders = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.restaurantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusClass = (status) => {
        switch (status) {
            case 'Pending': return 'status-pending';
            case 'Processing': return 'status-processing';
            case 'Delivered': return 'status-delivered';
            default: return 'status-pending';
        }
    };

    const handleMarkDelivered = (orderId) => {
        alert(`Order ${orderId} marked as delivered!`);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-dark mb-2">Orders Management</h1>
                    <p className="text-gray-600">Track and manage all restaurant orders</p>
                </div>
                <Button variant="primary">
                    + New Order
                </Button>
            </div>

            {/* Filters */}
            <Card>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search by restaurant name or order ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="input md:w-48"
                    >
                        <option value="All">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Delivered">Delivered</option>
                    </select>
                </div>
            </Card>

            {/* Orders Table */}
            <Card className="overflow-x-auto">
                <table className="table-custom">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Restaurant</th>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Delivery Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map((order) => (
                            <tr key={order.id}>
                                <td className="font-medium text-primary">{order.id}</td>
                                <td>
                                    <div>
                                        <p className="font-medium text-dark">{order.restaurantName}</p>
                                        <p className="text-xs text-gray-500">{order.contactPerson}</p>
                                    </div>
                                </td>
                                <td>{order.product}</td>
                                <td className="font-medium">{order.quantity}</td>
                                <td>{new Date(order.deliveryDate).toLocaleDateString('en-IN')}</td>
                                <td>
                                    <span className={getStatusClass(order.status)}>
                                        {order.status}
                                    </span>
                                </td>
                                <td>
                                    <div className="flex gap-2">
                                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="View Details">
                                            <Eye size={18} className="text-gray-600" />
                                        </button>
                                        {order.status !== 'Delivered' && (
                                            <button
                                                onClick={() => handleMarkDelivered(order.id)}
                                                className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                                                title="Mark Delivered"
                                            >
                                                <Check size={18} className="text-green-600" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredOrders.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No orders found matching your criteria
                    </div>
                )}
            </Card>

            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                    <p className="text-3xl font-bold text-dark">{orders.length}</p>
                </Card>
                <Card>
                    <p className="text-sm text-gray-600 mb-1">Pending Orders</p>
                    <p className="text-3xl font-bold text-yellow-600">
                        {orders.filter(o => o.status === 'Pending').length}
                    </p>
                </Card>
                <Card>
                    <p className="text-sm text-gray-600 mb-1">Delivered Today</p>
                    <p className="text-3xl font-bold text-green-600">
                        {orders.filter(o => o.status === 'Delivered').length}
                    </p>
                </Card>
            </div>
        </div>
    );
};
