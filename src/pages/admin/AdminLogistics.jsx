import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Truck, Clock, MapPin, User } from 'lucide-react';
import { deliverySlots } from '../../data/mockData';

export const AdminLogistics = () => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'success';
            case 'In Progress': return 'info';
            case 'Scheduled': return 'warning';
            default: return 'info';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-dark mb-2">Logistics Management</h1>
                    <p className="text-gray-600">Track delivery vehicles and schedules</p>
                </div>
            </div>

            {/* Delivery Slots */}
            <div>
                <h2 className="text-xl font-semibold text-dark mb-4">Today's Delivery Schedule</h2>
                <div className="space-y-4">
                    {deliverySlots.map((slot) => (
                        <Card key={slot.id}>
                            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                                {/* Time and Status */}
                                <div className="lg:w-48">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Clock size={20} className="text-primary" />
                                        <span className="font-semibold text-dark">{slot.timeSlot}</span>
                                    </div>
                                    <Badge variant={getStatusColor(slot.status)}>
                                        {slot.status}
                                    </Badge>
                                </div>

                                {/* Vehicle Info */}
                                <div className="flex-1 grid md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Vehicle & Driver</p>
                                        <div className="flex items-center gap-2">
                                            <Truck size={18} className="text-primary" />
                                            <span className="font-medium text-dark">{slot.vehicle}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <User size={18} className="text-gray-400" />
                                            <span className="text-sm text-gray-600">{slot.driver}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Total Quantity</p>
                                        <p className="text-2xl font-bold text-primary">{slot.totalQuantity}</p>
                                    </div>
                                </div>

                                {/* Restaurants */}
                                <div className="lg:w-64">
                                    <p className="text-sm text-gray-500 mb-2">Delivery Stops</p>
                                    <div className="space-y-1">
                                        {slot.restaurants.map((restaurant, index) => (
                                            <div key={index} className="flex items-center gap-2 text-sm">
                                                <MapPin size={14} className="text-primary" />
                                                <span className="text-gray-700">{restaurant}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Vehicle Fleet */}
            <div>
                <h2 className="text-xl font-semibold text-dark mb-4">Vehicle Fleet</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {['VAN-01', 'VAN-02', 'VAN-03'].map((vehicle) => (
                        <Card key={vehicle}>
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Truck size={24} className="text-primary" />
                                        <h3 className="text-xl font-semibold text-dark">{vehicle}</h3>
                                    </div>
                                    <p className="text-sm text-gray-500">Refrigerated Van</p>
                                </div>
                                <Badge variant="success">Active</Badge>
                            </div>

                            <div className="space-y-3 mb-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Capacity</span>
                                    <span className="font-medium text-dark">500kg</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Temperature</span>
                                    <span className="font-medium text-fresh">4°C</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Last Maintenance</span>
                                    <span className="font-medium text-dark">15 Dec 2025</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t">
                                <p className="text-xs text-gray-500 mb-1">Current Driver</p>
                                <p className="font-medium text-dark">
                                    {deliverySlots.find(s => s.vehicle === vehicle)?.driver || 'Not Assigned'}
                                </p>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <Card>
                    <p className="text-sm text-gray-600 mb-1">Total Deliveries Today</p>
                    <p className="text-3xl font-bold text-dark">{deliverySlots.length}</p>
                </Card>
                <Card>
                    <p className="text-sm text-gray-600 mb-1">Completed</p>
                    <p className="text-3xl font-bold text-green-600">
                        {deliverySlots.filter(s => s.status === 'Completed').length}
                    </p>
                </Card>
                <Card>
                    <p className="text-sm text-gray-600 mb-1">In Progress</p>
                    <p className="text-3xl font-bold text-blue-600">
                        {deliverySlots.filter(s => s.status === 'In Progress').length}
                    </p>
                </Card>
                <Card>
                    <p className="text-sm text-gray-600 mb-1">Scheduled</p>
                    <p className="text-3xl font-bold text-yellow-600">
                        {deliverySlots.filter(s => s.status === 'Scheduled').length}
                    </p>
                </Card>
            </div>
        </div>
    );
};
