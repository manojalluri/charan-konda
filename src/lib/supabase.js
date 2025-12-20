import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

// If URL is missing, we create a dummy client or handle it gracefully to avoid a white screen crash
if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase credentials missing! Using mock client.");
} else {
    console.log("Supabase client initialized.");
    console.log("URL Length:", supabaseUrl.length);
    console.log("Anon Key Length:", supabaseAnonKey.length);
    if (!supabaseUrl.startsWith('https://')) {
        console.error("Supabase URL must start with https://");
    }
}

export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : {
        auth: {
            getSession: () => Promise.resolve({ data: { session: null } }),
            signInWithPassword: () => Promise.resolve({ data: { user: null }, error: { message: "Supabase not configured" } }),
            signUp: () => Promise.resolve({ data: { user: null }, error: { message: "Supabase not configured" } }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
            signOut: () => Promise.resolve()
        },
        from: () => ({
            select: () => ({
                order: () => Promise.resolve({ data: [], error: null }),
                eq: () => ({
                    single: () => Promise.resolve({ data: null, error: null })
                }),
                or: () => ({
                    order: () => Promise.resolve({ data: [], error: null })
                })
            }),
            insert: () => ({ select: () => Promise.resolve({ data: [], error: null }) }),
            update: () => ({ eq: () => ({ select: () => Promise.resolve({ data: [], error: null }) }) }),
            delete: () => ({ eq: () => Promise.resolve({ error: null }) }),
            upsert: () => Promise.resolve({ error: null })
        })
    };
