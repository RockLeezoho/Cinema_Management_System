# 🎬 Cinema Management System

## Tổng Quan

Hệ thống quản lý rạp chiếu phim toàn diện với đầy đủ chức năng từ quản lý nội dung, bán vé, đến thanh toán trực tuyến. Xây dựng với **Spring Boot 3.4.5**, **Spring Data JPA**, **PostgreSQL** và tích hợp **VnPay Payment Gateway**.

## ✨ Điểm Nổi Bật

- ✅ **Hệ thống Booking vé** hoàn chỉnh với real-time seat status
- ✅ **Tích hợp VnPay** - xử lý giao dịch trực tuyến an toàn
- ✅ **JWT Authentication** - bảo mật REST API endpoints
- ✅ **Phân quyền User** - Admin dashboard + Customer portal riêng biệt
- ✅ **RESTful API** - 40+ endpoints cho toàn bộ chức năng
- ✅ **Kiến trúc 3-Layer** - API, Service, Repository (Clean Architecture)
- ✅ **Database Schema** - 11 bảng quan hệ được thiết kế tối ưu
- ✅ **File Upload** - Xử lý upload ảnh bộ phim, poster, avatar user

## 🎯 Chức Năng Chính

**Quản Lý Hệ Thống**: Rạp chiếu, Phòng chiếu, Ghế ngồi, Bộ phim, Xuất chiếu

**Quản Lý Bán Vé**: Loại vé, Hóa đơn, Booking vé, Trạng thái ghế real-time

**Thanh Toán**: Tích hợp VnPay, Phiếu giảm giá (Voucher), Hóa đơn điện tử

**Khác**: Quản lý Concession (bắp nước), Nhà cung cấp, Người dùng, Hệ thống thông báo

## 🛠 Công Nghệ & Công Cụ

| Lĩnh Vực | Công Nghệ |
|---------|-----------|
| **Backend** | Spring Boot 3.4.5, Spring Data JPA, Spring Security, Spring HATEOAS |
| **Database** | PostgreSQL 12+, Hibernate ORM |
| **Security** | JWT Token, Spring Security, Password Encryption (bcrypt) |
| **Frontend** | HTML5, CSS3, Bootstrap 5.3.3, Vanilla JavaScript, AJAX |
| **Build** | Maven, Java 21 |
| **Dev Tools** | Spring Boot DevTools, Lombok, SiteMesh, DisplayTag |
| **Payment** | VnPay (Sandbox & Production) |
| **Testing** | Spring Boot Test, Spring Security Test |

## 📁 Cấu Trúc Dự Án

```
src/main/java/com/javaweb/cinema/
├── api/              # Controllers, DTOs (43+ API endpoints)
├── service/          # Business Logic (17 services)
├── persistence/      # Entity Models & Repositories
├── config/           # Spring Configuration (Security, JWT, etc.)
├── filter/           # Authentication & CORS Filters
├── storage/          # File Upload Handler

src/main/resources/static/
├── admin/            # Admin Dashboard (8 modules)
└── customer/         # Customer Portal (5 modules)

database/
└── create_databases.sql  # SQL Schema (11 tables)
```

## 🔐 Bảo Mật

- JWT Token-based Authentication & Authorization
- Spring Security với phân quyền Role-based (Admin, Customer)
- Password Encryption (bcrypt)
- CORS Configuration cho cross-origin requests
- Input Validation & XSS Prevention
- Exception Handling toàn cầu

## 💾 Cơ Sở Dữ Liệu

**11 bảng chính**: users, cinemas, rooms, seats, movies, showtimes, tickets, invoices, vouchers, concessions, suppliers

**Đặc điểm**: Quan hệ 1-N/M-N tối ưu, constraint integrity, cascade delete, indexed queries

## 👥 Phân Quyền & Giao Diện

| Vai Trò | Chức Năng |
|--------|---------|
| **Admin** | Quản lý hoàn toàn hệ thống, rạp, phim, vé, hóa đơn, báo cáo |
| **Customer** | Xem phim, đặt vé, thanh toán, quản lý voucher, xem hóa đơn |

## 🚀 10 Tính Năng Nổi Bật

1. **Real-time Seat Status** - Ghế trống/đã đặt cập nhật tức thời
2. **VnPay Integration** - Thanh toán bảo mật, hỗ trợ sandbox & production
3. **JWT Security** - Stateless authentication, token-based API
4. **RESTful APIs** - 40+ endpoints, fully documented
5. **File Upload** - Upload ảnh bộ phim, poster, avatar tối ưu
6. **Booking System** - Đặt vé trực tuyến với kiểm tra trùng lặp
7. **Voucher System** - Tạo mã giảm giá, áp dụng linh hoạt
8. **Invoice Management** - Hóa đơn điện tử, lưu trữ database
9. **Search & Filter** - Tìm kiếm phim, xuất chiếu, người dùng
10. **Error Handling** - Exception handling toàn cầu, logging chi tiết

## 💡 Kỹ Năng Được Áp Dụng

**Backend Development**
- Spring Framework ecosystem (Boot, Data JPA, Security, HATEOAS)
- RESTful API design & implementation
- JWT authentication & authorization
- ORM & Database design (Hibernate, PostgreSQL)

**Security & Best Practices**
- Password hashing & encryption (bcrypt)
- CORS configuration
- Input validation & exception handling
- SQL injection prevention
- Clean Architecture & Design Patterns

**Frontend Development**
- HTML5, CSS3, Bootstrap responsive design
- Vanilla JavaScript (AJAX, DOM manipulation)
- SPA-like page rendering

**Database Design**
- Relational schema design (11 tables)
- One-to-many & Many-to-many relationships
- Query optimization & indexing
- Cascade operations

**Third-party Integration**
- VnPay Payment Gateway integration
- File upload handling & optimization

**Development Tools & Practices**
- Maven build automation
- Git version control
- Unit testing with Spring Test
- Logging & debugging

---

**GitHub**: [https://github.com/RockLeezoho/Cinema_Management_System]  
**Contact**: codene38@gmail.com
