import React, { useState } from 'react';
import { Mail, Phone, MessageCircle, Loader, Send, AlertCircle } from 'lucide-react';
import FadeIn from '../components/FadeIn';
import emailjs from '@emailjs/browser';
import { supabase } from '../lib/supabase';

const Contact = () => {
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        requirement: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // 1. Save to Supabase (Record Keeping)
            const { error: sbError } = await supabase
                .from('contact_inquiries')
                .insert([{
                    name: formData.name,
                    contact: formData.contact,
                    requirement: formData.requirement,
                    created_at: new Date().toISOString()
                }]);

            if (sbError) console.error('Supabase save error:', sbError);

            // 2. Send via EmailJS (Optional if keys are set)
            const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_default';
            const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_contact';
            const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

            if (publicKey) {
                await emailjs.send(
                    serviceId,
                    templateId,
                    {
                        from_name: formData.name,
                        from_contact: formData.contact,
                        message: formData.requirement,
                        to_name: 'Cutora Admin',
                    },
                    publicKey
                );
            } else {
                console.warn('EmailJS Public Key not set in environment variables. Data saved to Supabase only.');
            }

            setSent(true);
        } catch (err) {
            console.error('Contact form error:', err);
            setError('Something went wrong. Please try again or call us.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
                                <button className="w-full btn-primary flex items-center justify-center gap-2 h-12 shadow-md">
                                    <Phone size={18} /> CALL SALES
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

                                {error && (
                                    <div className="bg-red-50 text-red-600 text-sm font-semibold p-4 rounded-xl flex items-center gap-2 border border-red-100">
                                        <AlertCircle size={18} />
                                        {error}
                                    </div>
                                )}

                                <input
                                    required
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Your Name"
                                    className="w-full p-3.5 bg-gray-50 rounded-lg border border-gray-200 focus:bg-white focus:border-[#FC8019] focus:ring-1 focus:ring-[#FC8019] outline-none transition-all placeholder-gray-400"
                                />
                                <input
                                    required
                                    name="contact"
                                    value={formData.contact}
                                    onChange={handleChange}
                                    placeholder="Phone / Email"
                                    className="w-full p-3.5 bg-gray-50 rounded-lg border border-gray-200 focus:bg-white focus:border-[#FC8019] focus:ring-1 focus:ring-[#FC8019] outline-none transition-all placeholder-gray-400"
                                />
                                <textarea
                                    required
                                    name="requirement"
                                    value={formData.requirement}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="Your Requirement"
                                    className="w-full p-3.5 bg-gray-50 rounded-lg border border-gray-200 focus:bg-white focus:border-[#FC8019] focus:ring-1 focus:ring-[#FC8019] outline-none transition-all placeholder-gray-400"
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full btn-primary py-3.5 shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
                                >
                                    {loading ? <Loader className="animate-spin" size={20} /> : <Send size={20} />}
                                    {loading ? 'SENDING...' : 'SEND MESSAGE'}
                                </button>
                            </form>
                        )}
                    </FadeIn>
                </div>
            </div>
        </div>
    );
};

export default Contact;
