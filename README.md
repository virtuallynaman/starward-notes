# Starward Notes

A simple and minimal note-taking web app built with the PERN stack. Features autosave, note pinning, archiving, background colors, and JWT-based user authentication.

## ✨ Features

- JWT-based user authentication (Signup / Login)
- Autosave notes while typing
- Pin, archive, and delete notes
- Assign background colors to notes
- Search notes by content
- Organized views: All, Pinned, Archived, Trash
- Hosted on Vercel

## 🛠 Tech Stack

- **Frontend:** React, CSS
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Authentication:** JWT
- **Deployment:** Vercel

## 🚀 Getting Started

### 1. Clone the repository
```
git clone https://github.com/virtuallynaman/starward-notes.git
cd starward-notes
```

### 2. Setup Backend
```
cd backend
npm install

Create a .env file inside the backend folder:

DATABASE_URL=your_postgres_connection_url
JWT_SECRET=your_jwt_secret

Start the backend server:

npm run dev
```

### 3. Setup Frontend
```
Open a new terminal tab/window:

cd frontend
npm install
npm start
```
The frontend will run at http://localhost:5173 and the backend at http://localhost:5000 (or your configured ports).

## 🌐 Live Demo

🔗 [View Live on Vercel](https://starward-notes.vercel.app/signup)

## 📸 Screenshots

*Coming soon*

## 🙌 Credits

Background from [StockSnap](https://www.stocksnap.io/) - used under free-to-use license (author unknown; to be updated)

## 📄 License
MIT