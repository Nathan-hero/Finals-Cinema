import axios from "axios";

// ✅ Use Vite's environment variable syntax
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Create axios instance with dynamic baseURL
const API = axios.create({
  baseURL: `${API_URL}/api`,
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

  // ✅ Get booked seats for a movie/showtime
  getBookedSeats: async (movieTitle, showtime) => {
    const response = await API.get('/bookings/booked-seats', {
      params: { movieTitle, showtime }
    });
    return response.data;
  },

  // Delete a booking
  deleteBooking: async (bookingId) => {
    const response = await API.delete(`/bookings/${bookingId}`);
    return response.data;
  }
};