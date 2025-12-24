import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Clock, Award, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import FadeIn from '../components/FadeIn';

const Home = () => {
    const { products, siteConfig } = useShop();
    const featuredProducts = (products || []).filter(p => p?.stock).slice(0, 4);

    const categories = [
        { title: "Sea Fish", img: "/sea_fish.png", link: "/menu?cat=sea" },
        { title: "Fresh Water", img: "/fresh_water.png", link: "/menu?cat=river" },
        { title: "Prawns & Shellfish", img: "/prawns.png", link: "/menu?cat=shellfish" },
        { title: "Chicken", img: "/chicken.png", link: "/menu?cat=chicken" },
        { title: "Mutton", img: "/mutton.png", link: "/menu?cat=mutton" },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            {/* Hero Section */}
            <section className="relative h-[70vh] flex items-center justify-center overflow-hidden bg-[#1C1C1C]">
                <div className="absolute inset-0">

                    <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1C] via-[#1C1C1C]/40 to-transparent"></div>
                </div>

                <FadeIn className="relative z-10 text-center max-w-5xl px-4 mt-16">
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-2xl tracking-tight leading-none" dangerouslySetInnerHTML={{ __html: siteConfig.heroTitle }}>
                    </h1>
                    <p className="text-gray-200 text-lg md:text-2xl mb-10 font-medium tracking-wide max-w-3xl mx-auto drop-shadow-md">
                        {siteConfig.heroSubtitle}
                    </p>
                    <Link to="/menu" className="inline-flex items-center gap-3 px-8 py-4 bg-[#FC8019] text-white font-bold rounded-lg text-lg uppercase tracking-wider hover:bg-[#E26E0F] transition-all shadow-xl hover:scale-105 active:scale-95">
                        Order Premium Cuts <ArrowRight size={22} />
                    </Link>
                </FadeIn>
            </section>

            {/* Trust Badges */}
            {/* Trust Badges */}
            <section className="relative z-20 -mt-8 mx-4 md:mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-xl border border-gray-50 p-6 md:p-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                        <FadeIn delay={0.1} className="flex flex-col items-center text-center group cursor-default py-4 md:py-0">
                            <div className="mb-4 text-[#FC8019] bg-orange-50 p-4 md:p-5 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                                <Clock size={28} strokeWidth={2.5} />
                            </div>
                            <h3 className="font-extrabold text-lg md:text-xl text-[#1C1C1C] mb-1">Fast Delivery</h3>
                            <p className="text-[#93959F] text-xs md:text-sm font-medium leading-relaxed max-w-[200px]">Sourced daily, delivered fresh within hours.</p>
                        </FadeIn>

                        <FadeIn delay={0.2} className="flex flex-col items-center text-center group cursor-default py-6 md:py-0">
                            <div className="mb-4 text-[#2ECC71] bg-green-50 p-4 md:p-5 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                                <ShieldCheck size={28} strokeWidth={2.5} />
                            </div>
                            <h3 className="font-extrabold text-lg md:text-xl text-[#1C1C1C] mb-1">Hygienic Process</h3>
                            <p className="text-[#93959F] text-xs md:text-sm font-medium leading-relaxed max-w-[200px]">Cleaned & processed in sterile environments.</p>
                        </FadeIn>

                        <FadeIn delay={0.3} className="flex flex-col items-center text-center group cursor-default pt-6 md:pt-0">
                            <div className="mb-4 text-[#0EA5A5] bg-teal-50 p-4 md:p-5 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                                <Award size={28} strokeWidth={2.5} />
                            </div>
                            <h3 className="font-extrabold text-lg md:text-xl text-[#1C1C1C] mb-1">Premium Quality</h3>
                            <p className="text-[#93959F] text-xs md:text-sm font-medium leading-relaxed max-w-[200px]">Certified fresh quality assurance guaranteed.</p>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="py-20 bg-[#F0F0F5]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <FadeIn className="text-center mb-16">
                        <h2 className="text-3xl font-extrabold text-[#1C1C1C] mb-4 tracking-tight">Shop By Category</h2>
                        <div className="w-24 h-1.5 bg-[#FC8019] mx-auto rounded-full"></div>
                    </FadeIn>

                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
                        {categories.map((cat, idx) => (
                            <FadeIn key={idx} delay={idx * 0.1}>
                                <Link to={cat.link} className="group block relative rounded-3xl overflow-hidden aspect-[4/3] shadow-card hover:shadow-float transition-all">
                                    <img src={cat.img} alt={cat.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 to-transparent flex items-end p-4 md:p-8">
                                        <h3 className="text-white text-lg md:text-2xl font-extrabold tracking-wide uppercase">{cat.title}</h3>
                                    </div>
                                </Link>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl font-extrabold text-[#1C1C1C] mb-2 tracking-tight">Fresh Recommendations</h2>
                            <p className="text-[#60646C] text-lg">Curated selection just for you</p>
                        </div>
                        <Link to="/menu" className="hidden md:flex items-center text-[#FC8019] font-bold hover:gap-2 transition-all uppercase tracking-wide text-sm">
                            View All <ArrowRight size={18} className="ml-1" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                        {featuredProducts.length > 0 ? (
                            featuredProducts.map((product, idx) => (
                                <FadeIn key={product?._id || product?.id || idx} delay={idx * 0.1}>
                                    <ProductCard product={product} />
                                </FadeIn>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <p className="text-gray-500 text-lg">Loading products...</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-12 text-center md:hidden">
                        <Link to="/menu" className="btn-secondary inline-flex">
                            View All Products
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
