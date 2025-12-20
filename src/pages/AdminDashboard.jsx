import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Fish, ShoppingBag, Plus, Edit2, Trash2, LogOut, CheckCircle, Package, Settings, Image as ImageIcon, Upload } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const AdminDashboard = () => {
    const { products, orders, isAdmin, siteConfig, logoutAdmin, deleteProduct, addProduct, updateProduct, updateSiteConfig } = useShop();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // Settings State
    const [configForm, setConfigForm] = useState(siteConfig);

    // Product Form State
    const [formData, setFormData] = useState({
        name: '',
        category: 'Sea Fish',
        price: '',
        stock: true,
        image: '/sea_fish.png',
        description: '',
        cuts: ['Uncut', 'Cut & Cleaned']
    });

    // Sync config form when siteConfig changes (e.g. on load)
    useEffect(() => {
        setConfigForm(siteConfig);
    }, [siteConfig]);

    if (!isAdmin) {
        navigate('/admin/login');
        return null;
    }

    const handleLogout = () => {
        logoutAdmin();
        navigate('/');
    };

    // --- PRODUCT HANDLERS ---
    const handleProductSave = (e) => {
        e.preventDefault();
        const productData = {
            ...formData,
            price: Number(formData.price),
            rating: editingProduct ? editingProduct.rating : 4.5
        };

        if (editingProduct) {
            updateProduct(editingProduct.id, productData);
        } else {
            addProduct(productData);
        }

        setIsModalOpen(false);
        setEditingProduct(null);
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            name: '',
            category: 'Sea Fish',
            price: '',
            stock: true,
            image: '/sea_fish.png',
            description: '',
            cuts: ['Uncut', 'Cut & Cleaned']
        });
    };

    const openEdit = (product) => {
        setEditingProduct(product);
        setFormData(product);
        setIsModalOpen(true);
    };

    const openAdd = () => {
        setEditingProduct(null);
        resetForm();
        setIsModalOpen(true);
    };

    // --- SETTINGS HANDLERS ---
    const handleConfigSave = (e) => {
        e.preventDefault();
        updateSiteConfig(configForm);
        alert("Site settings updated successfully!");
    };

    // Mock Image Upload (Just sets a URL for now)
    // Mock Image Upload (Just sets a URL for now)
    const handleImageUpload = (e, field, formSetter, currentForm) => {
        const file = e.target.files[0];
        if (file) {
            // 800KB limit to prevent LocalStorage quota exceeded errors
            if (file.size > 800 * 1024) {
                alert("File too large! Please select an image under 800KB to save to local storage.");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                formSetter({ ...currentForm, [field]: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };


    // --- TABS COMPONENTS ---
    const SummaryTab = () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-brand-blue rounded-xl">
                    <Fish size={24} />
                </div>
                <div>
                    <p className="text-gray-500 text-sm font-medium">Total Fish Items</p>
                    <p className="text-2xl font-bold">{products.length}</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="p-3 bg-orange-50 text-brand-orange rounded-xl">
                    <ShoppingBag size={24} />
                </div>
                <div>
                    <p className="text-gray-500 text-sm font-medium">Total Orders</p>
                    <p className="text-2xl font-bold">{orders.length}</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                    <CheckCircle size={24} />
                </div>
                <div>
                    <p className="text-gray-500 text-sm font-medium">Active Listings</p>
                    <p className="text-2xl font-bold">{products.filter(p => p.stock).length}</p>
                </div>
            </div>
        </div>
    );

    const ProductsTab = () => (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-lg">Product Management</h3>
                <button onClick={openAdd} className="bg-brand-orange text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-orange-600">
                    <Plus size={16} /> Add Fish
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 font-medium">
                        <tr>
                            <th className="p-4">Product</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Price/Kg</th>
                            <th className="p-4">Stock</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.map(p => (
                            <tr key={p.id} className="hover:bg-gray-50/50">
                                <td className="p-4 flex items-center gap-3">
                                    <img src={p.image} className="w-12 h-12 rounded-lg object-cover bg-gray-100" alt={p.name} />
                                    <span className="font-bold text-gray-800">{p.name}</span>
                                </td>
                                <td className="p-4 text-gray-600">{p.category}</td>
                                <td className="p-4 font-bold">₹{p.price}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${p.stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {p.stock ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    <button onClick={() => openEdit(p)} className="p-2 text-gray-400 hover:text-brand-blue hover:bg-blue-50 rounded-lg transition-colors">
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => deleteProduct(p.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const OrdersTab = () => (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
                <h3 className="font-bold text-lg">Recent Orders</h3>
            </div>
            {orders.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No orders placed yet.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 font-medium">
                            <tr>
                                <th className="p-4">Order ID</th>
                                <th className="p-4">Customer</th>
                                <th className="p-4">Items</th>
                                <th className="p-4">Total</th>
                                <th className="p-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.map(order => (
                                <tr key={order.id}>
                                    <td className="p-4 font-mono font-bold text-xs">{order.id}</td>
                                    <td className="p-4">
                                        <div className="font-bold">{order.customer.name}</div>
                                        <div className="text-xs text-gray-500">{order.customer.phone}</div>
                                    </td>
                                    <td className="p-4 text-gray-600">
                                        {order.items.map(i => (
                                            <div key={`${i.id}-${i.cut}`}>{i.quantity}x {i.name} ({i.cut})</div>
                                        ))}
                                    </td>
                                    <td className="p-4 font-bold">₹{order.total}</td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );

    const SettingsTab = () => (
        <div className="max-w-2xl bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-8">
            <div className="mb-6">
                <h3 className="font-bold text-lg text-brand-dark mb-1">Site Customization</h3>
                <p className="text-gray-500 text-sm">Update your brand identity, logo, and banners.</p>
            </div>

            <form onSubmit={handleConfigSave} className="space-y-6">
                {/* Brand Name */}
                <div>
                    <label className="text-xs font-bold text-gray-700 uppercase mb-1 block">Brand Name</label>
                    <input
                        value={configForm.brandName}
                        onChange={e => setConfigForm({ ...configForm, brandName: e.target.value })}
                        className="w-full p-3 bg-gray-50 rounded-lg border focus:ring-1 focus:ring-brand-orange outline-none"
                        placeholder="e.g. CUTORA FISHES"
                    />
                </div>

                {/* Logo Upload */}
                <div>
                    <label className="text-xs font-bold text-gray-700 uppercase mb-1 block">Website Logo</label>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                            {configForm.logo ? (
                                <img src={configForm.logo} className="w-full h-full object-contain" />
                            ) : (
                                <ImageIcon className="text-gray-300" />
                            )}
                        </div>
                        <div className="flex-1">
                            <input
                                type="text"
                                value={configForm.logo || ''}
                                onChange={e => setConfigForm({ ...configForm, logo: e.target.value })}
                                placeholder="Paste Logo URL..."
                                className="w-full p-2 text-sm bg-gray-50 rounded-lg border mb-2"
                            />
                            <label className="cursor-pointer inline-flex items-center gap-2 text-brand-orange font-bold text-sm hover:underline">
                                <Upload size={14} /> Upload Image
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'logo', setConfigForm, configForm)} />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Hero Image */}
                <div>
                    <label className="text-xs font-bold text-gray-700 uppercase mb-1 block">Home Screen Poster (Hero Image)</label>
                    <div className="aspect-video bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden mb-2 relative group">
                        {configForm.heroImage ? (
                            <img src={configForm.heroImage} className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex flex-col items-center text-gray-400">
                                <ImageIcon size={32} />
                                <span className="text-xs mt-1">No Image Set</span>
                            </div>
                        )}
                    </div>
                    <input
                        type="text"
                        value={configForm.heroImage || ''}
                        onChange={e => setConfigForm({ ...configForm, heroImage: e.target.value })}
                        placeholder="Paste Hero Image URL..."
                        className="w-full p-2 text-sm bg-gray-50 rounded-lg border mb-2"
                    />
                    <label className="cursor-pointer inline-flex items-center gap-2 text-brand-orange font-bold text-sm hover:underline">
                        <Upload size={14} /> Upload New Poster
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'heroImage', setConfigForm, configForm)} />
                    </label>
                </div>

                {/* Hero Text */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-gray-700 uppercase mb-1 block">Hero Title</label>
                        <input
                            value={configForm.heroTitle}
                            onChange={e => setConfigForm({ ...configForm, heroTitle: e.target.value })}
                            className="w-full p-3 bg-gray-50 rounded-lg border focus:ring-1 focus:ring-brand-orange outline-none"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-700 uppercase mb-1 block">Hero Subtitle</label>
                        <input
                            value={configForm.heroSubtitle}
                            onChange={e => setConfigForm({ ...configForm, heroSubtitle: e.target.value })}
                            className="w-full p-3 bg-gray-50 rounded-lg border focus:ring-1 focus:ring-brand-orange outline-none"
                        />
                    </div>
                </div>

                <button type="submit" className="btn-primary w-full">Save Changes</button>
            </form>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F0F0F5] flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col sticky top-0 h-screen shadow-sm z-10">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-2xl font-extrabold flex items-center gap-2 tracking-tight text-[#1C1C1C]">
                        <span className="text-[#FC8019]">ADMIN</span> PANEL
                    </h2>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'dashboard' ? 'bg-orange-50 text-[#FC8019]' : 'text-[#60646C] hover:bg-gray-50'}`}>
                        <LayoutDashboard size={20} /> DASHBOARD
                    </button>
                    <button onClick={() => setActiveTab('products')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'products' ? 'bg-orange-50 text-[#FC8019]' : 'text-[#60646C] hover:bg-gray-50'}`}>
                        <Fish size={20} /> MANAGE FISH
                    </button>
                    <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'orders' ? 'bg-orange-50 text-[#FC8019]' : 'text-[#60646C] hover:bg-gray-50'}`}>
                        <Package size={20} /> ORDERS
                    </button>
                    <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'settings' ? 'bg-orange-50 text-[#FC8019]' : 'text-[#60646C] hover:bg-gray-50'}`}>
                        <Settings size={20} /> SITE SETTINGS
                    </button>
                </nav>
                <div className="p-4 border-t border-gray-100">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3.5 rounded-lg font-bold text-sm text-red-500 hover:bg-red-50 transition-colors">
                        <LogOut size={20} /> LOGOUT
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    {/* Mobile Header */}
                    <div className="md:hidden flex justify-between items-center mb-6">
                        <h1 className="text-xl font-bold">Admin Panel</h1>
                        <button onClick={handleLogout} className="text-red-500"><LogOut size={20} /></button>
                    </div>

                    {/* Mobile Tabs */}
                    <div className="md:hidden flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                        <button onClick={() => setActiveTab('dashboard')} className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-[#FC8019] text-white' : 'bg-white border text-gray-600'}`}>Dashboard</button>
                        <button onClick={() => setActiveTab('products')} className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${activeTab === 'products' ? 'bg-[#FC8019] text-white' : 'bg-white border text-gray-600'}`}>Products</button>
                        <button onClick={() => setActiveTab('orders')} className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${activeTab === 'orders' ? 'bg-[#FC8019] text-white' : 'bg-white border text-gray-600'}`}>Orders</button>
                        <button onClick={() => setActiveTab('settings')} className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${activeTab === 'settings' ? 'bg-[#FC8019] text-white' : 'bg-white border text-gray-600'}`}>Settings</button>
                    </div>

                    <div className="animate-fade-in">
                        {activeTab === 'dashboard' && <SummaryTab />}
                        {activeTab === 'products' && <ProductsTab />}
                        {activeTab === 'orders' && <OrdersTab />}
                        {activeTab === 'settings' && <SettingsTab />}
                    </div>
                </div>
            </main>

            {/* Product Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto border border-gray-100">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-extrabold text-lg text-[#1C1C1C] tracking-tight">{editingProduct ? 'EDIT FISH DETAILS' : 'ADD NEW CATCH'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-gray-400 hover:text-[#FC8019] transition-colors">✕</button>
                        </div>
                        <form onSubmit={handleProductSave} className="p-6 space-y-5">

                            {/* Image Input in Modal */}
                            <div>
                                <label className="text-xs font-bold text-[#93959F] uppercase mb-2 block tracking-wider">Product Image</label>
                                <div className="flex gap-4 items-start">
                                    <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-200 shadow-inner">
                                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            value={formData.image}
                                            onChange={e => setFormData({ ...formData, image: e.target.value })}
                                            className="w-full p-3 border border-gray-200 rounded-lg text-sm mb-3 focus:border-[#FC8019] focus:ring-1 focus:ring-[#FC8019] outline-none"
                                            placeholder="Image URL..."
                                        />
                                        <label className="cursor-pointer inline-flex items-center gap-2 text-white bg-[#FC8019] font-bold text-xs uppercase tracking-wide hover:bg-[#e26e0f] px-4 py-2.5 rounded-lg shadow-sm transition-all active:scale-95">
                                            <Upload size={14} /> Upload Product Photo
                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'image', setFormData, formData)} />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-[#93959F] uppercase mb-1 block tracking-wider">Fish Name</label>
                                <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-3 border border-gray-200 rounded-lg focus:border-[#FC8019] focus:ring-1 focus:ring-[#FC8019] outline-none transition-all font-medium" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-[#93959F] uppercase mb-1 block tracking-wider">Category</label>
                                    <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full p-3 border border-gray-200 rounded-lg focus:border-[#FC8019] focus:ring-1 focus:ring-[#FC8019] outline-none transition-all font-medium bg-white">
                                        <option>Sea Fish</option>
                                        <option>Fresh Water Fish</option>
                                        <option>Prawns & Seafood</option>
                                        <option>Chicken</option>
                                        <option>Mutton</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-[#93959F] uppercase mb-1 block tracking-wider">Price per Kg</label>
                                    <input required type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full p-3 border border-gray-200 rounded-lg focus:border-[#FC8019] focus:ring-1 focus:ring-[#FC8019] outline-none transition-all font-medium" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-[#93959F] uppercase mb-1 block tracking-wider">Description</label>
                                <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full p-3 border border-gray-200 rounded-lg focus:border-[#FC8019] focus:ring-1 focus:ring-[#FC8019] outline-none transition-all font-medium" rows={3} />
                            </div>
                            <div>
                                <label className="flex items-center gap-3 font-bold text-sm bg-gray-50 p-3 rounded-lg border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors">
                                    <input type="checkbox" checked={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.checked })} className="w-5 h-5 text-[#FC8019] focus:ring-[#FC8019] rounded" />
                                    <span className={formData.stock ? 'text-green-600' : 'text-red-500'}>{formData.stock ? 'Item is In Stock' : 'Item is Out of Stock'}</span>
                                </label>
                            </div>
                            <button type="submit" className="w-full btn-primary py-3.5 shadow-lg shadow-orange-500/20">{editingProduct ? 'UPDATE PRODUCT' : 'ADD TO CATALOG'}</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
