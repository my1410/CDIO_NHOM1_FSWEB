// 1. Phải nạp dotenv NGAY LẬP TỨC ở dòng đầu tiên của file
require("dotenv").config();

// 2. Sau đó mới import các module khác
const app = require("./src/app");
const connectDB = require("./src/config/db");

// 3. Bây giờ bạn có thể kiểm tra Key (nó sẽ hiện ĐÃ NHẬN ĐƯỢC KEY)
console.log(
  "Đang kiểm tra API Key từ .env:",
  process.env.OPENROUTER_API_KEY ? "Đã nhận được Key" : "KEY BỊ RỖNG!",
);

const PORT = process.env.PORT || 5000;

// Kết nối Cơ sở dữ liệu
connectDB();

// Khởi chạy Server
app.listen(PORT, () => {
  console.log(`=== Server đang chạy tại port: ${PORT} ===`);
  console.log(`=== Chế độ: ${process.env.NODE_ENV || "development"} ===`);
});
