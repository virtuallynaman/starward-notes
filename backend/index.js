import express from "express";
import pg from "pg";
import cors from "cors";
import "dotenv/config"

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors({
    origin: [process.env.CLIENT_URL],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type'],
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Database setup
const db = new pg.Client({
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.PORT
});

db.connect()
    .then(console.log("Connected to the database"))
    .catch((err) => console.error("Database connection error", err));

// Get all the notes
async function getAllNotes(sortOrder) {
    const result = await db.query(`SELECT * FROM notes ORDER BY date ${sortOrder};`);
    return result.rows;
}

// Get a specific note by its id
async function getNotesByID(id) {
    const result = await db.query("SELECT * FROM notes WHERE id = $1;", [id]);
    return result.rows[0];
}

// Get all the notes route
app.get("/api/notes", async (req, res) => {
    const sortOrder = req.query.sortOrder === "ASC" ? "ASC" : "DESC";
    try {
        const notes = await getAllNotes(sortOrder);
        res.status(200).json(notes);
    } catch (err) {
        console.error("Error fetching notes:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get a specific note route
app.get("/api/notes/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid note ID" });
    }
    try {
        const note = await getNotesByID(id);
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }
        return res.status(200).json(note);
    } catch (err) {
        console.error("Error fetching note", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Post a new note
app.post("/api/notes", async (req, res) => {
    const { title, body } = req.body;
    if (!title || !body) {
        return res.status(400).json({ message: "Title and body are required" });
    }

    try {
        await db.query("INSERT INTO notes(title, body) VALUES($1, $2);", [title, body]);
        res.status(201).json({ message: "Note created successfully" });
    } catch (err) {
        console.error("Error saving note", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Update a note
app.patch("/api/notes/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const { title, body } = req.body;

    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid note ID" });
    }

    if (!title || !body) {
        return res.status(400).json({ message: "At least one field (title or body) must be provided to update" });
    }

    try {
        const note = await getNotesByID(id);
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }

        await db.query("UPDATE notes SET title = COALESCE($1, title), body = COALESCE($2, body) WHERE id = $3;", [title, body, id]);
        res.status(200).json({ message: "Note updated successfully" });
    } catch (err) {
        console.error("Error updating note", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Delete a note
app.delete("/api/notes/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid note ID" });
    }

    try {
        const note = await getNotesByID(id);
        if (!note) {
            return res.status(404).json({ message: " Note not found" });
        }

        await db.query("DELETE FROM notes WHERE id = $1;", [id]);
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