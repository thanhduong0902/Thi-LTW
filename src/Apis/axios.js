import axios from "axios";
const base_URL = "http://localhost:8081/api";

export const axiosBase = axios.create({
  baseURL: base_URL,
});

export const axiosInstance = axios.create({
  baseURL: base_URL,
  headers: { "Content-Type": "application/json" },
});
