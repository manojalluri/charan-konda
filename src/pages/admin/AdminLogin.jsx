import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { Lock, AlertCircle, Loader } from 'lucide-react';
import FadeIn from '../../components/FadeIn';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { loginUser, user, isOwner } = useShop();
    const navigate = useNavigate();

    // If already logged in as owner, redirect to dashboard
    useEffect(() => {
        if (user && isOwner) {
            navigate('/admin/dashboard');
        }
    }, [user, isOwner, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Attempt login with Supabase (or bypass via ShopContext)
            const result = await loginUser(email, password);

            if (!result.success) {
                setError(result.message || 'Invalid email or password');
                setLoading(false);
                return;
            }

            // Wait a moment for role to be checked/updated
            setTimeout(() => {
                // Role check happens in ShopContext or manually set in bypass
                // If not owner, OwnerProtectedRoute will show unauthorized
                // But passing bypass sets isOwner=true instantly.
                // We'll rely on the useEffect above to navigate.
                setLoading(false);
            }, 1000);

        } catch (err) {
            console.error('Login error:', err);
            setError('An error occurred during login. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
            <FadeIn className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full border border-gray-200">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Lock size={28} />
                    </div>
                    <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Owner Portal</h1>
                    <p className="text-gray-500 text-xs font-medium">Secure access for authorized personnel only</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 text-sm font-semibold p-4 rounded-lg mb-6 flex items-center gap-3 border border-red-200">
                        <AlertCircle size={20} className="flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {user && !isOwner && !loading && (
                    <div className="bg-amber-50 text-amber-700 text-sm font-semibold p-4 rounded-lg mb-6 flex items-center gap-3 border border-amber-200">
                        <AlertCircle size={20} className="flex-shrink-0" />
                        <span>Your account does not have owner privileges. Only the application owner can access this area.</span>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-700 uppercase mb-1.5 block tracking-wider">
                            Email Address
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            className="w-full p-3 bg-gray-50 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all placeholder-gray-400 font-medium text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            placeholder="owner@example.com"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-700 uppercase mb-1.5 block tracking-wider">
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            className="w-full p-3 bg-gray-50 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all placeholder-gray-400 font-medium text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                    >
                        {loading ? (
                            <>
                                <Loader size={18} className="animate-spin" />
                                <span>Verifying Access...</span>
                            </>
                        ) : (
                            <span>SIGN IN</span>
                        )}
                    </button>

                    <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-xs text-gray-600 font-semibold text-center mb-1.5">
                            🔒 Security Notice
                        </p>
                        <p className="text-xs text-gray-500 text-center leading-relaxed">
                            This portal is restricted to the application owner only. All unauthorized access attempts are logged and monitored.
                        </p>
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => navigate('/')}
                        className="text-sm text-gray-500 hover:text-orange-600 font-medium transition-colors"
                    >
                        ← Return to Store
                    </button>
                </div>
            </FadeIn>
        </div>
    );
};

export default AdminLogin;
