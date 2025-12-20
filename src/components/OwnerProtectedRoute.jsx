import React from 'react';
import { Navigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

const OwnerProtectedRoute = ({ children }) => {
    const { user, isOwner, isLoadingAuth } = useShop();

    // Show loading state while checking auth
    if (isLoadingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <span className="text-white font-bold text-2xl">C</span>
                    </div>
                    <p className="text-gray-600">Verifying access...</p>
                </div>
            </div>
        );
    }

    // If not logged in, redirect to admin login
    if (!user) {
        return <Navigate to="/admin/login" replace />;
    }

    // If logged in but not owner, show unauthorized and redirect
    if (!isOwner) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
                    <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                            className="w-10 h-10"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Unauthorized Access
                    </h2>
                    <p className="text-gray-600 mb-6">
                        You don't have permission to access this area. Only the application owner can access the admin dashboard.
                    </p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold"
                    >
                        Return to Home
                    </button>
                </div>
            </div>
        );
    }

    // User is owner, render the admin content
    return <>{children}</>;
};

export default OwnerProtectedRoute;
