import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingBag, Truck, ShieldCheck } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import FadeIn from '../components/FadeIn';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { products, addToCart, storeSettings, getProductPrice } = useShop();

    // Support both MongoDB _id and legacy id
    const product = products.find(p =>
        String(p._id) === String(id) || String(p.id) === String(id)
    );

    // Provide default cuts if not present
    const productCuts = product?.cuts || ["Uncut", "Cut & Cleaned"];
    const [selectedCut, setSelectedCut] = useState(product ? productCuts[0] : '');
    const [quantityType, setQuantityType] = useState('1kg'); // '250g', '500g', '1kg', 'custom'
    const [customWeight, setCustomWeight] = useState(250);
    const [quantity, setQuantity] = useState(1); // Number of units (e.g., 2 units of 250g)

    // Get quantity config
    const defaultQuantityConfig = {
        "250g": true,
        "500g": true,
        "1kg": true,
        "custom": true,
        customMin: 250,
        customMax: 1000000,
        customStep: 50
    };
    const quantityConfig = product?.quantityConfig || defaultQuantityConfig;

    // Set initial valid quantity type
    useEffect(() => {
        if (product && !quantityConfig[quantityType]) {
            if (quantityConfig["1kg"]) setQuantityType("1kg");
            else if (quantityConfig["500g"]) setQuantityType("500g");
            else if (quantityConfig["250g"]) setQuantityType("250g");
            else if (quantityConfig["custom"]) setQuantityType("custom");
        }
    }, [product, quantityConfig, quantityType]);

    // Auto-select custom when weight > 1kg
    useEffect(() => {
        // Find configuration for the product
        const defaultQuantityConfig = {
            "250g": true,
            "500g": true,
            "1kg": true,
            "custom": true,
            customMin: 250,
            customMax: 1000000, // Effectively no limit (1000kg)
            customStep: 50
        };
        const activeConfig = product?.quantityConfig || defaultQuantityConfig;

        if (!activeConfig.custom || quantityType === 'custom') return;

        let baseWeight = 1;
        if (quantityType === '250g') baseWeight = 0.25;
        else if (quantityType === '500g') baseWeight = 0.5;
        else if (quantityType === '1kg') baseWeight = 1;

        const totalWeightInKg = baseWeight * quantity;
        if (totalWeightInKg > 1 && quantityType !== 'custom') {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setQuantityType('custom');
            setCustomWeight(Math.min(totalWeightInKg * 1000, activeConfig.customMax || 5000));
            setQuantity(1);
        }
    }, [quantity, quantityType, product]);



    if (!product) {
        return <div className="min-h-screen grid place-items-center">Product not found</div>;
    }

    // Get weight in kg based on quantity type
    const getWeightInKg = () => {
        if (quantityType === '250g') return 0.25;
        if (quantityType === '500g') return 0.5;
        if (quantityType === '1kg') return 1;
        if (quantityType === 'custom') return customWeight / 1000;
        return 1;
    };

    const weightInKg = getWeightInKg();
    const totalWeight = weightInKg * quantity;

    const handleAddToCart = () => {
        // Add to cart with total weight
        addToCart({ ...product, quantityInKg: weightInKg }, quantity, selectedCut);
    };

    // Calculate price based on selected preparation type
    const currentPrice = getProductPrice(product.price, selectedCut);
    const itemTotal = currentPrice * weightInKg * quantity;

    // Calculate breakdown for Cut & Clean
    const getPriceBreakdown = (preparationType) => {
        const basePrice = product.price;
        if (preparationType === 'Uncut') {
            return {
                total: basePrice,
                breakdown: null
            };
        }
        // Cut & Clean
        let breakdown = [];
        let total = basePrice;

        breakdown.push({ label: 'Base Price', amount: basePrice });

        if (storeSettings.cuttingEnabled && storeSettings.cuttingCharge > 0) {
            breakdown.push({ label: 'Cutting Charge', amount: storeSettings.cuttingCharge });
            total += storeSettings.cuttingCharge;
        }

        if (storeSettings.cleaningEnabled && storeSettings.cleaningCharge > 0) {
            breakdown.push({ label: 'Cleaning Charge', amount: storeSettings.cleaningCharge });
            total += storeSettings.cleaningCharge;
        }

        return { total, breakdown };
    };

    const priceInfo = getPriceBreakdown(selectedCut);

    return (
        <div className="min-h-screen bg-[#F0F0F5] py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-[#93959F] hover:text-[#FC8019] mb-6 transition-colors font-bold uppercase text-xs tracking-wider"
                >
                    <ArrowLeft size={16} className="mr-2" /> Back to Menu
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image Side */}
                    <FadeIn className="bg-white rounded-3xl p-4 flex items-center justify-center border border-gray-100 shadow-sm relative overflow-hidden group h-fit">
                        <div className="absolute inset-0 bg-radial-gradient from-orange-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <img
                            src={product.image}
                            alt={product.name}
                            loading="lazy"
                            className="w-full max-h-[350px] object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500 relative z-10"
                        />
                    </FadeIn>

                    {/* Info Side */}
                    <FadeIn delay={0.2} className="space-y-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 bg-[#2ECC71]/10 text-[#2ECC71] text-xs font-extrabold uppercase rounded-md tracking-wider border border-[#2ECC71]/20">
                                    {product.category}
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-extrabold text-[#1C1C1C] mb-4 tracking-tight">{product.name}</h1>
                            <p className="text-[#60646C] leading-relaxed text-lg">{product.description}</p>
                        </div>

                        {/* PREPARATION TYPE SELECTION */}
                        <div className="space-y-4">
                            <label className="text-xs font-extrabold text-[#93959F] uppercase tracking-widest">PREPARATION TYPE</label>
                            <div className="grid grid-cols-2 gap-4">
                                {productCuts.map(cut => {
                                    const cutPrice = getProductPrice(product.price, cut);
                                    const isSelected = selectedCut === cut;

                                    return (
                                        <button
                                            key={cut}
                                            onClick={() => setSelectedCut(cut)}
                                            className={`p-4 rounded-xl border-2 text-left transition-all ${isSelected
                                                ? 'border-[#FC8019] bg-[#FC8019]/5 shadow-md ring-2 ring-[#FC8019]/20'
                                                : 'border-gray-200 bg-white hover:border-gray-400'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <span className={`text-sm font-bold ${isSelected ? 'text-[#FC8019]' : 'text-[#1C1C1C]'}`}>
                                                    {cut}
                                                </span>
                                                {isSelected && (
                                                    <div className="w-5 h-5 rounded-full bg-[#FC8019] flex items-center justify-center">
                                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            <div className={`text-2xl font-extrabold ${isSelected ? 'text-[#FC8019]' : 'text-[#1C1C1C]'}`}>
                                                ₹{cutPrice}
                                                <span className="text-xs text-[#93959F] font-medium ml-1">/kg</span>
                                            </div>
                                            {isSelected && cut !== 'Uncut' && priceInfo.breakdown && (
                                                <div className="mt-2 pt-2 border-t border-gray-200">
                                                    {priceInfo.breakdown.map((item, idx) => (
                                                        <div key={idx} className="flex justify-between text-xs text-[#60646C] mt-1">
                                                            <span>{item.label}</span>
                                                            <span>₹{item.amount}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* QUANTITY SELECTION */}
                        <div className="space-y-4">
                            <label className="text-xs font-extrabold text-[#93959F] uppercase tracking-widest">SELECT QUANTITY</label>
                            <div className="grid grid-cols-2 gap-3">
                                {/* 250g Option */}
                                {quantityConfig["250g"] && (
                                    <button
                                        onClick={() => setQuantityType('250g')}
                                        className={`p-4 rounded-xl border-2 text-left transition-all ${quantityType === '250g'
                                            ? 'border-[#FC8019] bg-[#FC8019]/5 shadow-md ring-2 ring-[#FC8019]/20'
                                            : 'border-gray-200 bg-white hover:border-gray-400'
                                            }`}
                                    >
                                        <div className="flex flex-col">
                                            <span className={`text-lg font-bold ${quantityType === '250g' ? 'text-[#FC8019]' : 'text-[#1C1C1C]'}`}>250g</span>
                                            <span className={`text-sm font-bold ${quantityType === '250g' ? 'text-[#FC8019]' : 'text-[#60646C]'}`}>₹{Math.round(currentPrice * 0.25)}</span>
                                        </div>
                                    </button>
                                )}

                                {/* 500g Option */}
                                {quantityConfig["500g"] && (
                                    <button
                                        onClick={() => setQuantityType('500g')}
                                        className={`p-4 rounded-xl border-2 text-left transition-all ${quantityType === '500g'
                                            ? 'border-[#FC8019] bg-[#FC8019]/5 shadow-md ring-2 ring-[#FC8019]/20'
                                            : 'border-gray-200 bg-white hover:border-gray-400'
                                            }`}
                                    >
                                        <div className="flex flex-col">
                                            <span className={`text-lg font-bold ${quantityType === '500g' ? 'text-[#FC8019]' : 'text-[#1C1C1C]'}`}>500g</span>
                                            <span className={`text-sm font-bold ${quantityType === '500g' ? 'text-[#FC8019]' : 'text-[#60646C]'}`}>₹{Math.round(currentPrice * 0.5)}</span>
                                        </div>
                                    </button>
                                )}

                                {/* 1kg Option (Now in row 2) */}
                                {quantityConfig["1kg"] && (
                                    <button
                                        onClick={() => setQuantityType('1kg')}
                                        className={`p-4 rounded-xl border-2 text-left transition-all ${quantityType === '1kg'
                                            ? 'border-[#FC8019] bg-[#FC8019]/5 shadow-md ring-2 ring-[#FC8019]/20'
                                            : 'border-gray-200 bg-white hover:border-gray-400'
                                            }`}
                                    >
                                        <div className="flex flex-col">
                                            <span className={`text-lg font-bold ${quantityType === '1kg' ? 'text-[#FC8019]' : 'text-[#1C1C1C]'}`}>1kg</span>
                                            <span className={`text-sm font-bold ${quantityType === '1kg' ? 'text-[#FC8019]' : 'text-[#60646C]'}`}>₹{currentPrice}</span>
                                        </div>
                                    </button>
                                )}

                                {/* Custom Option (Now in row 2) */}
                                {quantityConfig["custom"] && (
                                    <button
                                        onClick={() => {
                                            setQuantityType('custom');
                                            const minWeight = quantityConfig.customMin || 1000;
                                            if (customWeight < minWeight) setCustomWeight(minWeight);
                                        }}
                                        className={`p-4 rounded-xl border-2 text-left transition-all ${quantityType === 'custom'
                                            ? 'border-[#FC8019] bg-[#FC8019]/5 shadow-md ring-2 ring-[#FC8019]/20'
                                            : 'border-gray-200 bg-white hover:border-gray-400'
                                            }`}
                                    >
                                        <div className="flex flex-col">
                                            <span className={`text-lg font-bold ${quantityType === 'custom' ? 'text-[#FC8019]' : 'text-[#1C1C1C]'}`}>Custom</span>
                                            <span className={`text-sm font-bold ${quantityType === 'custom' ? 'text-[#FC8019]' : 'text-[#60646C]'}`}>1kg+ Only</span>
                                        </div>
                                    </button>
                                )}
                            </div>

                            {/* Custom Weight Input */}
                            {quantityType === 'custom' && quantityConfig["custom"] && (
                                <div className="mt-4 space-y-2">
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="text-[10px] font-extrabold text-[#93959F] uppercase tracking-widest">ENTER WEIGHT (KGS)</label>
                                        <span className="text-[10px] font-extrabold text-[#FC8019] uppercase tracking-widest">Min: {quantityConfig.customMin / 1000}kg</span>
                                    </div>
                                    <div className="flex group shadow-sm">
                                        <input
                                            type="number"
                                            step={(quantityConfig.customStep || 50) / 1000}
                                            value={customWeight ? customWeight / 1000 : ''}
                                            onChange={(e) => {
                                                const valStr = e.target.value;
                                                if (valStr === '') {
                                                    setCustomWeight('');
                                                    return;
                                                }
                                                const kgValue = parseFloat(valStr);
                                                if (!isNaN(kgValue)) {
                                                    setCustomWeight(kgValue * 1000);
                                                }
                                            }}
                                            onBlur={() => {
                                                const minKg = (quantityConfig.customMin || 1000) / 1000;
                                                const maxKg = (quantityConfig.customMax || 100000) / 1000;
                                                const currentKg = customWeight / 1000;
                                                if (!customWeight || currentKg < minKg) {
                                                    setCustomWeight(minKg * 1000);
                                                } else if (currentKg > maxKg) {
                                                    setCustomWeight(maxKg * 1000);
                                                }
                                            }}
                                            className="flex-1 h-14 px-4 bg-gray-50 border-2 border-gray-100 rounded-l-xl focus:border-[#FC8019] focus:bg-white focus:outline-none transition-all font-bold text-xl text-[#1C1C1C]"
                                            placeholder="Ex: 1.5"
                                        />
                                        <div className="h-14 px-6 flex items-center justify-center bg-gray-100 border-2 border-l-0 border-gray-100 rounded-r-xl text-[#1C1C1C] font-extrabold text-lg tracking-tight">
                                            KG
                                        </div>
                                    </div>
                                    <p className="text-[11px] text-[#2ECC71] font-bold mt-1">
                                        Total: ₹{Math.round(currentPrice * (customWeight || 0) / 1000)}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Price Display */}
                        <div className="flex items-center gap-4 py-6 border-y border-dashed border-gray-200">
                            <div>
                                <div className="text-sm text-[#60646C] mb-1">Price per unit ({weightInKg}kg)</div>
                                <span className="text-4xl font-extrabold text-[#1C1C1C]">₹{Math.round(currentPrice * weightInKg)}</span>
                            </div>
                            {selectedCut === 'Cut & Clean' && (
                                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                                    Includes cutting & cleaning
                                </span>
                            )}
                        </div>

                        {/* Add to Cart Actions */}
                        <div className="flex items-center gap-4 pt-4">
                            <div className="flex items-center border border-[#FC8019] rounded-lg overflow-hidden bg-white shadow-sm h-12">
                                <button
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    className="px-4 h-full hover:bg-orange-50 text-[#60646C] font-bold text-lg"
                                >
                                    -
                                </button>
                                <span className="px-4 font-extrabold text-[#FC8019] min-w-[3rem] text-center">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(q => q + 1)}
                                    className="px-4 h-full hover:bg-orange-50 text-[#FC8019] font-bold text-lg"
                                >
                                    +
                                </button>
                            </div>
                            <button
                                onClick={handleAddToCart}
                                disabled={!product.stock}
                                className="flex-1 btn-primary h-12 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30"
                            >
                                {product.stock ? (
                                    <>
                                        <ShoppingBag size={20} /> ADD ITEM
                                    </>
                                ) : 'OUT OF STOCK'}
                            </button>
                        </div>

                        {/* Cart Total Preview */}
                        <div className="bg-gradient-to-r from-orange-50 to-orange-100/50 rounded-xl p-4 border border-orange-200">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-semibold text-[#1C1C1C]">Subtotal ({totalWeight.toFixed(2)}kg × {quantity} units)</span>
                                <span className="text-2xl font-extrabold text-[#FC8019]">₹{Math.round(itemTotal)}</span>
                            </div>
                            <div className="text-xs text-[#60646C] mt-1">
                                {selectedCut === 'Uncut' ? 'Base price' : 'With cutting & cleaning charges'}
                            </div>
                        </div>


                    </FadeIn>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
