import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1",
  withCredentials: true, // send cookies with every request
});

// attach accessToken to every request automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// auth
export const signupAPI = (data) => api.post("/users/signup", data);
export const loginAPI = (data) => api.post("/users/login", data);
export const logoutAPI = () => api.post("/users/logout");
export const refreshTokenAPI = (data) => api.post("/users/refresh-token", data);

// posts
export const getFeedAPI = () => api.get("/posts");
export const getPostAPI = (postId) => api.get(`/posts/${postId}`);
export const createPostAPI = (data) => api.post("/posts/create", data); // data is FormData
export const toggleLikeAPI = (postId) => api.post(`/posts/${postId}/like`);
export const addCommentAPI = (postId, data) => api.post(`/posts/${postId}/comment`, data);

export default api;
