import { supabase } from './supabase';

// Add item to cart
export const addToCart = async (userId, productId, quantity) => {
  try {
    const { data, error } = await supabase
      .from('cart_items')
      .insert([
        {
          user_id: userId,
          product_id: productId,
          quantity,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error adding to cart:', error);
    return { success: false, error: error.message };
  }
};

// Get user's cart items
export const getCartItems = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return { success: false, error: error.message };
  }
};

// Update cart item quantity
export const updateCartItemQuantity = async (cartItemId, newQuantity) => {
  try {
    const { data, error } = await supabase
      .from('cart_items')
      .update({
        quantity: newQuantity,
        updated_at: new Date().toISOString(),
      })
      .eq('id', cartItemId)
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error updating cart item:', error);
    return { success: false, error: error.message };
  }
};

// Remove item from cart
export const removeFromCart = async (cartItemId) => {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error removing from cart:', error);
    return { success: false, error: error.message };
  }
};

// Clear entire cart
export const clearCart = async (userId) => {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error clearing cart:', error);
    return { success: false, error: error.message };
  }
};

// Subscribe to cart changes (real-time sync)
export const subscribeToCartChanges = (userId, callback) => {
  const subscription = supabase
    .channel(`cart-${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'cart_items',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        console.log('Cart updated:', payload);
        callback(payload);
      }
    )
    .subscribe();

  return subscription;
};

// Get cart total price
export const getCartTotal = async (userId) => {
  try {
    const { data: cartItems, error: cartError } = await supabase
      .from('cart_items')
      .select('quantity, products(price)')
      .eq('user_id', userId);

    if (cartError) throw cartError;

    const total = cartItems.reduce((sum, item) => {
      return sum + (item.quantity * item.products.price);
    }, 0);

    return { success: true, total };
  } catch (error) {
    console.error('Error calculating cart total:', error);
    return { success: false, error: error.message };
  }
};
