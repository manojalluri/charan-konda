import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Package, MapPin, Calendar, Clock, CheckCircle } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import FadeIn from '../components/FadeIn';

const TrackOrder = () => {
    const { orders } = useShop();
    const location = useLocation();
    const [orderIdInput, setOrderIdInput] = useState('');
    const [order, setOrder] = useState(null);
    const [error, setError] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        if (location.state?.orderId && orders.length > 0) {
            setOrderIdInput(location.state.orderId);
            // Trigger tracking automatically
            const foundOrder = orders.find(o => o.id === location.state.orderId);
            if (foundOrder) {
                setOrder(foundOrder);
            }
        }
    }, [location.state, orders]);

    const handleTrack = (e) => {
        if (e) e.preventDefault();
        setError('');
        setIsSearching(true);

        // Simulate a small delay for better UX
        setTimeout(() => {
            const foundOrder = orders.find(o =>
                o.id.toLowerCase().trim() === orderIdInput.toLowerCase().trim()
            );

            if (foundOrder) {
                setOrder(foundOrder);
                setError('');
            } else {
                setOrder(null);
                setError('Order not found. Please check your Order ID.');
            }
            setIsSearching(false);
        }, 600);
    };

    const getStatusIndex = (status) => {
        const stages = ['Confirmed', 'Packed', 'Shipping', 'Delivered'];
        return stages.indexOf(status || 'Confirmed');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <FadeIn>
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-extrabold text-[#1C1C1C] mb-4">Track Your Order</h1>
                        <p className="text-gray-500 font-medium">Enter your Order ID to see real-time delivery status</p>
                    </div>

                    {/* Search Bar */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-8">
                        <form onSubmit={handleTrack} className="flex gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    value={orderIdInput}
                                    onChange={(e) => setOrderIdInput(e.target.value)}
                                    placeholder="Enter Order ID (e.g. CF-XXXX-XXXX)"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#FC8019] transition-all font-mono text-sm"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isSearching}
                                className="bg-[#FC8019] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#e26e0f] transition-all shadow-lg shadow-orange-500/20 disabled:opacity-70 flex items-center gap-2"
                            >
                                {isSearching ? 'SEARCHING...' : 'TRACK'}
                            </button>
                        </form>
                        {error && <p className="text-red-500 text-xs font-bold mt-3 ml-4 uppercase tracking-wider">{error}</p>}
                    </div>

                    {/* Order Information */}
                    {order && (
                        <div className="space-y-6">
                            {/* Status Stepper */}
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-full text-xs font-bold text-orange-600 mb-8 border border-orange-100 uppercase tracking-widest">
                                    Current Status: {order.status}
                                </div>

                                <div className="relative flex justify-between max-w-xl mx-auto px-4">
                                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full" />
                                    <div
                                        className="absolute top-1/2 left-0 h-1 bg-orange-500 -translate-y-1/2 transition-all duration-1000 rounded-full"
                                        style={{ width: `${(getStatusIndex(order.status) / 3) * 100}%` }}
                                    />

                                    {[
                                        { id: 'Confirmed', label: 'Confirmed', icon: Clock },
                                        { id: 'Packed', label: 'Packed', icon: Package },
                                        { id: 'Shipping', label: 'Shipping', icon: Package },
                                        { id: 'Delivered', label: 'Delivered', icon: CheckCircle }
                                    ].map((step, idx) => {
                                        const currentStages = ['Confirmed', 'Packed', 'Shipping', 'Delivered'];
                                        const currentIdx = currentStages.indexOf(order.status || 'Confirmed');
                                        const isCompleted = idx < currentIdx;
                                        const isActive = idx === currentIdx;
                                        const StepIcon = step.icon;

                                        return (
                                            <div key={step.id} className="relative z-10 flex flex-col items-center">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${isCompleted || isActive
                                                    ? 'bg-orange-500 border-orange-100 text-white shadow-lg shadow-orange-200'
                                                    : 'bg-white border-gray-100 text-gray-300'
                                                    }`}>
                                                    <StepIcon size={18} />
                                                </div>
                                                <span className={`text-[10px] font-black mt-2 uppercase tracking-tighter ${isActive ? 'text-orange-600' : 'text-gray-400'}`}>
                                                    {step.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Order Summary */}
                                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                                    <h3 className="text-lg font-bold text-[#1C1C1C] mb-6 flex items-center gap-2">
                                        <Package className="text-[#FC8019]" size={20} /> Order Items
                                    </h3>
                                    <div className="space-y-4">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                                                <div>
                                                    <p className="font-bold text-[#1C1C1C] text-sm">{item.name}</p>
                                                    <p className="text-xs text-gray-500 font-medium">{item.cut} • {item.quantity}kg</p>
                                                </div>
                                                <p className="font-bold text-[#1C1C1C]">₹{item.price * item.quantity}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-8 pt-6 border-t border-dashed border-gray-200 space-y-3">
                                        <div className="flex justify-between text-sm text-gray-500 font-medium">
                                            <span>Subtotal</span>
                                            <span className="text-[#1C1C1C]">₹{order.itemTotal}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-500 font-medium">
                                            <span>Delivery Fee</span>
                                            <span className="text-[#1C1C1C]">₹{order.deliveryFee}</span>
                                        </div>
                                        <div className="flex justify-between text-lg font-black text-[#1C1C1C] pt-2">
                                            <span>Total Paid</span>
                                            <span className="text-[#FC8019]">₹{order.finalAmount}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Delivery Info */}
                                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                                    <h3 className="text-lg font-bold text-[#1C1C1C] mb-6 flex items-center gap-2">
                                        <MapPin className="text-[#FC8019]" size={20} /> Delivery Info
                                    </h3>
                                    <div className="space-y-6">
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Customer</p>
                                            <p className="font-bold text-[#1C1C1C]">{order.customer.name}</p>
                                            <p className="text-sm text-gray-500 font-medium">{order.customer.phone}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Shipping Address</p>
                                            <p className="font-bold text-[#1C1C1C] leading-snug">{order.customer.address}</p>
                                            <p className="text-sm text-gray-500 font-medium">{order.customer.city} - {order.customer.pincode}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Ordered On</p>
                                            <p className="font-bold text-[#1C1C1C] flex items-center gap-2">
                                                <Calendar size={14} className="text-[#FC8019]" />
                                                {new Date(order.date).toLocaleDateString('en-IN', { dateStyle: 'long' })}
                                            </p>
                                        </div>
                                        {order.trackingId && (
                                            <div className="pt-4 border-t border-gray-100">
                                                <p className="text-[10px] font-black text-[#FC8019] uppercase tracking-widest mb-2">Tracking Information</p>
                                                <div className="flex gap-4">
                                                    <div className="flex-1">
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Tracking ID</p>
                                                        <p className="font-mono font-bold text-[#1C1C1C] text-sm">{order.trackingId}</p>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Courier</p>
                                                        <p className="font-bold text-[#1C1C1C] text-sm">{order.courierPartner || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center pt-8">
                                <button
                                    onClick={() => window.location.href = '/'}
                                    className="bg-white border-2 border-gray-100 px-10 py-4 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-200 transition-all shadow-sm flex items-center gap-3 active:scale-95"
                                >
                                    <Clock size={20} className="text-gray-400" />
                                    BACK TO HOME
                                </button>
                            </div>
                        </div>
                    )}
                </FadeIn>
            </div>
        </div>
    );
};

export default TrackOrder;
