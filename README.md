# Auth System

A secure authentication API built with Node.js, Express, and MongoDB.

## Features

- User registration with validation
- Login with JWT (access + refresh tokens)
- Refresh token rotation (hashed in DB)
- HttpOnly cookie for refresh token
- Protected routes with auth middleware
- MVC-style structure

## Tech Stack

Node.js, Express, MongoDB, Mongoose, bcrypt, JWT

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login and get tokens |
| POST | /api/auth/refresh | Refresh access token |
| POST | /api/auth/logout | Logout and revoke token |
| GET | /api/auth/me | Get current user (protected) |

## Getting Started

```bash
git clone https://github.com/hamidreza-babazamani/login-system.git
cd login-system
npm install
```

Create `.env`:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/authorization
BCRYPT_SALT_ROUNDS=10
JWT_SECRET=your_secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d
```

Run:

```bash
npm run dev
```
---

# سیستم احراز هویت

یک API امن برای احراز هویت با Node.js، Express و MongoDB.

## امکانات

- ثبت‌نام کاربر با اعتبارسنجی
- ورود با JWT (توکن دسترسی و توکن تازه‌سازی)
- چرخش توکن تازه‌سازی (ذخیره هش‌شده در دیتابیس)
- کوکی HttpOnly برای توکن تازه‌سازی
- روت‌های محافظت‌شده با میدل‌ور احراز هویت
- ساختار MVC

## تکنولوژی‌ها

Node.js، Express، MongoDB، Mongoose، bcrypt، JWT

## مسیرها

| متد | مسیر | توضیح |
|-----|------|-------|
| POST | /api/auth/register | ثبت‌نام کاربر جدید |
| POST | /api/auth/login | ورود و دریافت توکن‌ها |
| POST | /api/auth/refresh | تازه‌سازی توکن دسترسی |
| POST | /api/auth/logout | خروج و ابطال توکن |
| GET | /api/auth/me | دریافت کاربر فعلی (محافظت‌شده) |

## شروع

```bash
git clone https://github.com/hamidreza-babazamani/login-system.git
cd login-system
npm install
```

فایل `.env` بسازید:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/authorization
BCRYPT_SALT_ROUNDS=10
JWT_SECRET=your_secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d
```

اجرا:

```bash
npm run dev
```
