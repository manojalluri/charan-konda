import { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Search, Edit, Eye } from 'lucide-react';
import { products } from '../../data/mockData';

export const AdminProducts = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const categories = ['All', ...new Set(products.map(p => p.category))];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-dark mb-2">Product Management</h1>
                    <p className="text-gray-600">Manage your product catalog</p>
                </div>
                <Button variant="primary">
                    + Add Product
                </Button>
            </div>

            {/* Filters */}
            <Card>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12"
                        />
                    </div>
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="input md:w-48"
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </Card>

            {/* Products Table */}
            <Card className="overflow-x-auto">
                <table className="table-custom">
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Category</th>
                            <th>Pack Sizes</th>
                            <th>Processing</th>
                            <th>Min Order</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map((product) => (
                            <tr key={product.id}>
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                                            <span className="text-xl">🍖</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-dark">{product.name}</p>
                                            <p className="text-xs text-gray-500">{product.deliveryTime}</p>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className="badge-success">{product.category}</span>
                                </td>
                                <td>{product.packSizes.join(', ')}</td>
                                <td>{product.processing}</td>
                                <td className="font-medium">{product.minOrder}</td>
                                <td>
                                    <span className="status-active">Active</span>
                                </td>
                                <td>
                                    <div className="flex gap-2">
                                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="View">
                                            <Eye size={18} className="text-gray-600" />
                                        </button>
                                        <button className="p-2 hover:bg-blue-100 rounded-lg transition-colors" title="Edit">
                                            <Edit size={18} className="text-blue-600" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No products found matching your criteria
                    </div>
                )}
            </Card>

            {/* Category Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {categories.filter(c => c !== 'All').map(category => (
                    <Card key={category}>
                        <p className="text-sm text-gray-600 mb-1">{category}</p>
                        <p className="text-3xl font-bold text-primary">
                            {products.filter(p => p.category === category).length}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">products</p>
                    </Card>
                ))}
            </div>
        </div>
    );
};
