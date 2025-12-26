import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Tag, Percent, DollarSign, ToggleRight, Loader } from 'lucide-react';
import { api } from '../../lib/api';

const Discounts = () => {
    const [discounts, setDiscounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        type: 'Percentage',
        value: '',
        minOrder: '',
        validFrom: '',
        validUntil: '',
        usageLimit: '',
        description: '',
        isActive: true
    });

    useEffect(() => {
        fetchDiscounts();
    }, []);

    const fetchDiscounts = async () => {
        try {
            const data = await api.get('/coupons');
            setDiscounts(data);
        } catch (err) {
            console.error('Failed to fetch coupons:', err);
        } finally {
            setLoading(false);
        }
    };

    const toggleDiscountStatus = async (id, currentStatus) => {
        try {
            const data = await api.put(`/coupons/${id}`, { isActive: !currentStatus });
            setDiscounts(discounts.map(d => d._id === id ? data : d));
        } catch (err) {
            console.error('Failed to update status:', err);
            alert('Failed to update discount status');
        }
    };

    const deleteDiscount = async (id) => {
        if (!confirm('Are you sure you want to delete this discount?')) return;
        try {
            await api.delete(`/coupons/${id}`);
            setDiscounts(discounts.filter(d => d._id !== id));
        } catch (err) {
            console.error('Failed to delete coupon:', err);
            alert('Failed to delete coupon');
        }
    };

    const handleInput = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                value: Number(formData.value),
                minOrder: Number(formData.minOrder) || 0,
                usageLimit: formData.usageLimit ? Number(formData.usageLimit) : undefined
            };
            const data = await api.post('/coupons', payload);
            setDiscounts([data, ...discounts]);
            setShowCreateForm(false);
            setFormData({
                code: '',
                type: 'Percentage',
                value: '',
                minOrder: '',
                validFrom: '',
                validUntil: '',
                usageLimit: '',
                description: '',
                isActive: true
            });
        } catch (err) {
            console.error('Failed to create coupon:', err);
            alert(err.response?.data?.message || 'Failed to create coupon');
        }
    };


    if (loading) return <div className="p-10 text-center"><Loader className="animate-spin mx-auto" /> Loading discounts...</div>;

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
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {discounts.length ? '₹' + Math.round(discounts.reduce((sum, d) => sum + d.value, 0) / discounts.length) : '₹0'}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Discounts List */}
            <div className="space-y-4">
                {discounts.length === 0 && <p className="text-center text-gray-500 py-10">No coupons created yet.</p>}

                {discounts.map((discount) => (
                    <div key={discount._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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
                                                    onClick={() => toggleDiscountStatus(discount._id, discount.isActive)}
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
                                                {new Date(discount.validFrom).toLocaleDateString()}
                                                {discount.validUntil ? ` to ${new Date(discount.validUntil).toLocaleDateString()}` : ' (No Expiry)'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium">Usage</p>
                                            <p className="text-sm font-semibold text-gray-900 mt-1">
                                                {discount.usageCount} {discount.usageLimit ? `/ ${discount.usageLimit}` : ''}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 ml-4">
                                    <button
                                        onClick={() => deleteDiscount(discount._id)}
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
                                <button onClick={() => setShowCreateForm(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Discount Code</label>
                                    <input required name="code" value={formData.code} onChange={handleInput} type="text" placeholder="e.g., SAVE20" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Discount Type</label>
                                    <select name="type" value={formData.type} onChange={handleInput} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                                        <option value="Percentage">Percentage</option>
                                        <option value="Flat">Flat Amount</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Discount Value</label>
                                    <input required name="value" value={formData.value} onChange={handleInput} type="number" placeholder="10" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Min. Order Value</label>
                                    <input name="minOrder" value={formData.minOrder} onChange={handleInput} type="number" placeholder="0" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Valid From</label>
                                    <input required name="validFrom" value={formData.validFrom} onChange={handleInput} type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Valid Until</label>
                                    <input name="validUntil" value={formData.validUntil} onChange={handleInput} type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Usage Limit</label>
                                    <input name="usageLimit" value={formData.usageLimit} onChange={handleInput} type="number" placeholder="Optional" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea name="description" value={formData.description} onChange={handleInput} rows="3" placeholder="Description..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                            </div>

                            <div className="flex items-center">
                                <input name="isActive" checked={formData.isActive} onChange={handleInput} type="checkbox" id="active" className="w-4 h-4 text-orange-600 rounded" />
                                <label htmlFor="active" className="ml-2 text-sm text-gray-700">Activate immediately</label>
                            </div>

                            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                                <button type="button" onClick={() => setShowCreateForm(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">Create Discount</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Discounts;
