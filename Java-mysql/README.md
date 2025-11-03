# 🏭 Warehouse Management System

Hệ thống quản lý kho cho nhà hàng được phát triển bằng Spring Boot và MySQL.

## 📋 Mục lục

- [Tính năng](#tính-năng)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Cài đặt và chạy](#cài-đặt-và-chạy)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Tài khoản mẫu](#tài-khoản-mẫu)

## ✨ Tính năng

### 5.1 Xác thực (Authentication)
- ✅ Đăng nhập / Đăng xuất
- ✅ JWT Token authentication
- ✅ Spring Security với role-based authorization

### 5.2 Quản lý nguyên liệu
- ✅ Xem danh sách nguyên liệu tồn kho
- ✅ Tìm kiếm nguyên liệu
- ✅ Xem chi tiết nguyên liệu

### 5.3 Nhập kho
- ✅ Nhập nguyên liệu mới
- ✅ Cập nhật số lượng, đơn giá, hạn sử dụng
- ✅ Ghi nhận nhà cung cấp

### 5.4 Xuất kho
- ✅ Xuất nguyên liệu cho bếp
- ✅ Liên kết với phiếu yêu cầu
- ✅ Kiểm tra tồn kho trước khi xuất

### 5.5 Cảnh báo
- ✅ Cảnh báo tồn kho thấp
- ✅ Cảnh báo nguyên liệu sắp hết hạn
- ✅ Cảnh báo nguyên liệu đã hết hạn

### 5.6 Quản lý yêu cầu bổ sung
- ✅ Tạo yêu cầu bổ sung nguyên liệu
- ✅ Phê duyệt / Từ chối yêu cầu
- ✅ Xem danh sách yêu cầu chờ xử lý

### 5.7 Quản lý nhà cung cấp
- ✅ Thêm, sửa, xóa nhà cung cấp
- ✅ Tìm kiếm nhà cung cấp
- ✅ Quản lý thông tin liên hệ

### 5.8 Lịch sử giao dịch
- ✅ Xem lịch sử nhập - xuất kho
- ✅ Lọc theo thời gian
- ✅ Xem chi tiết từng giao dịch

## 🛠️ Công nghệ sử dụng

- **Backend Framework**: Spring Boot 3.2.0
- **Database**: MySQL 8.0
- **ORM**: Spring Data JPA / Hibernate
- **Security**: Spring Security + JWT
- **Build Tool**: Maven
- **Container**: Docker & Docker Compose
- **Java Version**: 17

## 📁 Cấu trúc dự án

```
warehouse-management/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/warehouse/
│   │   │       ├── controller/          # REST Controllers
│   │   │       │   ├── AuthController.java
│   │   │       │   ├── MaterialController.java
│   │   │       │   ├── TransactionController.java
│   │   │       │   ├── MaterialRequestController.java
│   │   │       │   └── SupplierController.java
│   │   │       ├── service/             # Business Logic
│   │   │       │   ├── AuthService.java
│   │   │       │   ├── MaterialService.java
│   │   │       │   ├── TransactionService.java
│   │   │       │   ├── MaterialRequestService.java
│   │   │       │   └── SupplierService.java
│   │   │       ├── repository/          # JPA Repositories
│   │   │       │   ├── EmployeeRepository.java
│   │   │       │   ├── MaterialRepository.java
│   │   │       │   ├── TransactionRepository.java
│   │   │       │   ├── MaterialRequestRepository.java
│   │   │       │   └── SupplierRepository.java
│   │   │       ├── entity/              # JPA Entities
│   │   │       │   ├── Employee.java
│   │   │       │   ├── Material.java
│   │   │       │   ├── Transaction.java
│   │   │       │   ├── MaterialRequest.java
│   │   │       │   └── Supplier.java
│   │   │       ├── dto/                 # Data Transfer Objects
│   │   │       │   ├── request/
│   │   │       │   └── response/
│   │   │       ├── security/            # Security Configuration
│   │   │       │   ├── JwtTokenProvider.java
│   │   │       │   ├── JwtAuthenticationFilter.java
│   │   │       │   ├── CustomUserDetailsService.java
│   │   │       │   ├── SecurityConfig.java
│   │   │       │   └── JwtAuthenticationEntryPoint.java
│   │   │       └── WarehouseManagementApplication.java
│   │   └── resources/
│   │       ├── application.yml          # Application Configuration
│   │       ├── schema.sql               # Database Schema
│   │       └── data.sql                 # Sample Data
│   └── test/
├── Dockerfile                           # Docker build file
├── docker-compose.yml                   # Docker Compose configuration
├── pom.xml                              # Maven configuration
└── README.md                            # This file
```

## 🚀 Cài đặt và chạy

### Yêu cầu hệ thống

- Java JDK 17 trở lên
- Maven 3.6+
- MySQL 8.0+
- Docker & Docker Compose (tùy chọn)

### Cách 1: Chạy với Docker (Khuyến nghị) 🐳

1. **Clone repository**
```bash
git clone <repository-url>
cd warehouse-management
```

2. **Khởi động với Docker Compose**
```bash
docker-compose up -d
```

Lệnh này sẽ:
- Tự động tạo MySQL container
- Build và chạy Spring Boot application
- Khởi động phpMyAdmin (tùy chọn)
- Tự động import schema và dữ liệu mẫu

3. **Kiểm tra containers đang chạy**
```bash
docker-compose ps
```

4. **Xem logs**
```bash
# Xem tất cả logs
docker-compose logs -f

# Xem logs của app
docker-compose logs -f warehouse-app

# Xem logs của MySQL
docker-compose logs -f mysql
```

5. **Dừng containers**
```bash
docker-compose down
```

6. **Dừng và xóa volumes (reset database)**
```bash
docker-compose down -v
```

### Cách 2: Chạy local (Không dùng Docker)

1. **Cài đặt MySQL**
   - Download và cài đặt MySQL 8.0
   - Tạo database:
   ```sql
   CREATE DATABASE warehouse_db;
   ```

2. **Cấu hình database**
   
   Mở file `src/main/resources/application.yml` và cập nhật thông tin:
   ```yaml
   spring:
     datasource:
       url: jdbc:mysql://localhost:3306/warehouse_db
       username: root
       password: your_password
   ```

3. **Build project**
```bash
mvn clean install
```

4. **Chạy application**
```bash
mvn spring-boot:run
```

Hoặc:
```bash
java -jar target/warehouse-management-1.0.0.jar
```

### Truy cập ứng dụng

- **API Base URL**: http://localhost:8080
- **phpMyAdmin**: http://localhost:8081 (nếu dùng Docker)
  - Username: root
  - Password: root

## 📚 API Endpoints

### Authentication APIs

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/login` | Đăng nhập | ❌ |
| POST | `/api/auth/logout` | Đăng xuất | ✅ |

### Material APIs

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/materials` | Lấy danh sách nguyên liệu | ✅ |
| GET | `/api/materials/{id}` | Xem chi tiết nguyên liệu | ✅ |
| GET | `/api/materials/search?name={name}` | Tìm kiếm nguyên liệu | ✅ |
| GET | `/api/materials/warning` | Lấy cảnh báo tồn kho | ✅ |

### Transaction APIs

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/materials/import` | Nhập kho | ✅ |
| POST | `/api/materials/export` | Xuất kho | ✅ |
| GET | `/api/transactions` | Xem lịch sử giao dịch | ✅ |
| GET | `/api/transactions/material/{id}` | Lịch sử theo nguyên liệu | ✅ |

### Request APIs

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/requests` | Xem danh sách yêu cầu | ✅ |
| GET | `/api/requests/pending` | Yêu cầu chờ xử lý | ✅ |
| GET | `/api/requests/{id}` | Chi tiết yêu cầu | ✅ |
| POST | `/api/requests` | Tạo yêu cầu mới | ✅ |
| PUT | `/api/requests/{id}/approve` | Phê duyệt yêu cầu | ✅ |
| PUT | `/api/requests/{id}/reject` | Từ chối yêu cầu | ✅ |

### Supplier APIs

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/suppliers` | Danh sách nhà cung cấp | ✅ |
| GET | `/api/suppliers/{id}` | Chi tiết nhà cung cấp | ✅ |
| GET | `/api/suppliers/search?name={name}` | Tìm kiếm nhà cung cấp | ✅ |
| POST | `/api/suppliers` | Thêm nhà cung cấp | ✅ |
| PUT | `/api/suppliers/{id}` | Cập nhật nhà cung cấp | ✅ |
| DELETE | `/api/suppliers/{id}` | Xóa nhà cung cấp | ✅ |

### Ví dụ cách gọi API

#### 1. Đăng nhập

**Request:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "type": "Bearer",
    "id": 1,
    "username": "admin",
    "fullName": "Quản trị viên",
    "email": "admin@warehouse.com",
    "role": "ADMIN"
  },
  "timestamp": "2024-11-03T10:30:00"
}
```

#### 2. Lấy danh sách nguyên liệu

**Request:**
```bash
curl -X GET http://localhost:8080/api/materials \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 3. Nhập kho

**Request:**
```bash
curl -X POST http://localhost:8080/api/materials/import \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "materialId": 1,
    "quantity": 50,
    "unit": "kg",
    "unitPrice": 25000,
    "supplierId": 1,
    "expiryDate": "2025-12-31",
    "note": "Nhập kho đầu tháng"
  }'
```

#### 4. Xuất kho

**Request:**
```bash
curl -X POST http://localhost:8080/api/materials/export \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "materialId": 1,
    "quantity": 10,
    "requestId": 1,
    "note": "Xuất cho bếp"
  }'
```

#### 5. Lấy cảnh báo tồn kho

**Request:**
```bash
curl -X GET http://localhost:8080/api/materials/warning \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🗄️ Database Schema

### Bảng Employees (Nhân viên)
- `id` (PK)
- `username` (Unique)
- `password` (Encrypted)
- `full_name`
- `email` (Unique)
- `phone`
- `role` (ADMIN, WAREHOUSE_STAFF, KITCHEN_STAFF)
- `active`
- `created_at`, `updated_at`

### Bảng Suppliers (Nhà cung cấp)
- `id` (PK)
- `code` (Unique)
- `name`
- `contact_person`
- `phone`, `email`
- `address`, `tax_code`
- `note`
- `active`
- `created_at`, `updated_at`

### Bảng Materials (Nguyên liệu)
- `id` (PK)
- `code` (Unique)
- `name`, `description`
- `quantity`, `unit`
- `min_quantity` (Ngưỡng cảnh báo)
- `unit_price`
- `expiry_date`
- `supplier_id` (FK)
- `status` (AVAILABLE, LOW_STOCK, OUT_OF_STOCK, EXPIRED)
- `created_at`, `updated_at`

### Bảng Material Requests (Yêu cầu bổ sung)
- `id` (PK)
- `request_code` (Unique)
- `material_id` (FK)
- `requested_quantity`, `unit`
- `requester_id` (FK - Employee)
- `approver_id` (FK - Employee)
- `status` (PENDING, APPROVED, REJECTED, COMPLETED)
- `reason`, `note`
- `approved_at`
- `created_at`, `updated_at`

### Bảng Transactions (Giao dịch)
- `id` (PK)
- `transaction_code` (Unique)
- `material_id` (FK)
- `type` (IMPORT, EXPORT)
- `quantity`, `unit`
- `unit_price`, `total_price`
- `supplier_id` (FK)
- `employee_id` (FK)
- `request_id` (FK)
- `note`
- `transaction_date`
- `created_at`

### Mối quan hệ (Relationships)
```
Suppliers 1----* Materials
Employees 1----* Transactions
Employees 1----* MaterialRequests (as requester)
Employees 1----* MaterialRequests (as approver)
Materials 1----* Transactions
Materials 1----* MaterialRequests
MaterialRequests 1----* Transactions
```

## 👥 Tài khoản mẫu

| Username | Password | Role | Mô tả |
|----------|----------|------|-------|
| admin | password123 | ADMIN | Quản trị viên |
| nhanvien1 | password123 | WAREHOUSE_STAFF | Nhân viên kho 1 |
| nhanvien2 | password123 | WAREHOUSE_STAFF | Nhân viên kho 2 |
| bep1 | password123 | KITCHEN_STAFF | Nhân viên bếp |

## 🔐 Security

- **Password Encryption**: BCrypt
- **Token-based Authentication**: JWT
- **Token Expiration**: 24 hours
- **Role-based Authorization**: ADMIN, WAREHOUSE_STAFF, KITCHEN_STAFF

### Phân quyền (Roles)

**ADMIN:**
- Full access tất cả chức năng

**WAREHOUSE_STAFF:**
- Xem danh sách nguyên liệu
- Nhập / Xuất kho
- Phê duyệt yêu cầu bổ sung
- Quản lý nhà cung cấp
- Xem lịch sử giao dịch

**KITCHEN_STAFF:**
- Xem danh sách nguyên liệu
- Tạo yêu cầu bổ sung

## 🧪 Testing

### Test với Postman

1. Import Postman collection (nếu có)
2. Set biến môi trường:
   - `base_url`: http://localhost:8080
   - `token`: (JWT token sau khi login)

### Manual Testing

1. Login để lấy token
2. Thêm token vào header: `Authorization: Bearer {token}`
3. Test các endpoints theo thứ tự:
   - Authentication
   - Materials
   - Import/Export
   - Requests
   - Suppliers

## 📝 Notes

- Database schema tự động tạo khi chạy application (ddl-auto: update)
- Dữ liệu mẫu tự động import từ `data.sql`
- JWT secret key nên thay đổi trong production
- Password mặc định: `password123` (đã mã hóa BCrypt)

## 🐛 Troubleshooting

### Lỗi kết nối MySQL
```
Error: Communications link failure
```
**Giải pháp:**
- Kiểm tra MySQL đã chạy chưa
- Kiểm tra username/password trong `application.yml`
- Kiểm tra port 3306 có bị chiếm không

### Lỗi JWT Token
```
Error: Unauthorized
```
**Giải pháp:**
- Kiểm tra token còn hạn không (24h)
- Kiểm tra header Authorization đúng format: `Bearer {token}`
- Login lại để lấy token mới

### Docker container không khởi động
```bash
# Xem logs chi tiết
docker-compose logs warehouse-app

# Restart containers
docker-compose restart

# Rebuild images
docker-compose up -d --build
```

## 📞 Support

Nếu có vấn đề, vui lòng:
1. Kiểm tra logs: `docker-compose logs -f`
2. Kiểm tra database: phpMyAdmin tại http://localhost:8081
3. Kiểm tra API health: http://localhost:8080/api/materials

## 📄 License

This project is licensed under the MIT License.

---

**Developed with ❤️ by Warehouse Management Team**
