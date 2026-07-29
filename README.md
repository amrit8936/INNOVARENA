# INNOVARENA ⚡ (Beginner-Friendly Version)

**One Platform for Every Hackathon** — a modern MERN stack project designed to help you learn full-stack development while building an innovative hackathon management platform.

This is a beautiful, beginner-friendly version that showcases best practices in React, Express, and MongoDB. Clean code, clear structure, and plenty of learning opportunities.

## ✨ Features Included

- User Signup / Login with JWT authentication (roles: `participant`, `organizer`)
- Organizers can create hackathons
- Participants can browse hackathons and create a team
- Simple dashboard (different view for organizer vs participant)
- Clean folder structure (`client` = React frontend, `server` = Express backend)

> Not included (kept out to stay beginner-simple): admin panel, judges/reviews,
> file uploads, leaderboard scoring, email notifications. You can add these later
> once you're comfortable with the basics — the folder structure already leaves
> room for them (e.g. `Submission` model is ready for a "My Submissions" feature).

## 🛠 Tech Stack

- **Frontend:** React (Vite), React Router, Axios, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Auth:** JWT + bcrypt

## 📁 Folder Structure

INNOVARENA/
├── client/          # React frontend (Vite)
│   └── src/
│       ├── components/    # Reusable UI components
│       ├── context/       # React Context for state management
│       ├── pages/         # Page components
│       └── services/      # API service layer
├── server/          # Express backend
│   ├── config/      # Database configuration
│   ├── middleware/  # Authentication & middleware
│   ├── models/      # Mongoose schemas
│   └── routes/      # API routes
└── README.md
```

## 🚀 Getting Started

### 1. Backend Setup

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env` and set your MongoDB connection string (a free local MongoDB or
[MongoDB Atlas](https://www.mongodb.com/atlas) both work):

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/innovarena
JWT_SECRET=your_secret_key_here
```

Start the backend:

```bash
npm run dev
```

The API will run at `http://localhost:5000`.

### 2. Frontend Setup

Open a **new terminal**:

```bash
cd client
npm install
npm run dev
```

The app will run at `http://localhost:5173`.

## 🔑 How to Use

1. Go to `http://localhost:5173`
2. Click **Signup** and create an account — choose role **Organizer** or **Participant**
3. If you're an **Organizer**: go to your Dashboard and create a hackathon
4. If you're a **Participant**: browse Hackathons, open one, and create a team

## 📡 API Endpoints (quick reference)

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/profile` | Get logged-in user (needs token) |
| GET | `/api/hackathons` | List all hackathons |
| GET | `/api/hackathons/:id` | Get one hackathon |
| POST | `/api/hackathons` | Create hackathon (organizer only) |
| PUT | `/api/hackathons/:id` | Edit hackathon (organizer only) |
| DELETE | `/api/hackathons/:id` | Delete hackathon (organizer only) |
| POST | `/api/teams` | Create a team |
| GET | `/api/teams/my` | Get my teams |
| POST | `/api/submissions` | Submit a project |
| GET | `/api/submissions/hackathon/:id` | Get submissions for a hackathon |

## 🌱 Ideas to Extend This Project (great practice!)

- Add a "Submit Project" page for teams (the backend route is already there!)
- Add an Admin role that can view/delete any user or hackathon
- Add a Judge role with a scoring form
- Add a leaderboard page that ranks teams by score
- Add profile picture upload with Multer
- Add pagination and filters on the Hackathons page

Have fun building! 🎉
"# INNOVARENA" 
