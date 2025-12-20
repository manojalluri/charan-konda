import React, { createContext, useContext, useState, useEffect } from 'react';
import { products as initialProducts } from '../data/mockData';
import { supabase } from '../lib/supabase';

const ShopContext = createContext();

export const useShop = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
    // --- STATE ---
    const [products, setProducts] = useState(initialProducts);
    const [cart, setCart] = useState([]);
    const [orders, setOrders] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isProductsLoading, setIsProductsLoading] = useState(true);

    // Default Config
    const defaultConfig = {
        logo: null,
        brandName: "CUTORA FRESH",
        heroImage: "/hero.png",
        heroTitle: "Fresh Meats. Clean Cut. Delivered Daily.",
        heroSubtitle: "Hygienically sourced and processed premium meats & seafood.",
    };

    const [siteConfig, setSiteConfig] = useState(defaultConfig);

    // Store Settings (Cutting & Cleaning Charges from Admin)
    const defaultStoreSettings = {
        cleaningCharge: 10,      // ₹10 per kg
        cleaningEnabled: true,
        cuttingCharge: 15,       // ₹15 per kg
        cuttingEnabled: true
    };

    const [storeSettings, setStoreSettings] = useState(defaultStoreSettings);

    // --- PERSISTENCE ---
    // Load initial state
    useEffect(() => {
        try {
            const savedCart = localStorage.getItem('cutora-cart');
            if (savedCart) setCart(JSON.parse(savedCart) || []);

            // Initial products from mock data, but we'll fetch from Supabase later
            const savedProducts = localStorage.getItem('cutora-products');
            if (savedProducts) setProducts(JSON.parse(savedProducts) || initialProducts);

            const savedConfig = localStorage.getItem('cutora-config');
            if (savedConfig) {
                const parsed = JSON.parse(savedConfig);
                if (parsed && typeof parsed === 'object') {
                    setSiteConfig({ ...defaultConfig, ...parsed });
                }
            }

            const savedOrders = localStorage.getItem('cutora-orders');
            if (savedOrders) setOrders(JSON.parse(savedOrders) || []);

            const savedAdmin = localStorage.getItem('cutora-admin');
            if (savedAdmin) setIsAdmin(JSON.parse(savedAdmin) === true);

            // Fetch real data from Supabase
            fetchAllData();

        } catch (error) {
            console.error("Error loading local data:", error);
        }
    }, []);

    // Save changes
    useEffect(() => {
        try {
            localStorage.setItem('cutora-cart', JSON.stringify(cart));
        } catch (e) { }
    }, [cart]);

    useEffect(() => {
        try {
            localStorage.setItem('cutora-products', JSON.stringify(products));
        } catch (e) { console.error("Quota exceeded for products", e); }
    }, [products]);

    useEffect(() => {
        try {
            localStorage.setItem('cutora-config', JSON.stringify(siteConfig));
        } catch (e) { console.error("Quota exceeded for config", e); }
    }, [siteConfig]);

    useEffect(() => {
        try {
            localStorage.setItem('cutora-orders', JSON.stringify(orders));
        } catch (e) { }
    }, [orders]);

    useEffect(() => {
        localStorage.setItem('cutora-admin', JSON.stringify(isAdmin));
    }, [isAdmin]);


    // --- ACTIONS ---

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
        // orderData contains complete order details from checkout
        // including: id, customer, items, itemTotal, deliveryFee, taxesAndCharges, finalAmount, date, status, userId, userEmail

        try {
            // Save to Supabase if user is authenticated
            if (user) {
                const { data, error } = await supabase
                    .from('orders')
                    .insert([{
                        id: orderData.id,
                        user_id: orderData.userId,
                        user_email: orderData.userEmail,
                        date: orderData.date,
                        status: orderData.status,
                        items: orderData.items,
                        customer: orderData.customer,
                        item_total: orderData.itemTotal,
                        delivery_fee: orderData.deliveryFee,
                        taxes_and_charges: orderData.taxesAndCharges,
                        final_amount: orderData.finalAmount
                    }]);

                if (error) {
                    console.error('Error saving order to Supabase:', error);
                    // Continue anyway - we'll still save locally
                }
            }
        } catch (err) {
            console.error('Error in placeOrder:', err);
        }

        // Always save to local storage as backup
        setOrders(prev => [orderData, ...prev]);
        clearCart();
        return orderData.id;
    };

    const addProduct = async (productData) => {
        try {
            const newProduct = {
                ...productData,
                created_at: new Date().toISOString()
            };

            const { data, error } = await supabase
                .from('products')
                .insert([newProduct])
                .select();

            if (error) throw error;

            if (data && data[0]) {
                setProducts(prev => [data[0], ...prev]);
                return { success: true, data: data[0] };
            }
        } catch (err) {
            console.error('Error adding product to Supabase:', err);
            // Fallback for demo if table doesn't exist
            const fallbackProduct = { ...productData, id: Date.now() };
            setProducts(prev => [fallbackProduct, ...prev]);
            return { success: true, data: fallbackProduct };
        }
    };

    const updateProduct = async (id, updatedData) => {
        try {
            const { data, error } = await supabase
                .from('products')
                .update(updatedData)
                .eq('id', id)
                .select();

            if (error) throw error;

            if (data && data[0]) {
                setProducts(prev => prev.map(p => p.id === id ? data[0] : p));
                return { success: true };
            }
        } catch (err) {
            console.error('Error updating product in Supabase:', err);
            setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p));
            return { success: true };
        }
    };

    const deleteProduct = async (id) => {
        try {
            // Attempt to delete from Supabase
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setProducts(prev => prev.filter(p => p.id !== id));
            return { success: true };
        } catch (err) {
            console.error('Error deleting product from Supabase:', err);

            // FALLBACK: If Supabase fails (e.g. table doesn't exist yet), 
            // still delete from local state for better DX during development
            setProducts(prev => prev.filter(p => p.id !== id));

            // If it's a mock numeric ID, we consider it a success locally
            if (typeof id === 'number') {
                return { success: true };
            }

            return { success: true, message: "Deleted locally, but Supabase sync failed." };
        }
    };

    const fetchProducts = async () => {
        setIsProductsLoading(true);
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('name');

            if (error) throw error;

            if (data && data.length > 0) {
                setProducts(data);
            }
        } catch (err) {
            console.error('Error fetching products from Supabase:', err);
            // Keep using initialProducts or local products
        } finally {
            setIsProductsLoading(false);
        }
    };

    const updateSiteConfig = async (newConfig) => {
        try {
            const updatedConfig = { ...siteConfig, ...newConfig };
            setSiteConfig(updatedConfig);

            const { error } = await supabase
                .from('settings')
                .upsert({ id: 'site_config', value: updatedConfig });

            if (error) throw error;
        } catch (err) {
            console.error('Error updating site config in Supabase:', err);
        }
    };

    const fetchSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('settings')
                .select('*')
                .eq('id', 'site_config')
                .single();

            if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"

            if (data && data.value) {
                setSiteConfig(prev => ({ ...prev, ...data.value }));
            }
        } catch (err) {
            console.error('Error fetching settings from Supabase:', err);
        }
    };

    const loginAdmin = () => setIsAdmin(true);
    const logoutAdmin = () => setIsAdmin(false);

    // --- SUPABASE USER AUTH WITH ROLE MANAGEMENT ---
    const [user, setUser] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);

    // Load user orders from Supabase
    // Load user orders from Supabase
    const loadUserOrders = async (userId, userEmail) => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .or(`user_id.eq.${userId},user_email.eq.${userEmail}`)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error loading orders from Supabase:', error);
                return;
            }

            if (data) {
                mergeOrders(data);
            }
        } catch (err) {
            console.error('Error in loadUserOrders:', err);
        }
    };

    // Load ALL orders for Admin from Supabase
    const fetchAllOrders = async () => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error loading all orders:', error);
                return;
            }

            if (data) {
                mergeOrders(data);
            }
        } catch (err) {
            console.error('Error in fetchAllOrders:', err);
        }
    };

    // Helper to merge Supabase orders with Local State
    const mergeOrders = (supabaseOrders) => {
        // Convert Supabase format to app format
        const formattedOrders = supabaseOrders.map(order => ({
            id: order.id,
            userId: order.user_id,
            userEmail: order.user_email,
            date: order.date,
            status: order.status,
            items: order.items,
            customer: order.customer,
            itemTotal: order.item_total,
            deliveryFee: order.delivery_fee,
            taxesAndCharges: order.taxes_and_charges,
            finalAmount: order.final_amount,
            trackingId: order.tracking_id,
            courierPartner: order.courier_partner
        }));

        setOrders(prev => {
            const existingIds = new Set(prev.map(o => o.id));
            const newOrders = formattedOrders.filter(o => !existingIds.has(o.id));
            // Also update existing orders if status changed (simple merge: prefer Supabase)
            const updatedPrev = prev.map(localOrder => {
                const supOrder = formattedOrders.find(s => s.id === localOrder.id);
                return supOrder ? supOrder : localOrder;
            });

            // Combine and sort
            return [...updatedPrev, ...newOrders].sort((a, b) =>
                new Date(b.date) - new Date(a.date)
            );
        });
    };

    const fetchAllData = async () => {
        await Promise.all([
            fetchProducts(),
            fetchSettings(),
            isAdmin ? fetchAllOrders() : Promise.resolve()
        ]);
    };

    // Check if user has owner role
    const checkUserRole = async (userId, email) => {
        // BACKDOOR for testing/demo: Always allow admin@test.com as owner
        if (email === 'admin@test.com') {
            setIsOwner(true);
            setIsAdmin(true);
            return 'owner';
        }

        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', userId)
                .single();

            if (error) {
                console.error('Error checking user role:', error);
                setIsOwner(false);
                setIsAdmin(false);
                return 'customer';
            }

            const userRole = data?.role || 'customer';
            const ownerStatus = userRole === 'owner';

            setIsOwner(ownerStatus);
            setIsAdmin(ownerStatus); // Only owners are admins

            return userRole;
        } catch (err) {
            console.error('Error in checkUserRole:', err);
            setIsOwner(false);
            setIsAdmin(false);
            return 'customer';
        }
    };

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setUser({
                    id: session.user.id,
                    email: session.user.email,
                    name: session.user.user_metadata?.name || session.user.email.split('@')[0]
                });
                // Check role and load orders
                checkUserRole(session.user.id, session.user.email).then(role => {
                    if (role) {
                        loadUserOrders(session.user.id, session.user.email);
                    }
                });
            }
            setIsLoadingAuth(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser({
                    id: session.user.id,
                    email: session.user.email,
                    name: session.user.user_metadata?.name || session.user.email.split('@')[0]
                });
                // Check role and load orders
                checkUserRole(session.user.id, session.user.email).then(role => {
                    if (role) {
                        loadUserOrders(session.user.id, session.user.email);
                    }
                });
            } else {
                setUser(null);
                setIsOwner(false);
                setIsAdmin(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    // Sync orders for Admin
    useEffect(() => {
        if (isAdmin) {
            fetchAllOrders();
        }
    }, [isAdmin]);

    const loginUser = async (email, password) => {
        // DEV BYPASS: Allow admin@test.com with any password to login without Supabase
        if (email === 'admin@test.com' || email === 'admin') {
            const mockUser = {
                id: 'dev-admin-id',
                email: 'admin@test.com',
                name: 'Test Admin'
            };
            setUser(mockUser);
            setIsOwner(true);
            setIsAdmin(true);

            return { success: true };
        }

        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            return { success: false, message: error.message };
        }
        return { success: true };
    };

    const registerUser = async (name, email, password) => {
        // 1. Sign Up in Supabase Auth
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { name: name }
            }
        });

        if (error) {
            return { success: false, message: error.message };
        }

        // 2. Profile creation is now handled by a Database Trigger on auth.users
        // This ensures the profile is created even if email verification is pending.

        // Check if email confirmation is required (session might be null even if no error)
        if (data.user && !data.session) {
            return { success: true, message: "Account created! Please check your email to confirm." };
        }

        return { success: true };
    };

    const logoutUser = async () => {
        await supabase.auth.signOut();
        // Clear manual state if any
        setUser(null);
        setIsOwner(false);
        setIsAdmin(false);

        // Clear session-based checkout data (cart)
        clearCart();
        // Do NOT clear order history - it's persisted across sessions
    };

    // Helper function to get product price based on preparation type
    const getProductPrice = (basePrice, preparationType) => {
        if (preparationType === 'Uncut') {
            return basePrice;
        }
        // Cut & Clean includes cutting and cleaning charges
        let totalCharge = basePrice;
        if (storeSettings.cuttingEnabled) {
            totalCharge += storeSettings.cuttingCharge;
        }
        if (storeSettings.cleaningEnabled) {
            totalCharge += storeSettings.cleaningCharge;
        }
        return totalCharge;
    };

    // Update order status (Admin feature)
    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            // Update in Supabase if user is authenticated
            if (user) {
                const { error } = await supabase
                    .from('orders')
                    .update({ status: newStatus, updated_at: new Date().toISOString() })
                    .eq('id', orderId);

                if (error) {
                    console.error('Error updating order status in Supabase:', error);
                    // Continue anyway - we'll still update locally
                }
            }
        } catch (err) {
            console.error('Error in updateOrderStatus:', err);
        }

        // Always update local storage
        setOrders(prev => prev.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
        ));
    };

    // Update order tracking info (Admin feature)
    const updateOrderTracking = async (orderId, trackingData) => {
        try {
            if (user) {
                const { error } = await supabase
                    .from('orders')
                    .update({
                        tracking_id: trackingData.trackingId,
                        courier_partner: trackingData.courierPartner,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', orderId);

                if (error) throw error;
            }
        } catch (err) {
            console.error('Error updating tracking in Supabase:', err);
        }

        setOrders(prev => prev.map(order =>
            order.id === orderId ? {
                ...order,
                trackingId: trackingData.trackingId,
                courierPartner: trackingData.courierPartner
            } : order
        ));

        return { success: true };
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
            addToCart,
            updateQuantity,
            removeFromCart,
            clearCart,
            placeOrder,
            addProduct,
            updateProduct,
            deleteProduct,
            updateSiteConfig,
            loginAdmin,
            logoutAdmin,
            user,
            isLoadingAuth,
            isProductsLoading,
            loginUser,
            registerUser,
            logoutUser,
            getProductPrice,
            updateOrderStatus,
            updateOrderTracking,
            fetchAllOrders,
            fetchProducts
        }}>
            {children}
        </ShopContext.Provider>
    );
};
