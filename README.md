# Job Portal — Frontend

React.js frontend for a full-stack MERN job portal where students can search and apply for jobs, and recruiters can post and manage listings.

## 🌐 Live Demo
https://job-portal-frontend-virid-nine.vercel.app

## 🔗 Backend Repo
https://github.com/nehakumbhar2005-sudo/job-portal-backend

## 🛠 Tech Stack
- React.js (Vite)
- Redux Toolkit
- Tailwind CSS
- React Router DOM
- Axios
- React Hot Toast

## ✨ Features
### Student
- Register/Login with JWT auth
- Browse and search jobs by keyword
- View job details
- Apply for jobs
- Track application status (pending/accepted/rejected)
- Update profile and skills

### Recruiter
- Register/Login with JWT auth
- Create company profile
- Post and delete jobs
- View all applicants per job
- Accept or reject applications

## 📁 Folder Structure
src/

├── components/

│   ├── auth/         # Login, Register

│   └── shared/       # ProtectedRoute

├── pages/            # All pages

├── redux/            # Redux slices and store

└── utils/            # API constants

## 🚀 Run Locally
npm install

npm run dev
