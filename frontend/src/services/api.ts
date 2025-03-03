import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('auth_token');
    
    // If token exists, include it in the Authorization header
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const { response } = error;
    
    // If response status is 401 (Unauthorized), clear the token
    if (response && response.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      
      // If we have a router, we could redirect to login here
      // window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Generic API request method with error handling
const apiRequest = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await api(config);
    return response.data as T;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const { response } = error;
      if (response) {
        console.error('API Error:', response.status, response.data);
        throw new Error(
          response.data.message || response.data.error || `API Error: ${response.status}`
        );
      }
      console.error('Network Error:', error.message);
      throw new Error('Network error. Please check your connection.');
    }
    console.error('Unexpected Error:', error);
    throw new Error('An unexpected error occurred.');
  }
};

export default api;
export { apiRequest }; 