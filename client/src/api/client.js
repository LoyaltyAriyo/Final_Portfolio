// Centralized API helper for making authenticated requests to our backend.

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

// Grabs the JWT that signin stored in localStorage (adjust storage if you prefer cookies).
const getToken = () => localStorage.getItem("token");

// Builds the headers for each request, automatically injecting Authorization when a token exists.
const buildHeaders = (headers = {}) => {
  const token = getToken();
  const defaultHeaders = { "Content-Type": "application/json", ...headers };

  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  return defaultHeaders;
};

async function request(path, { method = "GET", body, headers } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: buildHeaders(headers),
    body: body ? JSON.stringify(body) : undefined,
  });

  // Attempt to parse JSON responses; throw a helpful error when the request fails.
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data.error || data.message || "Request failed";
    throw new Error(message);
  }
  return data;
}

const apiClient = {
  get: (path, options) => request(path, { ...options, method: "GET" }),
  post: (path, body, options) => request(path, { ...options, method: "POST", body }),
  put: (path, body, options) => request(path, { ...options, method: "PUT", body }),
  del: (path, options) => request(path, { ...options, method: "DELETE" }),
};

export default apiClient;

/* Usage pattern inside a React component:
   import apiClient from "../api/client";
   useEffect(() => {
     apiClient.get("/api/projects").then(setProjects).catch(console.error);
   }, []);
*/
