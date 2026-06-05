# CampusCart

CampusCart is a full-stack student marketplace platform that enables college students to buy and sell products within their campus community. The platform provides secure authentication, product listing management, cart functionality, order processing, user profiles, and feedback collection.

---

## Features

### User Authentication

* User registration and login
* JWT-based authentication
* Secure password hashing using bcrypt
* Profile management
* Password update functionality

### Product Management

* Create product listings with images
* View all products with filtering and pagination
* View detailed product information
* Edit and delete own listings
* View personal product listings

### Cart Management

* Add products to cart
* Remove products from cart
* Synchronize cart data
* Manage cart items before checkout

### Order Management

* Place orders
* View buyer orders
* View seller orders
* Track transaction history

### Feedback System

* Submit feedback and reviews
* Display recent positive testimonials
* Admin access to all feedback records

### Image Uploads

* Cloudinary integration for image storage
* Product image management

---

## Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* Axios
* React Router DOM

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

### Authentication & Security

* JSON Web Tokens (JWT)
* bcrypt

### Cloud Services

* Cloudinary

---

## Project Structure

```text
CampusCart/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── cloudinary.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── Components/
│   │   ├── Pages/
│   │   ├── Services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
└── README.md
```

---

## API Endpoints

### Authentication

| Method | Endpoint                    | Description         |
| ------ | --------------------------- | ------------------- |
| POST   | `/api/auth/register`        | Register a new user |
| POST   | `/api/auth/login`           | Login user          |
| GET    | `/api/auth/me`              | Get current user    |
| PUT    | `/api/auth/update-profile`  | Update user profile |
| PUT    | `/api/auth/update-password` | Update password     |

### Products

| Method | Endpoint                    | Description        |
| ------ | --------------------------- | ------------------ |
| GET    | `/api/products`             | Get all products   |
| POST   | `/api/products`             | Create product     |
| GET    | `/api/products/:id`         | Get single product |
| PUT    | `/api/products/:id`         | Update product     |
| DELETE | `/api/products/:id`         | Delete product     |
| GET    | `/api/products/my-listings` | Get user listings  |

### Cart

| Method | Endpoint            |
| ------ | ------------------- |
| GET    | `/api/cart`         |
| POST   | `/api/cart`         |
| POST   | `/api/cart/sync`    |
| DELETE | `/api/cart/:itemId` |

### Orders

| Method | Endpoint             |
| ------ | -------------------- |
| POST   | `/api/orders`        |
| GET    | `/api/orders/buyer`  |
| GET    | `/api/orders/seller` |

### Feedback

| Method | Endpoint               |
| ------ | ---------------------- |
| POST   | `/api/feedback`        |
| GET    | `/api/feedback/recent` |
| GET    | `/api/feedback`        |

---

## Installation

### Clone Repository

```bash
git clone https://github.com/pritam195/CampusCart.git
cd CampusCart
```

---

## Backend Setup

Navigate to backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start backend server:

```bash
npm start
```

Backend runs on:

```text
http://localhost:5000
```

---

## Frontend Setup

Navigate to frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:3000
```

---

## Environment Variables

### Backend

```env
PORT
MONGO_URI

JWT_SECRET
JWT_EXPIRE

CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

---

## Authentication Flow

1. User registers or logs in.
2. Server validates credentials.
3. JWT token is generated.
4. Token is returned to frontend.
5. Frontend stores token.
6. Protected routes verify token using authentication middleware.
7. Authorized users can access protected resources.

---

## Security Features

* Password hashing using bcrypt
* JWT authentication
* Protected API routes
* Role-based route protection (where applicable)
* Environment variable configuration for secrets
* CORS protection

---

## Future Enhancements

* Real-time chat between buyers and sellers
* Wishlist functionality
* Product recommendations
* Email notifications
* Payment gateway integration
* Admin dashboard
* Advanced search and filtering
* Product reporting and moderation
* Unit and integration testing
* API documentation using Swagger/OpenAPI

---


