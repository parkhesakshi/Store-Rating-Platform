# Store Rating Platform

A full-stack web application that allows users to rate stores, store owners to monitor ratings, and administrators to manage stores and users.

## 🚀 Live Demo

Frontend:  https://store-rating-platform-h7io.vercel.app/

Backend API: https://store-rating-platform-cts4.onrender.com

---

## 📌 Features

### Admin

* Login securely
* Dashboard with statistics

  * Total Users
  * Total Stores
  * Total Ratings
* Create, view and manage stores
* Assign Store Owners to stores
* Create and manage users
* View user details
* Search users by:

  * Name
  * Email
  * Address
  * Role
* Sort users by:

  * Name
  * Email
  * Address
  * Role
* View all ratings

### Store Owner

* Login securely
* View assigned store details
* View users who submitted ratings
* View average store rating
* Change password
* Logout

### Normal User

* Register account
* Login securely
* Browse stores
* Search stores by:

  * Name
  * Address
* Submit ratings (1-5)
* Update previously submitted ratings
* View store details
* Change password
* Logout

---

## 🛠️ Tech Stack

### Frontend

* React.js
* TypeScript
* React Router DOM
* React Query (TanStack Query)
* Tailwind CSS
* Axios
* React Hook Form
* Zod
* Lucide React

### Backend

* NestJS
* TypeScript
* Prisma ORM
* PostgreSQL
* JWT Authentication
* Bcrypt
* Class Validator

### Database

* PostgreSQL

### Deployment

* Frontend: Vercel
* Backend: Render
* Database: Neon PostgreSQL

---

## 📂 Project Structure

```
store-rating-platform/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── lib/
│   │   └── types/
│   │
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── stores/
│   │   ├── ratings/
│   │   ├── dashboard/
│   │   └── prisma/
│   │
│   ├── prisma/
│   └── package.json
│
└── README.md
```

---

## 🗄️ Database Schema

### User

| Field    | Type                       |
| -------- | -------------------------- |
| id       | String                     |
| name     | String                     |
| email    | String                     |
| password | String                     |
| address  | String                     |
| role     | ADMIN / STORE_OWNER / USER |

### Store

| Field   | Type   |
| ------- | ------ |
| id      | String |
| name    | String |
| email   | String |
| address | String |
| ownerId | String |

### Rating

| Field   | Type   |
| ------- | ------ |
| id      | String |
| score   | Int    |
| userId  | String |
| storeId | String |

---

## 🔐 Authentication

JWT-based authentication is implemented.

Protected Routes:

* Dashboard
* Stores
* Users
* Ratings
* Change Password

Roles:

* ADMIN
* STORE_OWNER
* USER

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/parkhesakshi/Store-Rating-Platform
cd store-rating-platform
```

---

## Backend Setup

### Install Dependencies

```bash
cd backend
npm install
```

### Environment Variables

Create a .env file

```env
DATABASE_URL=

JWT_SECRET=

PORT=3001
```

### Run Prisma Migration

```bash
npx prisma migrate dev
```

### Start Backend

```bash
npm run start:dev
```

---

## Frontend Setup

### Install Dependencies

```bash
cd frontend
npm install
```

### Environment Variables

Create a .env file

```env
VITE_API_URL=http://localhost:3001
```

### Start Frontend

```bash
npm run dev
```

---

## 🌐 Deployment

### Frontend (Vercel)

Environment Variables:

```
VITE_API_URL=<backend-url>
```

### Backend (Render)

Environment Variables:

```
DATABASE_URL=<neon-db-url>

JWT_SECRET=<secret-key>
```

### Vercel Configuration

Create:

```
frontend/vercel.json
```

```json
{
"rewrites": [
{
"source": "/(.*)",
"destination": "/index.html"
}
]
}
```

---

## 📊 Key Features Implemented

* JWT Authentication
* Role-Based Access Control
* Store Management
* User Management
* Rating Management
* Average Rating Calculation
* Search & Filtering
* Sorting
* Debounced Search
* Responsive UI
* Protected Routes
* Change Password
* React Query Data Fetching
* Prisma ORM Integration
* PostgreSQL Database

---

## 👨‍💻 Author

**Sakshi Parkhe**

Full Stack Developer

Tech Stack:

* React.js
* TypeScript
* Node.js
* NestJS
* PostgreSQL
* Prisma ORM

---
