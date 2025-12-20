import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, User, Loader } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import FadeIn from '../components/FadeIn';

const Checkout = () => {
    const { cart, placeOrder, getProductPrice, user } = useShop();
    const navigate = useNavigate();

    // Redirect if cart is empty, but only if not placing an order
    useEffect(() => {
        if (cart.length === 0) {
            // We allow the component to mount even if empty, but redirecting 
            // usually happens if user navigates here directly.
            // However, to prevent "flash" of empty checkout when order is placed (and cart cleared),
            // we depend on the navigation in handleSubmit happening fast.
            // Better practice: Don't auto-redirect here if we can avoid it, or use a slightly delayed redirect.
            // For now, per instructions, we REMOVE aggressive redirects.
            const timer = setTimeout(() => {
                if (cart.length === 0) navigate('/cart');
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [cart.length, navigate]);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: '',
        address: '',
        city: '',
        pincode: '',
        paymentMethod: 'COD' // Default
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Calculate total with dynamic pricing
    const itemTotal = cart.reduce((sum, item) => {
        const itemPrice = getProductPrice(item.price, item.cut);
        return sum + (itemPrice * item.quantity);
    }, 0);

    const deliveryFee = 40;
    const taxesAndCharges = 25;
    const finalAmount = itemTotal + deliveryFee + taxesAndCharges;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Robust Unique Order ID Generation
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
            // Generate unique order ID
            const orderId = generateOrderId();

            // Prepare order data
            const orderDetails = {
                id: orderId,
                customer: formData,
                items: cart,
                itemTotal,
                deliveryFee,
                taxesAndCharges,
                finalAmount,
                date: new Date().toISOString(),
                status: 'Confirmed',
                userId: user?.id,
                userEmail: user?.email || formData.email,
                paymentMethod: 'COD',
                paymentStatus: 'Pending'
            };

            // For COD: Place order using Context (saves to DB/Local)
            await placeOrder(orderDetails);

            // Navigate to confirmation page
            navigate(`/order-confirmation/${orderId}`);

        } catch (error) {
            console.error("Order placement failed:", error);
            setIsSubmitting(false);
            alert("Failed to place order. Please try again.");
        }
    };

    if (cart.length === 0 && !isSubmitting) {
        // Show empty state instead of redirecting immediately to avoid hook issues
        // or just let the useEffect handle it.
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
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <h4 className="font-bold text-sm text-[#93959F] uppercase tracking-wider mb-3">Order Summary</h4>
                                <div className="space-y-2 text-sm">
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
                                </div>
                            </div>

                            <div className="pt-6 border-t border-dashed border-gray-200">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="font-bold text-lg text-[#1C1C1C]">Total Amount</span>
                                    <span className="font-extrabold text-2xl text-[#FC8019]">₹{finalAmount}</span>
                                </div>

                                <p className="text-sm text-[#60646C] mb-6 bg-orange-50 p-4 rounded-xl border border-orange-100 flex items-start gap-3 font-medium">
                                    <span className="text-xl">💵</span>
                                    <span>Payment Mode: <strong>Cash on Delivery</strong> or <strong>UPI</strong> upon delivery. <br /> Please keep exact change if possible.</span>
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
