import { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Search, Eye, Phone, Mail } from 'lucide-react';
import { restaurants } from '../../data/mockData';
import { Badge } from '../../components/ui/Badge';

export const AdminRestaurants = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredRestaurants = restaurants.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.area.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-dark mb-2">Restaurant Partners</h1>
                    <p className="text-gray-600">Manage your restaurant partnerships</p>
                </div>
                <Button variant="primary">
                    + Add Restaurant
                </Button>
            </div>

            {/* Search */}
            <Card>
                <div className="relative">
                    <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Search by restaurant name or area..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12"
                    />
                </div>
            </Card>

            {/* Restaurants Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRestaurants.map((restaurant) => (
                    <Card key={restaurant.id} interactive>
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold text-dark mb-1">{restaurant.name}</h3>
                                <p className="text-sm text-gray-500">{restaurant.area}, {restaurant.city}</p>
                            </div>
                            <Badge variant={restaurant.status === 'Active' ? 'success' : 'warning'}>
                                {restaurant.status}
                            </Badge>
                        </div>

                        <div className="space-y-3 mb-4 pb-4 border-b">
                            <div className="flex items-center gap-2 text-sm">
                                <Phone size={16} className="text-primary" />
                                <span className="text-gray-600">{restaurant.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Mail size={16} className="text-primary" />
                                <span className="text-gray-600">{restaurant.email}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Daily Requirement</p>
                                <p className="font-semibold text-dark">{restaurant.dailyRequirement}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Joined</p>
                                <p className="font-semibold text-dark">
                                    {new Date(restaurant.joinedDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                                </p>
                            </div>
                        </div>

                        <div className="mb-4">
                            <p className="text-xs text-gray-500 mb-2">Preferred Products</p>
                            <div className="flex flex-wrap gap-2">
                                {restaurant.preferredProducts.map((product) => (
                                    <span key={product} className="px-2 py-1 bg-primary-50 text-primary text-xs rounded-lg font-medium">
                                        {product}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <Button variant="outline" className="w-full">
                            <Eye size={18} />
                            View Details
                        </Button>
                    </Card>
                ))}
            </div>

            {filteredRestaurants.length === 0 && (
                <Card className="text-center py-12 text-gray-500">
                    No restaurants  found matching your search
                </Card>
            )}

            {/* Summary */}
            <Card>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    <div>
                        <p className="text-sm text-gray-600 mb-1">Total Partners</p>
                        <p className="text-3xl font-bold text-dark">{restaurants.length}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 mb-1">Active</p>
                        <p className="text-3xl font-bold text-green-600">
                            {restaurants.filter(r => r.status === 'Active').length}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 mb-1">Total Daily Demand</p>
                        <p className="text-3xl font-bold text-primary">
                            {restaurants.reduce((sum, r) => sum + parseInt(r.dailyRequirement), 0)}kg
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 mb-1">New This Month</p>
                        <p className="text-3xl font-bold text-blue-600">5</p>
                    </div>
                </div>
            </Card>
        </div>
    );
};
