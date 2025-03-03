// Base URL for API requests
export const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Default API request timeout in milliseconds
export const apiTimeout = 30000;

// API version
export const apiVersion = 'v1';

// Config for axios interceptors
export const apiConfig = {
  baseURL: apiBaseUrl,
  timeout: apiTimeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
}; 