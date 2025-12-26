import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="bg-dark text-white">
            <div className="container-custom section-padding">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* About */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">G</span>
                            </div>
                            <h3 className="text-xl font-heading font-bold">CUTORA</h3>
                        </div>
                        <p className="text-gray-400 mb-4">
                            Premium B2B raw & uncooked non-veg supply for restaurants and commercial kitchens in Hyderabad.
                        </p>
                        <div className="flex gap-3">
                            <a href="#" className="w-10 h-10 bg-dark-600 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 bg-dark-600 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">
                                <Twitter size={18} />
                            </a>
                            <a href="https://www.instagram.com/cutorafishes?igsh=MWk4a3F2MGZ2bWg3aQ==" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-dark-600 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 bg-dark-600 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">
                                <Linkedin size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                        <nav className="flex flex-col gap-3">
                            <Link to="/about" className="text-gray-400 hover:text-primary transition-colors">About Us</Link>
                            <Link to="/products" className="text-gray-400 hover:text-primary transition-colors">Products</Link>
                            <Link to="/how-it-works" className="text-gray-400 hover:text-primary transition-colors">How It Works</Link>
                            <Link to="/why-choose-us" className="text-gray-400 hover:text-primary transition-colors">Why Choose Us</Link>
                            <Link to="/contact" className="text-gray-400 hover:text-primary transition-colors">Contact Us</Link>
                        </nav>
                    </div>

                    {/* Products */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Our Products</h4>
                        <nav className="flex flex-col gap-3">
                            <span className="text-gray-400">Chicken (Bulk)</span>
                            <span className="text-gray-400">Mutton</span>
                            <span className="text-gray-400">Fish</span>
                            <span className="text-gray-400">Prawns</span>
                            <span className="text-gray-400">Seafood</span>
                        </nav>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
                        <div className="flex flex-col gap-4">
                            <a href="tel:+919876543210" className="flex items-start gap-3 text-gray-400 hover:text-primary transition-colors">
                                <Phone size={20} className="mt-1 flex-shrink-0" />
                                <span>+91 98765 43210</span>
                            </a>
                            <a href="mailto:cutorafishes@gmail.com" className="flex items-start gap-3 text-gray-400 hover:text-primary transition-colors">
                                <Mail size={20} className="mt-1 flex-shrink-0" />
                                <span>cutorafishes@gmail.com</span>
                            </a>
                            <div className="flex items-start gap-3 text-gray-400">
                                <MapPin size={20} className="mt-1 flex-shrink-0" />
                                <span>Andhra Pradesh, West Godavari,<br />Bhimavaram, India</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-dark-600 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-sm">
                        © 2025 CUTORA. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm">
                        <Link to="/privacy" className="text-gray-400 hover:text-primary transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="text-gray-400 hover:text-primary transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};
