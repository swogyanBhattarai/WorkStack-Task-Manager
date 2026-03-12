# WorkStack

A full-stack Multi-User Task Management System that enables teams to collaborate on projects, manage tasks, and track activities in real-time.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Backend Documentation](#backend-documentation)
  - [Configuration](#configuration)
  - [API Documentation](#api-documentation)
  - [Database Schema](#database-schema)
- [Frontend Documentation](#frontend-documentation)
  - [Routes](#routes)
  - [Components](#components)
- [Security](#security)
- [Contributing](#contributing)

## 🎯 Overview

WorkStack is a comprehensive task management system with a modern web interface and robust backend API. It provides teams with tools to organize projects, assign tasks, track progress, and maintain an audit trail of all activities.

## ✨ Features

- **User Management**: Registration, authentication, and profile management with role-based access control
- **Project Management**: Create and manage projects with multiple team members
- **Task Tracking**: Assign and track tasks within projects with labels, due dates, and status
- **Activity Logging**: Automatic tracking of user actions and changes
- **Secure Authentication**: JWT-based stateless authentication across frontend and backend
- **Modern UI**: Responsive, intuitive interface built with Next.js and Tailwind CSS

## 🛠 Tech Stack

### Backend
- **Framework**: Spring Boot 4.0.3
- **Java Version**: 17
- **Database**: H2 (embedded, file-based)
- **Security**: Spring Security with JWT
- **ORM**: Spring Data JPA with Hibernate
- **Validation**: Jakarta Bean Validation
- **Build Tool**: Maven
- **Additional Libraries**: Lombok, JJWT

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.7
- **Styling**: Tailwind CSS 3.4
- **HTTP Client**: Axios with JWT interceptors
- **Form Management**: react-hook-form
- **Validation**: Zod

## 📁 Project Structure

```
WorkStack/
├── backend/                           # Spring Boot Backend
│   ├── src/main/java/com/justdeepfried/WorkStack/
│   │   ├── WorkStackApplication.java
│   │   ├── auth/                     # JWT authentication
│   │   ├── config/                   # Security & app configuration
│   │   ├── controller/               # REST API endpoints
│   │   ├── dto/                      # Data Transfer Objects
│   │   ├── exception/                # Exception handling
│   │   ├── model/                    # JPA entities
│   │   ├── repository/               # Data access layer
│   │   ├── service/                  # Business logic
│   │   └── specification/            # Query specifications
│   ├── src/main/resources/
│   │   ├── application.properties    # Backend configuration
│   │   └── logback.xml              # Logging configuration
│   └── pom.xml                       # Maven dependencies
│
└── frontend/                          # Next.js Frontend
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx            # Root layout
    │   │   ├── globals.css           # Global styles & design system
    │   │   ├── middleware.ts         # Route protection
    │   │   ├── login/                # Login page
    │   │   ├── register/             # Registration page
    │   │   ├── dashboard/            # Dashboard overview
    │   │   ├── projects/             # Project pages
    │   │   ├── tasks/                # Task pages
    │   │   ├── users/                # User management
    │   │   └── activity/             # Activity log
    │   ├── components/
    │   │   ├── layout/               # Layout components
    │   │   └── ui/                   # Reusable UI components
    │   ├── lib/                      # API client & utilities
    │   ├── services/                 # API service modules
    │   └── types/                    # TypeScript types
    ├── package.json                  # Node dependencies
    └── next.config.js                # Next.js configuration
```

## 🚀 Getting Started

### Prerequisites

- **Java 17** or higher
- **Maven 3.6+** — used to build and run the backend
- **Node.js 18.17** or later — used to run the frontend
- **npm** or **yarn**

#### Installing Maven

Maven is required to build and run the Spring Boot backend.

1. Download Maven from the [official Apache Maven website](https://maven.apache.org/download.cgi).
2. Extract the archive and add the `bin` directory to your system `PATH`.
3. Verify the installation:
   ```bash
   mvn --version
   ```

> **Note:** Alternatively, this project includes Maven wrapper scripts (`mvnw` / `mvnw.cmd`) so you can run Maven commands without a global installation.

#### Installing Node.js

Node.js is required to install dependencies and run the Next.js frontend.

1. Download the LTS installer from the [official Node.js website](https://nodejs.org/).
2. Run the installer and follow the on-screen instructions.
3. Verify the installation:
   ```bash
   node --version
   npm --version
   ```

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Build the project**
   ```bash
   mvnw clean install
   # or on Unix/Mac
   ./mvnw clean install
   ```

3. **Run the backend**
   ```bash
   mvnw spring-boot:run
   # or on Unix/Mac
   ./mvnw spring-boot:run
   ```

   The backend API will start on `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

   The frontend will start on `http://localhost:3000`

---

## 📘 Backend Documentation

## ⚙️ Configuration

### Application Properties

Create or edit `src/main/resources/application.properties`:

```properties
# Application Name
spring.application.name=WorkStack

# H2 Database Configuration
spring.datasource.url=jdbc:h2:file:~/workstackDB
spring.datasource.driver=org.h2.Driver

# JPA/Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update

```

### Important Configuration Notes

- **Database**: By default, H2 database files are stored in `~/workstackDB`. Data persists across application restarts.
- **DDL Auto**: Set to `update` to automatically update database schema based on entity changes.

## 📚 API Documentation

### Base URL

```
http://localhost:8080/api
```

### API Endpoints

#### 🔐 User Management (`/api/user`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/user` | Get all users (paginated, searchable) | ✅ |
| GET | `/api/user/{id}` | Get user by ID | ✅ |
| POST | `/api/user/add` | Register new user | ❌ |
| POST | `/api/user/login` | Login and get JWT token | ❌ |
| PUT | `/api/user/update/{id}` | Update user | ✅ |
| DELETE | `/api/user/delete/{id}` | Delete user | ✅ |

**Query Parameters for GET `/api/user`:**
- `pageNum` (default: 1) - Page number
- `pageSize` (default: 5) - Items per page
- `sortBy` (default: "id") - Field to sort by
- `sortDir` (default: "ASC") - Sort direction (ASC/DESC)
- `search` (optional) - Search by username

**Example - User Registration:**
```bash
POST /api/user/add
Content-Type: application/json

{
  "username": "johndoe",
  "password": "securePassword123",
  "roles": ["admin"]
}
```

Registration supports role assignment at account creation. To access the protected frontend data views with the current backend security configuration, the account must include the `admin` role.

**Example - User Login:**
```bash
POST /api/user/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "securePassword123"
}

# Response: JWT token string
```

#### 📊 Project Management (`/api/project`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/project` | Get all projects (paginated, filtered) | ✅ |
| GET | `/api/project/{id}` | Get project by ID with tasks and users | ✅ |
| POST | `/api/project/add` | Create new project | ✅ |
| PUT | `/api/project/update/{id}` | Update project | ✅ |
| DELETE | `/api/project/delete/{id}` | Delete project | ✅ |

**Query Parameters for GET `/api/project`:**
- `pageNum` (default: 1) - Page number
- `pageSize` (default: 5) - Items per page
- `sortBy` (default: "projectId") - Field to sort by
- `sortDir` (default: "ASC") - Sort direction
- `projectSearch` (optional) - Search by project name
- `statusSearch` (optional) - Filter by status (PENDING/COMPLETED)

**Example - Create Project:**
```bash
POST /api/project/add
Content-Type: application/json
Authorization: Bearer <token>

{
  "projectName": "E-commerce Platform",
  "description": "Build a new e-commerce platform",
  "projectStatus": "PENDING",
  "userIds": [
    {"id": 1},
    {"id": 2}
  ]
}
```

#### ✅ Task Management (`/api/task`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/task` | Get all tasks (paginated, searchable) | ✅ |
| GET | `/api/task/{id}` | Get task by ID | ✅ |
| POST | `/api/task` | Create new task | ✅ |
| PUT | `/api/task/update/{id}` | Update task | ✅ |
| DELETE | `/api/task/delete/{id}` | Delete task | ✅ |

**Query Parameters for GET `/api/task`:**
- `pageNum` (default: 1) - Page number
- `pageSize` (default: 5) - Items per page
- `sortBy` (default: "taskId") - Field to sort by
- `sortDir` (default: "ASC") - Sort direction
- `taskName` (optional) - Search by task name

**Example - Create Task:**
```bash
POST /api/task
Content-Type: application/json
Authorization: Bearer <token>

{
  "taskName": "Implement user authentication",
  "taskDescription": "Add JWT-based authentication to the API",
  "taskStatus": "ONGOING",
  "dueDate": "2026-04-01",
  "taskLabels": ["backend", "security", "high-priority"],
  "project": {"projectId": 1}
}
```

#### 📝 Activity Log (`/api/log`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/log` | Get activity logs (paginated, filtered) | ✅ |

**Query Parameters for GET `/api/log`:**
- `pageNum` (default: 1) - Page number
- `pageSize` (default: 5) - Items per page
- `sortBy` (default: "activityId") - Field to sort by
- `sortDir` (default: "ASC") - Sort direction
- `userSearch` (optional) - Filter by username
- `activitySearch` (optional) - Search activity description


## 🔒 Security

### Authentication Flow

1. **Registration**: User registers via `/api/user/add` or through the frontend `/register` page and selects one or more roles
2. **Login**: User logs in via `/api/user/login` and receives JWT token
3. **Authorization**: Include JWT token in `Authorization: Bearer <token>` header for protected endpoints
4. **Validation**: JwtFilter validates token on each request

### Security Features

- **Password Encoding**: BCrypt password hashing
- **JWT Tokens**: Stateless authentication
- **CORS**: Cross-Origin Resource Sharing enabled
- **Role-Based Access**: Configurable role-based endpoint protection
- **Input Validation**: Jakarta Bean Validation on all inputs

### Security Configuration

The application uses Spring Security with:
- JWT-based stateless authentication
- CSRF disabled (suitable for REST APIs)
- Custom UserDetailsService for user loading
- JwtFilter for token validation
- Public backend user endpoints under `POST /api/user/**`
- All other backend endpoints currently restricted to users with the `ADMIN` role

## 🐛 Error Handling

Global exception handling via `GlobalExceptionHandler` provides consistent error responses for:
- Validation errors (400 Bad Request)
- Resource not found (404 Not Found)
- Authentication errors (401 Unauthorized)
- General server errors (500 Internal Server Error)

## 📝 Logging

Logging is configured via `logback.xml` in `src/main/resources/`. Logs include:
- Application startup and shutdown
- HTTP requests and responses
- Database operations
- Security events
- Error stack traces

---

## 🎨 Frontend Documentation

### Routes

The frontend provides the following pages and routes:

| Route                | Description                                 | Auth Required |
|----------------------|---------------------------------------------|---------------|
| `/`                  | Redirects to login or dashboard             | -             |
| `/login`             | Login page (username & password)            | ❌            |
| `/register`          | Registration page with role selection       | ❌            |
| `/dashboard`         | Dashboard overview & statistics             | ✅            |
| `/projects`          | Projects table with CRUD operations         | ✅            |
| `/projects/add`      | Add new project form                        | ✅            |
| `/projects/[id]`     | Project detail view with tasks              | ✅            |
| `/projects/edit/[id]`| Edit project form                           | ✅            |
| `/tasks`             | Tasks table with CRUD operations            | ✅            |
| `/tasks/[id]`        | Task detail view                            | ✅            |
| `/users`             | Users table with CRUD operations            | ✅            |
| `/users/add`         | Add new user form                           | ✅            |
| `/users/[id]`        | User detail view                            | ✅            |
| `/users/edit/[id]`   | Edit user form                              | ✅            |
| `/activity`          | Activity log (paginated, searchable)        | ✅            |

### Components

#### Layout Components
- **DashboardLayout** - Main layout wrapper with sidebar navigation
- **Sidebar** - Navigation sidebar with menu items and user info

#### UI Components
- **Button** - Reusable button with variants (primary, secondary, danger, etc.)
- **Modal** - Popup dialog for confirmations and forms
- **DataTable** - Paginated table with sorting and filtering
- **Card** - Content container with consistent styling
- **Form Controls** - Input, Select, Textarea with validation states
- **Loading** - Spinner and skeleton loaders
- **Toast** - Notification messages

#### Features
- **Route Protection** - Middleware allows `/login` and `/register`, and redirects unauthorized users from protected routes
- **API Integration** - Axios client with automatic JWT token injection
- **Data Caching** - React Query manages server state and cache invalidation
- **Form Validation** - React Hook Form with Zod schema validation
- **Responsive Design** - Mobile-first approach with Tailwind breakpoints

### State Management

- **Server State**: Managed by React Query for API data
- **Auth State**: JWT stored in browser storage and mirrored in a client-set cookie for middleware checks
- **Form State**: Managed by React Hook Form
- **Client State**: React hooks for local component state
