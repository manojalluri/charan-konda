import React from 'react';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, Tag } from 'lucide-react'; // Added Tag
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import FadeIn from '../components/FadeIn';

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
    const total = cart.reduce((sum, item) => sum + (getProductPrice(item.price, item.cut) * item.quantity), 0);

    const deliveryFee = calculateDeliveryFee(total);
    const taxesAndCharges = calculateTax(total);
    // Base final total without discount
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
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
                <p className="text-gray-500 mb-8">Looks like you haven't added any fresh catch yet!</p>
                <Link to="/menu" className="btn-primary">Browse Products</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F0F0F5] py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <h1 className="text-3xl font-extrabold text-[#1C1C1C] mb-8 tracking-tight">Your Cart</h1>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Cart Items */}
                        <div className="flex-1 space-y-4">
                            {cart.map((item) => {
                                const itemPrice = getProductPrice(item.price, item.cut);
                                const itemSubtotal = itemPrice * item.quantity;

                                return (
                                    <div key={`${item.id}-${item.cut}`} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-6 items-center hover:shadow-md transition-shadow">
                                        <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-bold text-[#1C1C1C] text-lg">{item.name}</h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <p className="text-sm text-[#93959F] font-medium uppercase tracking-wide">
                                                            {item.category}
                                                        </p>
                                                        <span className="text-[#93959F]">•</span>
                                                        <span className={`text-xs font-bold px-2 py-1 rounded ${item.cut === 'Uncut'
                                                            ? 'bg-blue-100 text-blue-700'
                                                            : 'bg-green-100 text-green-700'
                                                            }`}>
                                                            {item.cut}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-[#60646C] mt-1">
                                                        ₹{itemPrice}/kg × {item.quantity} kg
                                                    </p>
                                                </div>
                                                <div className="text-[#1C1C1C] font-extrabold text-lg">₹{itemSubtotal}</div>
                                            </div>

                                            <div className="flex items-center justify-between mt-4">
                                                <div className="flex items-center border border-[#FC8019]/30 rounded-lg overflow-hidden h-8">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.cut, item.quantity - 1)}
                                                        className="px-2.5 h-full hover:bg-orange-50 text-[#60646C] font-bold"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="px-2 font-bold text-[#FC8019] text-sm w-8 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.cut, item.quantity + 1)}
                                                        className="px-2.5 h-full hover:bg-orange-50 text-[#FC8019] font-bold"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => removeFromCart(item.id, item.cut)}
                                                    className="text-[#93959F] hover:text-red-500 text-sm font-semibold transition-colors flex items-center gap-1"
                                                >
                                                    <Trash2 size={16} /> Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Summary */}
                        <div className="lg:w-96 h-fit bg-white p-8 rounded-3xl shadow-float border border-gray-100/50">
                            <h3 className="font-extrabold text-xl text-[#1C1C1C] mb-6">Bill Details</h3>

                            {/* Coupon Code Section */}
                            <div className="mb-6 pb-6 border-b border-dashed border-gray-200">
                                <h4 className="font-bold text-sm text-[#93959F] uppercase tracking-wider mb-2">Offers & Discounts</h4>
                                {coupon ? (
                                    <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-green-700 flex items-center gap-1">
                                                <Tag size={14} /> {coupon.code} Applied
                                            </p>
                                            <p className="text-xs text-green-600">You saved ₹{coupon.discount}</p>
                                        </div>
                                        <button onClick={removeCoupon} className="text-red-500 hover:bg-red-50 p-1 rounded">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Enter Coupon Code"
                                            className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500 uppercase font-bold"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleApplyCoupon(e.target.value);
                                            }}
                                            id="couponInput"
                                        />
                                        <button
                                            onClick={() => handleApplyCoupon(document.getElementById('couponInput').value)}
                                            className="bg-black text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-gray-800"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3 text-sm text-[#60646C] font-medium mb-6 pb-6 border-b border-dashed border-gray-200">
                                <div className="flex justify-between">
                                    <span>Item Total</span>
                                    <span className="font-semibold text-[#1C1C1C]">₹{Math.round(total)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Delivery Fee</span>
                                    <span className="font-semibold text-[#1C1C1C]">₹{deliveryFee}</span>
                                </div>
                                <div className="flex justify-between text-[#2ECC71]">
                                    <span>Taxes and Charges</span>
                                    <span className="font-semibold">₹{taxesAndCharges}</span>
                                </div>
                                {coupon && (
                                    <div className="flex justify-between text-green-600">
                                        <span className="flex items-center gap-1"><Tag size={12} /> Coupon Discount</span>
                                        <span className="font-bold">- ₹{coupon.discount}</span>
                                    </div>
                                )}
                            </div>

                            {/* Item Breakdown */}
                            <div className="space-y-2 mb-6 pb-6 border-b border-dashed border-gray-200">
                                <p className="text-xs font-bold text-[#93959F] uppercase tracking-wider mb-2">Items ({cart.length})</p>
                                {cart.map((item) => {
                                    const itemPrice = getProductPrice(item.price, item.cut);
                                    return (
                                        <div key={`${item.id}-${item.cut}`} className="flex justify-between text-xs">
                                            <span className="text-[#60646C]">
                                                {item.name.length > 25 ? item.name.substring(0, 25) + '...' : item.name}
                                                <span className={`ml-1 ${item.cut === 'Uncut' ? 'text-blue-600' : 'text-green-600'}`}>
                                                    ({item.cut})
                                                </span>
                                            </span>
                                            <span className="text-[#1C1C1C] font-semibold">₹{itemPrice * item.quantity}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="flex justify-between font-extrabold text-xl text-[#1C1C1C] mb-8">
                                <span>To Pay</span>
                                <span>₹{Math.max(0, finalTotal - (coupon?.discount || 0))}</span>
                            </div>

                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full btn-primary flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
                            >
                                PROCEED TO CHECKOUT <ArrowRight size={18} />
                            </button>
                            <p className="text-xs text-[#93959F] text-center mt-4 font-medium">
                                Review your order before payment
                            </p>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </div>
    );
};

export default Cart;
