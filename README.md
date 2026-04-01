# 📓 Hexagonal Note System (TypeScript)

Một ứng dụng quản lý ghi chú (Note-taking) được xây dựng theo **Kiến trúc Lục giác (Hexagonal Architecture)** hay còn gọi là **Ports & Adapters**, tập trung vào tính linh hoạt, dễ kiểm thử và khả năng bảo trì cao.

## ✨ Điểm nổi bật
- **Chuẩn Kiến Trúc Hexagonal**: Tách biệt hoàn toàn Logic Nghiệp vụ (Domain) khỏi Cơ sở hạ tầng (Database, UI).
- **Bộ nhớ linh hoạt (Swappable Storage)**: Dễ dàng hoán đổi giữa **MongoDB**, **JSON File**, hoặc **In-Memory** chỉ bằng một dòng cấu hình.
- **Đa giao diện (Multi-Interface)**: Hỗ trợ cả **REST API (Express)** và **CLI (Command Line)** trên cùng một lõi xử lý.
- **Domain Driven Design (DDD)**: Sử dụng **Value Objects** để đảm bảo tính toàn vẹn dữ liệu ngay từ tầng thấp nhất.

## 🛠️ Công nghệ sử dụng
- **Ngôn ngữ**: TypeScript
- **Runtime**: Node.js
- **Framework**: Express.js
- **Cơ sở dữ liệu**: MongoDB (Official Driver)
- **Công cụ phát triển**: `tsx`, `dotenv`

## ⚙️ Cài đặt & Cấu hình

1. **Cài đặt dependencies**:
```bash
npm install
```

2. **Cấu hình môi trường**:
- Từ file `.env.sample`, hãy tạo file `.env` của riêng bạn:
```bash
cp .env.sample .env
```
- Sau đó, hãy chỉnh sửa nội dung trong file `.env` (ví dụ: `MONGODB_URI`) cho phù hợp với máy của bạn.

3. **Ghi chú bảo mật**:
- Tuyệt đối **KHÔNG** commit file `.env` lên GitHub. Hãy đảm bảo file này đã được thêm vào `.gitignore`.

## 🚀 Cách chạy ứng dụng

### 1. Chạy Web Server (API)
```bash
npm run dev
```
Server sẽ mặc định chạy tại `http://localhost:5000`.

### 2. Chạy Giao diện dòng lệnh (CLI)
Sử dụng các lệnh sau trực tiếp từ Terminal:
- **Tạo Note**: `npm run dev note create "Tiêu đề" "Nội dung" "tag1,tag2" "email@gmail.com"`
- **Xem danh sách**: `npm run dev note read`
- **Cập nhật**: `npm run dev note update <id> "Tiêu đề mới" "Nội dung mới" "tags" "email"`
- **Xóa**: `npm run dev note delete <id>`

## 📁 Cấu trúc thư mục (Hexagonal Layers)

```text
src/
  ├── domain/           # Chứa các Thực thể (Entities) và Quy tắc nghiệp vụ (Value Objects)
  ├── application/      # Chứa các Quy trình xử lý (Use Cases)
  ├── ports/            # Chứa các "Cổng" (Interfaces) cho UseCase và Repository
  │     ├── usecases/   
  │     └── repositories/
  ├── adapters/         # Chứa các "Bộ chuyển đổi" thực hiện yêu cầu
  │     ├── controllers # Lối vào (Inbound): HTTP API, CLI
  │     └── persistence # Lối ra (Outbound): MongoDB, JSON, In-Memory
  ├── app.ts            # Composition Root (Nơi lắp ráp và khởi động ứng dụng)
  └── index.ts          # Điểm khởi chạy chính
```

## 🛡️ Tại sao dùng Kiến trúc này?
1. **Dễ kiểm thử (Testability)**: Bạn có thể viết Unit Test cho logic của Note mà không cần phải kết nối Database thật.
2. **Linh hoạt (Flexibility)**: Việc chuyển từ JSON sang MongoDB chỉ mất 1 giây (đổi biến môi trường).
3. **Phân tách trách nhiệm (Separation of Concerns)**: Logic nghiệp vụ không bị "dính" vào Framework (Express) hay Database (Mongo).
