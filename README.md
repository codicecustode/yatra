# Yatra – Real-time Messaging API

A modern real-time messaging backend built with Node.js, TypeScript, Express, MongoDB, Socket.IO and JWT authentication.

Supports one-to-one chat, file sharing, OTP verification, refresh tokens, Redis caching, and clean layered architecture.

---

## ✨ Features

- User Authentication (Register, Login, OTP, JWT + Refresh Tokens)
- Real-time messaging using Socket.IO
- File upload & sharing
- Message CRUD APIs
- Redis caching (optional)
- Unit tests (Jest + Supertest)
- Controller → Service → Repository architecture

---

### 🚧 Planned / Future Enhancements

- Zod-based request validation (schema validation for APIs)
- Centralized custom error handling system
- Kafka integration for event-driven messaging & async processing
- Message delivery status (sent / delivered / read)
- Rate limiting & abuse protection
---

## 🛠 Tech Stack

- Node.js
- TypeScript
- Express
- MongoDB + Mongoose
- Socket.IO
- Redis
- JWT + bcrypt
- Multer
- -cloudinary
- Nodemailer (Gmail)
- Jest + Supertest
  

---

## 📂 Project Structure

```

src/
├── app.ts                # Express app configuration (middlewares, routes)
├── server.ts             # Server + Socket.IO initialization
├── config/               #MongoDB, Redis configuration
├── controllers/          # HTTP request handlers (API layer)
├── services/             # Business logic and validations
├── repositories/         # Database queries & data access layer
├── routes/               # Express route definitions
├── middlewares/          # Auth, file upload
├── models/               # Mongoose schemas & models
├── sockets/              # Socket.IO events, rooms, real-time handlers
├── utils/                # Helpers (JWT, email, cloudinary, etc.)
└── tests/                # Unit  tests (Jest + Supertest)

```

---

## 🚀 Quick Start
```

1) Clone repository

git clone https://github.com/codicecustode/yatra  
cd yatra

2) Install dependencies

npm install

3) Create env file

cp .env.example .env

4) Edit .env

PORT=3000  
NODE_ENV=development  

MONGO_URI=mongodb://localhost:27017/yatra  

JWT_SECRET=your_access_token_secret  
JWT_REFRESH_SECRET=your_refresh_token_secret  

REDIS_URL=redis://localhost:6379  

EMAIL_SERVICE=gmail  
EMAIL_USER=your_email@gmail.com  
EMAIL_PASS=your_gmail_app_password  

5) Start Redis (optional)

docker run -d --name yatra-redis -p 6379:6379 redis

6) Run project

npm run dev  
 

Tests:  
npm test  
  

Gmail App Password setup:
- Enable 2-step verification
- Google Account → Security → App Passwords
- Generate password for Mail
- Use it as EMAIL_PASS

---

## 📡 API Endpoints

Auth:
POST /api/auth/register  
POST /api/auth/login  
POST /api/auth/verify  
POST /api/auth/refresh  
POST /api/auth/logout

Messages:
POST /api/messages  (this route will handle both file upload as well as message creation)
GET /api/messages/:userId
PATCH /api/messages/:id  (use Patch instead of PUT )
DELETE /api/messages/:id  

---

## 🔄 Socket.IO Events

join (user join) 
new_message(for new message creation)
message_updated (for editing the message)
message_deleted (for message deletion)
---

## 🧠 Architecture

Controller → Service → Repository → Database

```

## 👨‍💻 Author

Aman Kumar Singh  
Backend Developer (Node.js, TypeScript, MongoDB)

---

## 📄 License

MIT License

---

## ⭐ Support

If you like this project, give it a star on GitHub.
