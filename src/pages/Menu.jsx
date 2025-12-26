import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import FadeIn from '../components/FadeIn';
import SEO from '../components/SEO';

const Menu = () => {
    const { products } = useShop();
    const [searchParams, setSearchParams] = useSearchParams();
    const currentCat = searchParams.get('cat') || 'all';
    const [activeCategory, setActiveCategory] = useState(currentCat);

    useEffect(() => {
        setActiveCategory(currentCat);
    }, [currentCat]);

    const categories = [
        { id: 'all', label: 'All' },
        { id: 'sea', label: 'Sea Fish' },
        { id: 'river', label: 'Fresh Water' },
        { id: 'shellfish', label: 'Prawns & Seafood' },
        { id: 'chicken', label: 'Chicken' },
        { id: 'mutton', label: 'Mutton' },
    ];

    const getPageTitle = () => {
        const cat = categories.find(c => c.id === activeCategory);
        return cat ? `${cat.label} - Menu` : 'Menu';
    };

    const filteredProducts = activeCategory === 'all'
        ? products
        : products.filter(p => {
            if (activeCategory === 'sea') return p.category === 'Sea Fish';
            if (activeCategory === 'river') return p.category === 'Fresh Water Fish';
            if (activeCategory === 'shellfish') return p.category === 'Prawns & Seafood';
            if (activeCategory === 'chicken') return p.category === 'Chicken';
            if (activeCategory === 'mutton') return p.category === 'Mutton';
            return true;
        });

    const handleCategoryChange = (id) => {
        setActiveCategory(id);
        setSearchParams({ cat: id });
    };

    return (
        <div className="min-h-screen bg-[#F0F0F5] pt-12 pb-20">
            <SEO
                title={getPageTitle()}
                description="Browse our fresh selection of sea fish, river fish, chicken, mutton, and seafood. Daily catch delivered to your home."
                keywords="buy fish online, chicken price, mutton delivery, seafood market"
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <FadeIn className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-[#1C1C1C] mb-4 tracking-tight">Our Premium Cuts</h1>
                    <p className="text-[#60646C] max-w-2xl mx-auto text-lg">Explore our wide range of premium meats and seafood, cut and cleaned to perfection.</p>
                </FadeIn>

                {/* Category Filter Pills */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => handleCategoryChange(cat.id)}
                            className={`px-8 py-3 rounded-full text-sm font-bold transition-all uppercase tracking-wide ${activeCategory === cat.id
                                ? 'bg-[#1C1C1C] text-white shadow-lg scale-105 border border-transparent'
                                : 'bg-white text-[#60646C] hover:bg-gray-50 border border-gray-200 hover:border-[#1C1C1C]'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Product Grid */}
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                        {filteredProducts.map((product, idx) => (
                            <FadeIn key={product?._id || product?.id || idx} delay={idx * 0.05}>
                                <ProductCard product={product} />
                            </FadeIn>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                        <p className="text-[#93959F] text-lg mb-4">No products found in this category.</p>
                        <button onClick={() => handleCategoryChange('all')} className="text-[#FC8019] font-bold hover:underline uppercase tracking-wide text-sm">View All Products</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Menu;
