import React, { useState, useEffect } from 'react';
import { Store, MapPin, Phone, Mail, DollarSign, Percent, CreditCard, Save, Users, Shield } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

const Settings = () => {
    const { siteConfig, updateSiteConfig } = useShop();
    const [activeTab, setActiveTab] = useState('store');
    const [storeSettings, setStoreSettings] = useState({
        name: 'CUTORA',
        email: 'contact@CUTORA.com',
        phone: '+91 98765 43210',
        address: '123 Business Park, HSR Layout, Bangalore, Karnataka - 560102',
        deliveryCharge: 50,
        freeDeliveryAbove: 1000,
        taxRate: 5,
        minOrderValue: 200,
        cleaningCharge: 10,
        cleaningEnabled: true,
        cuttingCharge: 15,
        cuttingEnabled: true
    });

    useEffect(() => {
        if (siteConfig) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setStoreSettings(prev => ({ ...prev, ...siteConfig }));
        }
    }, [siteConfig]);

    const [paymentMethods, setPaymentMethods] = useState([
        { id: 1, name: 'Cash on Delivery', enabled: true },
        { id: 2, name: 'UPI Payment', enabled: true },
        { id: 3, name: 'Credit/Debit Card', enabled: true },
        { id: 4, name: 'Net Banking', enabled: false }
    ]);

    const [adminUsers] = useState([
        {
            id: 1,
            name: 'Admin User',
            email: 'admin@CUTORA.com',
            role: 'Super Admin',
            status: 'Active',
            lastLogin: '2024-12-17 10:30 AM'
        },
        {
            id: 2,
            name: 'Manager User',
            email: 'manager@CUTORA.com',
            role: 'Manager',
            status: 'Active',
            lastLogin: '2024-12-17 09:15 AM'
        },
        {
            id: 3,
            name: 'Staff User',
            email: 'staff@CUTORA.com',
            role: 'Staff',
            status: 'Active',
            lastLogin: '2024-12-16 06:45 PM'
        }
    ]);

    const handleSaveStoreSettings = async () => {
        const result = await updateSiteConfig(storeSettings);
        if (result.success) {
            alert('Store settings saved successfully!');
        } else {
            alert('Failed to save settings: ' + result.error);
        }
    };

    const togglePaymentMethod = (id) => {
        setPaymentMethods(paymentMethods.map(method =>
            method.id === id ? { ...method, enabled: !method.enabled } : method
        ));
    };

    const tabs = [
        { id: 'store', name: 'Store Details', icon: Store },
        { id: 'payment', name: 'Payment Methods', icon: CreditCard },
        { id: 'users', name: 'Users & Roles', icon: Users }
    ];

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-500 mt-1">Manage your store configuration</p>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6" aria-label="Tabs">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                        ? 'border-orange-500 text-orange-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    <Icon className="w-5 h-5 mr-2" />
                                    {tab.name}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {/* Store Details Tab */}
                    {activeTab === 'store' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
                                        <input
                                            type="text"
                                            value={storeSettings.name}
                                            onChange={(e) => setStoreSettings({ ...storeSettings, name: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                        <input
                                            type="email"
                                            value={storeSettings.email}
                                            onChange={(e) => setStoreSettings({ ...storeSettings, email: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                        <input
                                            type="tel"
                                            value={storeSettings.phone}
                                            onChange={(e) => setStoreSettings({ ...storeSettings, phone: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                        <input
                                            type="text"
                                            value={storeSettings.address}
                                            onChange={(e) => setStoreSettings({ ...storeSettings, address: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Delivery</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Charge (₹)</label>
                                        <input
                                            type="number"
                                            value={storeSettings.deliveryCharge}
                                            onChange={(e) => setStoreSettings({ ...storeSettings, deliveryCharge: parseInt(e.target.value) })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Free Delivery Above (₹)</label>
                                        <input
                                            type="number"
                                            value={storeSettings.freeDeliveryAbove}
                                            onChange={(e) => setStoreSettings({ ...storeSettings, freeDeliveryAbove: parseInt(e.target.value) })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate (%)</label>
                                        <input
                                            type="number"
                                            value={storeSettings.taxRate}
                                            onChange={(e) => setStoreSettings({ ...storeSettings, taxRate: parseFloat(e.target.value) })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Order Value (₹)</label>
                                        <input
                                            type="number"
                                            value={storeSettings.minOrderValue}
                                            onChange={(e) => setStoreSettings({ ...storeSettings, minOrderValue: parseInt(e.target.value) })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    onClick={handleSaveStoreSettings}
                                    className="flex items-center px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                                >
                                    <Save className="w-5 h-5 mr-2" />
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Payment Methods Tab */}
                    {activeTab === 'payment' && (
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Payment Methods</h3>
                                <p className="text-sm text-gray-500 mb-6">Enable or disable payment methods for your customers</p>
                            </div>

                            <div className="space-y-3">
                                {paymentMethods.map((method) => (
                                    <div key={method.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                                        <div className="flex items-center">
                                            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center mr-4">
                                                <CreditCard className="w-6 h-6 text-orange-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{method.name}</p>
                                                <p className="text-xs text-gray-500">
                                                    {method.enabled ? 'Currently enabled' : 'Currently disabled'}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => togglePaymentMethod(method.id)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${method.enabled ? 'bg-orange-600' : 'bg-gray-300'
                                                }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${method.enabled ? 'translate-x-6' : 'translate-x-1'
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                                <div className="flex">
                                    <Shield className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                                    <div>
                                        <h4 className="text-sm font-semibold text-blue-900">Payment Gateway Integration</h4>
                                        <p className="text-sm text-blue-700 mt-1">
                                            For card payments and net banking, you need to integrate a payment gateway like Razorpay or Stripe.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Users & Roles Tab */}
                    {activeTab === 'users' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Admin Users</h3>
                                    <p className="text-sm text-gray-500 mt-1">Manage admin access and permissions</p>
                                </div>
                                <button className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                                    <Users className="w-5 h-5 mr-2" />
                                    Add User
                                </button>
                            </div>

                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Login</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {adminUsers.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                                                            <span className="text-white font-semibold text-sm">
                                                                {user.name.split(' ').map(n => n[0]).join('')}
                                                            </span>
                                                        </div>
                                                        <div className="ml-3">
                                                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                                            <p className="text-xs text-gray-500">{user.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex text-xs px-2.5 py-1 rounded-full font-medium ${user.role === 'Super Admin' ? 'bg-purple-100 text-purple-700' :
                                                        user.role === 'Manager' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-gray-100 text-gray-700'
                                                        }`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.lastLogin}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex text-xs px-2.5 py-1 rounded-full font-medium ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                        }`}>
                                                        {user.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                    <button className="text-orange-600 hover:text-orange-700 font-medium">
                                                        Edit
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-3">Role Permissions</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <h5 className="text-sm font-semibold text-gray-900 mb-2">Super Admin</h5>
                                        <ul className="text-xs text-gray-600 space-y-1">
                                            <li>✓ Full system access</li>
                                            <li>✓ Manage all users</li>
                                            <li>✓ Configuration control</li>
                                            <li>✓ All permissions</li>
                                        </ul>
                                    </div>
                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <h5 className="text-sm font-semibold text-gray-900 mb-2">Manager</h5>
                                        <ul className="text-xs text-gray-600 space-y-1">
                                            <li>✓ Manage orders</li>
                                            <li>✓ Manage products</li>
                                            <li>✓ View analytics</li>
                                            <li>✗ System settings</li>
                                        </ul>
                                    </div>
                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <h5 className="text-sm font-semibold text-gray-900 mb-2">Staff</h5>
                                        <ul className="text-xs text-gray-600 space-y-1">
                                            <li>✓ View orders</li>
                                            <li>✓ Update order status</li>
                                            <li>✗ Manage products</li>
                                            <li>✗ View analytics</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
