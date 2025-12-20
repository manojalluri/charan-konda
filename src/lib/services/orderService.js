import { supabase } from './supabase';

// Create a new order
export const createOrder = async (userId, orderData) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          user_id: userId,
          status: 'pending',
          total_amount: orderData.totalAmount,
          delivery_address: orderData.deliveryAddress,
          phone_number: orderData.phoneNumber,
          notes: orderData.notes || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error creating order:', error);
    return { success: false, error: error.message };
  }
};

// Fetch all orders for a user (customer view)
export const getUserOrders = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return { success: false, error: error.message };
  }
};

// Fetch all orders (admin view)
export const getAllOrders = async () => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching orders:', error);
    return { success: false, error: error.message };
  }
};

// Update order status (admin only)
export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId)
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error updating order status:', error);
    return { success: false, error: error.message };
  }
};

// Subscribe to real-time order updates
export const subscribeToOrderUpdates = (orderId, callback) => {
  const subscription = supabase
    .channel(`order-${orderId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'orders',
        filter: `id=eq.${orderId}`,
      },
      (payload) => {
        console.log('Order updated:', payload);
        callback(payload);
      }
    )
    .subscribe();

  return subscription;
};

// Delete order (admin only)
export const deleteOrder = async (orderId) => {
  try {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting order:', error);
    return { success: false, error: error.message };
  }
};

// Get order details
export const getOrderDetails = async (orderId) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching order details:', error);
    return { success: false, error: error.message };
  }
};
