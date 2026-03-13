# 🚀 Examora – Full Stack Online Examination Platform

Examora is a **modern full-stack online examination platform** designed for scalable academic and organizational assessments.
It provides **secure exam management, structured question banks, role-based access control, and detailed analytics** for administrators and students.

The platform is built using **Spring Boot (backend)** and **React + Vite + Tailwind (frontend)** following a **modular and scalable architecture**.

---

# 🧠 Project Overview

Examora enables institutions and organizations to conduct **structured online examinations** with controlled workflows and strong system governance.

The platform introduces a **hierarchical question system**:

Section → SubSection → Question

This ensures that exams remain **organized, reusable, and easy to manage**, even for large question banks.

The system also includes **strict role-based permissions**, ensuring that each user type only accesses the features relevant to their responsibilities.

---

# 🏗️ System Architecture

The platform follows a **three-layer architecture** separating presentation, application logic, and data storage.

```
React Frontend (Vite + Tailwind)
        │
        │ REST API
        ▼
Spring Boot Backend
        │
        ▼
PostgreSQL Database
```

### Architecture Highlights

* Modular backend design
* RESTful API communication
* JWT based authentication
* Role based access control
* Scalable question bank hierarchy

---

# ⚙️ Tech Stack

## Backend

* Java
* Spring Boot
* Spring Security
* JWT Authentication
* Maven
* PostgreSQL

## Frontend

* React
* Vite
* Tailwind CSS
* React Router

## Development Tools

* Git
* GitHub
* Postman
* VS Code

---

# 👥 User Roles

The system supports **three primary roles**.

### 👑 Super Admin

Responsible for overall system governance.

Capabilities:

* Manage administrators
* View system analytics
* Monitor system activity
* Manage user directory
* Access audit logs
* Control system level configurations

---

### 🛠️ Admin

Responsible for managing examinations and question banks.

Capabilities:

* Create and manage exams
* Manage question banks
* Organize sections and subsections
* Monitor exam analytics
* View student performance

---

### 🎓 Student

End users who participate in exams.

Capabilities:

* Attempt available exams
* View results and history
* Monitor performance
* Track leaderboard (optional feature)

---

# 🧩 Core Features

### Structured Question Bank

Questions follow a strict hierarchy:

```
Section
   └── SubSection
           └── Question
```

Benefits:

* Organized question management
* Reusable question bank
* Easier exam creation
* Logical subject segmentation

---

### Advanced Exam Creation Workflow

Exam creation follows a structured **multi-step process**:

1. Basic Exam Information
2. Section Selection
3. SubSection Selection
4. Automatic Question Mapping
5. Exam Customization
6. Review Configuration
7. Publish Exam

This ensures **controlled and consistent exam generation**.

---

### Secure Exam Attempt System

Features include:

* Strict exam timer
* Automatic submission
* Locked questions during attempt
* Attempt tracking
* Controlled exam sessions

---

### Analytics and Performance Tracking

Administrators can view analytics across multiple levels:

* Exam level
* Section level
* Question level
* Student level

This enables **data-driven academic insights**.

---

# 📂 Project Structure

```
examora
│
├── backend
│   ├── src/main/java/com/examora/backend
│   │   ├── analytics
│   │   ├── attempt
│   │   ├── auth
│   │   ├── common
│   │   ├── exam
│   │   ├── questionbank
│   │   ├── result
│   │   ├── security
│   │   ├── student
│   │   ├── superadmin
│   │   └── user
│   │
│   ├── src/main/resources
│   │   ├── application.yml
│   │   └── application-dev.yml
│   │
│   └── pom.xml
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── assets
│   │   ├── core
│   │   ├── features
│   │   ├── layouts
│   │   └── shared
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── package.json
│
└── README.md
```

---

# ⚡ Getting Started

## Prerequisites

Make sure the following are installed:

* Java 17+
* Node.js 18+
* Maven
* PostgreSQL
* Git

---

# 🖥️ Backend Setup

Navigate to backend directory:

```
cd backend
```

Configure environment variables:

```
DB_URL=jdbc:postgresql://localhost:5432/examora
DB_USERNAME=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
```

Run the backend server:

```
./mvnw spring-boot:run
```

Backend will start at:

```
http://localhost:8080
```

---

# 💻 Frontend Setup

Navigate to frontend directory:

```
cd frontend
```

Install dependencies:

```
npm install
```

Run development server:

```
npm run dev
```

Frontend will start at:

```
http://localhost:5173
```

---

# 🔐 Authentication & Security

Examora uses **JWT based authentication** with **Spring Security**.

Security features include:

* Secure login system
* Token based authentication
* Role based access control
* Protected API endpoints

---

# 📈 Future Enhancements

Planned improvements for future versions:

* Live exam monitoring
* AI assisted cheating detection
* Multi-language exam support
* Advanced analytics dashboard
* Cloud deployment support

---

# 🤝 Contributing

Contributions are welcome.

If you'd like to improve the platform:

1. Fork the repository
2. Create a new feature branch
3. Commit your changes
4. Submit a pull request

---

# 👨‍💻 Author

**Rameshmurugan**

Full Stack Developer
Java • Spring Boot • React • PostgreSQL

---

⭐ If you find this project useful, consider giving it a **star on GitHub**.
