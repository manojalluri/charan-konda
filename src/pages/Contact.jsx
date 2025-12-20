import React, { useState } from 'react';
import { Mail, Phone, MessageCircle } from 'lucide-react';
import FadeIn from '../components/FadeIn';

const Contact = () => {
    const [sent, setSent] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSent(true);
    };

    return (
        <div className="min-h-screen bg-[#F0F0F5] py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeIn className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-[#1C1C1C] mb-4 tracking-tight">Contact Us</h1>
                    <p className="text-[#60646C]">For bulk orders, restaurant supplies, or general inquiries.</p>
                </FadeIn>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Info */}
                    <FadeIn delay={0.1} className="space-y-8">
                        <div className="bg-white p-8 rounded-3xl shadow-card border border-gray-100">
                            <h3 className="text-xl font-bold mb-4 text-[#1C1C1C]">Bulk Orders?</h3>
                            <p className="text-[#60646C] mb-8 leading-relaxed">We supply fresh fish to top hotels and restaurants. Get special rates for bulk quantities.</p>
                            <div className="flex gap-4">
                                <button className="flex-1 btn-primary flex items-center justify-center gap-2 h-12 shadow-md">
                                    <Phone size={18} /> CALL SALES
                                </button>
                                <button className="flex-1 bg-[#2ECC71] text-white px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-[#27ae60] transition-colors h-12 uppercase tracking-wide text-sm shadow-md">
                                    <MessageCircle size={18} /> WHATSAPP
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-5 border border-gray-200 rounded-2xl bg-white hover:border-[#FC8019] transition-colors group cursor-default">
                                <div className="p-3 bg-orange-50 text-[#FC8019] rounded-full group-hover:scale-110 transition-transform">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#1C1C1C]">Email Us</h4>
                                    <p className="text-sm text-[#60646C]">support@cutorafishes.com</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-5 border border-gray-200 rounded-2xl bg-white hover:border-[#FC8019] transition-colors group cursor-default">
                                <div className="p-3 bg-orange-50 text-[#FC8019] rounded-full group-hover:scale-110 transition-transform">
                                    <Phone size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#1C1C1C]">Call Us</h4>
                                    <p className="text-sm text-[#60646C]">+91 98765 43210 (9 AM - 9 PM)</p>
                                </div>
                            </div>
                        </div>
                    </FadeIn>

                    {/* Form */}
                    <FadeIn delay={0.2} className="bg-white border border-gray-100 rounded-3xl p-8 shadow-card">
                        {sent ? (
                            <div className="h-full flex flex-col items-center justify-center text-center py-10">
                                <div className="w-20 h-20 bg-[#2ECC71]/10 text-[#2ECC71] rounded-full flex items-center justify-center mb-6">
                                    <MessageCircle size={40} />
                                </div>
                                <h3 className="text-2xl font-bold text-[#1C1C1C] mb-2">Message Sent!</h3>
                                <p className="text-[#60646C]">We'll get back to you shortly.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <h3 className="text-xl font-bold mb-2 text-[#1C1C1C]">Send a Message</h3>
                                <input required placeholder="Your Name" className="w-full p-3.5 bg-gray-50 rounded-lg border border-gray-200 focus:bg-white focus:border-[#FC8019] focus:ring-1 focus:ring-[#FC8019] outline-none transition-all placeholder-gray-400" />
                                <input required placeholder="Phone / Email" className="w-full p-3.5 bg-gray-50 rounded-lg border border-gray-200 focus:bg-white focus:border-[#FC8019] focus:ring-1 focus:ring-[#FC8019] outline-none transition-all placeholder-gray-400" />
                                <textarea required rows={4} placeholder="Your Requirement" className="w-full p-3.5 bg-gray-50 rounded-lg border border-gray-200 focus:bg-white focus:border-[#FC8019] focus:ring-1 focus:ring-[#FC8019] outline-none transition-all placeholder-gray-400" />
                                <button type="submit" className="w-full btn-primary py-3.5 shadow-lg shadow-orange-500/20">SEND MESSAGE</button>
                            </form>
                        )}
                    </FadeIn>
                </div>
            </div>
        </div>
    );
};

export default Contact;
