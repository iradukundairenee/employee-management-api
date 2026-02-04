# 🏢 Employee Management System

[![Coverage Status](https://img.shields.io/badge/coverage-80%25-brightgreen.svg)](https://github.com/yourusername/nestjs-employee-management)
[![Tests](https://img.shields.io/badge/tests-passing-brightgreen.svg)](https://github.com/yourusername/nestjs-employee-management)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/nestjs-v10-red.svg)](https://nestjs.com/)

A comprehensive employee management system built with **NestJS**, featuring authentication, CRUD operations, attendance tracking, email notifications, and report generation.

## ✨ Features

- 🔐 **Authentication System** - JWT-based auth with password reset
- 👥 **Employee Management** - Full CRUD operations
- ⏰ **Attendance Tracking** - Check-in/out with email notifications
- 📊 **Report Generation** - PDF and Excel reports
- 📧 **Email Notifications** - Queue-based email system
- 📚 **API Documentation** - Swagger/OpenAPI
- 🧪 **Comprehensive Testing** - Unit and E2E tests

## 🛠️ Tech Stack

- **Framework:** NestJS v10
- **Database:** MySQL with TypeORM
- **Authentication:** JWT with Passport
- **Queue System:** Bull with Redis
- **Email:** Nodemailer
- **Reports:** jsPDF and ExcelJS
- **Testing:** Jest
- **Documentation:** Swagger/OpenAPI

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- MySQL (v8.0+)
- Redis (v6+)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd nestjs-employee-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   ```
   Update your `.env` file with your credentials.

4. **Start Redis**
   ```bash
   redis-server
   ```

5. **Run the application**
   ```bash
   npm run start:dev
   ```

## 📋 API Endpoints

### 🔐 Authentication
- `POST /auth/register` - Register user
- `POST /auth/login` - Login user
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password

### 👥 Employees
- `GET /employees` - Get all employees
- `GET /employees/:id` - Get employee by ID
- `POST /employees` - Create employee
- `PATCH /employees/:id` - Update employee
- `DELETE /employees/:id` - Delete employee

### ⏰ Attendance
- `GET /attendance` - Get attendance records
- `POST /attendance/check-in/:employeeId` - Employee check-in
- `POST /attendance/check-out/:employeeId` - Employee check-out

### 📊 Reports
- `GET /reports/attendance/pdf` - Generate PDF report
- `GET /reports/attendance/excel` - Generate Excel report

## 📖 API Documentation

Access Swagger UI at: **http://localhost:3000/api**

## 🧪 Testing

```bash
# Unit tests
npm run test

# Test coverage
npm run test:cov

# E2E tests
npm run test:e2e

# Watch mode
npm run test:watch
```

## 🏗️ Project Structure

```
src/
├── auth/           # Authentication module
├── employee/       # Employee management
├── attendance/     # Attendance tracking
├── mail/          # Email service
├── reports/       # Report generation
├── common/        # Shared utilities
└── main.ts        # Application entry
```

## 🔧 Configuration

### Database
Update `DATABASE_URL` in `.env` with your MySQL connection string.

### Email (Gmail)
1. Enable 2FA on Gmail
2. Generate App Password
3. Update `MAIL_USER` and `MAIL_PASS` in `.env`

### Redis
Update `REDIS_HOST` and `REDIS_PORT` for your Redis instance.

## 🚀 Deployment

```bash
# Build
npm run build

# Production
npm run start:prod
```

## 📄 License

MIT License

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

---

**Built with ❤️ using NestJS**