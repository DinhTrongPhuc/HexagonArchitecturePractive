# 📓 Solution center for IT Service Desk - Intergration Notes and AI

Hệ thống quản lý ghi chú thông minh tích hợp AI để hỗ trợ người dùng trả lời câu hỏi về công nghệ và các vấn đề kỹ thuật.

---

## ✨ Các Tính năng Chính (Features)

### 1. 🤖 AI Solution Agent (Thông minh & Linh hoạt)
*   **Cơ chế RAG (Retrieval-Augmented Generation)**: AI không trả lời "luyên thuyên" mà dựa trực tiếp vào cơ sở dữ liệu ghi chú (`data.json`) của bạn để đưa ra giải pháp chính xác.
*   **AI Factory**: Hỗ trợ chuyển đổi tức thì giữa các nhà cung cấp AI hàng đầu:
    *   **Groq (Llama 3)**: Tốc độ phản hồi siêu nhanh, độ trễ cực thấp.
    *   **Gemini (Google)**: Khả năng xử lý ngôn ngữ tự nhiên mạnh mẽ.
*   **Giao diện Chat Glassmorphism**: Trải nghiệm hỏi đáp hiện đại với hiệu ứng mờ kính và animation mượt mà.

### 2. 📧 Outlook Support Scanner
*   **Tích hợp Microsoft Graph API**: Tự động quét và gom nhóm các email hỗ trợ từ Outlook.
*   **Conversation Grouping**: Tự động gộp các hội thoại email để tránh trùng lặp dữ liệu.

### 3. 📝 Quản lý Ghi chú (Note Hub)
*   **Full CRUD**: Hệ thống quản lý ghi chú với Domain Model chặt chẽ.
*   **Modern UI**: Hỗ trợ **Dark/Light Mode**, thiết kế Responsive hoàn hảo.

---

## 🏗️ Kiến trúc Hệ thống (Hexagonal Architecture)

Dự án được chia làm 3 lớp chính:
*   **Domain**: Chứa thực thể (Entity) và logic nghiệp vụ cốt lõi.
*   **Application**: Chứa các Use Case (như `AskAIUseCase`, `CreateNote`).
*   **Adapters**:
    *   **Primary (Driving)**: REST Controllers, CLI Commands.
    *   **Secondary (Driven)**: Persistence (MongoDB/JSON), AI Agents (Groq/Gemini), External APIs (Outlook).

---

## 🗝️ Hướng dẫn lấy API Key

Để hệ thống AI hoạt động, bạn cần có ít nhất một trong hai loại API Key sau:

### 1. Groq API Key (Khuyên dùng vì tốc độ)
*   Truy cập: [Groq Console](https://console.groq.com/keys)
*   Đăng nhập bằng Google/Github.
*   Nhấn **"Create API Key"**, đặt tên và copy mã có tiền tố `gsk_...`.

### 2. Gemini API Key
*   Truy cập: [Google AI Studio](https://aistudio.google.com/app/apikey)
*   Đăng nhập bằng tài khoản Google.
*   Nhấn **"Create API key in new project"** và copy mã bắt đầu bằng `AIza...`.

### 3. Outlook Authentication (Lần đầu chạy)
Hệ thống sử dụng cơ chế **Device Code Flow** của Microsoft:
1.  Khi bạn chạy Server lần đầu, hãy quan sát Terminal.
2.  Server sẽ hiện một thông báo: `To sign in, use a web browser to open the page https://microsoft.com/devicelogin and enter the code [MÃ_CODE] to authenticate.`
3.  Bạn mở trình duyệt, truy cập link, dán mã và đăng nhập bằng tài khoản Outlook công ty.
4.  Sau khi thành công, Server sẽ tự động lưu Token và bạn không cần làm lại bước này (trừ khi Token hết hạn).

---

## ⚙️ Hướng dẫn Cấu hình .env

### Phía Backend (Server)
Tạo file `Server/.env` dựa trên mẫu:
```env
PORT=5000
REPO_TYPE=JSON # Chọn: JSON | MONGODB | MEMORY

# AI Configuration
AI_TYPE=GROQ # Chọn: GROQ | GEMINI
GROQ_API_KEY=your_key_here
GEMINI_API_KEY=your_key_here

# Outlook Email Scanning
OUTLOOK_SEARCH_PHRASE="xem phiếu hỗ trợ"
OUTLOOK_SCAN_INTERVAL=300000 
```

---

## 📖 Hướng dẫn Chạy dự án

1.  **Cài đặt Dependencies**:
```bash
# Tại thư mục Server
cd Server && npm install

# Tại thư mục client
cd client && npm install
```

2.  **Khởi chạy**:
```bash
# Chạy Backend (Cổng 5000)
cd Server && npm run dev

# Chạy Frontend (Cổng 5556)
cd client && npm run dev
```

3.  **Sử dụng AI**:
Tại Dashboard, nhập câu hỏi vào thanh tìm kiếm và nhấn nút **"Ask AI"**. Hệ thống sẽ tự động tìm các ghi chú liên quan và dùng AI để tổng hợp câu trả lời cho bạn.

---
*Dự án được thiết kế để dễ dàng mở rộng và bảo trì theo chuẩn kiến trúc sạch.*
**Author: Đinh Trọng Phúc - MindX Tech Team**