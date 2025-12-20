import React from 'react';
import { Fish } from 'lucide-react';

const LoadingScreen = ({ message = 'Loading...' }) => {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center">
            <div className="relative">
                {/* Background Glow */}
                <div className="absolute inset-0 bg-orange-500/20 blur-3xl rounded-full scale-150 animate-pulse"></div>

                {/* Icon Container */}
                <div className="relative w-24 h-24 bg-gradient-to-br from-[#FC8019] to-[#ff9f59] rounded-[2rem] flex items-center justify-center shadow-lg shadow-orange-200 animate-bounce transition-all duration-500">
                    <Fish className="w-12 h-12 text-white animate-pulse" strokeWidth={2.5} />
                </div>

                {/* Loading Dots */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
                    <div className="w-2 h-2 bg-[#FC8019] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-[#FC8019] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-[#FC8019] rounded-full animate-bounce"></div>
                </div>
            </div>

            {message && (
                <p className="mt-12 text-[#93959F] font-bold text-sm uppercase tracking-[0.2em] animate-pulse">
                    {message}
                </p>
            )}
        </div>
    );
};

export default LoadingScreen;
