import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { User, Mail, Lock, UserPlus, LogIn, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import FadeIn from '../components/FadeIn';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);

    // Form check
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: ''
    });

    // UI States
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { loginUser, registerUser } = useShop();
    const navigate = useNavigate();

    // Handle Input Changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear errors immediately when user types
        if (error) setError('');
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError('');
        setSuccessMsg('');
        setFormData({ name: '', email: '', phone: '', password: '' });
    };

    const validateForm = () => {
        const { email, password, name, phone } = formData;

        if (isLogin) {
            if (!phone.trim()) return "Phone number is required.";
            if (phone.trim().length < 10) return "Please enter a valid phone number.";
        } else {
            if (!name.trim()) return "Full Name is required.";
            if (!phone.trim()) return "Phone number is required.";
            if (phone.trim().length < 10) return "Phone number must be at least 10 digits.";
            // Email is optional but if provided should be valid
            if (email.trim()) {
                const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                if (!emailRegex.test(email.trim())) return "Please enter a valid email address.";
            }
        }

        if (!password) return "Password is required.";
        if (!isLogin && password.length < 6) return "Password must be at least 6 characters.";

        return null; // Valid
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        // 1. Validation
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsLoading(true);

        try {
            const { email, password, name, phone } = formData;
            const cleanEmail = email.trim();
            const cleanName = name.trim();
            const cleanPhone = phone.trim();

            if (isLogin) {
                // Login Flow - cleanPhone is used
                const result = await loginUser(cleanPhone, password);
                if (result.success) {
                    setSuccessMsg("Login successful! Redirecting...");
                    setTimeout(() => navigate('/'), 1000);
                } else {
                    setError(result.message || "Invalid credentials. Please check and try again.");
                }
            } else {
                // Register Flow
                const result = await registerUser(cleanName, cleanEmail, cleanPhone, password);
                if (result.success) {
                    setSuccessMsg("Account created successfully! Taking you in...");
                    setTimeout(() => navigate('/'), 1500);
                } else {
                    setError(result.message || "Registration failed. Please try again.");
                }
            }
        } catch (err) {
            console.error("Auth error:", err);
            setError("Something went wrong. Please check your internet connection.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F0F0F5] flex items-center justify-center p-4">
            <FadeIn className="bg-white p-8 md:p-10 rounded-3xl shadow-card max-w-sm w-full border border-gray-100 relative overflow-hidden">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-50 text-brand-blue rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300">
                        {isLogin ? <User size={32} /> : <UserPlus size={32} />}
                    </div>
                    <h1 className="text-2xl font-extrabold text-[#1C1C1C] uppercase tracking-tight">
                        {isLogin ? 'Welcome Back' : 'Join Us'}
                    </h1>
                    <p className="text-[#93959F] text-sm font-medium mt-1">
                        {isLogin ? 'Login to order clean cuts' : 'Create account with phone number'}
                    </p>
                </div>

                {/* Feedback Messages */}
                {error && (
                    <div className="bg-red-50 text-red-600 text-sm font-bold p-3 rounded-xl mb-6 flex items-center gap-3 border border-red-100 animate-in fade-in slide-in-from-top-2">
                        <AlertCircle size={18} className="shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {successMsg && (
                    <div className="bg-green-50 text-green-600 text-sm font-bold p-3 rounded-xl mb-6 flex items-center gap-3 border border-green-100 animate-in fade-in slide-in-from-top-2">
                        <CheckCircle size={18} className="shrink-0" />
                        <span>{successMsg}</span>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div>
                            <label className="text-xs font-bold text-[#60646C] uppercase mb-1.5 block tracking-wider">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-[#FC8019] transition-colors" size={18} />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full pl-10 p-3.5 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-[#FC8019] focus:ring-4 focus:ring-orange-500/10 outline-none transition-all placeholder-gray-400 font-medium text-[#1C1C1C]"
                                    placeholder="John Doe"
                                    disabled={isLoading}
                                    autoComplete="name"
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="text-xs font-bold text-[#60646C] uppercase mb-1.5 block tracking-wider">Phone Number</label>
                        <div className="relative group">
                            <LogIn className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-[#FC8019] transition-colors" size={18} />
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full pl-10 p-3.5 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-[#FC8019] focus:ring-4 focus:ring-orange-500/10 outline-none transition-all placeholder-gray-400 font-medium text-[#1C1C1C]"
                                placeholder="Enter 10-digit number"
                                disabled={isLoading}
                                autoComplete="tel"
                            />
                        </div>
                    </div>

                    {!isLogin && (
                        <div>
                            <label className="text-xs font-bold text-[#60646C] uppercase mb-1.5 block tracking-wider">Email (Optional)</label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-[#FC8019] transition-colors" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 p-3.5 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-[#FC8019] focus:ring-4 focus:ring-orange-500/10 outline-none transition-all placeholder-gray-400 font-medium text-[#1C1C1C]"
                                    placeholder="you@example.com"
                                    disabled={isLoading}
                                    autoComplete="email"
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="text-xs font-bold text-[#60646C] uppercase mb-1.5 block tracking-wider">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-[#FC8019] transition-colors" size={18} />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full pl-10 p-3.5 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-[#FC8019] focus:ring-4 focus:ring-orange-500/10 outline-none transition-all placeholder-gray-400 font-medium text-[#1C1C1C]"
                                placeholder="••••••••"
                                disabled={isLoading}
                                autoComplete="current-password"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full btn-primary py-3.5 text-base mt-4 shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                    >
                        {isLoading ? (
                            <><Loader2 size={20} className="animate-spin" /> Processing...</>
                        ) : (
                            isLogin ? <><LogIn size={18} /> LOGIN</> : <><UserPlus size={18} /> CREATE ACCOUNT</>
                        )}
                    </button>
                </form>

                {/* Toggle */}
                <div className="mt-8 text-center pt-6 border-t border-gray-100">
                    <p className="text-sm font-medium text-gray-500">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button
                            onClick={toggleMode}
                            disabled={isLoading}
                            className="ml-1.5 text-[#FC8019] font-extrabold hover:text-orange-600 transition-colors disabled:opacity-50"
                        >
                            {isLogin ? 'Sign Up' : 'Login'}
                        </button>
                    </p>
                </div>
            </FadeIn>
        </div>
    );
};

export default Login;
