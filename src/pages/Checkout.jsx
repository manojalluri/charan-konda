import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, User, Loader, CreditCard, Banknote } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import FadeIn from '../components/FadeIn';
import { api } from '../lib/api';

const Checkout = () => {
    const { cart, placeOrder, getProductPrice, user, calculateDeliveryFee, calculateTax, coupon, siteConfig } = useShop();
    const navigate = useNavigate();

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Redirect if cart is empty (unless we are currently submitting)
    useEffect(() => {
        if (cart.length === 0 && !isSubmitting) {
            const timer = setTimeout(() => {
                if (cart.length === 0 && !isSubmitting) navigate('/cart');
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [cart.length, navigate, isSubmitting]);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: '',
        email: user?.email || '',
        address: '',
        city: '',
        pincode: '',
        paymentMethod: 'Online'
    });

    // Update name when user data loads
    useEffect(() => {
        if (user?.name && !formData.name) {
            setTimeout(() => {
                setFormData(prev => ({ ...prev, name: user.name }));
            }, 0);
        }
    }, [user, formData.name]);

    // Set default payment method based on config
    useEffect(() => {
        if (siteConfig) {
            // If only Online is explicitly ON, or COD is explicitly OFF
            if (siteConfig.onlinePaymentEnabled !== false && siteConfig.codEnabled === false) {
                setFormData(prev => ({ ...prev, paymentMethod: 'Online' }));
            }
            // If only COD is explicitly ON, or Online is explicitly OFF
            else if (siteConfig.onlinePaymentEnabled === false && siteConfig.codEnabled !== false) {
                setFormData(prev => ({ ...prev, paymentMethod: 'PayOnConfirmation' }));
            }
        }
    }, [siteConfig]);

    // Calculate totals - FIXED: Now properly accounts for quantityInKg
    const itemTotal = cart.reduce((sum, item) => {
        const pricePerKg = getProductPrice(item.price, item.cut, item.readyToCookPrice);
        const quantityInKg = item.quantityInKg || 1;
        return sum + (pricePerKg * quantityInKg * item.quantity);
    }, 0);

    const deliveryFee = calculateDeliveryFee(itemTotal);
    const taxesAndCharges = calculateTax(itemTotal);
    const baseTotal = itemTotal + deliveryFee + taxesAndCharges;
    const discountAmount = coupon ? coupon.discount : 0;
    const finalAmount = Math.max(0, baseTotal - discountAmount);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const generateOrderId = () => {
        const timestamp = Date.now().toString(36).toUpperCase().slice(-4);
        const random = Math.random().toString(36).toUpperCase().slice(2, 6);
        return `CF-${timestamp}-${random}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (cart.length === 0) return;

        setIsSubmitting(true);

        try {
            const orderId = generateOrderId();

            if (formData.paymentMethod === 'Online') {
                // 1. Create Order on Backend (Razorpay Order)
                const rzpOrder = await api.post('/payments/create-order', {
                    amount: finalAmount,
                    currency: 'INR',
                    receipt: orderId
                });

                // 2. Open Razorpay Modal
                if (typeof window.Razorpay === 'undefined') {
                    throw new Error("Razorpay payment system is not ready. Please refresh the page or check your internet connection.");
                }

                const options = {
                    key: import.meta.env.VITE_RAZORPAY_KEY_ID || siteConfig.razorpay_key_id || 'rzp_test_placeholder',
                    amount: rzpOrder.amount,
                    currency: rzpOrder.currency,
                    name: "Cutora Fresh",
                    description: `Order ${orderId}`,
                    order_id: rzpOrder.id,
                    handler: async function (response) {
                        // 3. Verify Payment on Backend
                        try {
                            const verification = await api.post('/payments/verify', {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            });

                            if (verification.success) {
                                // 4. Place Actual Order
                                const orderDetails = {
                                    id: orderId,
                                    customer: formData,
                                    items: cart,
                                    itemTotal,
                                    deliveryFee,
                                    taxesAndCharges,
                                    finalAmount,
                                    discount: discountAmount,
                                    couponCode: coupon?.code,
                                    date: new Date().toISOString(),
                                    status: 'Confirmed',
                                    userId: user?.id,
                                    userEmail: user?.email || formData.email,
                                    paymentMethod: 'Online',
                                    paymentStatus: 'Paid',
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_order_id: response.razorpay_order_id
                                };

                                await placeOrder(orderDetails);
                                navigate(`/order-confirmation/${orderId}`);
                            } else {
                                alert('Payment verification failed. Please contact support.');
                                setIsSubmitting(false);
                            }
                        } catch (err) {
                            console.error("Verification error:", err);
                            alert('Payment verification failed: ' + (err.message || 'Unknown error'));
                            setIsSubmitting(false);
                        }
                    },
                    prefill: {
                        name: formData.name,
                        email: formData.email,
                        contact: formData.phone
                    },
                    theme: {
                        color: "#FC8019"
                    },
                    modal: {
                        ondismiss: function () {
                            setIsSubmitting(false);
                        }
                    }
                };

                const rzp1 = new window.Razorpay(options);
                rzp1.on('payment.failed', function (response) {
                    alert('Payment Failed: ' + response.error.description);
                    setIsSubmitting(false);
                });
                rzp1.open();

            } else {
                // COD / Pay on Confirmation Flow
                const orderDetails = {
                    id: orderId,
                    customer: formData,
                    items: cart,
                    itemTotal,
                    deliveryFee,
                    taxesAndCharges,
                    finalAmount,
                    discount: discountAmount,
                    couponCode: coupon?.code,
                    date: new Date().toISOString(),
                    status: 'Confirmed',
                    userId: user?.id,
                    userEmail: user?.email || formData.email,
                    paymentMethod: 'PayOnConfirmation',
                    paymentStatus: 'Pending'
                };

                await placeOrder(orderDetails);
                navigate(`/order-confirmation/${orderId}`);
            }

        } catch (error) {
            console.error("Order placement failed:", error);
            alert(`Failed: ${error.message || 'Unknown error'}`);
            setIsSubmitting(false);
        }
    };

    if (cart.length === 0 && !isSubmitting) {
        return (
            <div className="min-h-screen bg-[#F0F0F5] flex items-center justify-center">
                <p className="text-gray-500">Redirecting to cart...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F0F0F5] py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <h1 className="text-3xl font-extrabold text-[#1C1C1C] mb-8 text-center tracking-tight">Checkout</h1>

                    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-card border border-gray-100">
                        <div className="space-y-8">

                            <div className="space-y-4">
                                <h3 className="font-bold text-lg flex items-center gap-2 text-[#1C1C1C]">
                                    <User size={20} className="text-[#FC8019]" /> Personal Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        required
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Full Name"
                                        className="w-full p-3.5 bg-white rounded-lg border border-gray-200 focus:border-[#FC8019] focus:ring-1 focus:ring-[#FC8019] outline-none transition-all placeholder-gray-400 font-medium"
                                    />
                                    <input
                                        required
                                        name="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Mobile Number (10 digits)"
                                        pattern="[0-9]{10}"
                                        className="w-full p-3.5 bg-white rounded-lg border border-gray-200 focus:border-[#FC8019] focus:ring-1 focus:ring-[#FC8019] outline-none transition-all placeholder-gray-400 font-medium"
                                    />
                                    <input
                                        required
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Email Address"
                                        className="w-full p-3.5 bg-white rounded-lg border border-gray-200 focus:border-[#FC8019] focus:ring-1 focus:ring-[#FC8019] outline-none transition-all placeholder-gray-400 font-medium md:col-span-2"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-bold text-lg flex items-center gap-2 text-[#1C1C1C]">
                                    <MapPin size={20} className="text-[#FC8019]" /> Delivery Address
                                </h3>
                                <textarea
                                    required
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="House No, Street, Landmark"
                                    rows="3"
                                    className="w-full p-3.5 bg-white rounded-lg border border-gray-200 focus:border-[#FC8019] focus:ring-1 focus:ring-[#FC8019] outline-none transition-all placeholder-gray-400 font-medium"
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        required
                                        name="city"
                                        onChange={handleChange}
                                        value={formData.city}
                                        placeholder="City"
                                        className="w-full p-3.5 bg-white rounded-lg border border-gray-200 focus:border-[#FC8019] focus:ring-1 focus:ring-[#FC8019] outline-none transition-all placeholder-gray-400 font-medium"
                                    />
                                    <input
                                        required
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleChange}
                                        placeholder="Pincode"
                                        pattern="[0-9]{6}"
                                        className="w-full p-3.5 bg-white rounded-lg border border-gray-200 focus:border-[#FC8019] focus:ring-1 focus:ring-[#FC8019] outline-none transition-all placeholder-gray-400 font-medium"
                                    />
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="bg-gray-50 p-6 rounded-2xl mb-6">
                                <h4 className="font-bold text-sm text-[#93959F] uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">Order Summary</h4>

                                {/* Itemized List */}
                                <div className="space-y-4 mb-6">
                                    {cart.map((item, idx) => {
                                        const pricePerKg = getProductPrice(item.price, item.cut, item.readyToCookPrice);
                                        const totalWeight = (item.quantityInKg || 1) * item.quantity;
                                        return (
                                            <div key={idx} className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-bold text-[#1C1C1C] text-sm">{item.name}</p>
                                                        <span className="text-[9px] font-bold text-gray-400 uppercase">{item.category}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-[10px] font-bold text-orange-600 px-1.5 py-0.5 bg-orange-50 rounded uppercase">{item.cut}</span>
                                                        <span className="text-gray-300">•</span>
                                                        <span className="text-[10px] font-bold text-[#FC8019]">{totalWeight.toFixed(2)}kg × ₹{pricePerKg}</span>
                                                        <span className="text-gray-300">•</span>
                                                        <span className="text-[10px] font-bold text-gray-400">({item.quantity} units)</span>
                                                    </div>
                                                </div>
                                                <p className="font-bold text-[#1C1C1C] text-sm">₹{Math.round(pricePerKg * totalWeight)}</p>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="space-y-2 text-sm border-t border-gray-200 pt-4">
                                    <div className="flex justify-between">
                                        <span className="text-[#60646C]">Item Total</span>
                                        <span className="font-semibold text-[#1C1C1C]">₹{itemTotal}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[#60646C]">Delivery Fee</span>
                                        <span className="font-semibold text-[#1C1C1C]">₹{deliveryFee}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[#60646C]">Taxes & Charges</span>
                                        <span className="font-semibold text-[#1C1C1C]">₹{taxesAndCharges}</span>
                                    </div>
                                    {coupon && (
                                        <div className="flex justify-between text-green-600 font-bold">
                                            <span>Coupon ({coupon.code})</span>
                                            <span>- ₹{coupon.discount}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="pt-6 border-t border-dashed border-gray-200">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="font-bold text-lg text-[#1C1C1C]">Total Amount</span>
                                    <span className="font-extrabold text-2xl text-[#FC8019]">₹{finalAmount}</span>
                                </div>

                                {(siteConfig?.onlinePaymentEnabled !== false || siteConfig?.codEnabled !== false || !siteConfig) && (
                                    <div className="space-y-4 mb-6">
                                        {(siteConfig?.onlinePaymentEnabled !== false && siteConfig?.codEnabled !== false || !siteConfig) && (
                                            <h4 className="font-bold text-sm text-[#93959F] uppercase tracking-wider mb-2">Select Payment Method</h4>
                                        )}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {(siteConfig?.onlinePaymentEnabled !== false || !siteConfig) && (
                                                <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'Online' ? 'border-[#FC8019] bg-orange-50' : 'border-gray-100 bg-white'}`}>
                                                    <input
                                                        type="radio"
                                                        name="paymentMethod"
                                                        value="Online"
                                                        checked={formData.paymentMethod === 'Online'}
                                                        onChange={handleChange}
                                                        className="hidden"
                                                    />
                                                    <div className={`p-2 rounded-lg ${formData.paymentMethod === 'Online' ? 'bg-[#FC8019] text-white' : 'bg-gray-100 text-gray-400'}`}>
                                                        <CreditCard size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm">Pay Online</p>
                                                        <p className="text-[10px] text-gray-500">UPI, Cards, Net Banking</p>
                                                    </div>
                                                </label>
                                            )}

                                            {(siteConfig?.codEnabled !== false || !siteConfig) && (
                                                <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'PayOnConfirmation' ? 'border-[#FC8019] bg-orange-50' : 'border-gray-100 bg-white'}`}>
                                                    <input
                                                        type="radio"
                                                        name="paymentMethod"
                                                        value="PayOnConfirmation"
                                                        checked={formData.paymentMethod === 'PayOnConfirmation'}
                                                        onChange={handleChange}
                                                        className="hidden"
                                                    />
                                                    <div className={`p-2 rounded-lg ${formData.paymentMethod === 'PayOnConfirmation' ? 'bg-[#FC8019] text-white' : 'bg-gray-100 text-gray-400'}`}>
                                                        <Banknote size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm">Pay on Confirmation</p>
                                                        <p className="text-[10px] text-gray-500">Pay via UPI during confirmation call</p>
                                                    </div>
                                                </label>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <p className="text-sm text-[#60646C] mb-6 bg-orange-50 p-4 rounded-xl border border-orange-100 flex items-start gap-3 font-medium">
                                    <span className="text-xl">ℹ️</span>
                                    <span>
                                        {formData.paymentMethod === 'Online'
                                            ? "Securely pay using Razorpay gateway. Your order will be confirmed instantly."
                                            : "Payment Mode: Pay on Confirmation. You will have to pay via UPI once our team calls you to confirm the order."
                                        }
                                    </span>
                                </p>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full btn-primary py-4 text-lg shadow-lg shadow-orange-500/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader className="animate-spin" size={24} />
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        'PLACE ORDER'
                                    )}
                                </button>
                            </div>

                        </div>
                    </form>
                </FadeIn>
            </div>
        </div>
    );
};

export default Checkout;
