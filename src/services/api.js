import axios from "axios";

// Khởi tạo thực thể axios cấu hình sẵn URL của Backend
const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Middleware ngầm (Request Interceptor) tự động lấy token từ Redux/LocalStorage gài vào Header
API.interceptors.request.use(
  (config) => {
    // Giả sử bạn lưu token trong localStorage khi đăng nhập thành công
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// --- CÁC HÀM GỌI API THỰC TẾ ---

// 1. API Thời trang AI (Gemini)
export const getAiRecommend = async (stylePreferences) => {
  const response = await API.post("/ai/recommend", { stylePreferences });
  return response.data; // Trả về { success, aiFeedback, recommendedProducts }
};

// 2. API Lấy danh sách sản phẩm đổ lên trang chủ
export const fetchProducts = async () => {
  const response = await API.get("/products");
  return response.data;
};

// 3. API Đơn hàng
export const createOrder = async (orderData) => {
  const response = await API.post("/orders", orderData);
  return response.data;
};

export default API;
