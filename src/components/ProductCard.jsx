import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, Info } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const ProductCard = ({ product }) => {
    const { addToCart, cart, updateQuantity, removeFromCart } = useShop();
    const [selectedCut, setSelectedCut] = useState(product.cuts[0]);
    const [isExpanded, setIsExpanded] = useState(false);

    // Find if this specific product and cut is in cart
    const cartItem = cart.find(item => item.id === product.id && item.cut === selectedCut);
    const quantity = cartItem ? cartItem.quantity : 0;

    const handleAdd = () => {
        addToCart(product, 1, selectedCut);
    };

    const handleIncrement = () => {
        updateQuantity(product.id, selectedCut, quantity + 1);
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            updateQuantity(product.id, selectedCut, quantity - 1);
        } else {
            removeFromCart(product.id, selectedCut);
        }
    };

    return (

        <div
            onClick={() => setIsExpanded(!isExpanded)}
            className="bg-white rounded-3xl shadow-card border border-gray-100 overflow-hidden hover:shadow-float transition-all duration-300 group flex flex-col h-full relative cursor-pointer"
        >
            {/* Image Area */}
            <Link to={`/product/${product.id}`} className="relative h-56 overflow-hidden block">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                {!product.stock && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
                        <span className="bg-white/10 text-white border border-white/50 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest backdrop-blur-md">
                            Out of Stock
                        </span>
                    </div>
                )}
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-sm font-extrabold shadow-sm text-[#1C1C1C]">
                    ₹{product.price}<span className="text-[10px] font-bold text-[#93959F] ml-0.5">/kg</span>
                </div>
            </Link>

            {/* Content */}
            <div className="p-5 flex flex-col flex-grow">
                {isExpanded && (
                    <div className="flex justify-between items-start mb-2">
                        <div className="px-2 py-0.5 bg-[#2ECC71]/10 rounded border border-[#2ECC71]/20 text-[10px] font-extrabold uppercase text-[#2ECC71] tracking-wider">{product.category}</div>
                        <div className="flex items-center text-xs text-[#FC8019] font-black bg-orange-50 px-1.5 py-0.5 rounded">
                            ★ {product.rating}
                        </div>
                    </div>
                )}

                <Link to={`/product/${product.id}`} className="block mb-2" onClick={(e) => e.stopPropagation()}>
                    <h3 className="text-[#1C1C1C] font-extrabold text-lg leading-snug group-hover:text-[#FC8019] transition-colors line-clamp-2 tracking-tight">
                        {product.name}
                    </h3>
                </Link>

                <p className="text-[#93959F] text-xs mb-5 line-clamp-2 font-medium leading-relaxed">
                    {product.description}
                </p>

                {isExpanded && (
                    <div className="mt-auto space-y-4" onClick={(e) => e.stopPropagation()}>
                        {/* Cut Selector */}
                        <div className="relative group/select">
                            <label className="text-[10px] text-[#93959F] uppercase font-extrabold absolute -top-2 left-2 bg-white px-1 tracking-wider">PREPARATION</label>
                            <select
                                value={selectedCut}
                                onChange={(e) => setSelectedCut(e.target.value)}
                                className="w-full text-sm border border-gray-200 rounded-xl py-2.5 px-3 bg-white focus:outline-none focus:ring-1 focus:ring-[#FC8019] focus:border-[#FC8019] text-[#1C1C1C] font-bold appearance-none cursor-pointer hover:border-gray-300 transition-colors"
                            >
                                {product.cuts.map(cut => (
                                    <option key={cut} value={cut}>{cut}</option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-3 pointer-events-none">
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 1L5 5L9 1" stroke="#1C1C1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>

                        {/* Action Button */}
                        {product.stock ? (
                            quantity === 0 ? (
                                <button
                                    onClick={handleAdd}
                                    className="w-full py-3 bg-white border border-[#FC8019] text-[#FC8019] font-extrabold rounded-xl uppercase text-sm hover:bg-[#FC8019] hover:text-white transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 tracking-wide"
                                >
                                    ADD TO CART
                                </button>
                            ) : (
                                <div className="flex items-center justify-between bg-white border border-[#FC8019] rounded-xl shadow-sm overflow-hidden h-[46px]">
                                    <button
                                        onClick={handleDecrement}
                                        className="w-12 h-full flex items-center justify-center text-[#93959F] hover:bg-orange-50 hover:text-[#FC8019] active:bg-orange-100 transition-colors font-bold text-xl"
                                    >
                                        -
                                    </button>
                                    <span className="text-[#FC8019] font-extrabold text-base w-full text-center">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={handleIncrement}
                                        className="w-12 h-full flex items-center justify-center text-[#FC8019] hover:bg-orange-50 active:bg-orange-100 transition-colors font-bold text-xl"
                                    >
                                        +
                                    </button>
                                </div>
                            )
                        ) : (
                            <button disabled className="w-full py-3 bg-gray-100 text-[#93959F] font-bold rounded-xl text-sm cursor-not-allowed uppercase tracking-wide">
                                UNAVAILABLE
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductCard;
