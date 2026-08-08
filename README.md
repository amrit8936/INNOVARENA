#  INNOVARENA — Hackathon Management Platform

A full-stack MERN web application for managing hackathons end-to-end — from creation and registration to judging and results.

##  Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js + Vite + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| HTTP Client | Axios |

---

##  User Roles

| Role | Permissions |
|---|---|
| **Admin** | Manage all users (view/edit/block/delete), view all teams & submissions, platform analytics |
| **Organizer** | Create & manage hackathons, approve/reject registrations, assign judges, publish winners |
| **Participant** | Register for hackathons, create/join teams, submit projects, view results |
| **Judge** | View assigned submissions, score on 5 criteria, provide feedback |

---

## 📂 Folder Structure

```
INNOVARENA/
├── client/                  # React frontend
│   └── src/
│       ├── components/      # Navbar, ProtectedRoute, Loader, etc.
│       ├── context/         # AuthContext (global auth state)
│       ├── pages/           # All page components
│       └── services/        # Axios API instance
│
└── server/                  # Node/Express backend
    ├── config/              # MongoDB connection
    ├── middleware/          # JWT auth + role guards
    ├── models/              # Mongoose schemas
    └── routes/              # API routes
```

---

##  Database Collections

- **Users** — name, email, password (hashed), role, college, isBlocked
- **Hackathons** — title, description, theme, mode, dates, prizes, judges, winners
- **Teams** — teamName, leader, members, hackathon, status
- **Registrations** — user, hackathon, status (pending/approved/rejected)
- **Submissions** — projectName, team, hackathon, githubLink, score, status
- **Reviews** — judge, submission, hackathon, 5 criteria scores, feedback

---

##  Pages

| Page | Route | Access |
|---|---|---|
| Home | `/` | Public |
| Hackathon Listing | `/hackathons` | Public |
| Hackathon Details | `/hackathons/:id` | Public |
| Leaderboard | `/leaderboard/:hackathonId` | Public |
| Login | `/login` | Public |
| Signup | `/signup` | Public |
| Dashboard | `/dashboard` | 🔒 Logged In |
| Profile | `/profile` | 🔒 Logged In |
| Team Management | `/teams` | 🔒 Logged In |
| Submit Project | `/submit` | 🔒 Logged In |
| Not Found | `*` | Public |

---

## 🔌 API Endpoints

### Auth (`/api/auth`)
- `POST /signup` — Register new user
- `POST /login` — Login
- `GET /profile` — Get own profile (protected)
- `PUT /profile` — Update own profile (protected)
- `GET /users` — All users (admin only)
- `PUT /users/:id` — Edit user (admin only)
- `PUT /users/:id/block` — Block/Unblock user (admin only)
- `DELETE /users/:id` — Delete user (admin only)
- `GET /stats` — Platform stats (admin only)

### Hackathons (`/api/hackathons`)
- `GET /` — List all hackathons
- `GET /:id` — Single hackathon
- `POST /` — Create hackathon (organizer)
- `PUT /:id` — Edit hackathon (organizer)
- `DELETE /:id` — Delete hackathon (organizer)
- `PUT /:id/toggle-registration` — Open/close registration (organizer)
- `PUT /:id/assign-judge` — Assign judge by email (organizer)
- `DELETE /:id/remove-judge/:judgeId` — Remove judge (organizer)
- `PUT /:id/publish-winners` — Publish winners (organizer)

### Teams (`/api/teams`)
- `GET /my` — My teams
- `GET /` — All teams (protected)
- `POST /` — Create team
- `PUT /:id/join` — Join team
- `PUT /:id/leave` — Leave team
- `PUT /:id/transfer-leader` — Transfer leadership
- `DELETE /:id` — Delete team (leader only)

### Registrations (`/api/registrations`)
- `POST /:hackathonId` — Register for hackathon
- `GET /my` — My registrations
- `GET /hackathon/:hackathonId` — All registrations for a hackathon (organizer)
- `PUT /:id/status` — Approve/reject registration (organizer)
- `DELETE /:hackathonId/cancel` — Cancel registration

### Submissions (`/api/submissions`)
- `GET /` — All submissions (protected)
- `GET /my` — My team's submissions
- `GET /hackathon/:hackathonId` — Submissions for a hackathon (leaderboard)
- `POST /` — Submit project
- `PUT /:id` — Edit submission (before review)

### Reviews (`/api/reviews`)
- `POST /` — Submit review (judge)
- `GET /hackathon/:hackathonId` — Reviews for leaderboard
- `GET /my` — Judge's own reviews

---

## ⚙️ Setup & Run

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### 1. Install dependencies
```bash
# From project root
npm install

# Install backend
cd server && npm install

# Install frontend
cd ../client && npm install
```

### 2. Configure environment
Create `server/.env`:
```env
MONGO_URI=mongodb://localhost:27017/innovarena
JWT_SECRET=your_jwt_secret_here
PORT=5000
ALLOW_ADMIN_SIGNUP=true
```

### 3. Run the app
```bash
# Terminal 1 – Start backend
cd server && npm run dev

# Terminal 2 – Start frontend
cd client && npm run dev
```

Open `http://localhost:5173` in your browser.

---

## ✨ Features

- ✅ JWT Authentication + Role-based Authorization
- ✅ Protected Routes
- ✅ CRUD for Hackathons, Teams, Registrations, Submissions, Reviews
- ✅ Search + Filter hackathons (mode, status, registration status)
- ✅ Multi-criteria Judging (Innovation, Technical, Design, Functionality, Presentation)
- ✅ Leaderboard (ranked by score)
- ✅ Team leadership transfer
- ✅ Registration cancel
- ✅ Admin: edit/block/delete users + view all teams/submissions
- ✅ Organizer: assign judges, publish winners, toggle registration
- ✅ Responsive design with Tailwind CSS
- ✅ Loading states + Empty states + Error handling

---

Built with ❤️ using the MERN Stack.
