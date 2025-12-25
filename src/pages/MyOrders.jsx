import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Clock, CheckCircle, XCircle, ChevronRight, ArrowLeft } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import FadeIn from '../components/FadeIn';

const getStatusColor = (status) => {
    switch (status) {
        case 'Confirmed':
        case 'Placed':
        case 'Pending':
        case 'Processing':
            return 'bg-blue-100 text-blue-700';
        case 'Packed':
            return 'bg-indigo-100 text-indigo-700';
        case 'Shipping':
        case 'Shipped':
            return 'bg-purple-100 text-purple-700';
        case 'Delivered':
            return 'bg-green-100 text-green-700';
        case 'Cancelled':
            return 'bg-red-100 text-red-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};

const getStatusIcon = (status) => {
    switch (status) {
        case 'Delivered':
            return <CheckCircle size={18} />;
        case 'Cancelled':
            return <XCircle size={18} />;
        default:
            return <Clock size={18} />;
    }
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const OrderCard = ({ order, onClick }) => (
    <div
        onClick={() => onClick(order)}
        className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
    >
        <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                    <Package className="text-[#FC8019]" size={20} />
                    <span className="font-mono text-sm font-bold text-[#1C1C1C]">{order.id}</span>
                </div>
                <p className="text-xs text-[#93959F]">{formatDate(order.date)}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                </span>
                <ChevronRight className="text-[#93959F]" size={20} />
            </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-[#60646C]">
                    {order.items.length} item{order.items.length > 1 ? 's' : ''}
                </span>
                <span className="font-extrabold text-lg text-[#FC8019]">₹{order.finalAmount || order.final_amount || 0}</span>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
                {order.items.slice(0, 3).map((item, idx) => (
                    <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {item.name.length > 20 ? item.name.substring(0, 20) + '...' : item.name}
                    </span>
                ))}
                {order.items.length > 3 && (
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        +{order.items.length - 3} more
                    </span>
                )}
            </div>
        </div>
    </div>
);

const OrderDetailsModal = ({ order, onClose, getProductPrice }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b border-gray-200 rounded-t-3xl">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-[#1C1C1C]">Order Details</h2>
                        <p className="text-sm text-[#93959F] font-mono mt-1">{order.id}</p>
                    </div>
                    <button onClick={onClose} className="text-[#93959F] hover:text-[#1C1C1C]">
                        <XCircle size={24} />
                    </button>
                </div>
            </div>

            <div className="p-6 space-y-6">
                {/* Modern Tracking Stepper */}
                {order.status !== 'Cancelled' && (
                    <div className="py-8 px-2">
                        <div className="relative flex justify-between">
                            {/* Connection Lines */}
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full" />
                            <div
                                className="absolute top-1/2 left-0 h-1 bg-orange-500 -translate-y-1/2 transition-all duration-1000 rounded-full"
                                style={{
                                    width: order.status === 'Confirmed' ? '5%' :
                                        order.status === 'Packed' ? '33.3%' :
                                            order.status === 'Shipping' ? '66.6%' :
                                                order.status === 'Delivered' ? '100%' : '0%'
                                }}
                            />

                            {[
                                { id: 'Confirmed', label: 'Confirmed', icon: Clock },
                                { id: 'Packed', label: 'Packed', icon: Package },
                                { id: 'Shipping', label: 'Shipping', icon: Package },
                                { id: 'Delivered', label: 'Delivered', icon: CheckCircle }
                            ].map((step) => { // Removed index here
                                const stages = ['Confirmed', 'Packed', 'Shipping', 'Delivered'];
                                const currentIdx = stages.indexOf(order.status);
                                const stepIdx = stages.indexOf(step.id);
                                const isCompleted = stepIdx < currentIdx || order.status === 'Delivered';
                                const isActive = step.id === order.status;
                                const StepIcon = step.icon;

                                return (
                                    <div key={step.id} className="relative z-10 flex flex-col items-center">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${isCompleted || isActive
                                            ? 'bg-orange-500 border-orange-100 text-white shadow-lg shadow-orange-200'
                                            : 'bg-white border-gray-100 text-gray-300'
                                            }`}>
                                            <StepIcon size={18} />
                                        </div>
                                        <span className={`text-[10px] font-bold mt-2 uppercase tracking-tighter ${isActive ? 'text-orange-600' : 'text-gray-400'
                                            }`}>{step.label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Status & Date */}
                <div className="flex items-center justify-between pt-2">
                    <div>
                        <p className="text-xs text-[#93959F] uppercase font-black tracking-widest mb-1">Current Status</p>
                        <span className={`inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wide shadow-sm ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            {order.status}
                        </span>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-[#93959F] uppercase font-black tracking-widest mb-1">Time Log</p>
                        <p className="text-sm font-bold text-[#1C1C1C]">{formatDate(order.date)}</p>
                    </div>
                </div>

                {/* Customer Details */}
                <div className="bg-gray-50 p-4 rounded-xl">
                    <h3 className="font-bold text-sm text-[#1C1C1C] mb-3">Customer Details</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-[#60646C]">Name:</span>
                            <span className="font-semibold text-[#1C1C1C]">{order.customer.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[#60646C]">Phone:</span>
                            <span className="font-semibold text-[#1C1C1C]">{order.customer.phone}</span>
                        </div>
                        <div className="flex justify-between items-start">
                            <span className="text-[#60646C]">Address:</span>
                            <span className="font-semibold text-[#1C1C1C] text-right max-w-[250px]">
                                {order.customer.address}, {order.customer.city} - {order.customer.pincode}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Items */}
                <div>
                    <h3 className="font-bold text-sm text-[#1C1C1C] mb-3">Order Items</h3>
                    <div className="space-y-3">
                        {order.items.map((item, index) => {
                            const itemPrice = getProductPrice(item.price, item.cut);
                            return (
                                <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-sm text-[#1C1C1C]">{item.name}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-[#60646C]">{item.category}</span>
                                            <span className="text-xs text-[#93959F]">•</span>
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${item.cut === 'Uncut' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                                                }`}>
                                                {item.cut}
                                            </span>
                                        </div>
                                        <p className="text-xs text-[#60646C] mt-1">
                                            ₹{itemPrice}/kg × {item.quantity}kg = ₹{itemPrice * item.quantity}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Price Breakdown */}
                <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl">
                    <h3 className="font-bold text-sm text-[#1C1C1C] mb-3">Bill Details</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-[#60646C]">Item Total</span>
                            <span className="font-semibold text-[#1C1C1C]">₹{order.itemTotal || order.item_total || 0}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[#60646C]">Delivery Fee</span>
                            <span className="font-semibold text-[#1C1C1C]">₹{order.deliveryFee || order.delivery_fee || 0}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[#60646C]">Taxes & Charges</span>
                            <span className="font-semibold text-[#1C1C1C]">₹{order.taxesAndCharges || order.taxes_and_charges || 0}</span>
                        </div>
                        <div className="pt-2 border-t border-orange-300 flex justify-between">
                            <span className="font-bold text-[#1C1C1C]">Total Paid</span>
                            <span className="font-extrabold text-xl text-[#FC8019]">₹{order.finalAmount || order.final_amount || 0}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const MyOrders = () => {
    const { orders, user, getProductPrice } = useShop();
    const navigate = useNavigate();
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Filter orders for current user
    const userOrders = user
        ? orders.filter(order => order.userId === user.id || order.userEmail === user.email)
        : orders;

    // Separate current and past orders using new 4-stage system
    const currentOrders = userOrders.filter(order =>
        ['Confirmed', 'Packed', 'Shipping', 'Placed', 'Pending', 'Processing'].includes(order.status)
    );

    const pastOrders = userOrders.filter(order =>
        ['Delivered', 'Cancelled'].includes(order.status)
    );

    if (!user) {
        return (
            <div className="min-h-screen bg-[#F0F0F5] flex items-center justify-center p-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-[#1C1C1C] mb-4">Please Login</h2>
                    <p className="text-[#60646C] mb-6">You need to be logged in to view your orders.</p>
                    <button onClick={() => navigate('/login')} className="btn-primary">
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F0F0F5] py-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="mb-8">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center text-[#93959F] hover:text-[#FC8019] mb-4 transition-colors font-semibold"
                        >
                            <ArrowLeft size={18} className="mr-2" /> Back
                        </button>
                        <h1 className="text-3xl font-extrabold text-[#1C1C1C] tracking-tight">My Orders</h1>
                        <p className="text-[#60646C] mt-2">Track and manage your orders</p>
                    </div>

                    {userOrders.length === 0 ? (
                        <div className="text-center py-16">
                            <Package className="w-16 h-16 text-[#93959F] mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-[#1C1C1C] mb-2">No Orders Yet</h3>
                            <p className="text-[#60646C] mb-6">Start shopping to see your orders here!</p>
                            <button onClick={() => navigate('/menu')} className="btn-primary">
                                Browse Products
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* Current Orders */}
                            {currentOrders.length > 0 && (
                                <div>
                                    <h2 className="text-xl font-bold text-[#1C1C1C] mb-4 flex items-center gap-2">
                                        <Clock className="text-[#FC8019]" size={24} />
                                        Current Orders ({currentOrders.length})
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {currentOrders.map(order => (
                                            <OrderCard key={order.id} order={order} onClick={setSelectedOrder} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Past Orders */}
                            {pastOrders.length > 0 && (
                                <div>
                                    <h2 className="text-xl font-bold text-[#1C1C1C] mb-4 flex items-center gap-2">
                                        <CheckCircle className="text-gray-500" size={24} />
                                        Past Orders ({pastOrders.length})
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {pastOrders.map(order => (
                                            <OrderCard key={order.id} order={order} onClick={setSelectedOrder} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </FadeIn>
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    getProductPrice={getProductPrice}
                />
            )}
        </div>
    );
};

export default MyOrders;
