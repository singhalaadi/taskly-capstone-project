export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

/**
 * Makes an API request with proper error handling
 * @param {string} endpoint - The API endpoint to call
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} - The response data
 */
export const apiRequest = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return { 
        ok: false, 
        status: response.status, 
        data,
        isDemoUser: data.isDemoUser || false
      };
    }

    return { ok: true, data };
  } catch (error) {
    console.error('API request error:', error);
    return { 
      ok: false, 
      error: error.message || 'Network error',
      isDemoUser: false
    };
  }
};