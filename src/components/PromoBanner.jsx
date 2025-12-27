import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Megaphone, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const PromoBanner = () => {
    const { siteConfig } = useShop();
    const [isVisible, setIsVisible] = useState(false);

    const banner = siteConfig?.banner;

    useEffect(() => {
        if (banner?.enabled) {
            // Check if shown in this session
            const hasBeenShown = sessionStorage.getItem('promo-banner-shown');
            if (!hasBeenShown) {
                const timer = setTimeout(() => {
                    setIsVisible(true);
                }, 1500); // Show after 1.5s delay
                return () => clearTimeout(timer);
            }
        }
    }, [banner?.enabled]);

    const handleClose = () => {
        setIsVisible(false);
        sessionStorage.setItem('promo-banner-shown', 'true');
    };

    if (!banner?.enabled || !isVisible) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-lg bg-white rounded-2xl overflow-hidden shadow-2xl"
                >
                    {/* Close Button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full text-gray-800 transition-colors z-10 shadow-sm"
                    >
                        <X size={20} />
                    </button>

                    {/* Content Based on Mode */}
                    {banner.mode === 'image' ? (
                        /* IMAGE ONLY MODE */
                        <div className="relative group">
                            {banner.image ? (
                                <div className="min-h-[300px] w-full bg-gray-100 flex items-center justify-center overflow-hidden">
                                    <img
                                        src={banner.image}
                                        alt={banner.title}
                                        className="w-full h-full object-cover"
                                    />
                                    {banner.link && (
                                        <a
                                            href={banner.link}
                                            onClick={handleClose}
                                            className="absolute inset-0 z-20"
                                        />
                                    )}
                                </div>
                            ) : (
                                <div className="h-64 flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200 m-4 rounded-xl">
                                    <Megaphone size={48} className="text-gray-300 mb-2" />
                                    <p className="text-gray-400 text-sm">Please add an image URL in admin settings</p>
                                </div>
                            )}

                            {/* Small close overlay for image mode */}
                            <div className="absolute bottom-4 left-0 right-0 flex justify-center z-30 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={handleClose}
                                    className="px-4 py-1.5 bg-black/50 backdrop-blur-md text-white rounded-full text-xs font-medium hover:bg-black/70 transition-colors shadow-lg"
                                >
                                    Dismiss Alert
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* TEXT OR BOTH MODE */
                        <>
                            {/* Image Header (If mode is 'both' and image exists) */}
                            {banner.mode === 'both' && banner.image && (
                                <div className="h-48 w-full overflow-hidden">
                                    <img
                                        src={banner.image}
                                        alt={banner.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            <div className="p-8 text-center">
                                <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6 text-orange-600">
                                    <Megaphone size={32} />
                                </div>

                                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                                    {banner.title || "Don't Miss Out!"}
                                </h2>

                                <p className="text-gray-600 mb-8 leading-relaxed">
                                    {banner.message}
                                </p>

                                <div className="flex flex-col sm:flex-row gap-3">
                                    {banner.link ? (
                                        <a
                                            href={banner.link}
                                            onClick={handleClose}
                                            className="flex-1 px-6 py-3 bg-orange-600 text-white font-semibold rounded-xl hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 group"
                                        >
                                            Check it now
                                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </a>
                                    ) : (
                                        <button
                                            onClick={handleClose}
                                            className="flex-1 px-6 py-3 bg-orange-600 text-white font-semibold rounded-xl hover:bg-orange-700 transition-colors"
                                        >
                                            Got it!
                                        </button>
                                    )}

                                    <button
                                        onClick={handleClose}
                                        className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Progres bar at bottom */}
                    <div className="h-1.5 w-full bg-gray-100">
                        <motion.div
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 10, ease: "linear" }}
                            onAnimationComplete={handleClose}
                            className="h-full bg-orange-500"
                        />
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default PromoBanner;
