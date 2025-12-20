import { Card } from '../components/ui/Card';
import { Award, Target, Heart, Users } from 'lucide-react';

export const About = () => {
    const values = [
        {
            icon: Award,
            title: 'Quality First',
            description: 'FSSAI-certified processing and strict quality control at every step'
        },
        {
            icon: Target,
            title: 'Reliability',
            description: 'Never miss a delivery. Your operations depend on us, and we deliver.'
        },
        {
            icon: Heart,
            title: 'Freshness Guaranteed',
            description: 'Early morning delivery ensures the freshest products for your kitchen'
        },
        {
            icon: Users,
            title: 'Partnership Approach',
            description: 'We grow when you grow. Your success is our success.'
        }
    ];

    return (
        <div className="min-h-screen">
            {/* Hero */}
            <section className="section-padding bg-gradient-to-br from-primary-50 to-white">
                <div className="container-custom text-center">
                    <h1 className="text-5xl font-heading font-bold text-dark mb-4">
                        About <span className="gradient-text">GODACUT</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Your trusted B2B partner for premium raw & uncooked non-veg supplies in Hyderabad
                    </p>
                </div>
            </section>

            {/* Story */}
            <section className="section-padding">
                <div className="container-custom">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-heading font-bold text-dark mb-6">
                                Connecting Godavari Farms to Hyderabad Kitchens
                            </h2>
                            <div className="space-y-4 text-lg text-gray-600">
                                <p>
                                    <strong className="text-dark">GODACUT</strong> was born from a simple observation:
                                    restaurants in Hyderabad struggled to find reliable, high-quality bulk protein supplies
                                    that arrived fresh every morning.
                                </p>
                                <p>
                                    Leveraging the rich agricultural heritage of <strong className="text-dark">West Godavari</strong>
                                    {' '}and Bhimavaram regions, we built a supply chain that prioritizes hygiene, freshness,
                                    and punctuality.
                                </p>
                                <p>
                                    Today, we proudly serve <strong className="text-dark">45+ restaurants</strong> across Hyderabad,
                                    delivering over <strong className="text-dark">500kg of fresh protein daily</strong>.
                                </p>
                                <p>
                                    Our commitment goes beyond just supply – we're your growth partner in the competitive
                                    restaurant industry.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <Card className="bg-gradient-to-br from-primary-50 to-white">
                                <div className="flex items-start gap-4">
                                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center flex-shrink-0">
                                        <span className="text-3xl">🌾</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-dark mb-2">Our Source</h3>
                                        <p className="text-gray-600">
                                            Premium farms in West Godavari & Bhimavaram, known for quality livestock
                                        </p>
                                    </div>
                                </div>
                            </Card>

                            <Card className="bg-gradient-to-br from-fresh-50 to-white">
                                <div className="flex items-start gap-4">
                                    <div className="w-16 h-16 bg-fresh rounded-2xl flex items-center justify-center flex-shrink-0">
                                        <span className="text-3xl">✅</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-dark mb-2">Our Standards</h3>
                                        <p className="text-gray-600">
                                            FSSAI-certified processing, cold chain transport, and early morning delivery
                                        </p>
                                    </div>
                                </div>
                            </Card>

                            <Card className="bg-gradient-to-br from-blue-50 to-white">
                                <div className="flex items-start gap-4">
                                    <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                                        <span className="text-3xl">🤝</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-dark mb-2">Our Promise</h3>
                                        <p className="text-gray-600">
                                            Consistent quality, reliable delivery, and fair pricing for long-term partnerships
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="section-padding bg-gray-50">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-heading font-bold text-dark mb-4">
                            Our <span className="gradient-text">Core Values</span>
                        </h2>
                        <p className="text-xl text-gray-600">
                            The principles that guide everything we do
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <Card
                                key={value.title}
                                className={`text-center animate-slide-up`}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="w-16 h-16 mx-auto mb-4 bg-primary-50 rounded-2xl flex items-center justify-center">
                                    <value.icon size={32} className="text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold text-dark mb-3">{value.title}</h3>
                                <p className="text-gray-600">{value.description}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="section-padding bg-gradient-to-r from-primary to-primary-600 text-white">
                <div className="container-custom">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <h3 className="text-5xl font-bold mb-2">45+</h3>
                            <p className="text-lg opacity-90">Restaurant Partners</p>
                        </div>
                        <div>
                            <h3 className="text-5xl font-bold mb-2">500kg+</h3>
                            <p className="text-lg opacity-90">Daily Supply</p>
                        </div>
                        <div>
                            <h3 className="text-5xl font-bold mb-2">100%</h3>
                            <p className="text-lg opacity-90">On-Time Delivery</p>
                        </div>
                        <div>
                            <h3 className="text-5xl font-bold mb-2">4-8 AM</h3>
                            <p className="text-lg opacity-90">Delivery Window</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
