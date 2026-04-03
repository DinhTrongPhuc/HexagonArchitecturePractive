# 📓 NotesPro — Hexagonal Note Management System

Một ứng dụng quản lý ghi chú (Ticket Note) Full-Stack được xây dựng theo **Kiến trúc Lục giác (Hexagonal Architecture / Ports & Adapters)**, tập trung vào tính linh hoạt, dễ kiểm thử và khả năng bảo trì cao.

> **Live Preview:** Backend chạy tại `http://localhost:5000` • Frontend chạy tại `http://localhost:5173`

---

## ✨ Điểm nổi bật

| Tính năng | Mô tả |
|---|---|
| 🏛️ Hexagonal Architecture | Tách biệt hoàn toàn Logic Nghiệp vụ (Domain) khỏi Cơ sở hạ tầng (Database, UI) |
| 🔄 Swappable Storage | Hoán đổi giữa **MongoDB**, **JSON File**, hoặc **In-Memory** chỉ bằng 1 dòng config |
| 🖥️ Multi-Interface | Hỗ trợ cả **REST API (Express)** lẫn **CLI (Command Line)** trên cùng một lõi |
| 🛡️ Input Validation | Sử dụng **Zod** để validate dữ liệu đầu vào chặt chẽ |
| 📄 Pagination & Filtering | Phân trang và lọc Note theo tag |
| 🎨 Premium Frontend | Giao diện React + Vite với Dark Mode, Glassmorphism |
| 🧱 Domain Driven Design | Sử dụng **Value Objects** (Title, Content, Email, TagList) để đảm bảo toàn vẹn dữ liệu |

---

## 🛠️ Công nghệ sử dụng

### Backend (Server)
- **Ngôn ngữ:** TypeScript
- **Runtime:** Node.js
- **Framework:** Express.js (v5)
- **Cơ sở dữ liệu:** MongoDB (Official Driver) / JSON File / In-Memory
- **Validation:** Zod
- **Công cụ phát triển:** `tsx`, `dotenv`

### Frontend (Client)
- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **Date Formatting:** date-fns
- **Routing:** React Router DOM

---

## 📋 Yêu cầu hệ thống (Prerequisites)

Trước khi bắt đầu, hãy đảm bảo máy tính của bạn đã cài đặt các phần mềm sau:

| Phần mềm | Phiên bản tối thiểu | Kiểm tra | Tải về |
|---|---|---|---|
| **Node.js** | v18 trở lên | `node --version` | [nodejs.org](https://nodejs.org/) |
| **npm** | v9 trở lên (đi kèm Node.js) | `npm --version` | Đi kèm Node.js |
| **Git** | Bất kỳ | `git --version` | [git-scm.com](https://git-scm.com/) |
| **MongoDB** _(tùy chọn)_ | v6 trở lên | `mongod --version` | [mongodb.com](https://www.mongodb.com/try/download/community) |

> 💡 **Lưu ý:** MongoDB chỉ cần thiết nếu bạn chọn chế độ lưu trữ `MONGODB`. Mặc định ứng dụng dùng **JSON File** nên không cần cài MongoDB.

---

## ⚙️ Hướng dẫn cài đặt từng bước

### Bước 1: Clone dự án về máy

```bash
git clone https://github.com/DinhTrongPhuc/HexagonArchitecturePractive.git
cd HexagonArchitecturePractive
```

### Bước 2: Cài đặt Backend (Server)

```bash
cd Server
npm install
```

### Bước 3: Cấu hình môi trường Backend

Tạo file `.env` trong thư mục `Server/` với nội dung sau:

```env
# Port chạy Backend API
PORT=5000

# Chuỗi kết nối MongoDB (chỉ cần nếu REPO_TYPE=MONGODB)
MONGODB_URI=mongodb://localhost:27017/note_app

# Chọn nơi lưu trữ dữ liệu. Có 3 lựa chọn:
#   JSON     → Lưu vào file data.json (mặc định, không cần cài thêm gì)
#   MONGODB  → Lưu vào MongoDB (cần cài MongoDB)
#   MEMORY   → Lưu trong RAM (mất dữ liệu khi tắt server)
REPO_TYPE=JSON
```

> ⚠️ **Quan trọng:** Tuyệt đối **KHÔNG** commit file `.env` lên GitHub. File này chứa thông tin nhạy cảm.

**Giải thích các chế độ lưu trữ (REPO_TYPE):**

| Giá trị | Mô tả | Phù hợp cho |
|---|---|---|
| `JSON` | Lưu dữ liệu vào file `data.json` trong thư mục Server | Phát triển, demo nhanh |
| `MONGODB` | Lưu vào MongoDB database | Production, team lớn |
| `MEMORY` | Lưu tạm trong RAM | Testing, dev nhanh |

### Bước 4: Cài đặt Frontend (Client)

```bash
cd ../client
npm install
```

> 💡 Nếu gặp lỗi `ERESOLVE` khi cài đặt, hãy chạy: `npm install --legacy-peer-deps`

---

## 🚀 Cách chạy ứng dụng

### Chạy Full-Stack (Backend + Frontend)

Bạn cần mở **2 cửa sổ Terminal** riêng biệt:

**Terminal 1 — Chạy Backend:**

```bash
cd Server
npm run dev
```

Khi thấy dòng `Server is running on port 5000` là Backend đã sẵn sàng.

**Terminal 2 — Chạy Frontend:**

```bash
cd client
npm run dev
```

Khi thấy dòng `Local: http://localhost:5173/` là Frontend đã sẵn sàng.

**Vậy là xong! 🎉** Mở trình duyệt và truy cập: **http://localhost:5173**

---

### Chạy chỉ Backend (API mode)

Nếu bạn chỉ muốn test API mà không cần giao diện:

```bash
cd Server
npm run dev
```

Sau đó dùng **Postman**, **Thunder Client**, hoặc **curl** để gọi API tại `http://localhost:5000`.

---

### Chạy bằng CLI (Command Line Interface)

Ứng dụng cũng hỗ trợ thao tác trực tiếp từ dòng lệnh:

```bash
cd Server

# Tạo Note mới
npm run dev note create "Tiêu đề" "Nội dung chi tiết" "tag1,tag2,tag3" "email@gmail.com"

# Xem danh sách tất cả Note
npm run dev note read

# Cập nhật Note (cần có ID)
npm run dev note update <id> "Tiêu đề mới" "Nội dung mới" "tag1,tag2" "email@gmail.com"

# Xóa Note (cần có ID)
npm run dev note delete <id>
```

---

## 🌐 API Reference

Base URL: `http://localhost:5000`

### Notes API

| Method | Endpoint | Mô tả | Body/Params |
|---|---|---|---|
| `GET` | `/notes` | Lấy danh sách note (có phân trang) | Query: `?limit=10&page=1&tag=CRM` |
| `GET` | `/notes/:id` | Lấy chi tiết 1 note | Params: `id` |
| `POST` | `/notes` | Tạo note mới | Body: `{ title, content, tags, reporter }` |
| `PUT` | `/notes/:id` | Cập nhật note | Body: `{ title, content, tags, reporter }` |
| `DELETE` | `/notes/:id` | Xóa note | Params: `id` |

### Ví dụ Request/Response

**Tạo Note mới:**

```bash
curl -X POST http://localhost:5000/notes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Lỗi Enroll học viên",
    "content": "Học viên không thể enroll vào lớp do chưa phân bổ học phí",
    "tags": ["CRM", "LMS", "Enroll"],
    "reporter": "phucdt01@gmail.com"
  }'
```

**Response:**

```json
{
  "id": "c76540c1-dfce-4ce4-802c-71a64910c0c9",
  "title": "Lỗi Enroll học viên",
  "content": "Học viên không thể enroll vào lớp do chưa phân bổ học phí",
  "tags": ["CRM", "LMS", "Enroll"],
  "reporter": "phucdt01@gmail.com",
  "createdAt": "2026-04-03T04:16:23.686Z",
  "updateAt": "2026-04-03T04:16:23.686Z"
}
```

**Lấy danh sách có phân trang + lọc tag:**

```bash
curl "http://localhost:5000/notes?limit=5&page=1&tag=CRM"
```

**Response:**

```json
{
  "data": [ ... ],
  "total": 12,
  "skip": 0,
  "limit": 5
}
```

### Validation Rules

Dữ liệu gửi lên sẽ được validate tự động bởi **Zod**:

| Field | Quy tắc |
|---|---|
| `title` | Bắt buộc, 1–100 ký tự |
| `content` | Bắt buộc, tối thiểu 1 ký tự |
| `tags` | Mảng string, tối đa 3 tags, mỗi tag tối thiểu 3 ký tự |
| `reporter` | Email hợp lệ (tùy chọn) |

Nếu dữ liệu không hợp lệ, API sẽ trả về:

```json
{
  "success": false,
  "error": "Validation Error",
  "details": ["Title is required", "..."]
}
```

---

## 🎨 Frontend (Client) — Hướng dẫn chi tiết

### Tổng quan giao diện

Frontend được xây dựng bằng **React 18 + TypeScript + Vite**, thiết kế theo phong cách **Dark Mode + Glassmorphism** sử dụng font **Outfit** từ Google Fonts. Giao diện giao tiếp với Backend thông qua thư viện **Axios**.

### Các trang (Pages)

| Trang | URL | Mô tả |
|---|---|---|
| **Dashboard** | `/` | Trang chính — Hiển thị danh sách Note dạng lưới (Grid), hỗ trợ tìm kiếm theo Tag |
| **Create Note** | `/new` | Form tạo Note mới với 4 trường: Reporter Email, Title, Tags, Content |
| **Edit Note** | `/edit/:id` | Form chỉnh sửa Note — Tự động load dữ liệu cũ lên form |
| **Allocation** | `/allocation` | Trang quản lý phân bổ *(đang phát triển)* |

### Các Component

| Component | File | Vai trò |
|---|---|---|
| `App` | `src/App.tsx` | Layout chính + Navbar + Router |
| `Dashboard` | `src/pages/Dashboard.tsx` | Trang danh sách Note + Search bar |
| `NoteForm` | `src/pages/NoteForm.tsx` | Form tạo/sửa Note |
| `NoteCard` | `src/components/NoteCard.tsx` | Thẻ hiển thị 1 Note (title, content, tags, reporter, ngày tạo) |

### API Client

File `src/api/client.ts` chứa toàn bộ logic giao tiếp giữa Frontend và Backend:

```typescript
// Base URL mặc định trỏ về Backend
const apiClient = axios.create({
    baseURL: 'http://localhost:5000'
});

// Các hàm gọi API
notesApi.getAll({ page, limit, tag })  // GET /notes
notesApi.create({ title, content, tags, reporter })  // POST /notes
notesApi.update(id, { title, content, tags, reporter })  // PUT /notes/:id
notesApi.delete(id)  // DELETE /notes/:id
```

> ⚠️ **Nếu Backend chạy ở port khác 5000**, bạn cần sửa `baseURL` trong file `client/src/api/client.ts`.

### Cách sử dụng từng tính năng trên giao diện

#### 1. Xem danh sách Note

- Mở trình duyệt truy cập `http://localhost:5173`
- Trang Dashboard sẽ tự động tải tất cả Note từ Backend
- Mỗi Note hiển thị: **Tiêu đề**, **Nội dung** (tối đa 3 dòng), **Tags** (dạng badge), **Reporter**, **Ngày tạo**

#### 2. Tìm kiếm / Lọc Note theo Tag

- Trên Dashboard, gõ tên tag vào ô **"Search by tag"** (ví dụ: `CRM`, `LMS`)
- Hệ thống sẽ tự động lọc sau 300ms (debounce) — không cần bấm nút Search
- Xóa trắng ô tìm kiếm để quay lại xem tất cả Note

#### 3. Tạo Note mới

1. Bấm nút **"New Note"** trên thanh Navbar (góc phải trên)
2. Điền các trường:
   - **Reporter Email**: Email của người ghi chú (bắt buộc, phải đúng định dạng email)
   - **Title**: Tiêu đề ghi chú (bắt buộc, tối thiểu 3 ký tự)
   - **Tags**: Nhập các tag cách nhau bằng dấu phẩy, ví dụ: `CRM, LMS, Enroll` (tối đa 3 tags)
   - **Content**: Nội dung chi tiết (bắt buộc, tối thiểu 10 ký tự)
3. Bấm **"Save Note"** → Hệ thống lưu và quay về trang Dashboard

#### 4. Chỉnh sửa Note

1. Trên Dashboard, bấm biểu tượng **✏️ (bút chì)** ở góc phải trên của Note muốn sửa
2. Form sẽ mở lên với dữ liệu cũ đã được điền sẵn
3. Chỉnh sửa các trường cần thiết
4. Bấm **"Update Note"** → Lưu và quay về Dashboard

#### 5. Xóa Note

1. Trên Dashboard, bấm biểu tượng **🗑️ (thùng rác)** ở góc phải trên của Note
2. Hộp thoại xác nhận sẽ hiện lên: *"Are you sure you want to delete this note?"*
3. Bấm **OK** để xóa hoặc **Cancel** để hủy

### Tùy chỉnh giao diện (Customization)

Toàn bộ thiết kế nằm trong file `client/src/index.css`. Bạn có thể tùy chỉnh:

```css
/* Đổi bảng màu — sửa các biến CSS trong :root */
:root {
  --bg-primary: #0f172a;      /* Màu nền chính */
  --bg-secondary: #1e293b;    /* Màu nền phụ */
  --text-primary: #f8fafc;    /* Màu chữ chính */
  --text-secondary: #94a3b8;  /* Màu chữ phụ */
  --accent: #3b82f6;          /* Màu nhấn (nút, link) */
  --accent-hover: #60a5fa;    /* Màu nhấn khi hover */
  --danger: #ef4444;           /* Màu cảnh báo (nút xóa) */
}
```

### Cấu trúc thư mục Frontend

```text
client/
├── index.html                # HTML template (entry point cho Vite)
├── vite.config.ts            # Cấu hình Vite build tool
├── tsconfig.json             # Cấu hình TypeScript
├── package.json              # Dependencies & scripts
└── src/
    ├── main.tsx              # Mount React vào DOM
    ├── App.tsx               # Layout + Router (Navbar, Routes)
    ├── index.css             # Global styles (Dark mode, Glassmorphism, layout)
    ├── api/
    │   └── client.ts         # Axios client + API functions + Note interface
    ├── components/
    │   └── NoteCard.tsx      # Component hiển thị 1 Note (card view)
    └── pages/
        ├── Dashboard.tsx     # Trang chính: danh sách Note + search bar
        └── NoteForm.tsx      # Form tạo/chỉnh sửa Note
```

---

## 📁 Cấu trúc dự án (Toàn bộ)

```text
HexagonArchitecturePractive/
├── Server/                          # Backend (Node.js + Express)
│   ├── src/
│   │   ├── domain/                  # 🟡 CORE — Entities & Value Objects
│   │   │   ├── entities/
│   │   │   │   └── Note.ts          # Entity chính của ứng dụng
│   │   │   └── value-object/
│   │   │       ├── Title.ts         # VO: Tiêu đề (3-100 ký tự)
│   │   │       ├── Content.ts       # VO: Nội dung (10+ ký tự)
│   │   │       ├── Email.ts         # VO: Email hợp lệ
│   │   │       └── NoteTag/
│   │   │           ├── Tag.ts       # VO: Một tag đơn lẻ
│   │   │           └── TagList.ts   # VO: Danh sách tags (max 3)
│   │   │
│   │   ├── application/             # 🟢 USE CASES — Logic nghiệp vụ
│   │   │   └── usecases/
│   │   │       ├── CreateNote.ts
│   │   │       ├── ReadListNote.ts  # Hỗ trợ phân trang & lọc tag
│   │   │       ├── ReadNote.ts      # Đọc chi tiết 1 note
│   │   │       ├── UpdateNote.ts
│   │   │       └── DeleteNote.ts
│   │   │
│   │   ├── ports/                   # 🔵 PORTS — Interfaces (Cổng giao tiếp)
│   │   │   ├── inbound/usecases/    # Interfaces cho Use Cases
│   │   │   └── outbound/repositories/  # Interface cho Repository
│   │   │
│   │   ├── adapters/                # 🟣 ADAPTERS — Triển khai cụ thể
│   │   │   ├── primary/controllers/ # Đầu vào (Inbound)
│   │   │   │   ├── http/            # REST API (Express)
│   │   │   │   │   ├── NoteController.ts
│   │   │   │   │   ├── NoteRoutes.ts
│   │   │   │   │   ├── middlewares/
│   │   │   │   │   │   ├── ErrorHandler.ts       # Global error handler
│   │   │   │   │   │   └── ValidationMiddleware.ts # Zod validation
│   │   │   │   │   └── validators/
│   │   │   │   │       └── NoteValidator.ts      # Zod schemas
│   │   │   │   └── CLI/
│   │   │   │       └── NoteComand.ts             # CLI adapter
│   │   │   └── secondary/persistence/ # Đầu ra (Outbound)
│   │   │       ├── MongoDBNoteRepository.ts
│   │   │       ├── JsonNoteRepository.ts
│   │   │       ├── InMemoryNoteRepository.ts
│   │   │       └── mappers/         # Data mappers
│   │   │
│   │   ├── app.ts                   # 🏭 Composition Root (Lắp ráp DI)
│   │   └── index.ts                 # Entry point
│   │
│   ├── data.json                    # File lưu trữ dữ liệu (cho mode JSON)
│   ├── .env                         # Biến môi trường (KHÔNG commit lên Git)
│   └── package.json
│
├── client/                          # Frontend (React + Vite)
│   ├── src/
│   │   ├── api/
│   │   │   └── client.ts            # Axios API client
│   │   ├── components/
│   │   │   └── NoteCard.tsx          # Component hiển thị note
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx         # Trang chính: danh sách + tìm kiếm
│   │   │   └── NoteForm.tsx          # Form tạo/sửa note
│   │   ├── App.tsx                   # Router & Layout
│   │   ├── main.tsx                  # Entry point
│   │   └── index.css                 # Global styles (Dark mode, Glassmorphism)
│   │
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
└── README.md                        # 📖 File này
```

---

## 🏛️ Kiến trúc Hexagonal — Giải thích

```
                    ┌─────────────────────────────────────────┐
                    │              ADAPTERS (Bên ngoài)        │
                    │                                         │
  Người dùng ──►    │   ┌─────────┐      ┌──────────────┐    │
  (Browser/CLI)     │   │ HTTP API │      │  CLI Command │    │
                    │   │(Express) │      │  (Terminal)  │    │
                    │   └────┬─────┘      └──────┬───────┘    │
                    │        │     PORTS          │            │
                    │   ┌────▼─────────────────────▼───┐      │
                    │   │     Use Case Interfaces       │      │
                    │   │   (CreateNote, ReadNote...)    │      │
                    │   └────┬──────────────────────────┘      │
                    │        │                                 │
                    │   ┌────▼──────────────────────────┐      │
                    │   │     APPLICATION CORE           │      │
                    │   │   (Use Cases + Domain Logic)   │      │
                    │   └────┬──────────────────────────┘      │
                    │        │     PORTS                       │
                    │   ┌────▼──────────────────────────┐      │
                    │   │   Repository Interface         │      │
                    │   │   (NoteRepository)             │      │
                    │   └────┬────────┬────────┬────────┘      │
                    │        │        │        │               │
                    │   ┌────▼──┐ ┌───▼───┐ ┌──▼─────┐       │
                    │   │MongoDB│ │ JSON  │ │In-Mem  │       │
                    │   │ Repo  │ │ Repo  │ │ Repo   │       │
                    │   └───────┘ └───────┘ └────────┘       │
                    └─────────────────────────────────────────┘
```

### Tại sao dùng Kiến trúc này?

1. **Dễ kiểm thử (Testability):** Viết Unit Test cho logic Note mà không cần kết nối Database thật — chỉ cần dùng `InMemoryNoteRepository`.
2. **Linh hoạt (Flexibility):** Chuyển từ JSON sang MongoDB chỉ mất 1 giây — đổi `REPO_TYPE` trong `.env`.
3. **Phân tách trách nhiệm:** Logic nghiệp vụ không bị "dính" vào Framework (Express) hay Database (MongoDB).
4. **Dễ mở rộng:** Thêm adapter mới (ví dụ: PostgreSQL, GraphQL) mà không cần sửa core logic.

---

## ❓ Xử lý sự cố thường gặp (Troubleshooting)

### 1. Frontend không load được dữ liệu (CORS Error)

**Triệu chứng:** Mở trình duyệt thấy trang trắng hoặc Console báo `Access-Control-Allow-Origin`.

**Nguyên nhân:** Backend chưa được khởi động, hoặc đang chạy code cũ chưa có CORS.

**Giải pháp:**
```bash
# Tắt Backend đang chạy (Ctrl + C)
# Khởi động lại
cd Server
npm run dev
```

### 2. Lỗi `Cannot find module ...` khi chạy Backend

**Nguyên nhân:** Chưa cài dependencies.

**Giải pháp:**
```bash
cd Server
npm install
```

### 3. Lỗi `ERESOLVE` khi cài Frontend

**Giải pháp:**
```bash
cd client
npm install --legacy-peer-deps
```

### 4. Lỗi kết nối MongoDB

**Nguyên nhân:** MongoDB chưa được khởi động, hoặc `MONGODB_URI` trong `.env` sai.

**Giải pháp:**
- Đảm bảo MongoDB đang chạy: `mongod --dbpath /path/to/data`
- Hoặc đổi sang chế độ JSON: sửa `REPO_TYPE=JSON` trong file `.env`

### 5. Port đã bị chiếm

**Giải pháp:** Đổi port trong file `.env`:
```env
PORT=3000
```
Và cập nhật `baseURL` trong `client/src/api/client.ts`:
```typescript
baseURL: 'http://localhost:3000'
```

---

## 🤝 Đóng góp (Contributing)

1. Fork dự án
2. Tạo branch mới: `git checkout -b feature/ten-tinh-nang`
3. Commit: `git commit -m "feat: mô tả tính năng"`
4. Push: `git push origin feature/ten-tinh-nang`
5. Tạo Pull Request

---

## 📝 License

Dự án này được phát triển cho mục đích học tập và thực hành Hexagonal Architecture.
