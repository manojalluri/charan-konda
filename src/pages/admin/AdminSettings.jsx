import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Save } from 'lucide-react';
import { useState } from 'react';

export const AdminSettings = () => {
    const [settings, setSettings] = useState({
        brandName: 'GODACUT',
        contactNumber: '+91 98765 43210',
        email: 'contact@godacut.com',
        address: 'Hyderabad, Telangana, India - 500001',
        fssaiNumber: '12345678901234',
        deliveryStartTime: '04:00',
        deliveryEndTime: '08:00',
        minOrderQuantity: '5',
        coldChainTemp: '4'
    });

    const handleChange = (e) => {
        setSettings({
            ...settings,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = (e) => {
        e.preventDefault();
        alert('Settings saved successfully!');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-heading font-bold text-dark mb-2">Settings</h1>
                <p className="text-gray-600">Manage your business configuration</p>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                {/* Business Information */}
                <Card>
                    <h2 className="text-xl font-semibold text-dark mb-6">Business Information</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-dark mb-2">
                                Brand Name
                            </label>
                            <Input
                                type="text"
                                name="brandName"
                                value={settings.brandName}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark mb-2">
                                Contact Number
                            </label>
                            <Input
                                type="tel"
                                name="contactNumber"
                                value={settings.contactNumber}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark mb-2">
                                Email Address
                            </label>
                            <Input
                                type="email"
                                name="email"
                                value={settings.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark mb-2">
                                FSSAI License Number
                            </label>
                            <Input
                                type="text"
                                name="fssaiNumber"
                                value={settings.fssaiNumber}
                                onChange={handleChange}
                                disabled
                                className="bg-gray-100"
                            />
                            <p className="text-xs text-gray-500 mt-1">Contact support to update</p>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-dark mb-2">
                                Business Address
                            </label>
                            <Input
                                type="text"
                                name="address"
                                value={settings.address}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </Card>

                {/* Operational Settings */}
                <Card>
                    <h2 className="text-xl font-semibold text-dark mb-6">Operational Settings</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-dark mb-2">
                                Delivery Start Time
                            </label>
                            <Input
                                type="time"
                                name="deliveryStartTime"
                                value={settings.deliveryStartTime}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark mb-2">
                                Delivery End Time
                            </label>
                            <Input
                                type="time"
                                name="deliveryEndTime"
                                value={settings.deliveryEndTime}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark mb-2">
                                Minimum Order Quantity (kg)
                            </label>
                            <Input
                                type="number"
                                name="minOrderQuantity"
                                value={settings.minOrderQuantity}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark mb-2">
                                Cold Chain Temperature (°C)
                            </label>
                            <Input
                                type="number"
                                name="coldChainTemp"
                                value={settings.coldChainTemp}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </Card>

                {/* Notification Settings */}
                <Card>
                    <h2 className="text-xl font-semibold text-dark mb-6">Notification Preferences</h2>
                    <div className="space-y-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" className="w-5 h-5 text-primary" defaultChecked />
                            <div>
                                <p className="font-medium text-dark">New Order Notifications</p>
                                <p className="text-sm text-gray-500">Get notified when a new order is placed</p>
                            </div>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" className="w-5 h-5 text-primary" defaultChecked />
                            <div>
                                <p className="font-medium text-dark">Delivery Updates</p>
                                <p className="text-sm text-gray-500">Receive delivery status updates</p>
                            </div>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" className="w-5 h-5 text-primary" defaultChecked />
                            <div>
                                <p className="font-medium text-dark">Low Stock Alerts</p>
                                <p className="text-sm text-gray-500">Alert when product stock is running low</p>
                            </div>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" className="w-5 h-5 text-primary" />
                            <div>
                                <p className="font-medium text-dark">Marketing Emails</p>
                                <p className="text-sm text-gray-500">Receive promotional updates and tips</p>
                            </div>
                        </label>
                    </div>
                </Card>

                {/* Save Button */}
                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline">
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary">
                        <Save size={18} />
                        Save Changes
                    </Button>
                </div>
            </form>
        </div>
    );
};
