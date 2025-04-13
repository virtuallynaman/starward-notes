import express from "express";
import pg from "pg";
import cors from "cors";
import "dotenv/config";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import requireAuth from "./middleware/requireAuth.js";

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors({
    origin: [process.env.CLIENT_URL],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Database setup
const db = new pg.Client({
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

db.connect()
    .then(console.log("Connected to the database"))
    .catch((err) => console.error("Database connection error", err));


// Create a new user
async function createUser(name, email, hashedPassword) {
    const result = await db.query("INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING *;", [name, email, hashedPassword]);
    return result.rows[0];
}

// Signup route 
app.post("/auth/signup", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name.trim() || !email.trim() || !password.trim()) {
        return res.status(400).json({ error: true, message: "Please fill all the fields." })
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ error: true, message: "Please enter a valid email address." });
    }

    if (!validator.isStrongPassword(password)) {
        return res.status(400).json({ error: true, message: "Password is not strong enough." });
    }

    try {
        const isUser = await db.query("SELECT * FROM users WHERE email = $1;", [email]);

        if (isUser.rows.length > 0) {
            return res.status(400).json({ error: true, message: "This user already exists. Try logging in instead." })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await createUser(name, email, hashedPassword);

        const accessToken = jwt.sign(
            { id: user.id, email: user.email },
            process.env.SECRET_KEY,
            { expiresIn: '3d' }
        );

        res.status(201).json({ error: false, message: "Registered successfully.", email, accessToken });
    } catch (err) {
        console.error("Error signing up", err);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});

// Login route
app.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email.trim() || !password.trim()) {
        return res.status(400).json({ error: true, message: "Please fill all the fields." });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ error: true, message: "Please enter a valid email address." });
    }

    try {
        const result = await db.query("SELECT * FROM users WHERE email = $1;", [email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(400).json({ error: true, message: "User not found. Please sign up first" });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(400).json({ error: true, message: "Incorrect password." });
        }

        const accessToken = jwt.sign(
            { id: user.id, email: user.email },
            process.env.SECRET_KEY,
            { expiresIn: '3d' }
        );

        return res.status(200).json({ error: false, message: "Logged in successfully", email, accessToken });
    } catch (err) {
        console.error("Error logging in", err);
        res.status(500).json({ error: true, message: "Internal Server Error." });
    }
})

// Auth middleware
app.use(requireAuth);

// Get all the notes except archived and trashed notes
async function getAllNotes(sortOrder, user_id) {
    const result = await db.query(`SELECT * FROM notes WHERE archived = FALSE AND trashed = FALSE AND user_id = $1 ORDER BY date ${sortOrder};`, [user_id]);
    return result.rows;
}

// Get all the archived notes
async function getArchivedNotes(sortOrder, user_id) {
    const result = await db.query(`SELECT * FROM notes WHERE archived = TRUE AND trashed = FALSE AND user_id = $1 ORDER BY date ${sortOrder};`, [user_id]);
    return result.rows;
}

// Get all the trashed notes
async function getTrashedNotes(sortOrder, user_id) {
    const result = await db.query(`SELECT * FROM notes WHERE trashed = TRUE AND user_id = $1 ORDER BY date ${sortOrder};`, [user_id]);
    return result.rows;
}

// Get a specific note by its id
async function getNotesByID(id, user_id) {
    const result = await db.query("SELECT * FROM notes WHERE id = $1 AND user_id = $2;", [id, user_id]);
    return result.rows[0];
}

// Get all the notes route
app.get("/api/notes", async (req, res) => {
    const { noteType, sortOrder } = req.query;
    const user_id = req.user.id;

    if (sortOrder !== 'ASC' && sortOrder !== 'DESC') {
        sortOrder = 'DESC';
    }

    const getNotesFunctionsMap = {
        all: getAllNotes,
        archived: getArchivedNotes,
        trashed: getTrashedNotes,
    }

    const getNotesFunction = getNotesFunctionsMap[noteType] || getAllNotes;

    try {
        const notes = await getNotesFunction(sortOrder, user_id);
        res.status(200).json(notes);
    } catch (err) {
        console.error("Error fetching notes:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get a specific note route
app.get("/api/notes/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const user_id = req.user.id;

    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid note ID" });
    }
    try {
        const note = await getNotesByID(id, user_id);
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }
        return res.status(200).json(note);
    } catch (err) {
        console.error("Error fetching note", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Create a new note
app.post("/api/notes", async (req, res) => {
    const { title, body } = req.body;
    const user_id = req.user.id;

    try {
        const newNote = await db.query("INSERT INTO notes(title, body, user_id) VALUES($1, $2, $3) RETURNING *;", [title, body, user_id]);
        res.status(201).json(newNote.rows[0]);
    } catch (err) {
        console.error("Error saving note", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Update note content
app.patch("/api/notes/:id/content", async (req, res) => {
    const id = parseInt(req.params.id);
    const { title, body } = req.body;
    const user_id = req.user.id;

    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid note ID" });
    }

    try {
        const note = await getNotesByID(id, user_id);
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }

        await db.query("UPDATE notes SET title = COALESCE($1, title), body = COALESCE($2, body), date = NOW() WHERE id = $3 AND user_id = $4", [title, body, id, user_id]);
        res.status(200).json({ message: "Note updated successfully" });
    } catch (err) {
        console.error("Error updating note", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Update note properties 
app.patch("/api/notes/:id/properties", async (req, res) => {
    const id = parseInt(req.params.id);
    const { pinned, archived, color, trashed } = req.body;
    const user_id = req.user.id;

    try {
        const note = await getNotesByID(id, user_id);
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }

        await db.query("UPDATE notes SET pinned = COALESCE($1, pinned), archived = COALESCE($2, archived), color = COALESCE($3, color), trashed = COALESCE($4, trashed) WHERE id = $5 AND user_id = $6;", [pinned, archived, color, trashed, id, user_id])
        res.status(200).json({ message: "Note updated successfully" });
    } catch (err) {
        console.error("Error updating note properties", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
})

// Delete a note
app.delete("/api/notes/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const user_id = req.user.id;

    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid note ID" });
    }

    try {
        const note = await getNotesByID(id, user_id);
        if (!note) {
            return res.status(404).json({ message: " Note not found" });
        }

        await db.query("DELETE FROM notes WHERE id = $1 AND user_id = $2;", [id, user_id]);
        res.status(200).json({ message: "Note deleted successfully" });
    } catch (err) {
        console.error("Error deleting note", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Listen to the port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});