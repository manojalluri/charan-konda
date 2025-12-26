import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, Home, Calendar, MapPin } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import FadeIn from '../components/FadeIn';

const OrderConfirmation = () => {
    const { orderId } = useParams();
    const { orders, getProductPrice } = useShop();
    const navigate = useNavigate();
    const [order] = useMemo(() => {
        // Find order in global state
        let found = orders.find(o => o.id === orderId);
        if (found) return [found];

        // Fallback to local storage
        try {
            const storedOrders = JSON.parse(localStorage.getItem('cutora-orders') || '[]');
            found = storedOrders.find(o => o.id === orderId);
            if (found) return [found];
        } catch (e) {
            console.error("Error reading orders from local storage", e);
        }
        return [null];
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


    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <FadeIn className="max-w-3xl mx-auto">
                {/* Success Banner */}
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden mb-8 text-center p-10">
                    <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <CheckCircle size={48} />
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Order Confirmed!</h1>
                    <div className="inline-block px-4 py-1.5 bg-orange-50 text-[#FC8019] rounded-full text-sm font-bold mb-4 border border-orange-100">
                        Order ID: #{order.id}
                    </div>
                    <p className="text-gray-500 text-lg max-w-md mx-auto">
                        Thank you for your purchase. Your order has been placed successfully and you can track your order using the order ID.
                    </p>
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
                                {(() => {
                                    // Merge same items (id + cut + quantityInKg) just for display safety
                                    const mergedItems = order.items.reduce((acc, current) => {
                                        const key = `${current.id}-${current.cut}-${current.quantityInKg || 1}`;
                                        if (acc[key]) {
                                            acc[key].quantity += current.quantity;
                                        } else {
                                            acc[key] = { ...current };
                                        }
                                        return acc;
                                    }, {});

                                    return Object.values(mergedItems).map((item, index) => {
                                        const weightPerUnit = item.quantityInKg || 1;
                                        const totalKg = weightPerUnit * item.quantity;
                                        const unitPrice = getProductPrice(item.price, item.cut);
                                        const lineTotal = Math.round(unitPrice * totalKg);

                                        return (
                                            <div key={index} className="py-5 flex justify-between items-center group">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center border border-orange-100/50">
                                                        <Package className="text-orange-500" size={24} />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 text-lg">{item.name}</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-[10px] font-extrabold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-md uppercase tracking-widest border border-orange-200/50">
                                                                {item.cut}
                                                            </span>
                                                            <span className="text-sm font-black text-[#FC8019]">
                                                                {totalKg.toFixed(2)}kg × ₹{unitPrice}
                                                            </span>
                                                        </div>
                                                        <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-tight">
                                                            {item.quantity} {item.quantity > 1 ? 'Units' : 'Unit'} of {weightPerUnit}kg each
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-black text-[#1C1C1C] text-xl">
                                                        ₹{lineTotal}
                                                    </p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase">
                                                        ₹{unitPrice}/kg
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    });
                                })()}
                            </div>
                            <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 font-medium">Item Total</span>
                                    <span className="text-gray-900 font-semibold">₹{order.itemTotal || order.item_total || 0}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 font-medium">Delivery Fee</span>
                                    <span className="text-gray-900 font-semibold">₹{order.deliveryFee || order.delivery_fee || 0}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 font-medium">Taxes & Charges</span>
                                    <span className="text-gray-900 font-semibold">₹{order.taxesAndCharges || order.taxes_and_charges || 0}</span>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                                    <span className="font-bold text-gray-700">Total Amount</span>
                                    <span className="text-2xl font-extrabold text-orange-600">₹{order.finalAmount || order.final_amount || 0}</span>
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
                                onClick={() => navigate('/track-order', { state: { orderId: order.id } })}
                                className="w-full px-6 py-3 bg-[#FC8019] text-white rounded-xl hover:bg-[#E26E0F] transition-all font-bold flex items-center justify-center gap-2 mb-3 shadow-md active:scale-95"
                            >
                                <Package size={18} />
                                Track Your Order
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
                            <ul className="text-sm text-blue-800 space-y-2">
                                <li>
                                    <strong>Payment:</strong> Amount should be paid during the confirmation call.
                                </li>
                                <li>
                                    <strong>Cancellation:</strong> You can cancel your order ONLY during the confirmation call.
                                </li>
                                <li>
                                    <strong>No Return:</strong> Once the order is confirmed and paid, no cancellations or returns are accepted.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </FadeIn>
        </div>
    );
};

export default OrderConfirmation;
