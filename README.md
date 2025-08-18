# SkillShare

A full-stack web application where users can share their skills, request to learn from others, and exchange skills in a collaborative way.  
Built using **Next.js/React (frontend)** and **Express.js, Node.js, MongoDB (backend)**.

---

##  Features
- **User Authentication**: Secure login and signup with JWT and bcrypt.
- **Skill Management**:
  - Post new skills with title, description, category, and level.
  - Browse all available skills posted by other users.
- **Skill Requests**:
  - Request to **learn** a skill.
  - Request a **skill exchange** by offering another skill in return.
  - Accept or reject skill requests.
- **Connections**:
  - Create connections when skill requests are accepted.
  - View all your active connections.
  - Update connection status or remove connections.
- **Real-time Updates** (via MongoDB queries & population):
  - Skill requests and connection updates reflect instantly.

---

## Tech Stack
**Frontend:**
- Next.js (React)
- Tailwind CSS
- Axios for API requests
- Lucide-react (icons)

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- Dotenv for environment variables

---

## Project Structure
```
skillshare/
│── backend/ # Node.js + Express backend
│ ├── controllers/ # Business logic
│ ├── models/ # MongoDB schemas
│ ├── routes/ # API routes
│ ├── middleware/ # Auth middlewares
│ └── server.js # Entry point
│
│── frontend/ # Next.js frontend
│ ├── app/ # App router
│ ├── components/ # Reusable UI components
│ ├── utils/ # Helper functions
│ └── public/ # Static files
```


---

## Installation

### Clone repository
```bash
git clone https://github.com/yourusername/skillshare.git
cd skillshare
Backend Setup
cd backend
npm install
npm run dev

create .env file
PORT=5000
MONGO_URI=your-mongo-db-uri
JWT_SECRET=your-secret-key

Frontend Setup
cd frontend
npm install
npm run dev
```
 **Live Demo**: [Click here to view the deployed app](https://skill-share-iota.vercel.app/)
