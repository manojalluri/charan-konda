import React, { useState } from 'react';
import { Plus, Edit, Trash2, Tag, Percent, DollarSign, ToggleRight } from 'lucide-react';

const Discounts = () => {
    const [discounts, setDiscounts] = useState([
        {
            id: 1,
            code: 'WELCOME10',
            type: 'Percentage',
            value: 10,
            minOrder: 500,
            maxDiscount: 100,
            validFrom: '2024-01-01',
            validUntil: '2024-12-31',
            usageLimit: 1000,
            usageCount: 245,
            isActive: true,
            description: 'Welcome discount for new customers'
        },
        {
            id: 2,
            code: 'BULK500',
            type: 'Flat',
            value: 500,
            minOrder: 5000,
            maxDiscount: null,
            validFrom: '2024-01-01',
            validUntil: '2024-12-31',
            usageLimit: null,
            usageCount: 89,
            isActive: true,
            description: 'Flat ₹500 off on orders above ₹5000'
        },
        {
            id: 3,
            code: 'WEEKEND15',
            type: 'Percentage',
            value: 15,
            minOrder: 1000,
            maxDiscount: 250,
            validFrom: '2024-01-01',
            validUntil: '2024-06-30',
            usageLimit: 500,
            usageCount: 167,
            isActive: true,
            description: 'Weekend special discount'
        },
        {
            id: 4,
            code: 'SUMMER20',
            type: 'Percentage',
            value: 20,
            minOrder: 2000,
            maxDiscount: 400,
            validFrom: '2024-03-01',
            validUntil: '2024-05-31',
            usageLimit: 300,
            usageCount: 298,
            isActive: false,
            description: 'Summer sale discount (Expired)'
        }
    ]);

    const [showCreateForm, setShowCreateForm] = useState(false);

    const toggleDiscountStatus = (id) => {
        setDiscounts(discounts.map(discount =>
            discount.id === id ? { ...discount, isActive: !discount.isActive } : discount
        ));
    };

    const deleteDiscount = (id) => {
        if (confirm('Are you sure you want to delete this discount?')) {
            setDiscounts(discounts.filter(discount => discount.id !== id));
        }
    };

    const getUsagePercentage = (discount) => {
        if (!discount.usageLimit) return 0;
        return (discount.usageCount / discount.usageLimit) * 100;
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Pricing & Discounts</h1>
                        <p className="text-gray-500 mt-1">Manage promotional codes and special offers</p>
                    </div>
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Create Discount
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Total Discounts</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{discounts.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                            <Tag className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Active Discounts</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{discounts.filter(d => d.isActive).length}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                            <ToggleRight className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Total Usage</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{discounts.reduce((sum, d) => sum + d.usageCount, 0)}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                            <Percent className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Avg. Discount</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">₹{Math.round(discounts.reduce((sum, d) => sum + (d.type === 'Flat' ? d.value : d.maxDiscount || 0), 0) / discounts.length)}</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Discounts List */}
            <div className="space-y-4">
                {discounts.map((discount) => (
                    <div key={discount.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                                            <Tag className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <div className="flex items-center space-x-2">
                                                <h3 className="text-lg font-semibold text-gray-900">{discount.code}</h3>
                                                <button
                                                    onClick={() => toggleDiscountStatus(discount.id)}
                                                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${discount.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                                        }`}
                                                >
                                                    {discount.isActive ? 'Active' : 'Inactive'}
                                                </button>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1">{discount.description}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium">Discount</p>
                                            <p className="text-sm font-semibold text-gray-900 mt-1">
                                                {discount.type === 'Percentage' ? `${discount.value}% off` : `₹${discount.value} off`}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium">Min. Order</p>
                                            <p className="text-sm font-semibold text-gray-900 mt-1">₹{discount.minOrder}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium">Valid Period</p>
                                            <p className="text-sm font-semibold text-gray-900 mt-1">
                                                {discount.validFrom} to {discount.validUntil}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium">Usage</p>
                                            <p className="text-sm font-semibold text-gray-900 mt-1">
                                                {discount.usageCount} {discount.usageLimit ? `/ ${discount.usageLimit}` : ''}
                                            </p>
                                        </div>
                                    </div>

                                    {discount.usageLimit && (
                                        <div className="mt-4">
                                            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                                                <span>Usage Progress</span>
                                                <span>{Math.round(getUsagePercentage(discount))}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full transition-all ${getUsagePercentage(discount) > 80 ? 'bg-red-500' : 'bg-orange-500'
                                                        }`}
                                                    style={{ width: `${getUsagePercentage(discount)}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center space-x-2 ml-4">
                                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                        <Edit className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => deleteDiscount(discount.id)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Discount Modal */}
            {showCreateForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">Create New Discount</h2>
                                <button
                                    onClick={() => setShowCreateForm(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Discount Code</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., SAVE20"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Discount Type</label>
                                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                                        <option>Percentage</option>
                                        <option>Flat Amount</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Discount Value</label>
                                    <input
                                        type="number"
                                        placeholder="10"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Min. Order Value</label>
                                    <input
                                        type="number"
                                        placeholder="500"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Valid From</label>
                                    <input
                                        type="date"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Valid Until</label>
                                    <input
                                        type="date"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    rows="3"
                                    placeholder="Brief description of the discount..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            <div className="flex items-center">
                                <input type="checkbox" id="active" className="w-4 h-4 text-orange-600 rounded" />
                                <label htmlFor="active" className="ml-2 text-sm text-gray-700">Activate immediately</label>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowCreateForm(false)}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                                Create Discount
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Discounts;
