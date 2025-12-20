import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, MessageCircle, Package, Home, Calendar, MapPin, Clock } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import FadeIn from '../components/FadeIn';

const OrderConfirmation = () => {
    const { orderId } = useParams();
    const { orders } = useShop();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        // Find order in global state (which should be synced with local storage/DB)
        const foundOrder = orders.find(o => o.id === orderId);

        if (foundOrder) {
            setOrder(foundOrder);
        } else {
            // If not found immediately, it might be syncing. 
            // For now, we rely on orders being present. 
            // In a real app, we might want to fetch from DB individually if not in state.
            const storedOrders = JSON.parse(localStorage.getItem('cutora-orders') || '[]');
            const localOrder = storedOrders.find(o => o.id === orderId);
            if (localOrder) {
                setOrder(localOrder);
            }
        }
    }, [orderId, orders]);

    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center animate-pulse">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading order details...</p>
                </div>
            </div>
        );
    }

    const sendWhatsAppMessage = () => {
        if (!order) return;

        const itemsList = order.items.map(item =>
            `- ${item.name} (${item.cut}) – ${item.quantity}kg`
        ).join('\n');

        const message = `Hi, I have placed an order on Cutora Fishes.

Order ID: ${order.id}
Name: ${order.customer.name}
Phone: ${order.customer.phone}
Address: ${order.customer.address}, ${order.customer.city} - ${order.customer.pincode}

Items:
${itemsList}

Item Total: ₹${order.itemTotal}
Delivery Fee: ₹${order.deliveryFee}
Taxes & Charges: ₹${order.taxesAndCharges}
Total Amount: ₹${order.finalAmount}
Payment: Cash on Delivery

Please confirm. Thank you.`;

        const whatsappLink = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
        window.open(whatsappLink, '_blank');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <FadeIn className="max-w-3xl mx-auto">
                {/* Success Banner */}
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden mb-8 text-center p-10">
                    <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <CheckCircle size={48} />
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Order Confirmed!</h1>
                    <p className="text-gray-500 text-lg max-w-md mx-auto">
                        Thank you for your purchase. Your order has been placed successfully.
                    </p>

                    {/* Status Tracking Stepper */}
                    <div className="mt-12 max-w-xl mx-auto px-4">
                        <div className="relative flex justify-between">
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full" />
                            <div
                                className="absolute top-1/2 left-0 h-1 bg-orange-500 -translate-y-1/2 transition-all duration-1000 rounded-full"
                                style={{
                                    width: order.status === 'Confirmed' ? '5%' :
                                        order.status === 'Packed' ? '33.3%' :
                                            order.status === 'Shipping' ? '66.6%' :
                                                order.status === 'Delivered' ? '100%' : '5%' // Default to 5% for Confirmed
                                }}
                            />

                            {[
                                { id: 'Confirmed', label: 'Confirmed', icon: Clock },
                                { id: 'Packed', label: 'Packed', icon: Package },
                                { id: 'Shipping', label: 'Shipping', icon: Package },
                                { id: 'Delivered', label: 'Delivered', icon: CheckCircle }
                            ].map((step, index) => {
                                const stages = ['Confirmed', 'Packed', 'Shipping', 'Delivered'];
                                const currentIdx = stages.indexOf(order.status || 'Confirmed');
                                const stepIdx = stages.indexOf(step.id);
                                const isCompleted = stepIdx < currentIdx || order.status === 'Delivered';
                                const isActive = step.id === (order.status || 'Confirmed');
                                const StepIcon = step.icon;

                                return (
                                    <div key={step.id} className="relative z-10 flex flex-col items-center">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${isCompleted || isActive
                                            ? 'bg-orange-500 border-orange-100 text-white shadow-lg shadow-orange-200'
                                            : 'bg-white border-gray-100 text-gray-300'
                                            }`}>
                                            <StepIcon size={18} />
                                        </div>
                                        <span className={`text-[10px] font-black mt-2 uppercase tracking-tighter ${isActive ? 'text-orange-600' : 'text-gray-400'
                                            }`}>{step.label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mt-10 inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-mono font-medium text-gray-700">
                        <span className="text-gray-400">TRACKING ID:</span>
                        <span className="text-orange-600 font-bold select-all">{order.id}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Order Details (Left Column) */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Order Items */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Package className="text-orange-500" size={20} />
                                Order Items
                            </h2>
                            <div className="divide-y divide-gray-100">
                                {order.items.map((item, index) => (
                                    <div key={index} className="py-4 flex justify-between items-center group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                                <Package className="text-orange-400" size={18} />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{item.name}</p>
                                                <p className="text-sm text-gray-500">
                                                    {item.cut} • {item.quantity}kg
                                                </p>
                                            </div>
                                        </div>
                                        <p className="font-semibold text-gray-900">
                                            ₹{(item.price || 0) * item.quantity}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 font-medium">Item Total</span>
                                    <span className="text-gray-900 font-semibold">₹{order.itemTotal}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 font-medium">Delivery Fee</span>
                                    <span className="text-gray-900 font-semibold">₹{order.deliveryFee}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 font-medium">Taxes & Charges</span>
                                    <span className="text-gray-900 font-semibold">₹{order.taxesAndCharges}</span>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                                    <span className="font-bold text-gray-700">Total Amount</span>
                                    <span className="text-2xl font-extrabold text-orange-600">₹{order.finalAmount}</span>
                                </div>
                            </div>
                        </div>

                        {/* Customer Info */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <MapPin className="text-orange-500" size={20} />
                                Delivery Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Customer</p>
                                    <p className="font-medium text-gray-900">{order.customer.name}</p>
                                    <p className="text-sm text-gray-500">{order.customer.phone}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Address</p>
                                    <p className="font-medium text-gray-900">{order.customer.address}</p>
                                    <p className="text-sm text-gray-500">{order.customer.city} - {order.customer.pincode}</p>
                                </div>
                                <div className="sm:col-span-2">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Order Date</p>
                                    <p className="font-medium text-gray-900 flex items-center gap-2">
                                        <Calendar size={16} className="text-gray-400" />
                                        {new Date(order.date).toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions (Right Column) */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-bold text-gray-900 mb-2">What's Next?</h3>
                            <p className="text-sm text-gray-500 mb-6">
                                We have received your order. We will call you to confirm delivery timing.
                            </p>

                            <button
                                onClick={sendWhatsAppMessage}
                                className="w-full mb-3 flex items-center justify-center gap-2 px-6 py-4 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all font-bold shadow-lg shadow-green-500/30 transform active:scale-95"
                            >
                                <MessageCircle size={20} />
                                Confirm on WhatsApp
                            </button>

                            <button
                                onClick={() => navigate('/track-order', { state: { orderId: order.id } })}
                                className="w-full mb-3 px-6 py-3 bg-white border-2 border-orange-100 text-orange-600 rounded-xl hover:bg-orange-50 hover:border-orange-200 transition-colors font-semibold"
                            >
                                Track My Order
                            </button>

                            <button
                                onClick={() => navigate('/')}
                                className="w-full px-6 py-3 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors font-medium flex items-center justify-center gap-2"
                            >
                                <Home size={18} />
                                Back to Home
                            </button>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl">
                            <p className="text-sm text-blue-800 text-center">
                                <strong>Note:</strong> Payment will be collected via Cash or UPI at the time of delivery.
                            </p>
                        </div>
                    </div>
                </div>
            </FadeIn>
        </div>
    );
};

export default OrderConfirmation;
