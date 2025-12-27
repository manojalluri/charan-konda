import React from 'react';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, Tag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import FadeIn from '../components/FadeIn';
import SEO from '../components/SEO';

const Cart = () => {
    const {
        cart,
        updateQuantity,
        removeFromCart,
        getProductPrice,
        calculateDeliveryFee,
        calculateTax,
        coupon,
        verifyCoupon,
        removeCoupon
    } = useShop();

    const navigate = useNavigate();

    // Calculate totals
    const total = cart.reduce((sum, item) => {
        const pricePerKg = getProductPrice(item.price, item.cut, item.readyToCookPrice);
        const quantityInKg = item.quantityInKg || 1;
        return sum + (pricePerKg * quantityInKg * item.quantity);
    }, 0);

    const deliveryFee = calculateDeliveryFee(total);
    const taxesAndCharges = calculateTax(total);
    const finalTotal = total + deliveryFee + taxesAndCharges;

    const handleApplyCoupon = async (code) => {
        if (!code) return;
        const result = await verifyCoupon(code, total);
        if (!result.success) {
            alert(result.message);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
                <SEO title="Empty Cart" />
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-400">
                    <ShoppingBag size={48} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
                <p className="text-gray-500 mb-8 max-w-xs text-center">Looks like you haven't added any fresh catch yet!</p>
                <Link to="/menu" className="btn-primary px-8">Browse Products</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F0F0F5] py-12">
            <SEO title="Your Cart - Cutora Fresh" />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <h1 className="text-3xl font-extrabold text-[#1C1C1C] mb-8 tracking-tight flex items-center gap-3">
                        Your Cart <span className="text-sm font-bold bg-orange-100 text-[#FC8019] px-2 py-1 rounded-lg">{cart.length} ITEMS</span>
                    </h1>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Cart Items */}
                        <div className="flex-1 space-y-4">
                            {cart.map((item) => {
                                const itemPrice = getProductPrice(item.price, item.cut, item.readyToCookPrice);
                                const quantityInKg = item.quantityInKg || 1;
                                const itemSubtotal = itemPrice * quantityInKg * item.quantity;

                                return (
                                    <div key={`${item.id}-${item.cut}-${quantityInKg}`} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-6 items-center hover:shadow-md transition-shadow relative overflow-hidden group">
                                        <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-bold text-[#1C1C1C] text-lg">{item.name}</h3>
                                                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded uppercase tracking-widest">{item.category}</span>
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-2 mt-2">
                                                        <span className={`text-[10px] font-extrabold px-2 py-1 rounded tracking-wider uppercase ${item.cut === 'Uncut'
                                                            ? 'bg-blue-100 text-blue-700'
                                                            : 'bg-green-100 text-green-700 shadow-sm border border-green-200'
                                                            }`}>
                                                            {item.cut}
                                                        </span>
                                                        <span className="text-gray-300">•</span>
                                                        <span className="text-xs font-bold text-[#FC8019] bg-orange-50 px-2 py-1 rounded">
                                                            {(quantityInKg * item.quantity).toFixed(2)} KG TOTAL
                                                        </span>
                                                    </div>
                                                    <p className="text-[11px] text-[#93959F] mt-2 font-medium">
                                                        Billing: {(quantityInKg * item.quantity).toFixed(2)}kg × ₹{itemPrice} ({item.quantity} units)
                                                    </p>
                                                </div>
                                                <div className="text-[#1C1C1C] font-extrabold text-lg">₹{Math.round(itemSubtotal)}</div>
                                            </div>

                                            <div className="flex items-center justify-between mt-4">
                                                <div className="flex items-center border border-[#FC8019]/30 rounded-lg overflow-hidden h-8">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.cut, item.quantity - 1, quantityInKg)}
                                                        className="px-2.5 h-full hover:bg-orange-50 text-[#60646C] font-bold transition-colors"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="px-3 font-bold text-[#FC8019] text-sm min-w-[2rem] text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.cut, item.quantity + 1, quantityInKg)}
                                                        className="px-2.5 h-full hover:bg-orange-50 text-[#FC8019] font-bold transition-colors"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => removeFromCart(item.id, item.cut, quantityInKg)}
                                                    className="text-[#93959F] hover:text-red-500 text-sm font-semibold transition-colors flex items-center gap-1 group/remove"
                                                >
                                                    <Trash2 size={16} className="group-hover/remove:shake" /> Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Summary Side */}
                        <div className="lg:w-96 space-y-6">
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                <h3 className="font-extrabold text-xl text-[#1C1C1C] mb-6">Bill Details</h3>

                                {/* Coupon */}
                                <div className="mb-6 pb-6 border-b border-dashed border-gray-200">
                                    <h4 className="font-bold text-sm text-[#93959F] uppercase tracking-wider mb-3">Offers & Discounts</h4>
                                    {coupon ? (
                                        <div className="bg-green-50 border border-green-100 rounded-xl p-3 flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                                    <Tag size={16} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-green-700 text-sm">{coupon.code}</p>
                                                    <p className="text-[10px] text-green-600 font-bold uppercase">₹{coupon.discount} SAVED</p>
                                                </div>
                                            </div>
                                            <button onClick={removeCoupon} className="text-red-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Enter Coupon"
                                                className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 uppercase font-bold transition-all"
                                                id="couponInput"
                                            />
                                            <button
                                                onClick={() => handleApplyCoupon(document.getElementById('couponInput').value)}
                                                className="bg-[#1C1C1C] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Charges */}
                                <div className="space-y-4 text-sm text-[#60646C] font-medium mb-6 pb-6 border-b border-dashed border-gray-200">
                                    <div className="flex justify-between">
                                        <span>Item Total</span>
                                        <span className="font-bold text-[#1C1C1C]">₹{Math.round(total)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Delivery Fee</span>
                                        <span className={`font-bold ${deliveryFee === 0 ? 'text-green-600' : 'text-[#1C1C1C]'}`}>
                                            {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Taxes and Charges</span>
                                        <span className="font-bold text-[#1C1C1C]">₹{taxesAndCharges}</span>
                                    </div>
                                    {coupon && (
                                        <div className="flex justify-between text-green-600 font-bold">
                                            <span className="flex items-center gap-1">Coupon Discount</span>
                                            <span>- ₹{coupon.discount}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-between font-extrabold text-2xl text-[#1C1C1C] mb-8">
                                    <span>To Pay</span>
                                    <span className="text-[#FC8019]">₹{Math.round(Math.max(0, finalTotal - (coupon?.discount || 0)))}</span>
                                </div>

                                <button
                                    onClick={() => navigate('/checkout')}
                                    className="w-full bg-[#FC8019] text-white py-4 rounded-2xl font-extrabold text-lg shadow-lg shadow-orange-500/30 hover:bg-[#E26E0F] transition-all active:scale-[0.98] flex items-center justify-center gap-3 uppercase tracking-wider"
                                >
                                    Proceed to Checkout <ArrowRight size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </div>
    );
};

export default Cart;
