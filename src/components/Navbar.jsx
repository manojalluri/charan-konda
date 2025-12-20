import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Fish, User } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { cart, siteConfig, user, logoutUser } = useShop(); // Read siteConfig, user state
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    const NavLink = ({ to, children }) => {
        const isActive = location.pathname === to;
        return (
            <Link
                to={to}
                className={`px-4 py-2 rounded-lg font-bold text-sm tracking-wide transition-colors ${isActive ? 'text-brand-orange' : 'text-brand-gray hover:text-brand-orange'}`}
                onClick={() => setIsOpen(false)}
            >
                {children}
            </Link>
        );
    };

    return (
        <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100 h-20 flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="flex justify-between items-center">

                    {/* Logo - Dynamic or Default */}
                    <Link to="/" className="flex items-center gap-3 group">
                        {siteConfig.logo ? (
                            <img src={siteConfig.logo} alt="Logo" className="h-12 w-12 object-contain rounded-lg group-hover:scale-105 transition-transform" />
                        ) : (
                            <div className="bg-[#FC8019] p-2.5 rounded-xl text-white shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">
                                <Fish size={24} strokeWidth={2.5} />
                            </div>
                        )}
                        <div className="flex flex-col">
                            <span className="text-xl md:text-2xl font-extrabold tracking-tight text-[#1C1C1C] leading-none text-nowrap">
                                {(siteConfig.brandName || "CUTORA FRESH").split(" ")[0]}
                            </span>
                            <span className="text-[10px] md:text-xs font-bold text-[#FC8019] uppercase tracking-[0.2em] leading-tight">
                                {(siteConfig.brandName || "CUTORA FRESH").split(" ").slice(1).join(" ")}
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Nav - Centered & Premium */}
                    <div className="hidden md:flex items-center gap-8 text-sm font-bold tracking-wide">
                        <NavLink to="/">
                            <span className="group-hover:text-[#FC8019] transition-colors">HOME</span>
                        </NavLink>
                        <NavLink to="/menu">
                            <span className="group-hover:text-[#FC8019] transition-colors">FRESH CUTS</span>
                        </NavLink>
                        <NavLink to="/track-order">
                            <span className="group-hover:text-[#FC8019] transition-colors">TRACK ORDER</span>
                        </NavLink>
                        {user && (
                            <NavLink to="/orders">
                                <span className="group-hover:text-[#FC8019] transition-colors">MY ORDERS</span>
                            </NavLink>
                        )}
                        <NavLink to="/contact">
                            <span className="group-hover:text-[#FC8019] transition-colors">CONTACT US</span>
                        </NavLink>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-6">
                        {user ? (
                            <div className="hidden md:flex items-center gap-4 group cursor-pointer relative">
                                <span className="font-extrabold text-[#1C1C1C] text-xl md:text-2xl tracking-tight">Hi, {user.name}</span>
                                <button onClick={logoutUser} className="px-2 py-1 rounded bg-red-50 text-red-500 text-[10px] font-bold uppercase tracking-widest hover:bg-red-100 transition-colors">
                                    LOGOUT
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="hidden md:flex items-center gap-2 text-sm font-bold text-[#93959F] hover:text-[#FC8019] transition-colors group">
                                <div className="group-hover:bg-orange-50 p-2 rounded-full transition-colors">
                                    <User size={20} />
                                </div>
                                <span className="uppercase">Sign In</span>
                            </Link>
                        )}

                        <Link to="/cart" className="relative flex items-center gap-3 group">
                            <span className={`border p-2.5 rounded-full transition-all shadow-sm ${cartCount > 0
                                ? 'bg-orange-50 border-[#FC8019] text-[#FC8019]'
                                : 'bg-white border-gray-200 text-[#60646C]'} group-hover:bg-[#FC8019] group-hover:border-[#FC8019] group-hover:text-white`}>
                                <ShoppingBag size={20} className="group-hover:scale-110 transition-transform" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-4 w-4 md:hidden">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FC8019] opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-4 w-4 bg-[#FC8019] text-[8px] font-bold text-white items-center justify-center">
                                            {cartCount}
                                        </span>
                                    </span>
                                )}
                            </span>
                            {cartCount > 0 ? (
                                <div className="hidden md:block">
                                    <span className="block text-xs font-bold text-[#FC8019] uppercase tracking-wider">Total</span>
                                    <span className="block text-sm font-extrabold text-[#1C1C1C] leading-none">{cartCount} Items</span>
                                </div>
                            ) : (
                                <span className="hidden md:block text-sm font-bold text-[#93959F] uppercase tracking-wide group-hover:text-[#FC8019] transition-colors">Cart</span>
                            )}
                        </Link>

                        {/* Mobile Menu Button */}
                        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-[#1C1C1C] hover:bg-gray-50 rounded-lg transition-colors">
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-gray-100 overflow-hidden absolute top-20 left-0 w-full shadow-lg"
                    >
                        <div className="px-6 py-6 space-y-4 flex flex-col">
                            {user && <div className="font-bold text-[#FC8019] mb-2">Welcome, {user.name}</div>}
                            <NavLink to="/">HOME</NavLink>
                            <NavLink to="/menu">FRESH CUTS</NavLink>
                            {user && <NavLink to="/orders">MY ORDERS</NavLink>}
                            <NavLink to="/contact">CONTACT US</NavLink>
                            <hr className="border-gray-100 my-2" />
                            {user ? (
                                <button onClick={() => { logoutUser(); setIsOpen(false); }} className="flex items-center gap-2 font-bold text-red-500 p-2 hover:bg-red-50 rounded-lg w-full text-left">
                                    <User size={18} /> LOGOUT
                                </button>
                            ) : (
                                <Link to="/login" className="flex items-center gap-2 font-bold text-[#1C1C1C] p-2 hover:bg-gray-50 rounded-lg" onClick={() => setIsOpen(false)}>
                                    <User size={18} /> SIGN IN
                                </Link>
                            )}
                            <Link to="/admin/login" className="flex items-center gap-2 font-bold text-gray-400 p-2 hover:bg-gray-50 rounded-lg text-xs uppercase tracking-wider mt-4" onClick={() => setIsOpen(false)}>
                                Partner Login
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
