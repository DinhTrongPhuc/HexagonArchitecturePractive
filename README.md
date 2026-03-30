# 📝 Note Taking App - Hexagonal Architecture Practice

Một ứng dụng quản lý ghi chú đơn giản được xây dựng bằng công nghệ **Node.js + TypeScript** để thực hành kiến thuật **Hexagonal Architecture (Kiến trúc lục giác)** và **Domain-Driven Design (DDD)**.

## 🚀 Tính năng nổi bật
*   **Thiết kế Hexagonal**: Tách biệt hoàn toàn Logic nghiệp vụ khỏi các công cụ bên ngoài (Database, Framework).
*   **Lưu trữ linh hoạt**: Hỗ trợ lưu trữ trực tiếp vào file `data.json` thông qua JSON Repository.
*   **Đa Adapter**: Hỗ trợ cùng lúc 2 giao diện người dùng:
    1.  **CLI (Command Line Interface)**: Nhập lệnh trực tiếp từ Terminal.
    2.  **REST API (Web Server)**: Sử dụng Express.js.
*   **Validation chặt chẽ**: Sử dụng Value Objects để đảm bảo dữ liệu (Email, Tag, Title) luôn đúng quy định.

---

## 🛠 Yêu cầu hệ thống
*   **Node.js**: Phiên bản 16.x trở lên.
*   **NPM**: Phiên bản 7.x trở lên.

---

## ⚙️ Cài đặt chi tiết

### 1. Di chuyển vào thư mục Server
```bash
cd Server
```

### 2. Cài đặt các thư viện phụ thuộc
```bash
npm install
```

---

## 📂 Hướng dẫn sử dụng

Ứng dụng của bạn có thể chạy ở 2 chế độ khác nhau tùy thuộc vào tham số truyền vào:

### Cách 1: Chạy làm Web Server (REST API)
Nếu bạn không truyền thêm tham số nào sau lệnh chạy, hệ thống sẽ mặc định khởi động Web Server trên cổng **5000**.

*   **Lệnh chạy:**
    ```bash
    npm run dev
    ```
*   **Các Endpoint có sẵn:**
    *   **GET** `http://localhost:5000/notes`: Xem danh sách ghi chú.
    *   **POST** `http://localhost:5000/notes`: Tạo ghi chú mới.
        *   Body mẫu (JSON):
            ```json
            {
              "title": "Học Hexagonal",
              "content": "Hôm nay tôi học về Port và Adapter",
              "tags": "study, tech, architecture",
              "reporter": "phuc@gmail.com"
            }
            ```

### Cách 2: Chạy chế độ Command Line (CLI)
Nếu bạn truyền tham số vào sau lệnh chạy, hệ thống sẽ thực thi lệnh tương ứng và kết thúc.

*   **Tạo ghi chú mới:**
    ```bash
    npm run dev note create "Tiêu đề CLI" "Nội dung ghi chú" "tag1, tag2" "email@gmail.com"
    ```
*   **Xem danh sách ghi chú:**
    ```bash
    npm run dev note read
    ```

---

## 🏗 Cấu trúc thư mục
Dự án được phân cấp theo các lớp của kiến trúc Hexagonal:
*   `src/domain`: Thực thể (Note) và các quy tắc nghiệp vụ (Value Objects).
*   `src/application`: Các ca sử dụng (Use Cases) như Tạo Note, Đọc Note.
*   `src/ports`: Các Interface (Inbound và Outbound) định nghĩa cổng giao tiếp.
*   `src/adapters`:
    *   `primary`: Giao diện người dùng (Controller, CLI Command).
    *   `secondary`: Công cụ lưu trữ (Json Repository, InMemory Repository).
*   `src/index.ts`: chạy và thực thi các lệnh hoặc web server.

---

## 💾 Lưu giữ dữ liệu
Toàn bộ dữ liệu sẽ tự động được ghi vào file `Server/data.json`. Dự án đã bao gồm cấu hình `.gitignore` để tránh đưa file dữ liệu này lên Git.

---
