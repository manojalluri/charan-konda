/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';

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

const normalizeProduct = (product) => {
    if (!product) return product;
    return {
        ...product,
        id: product.id || product._id
    };
};

export const ShopProvider = ({ children }) => {
    // --- STATE ---
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
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
        heroTitle: "Fresh Meat. Clean Cut. Delivered Daily.",
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
    const [coupon, setCoupon] = useState(null);

    const verifyCoupon = async (code, amount) => {
        try {
            const data = await api.post('/coupons/verify', { code, amount });
            if (data.success) {
                setCoupon({
                    code: data.couponCode,
                    discount: data.discount,
                    id: data.couponId
                });
                return { success: true, discount: data.discount };
            }
            return { success: false, message: 'Invalid coupon' };
        } catch (err) {
            console.error('Coupon error:', err);
            return { success: false, message: err.response?.data?.message || err.message };
        }
    };

    const removeCoupon = () => setCoupon(null);

    const fetchAllData = async (currentUser = null, hasCache = false) => {
        const activeUser = currentUser || user;

        await Promise.all([
            fetchProducts(hasCache),
            fetchSettings()
        ]);

        if (activeUser) {
            if (activeUser.role === 'admin' || activeUser.role === 'owner') {
                fetchAllOrders();
                fetchUsers();
            } else {
                loadUserOrders(activeUser.email, activeUser.id || activeUser._id);
            }
        }
    };

    // --- INITIALIZATION ---
    useEffect(() => {
        const init = async () => {
            // 1. Load local data synchronously
            const savedCart = localStorage.getItem('cutora-cart-v2');
            if (savedCart) setCart(JSON.parse(savedCart));

            // 2. Load Safety Net (Cached Real Data)
            const cachedProducts = localStorage.getItem('cutora-products-v2');
            if (cachedProducts) {
                setProducts(JSON.parse(cachedProducts));
                setIsProductsLoading(false);
            }

            const cachedConfig = localStorage.getItem('cutora-config-v2');
            if (cachedConfig) setSiteConfig(JSON.parse(cachedConfig));

            const cachedSettings = localStorage.getItem('cutora-store-settings-v2');
            if (cachedSettings) setStoreSettings(JSON.parse(cachedSettings));

            let initialUser = null;
            const savedAuth = localStorage.getItem('cutora-user-v2');
            const savedToken = localStorage.getItem('cutora-auth-token-v2');

            if (savedAuth && savedToken) {
                try {
                    initialUser = JSON.parse(savedAuth);
                    setUser(initialUser);
                    setIsAdmin(initialUser.role === 'admin' || initialUser.role === 'owner');
                    setIsOwner(initialUser.role === 'owner');
                } catch (err) {
                    console.error('Error parsing saved auth:', err);
                    localStorage.removeItem('cutora-user-v2');
                    localStorage.removeItem('cutora-auth-token-v2');
                }
            } else if (savedAuth || savedToken) {
                // Cleanup if partially logged in
                localStorage.removeItem('cutora-user-v2');
                localStorage.removeItem('cutora-auth-token-v2');
            }

            // Mark auth as ready so UI can mount
            setIsLoadingAuth(false);

            // Fetch fresh heavy data in background
            fetchAllData(initialUser, !!cachedProducts);
        };
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // --- PERSISTENCE (Auto-save Cache) ---
    useEffect(() => {
        localStorage.setItem('cutora-cart-v2', JSON.stringify(cart));
    }, [cart]);



    useEffect(() => {
        localStorage.setItem('cutora-config-v2', JSON.stringify(siteConfig));
    }, [siteConfig]);

    useEffect(() => {
        if (products.length > 0) {
            localStorage.setItem('cutora-products-v2', JSON.stringify(products));
        }
    }, [products]);

    useEffect(() => {
        localStorage.setItem('cutora-store-settings-v2', JSON.stringify(storeSettings));
    }, [storeSettings]);

    // Re-verify coupon on cart update
    useEffect(() => {
        if (!coupon) return;
        const currentTotal = cart.reduce((sum, item) => sum + (getProductPrice(item.price, item.cut) * item.quantity), 0);

        api.post('/coupons/verify', { code: coupon.code, amount: currentTotal })
            .then(data => {
                if (data.success) {
                    if (data.discount !== coupon.discount) {
                        setCoupon(prev => ({ ...prev, discount: data.discount }));
                    }
                } else {
                    setCoupon(null);
                }
            })
            .catch(() => setCoupon(null));
    }, [cart, storeSettings, coupon?.code]);

    // --- ACTIONS ---
    const fetchProducts = async (background = false) => {
        if (!background) setIsProductsLoading(true);
        try {
            const data = await api.get('/products');
            setProducts(Array.isArray(data) ? data.map(normalizeProduct) : []);
        } catch (err) {
            console.error('Error fetching products:', err);
        } finally {
            if (!background) setIsProductsLoading(false);
        }
    };

    const fetchSettings = async () => {
        try {
            const data = await api.get('/settings/site_config');
            if (data && data.value) {
                setSiteConfig(prev => ({ ...prev, ...data.value }));
                // Update storeSettings if they exist in the config
                setStoreSettings(prev => ({
                    ...prev,
                    cleaningCharge: data.value.cleaningCharge ?? prev.cleaningCharge,
                    cleaningEnabled: data.value.cleaningEnabled ?? prev.cleaningEnabled,
                    cuttingCharge: data.value.cuttingCharge ?? prev.cuttingCharge,
                    cuttingEnabled: data.value.cuttingEnabled ?? prev.cuttingEnabled
                }));
            }
        } catch (err) {
            console.error('Error fetching settings:', err);
        }
    };

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

    const fetchUsers = async () => {
        try {
            const data = await api.get('/users');
            setUsers(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error fetching users:', err);
        }
    };

    const deleteUser = async (userId) => {
        try {
            await api.delete(`/users/${userId}`);
            setUsers(prev => prev.filter(u => u._id !== userId && u.id !== userId));
            return { success: true };
        } catch (err) {
            console.error('Error deleting user:', err);
            return { success: false, message: err.message };
        }
    };

    const addToCart = (product, quantity, cut) => {
        setCart(prev => {
            // Extract quantityInKg from product if it exists (passed from ProductDetails)
            const quantityInKg = product.quantityInKg || 1;
            const existing = prev.find(item => item.id === product.id && item.cut === cut && item.quantityInKg === quantityInKg);
            if (existing) {
                return prev.map(item =>
                    (item.id === product.id && item.cut === cut && item.quantityInKg === quantityInKg)
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { ...product, quantity, cut, quantityInKg }];
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

    const clearCart = () => {
        setCart([]);
        setCoupon(null);
    };

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
                discount: orderData.discount || 0,
                coupon_code: orderData.couponCode,
                final_amount: orderData.finalAmount,
                payment_method: orderData.paymentMethod || 'COD',
                payment_status: orderData.paymentStatus || 'Pending'
            };
            const data = await api.post('/orders', formattedOrder);
            const normalized = normalizeOrder(data);
            setOrders(prev => [normalized, ...prev]);
            clearCart();
            return normalized.id;
        } catch (err) {
            console.error('Error placing order:', err);
            throw err;
        }
    };

    const addProduct = async (productData) => {
        try {
            const data = await api.post('/products', productData);
            const normalized = normalizeProduct(data);
            setProducts(prev => [normalized, ...prev]);
            return { success: true, product: normalized };
        } catch (err) {
            console.error('Error adding product:', err);
            return { success: false };
        }
    };

    const updateProduct = async (id, updatedData) => {
        try {
            const data = await api.put(`/products/${id}`, updatedData);
            const normalized = normalizeProduct(data);
            setProducts(prev => prev.map(p => (p.id === id || p._id === id) ? normalized : p));
            return { success: true, product: normalized };
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
            setOrders(prev => prev.filter(o => o.id !== orderId && o._id !== orderId));
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
            const savedConfig = data.value;
            setSiteConfig(savedConfig);

            // Also update storeSettings to keep them in sync
            setStoreSettings(prev => ({
                ...prev,
                cleaningCharge: savedConfig.cleaningCharge ?? prev.cleaningCharge,
                cleaningEnabled: savedConfig.cleaningEnabled ?? prev.cleaningEnabled,
                cuttingCharge: savedConfig.cuttingCharge ?? prev.cuttingCharge,
                cuttingEnabled: savedConfig.cuttingEnabled ?? prev.cuttingEnabled
            }));

            return { success: true };
        } catch (err) {
            console.error('Error updating site config:', err);
            return { success: false, error: err.message };
        }
    };

    const loginUser = async (phoneOrEmail, password) => {
        try {
            // Check if it looks like an email or phone
            const isEmail = phoneOrEmail.includes('@');
            const loginData = isEmail ? { email: phoneOrEmail, password } : { phone: phoneOrEmail, password };

            const data = await api.post('/auth/login', loginData);
            if (!data.token) throw new Error('No token received from server');

            localStorage.setItem('cutora-auth-token-v2', data.token);
            localStorage.setItem('cutora-user-v2', JSON.stringify(data.user));
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
            if (!data.token) throw new Error('No token received from server');

            localStorage.setItem('cutora-auth-token-v2', data.token);
            localStorage.setItem('cutora-user-v2', JSON.stringify(data.user));
            setUser(data.user);
            return { success: true };
        } catch (err) {
            console.error('Registration error:', err);
            return { success: false, message: 'Registration failed. ' + (err.message || '') };
        }
    };

    const logoutUser = () => {
        localStorage.removeItem('cutora-auth-token-v2');
        localStorage.removeItem('cutora-user-v2');
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
        const taxRate = siteConfig?.taxRate ?? 5;
        return Math.round((itemTotal * taxRate) / 100);
    };

    return (
        <ShopContext.Provider value={{
            products,
            cart,
            orders,
            users,
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
            fetchUsers,
            deleteUser,
            calculateDeliveryFee,
            calculateTax,
            coupon,
            verifyCoupon,
            removeCoupon
        }}>
            {children}
        </ShopContext.Provider>
    );
};
