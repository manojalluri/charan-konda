import { Card } from '../components/ui/Card';
import { MapPin, Droplet, Thermometer, Truck, CheckCircle, Clock } from 'lucide-react';

export const HowItWorks = () => {
    const steps = [
        {
            icon: MapPin,
            title: 'Direct Sourcing from West Godavari',
            description: 'We work directly with trusted farms in the West Godavari and Bhimavaram regions, known for their premium livestock quality.',
            details: [
                'Partnership with 20+ verified farms',
                'Daily quality checks at source',
                'Humane and ethical farming practices',
                'Traceability from farm to kitchen'
            ],
            color: 'from-blue-500 to-blue-600'
        },
        {
            icon: Droplet,
            title: 'Hygienic Processing Facility',
            description: 'Our FSSAI-certified processing unit maintains the highest standards of hygiene and food safety.',
            details: [
                'FSSAI-certified facility',
                'Temperature-controlled environment',
                'Trained hygiene personnel',
                'Regular third-party audits'
            ],
            color: 'from-fresh to-fresh-600'
        },
        {
            icon: Thermometer,
            title: 'Cold Chain Transport',
            description: 'From processing to delivery, products are maintained at optimal temperatures to ensure freshness.',
            details: [
                'Refrigerated vehicles fleet',
                'Real-time temperature monitoring',
                'GPS-tracked deliveries',
                'Insulated packaging'
            ],
            color: 'from-cyan-500 to-cyan-600'
        },
        {
            icon: Truck,
            title: 'Early Morning Delivery',
            description: 'Fresh products delivered between 4 AM - 8 AM, ready for your day\'s service.',
            details: [
                'Dedicated delivery slots',
                'Experienced delivery team',
                'Direct handover to kitchen staff',
                'Invoice and quality certificate'
            ],
            color: 'from-primary to-primary-600'
        }
    ];

    const timeline = [
        { time: '2:00 AM', task: 'Collection from farms' },
        { time: '3:00 AM', task: 'Processing & packaging' },
        { time: '4:00 AM', task: 'Dispatch begins' },
        { time: '4:00 - 8:00 AM', task: 'Deliveries to restaurants' },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero */}
            <section className="section-padding bg-gradient-to-br from-primary-50 to-white">
                <div className="container-custom text-center">
                    <h1 className="text-5xl font-heading font-bold text-dark mb-4">
                        How <span className="gradient-text">It Works</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        From farm to your kitchen - our streamlined supply process ensures freshness and quality
                    </p>
                </div>
            </section>

            {/* Steps */}
            <section className="section-padding">
                <div className="container-custom">
                    <div className="space-y-16">
                        {steps.map((step, index) => (
                            <div
                                key={step.title}
                                className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                                    }`}
                            >
                                <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center shadow-card-hover`}>
                                            <step.icon size={40} className="text-white" />
                                        </div>
                                        <div>
                                            <span className="text-sm font-semibold text-gray-500">STEP {index + 1}</span>
                                            <h2 className="text-3xl font-heading font-bold text-dark">{step.title}</h2>
                                        </div>
                                    </div>
                                    <p className="text-lg text-gray-600 mb-6">{step.description}</p>
                                    <Card className="bg-gray-50">
                                        <ul className="space-y-3">
                                            {step.details.map((detail) => (
                                                <li key={detail} className="flex items-start gap-3">
                                                    <CheckCircle size={20} className="text-fresh mt-0.5 flex-shrink-0" />
                                                    <span className="text-gray-700">{detail}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </Card>
                                </div>

                                <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                                    <Card className="aspect-square flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                        <div className="text-center p-8">
                                            <div className={`w-32 h-32 mx-auto mb-4 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center`}>
                                                <step.icon size={64} className="text-white" />
                                            </div>
                                            <p className="text-2xl font-bold text-dark">Step {index + 1}</p>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Daily Timeline */}
            <section className="section-padding bg-gray-50">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-heading font-bold text-dark mb-4">
                            Daily <span className="gradient-text">Operations Timeline</span>
                        </h2>
                        <p className="text-xl text-gray-600">
                            A typical day in CUTORA operations
                        </p>
                    </div>

                    <div className="max-w-3xl mx-auto">
                        <div className="relative">
                            {/* Timeline Line */}
                            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary-200" />

                            {/* Timeline Items */}
                            <div className="space-y-8">
                                {timeline.map((item, index) => (
                                    <div key={item.time} className="relative flex items-start gap-6">
                                        <div className="relative z-10 w-16 h-16 bg-gradient-to-br from-primary to-primary-600 rounded-full flex items-center justify-center shadow-card-hover flex-shrink-0">
                                            <Clock size={24} className="text-white" />
                                        </div>
                                        <Card className="flex-1 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                                            <h3 className="text-xl font-semibold text-primary mb-2">{item.time}</h3>
                                            <p className="text-gray-700">{item.task}</p>
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quality Assurance */}
            <section className="section-padding bg-gradient-to-br from-primary to-primary-600 text-white">
                <div className="container-custom">
                    <div className="text-center max-w-3xl mx-auto">
                        <h2 className="text-4xl font-heading font-bold mb-6">
                            Quality at Every Step
                        </h2>
                        <p className="text-xl opacity-90 mb-8">
                            Our 4-step process is backed by rigorous quality checks, FSSAI certification,
                            cold chain technology, and a commitment to hygiene that sets us apart.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                                FSSAI Certified
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                                Cold Chain Assured
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                                100% Fresh
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                                On-Time Delivery
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
