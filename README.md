# 🎓 CampusConnect

This project was created for the **Happiness Center of Amity University**.

CampusConnect is a full-stack college networking platform designed to help students discover opportunities, connect with talented peers, and grow together as a community.

---

# 👨‍💻 Contributors

| Name | Degree | University |
|-----|-----|-----|
| Anant Arora | B.Tech CSE (Data Science) | Amity University |
| Shriya Dwivedi | B.Tech CSE (Data Science) | Amity University |

Developed under the guidance of **Prof. Nitin Arora, Amity University**

---

# 🌐 Live Links

| Service | URL |
|------|------|
| Frontend (Vercel) | https://talent-nectar-92.vercel.app |
| Backend API (Render) | https://campusconnect-backend-dc2d.onrender.com |
| Database | Supabase — aws-1-ap-southeast-2 |
| GitHub | https://github.com/Anant-Arora/CampusConnect |

---

# 📋 Table of Contents

- About the Project
- Features
- Tech Stack
- System Architecture
- Folder Structure
- Database Schema
- Environment Variables
- Local Development Setup
- Deployment
- Security
- License

---

# 📖 About the Project

CampusConnect solves a real problem faced by college students — the lack of a dedicated space to connect, collaborate, and grow professionally within their college community.

### Problems it Solves

| Problem | Solution |
|------|------|
| No dedicated student networking platform | Community Feed for sharing and connecting |
| Hard to find talented peers | Find CEO — search students by skill |
| No centralized place for student opportunities | Opportunities section for internships and jobs |
| Difficult to reach peers directly | Real-time one-to-one messaging |
| LinkedIn is too professional for students | Built specifically for college students |

---

# ✨ Features

## 🔐 Authentication

- Multi-step registration (Personal Info → Academic Details → Interests & Skills)
- Secure login with email and password
- JWT based authentication
- Password hashing using bcrypt
- Persistent sessions
- Auto redirect to dashboard if already logged in

---

## 📰 Community Feed

- Create and share posts
- Support for text, image URLs, and external links
- Like / Unlike posts
- Comment system
- Share post links
- Search posts by student name

---

## 💼 Opportunities

Students can browse:

- Internships
- Full-time jobs
- Hackathons
- Research opportunities

Features include:

- Search by title, company, or skill
- Filter by opportunity type
- Bookmark opportunities
- Post new opportunities
- External apply links

---

## 🔍 Find CEO (Skill Search)

- Search students by skill or name
- View student profiles
- See skills and education details
- Online / Offline status
- Direct message option

---

## 💬 Messaging

- One-to-one chat
- Conversation list
- Last message preview
- Unread message count
- Chat bubbles for sent and received messages

---

## 🔔 Notifications

- Notification bell with unread count
- Alerts for likes, comments, and messages
- Dropdown preview
- Dedicated notifications page
- Auto mark-as-read functionality

---

## ⚙️ Settings

Users can:

- Edit profile information
- Update bio and skills
- Change password
- Update profile picture URL
- Delete account securely

---

# 🛠️ Tech Stack

| Category | Technology | Purpose |
|--------|-----------|--------|
| Frontend | React | UI component library |
| Frontend | TypeScript | Type safety |
| Frontend | Vite | Build tool and development server |
| Frontend | Tailwind CSS | Utility-first styling framework |
| Frontend | shadcn/ui | Pre-built accessible UI components |
| Frontend | React Router | Client-side routing |
| Frontend | TanStack Query | Server state management and caching |
| Frontend | Axios | HTTP client for API calls |
| Frontend | Lucide React | Icon library |
| Backend | Node.js | JavaScript runtime |
| Backend | Express.js | Backend web framework |
| Backend | TypeScript | Type safety on backend |
| Backend | Prisma ORM | Database ORM and query management |
| Backend | bcryptjs | Password hashing |
| Backend | JSON Web Token (JWT) | Authentication tokens |
| Backend | CORS | Cross-origin request handling |
| Backend | dotenv | Environment variable management |
| Database & Cloud | Supabase (PostgreSQL) | Primary database |
| Database & Cloud | Vercel | Frontend hosting |
| Database & Cloud | Render | Backend hosting |
| Database & Cloud | GitHub | Version control |

---

# 🏗️ System Architecture

```
User Browser
      │
      ▼
Frontend (Vercel)
React + TypeScript + Vite
      │
      ▼
Backend (Render)
Node.js + Express + Prisma
      │
      ▼
Database (Supabase)
PostgreSQL
```

---

# 📁 Folder Structure

```
CampusConnect
│
├── backend
│   ├── prisma
│   │   └── schema.prisma
│   ├── src
│   │   ├── server.ts
│   │   ├── routes
│   │   │   ├── auth.ts
│   │   │   ├── users.ts
│   │   │   ├── posts.ts
│   │   │   ├── opportunities.ts
│   │   │   ├── messages.ts
│   │   │   └── notifications.ts
│   │   ├── middleware
│   │   │   └── auth.ts
│   │   └── lib
│   │       └── prisma.ts
│
├── src
│   ├── components
│   ├── contexts
│   ├── hooks
│   ├── lib
│   ├── pages
│   ├── types
│   ├── App.tsx
│   └── main.tsx
│
├── public
├── package.json
├── tsconfig.json
└── README.md
```

---

# 🗄️ Database Schema

Main tables used in the application:

- User
- Post
- PostLike
- PostComment
- Opportunity
- SavedOpportunity
- Conversation
- Message
- Notification

Database is managed using **Prisma ORM with Supabase PostgreSQL**.

---

# 💻 Local Development Setup

### 1. Clone Repository

```
git clone https://github.com/Anant-Arora/CampusConnect.git
cd CampusConnect
```

### 2. Setup Backend

```
cd backend
npm install
```

Run migrations:

```
npx prisma migrate deploy
npx prisma generate
```

Start backend server:

```
npm run dev
```

Backend runs at:

```
http://localhost:5000
```

---

### 3. Setup Frontend

Open new terminal:

```
cd CampusConnect
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:8080
```

---

# 🚀 Deployment

## Frontend — Vercel

| Setting | Value |
|------|------|
| Framework | Vite |
| Root Directory | ./ |
| Build Command | npm run build |
| Output Directory | dist |

---

## Backend — Render

| Setting | Value |
|------|------|
| Root Directory | backend |
| Build Command | npm install && npm run build |
| Start Command | npm start |

---

# 🔐 Security

- Passwords hashed using bcrypt
- JWT authentication
- Tokens expire after 7 days
- Protected API routes
- CORS protection
- Environment variables secured
- `.gitignore` prevents secret leakage

---

# 📄 License

This project was developed for **academic purposes at Amity University** under the Amity Happiness Center initiative.

© 2026 CampusConnect — Anant Arora & Shriya Dwivedi
