# 📓 NotesPro — Full-Stack Portfolio with Outlook Automator

Một hệ thống quản lý ghi chú hiện đại và công cụ tự động hóa công việc (CRM Allocation & Outlook Scanning), được xây dựng trên **Kiến trúc Lục giác (Hexagonal Architecture)** bền vững và linh hoạt.

---

## ✨ Các Tính năng Chính (Features)

### 1. 📧 Outlook Support Scanner (Mới)
*   **Tích hợp Microsoft Graph API**: Kết nối trực tiếp với hòm thư Outlook công ty thông qua Azure App Registration.
*   **Quét Mail Thông minh**: Tự động tìm kiếm các email chưa đọc có nội dung liên quan đến Odoo Support (ví dụ: "xem phiếu hỗ trợ").
*   **Bóc tách link tự động**: Sử dụng Cheerio để trích xuất link Ticket trực tiếp từ nội dung mail HTML.
*   **Chế độ Quét Ngầm (Auto Scan)**: Server tự động lắng nghe mail mới theo chu kỳ và cập nhật tức thì lên giao diện Frontend mà không cần load lại trang.

### 2. 📝 Quản lý Ghi chú (Note Hub)
*   **Full CRUD**: Tạo, đọc, cập nhật và xóa ghi chú với giao diện mượt mà.
*   **Tìm kiếm & Lọc**: Tìm kiếm theo tiêu đề hoặc lọc theo tag với kỹ thuật Debounce để tối ưu hiệu năng.
*   **Giao diện Premium**: Hỗ trợ **Dark/Light Mode**, hiệu ứng **Glassmorphism** (kính mờ) và thiết kế Responsive.

### 3. ⚙️ Công cụ Phân bổ CRM (Allocation Tool)
*   **Xử lý dữ liệu Lead**: Reset và phân bổ lại số tiền thanh toán vào các mặt hàng (Product Items) trên MindX CRM (v1/v2).
*   **Dry Run Mode**: Chế độ chạy thử nghiệm để kiểm tra Log tính toán trước khi tác động vào dữ liệu thật.

---

## 🛠️ Yêu cầu Hệ thống (Prerequisites)

*   **Node.js**: v18.0 trở lên.
*   **Azure App Registration**: Cần có một App trên Azure với quyền `Mail.Read` và `Mail.Send` (dạng Delegated) để dùng tính năng Outlook.
*   **Database**: Tự động hỗ trợ **MongoDB**, **File JSON**, hoặc **In-Memory**.

---

## ⚙️ Hướng dẫn Cài đặt & Chạy (Setup)

### Bước 1: Cấu hình Backend (Server)
1. Di chuyển vào thư mục Server: `cd Server`
2. Cài đặt thư viện: `npm install`
3. Tạo file `.env` và cấu hình các biến sau:

```env
PORT=5000
REPO_TYPE=JSON # JSON | MONGODB | MEMORY

# Outlook / Azure Configuration
OUTLOOK_CLIENT_ID=your_azure_client_id
OUTLOOK_TENANT_ID=your_azure_tenant_id
OUTLOOK_TARGET_MAILBOX=your_email@domain.com
OUTLOOK_SEARCH_PHRASE="xem phiếu hỗ trợ"

# CRM Configuration (Optional)
CRM_TOKEN=your_crm_pat_token
```

4. Chạy server: `npm run dev`

### Bước 2: Cấu hình Frontend (Client)
1. Di chuyển vào thư mục Client: `cd client`
2. Cài đặt thư viện: `npm install`
3. Chạy ứng dụng: `npm run dev`
4. Truy cập: `http://localhost:5173`

---

## 📖 Hướng dẫn Sử dụng Outlook Scanner

1.  Truy cập menu **Outlook Scan**.
2.  Nếu là lần đầu chạy, Terminal của Server sẽ hiển thị một **Code xác thực**. Hãy truy cập [microsoft.com/devicelogin](https://microsoft.com/devicelogin) và nhập mã để cấp quyền truy cập mail.
3.  Sử dụng **"Run Manual Scan"** để tìm mail ngay lập tức.
4.  Nhấn **"Start Auto Scanning"** để bật chế độ tự động cập nhật. Hệ thống sẽ giữ đồng bộ mỗi phút trên cả frontend (client) và backend(server).

---

## 🏗️ Kiến trúc Dự án (Architecture)

Dự án tuân thủ nghiêm ngặt **Hexagonal Architecture**:
*   **Domain**: Chứa logic nghiệp vụ cốt lõi và các thực thể (Entities).
*   **Application**: Chứa các Use Cases (ví dụ: `ScanSupportTicketsUseCase`).
*   **Ports**: Định nghĩa các Interface cho Input (Inbound) và Output (Outbound).
*   **Adapters**:
    *   *Primary*: Các Controller HTTP (Express).
    *   *Secondary*: Kết nối với Outlook (Microsoft Graph), CRM, hoặc Database (MongoDB/JSON).

---
*Dự án được phát triển nhằm mục đích Onboarding và thực hành kiến trúc phần mềm sạch.*
**Author: Đinh Trọng Phúc - MindX Tech Team**