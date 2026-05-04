# 🎬 Cinema Management System

## Overview

A comprehensive movie theater management system with complete features for content management, ticket sales, and online payment. Built with **Spring Boot 3.4.5**, **Spring Data JPA**, **PostgreSQL**, and integrated with **VnPay Payment Gateway**.

## ✨ Key Highlights

- ✅ **Complete Ticket Booking System** with real-time seat status
- ✅ **VnPay Integration** - safe online transaction processing
- ✅ **JWT Authentication** - secure REST API endpoints
- ✅ **User Roles & Permissions** - separate Admin dashboard and Customer portal
- ✅ **RESTful API** - 40+ endpoints for all features
- ✅ **3-Layer Architecture** - API, Service, Repository (Clean Architecture)
- ✅ **Database Schema** - 11 optimized relational tables
- ✅ **File Upload** - optimized handling for movie images, posters, avatars

## 🎯 Main Features

**System Management**: Cinemas, Rooms, Seats, Movies, Showtimes

**Ticket Sales**: Ticket Types, Invoices, Booking, Real-time Seat Status

**Payment**: VnPay Integration, Vouchers/Discounts, Digital Invoices

**Other**: Concession Management (snacks/beverages), Suppliers, Users, Notifications

## 🛠 Technology Stack

| Category | Technology |
|----------|-----------|
| **Backend** | Spring Boot 3.4.5, Spring Data JPA, Spring Security, Spring HATEOAS |
| **Database** | PostgreSQL 12+, Hibernate ORM |
| **Security** | JWT Token, Spring Security, Password Encryption (bcrypt) |
| **Frontend** | HTML5, CSS3, Bootstrap 5.3.3, Vanilla JavaScript, AJAX |
| **Build** | Maven, Java 21 |
| **Dev Tools** | Spring Boot DevTools, Lombok, SiteMesh, DisplayTag |
| **Payment** | VnPay (Sandbox & Production) |
| **Testing** | Spring Boot Test, Spring Security Test |

## 📁 Project Structure

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

## 🔐 Security

- JWT Token-based Authentication & Authorization
- Spring Security with Role-based Access Control (Admin, Customer)
- Password Encryption (bcrypt)
- CORS Configuration for cross-origin requests
- Input Validation & XSS Prevention
- Global Exception Handling

## 💾 Database

**11 main tables**: users, cinemas, rooms, seats, movies, showtimes, tickets, invoices, vouchers, concessions, suppliers

**Features**: Optimized 1-N/M-N relationships, constraint integrity, cascade delete, indexed queries

## 👥 User Roles & Interfaces

| Role | Responsibilities |
|------|---------|
| **Admin** | Full system management, cinemas, movies, tickets, invoices, reports |
| **Customer** | View movies, book tickets, payment, voucher management, view invoices |

## 🚀 Top 10 Features

1. **Real-time Seat Status** - Seat availability updates instantly
2. **VnPay Integration** - Secure payment processing with sandbox & production support
3. **JWT Security** - Stateless authentication, token-based API
4. **RESTful APIs** - 40+ endpoints, fully documented
5. **File Upload** - Optimized image handling for movies, posters, avatars
6. **Booking System** - Online ticket booking with duplicate detection
7. **Voucher System** - Create discount codes with flexible application
8. **Invoice Management** - Digital invoices, database storage
9. **Search & Filter** - Search movies, showtimes, users
10. **Error Handling** - Global exception handling with detailed logging

## 💡 Technical Skills Applied

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

**GitHub**: [https://github.com/RockLeezoho/Cinema_Management_System](https://github.com/RockLeezoho/Cinema_Management_System)  
**Contact**: codene38@gmail.com
