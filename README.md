# 🗳️ Polling App - MERN Stack

A full-stack **Polling Application** built with the **MERN Stack (MongoDB, Express.js, React, Node.js)**. The application allows users to create polls, vote on polls, comment, receive notifications, and securely authenticate using JWT and Email OTP verification.

> A modern, responsive, and scalable polling platform built with industry-standard technologies.

---

# 📸 Preview

> Add your project screenshots here

| Home Page | Poll Details |
|-----------|--------------|
| ![Home](assets/home.png) | ![Poll](assets/poll.png) |

---

# 🚀 Features

## 👤 Authentication

- User Registration
- User Login
- JWT Authentication
- Email OTP Verification
- Forgot Password
- Reset Password
- Protected Routes

---

## 🗳️ Poll Management

- Create Poll
- Update Poll
- Delete Poll
- Close Poll
- Public Polls
- Multiple Poll Types
- Vote Once Protection

---

## 💬 Comments

- Add Comments
- View Comments
- Delete Comments

---

## 🔔 Notifications

- Real-time Notification System
- Vote Notifications
- Comment Notifications

---

## 👨 User Profile

- Update Profile
- Upload Profile Image
- Cloudinary Image Upload

---

# 🛠 Tech Stack

## Frontend

- React.js
- Vite
- React Router DOM
- Axios
- Context API
- CSS3
- React Icons

---

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Bcrypt
- Nodemailer
- Cloudinary
- Multer
- Dotenv
- Morgan
- CORS

---

# 📂 Project Structure

```text
Polling-App/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── package.json
│   └── server.js
│
└── README.md
```

---

# ⚙️ Installation

## 1️⃣ Clone Repository

```bash
git clone https://github.com/sanaullah-7/Polling-Project-SMIT.git
```

```bash
cd Polling-Project-SMIT
```

---

# 📦 Install Dependencies

## Backend

```bash
cd backend
npm install
```

## Frontend

```bash
cd ../frontend
npm install
```

---

# 🔑 Environment Variables

Create a `.env` file inside the **backend** folder.

Example:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> Never upload your `.env` file to GitHub.

---

# ▶️ Run the Project

## Start Backend

```bash
cd backend
npm run dev
```

or

```bash
npm start
```

Backend runs on

```
http://localhost:5000
```

---

## Start Frontend

```bash
cd frontend
npm run dev
```

Frontend runs on

```
http://localhost:5173
```

---

# 🔐 Authentication

Protected APIs require:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

---

# 📌 API Modules

### Authentication

- Register
- Login
- Verify OTP
- Forgot Password
- Reset Password

---

### Polls

- Create Poll
- Get Polls
- Vote Poll
- Delete Poll
- Close Poll

---

### Comments

- Add Comment
- Delete Comment
- Get Comments

---

### Notifications

- Get Notifications
- Mark as Read

---

# 📱 Responsive Design

✔ Desktop

✔ Laptop

✔ Tablet

✔ Mobile

---

# 📦 Main Packages

## Frontend

- React
- Vite
- Axios
- React Router DOM
- React Icons

---

## Backend

- Express
- MongoDB
- Mongoose
- JWT
- Bcrypt
- Nodemailer
- Cloudinary
- Multer
- Morgan
- Dotenv
- CORS

---

# 🔒 Security Features

- JWT Authentication
- Password Hashing
- Protected Routes
- Environment Variables
- MongoDB Validation

---

# 🧪 Testing

You can test APIs using

- Postman
- Thunder Client
- Insomnia

---

# ✨ Future Improvements

- Real-time Voting
- Live Poll Results
- Dark Mode
- Poll Analytics Dashboard
- Admin Panel
- Role-based Authentication
- WebSockets
- API Documentation (Swagger)

---

# 🤝 Contributing

Contributions are always welcome.

1. Fork Repository

2. Create Branch

```bash
git checkout -b feature-name
```

3. Commit

```bash
git commit -m "Added new feature"
```

4. Push

```bash
git push origin feature-name
```

5. Create Pull Request

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

### Sanaullah Yousafzai

**GitHub**

https://github.com/sanaullah-7

---

# ⭐ Support

If you found this project useful, don't forget to ⭐ the repository.

It motivates me to build more awesome projects.

---

## 🙌 Thank You

Thank you for visiting this repository.

Happy Coding! 🚀
