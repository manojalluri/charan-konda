import React, { createContext, useContext, useState, useEffect } from 'react';
import { products as initialProducts } from '../data/mockData';
import { api } from '../lib/api';

const ShopContext = createContext();

export const useShop = () => useContext(ShopContext);

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
        logo: null,
        brandName: "CUTORA FRESH",
        heroImage: "/hero.png",
        heroTitle: "Fresh Meats. Clean Cut. Delivered Daily.",
        heroSubtitle: "Hygienically sourced and processed premium meats & seafood.",
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
                // Load local data
                const savedCart = localStorage.getItem('cutora-cart');
                if (savedCart) setCart(JSON.parse(savedCart));

                const savedAuth = localStorage.getItem('cutora-user');
                if (savedAuth) {
                    const parsed = JSON.parse(savedAuth);
                    setUser(parsed);
                    setIsAdmin(parsed.role === 'admin' || parsed.role === 'owner');
                    setIsOwner(parsed.role === 'owner');
                }

                // Fetch data from MongoDB
                await fetchAllData();
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
    const fetchProducts = async () => {
        setIsProductsLoading(true);
        try {
            const data = await api.get('/products');
            if (data && data.length > 0) {
                setProducts(data);
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
                setSiteConfig(prev => ({ ...prev, ...data.value }));
            }
        } catch (err) {
            console.error('Error fetching settings:', err);
        }
    };

    const fetchAllOrders = async () => {
        try {
            const data = await api.get('/orders');
            setOrders(data);
        } catch (err) {
            console.error('Error fetching all orders:', err);
        }
    };

    const loadUserOrders = async (email, userId) => {
        try {
            const data = await api.get(`/orders?email=${email}&userId=${userId}`);
            setOrders(data);
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
                ...orderData,
                user_id: user?.id || user?._id || 'guest',
                user_email: user?.email || orderData.customer.email
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
            setOrders(prev => prev.map(order => order.id === orderId ? { ...order, status: data.status } : order));
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
            setOrders(prev => prev.map(order => order.id === orderId ? { ...order, ...data } : order));
            return { success: true };
        } catch (err) {
            console.error('Error updating tracking:', err);
            return { success: false };
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

    const loginUser = async (email, password) => {
        try {
            const data = await api.post('/auth/login', { email, password });
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

    const registerUser = async (name, email, password) => {
        try {
            const data = await api.post('/auth/register', { name, email, password });
            localStorage.setItem('cutora-auth-token', data.token);
            localStorage.setItem('cutora-user', JSON.stringify(data.user));
            setUser(data.user);
            return { success: true };
        } catch (err) {
            console.error('Registration error:', err);
            return { success: false, message: 'Registration failed' };
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
            fetchProducts,
            fetchAllOrders
        }}>
            {children}
        </ShopContext.Provider>
    );
};
