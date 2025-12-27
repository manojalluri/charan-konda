const getBaseUrl = () => {
    // Direct backend URL to avoid Vercel proxy issues with Authorization headers
    return "https://charan-konda.onrender.com/api";
};

const BASE_URL = getBaseUrl();
console.log('📡 API BASE_URL:', BASE_URL);
// API endpoint configured from environment variables

const getHeaders = () => {
    let token = localStorage.getItem('cutora-auth-token-v2');

    // Fallback to old token key if new one is missing
    if (!token || token === 'null' || token === 'undefined') {
        token = localStorage.getItem('cutora-auth-token');
    }

    const headers = {
        'Content-Type': 'application/json'
    };

    // Only add Authorization if token exists and is valid
    if (token && token !== 'null' && token !== 'undefined' && token.length > 10) {
        headers['Authorization'] = `Bearer ${token}`;
    } else {
        console.warn('⚠️ No valid auth token found in localStorage for API request');
    }

    return headers;
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
