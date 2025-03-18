import axios from 'axios';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('authToken');
    
    // If token exists, add it to headers
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Return just the data from the response
    return response.data;
  },
  (error) => {
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear auth state
          localStorage.removeItem('authToken');
          delete apiClient.defaults.headers.common['Authorization'];
          window.location.href = '/login';
          break;
        case 403:
          console.error('Access forbidden');
          break;
        case 429:
          console.error('Rate limit exceeded');
          break;
        default:
          console.error('Server error:', error.response.data);
      }
      return Promise.reject(error);
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received:', error.request);
      return Promise.reject(new Error('No response from server'));
    } else {
      // Error in request configuration
      console.error('Request error:', error.message);
      return Promise.reject(error);
    }
  }
);

// API request functions
const apiRequest = {
  get: async (url, { params, ...config } = {}) => {
    try {
      console.log('Making GET request:', { url, params, config });
      const response = await apiClient.get(url, { ...config, params });
      console.log('GET response raw:', response);
      
      // Ensure we have a valid response
      if (!response) {
        console.warn('Empty response received');
        return { results: [], count: 0, next: null, previous: null };
      }

      // If the response is already in the correct format, return it
      if (response.results && Array.isArray(response.results)) {
        console.log('Response is already in correct format:', response);
        return response;
      }

      // If response is an array, wrap it
      if (Array.isArray(response)) {
        console.log('Response is an array, wrapping it:', response);
        return {
          results: response,
          count: response.length,
          next: null,
          previous: null
        };
      }

      // If response is a single object (not null), wrap it
      if (response && typeof response === 'object') {
        console.log('Response is a single object, wrapping it:', response);
        return {
          results: [response],
          count: 1,
          next: null,
          previous: null
        };
      }

      // Default case: return empty results
      console.warn('Unexpected response format:', response);
      return { results: [], count: 0, next: null, previous: null };
    } catch (error) {
      console.error('GET request error:', error);
      throw error;
    }
  },

  post: async (url, data = {}, config = {}) => {
    try {
      console.log('Making POST request:', { url, data, config });
      const response = await apiClient.post(url, data, config);
      console.log('POST response:', response);
      return response;
    } catch (error) {
      console.error('POST request error:', error);
      throw error;
    }
  },

  put: async (url, data = {}, config = {}) => {
    try {
      console.log('Making PUT request:', { url, data, config });
      const response = await apiClient.put(url, data, config);
      console.log('PUT response:', response);
      return response;
    } catch (error) {
      console.error('PUT request error:', error);
      throw error;
    }
  },

  delete: async (url, config = {}) => {
    try {
      console.log('Making DELETE request:', { url, config });
      const response = await apiClient.delete(url, config);
      console.log('DELETE response:', response);
      return response;
    } catch (error) {
      console.error('DELETE request error:', error);
      throw error;
    }
  }
};

// CSRF token handling
export const getCsrfToken = async () => {
  try {
    const response = await apiClient.get('/api/csrf-token/');
    return response.data.csrfToken;
  } catch (error) {
    console.error('Failed to get CSRF token:', error);
    return null;
  }
};

// Rate limiting helper
export const withRateLimit = (fn, delay = 1000) => {
  let lastCall = 0;
  
  return async (...args) => {
    const now = Date.now();
    if (now - lastCall < delay) {
      throw new Error('Please wait before trying again');
    }
    lastCall = now;
    return fn(...args);
  };
};

export { apiRequest }; 