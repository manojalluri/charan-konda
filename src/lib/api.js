const getBaseUrl = () => {
    let url = import.meta.env.VITE_API_BASE_URL;

    // If URL is missing, fail gracefully without exposing production URL
    if (!url) {
        console.warn('⚠️ VITE_API_BASE_URL is not configured, falling back to /api');
        url = '/api';
    }

    // Ensure URL doesn't have double slashes if it ends with /
    if (url.endsWith('/')) url = url.slice(0, -1);
    return url;
};

const BASE_URL = getBaseUrl();
console.log('📡 API BASE_URL:', BASE_URL);
// API endpoint configured from environment variables

const getHeaders = () => {
    const token = localStorage.getItem('cutora-auth-token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

export const api = {
    get: async (endpoint) => {
        const res = await fetch(`${BASE_URL}${endpoint}`, { headers: getHeaders() });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    },
    post: async (endpoint, data) => {
        try {
            const res = await fetch(`${BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(data)
            });
            const text = await res.text();
            if (!res.ok) {
                console.error(`API Error (${res.status}):`, text);
                throw new Error(text || `Server error ${res.status}`);
            }
            try {
                return JSON.parse(text);
            } catch {
                console.error("Failed to parse JSON response:", text);
                throw new Error("Invalid response from server");
            }
        } catch (err) {
            console.error("Fetch failed:", err);
            throw err;
        }
    },
    put: async (endpoint, data) => {
        const res = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    },
    delete: async (endpoint) => {
        const res = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (!res.ok) {
            let errorText = 'Unknown error';
            try {
                const errorData = await res.json();
                errorText = errorData.message || errorData.error || errorText;
            } catch {
                errorText = await res.text();
            }
            throw new Error(errorText);
        }
        return res.json();
    }
};
