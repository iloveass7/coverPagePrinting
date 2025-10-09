import axios from "axios";

// ⚠️ Change ONLY this line when you deploy
export const API_HOST = "http://localhost:7000";

// Normalize and add /api
export const API_BASE_URL = `${API_HOST.replace(/\/+$/, "")}/api`;

// Shared axios instance (used by all pages)
export const api = axios.create({
  baseURL: API_BASE_URL,
});