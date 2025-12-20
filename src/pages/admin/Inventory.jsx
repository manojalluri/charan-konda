import React, { useState } from 'react';
import { Package, AlertTriangle, TrendingDown, Edit, Plus, Minus, Search, Save } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

const Inventory = () => {
    const { products, updateProduct } = useShop();
    const [editingId, setEditingId] = useState(null);
    const [newStock, setNewStock] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const getStatusInfo = (stockQty) => {
        if (stockQty <= 0) return { label: 'Out', color: 'bg-gray-100 text-gray-700' };
        if (stockQty < 10) return { label: 'Critical', color: 'bg-red-100 text-red-700' };
        if (stockQty < 30) return { label: 'Low', color: 'bg-orange-100 text-orange-700' };
        return { label: 'Good', color: 'bg-green-100 text-green-700' };
    };

    const handleStockUpdate = async (product, amount) => {
        const updatedQty = Math.max(0, (product.stock_quantity || 0) + amount);
        await updateProduct(product.id, {
            stock_quantity: updatedQty,
            stock: updatedQty > 0
        });
    };

    const handleManualStockSave = async (id) => {
        const qty = parseInt(newStock);
        if (!isNaN(qty) && qty >= 0) {
            await updateProduct(id, {
                stock_quantity: qty,
                stock: qty > 0
            });
        }
        setEditingId(null);
        setNewStock('');
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const stats = [
        {
            label: 'Total Items',
            value: products.length,
            color: 'bg-blue-50 text-blue-600'
        },
        {
            label: 'Low Stock',
            value: products.filter(p => p.stock_quantity > 0 && p.stock_quantity < 30).length,
            color: 'bg-orange-50 text-orange-600'
        },
        {
            label: 'Out of Stock',
            value: products.filter(p => p.stock_quantity <= 0).length,
            color: 'bg-red-50 text-red-600'
        },
        {
            label: 'Bulk Stock',
            value: products.filter(p => p.stock_quantity >= 30).length,
            color: 'bg-green-50 text-green-600'
        }
    ];

    return (
        <div className="p-6">
            {/* Search and Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
                    <p className="text-gray-500 mt-1">Monitor and manage product stock levels</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-full md:w-64"
                    />
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                        <p className={`text-3xl font-bold mt-2 ${stat.color.split(' ')[1]}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Stock Overview</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredProducts.map((item) => {
                                const status = getStatusInfo(item.stock_quantity || 0);
                                return (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <img
                                                    src={item.image || (item.images && item.images[0])}
                                                    alt={item.name}
                                                    className="w-12 h-12 rounded-lg object-cover"
                                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=Product' }}
                                                />
                                                <div className="ml-4">
                                                    <div className="text-sm font-bold text-gray-900">{item.name}</div>
                                                    <div className="text-[10px] text-gray-400 uppercase font-mono">{item.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.category}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {editingId === item.id ? (
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        value={newStock}
                                                        onChange={(e) => setNewStock(e.target.value)}
                                                        className="w-20 px-2 py-1 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold"
                                                        autoFocus
                                                    />
                                                    <button
                                                        onClick={() => handleManualStockSave(item.id)}
                                                        className="p-1.5 bg-green-500 text-white rounded-md hover:bg-green-600"
                                                    >
                                                        <Save size={14} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-sm font-black text-gray-900">
                                                    {item.stock_quantity || 0} kg
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center text-[10px] px-2.5 py-1 rounded-full font-bold uppercase ${status.color}`}>
                                                {status.label === 'Critical' || status.label === 'Out' ? <AlertTriangle className="w-3 h-3 mr-1" /> : null}
                                                {status.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => handleStockUpdate(item, -5)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                                    disabled={item.stock_quantity <= 0}
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setEditingId(item.id);
                                                        setNewStock((item.stock_quantity || 0).toString());
                                                    }}
                                                    className={`p-2 ${editingId === item.id ? 'text-orange-600 bg-orange-50' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'} rounded-lg transition-colors border border-transparent hover:border-blue-100`}
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleStockUpdate(item, 5)}
                                                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-transparent hover:border-green-100"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
                <div className="bg-white rounded-lg border border-dashed border-gray-300 p-12 text-center mt-6">
                    <Package className="mx-auto text-gray-300 mb-4" size={48} />
                    <h3 className="text-lg font-bold text-gray-900">No Products Found</h3>
                    <p className="text-gray-500">Try adjusting your search query</p>
                </div>
            )}
        </div>
    );
};

export default Inventory;
