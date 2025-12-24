import React, { createContext, useContext, useState, useEffect } from 'react';
import { products as initialProducts } from '../data/mockData';
import { api } from '../lib/api';

const ShopContext = createContext();

export const useShop = () => useContext(ShopContext);

const normalizeOrder = (order) => {
    if (!order) return order;
    return {
        ...order,
        id: order.id || order._id,
        itemTotal: order.itemTotal ?? order.item_total,
        deliveryFee: order.deliveryFee ?? order.delivery_fee,
        taxesAndCharges: order.taxesAndCharges ?? order.taxes_and_charges,
        finalAmount: order.finalAmount ?? order.final_amount,
        trackingId: order.trackingId ?? order.tracking_id,
        courierPartner: order.courierPartner ?? order.courier_partner,
        userEmail: order.userEmail ?? order.user_email
    };
};

export const ShopProvider = ({ children }) => {
    // --- STATE ---
    const [products, setProducts] = useState(initialProducts);
    const [cart, setCart] = useState([]);
    const [orders, setOrders] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isProductsLoading, setIsProductsLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);

    // Default Config
    const defaultConfig = {
        logo: "/logo.png",
        brandName: "CUTORA FRESH",
        heroImage: "/hero.png",
        heroTitle: "Fresh Meats. Clean Cut. Delivered Daily.",
        heroSubtitle: "Hygienically sourced and processed premium meats & seafood.",
        deliveryCharge: 40,
        freeDeliveryAbove: 1000,
        taxRate: 5,
        minOrderValue: 200,
    };

    const [siteConfig, setSiteConfig] = useState(defaultConfig);

    // Store Settings
    const defaultStoreSettings = {
        cleaningCharge: 10,
        cleaningEnabled: true,
        cuttingCharge: 15,
        cuttingEnabled: true
    };

    const [storeSettings, setStoreSettings] = useState(defaultStoreSettings);

    // --- INITIALIZATION ---
    useEffect(() => {
        const init = async () => {
            try {
                // 1. Instant Load from Cache
                const savedCart = localStorage.getItem('cutora-cart');
                if (savedCart) setCart(JSON.parse(savedCart));

                const savedProducts = localStorage.getItem('cutora-products-cache');
                if (savedProducts) {
                    setProducts(JSON.parse(savedProducts));
                    setIsProductsLoading(false); // Immediate show if cached
                }

                const savedConfig = localStorage.getItem('cutora-site-config');
                if (savedConfig) setSiteConfig(prev => ({ ...prev, ...JSON.parse(savedConfig) }));

                const savedAuth = localStorage.getItem('cutora-user');
                if (savedAuth) {
                    const parsed = JSON.parse(savedAuth);
                    setUser(parsed);
                    setIsAdmin(parsed.role === 'admin' || parsed.role === 'owner');
                    setIsOwner(parsed.role === 'owner');
                }

                // 2. Background Revalidate (SWR)
                fetchAllData();
            } catch (err) {
                console.error("Initialization error:", err);
            } finally {
                setIsLoadingAuth(false);
            }
        };
        init();
    }, []);

    // --- PERSISTENCE ---
    useEffect(() => {
        localStorage.setItem('cutora-cart', JSON.stringify(cart));
    }, [cart]);

    // --- ACTIONS ---

    const fetchProducts = async (background = false) => {
        // Only show spinner if we have NO data at all
        if (!background && products.length < 5) setIsProductsLoading(true);
        try {
            const data = await api.get('/products');
            if (data && data.length > 0) {
                setProducts(data);
                localStorage.setItem('cutora-products-cache', JSON.stringify(data));
            }
        } catch (err) {
            console.error('Error fetching products:', err);
        } finally {
            setIsProductsLoading(false);
        }
    };

    const fetchSettings = async () => {
        try {
            const data = await api.get('/settings/site_config');
            if (data && data.value) {
                const newConfig = { ...siteConfig, ...data.value };
                setSiteConfig(newConfig);
                localStorage.setItem('cutora-site-config', JSON.stringify(data.value));
            }
        } catch (err) {
            console.error('Error fetching settings:', err);
        }
    };

    // --- POLLING FOR UPDATES ---
    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchProducts(true);
            fetchSettings();

            if (user) {
                if (user.role === 'admin' || user.role === 'owner') {
                    fetchAllOrders();
                } else {
                    loadUserOrders(user.email, user.id || user._id);
                }
            }
        }, 30000); // Poll every 30 seconds for background updates (optimized from 5s)

        return () => clearInterval(intervalId);
    }, [user]);


    const fetchAllOrders = async () => {
        try {
            const data = await api.get('/orders');
            setOrders(Array.isArray(data) ? data.map(normalizeOrder) : []);
        } catch (err) {
            console.error('Error fetching all orders:', err);
        }
    };

    const loadUserOrders = async (email, userId) => {
        try {
            const data = await api.get(`/orders?email=${email}&userId=${userId}`);
            setOrders(Array.isArray(data) ? data.map(normalizeOrder) : []);
        } catch (err) {
            console.error('Error loading user orders:', err);
        }
    };

    const fetchAllData = async () => {
        await Promise.all([
            fetchProducts(),
            fetchSettings()
        ]);

        if (user) {
            if (user.role === 'admin' || user.role === 'owner') {
                fetchAllOrders();
            } else {
                loadUserOrders(user.email, user.id || user._id);
            }
        }
    };

    const addToCart = (product, quantity, cut) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id && item.cut === cut);
            if (existing) {
                return prev.map(item =>
                    (item.id === product.id && item.cut === cut)
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { ...product, quantity, cut }];
        });
    };

    const updateQuantity = (productId, cut, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(productId, cut);
            return;
        }
        setCart(prev => prev.map(item =>
            (item.id === productId && item.cut === cut) ? { ...item, quantity: newQuantity } : item
        ));
    };

    const removeFromCart = (productId, cut) => {
        setCart(prev => prev.filter(item => !(item.id === productId && item.cut === cut)));
    };

    const clearCart = () => setCart([]);

    const placeOrder = async (orderData) => {
        try {
            const formattedOrder = {
                id: orderData.id,
                user_id: user?.id || user?._id || 'guest',
                user_email: user?.email || orderData.customer.email || orderData.userEmail || 'guest@example.com',
                date: orderData.date,
                status: orderData.status || 'Pending',
                items: orderData.items,
                customer: orderData.customer,
                item_total: orderData.itemTotal,
                delivery_fee: orderData.deliveryFee || 0,
                taxes_and_charges: orderData.taxesAndCharges || 0,
                final_amount: orderData.finalAmount,
                payment_method: orderData.paymentMethod || 'COD',
                payment_status: orderData.paymentStatus || 'Pending'
            };
            const data = await api.post('/orders', formattedOrder);
            setOrders(prev => [data, ...prev]);
            clearCart();
            return data.id;
        } catch (err) {
            console.error('Error placing order:', err);
            throw err;
        }
    };

    const addProduct = async (productData) => {
        try {
            const data = await api.post('/products', productData);
            setProducts(prev => [data, ...prev]);
            return { success: true, data };
        } catch (err) {
            console.error('Error adding product:', err);
            return { success: false };
        }
    };

    const updateProduct = async (id, updatedData) => {
        try {
            const data = await api.put(`/products/${id}`, updatedData);
            setProducts(prev => prev.map(p => (p._id === id || p.id === id) ? data : p));
            return { success: true };
        } catch (err) {
            console.error('Error updating product:', err);
            return { success: false };
        }
    };

    const deleteProduct = async (id) => {
        try {
            await api.delete(`/products/${id}`);
            setProducts(prev => prev.filter(p => p._id !== id && p.id !== id));
            return { success: true };
        } catch (err) {
            console.error('Error deleting product:', err);
            return { success: false };
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const data = await api.put(`/orders/${orderId}`, { status: newStatus });
            const normalized = normalizeOrder(data);
            setOrders(prev => prev.map(order => order.id === orderId ? { ...order, ...normalized } : order));
            return { success: true };
        } catch (err) {
            console.error('Error updating order status:', err);
            return { success: false };
        }
    };

    const updateOrderTracking = async (orderId, trackingData) => {
        try {
            const data = await api.put(`/orders/${orderId}`, {
                tracking_id: trackingData.trackingId,
                courier_partner: trackingData.courierPartner
            });
            const normalized = normalizeOrder(data);
            setOrders(prev => prev.map(order => order.id === orderId ? { ...order, ...normalized } : order));
            return { success: true };
        } catch (err) {
            console.error('Error updating order tracking:', err);
            return { success: false };
        }
    };

    const deleteOrder = async (orderId) => {
        try {
            await api.delete(`/orders/${orderId}`);
            setOrders(prev => prev.filter(o => o.id !== orderId));
            return { success: true };
        } catch (err) {
            console.error('Error deleting order:', err);
            return { success: false, message: err.message };
        }
    };

    const updateSiteConfig = async (newConfig) => {
        try {
            const updatedConfig = { ...siteConfig, ...newConfig };
            const data = await api.post('/settings', { id: 'site_config', value: updatedConfig });
            setSiteConfig(data.value);
        } catch (err) {
            console.error('Error updating site config:', err);
        }
    };

    const loginUser = async (phoneOrEmail, password) => {
        try {
            // Check if it looks like an email or phone
            const isEmail = phoneOrEmail.includes('@');
            const loginData = isEmail ? { email: phoneOrEmail, password } : { phone: phoneOrEmail, password };

            const data = await api.post('/auth/login', loginData);
            localStorage.setItem('cutora-auth-token', data.token);
            localStorage.setItem('cutora-user', JSON.stringify(data.user));
            setUser(data.user);
            setIsAdmin(data.user.role === 'admin' || data.user.role === 'owner');
            setIsOwner(data.user.role === 'owner');

            // Reload orders
            if (data.user.role === 'admin' || data.user.role === 'owner') {
                fetchAllOrders();
            } else {
                loadUserOrders(data.user.email, data.user.id || data.user._id);
            }

            return { success: true };
        } catch (err) {
            console.error('Login error:', err);
            return { success: false, message: 'Invalid credentials' };
        }
    };

    const registerUser = async (name, email, phone, password) => {
        try {
            const data = await api.post('/auth/register', { name, email, phone, password });
            localStorage.setItem('cutora-auth-token', data.token);
            localStorage.setItem('cutora-user', JSON.stringify(data.user));
            setUser(data.user);
            return { success: true };
        } catch (err) {
            console.error('Registration error:', err);
            return { success: false, message: 'Registration failed. ' + (err.message || '') };
        }
    };

    const logoutUser = () => {
        localStorage.removeItem('cutora-auth-token');
        localStorage.removeItem('cutora-user');
        setUser(null);
        setIsAdmin(false);
        setIsOwner(false);
        clearCart();
    };

    const getProductPrice = (basePrice, preparationType) => {
        if (preparationType === 'Uncut') return basePrice;
        let totalCharge = basePrice;
        if (storeSettings.cuttingEnabled) totalCharge += storeSettings.cuttingCharge;
        if (storeSettings.cleaningEnabled) totalCharge += storeSettings.cleaningCharge;
        return totalCharge;
    };

    // Helper function to calculate delivery fee
    const calculateDeliveryFee = (itemTotal) => {
        const deliveryCharge = siteConfig?.deliveryCharge || 40;
        const freeDeliveryAbove = siteConfig?.freeDeliveryAbove || 1000;
        return itemTotal >= freeDeliveryAbove ? 0 : deliveryCharge;
    };

    // Helper function to calculate tax
    const calculateTax = (itemTotal) => {
        const taxRate = siteConfig?.taxRate || 5;
        return Math.round((itemTotal * taxRate) / 100);
    };

    return (
        <ShopContext.Provider value={{
            products,
            cart,
            orders,
            isAdmin,
            isOwner,
            siteConfig,
            storeSettings,
            user,
            isLoadingAuth,
            isProductsLoading,
            addToCart,
            updateQuantity,
            removeFromCart,
            clearCart,
            placeOrder,
            addProduct,
            updateProduct,
            deleteProduct,
            updateSiteConfig,
            loginUser,
            registerUser,
            logoutUser,
            getProductPrice,
            updateOrderStatus,
            updateOrderTracking,
            deleteOrder,
            fetchProducts,
            fetchAllOrders,
            calculateDeliveryFee,
            calculateTax
        }}>
            {children}
        </ShopContext.Provider>
    );
};
