import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for API calls
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const { response } = error;
    // You can add global error handling logic here
    // e.g., redirect to login page if 401, show error notification, etc.
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
          response.data.message || `API Error: ${response.status}`
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