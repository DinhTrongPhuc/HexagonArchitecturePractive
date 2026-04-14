# 📓 NotesPro — Full-Stack Portfolio with Outlook Automator

Một hệ thống quản lý ghi chú hiện đại và công cụ tự động hóa công việc (CRM Allocation & Outlook Scanning), được xây dựng trên **Kiến trúc Lục giác (Hexagonal Architecture)** bền vững và linh hoạt.

---

## ✨ Các Tính năng Chính (Features)

### 1. 📧 Outlook Support Scanner (Mạnh mẽ & Thông minh)
*   **Tích hợp Microsoft Graph API**: Kết nối trực tiếp với hòm thư Outlook công ty.
*   **Gom nhóm hội thoại (Conversation Grouping)**: Tự động gộp các mail phản hồi qua lại thành một dòng duy nhất, chỉ hiển thị phản hồi mới nhất để tránh trùng lặp ticket.
*   **Hỗ trợ nhiều nguồn gửi**: Có khả năng lọc mail từ danh sách nhiều địa chỉ cấu hình sẵn hoặc quét toàn bộ hòm thư.
*   **Đồng bộ hóa thời gian thực**: Cơ chế Polling từ Frontend kết hợp Background Job từ Backend giúp dữ liệu luôn mới nhất.

### 2. 📝 Quản lý Ghi chú (Note Hub)
*   **Full CRUD**: Quản lý ghi chú với Domain Model chặt chẽ (Value Objects cho Title, Content, Tags).
*   **Giao diện Premium**: Hỗ trợ **Dark/Light Mode**, hiệu ứng **Glassmorphism** và thiết kế Responsive.

### 3. ⚙️ Công cụ Phân bổ CRM (Allocation Tool)
*   **Xử lý dữ liệu Lead**: Reset và phân bổ lại số tiền thanh toán vào các mặt hàng trên MindX CRM (v1/v2).

---

## 🏗️ Cấu trúc Hạ tầng (Infrastructure)

Dự án áp dụng cấu trúc Adapter bền vững, cho phép thay đổi kho lưu trữ linh hoạt:
*   **Persistence Layers**: Được tổ chức theo công nghệ:
    *   `mongodb/`: Dành cho môi trường Production (Database thực).
    *   `json/`: Dành cho lưu trữ file cục bộ (`data.json`, `tickets.json`).
    *   `in-memory/`: Dành cho việc test nhanh hoặc chạy thử không cần lưu trữ.

---

## ⚙️ Hướng dẫn Cấu hình .env

### Phía Backend (Server)
Tạo file `Server/.env` với các thông số:
```env
PORT=5000
REPO_TYPE=JSON # Chọn: JSON | MONGODB | MEMORY

# Cấu hình Quét Mail
OUTLOOK_SEARCH_PHRASE="xem phiếu hỗ trợ"
OUTLOOK_SEARCH_LIMIT=10
OUTLOOK_SCAN_INTERVAL=60000 # Thời gian quét ngầm (ms)
OUTLOOK_TARGET_MAILBOX=odoo@company.com, support@mindx.com # Có thể để trống hoặc nhiều mail cách nhau bởi dấu phẩy
```

### Phía Frontend (Client)
Tạo file `client/.env` (Vite yêu cầu tiền tố `VITE_`):
```env
VITE_OUTLOOK_SEARCH_PHRASE="xem phiếu hỗ trợ"
VITE_OUTLOOK_SEARCH_LIMIT=10
VITE_OUTLOOK_SCAN_INTERVAL=60000 # Thời gian làm mới giao diện (ms)
```

---

## 📖 Hướng dẫn Chạy dự án

1.  **Cài đặt**: Chạy `npm install` ở cả hai thư mục `Server` và `client`.
```bash
cd Server
npm install
cd .. # Hoặc mở một terminal mới
cd client
npm install
```
2.  **Khởi chạy**: Chạy `npm run dev` đồng thời ở cả hai phía.
```bash
cd Server
npm run dev
# mở terminal mới
cd client
npm run dev
```
3.  **Xác thực**: Kiểm tra Terminal của `Server` để lấy mã **Device Login** cho Outlook trong lần chạy đầu tiên.

---
*Dự án được tối ưu hóa cho Onboarding và thực hành kiến trúc phần mềm sạch.*
**Author: Đinh Trọng Phúc - MindX Tech Team**