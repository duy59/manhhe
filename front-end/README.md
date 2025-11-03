# 🏪 Hệ thống Quản lý Kho - Frontend

Frontend được xây dựng bằng **Next.js 15**, **JavaScript**, và **Tailwind CSS**.

## 🚀 Cài đặt và Chạy

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Cấu hình môi trường

File `.env.local` đã được tạo với cấu hình mặc định:

```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

Nếu backend chạy ở port khác, hãy thay đổi URL này.

### 3. Chạy ứng dụng

```bash
npm run dev
```

Mở trình duyệt và truy cập: **http://localhost:3000**

## 👤 Tài khoản Demo

Sử dụng các tài khoản sau để đăng nhập:

- **Admin**: `admin` / `admin123`
- **Warehouse Staff**: `warehouse1` / `warehouse123`
- **Kitchen Staff**: `kitchen1` / `kitchen123`

## 📁 Cấu trúc Project

```
front-end/
├── app/                      # Pages (App Router)
│   ├── page.js              # Trang chủ (redirect)
│   ├── login/               # Trang đăng nhập
│   ├── dashboard/           # Dashboard tổng quan
│   ├── materials/           # Quản lý nguyên liệu
│   ├── transactions/        # Nhập/Xuất kho
│   ├── requests/            # Yêu cầu bổ sung
│   └── suppliers/           # Quản lý nhà cung cấp
│
├── components/              # Components tái sử dụng
│   ├── Navbar.js           # Menu điều hướng
│   ├── Card.js             # Card container
│   ├── Button.js           # Button component
│   ├── Modal.js            # Modal dialog
│   └── Loading.js          # Loading spinner
│
├── utils/                   # Utilities
│   ├── api.js              # API calls
│   └── helpers.js          # Helper functions
│
└── .env.local              # Environment variables
```

## ✨ Tính năng

### 🔐 Authentication
- Đăng nhập với JWT token
- Auto-redirect khi chưa đăng nhập
- Phân quyền theo role

### 📊 Dashboard
- Thống kê tổng quan
- Cảnh báo tồn kho
- Thao tác nhanh

### 📦 Quản lý Nguyên liệu
- Xem danh sách
- Tìm kiếm, lọc
- Chi tiết nguyên liệu

### 🔄 Nhập/Xuất kho
- Nhập/Xuất nguyên liệu
- Lịch sử giao dịch

### 📝 Yêu cầu bổ sung
- Tạo yêu cầu
- Phê duyệt/Từ chối

### 🏢 Quản lý Nhà cung cấp
- CRUD nhà cung cấp
- Tìm kiếm

## 🎨 UI/UX

- Giao diện đơn giản với Tailwind CSS
- Responsive design
- Icons trực quan
- Màu sắc phân biệt trạng thái

## 🔑 Phân quyền

| Chức năng | Admin | Warehouse | Kitchen |
|-----------|-------|-----------|---------|
| Xem nguyên liệu | ✅ | ✅ | ✅ |
| Nhập/Xuất kho | ✅ | ✅ | ❌ |
| Tạo yêu cầu | ✅ | ❌ | ✅ |
| Duyệt yêu cầu | ✅ | ✅ | ❌ |
| Quản lý NCC | ✅ | ✅ | ❌ |

## 🛠️ Technologies

- Next.js 15 (App Router)
- JavaScript
- Tailwind CSS
- JWT Authentication

---

**Happy Coding! 🎉**
