# 🏛️ Smart Civic Issue Reporting & Resolution Portal

LIVE LINK - https://smart-civic-portal-frontend.onrender.com

A full-stack MERN application that enables citizens to report civic issues such as potholes, garbage accumulation, water leakage, streetlight failures, drainage problems, illegal parking, and other public concerns. The platform allows administrators to efficiently manage, track, and resolve complaints while keeping citizens informed through real-time updates and notifications.

---

# 🚀 Features

## 👤 Citizen Features

* User Registration & Login (JWT Authentication)
* Create Civic Complaints
* Upload Images/Videos
* Track Complaint Status
* View Complaint History
* Comment on Complaints
* Upvote Existing Complaints
* Search & Filter Complaints
* View Resolution Proof Uploaded by Admin
* Real-Time Status Notifications

---

## 👨‍💼 Admin Features

* Admin Dashboard
* View All Complaints
* Filter Complaints by Status & Category
* Update Complaint Status
* Upload Resolution Proof
* Manage Users
* Activate/Deactivate Users
* Change User Roles
* Delete Users
* Analytics & Reporting

---

# 🛠️ Tech Stack

## Frontend

* React.js
* React Router DOM
* Redux Toolkit
* Axios
* React Hook Form
* Tailwind CSS
* React Hot Toast

## Backend

* Node.js
* Express.js
* JWT Authentication
* Mongoose
* Multer
* Socket.io
* Nodemailer

## Database

* MongoDB Atlas

## Cloud Services

* Cloudinary (Media Storage)

---

# 📁 Project Structure

```
smart-civic-portal/

├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── socket/
│   ├── utils/
│   ├── validators/
│   ├── app.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# 🔐 Authentication

The application uses JSON Web Tokens (JWT) for secure authentication.

### Roles

* Citizen
* Admin
* Super Admin

Role-Based Access Control (RBAC) ensures that users can only access authorized resources.

---

# 📌 Complaint Workflow

```
Citizen Creates Complaint

        ↓

Submitted

        ↓

Under Review

        ↓

In Progress

        ↓

Resolved / Rejected

        ↓

Resolution Proof Uploaded

        ↓

Citizen Receives Notification
```

---

# 📷 Media Upload

Users can upload:

* Images
* Videos

Media files are stored securely using Cloudinary.

---

# 🔔 Notifications

The project supports:

* Email Notifications (Nodemailer)
* Real-Time Notifications (Socket.io)

Users receive updates whenever complaint status changes.

---

# 📊 Main Modules

### Authentication

* Register
* Login
* Protected Routes

### Complaint Management

* Create Complaint
* View Complaint
* Update Complaint
* Delete Complaint

### Community Features

* Comments
* Upvotes
* Search
* Filter

### Admin Panel

* Manage Complaints
* Manage Users
* Resolution Proof Upload
* Status Management

---

```

---

## Backend Setup

```bash
cd backend

npm install

npm start
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---


# 📈 Future Improvements

* Google Maps Integration
* Complaint Heat Map
* AI Complaint Category Suggestion
* Public Transparency Dashboard
* Dark Mode
* Progressive Web App (PWA)
* Multi-language Support

---

# 💡 Learning Outcomes

This project demonstrates practical knowledge of:

* MERN Stack Development
* REST API Design
* JWT Authentication
* Role-Based Access Control
* Redux State Management
* Socket.io Integration
* Cloudinary File Upload
* MongoDB & Mongoose
* Responsive UI Design
* Full-Stack Project Architecture

---

# 👨‍💻 Author

**Sudarshan Lande**

Passionate Full Stack MERN Developer focused on building scalable, user-friendly, and impactful web applications.
