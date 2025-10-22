import axios from "axios";

// Create axios instance
const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// ✅ Add interceptor to automatically include token in every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;

// ✅ Add booking API functions
export const bookingAPI = {
  // Create a new booking
  createBooking: async (bookingData) => {
    const response = await API.post('/bookings', bookingData);
    return response.data;
  },

  // Get user's bookings
  getMyBookings: async () => {
    const response = await API.get('/bookings/my-bookings');
    return response.data;
  },

  // Delete a booking
  deleteBooking: async (bookingId) => {
    const response = await API.delete(`/bookings/${bookingId}`);
    return response.data;
  }
};