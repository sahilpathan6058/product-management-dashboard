<img width="1912" height="917" alt="image" src="https://github.com/user-attachments/assets/7cd361b4-0145-44de-910f-62508182d97f" /># Product Management Dashboard

A Full Stack Product Management Dashboard built using React and Spring Boot with JWT Authentication and Role-Based Access Control (RBAC).

---

## Tech Stack

### Frontend
- React.js
- React Router DOM
- Axios
- CSS
- Vite

### Backend
- Java 17
- Spring Boot
- Spring Security
- Spring Data JPA
- JWT Authentication

### Database
- MySQL

# ✨ Features

## Authentication
- JWT-based Login
- Token stored in localStorage
- Secure API access

## Role-Based Access Control

### Admin
- View Products
- Add Products
- Edit Products
- Delete Products

### User
- View Products Only

---

## Additional Features

- Search Products
- Category Filter
- Pagination
- Logout Functionality
- Protected Routes
- Loading States
- Error Handling
- Toast Messages
- Responsive UI

---

# 📸 Screenshots

## Login Page

<img width="1847" height="877" alt="image" src="https://github.com/user-attachments/assets/375f6a73-2b37-4350-8a81-7a2b68c01b7c" />

---

## Admin Dashboard

<img width="1917" height="922" alt="image" src="https://github.com/user-attachments/assets/bbfcdb3e-609c-43fd-a834-c44a61cb7cfb" />

---

## User Dashboard

<img width="1912" height="917" alt="image" src="https://github.com/user-attachments/assets/c83e424b-9ea3-40db-a281-f1c04a439712" />


## Add Product

<img width="1860" height="876" alt="image" src="https://github.com/user-attachments/assets/82139c2f-1b0e-4e77-b6c0-35479d0aabec" />

---

## Edit Product

<img width="1877" height="877" alt="image" src="https://github.com/user-attachments/assets/fe3fc4b2-216f-402d-8e7f-34b42061fda3" />


---

# Project Structure

```text
product-management-dashboard
│
├── backend
│
├── frontend
│
├── database
│     └── product_dashboard.sql
│
├── README.md
│
└── .gitignore
```

# REST APIs

## Authentication

```text
POST /api/login
```

## Products

```text
GET /api/products
GET /api/products/{id}
POST /api/products
PUT /api/products/{id}
DELETE /api/products/{id}
```

---

# Database Setup

Database Name:

```text
product_dashboard
```

Import SQL file:

```text
database/product_dashboard.sql
```

The SQL file contains:

- Users table
- Products table
- Sample users
- Sample products

---

# Sample Credentials

## Admin

```text
Username : admin
Password : admin123
```

## User

```text
Username : user
Password : user123
```

---

# Backend Setup

```bash
cd backend
mvn spring-boot:run
```

Backend runs on:

```text
http://localhost:8081
```

---

# Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

# Security

- JWT Authentication
- Spring Security
- Role-Based Authorization
- Protected APIs
- Protected Routes

---

# Concepts Implemented

- CRUD Operations
- React Hooks (useState, useEffect)
- Axios API Calls
- React Router
- Conditional Rendering
- JWT Authentication
- Role-Based Access Control (RBAC)
- Protected Routes
- Pagination
- Search Functionality
- Category Filter
- Error Handling
- Loading States



# 📄 License

This project was developed for learning and assessment purposes.
