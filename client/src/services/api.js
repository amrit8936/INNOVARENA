// ─── services/api.js ──────────────────────────────────────────────────────────
// This file creates a single Axios instance that ALL components share.
//
// Why use a custom instance instead of plain axios?
//   1. We set the base URL once — no need to type "http://localhost:5000/api" everywhere
//   2. We automatically attach the JWT token to EVERY request via an interceptor
//      (interceptor = a function that runs before each request is sent)

import axios from "axios"; // axios – a popular library for making HTTP requests

// Create a custom axios instance with a shared base URL
const api = axios.create({
  baseURL: "http://localhost:5000/api", // All requests go to this base URL
});

// ── Request Interceptor ────────────────────────────────────────────────────────
// This runs automatically BEFORE every request is sent to the backend.
// It checks if a token is saved in localStorage and adds it to the headers.
api.interceptors.request.use((config) => {
  // Get the token saved during login
  const token = localStorage.getItem("token");

  if (token) {
    // Add the Authorization header: "Bearer <token>"
    // The backend's protect middleware reads this header to identify the user
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config; // Return the modified config so the request continues
});

export default api;

// ── HOW TO USE api ─────────────────────────────────────────────────────────────
// GET request:    api.get("/hackathons")
// POST request:   api.post("/auth/login", { email, password })
// PUT request:    api.put("/teams/123/join")
// DELETE request: api.delete("/teams/123")
// ─────────────────────────────────────────────────────────────────────────────
