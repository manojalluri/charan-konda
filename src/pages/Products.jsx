import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { products } from '../data/mockData';
import { Package, Truck, ArrowRight } from 'lucide-react';

export const Products = () => {
    const categories = ['All', 'Chicken', 'Mutton', 'Fish', 'Prawns'];

    return (
        <div className="min-h-screen">
            {/* Header */}
            <section className="section-padding bg-gradient-to-br from-primary-50 to-white">
                <div className="container-custom text-center">
                    <h1 className="text-5xl font-heading font-bold text-dark mb-4">
                        Our <span className="gradient-text">Product Range</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Premium quality, bulk-only supply for professional kitchens
                    </p>
                </div>
            </section>

            {/* Products Grid */}
            <section className="section-padding">
                <div className="container-custom">
                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-3 mb-12 justify-center">
                        {categories.map((category) => (
                            <button
                                key={category}
                                className="px-6 py-2 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all font-medium"
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Products */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((product, index) => (
                            <Card
                                key={product.id}
                                interactive
                                className={`animate-slide-up`}
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {/* Product Image */}
                                <div className="aspect-video rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 mb-4 flex items-center justify-center overflow-hidden">
                                    <span className="text-6xl">🍖</span>
                                </div>

                                {/* Category Badge */}
                                <Badge variant="success" className="mb-3">
                                    {product.category}
                                </Badge>

                                {/* Product Info */}
                                <h3 className="text-xl font-semibold text-dark mb-2">{product.name}</h3>
                                <p className="text-gray-600 mb-4">{product.description}</p>

                                {/* Details */}
                                <div className="space-y-3 mb-4 pb-4 border-b">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Package size={16} className="text-primary" />
                                        <span className="text-gray-600">Pack Sizes:</span>
                                        <span className="font-medium text-dark">{product.packSizes.join(', ')}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="text-gray-600">Processing:</span>
                                        <span className="font-medium text-dark">{product.processing}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Truck size={16} className="text-primary" />
                                        <span className="text-gray-600">Delivery:</span>
                                        <span className="font-medium text-dark">{product.deliveryTime}</span>
                                    </div>
                                </div>

                                {/* CTA */}
                                <Link to="/contact">
                                    <Button variant="primary" className="w-full">
                                        Enquire Now
                                        <ArrowRight size={18} />
                                    </Button>
                                </Link>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section-padding bg-gray-50">
                <div className="container-custom">
                    <Card className="text-center bg-gradient-to-br from-primary-50 to-white border-2 border-primary/20">
                        <h2 className="text-3xl font-heading font-bold text-dark mb-4">
                            Need Custom Requirements?
                        </h2>
                        <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                            We can customize pack sizes and processing methods based on your restaurant's specific needs.
                        </p>
                        <Link to="/contact">
                            <Button variant="primary" className="text-lg">
                                Contact Our Team
                                <ArrowRight size={20} />
                            </Button>
                        </Link>
                    </Card>
                </div>
            </section>
        </div>
    );
};
