-- Dữ liệu mẫu cho Warehouse Management System

USE warehouse_db;

-- Xóa dữ liệu cũ (nếu có)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE transactions;
TRUNCATE TABLE material_requests;
TRUNCATE TABLE materials;
TRUNCATE TABLE suppliers;
TRUNCATE TABLE employees;
SET FOREIGN_KEY_CHECKS = 1;

-- Thêm dữ liệu mẫu cho Employees
-- Password: "password123" (plain text - không mã hóa)
INSERT INTO employees (username, password, full_name, email, phone, role, active, created_at, updated_at) VALUES
('admin', 'password123', 'Quản trị viên', 'admin@warehouse.com', '0901234567', 'ADMIN', TRUE, NOW(), NOW()),
('nhanvien1', 'password123', 'Nguyễn Văn An', 'nvan.an@warehouse.com', '0902345678', 'WAREHOUSE_STAFF', TRUE, NOW(), NOW()),
('nhanvien2', 'password123', 'Trần Thị Bình', 'tthi.binh@warehouse.com', '0903456789', 'WAREHOUSE_STAFF', TRUE, NOW(), NOW()),
('bep1', 'password123', 'Lê Văn Chính', 'lvan.chinh@warehouse.com', '0904567890', 'KITCHEN_STAFF', TRUE, NOW(), NOW());

-- Thêm dữ liệu mẫu cho Suppliers
INSERT INTO suppliers (code, name, contact_person, phone, email, address, tax_code, note, active, created_at, updated_at) VALUES
('SUP-20241103-0001', 'Công ty TNHH Thực phẩm An Khang', 'Nguyễn Văn A', '0281234567', 'contact@ankhang.com', '123 Nguyễn Huệ, Q.1, TP.HCM', '0123456789', 'Nhà cung cấp uy tín', TRUE, NOW(), NOW()),
('SUP-20241103-0002', 'Công ty CP Rau quả Đà Lạt', 'Trần Thị B', '0282345678', 'info@dalat-veggie.com', '456 Lê Lợi, TP. Đà Lạt', '0987654321', 'Rau quả sạch', TRUE, NOW(), NOW()),
('SUP-20241103-0003', 'Cửa hàng Thịt tươi Sài Gòn', 'Phạm Văn C', '0283456789', 'saigonmeat@gmail.com', '789 Võ Văn Tần, Q.3, TP.HCM', '0112233445', 'Thịt tươi hàng ngày', TRUE, NOW(), NOW());

-- Thêm dữ liệu mẫu cho Materials
INSERT INTO materials (code, name, description, quantity, unit, min_quantity, unit_price, expiry_date, supplier_id, status, created_at, updated_at) VALUES
('MAT-001', 'Gạo ST25', 'Gạo thơm đặc sản', 100.00, 'kg', 20.00, 25000, '2025-12-31', 1, 'AVAILABLE', NOW(), NOW()),
('MAT-002', 'Thịt heo ba chỉ', 'Thịt heo tươi', 15.00, 'kg', 10.00, 120000, '2024-11-10', 3, 'LOW_STOCK', NOW(), NOW()),
('MAT-003', 'Cá hồi Na Uy', 'Cá hồi nhập khẩu', 8.00, 'kg', 5.00, 350000, '2024-11-08', 1, 'AVAILABLE', NOW(), NOW()),
('MAT-004', 'Rau cải xanh', 'Rau cải sạch Đà Lạt', 25.00, 'kg', 10.00, 15000, '2024-11-06', 2, 'AVAILABLE', NOW(), NOW()),
('MAT-005', 'Cà chua', 'Cà chua tươi', 30.00, 'kg', 15.00, 20000, '2024-11-09', 2, 'AVAILABLE', NOW(), NOW()),
('MAT-006', 'Hành tây', 'Hành tây Đà Lạt', 40.00, 'kg', 20.00, 25000, '2025-01-15', 2, 'AVAILABLE', NOW(), NOW()),
('MAT-007', 'Tỏi', 'Tỏi Lý Sơn', 12.00, 'kg', 8.00, 80000, '2025-02-20', 2, 'AVAILABLE', NOW(), NOW()),
('MAT-008', 'Dầu ăn', 'Dầu ăn Nepture', 50.00, 'lít', 20.00, 45000, '2025-06-30', 1, 'AVAILABLE', NOW(), NOW()),
('MAT-009', 'Nước mắm', 'Nước mắm Phú Quốc', 20.00, 'lít', 10.00, 55000, '2025-08-15', 1, 'AVAILABLE', NOW(), NOW()),
('MAT-010', 'Đường trắng', 'Đường tinh luyện', 5.00, 'kg', 15.00, 18000, '2025-12-31', 1, 'OUT_OF_STOCK', NOW(), NOW());

-- Thêm dữ liệu mẫu cho Material Requests
INSERT INTO material_requests (request_code, material_id, requested_quantity, unit, requester_id, approver_id, status, reason, note, approved_at, created_at, updated_at) VALUES
('REQ-20241103100000', 2, 20.00, 'kg', 4, 2, 'APPROVED', 'Cần bổ sung cho thực đơn tuần sau', 'Đã phê duyệt', NOW(), NOW(), NOW()),
('REQ-20241103110000', 10, 30.00, 'kg', 4, NULL, 'PENDING', 'Hết đường để làm món tráng miệng', NULL, NULL, NOW(), NOW()),
('REQ-20241103120000', 3, 10.00, 'kg', 4, 2, 'COMPLETED', 'Món đặc biệt cuối tuần', 'Đã xuất kho', NOW(), NOW(), NOW());

-- Thêm dữ liệu mẫu cho Transactions
INSERT INTO transactions (transaction_code, material_id, type, quantity, unit, unit_price, total_price, supplier_id, employee_id, request_id, note, transaction_date, created_at) VALUES
('IMP-20241101080000', 1, 'IMPORT', 50.00, 'kg', 25000, 1250000, 1, 2, NULL, 'Nhập kho đầu tháng', '2024-11-01 08:00:00', NOW()),
('IMP-20241101090000', 2, 'IMPORT', 30.00, 'kg', 120000, 3600000, 3, 2, NULL, 'Nhập thịt tươi', '2024-11-01 09:00:00', NOW()),
('EXP-20241102100000', 1, 'EXPORT', 10.00, 'kg', 25000, 250000, NULL, 2, NULL, 'Xuất cho bếp', '2024-11-02 10:00:00', NOW()),
('EXP-20241102110000', 2, 'EXPORT', 5.00, 'kg', 120000, 600000, NULL, 2, 1, 'Xuất theo yêu cầu REQ-20241103100000', '2024-11-02 11:00:00', NOW()),
('IMP-20241103080000', 3, 'IMPORT', 15.00, 'kg', 350000, 5250000, 1, 2, NULL, 'Nhập cá hồi tươi', '2024-11-03 08:00:00', NOW()),
('EXP-20241103140000', 3, 'EXPORT', 7.00, 'kg', 350000, 2450000, NULL, 2, 3, 'Xuất theo yêu cầu REQ-20241103120000', '2024-11-03 14:00:00', NOW());

-- Hiển thị thông báo hoàn thành
SELECT 'Dữ liệu mẫu đã được thêm thành công!' AS Message;

-- Hiển thị thống kê
SELECT 'Employees' AS Table_Name, COUNT(*) AS Total FROM employees
UNION ALL
SELECT 'Suppliers', COUNT(*) FROM suppliers
UNION ALL
SELECT 'Materials', COUNT(*) FROM materials
UNION ALL
SELECT 'Material Requests', COUNT(*) FROM material_requests
UNION ALL
SELECT 'Transactions', COUNT(*) FROM transactions;
