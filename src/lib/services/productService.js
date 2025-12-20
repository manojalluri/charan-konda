import { supabase } from '../supabase';

// ========== PRODUCTS SERVICE ==========
export const productService = {
  // Customer: Get all active products
  async getActiveProducts(filters = {}) {
    try {
      let query = supabase
        .from('products')
        .select('id, name, description, price, image_url, category, created_at')
        .eq('is_active', true);

      if (filters.category) query = query.eq('category', filters.category);
      if (filters.search) query = query.ilike('name', `%${filters.search}%`);

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching active products:', error);
      throw error;
    }
  },

  // Admin: Get all products (including inactive)
  async getAllProducts(filters = {}) {
    try {
      let query = supabase.from('products').select('*');

      if (filters.category) query = query.eq('category', filters.category);
      if (filters.search) query = query.ilike('name', `%${filters.search}%`);
      if (filters.isActive !== undefined) query = query.eq('is_active', filters.isActive);

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching all products:', error);
      throw error;
    }
  },

  // Get single product
  async getProductById(id) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  // Admin: Create product
  async createProduct(productData) {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          ...productData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select();
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Admin: Update product
  async updateProduct(id, productData) {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({ ...productData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select();
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // Admin: Delete product (soft delete)
  async deleteProduct(id) {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // Real-time subscription to products
  subscribeToProducts(callback) {
    const subscription = supabase
      .channel('public:products')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        (payload) => {
          console.log('Product change received:', payload);
          callback(payload);
        }
      )
      .subscribe();

    return subscription;
  },

  // Batch get products
  async getProductsByIds(ids) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .in('id', ids);
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching products by IDs:', error);
      throw error;
    }
  }
};

export default productService;
