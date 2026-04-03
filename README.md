# 📓 NotesPro — Full-Stack Note Management with CRM Integration

Một ứng dụng quản lý ghi chú (Notes) hiện đại, tích hợp công cụ tự động hóa phân bổ thanh toán CRM, được xây dựng trên kiến trúc bền vững.

---

## ✨ Ứng dụng làm được gì? (Features)

### 1. Quản lý Ghi chú (Note Hub)
*   **CRUD Hoàn chỉnh**: Tạo, đọc, cập nhật và xóa ghi chú dễ dàng.
*   **Tìm kiếm thông minh**: Lọc ghi chú theo Tiêu đề hoặc Tag ngay lập tức (Debounce search).
*   **Giao diện Premium**: Hỗ trợ **Dark Mode** và **Light Mode** với hiệu ứng kính (Glassmorphism).

### 2. Công cụ Phân bổ CRM (Allocation Tool)
*   **Tích hợp CRM**: Kết nối trực tiếp với hệ thống MindX CRM (hỗ trợ cả V1 và V2).
*   **Tự động hóa**: Reset và phân bổ lại số tiền thanh toán vào các mặt hàng (Product Items) chỉ với 1 click.
*   **Chế độ Chạy thử (Dry Run)**: Kiểm tra log tính toán trước khi thực hiện thay đổi thật trên dữ liệu.
*   **Bảng Log trực quan**: Hiển thị chi tiết từng bước xử lý ngay trên giao diện web.

### 3. Linh hoạt lưu trữ (Storage)
*   Hỗ trợ lưu trữ dữ liệu vào **MongoDB**, **File JSON**, hoặc **RAM (In-Memory)** thông qua cấu hình đơn giản.

---

## 🛠️ Cần cài đặt những gì? (Prerequisites)

1.  **Node.js**: Phiên bản 18.0 trở lên.
2.  **npm**: Đi kèm khi cài Node.js.
3.  **MongoDB** (Tùy chọn): Chỉ cần nếu bạn muốn lưu dữ liệu vào Database thật. Nếu không, ứng dụng sẽ dùng file `data.json` có sẵn.

---

## ⚙️ Hướng dẫn cài đặt & Chạy dự án (Setup & Run)

### Bước 1: Cài đặt Backend (Server)
```bash
cd Server
npm install
```

**Cấu hình file `.env`:**
Tạo file `.env` trong thư mục `Server/` và dán nội dung sau:
```env
PORT=5000 # Chọn port cho server
REPO_TYPE=JSON  # Chọn: JSON hoặc MONGODB hoặc MEMORY
CRM_TOKEN=pat_your_token_here  # Token truy cập CRM (nếu dùng tính năng Allocation)
MONGODB_URI=mongodb://localhost:27017/note_app # (Nếu dùng MONGODB)
```

**Chạy Server:**
```bash
npm run dev
```

### Bước 2: Cài đặt Frontend (Client)
```bash
cd ../client
npm install
```

**Chạy Client:**
```bash
npm run dev
```
Sau đó truy cập: **http://localhost:5173** (hoặc port hiển thị trên terminal).

---

## 📖 Hướng dẫn sử dụng nhanh

1.  **Quản lý Note**: Sử dụng nút **"New Note"** để tạo, biểu tượng ✏️ để sửa và 🗑️ để xóa. Dùng ô Search để tìm nhanh.
2.  **Đổi giao diện**: Bấm biểu tượng ☀️/🌙 trên thanh Navbar để đổi Dark/Light mode.
3.  **Allocation**: 
    - Truy cập menu **Allocation**.
    - Dán **Lead ID** từ CRM vào.
    - Chọn phiên bản CRM (v1 hoặc v2).
    - Bấm **Dry Run** để xem log tính toán.
    - Bấm **Run Real** để thực hiện phân bổ thật trên CRM.

---

## 📁 Cấu trúc dự án rút gọn
*   `/Server`: Mã nguồn Backend (Express + TypeScript).
*   `/client`: Mã nguồn Frontend (React + Vite).
*   `README.md`: Hướng dẫn này.

---
*Dự án được tối ưu hóa cho trải nghiệm người dùng và tính ổn định cao.*
* *Author: Đinh Trọng Phúc -MindX Tech Team*