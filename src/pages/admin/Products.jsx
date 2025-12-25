import React, { useState } from 'react';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Edit,
    Copy,
    Trash2,
    Eye,
    EyeOff,
    ChevronDown,
    X,
    Upload,
    Image as ImageIcon,
    Minus
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';

const Products = () => {
    const { products, addProduct, updateProduct, deleteProduct } = useShop();
    const [searchQuery, setSearchQuery] = useState('');
    const [showProductForm, setShowProductForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingProductId, setEditingProductId] = useState(null);
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');


    // Form state for new product
    const [newProduct, setNewProduct] = useState({
        name: '',
        category: 'Goat',
        price: '',
        stock: '',
        status: 'Active',
        variants: [],
        images: []
    });

    // Variant form state
    const [newVariant, setNewVariant] = useState({
        name: '',
        price: '',
        stock: ''
    });

    // Quantity Configuration state
    const [quantityConfig, setQuantityConfig] = useState({
        "250g": true,
        "500g": true,
        "1kg": true,
        "custom": false,
        customMin: 250,
        customMax: 5000,
        customStep: 50
    });

    // Image preview state
    const [imagePreviews, setImagePreviews] = useState([]);

    const categories = ['All', 'Sea Fish', 'Fresh Water Fish', 'Prawns & Seafood', 'Chicken', 'Mutton', 'Goat'];
    const categoryOptions = ['Sea Fish', 'Fresh Water Fish', 'Prawns & Seafood', 'Chicken', 'Mutton', 'Goat'];
    const statuses = ['All', 'Active', 'Inactive'];

    const getStockStatus = (stock) => {
        if (stock === 0) return { text: 'Out of Stock', color: 'text-red-600 bg-red-50' };
        if (stock < 15) return { text: 'Low Stock', color: 'text-orange-600 bg-orange-50' };
        return { text: 'In Stock', color: 'text-green-600 bg-green-50' };
    };

    const handleAddVariant = () => {
        if (!newVariant.name || !newVariant.price || !newVariant.stock) {
            alert('Please fill in all variant fields');
            return;
        }

        setNewProduct({
            ...newProduct,
            variants: [...newProduct.variants, { ...newVariant }]
        });

        setNewVariant({ name: '', price: '', stock: '' });
    };

    const handleRemoveVariant = (index) => {
        setNewProduct({
            ...newProduct,
            variants: newProduct.variants.filter((_, i) => i !== index)
        });
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);

        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews(prev => [...prev, reader.result]);
                setNewProduct(prev => ({
                    ...prev,
                    images: [...prev.images, reader.result]
                }));
            };
            reader.readAsDataURL(file);
        });
    };

    const handleRemoveImage = (index) => {
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
        setNewProduct(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!newProduct.name || !newProduct.price || (newProduct.stock === '' && !isEditing)) {
            alert('Please fill in all required fields');
            return;
        }

        if (newProduct.images.length === 0 && !isEditing) {
            alert('Please upload at least one product image');
            return;
        }

        const productData = {
            name: newProduct.name,
            category: newProduct.category,
            price: parseFloat(newProduct.price),
            stock: parseInt(newProduct.stock) > 0,
            stock_quantity: parseInt(newProduct.stock),
            status: newProduct.status,
            variants: newProduct.variants,
            quantityConfig: quantityConfig,
            description: newProduct.description
        };

        // If we have images, add the first one as primary
        if (newProduct.images && newProduct.images.length > 0) {
            productData.image = newProduct.images[0];
            productData.images = newProduct.images;
        }

        let result;
        if (isEditing) {
            result = await updateProduct(editingProductId, productData);
        } else {
            result = await addProduct(productData);
        }

        if (result.success) {
            resetForm();
            setShowProductForm(false);
            alert(isEditing ? 'Product updated successfully!' : 'Product added successfully!');
        } else {
            alert('Failed to save product');
        }
    };

    const resetForm = () => {
        setNewProduct({
            name: '',
            category: 'Goat',
            price: '',
            stock: '',
            status: 'Active',
            variants: [],
            images: [],
            description: ''
        });
        setQuantityConfig({
            "250g": true,
            "500g": true,
            "1kg": true,
            "custom": false,
            customMin: 250,
            customMax: 5000,
            customStep: 50
        });
        setImagePreviews([]);
        setIsEditing(false);
        setEditingProductId(null);
    };

    const handleEditClick = (product) => {
        setEditingProductId(product._id || product.id);
        setIsEditing(true);
        setNewProduct({
            name: product.name,
            category: product.category,
            price: product.price,
            stock: product.stock_quantity || (product.stock ? 50 : 0),
            status: product.status || 'Active',
            variants: product.variants || [],
            images: product.images || (product.image ? [product.image] : []),
            description: product.description || ''
        });
        setQuantityConfig(product.quantityConfig || {
            "250g": true,
            "500g": true,
            "1kg": true,
            "custom": false,
            customMin: 250,
            customMax: 5000,
            customStep: 50
        });
        setImagePreviews(product.images || (product.image ? [product.image] : []));
        setShowProductForm(true);
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            const result = await deleteProduct(id);
            if (!result.success) {
                alert('Failed to delete product');
            }
        }
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                        <p className="text-gray-500 mt-1">Manage your product inventory</p>
                    </div>
                    <button
                        onClick={() => {
                            resetForm();
                            setShowProductForm(true);
                        }}
                        className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Add Product
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="relative w-full md:w-48">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none text-sm bg-white"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    </div>

                    {/* Status Filter */}
                    <div className="relative w-full md:w-48">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none text-sm bg-white"
                        >
                            {statuses.map(status => (
                                <option key={status} value={status}>{status} Status</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    {/* Desktop View Table */}
                    <table className="w-full hidden md:table">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {products.filter(p => (filterCategory === 'All' || p.category === filterCategory) && (filterStatus === 'All' || p.status === filterStatus) && p.name.toLowerCase().includes(searchQuery.toLowerCase())).map((product) => {
                                const stockStatus = getStockStatus(product.stock_quantity || (product.stock ? 50 : 0));
                                return (
                                    <tr key={product._id || product.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <img src={product.image || product.images?.[0] || 'https://via.placeholder.com/100'} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                    <div className="text-xs text-gray-500">#{product._id || product.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.category}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₹{product.price}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex text-xs px-2.5 py-1 rounded-full font-medium ${stockStatus.color}`}>
                                                {stockStatus.text}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex text-xs px-2.5 py-1 rounded-full font-medium ${product.status === 'Inactive' ? 'bg-gray-100 text-gray-700' : 'bg-green-100 text-green-700'}`}>
                                                {product.status || 'Active'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                            <div className="flex items-center justify-end space-x-2">
                                                <a href={`/product/${product._id || product.id}`} target="_blank" rel="noreferrer" className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors" title="View in Store">
                                                    <Eye className="w-4 h-4" />
                                                </a>
                                                <button
                                                    onClick={() => handleEditClick(product)}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProduct(product._id || product.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {/* Mobile View Cards */}
                    <div className="md:hidden divide-y divide-gray-200">
                        {products.filter(p => (filterCategory === 'All' || p.category === filterCategory) && (filterStatus === 'All' || p.status === filterStatus) && p.name.toLowerCase().includes(searchQuery.toLowerCase())).map((product) => (
                            <div key={product._id || product.id} className="p-4 bg-white hover:bg-gray-50">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center">
                                        <img src={product.image || product.images?.[0] || 'https://via.placeholder.com/100'} alt={product.name} className="w-12 h-12 rounded-lg object-cover mr-3" />
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{product.name}</p>
                                            <p className="text-xs text-gray-500">₹{product.price} • {product.category}</p>
                                        </div>
                                    </div>
                                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${product.status === 'Inactive' ? 'bg-gray-100 text-gray-700' : 'bg-green-100 text-green-700'}`}>
                                        {product.status || 'Active'}
                                    </span>
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <a href={`/product/${product._id || product.id}`} target="_blank" rel="noreferrer" className="px-3 py-1.5 bg-orange-50 text-orange-600 rounded-lg text-xs font-bold uppercase tracking-wider">
                                        View Store
                                    </a>
                                    <button
                                        onClick={() => handleEditClick(product)}
                                        className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold uppercase tracking-wider"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteProduct(product._id || product.id)}
                                        className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-bold uppercase tracking-wider"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <p className="text-sm text-gray-500">Showing 1 to {products.length} of {products.length} products</p>
                    <div className="flex space-x-2">
                        <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50" disabled>
                            Previous
                        </button>
                        <button className="px-3 py-1 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700">
                            1
                        </button>
                        <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50" disabled>
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Add Product Modal */}
            {showProductForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-lg max-w-4xl w-full my-8">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">
                                    {isEditing ? 'Edit Product' : 'Add New Product'}
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowProductForm(false);
                                        setImagePreviews([]);
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                            {/* Basic Details */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900">Basic Details</h3>

                                {/* Product Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Product Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={newProduct.name}
                                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                        placeholder="e.g., Premium Goat Curry Cut"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        required
                                    />
                                </div>

                                {/* Category, Price, Stock */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Category <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={newProduct.category}
                                            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                                        >
                                            {categoryOptions.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Price (₹) <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            value={newProduct.price}
                                            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                            placeholder="e.g., 650"
                                            min="0"
                                            step="0.01"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Stock (kg) <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            value={newProduct.stock}
                                            onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                                            placeholder="e.g., 45"
                                            min="0"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                    <select
                                        value={newProduct.status}
                                        onChange={(e) => setNewProduct({ ...newProduct, status: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                    <textarea
                                        value={newProduct.description}
                                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        placeholder="Product description..."
                                    />
                                </div>
                            </div>

                            {/* Product Images */}
                            <div className="space-y-4 border-t border-gray-200 pt-6">
                                <h3 className="text-lg font-semibold text-gray-900">Product Images <span className="text-red-500">*</span></h3>

                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                                    <div className="text-center">
                                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                        <div className="mt-4">
                                            <label htmlFor="file-upload" className="cursor-pointer">
                                                <span className="mt-2 block text-sm font-medium text-gray-900">
                                                    Upload product images
                                                </span>
                                                <span className="mt-1 block text-xs text-gray-500">
                                                    PNG, JPG, GIF up to 10MB each
                                                </span>
                                                <input
                                                    id="file-upload"
                                                    type="file"
                                                    multiple
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="sr-only"
                                                />
                                                <span className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                                    Choose Files
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Image Previews */}
                                {imagePreviews.length > 0 && (
                                    <div className="grid grid-cols-4 gap-4">
                                        {imagePreviews.map((preview, index) => (
                                            <div key={index} className="relative group">
                                                <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover rounded-lg border border-gray-200" />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage(index)}
                                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Product Variants */}
                            <div className="space-y-4 border-t border-gray-200 pt-6">
                                <h3 className="text-lg font-semibold text-gray-900">Product Variants</h3>

                                {/* Add Variant Form */}
                                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                    <div className="grid grid-cols-4 gap-3">
                                        <div className="col-span-1">
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Variant Name</label>
                                            <input
                                                type="text"
                                                value={newVariant.name}
                                                onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })}
                                                placeholder="e.g., 500g"
                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Price (₹)</label>
                                            <input
                                                type="number"
                                                value={newVariant.price}
                                                onChange={(e) => setNewVariant({ ...newVariant, price: e.target.value })}
                                                placeholder="e.g., 325"
                                                min="0"
                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Stock</label>
                                            <input
                                                type="number"
                                                value={newVariant.stock}
                                                onChange={(e) => setNewVariant({ ...newVariant, stock: e.target.value })}
                                                placeholder="e.g., 20"
                                                min="0"
                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            />
                                        </div>
                                        <div className="col-span-1 flex items-end">
                                            <button
                                                type="button"
                                                onClick={handleAddVariant}
                                                className="w-full px-3 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-colors"
                                            >
                                                Add Variant
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Variants List */}
                                {newProduct.variants.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-gray-700">Added Variants ({newProduct.variants.length})</p>
                                        <div className="space-y-2">
                                            {newProduct.variants.map((variant, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                                                    <div className="flex items-center space-x-4">
                                                        <span className="text-sm font-medium text-gray-900">{variant.name}</span>
                                                        <span className="text-sm text-gray-600">₹{variant.price}</span>
                                                        <span className="text-sm text-gray-600">Stock: {variant.stock}</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveVariant(index)}
                                                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Quantity Configuration */}
                            <div className="space-y-4 border-t border-gray-200 pt-6">
                                <h3 className="text-lg font-semibold text-gray-900">Quantity Options Configuration</h3>
                                <p className="text-sm text-gray-500">Control which quantity options customers can select</p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* 250g Toggle */}
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                                        <div>
                                            <span className="text-sm font-bold text-gray-900">250g Option</span>
                                            <p className="text-[10px] text-gray-500 uppercase font-bold mt-1 tracking-wider">Enable weight</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setQuantityConfig({ ...quantityConfig, "250g": !quantityConfig["250g"] })}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${quantityConfig["250g"] ? 'bg-orange-600' : 'bg-gray-300'
                                                }`}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${quantityConfig["250g"] ? 'translate-x-6' : 'translate-x-1'
                                                }`} />
                                        </button>
                                    </div>

                                    {/* 500g Toggle */}
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                                        <div>
                                            <span className="text-sm font-bold text-gray-900">500g Option</span>
                                            <p className="text-[10px] text-gray-500 uppercase font-bold mt-1 tracking-wider">Enable weight</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setQuantityConfig({ ...quantityConfig, "500g": !quantityConfig["500g"] })}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${quantityConfig["500g"] ? 'bg-orange-600' : 'bg-gray-300'
                                                }`}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${quantityConfig["500g"] ? 'translate-x-6' : 'translate-x-1'
                                                }`} />
                                        </button>
                                    </div>

                                    {/* 1kg Toggle */}
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                                        <div>
                                            <span className="text-sm font-bold text-gray-900">1kg Option</span>
                                            <p className="text-[10px] text-gray-500 uppercase font-bold mt-1 tracking-wider">Enable weight</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setQuantityConfig({ ...quantityConfig, "1kg": !quantityConfig["1kg"] })}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${quantityConfig["1kg"] ? 'bg-orange-600' : 'bg-gray-300'
                                                }`}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${quantityConfig["1kg"] ? 'translate-x-6' : 'translate-x-1'
                                                }`} />
                                        </button>
                                    </div>

                                    {/* Custom Toggle */}
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                                        <div>
                                            <span className="text-sm font-bold text-gray-900">Custom Quantity</span>
                                            <p className="text-[10px] text-gray-500 uppercase font-bold mt-1 tracking-wider">Custom weight input</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setQuantityConfig({ ...quantityConfig, "custom": !quantityConfig["custom"] })}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${quantityConfig["custom"] ? 'bg-orange-600' : 'bg-gray-300'
                                                }`}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${quantityConfig["custom"] ? 'translate-x-6' : 'translate-x-1'
                                                }`} />
                                        </button>
                                    </div>
                                </div>

                                {/* Custom Quantity Settings */}
                                {quantityConfig["custom"] && (
                                    <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 space-y-3">
                                        <h4 className="text-sm font-semibold text-gray-900">Custom Quantity Settings</h4>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                                    Minimum (grams)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={quantityConfig.customMin}
                                                    onChange={(e) => setQuantityConfig({ ...quantityConfig, customMin: parseInt(e.target.value) || 250 })}
                                                    min="50"
                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                                    Maximum (grams)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={quantityConfig.customMax}
                                                    onChange={(e) => setQuantityConfig({ ...quantityConfig, customMax: parseInt(e.target.value) || 5000 })}
                                                    min={quantityConfig.customMin}
                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                                    Step Increment (g)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={quantityConfig.customStep}
                                                    onChange={(e) => setQuantityConfig({ ...quantityConfig, customStep: parseInt(e.target.value) || 50 })}
                                                    min="1"
                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                />
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-600">
                                            Customers can select weights from {quantityConfig.customMin}g to {quantityConfig.customMax}g in steps of {quantityConfig.customStep}g
                                        </p>
                                    </div>
                                )}
                            </div>
                        </form>

                        {/* Action Buttons */}
                        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowProductForm(false);
                                    setImagePreviews([]);
                                }}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                            >
                                {isEditing ? 'Update Product' : 'Save Product'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;
