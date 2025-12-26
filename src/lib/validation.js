// Input validation and sanitization utilities

/**
 * Sanitize string input to prevent XSS attacks
 * @param {string} input - The input string to sanitize
 * @returns {string} - Sanitized string
 */
export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;

    // Remove script tags and dangerous HTML
    return input
        .trim()
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<[^>]*>/g, '') // Remove all HTML tags
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=\s*["'][^"']*["']/gi, ''); // Remove event handlers
};

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid email format
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};

/**
 * Validate phone number (10 digits)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid phone number
 */
export const isValidPhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
};

/**
 * Validate pincode (6 digits)
 * @param {string} pincode - Pincode to validate
 * @returns {boolean} - True if valid pincode
 */
export const isValidPincode = (pincode) => {
    const pincodeRegex = /^[0-9]{6}$/;
    return pincodeRegex.test(pincode);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} - {isValid: boolean, message: string}
 */
export const validatePassword = (password) => {
    if (!password) {
        return { isValid: false, message: 'Password is required' };
    }

    if (password.length < 6) {
        return { isValid: false, message: 'Password must be at least 6 characters long' };
    }

    if (password.length > 50) {
        return { isValid: false, message: 'Password is too long' };
    }

    return { isValid: true, message: 'Password is valid' };
};

/**
 * Validate name (letters, spaces, and basic punctuation only)
 * @param {string} name - Name to validate
 * @returns {boolean} - True if valid name
 */
export const isValidName = (name) => {
    if (!name || name.trim().length === 0) return false;
    if (name.length > 100) return false;

    // Allow letters, spaces, hyphens, apostrophes
    const nameRegex = /^[a-zA-Z\s\-'.]+$/;
    return nameRegex.test(name);
};

/**
 * Validate address
 * @param {string} address - Address to validate
 * @returns {boolean} - True if valid address
 */
export const isValidAddress = (address) => {
    if (!address || address.trim().length < 10) return false;
    if (address.length > 500) return false;
    return true;
};

/**
 * Validate city name
 * @param {string} city - City name to validate
 * @returns {boolean} - True if valid city name
 */
export const isValidCity = (city) => {
    if (!city || city.trim().length === 0) return false;
    if (city.length > 50) return false;

    // Allow letters, spaces, hyphens
    const cityRegex = /^[a-zA-Z\s-]+$/;
    return cityRegex.test(city);
};

/**
 * Validate numeric input
 * @param {any} value - Value to validate
 * @param {number} min - Minimum value (optional)
 * @param {number} max - Maximum value (optional)
 * @returns {boolean} - True if valid number
 */
export const isValidNumber = (value, min = null, max = null) => {
    const num = Number(value);

    if (isNaN(num)) return false;
    if (min !== null && num < min) return false;
    if (max !== null && num > max) return false;

    return true;
};

/**
 * Prevent SQL injection in MongoDB queries
 * @param {object} query - Query object to sanitize
 * @returns {object} - Sanitized query object
 */
export const sanitizeMongoQuery = (query) => {
    if (typeof query !== 'object' || query === null) return query;

    const sanitized = {};
    for (const [key, value] of Object.entries(query)) {
        // Remove keys starting with $
        if (key.startsWith('$')) continue;

        // Recursively sanitize nested objects
        if (typeof value === 'object' && value !== null) {
            sanitized[key] = sanitizeMongoQuery(value);
        } else {
            sanitized[key] = value;
        }
    }

    return sanitized;
};

/**
 * Escape HTML characters
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
export const escapeHtml = (text) => {
    if (typeof text !== 'string') return text;

    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };

    return text.replace(/[&<>"']/g, (char) => map[char]);
};

/**
 * Validate order ID format
 * @param {string} orderId - Order ID to validate
 * @returns {boolean} - True if valid order ID
 */
export const isValidOrderId = (orderId) => {
    // Format: CF-XXXX-XXXX
    const orderIdRegex = /^CF-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    return orderIdRegex.test(orderId);
};

/**
 * Validate coupon code format
 * @param {string} code - Coupon code to validate
 * @returns {boolean} - True if valid coupon code
 */
export const isValidCouponCode = (code) => {
    if (!code || typeof code !== 'string') return false;
    if (code.length > 20) return false;

    // Allow uppercase letters, numbers, and hyphens
    const couponRegex = /^[A-Z0-9-]+$/;
    return couponRegex.test(code.toUpperCase());
};

/**
 * Rate limiter for API calls (client-side)
 * @param {string} key - Unique key for the rate limit
 * @param {number} maxCalls - Maximum calls allowed
 * @param {number} windowMs - Time window in milliseconds
 * @returns {boolean} - True if call is allowed
 */
const rateLimitStore = new Map();

export const checkRateLimit = (key, maxCalls = 10, windowMs = 60000) => {
    const now = Date.now();

    if (!rateLimitStore.has(key)) {
        rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
        return true;
    }

    const data = rateLimitStore.get(key);

    if (now > data.resetTime) {
        rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
        return true;
    }

    if (data.count >= maxCalls) {
        return false;
    }

    data.count++;
    return true;
};

// Clean up rate limit store periodically
if (typeof window !== 'undefined') {
    setInterval(() => {
        const now = Date.now();
        for (const [key, data] of rateLimitStore.entries()) {
            if (now > data.resetTime) {
                rateLimitStore.delete(key);
            }
        }
    }, 60000); // Clean every minute
}
