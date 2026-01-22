export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:3000';
export const API_ENDPOINTS = {
    AUTH: `${API_BASE_URL}/api/auth`,
    COURSES: `${API_BASE_URL}/api/courses`,
    SUPABASE: `${API_BASE_URL}/api/supabase`,
    PAYMENTS: `${API_BASE_URL}/api/payments`,
    AFFILIATES: `${API_BASE_URL}/api/affiliates`,
    WITHDRAWALS: `${API_BASE_URL}/api/withdrawals`,
    KEYS: `${API_BASE_URL}/api/keys`,
    V1: `${API_BASE_URL}/api/v1`,
};
