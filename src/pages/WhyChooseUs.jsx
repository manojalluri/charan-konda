import { Card } from '../components/ui/Card';
import { Shield, Thermometer, Clock, Award, TrendingUp, Users, Leaf, Headphones } from 'lucide-react';

export const WhyChooseUs = () => {
    const reasons = [
        {
            icon: Shield,
            title: 'FSSAI Certified',
            description: 'Full compliance with food safety standards',
            details: 'Our processing facility holds valid FSSAI certification and undergoes regular audits to ensure the highest hygiene and safety standards.'
        },
        {
            icon: Thermometer,
            title: 'Cold Chain Excellence',
            description: 'Temperature-controlled from farm to kitchen',
            details: 'Our refrigerated fleet and real-time temperature monitoring ensure products stay fresh throughout the supply chain.'
        },
        {
            icon: Clock,
            title: 'Reliable Early Delivery',
            description: '4 AM - 8 AM delivery window',
            details: 'We understand restaurant hours. Our early morning delivery ensures fresh products are ready for your day\'s prep.'
        },
        {
            icon: Award,
            title: 'Premium Quality',
            description: 'Sourced from West Godavari farms',
            details: 'We partner with trusted farms in the Godavari region, known for their superior livestock quality and ethical practices.'
        },
        {
            icon: TrendingUp,
            title: 'Competitive Pricing',
            description: 'Direct sourcing means better rates',
            details: 'By eliminating middlemen and sourcing directly from farms, we offer restaurant-grade quality at competitive wholesale prices.'
        },
        {
            icon: Users,
            title: 'Partnership Approach',
            description: 'Your growth is our success',
            details: 'We work closely with each restaurant to understand unique needs and provide tailored solutions for long-term success.'
        },
        {
            icon: Leaf,
            title: 'Sustainable Practices',
            description: 'Ethical and responsible sourcing',
            details: 'We believe in sustainable farming practices that respect animal welfare and environmental responsibility.'
        },
        {
            icon: Headphones,
            title: '24/7 Support',
            description: 'Always available for your needs',
            details: 'Our dedicated support team is available round the clock to address any queries or last-minute requirements.'
        }
    ];

    const testimonials = [
        {
            name: 'Ravi Kumar',
            restaurant: 'Paradise Restaurant',
            quote: 'GODACUT has been our protein supplier for over a year now. The quality is consistent, and the early morning deliveries never fail.',
            rating: 5
        },
        {
            name: 'Suresh Reddy',
            restaurant: 'Bawarchi Biryani',
            quote: 'From chicken to mutton, the quality of GODACUT products is what keeps our customers coming back. Highly recommended!',
            rating: 5
        },
        {
            name: 'Venkat Rao',
            restaurant: 'Fishland Restaurant',
            quote: 'Their fish supply is the freshest we\'ve ever had. The cold chain process really shows in the quality of the product.',
            rating: 5
        }
    ];

    return (
        <div className="min-h-screen">
            {/* Hero */}
            <section className="section-padding bg-gradient-to-br from-primary-50 to-white">
                <div className="container-custom text-center">
                    <h1 className="text-5xl font-heading font-bold text-dark mb-4">
                        Why <span className="gradient-text">Choose GODACUT</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        The smart choice for professional kitchens in Hyderabad
                    </p>
                </div>
            </section>

            {/* Main Reasons */}
            <section className="section-padding">
                <div className="container-custom">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {reasons.map((reason, index) => (
                            <Card
                                key={reason.title}
                                interactive
                                className={`animate-slide-up`}
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <div className="w-16 h-16 mb-4 bg-primary-50 rounded-2xl flex items-center justify-center">
                                    <reason.icon size={32} className="text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold text-dark mb-2">{reason.title}</h3>
                                <p className="text-primary font-medium mb-3 text-sm">{reason.description}</p>
                                <p className="text-gray-600 text-sm">{reason.details}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Comparison */}
            <section className="section-padding bg-gray-50">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-heading font-bold text-dark mb-4">
                            GODACUT vs <span className="gradient-text">Traditional Suppliers</span>
                        </h2>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <Card className="overflow-hidden">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="px-6 py-4 text-left font-semibold text-dark">Feature</th>
                                        <th className="px-6 py-4 text-center font-semibold text-primary">GODACUT</th>
                                        <th className="px-6 py-4 text-center font-semibold text-gray-500">Traditional</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-t">
                                        <td className="px-6 py-4 text-gray-700">FSSAI Certification</td>
                                        <td className="px-6 py-4 text-center text-fresh text-2xl">✓</td>
                                        <td className="px-6 py-4 text-center text-gray-300 text-2xl">✗</td>
                                    </tr>
                                    <tr className="border-t bg-gray-50">
                                        <td className="px-6 py-4 text-gray-700">Cold Chain Transport</td>
                                        <td className="px-6 py-4 text-center text-fresh text-2xl">✓</td>
                                        <td className="px-6 py-4 text-center text-gray-300 text-2xl">✗</td>
                                    </tr>
                                    <tr className="border-t">
                                        <td className="px-6 py-4 text-gray-700">Early Morning Delivery (4-8 AM)</td>
                                        <td className="px-6 py-4 text-center text-fresh text-2xl">✓</td>
                                        <td className="px-6 py-4 text-center text-gray-300 text-2xl">✗</td>
                                    </tr>
                                    <tr className="border-t bg-gray-50">
                                        <td className="px-6 py-4 text-gray-700">Direct Farm Sourcing</td>
                                        <td className="px-6 py-4 text-center text-fresh text-2xl">✓</td>
                                        <td className="px-6 py-4 text-center text-gray-300 text-2xl">✗</td>
                                    </tr>
                                    <tr className="border-t">
                                        <td className="px-6 py-4 text-gray-700">24/7 Support</td>
                                        <td className="px-6 py-4 text-center text-fresh text-2xl">✓</td>
                                        <td className="px-6 py-4 text-center text-gray-300 text-2xl">✗</td>
                                    </tr>
                                    <tr className="border-t bg-gray-50">
                                        <td className="px-6 py-4 text-gray-700">Consistent Quality</td>
                                        <td className="px-6 py-4 text-center text-fresh text-2xl">✓</td>
                                        <td className="px-6 py-4 text-center text-orange-400 text-lg">~</td>
                                    </tr>
                                </tbody>
                            </table>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="section-padding">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-heading font-bold text-dark mb-4">
                            What Our <span className="gradient-text">Partners Say</span>
                        </h2>
                        <p className="text-xl text-gray-600">
                            Trusted by leading restaurants across Hyderabad
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <Card
                                key={testimonial.name}
                                className={`animate-slide-up`}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="flex gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <span key={i} className="text-yellow-400 text-xl">★</span>
                                    ))}
                                </div>
                                <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
                                <div className="border-t pt-4">
                                    <p className="font-semibold text-dark">{testimonial.name}</p>
                                    <p className="text-sm text-gray-500">{testimonial.restaurant}</p>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section-padding bg-gradient-to-r from-primary to-primary-600 text-white">
                <div className="container-custom text-center">
                    <h2 className="text-4xl font-heading font-bold mb-6">
                        Ready to Experience the GODACUT Difference?
                    </h2>
                    <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                        Join 45+ restaurants who have made the smart switch to reliable, quality protein supply.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <a href="/contact" className="btn bg-white text-primary hover:bg-gray-100">
                            Get Started Today
                        </a>
                        <a href="tel:+919876543210" className="btn border-2 border-white text-white hover:bg-white hover:text-primary">
                            Call Us Now
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};
