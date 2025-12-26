import React from 'react';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-[#02060C] text-white pt-16 pb-8 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

                    {/* Brand */}
                    <div className="space-y-6">
                        <h3 className="text-3xl font-extrabold text-white tracking-tight">
                            CUTORA <span className="text-[#FC8019]">FRESH</span>
                        </h3>
                        <p className="text-[#93959F] text-sm leading-relaxed font-medium">
                            Premium fresh meats and seafood, hygienically cleaned and delivered to your doorstep. From the farm & coast to your kitchen daily.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://www.instagram.com/cutorafishes?igsh=MWk4a3F2MGZ2bWg3aQ==" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#FC8019] transition-colors"><Instagram size={24} /></a>
                            <a href="#" className="text-white hover:text-[#FC8019] transition-colors"><Facebook size={24} /></a>
                            <a href="#" className="text-white hover:text-[#FC8019] transition-colors"><Twitter size={24} /></a>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-bold text-lg mb-6 text-white uppercase tracking-wider">Company</h4>
                        <ul className="space-y-3 text-sm text-[#93959F] font-medium">
                            <li><Link to="/" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link to="/menu" className="hover:text-white transition-colors">Our Menu</Link></li>
                            <li><Link to="/track-order" className="hover:text-white transition-colors text-orange-400">Track Order</Link></li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 className="font-bold text-lg mb-6 text-white uppercase tracking-wider">Shop By</h4>
                        <ul className="space-y-3 text-sm text-[#93959F] font-medium">
                            <li><Link to="/menu?cat=sea" className="hover:text-white transition-colors">Sea Fish</Link></li>
                            <li><Link to="/menu?cat=river" className="hover:text-white transition-colors">Freshwater Fish</Link></li>
                            <li><Link to="/menu?cat=shellfish" className="hover:text-white transition-colors">Prawns & Shellfish</Link></li>
                            <li><Link to="/menu" className="hover:text-white transition-colors">Ready to Cook</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-bold text-lg mb-6 text-white uppercase tracking-wider">Contact Us</h4>
                        <ul className="space-y-4 text-sm text-[#93959F] font-medium">
                            <li className="flex items-start gap-3">
                                <MapPin size={20} className="text-[#FC8019] shrink-0" />
                                <span>Andhra Pradesh, West Godavari, Bhimavaram</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={20} className="text-[#FC8019] shrink-0" />
                                <span>+91 98765 43210</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={20} className="text-[#FC8019] shrink-0" />
                                <span>cutorafishes@gmail.com</span>
                            </li>
                        </ul>
                    </div>

                </div>

                <div className="border-t border-gray-800 mt-16 pt-8 text-center text-sm text-[#93959F] font-medium">
                    © {new Date().getFullYear()} Cutora Fresh. All rights reserved. Made with ❤️ for meat & seafood lovers.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
