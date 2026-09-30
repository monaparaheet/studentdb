/**
 * Student Information Portal - API Service
 * Communicates with the Express/Node.js backend hosted locally or on Render.
 */

// Base URL: Supports relative path in production on Vercel, or custom VITE_API_BASE_URL, or localhost in development
const RAW_BASE_URL = import.meta.env.VITE_API_BASE_URL !== undefined
  ? import.meta.env.VITE_API_BASE_URL
  : (import.meta.env.PROD ? '' : 'http://localhost:5000');

// Strip trailing slash if present
const API_BASE_URL = RAW_BASE_URL ? RAW_BASE_URL.replace(/\/$/, '') : '';

/**
 * Common fetch wrapper with error handling and JSON parsing
 */
const request = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = data.message || `Request failed with status ${response.status} (${response.statusText})`;
      const error = new Error(errorMsg);
      error.status = response.status;
      error.details = data;
      throw error;
    }

    return data;
  } catch (error) {
    // Check if network failed or server is offline
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(
        `Unable to reach backend server at ${API_BASE_URL}. Ensure the backend is running and CORS is configured.`
      );
    }
    throw error;
  }
};

export const studentApi = {
  /**
   * Fetch all students with optional search, course filter, and sort
   */
  getStudents: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.course && params.course !== 'All') query.append('course', params.course);
    if (params.sort) query.append('sort', params.sort);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request(`/students${queryString}`);
  },

  /**
   * Get single student by ID
   */
  getStudentById: async (id) => {
    return request(`/students/${id}`);
  },

  /**
   * Create a new student record
   */
  createStudent: async (studentData) => {
    return request('/students', {
      method: 'POST',
      body: JSON.stringify(studentData)
    });
  },

  /**
   * Update student record by ID
   */
  updateStudent: async (id, studentData) => {
    return request(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(studentData)
    });
  },

  /**
   * Delete student record by ID
   */
  deleteStudent: async (id) => {
    return request(`/students/${id}`, {
      method: 'DELETE'
    });
  },

  /**
   * Get dashboard statistics
   */
  getStats: async () => {
    return request('/students/stats');
  },

  /**
   * Test backend health and connection
   */
  checkHealth: async () => {
    return request('/health');
  }
};

export { API_BASE_URL };
