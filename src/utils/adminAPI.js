// src/utils/adminAPI.js

const API_ROOT = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");
const API_BASE_URL = `${API_ROOT}/api`;

// Helper function to get auth headers
function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
}

// Helper function to handle API responses
async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "API request failed");
  }
  return response.json();
}

// Helper function to upload image to Cloudinary
async function uploadToCloudinary(file, folder = "movies") {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const token = localStorage.getItem("token");
  
  console.log('Uploading to:', `${API_BASE_URL}/upload`);
  console.log('File:', file.name, 'Size:', file.size, 'Type:', file.type);
  console.log('Token present:', !!token);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      // Don't set Content-Type - let browser set it with boundary for FormData
    },
    body: formData,
  });

  console.log('Upload response status:', response.status);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Upload failed' }));
    console.error('Upload error:', errorData);
    throw new Error(errorData.message || `Upload failed with status ${response.status}`);
  }

  const data = await response.json();
  console.log('Upload successful:', data.url);
  return data.url; // Return the Cloudinary URL
}

export const adminAPI = {
  // ==================== IMAGE UPLOAD ====================
  
  // Upload image to Cloudinary
  async uploadImage(file, folder = "movies") {
    return uploadToCloudinary(file, folder);
  },

  // Upload multiple images
  async uploadImages(files, folder = "movies") {
    const uploadPromises = files.map(file => uploadToCloudinary(file, folder));
    return Promise.all(uploadPromises);
  },

  // ==================== MOVIES ====================
  
  // Get all movies (with admin details)
  async getAllMovies() {
    const response = await fetch(`${API_BASE_URL}/admin/movies`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Get single movie by ID
  async getMovieById(movieId) {
    const response = await fetch(`${API_BASE_URL}/admin/movies/${movieId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Add a new movie
  async addMovie(movieData) {
    const response = await fetch(`${API_BASE_URL}/admin/movies`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(movieData),
    });
    return handleResponse(response);
  },

  // Update a movie
  async updateMovie(movieId, movieData) {
    const response = await fetch(`${API_BASE_URL}/admin/movies/${movieId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(movieData),
    });
    return handleResponse(response);
  },

  // Delete a movie
  async deleteMovie(movieId) {
    const response = await fetch(`${API_BASE_URL}/admin/movies/${movieId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Toggle movie featured status
  async toggleFeatured(movieId) {
    const response = await fetch(`${API_BASE_URL}/admin/movies/${movieId}/featured`, {
      method: "PATCH",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // ==================== USERS ====================

  // Get all users
  async getAllUsers() {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Get user by ID
  async getUserById(userId) {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Update user
  async updateUser(userId, userData) {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  // Delete user
  async deleteUser(userId) {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // ==================== RESERVATIONS ====================

  // Get all reservations
  async getAllReservations() {
    const response = await fetch(`${API_BASE_URL}/admin/reservations`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Get reservation by ID
  async getReservationById(reservationId) {
    const response = await fetch(`${API_BASE_URL}/admin/reservations/${reservationId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Update reservation
  async updateReservation(reservationId, reservationData) {
    const response = await fetch(`${API_BASE_URL}/admin/reservations/${reservationId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(reservationData),
    });
    return handleResponse(response);
  },

  // Delete reservation
  async deleteReservation(reservationId) {
    const response = await fetch(`${API_BASE_URL}/admin/reservations/${reservationId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // ==================== STATISTICS ====================

  // Get dashboard statistics
  async getDashboardStats() {
    const response = await fetch(`${API_BASE_URL}/admin/stats`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Get revenue statistics
  async getRevenueStats(startDate, endDate) {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    
    const response = await fetch(`${API_BASE_URL}/admin/stats/revenue?${params}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};