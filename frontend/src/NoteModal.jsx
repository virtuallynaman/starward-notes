import { useEffect, useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import Toolbar from "./Toolbar";
import { useNotes } from "./NotesProvider";
import { useAuth } from "./AuthProvider"
import { formatDistanceToNow, format, isToday, isThisYear } from "date-fns";
import { toast } from "sonner";

function NoteModal({ isOpen, onClose, note, isAutoSave }) {
    const [noteId, setNoteId] = useState(note?.id || null);
    if (!note) return null;

    const [prevTitle, setPrevTitle] = useState(note?.title);
    const [prevBody, setPrevBody] = useState(note?.body);
    const [title, setTitle] = useState(note?.title || "");
    const [body, setBody] = useState(note?.body || "");

    const { user } = useAuth();
    const noteDate = note?.date || "now";
    const [bgColor, setBgColor] = useState(note?.color || "#202124")

    const { notes, setNotes } = useNotes();

    const formattedDate = (() => {
        if (noteDate === "now") { return `Created Now` };
        const date = new Date(noteDate);
        const now = new Date();
        const timeDiff = (now - date) / (1000 * 60 * 60);

        if (timeDiff < 5) {
            return `Edited ${formatDistanceToNow(date, { addSuffix: true })}`;
        } else if (isToday(date)) {
            return `Edited Today, ${format(date, "h:mm a")}`;
        } else if (isThisYear(date)) {
            return `Edited ${format(date, "d MMM, h:mm a")}`;
        } else {
            return `Edited ${format(date, "dd MM y, h:mm a")}`;
        }
    }
    )();

    useEffect(() => {
        if (!user) {
            return;
        }
        if (!noteId) {
            createNote();
        }
        else if (isAutoSave) {
            const timer = setTimeout(() => {
                updateNote();
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [title, body, isAutoSave, user]);

    const createNote = async () => {
        try {
            const newNote = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/notes`, { title, body }, { headers: { 'Authorization': `Bearer ${user.accessToken}` } });
            setNotes(prevNotes => [newNote.data, ...prevNotes]);
            setNoteId(newNote.data.id);
            console.log("Note posted:", newNote);
            console.log("new note:", newNote);
            console.log("new note id:", newNote.data.id);
            console.log("note id:", noteId);
        } catch (err) {
            console.error("Error creating a new note:", err);
            toast.error(`${err.message || "Something went wrong."}`);
        }
    }

    const updateNote = async () => {
        if (title !== prevTitle || body !== prevBody) {
            try {
                await axios.patch(`${import.meta.env.VITE_BASE_URL}/api/notes/${noteId}/content`, { title, body }, { headers: { 'Authorization': `Bearer ${user.accessToken}` } });
                setPrevTitle(title);
                setPrevBody(body)
                setNotes(prevNotes =>
                    prevNotes.map(note =>
                        note.id === noteId ? { ...note, title, body } : note
                    )
                )
                toast.success("Note updated successfully!");
            } catch (err) {
                console.error("Error saving note:", err);
                toast.error(`${err.message || "Something went wrong."}`);
            }
        }
    };

    const updateNoteProperties = async (previousProperty, updatedProperty) => {
        if (!user) {
            return;
        }
        try {
            await axios.patch(`${import.meta.env.VITE_BASE_URL}/api/notes/${noteId}/properties`, { ...updatedProperty }, { headers: { "Authorization": `Bearer ${user.accessToken}` } });
            console.log("updating property:", updatedProperty);
            setNotes(prevNotes =>
                prevNotes
                    .map(note => note.id === noteId ? { ...note, ...updatedProperty } : note)
                    .filter(note => !(note.id === noteId && (previousProperty.archived || updatedProperty.archived)))
                    .filter(note => !(note.id === noteId && (previousProperty.trashed || updatedProperty.trashed)))
            );
            (previousProperty.archived || updatedProperty.archived || previousProperty.trashed || updatedProperty.trashed) && handleClose();
            if (previousProperty.pinned !== updatedProperty.pinned) {
                toast.success(updatedProperty.pinned ? "Note pinned." : "Note unpinned.");
            }
            if (previousProperty.archived !== updatedProperty.archived) {
                toast.success(updatedProperty.archived ? "Note archived." : "Note unarchived.");
            }
            if (previousProperty.trashed !== updatedProperty.trashed) {
                toast.success(updatedProperty.trashed ? "Note moved to trash." : "Note restored from trash.")
            }
        } catch (err) {
            console.error("Error updating note property", err);
            toast.error(`${err.message || "Something went wrong."}`);
        }
    }

    const deleteForever = async (noteId) => {
        if (!user) {
            return;
        }
        try {
            await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/notes/${noteId}`, { headers: { "Authorization": `Bearer ${user.accessToken}` } });
            onClose();
            console.log("deleted forever");
            setNotes(prevNotes =>
                prevNotes.filter(note => note.id !== noteId)
            );
            toast.success("Note deleted.");
        } catch (err) {
            console.error("Error deleting note", err);
            toast.error(`${err.message || "Something went wrong."}`);
        }
    }

    const handleClose = async () => {
        if (noteId && title.trim() === "" && body.trim() === "") {
            deleteForever(noteId);
        } else {
            updateNote();
            onClose();
        }
    };

    return (
        <div>
            <Modal
                isOpen={isOpen}
                onRequestClose={handleClose}
                className="note-view"
                overlayClassName={"note-modal-overlay"}
                style={{
                    content: {
                        background: bgColor
                    }
                }}
            >
                <input
                    type="text"
                    className={`title ${note.trashed ? "disable-editing" : ""}`}
                    value={title === " " ? "" : title}
                    disabled={note.trashed}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={title.trim() === "" ? "Title" : title}
                />
                <textarea
                    className={`body ${note.trashed ? "disable-editing" : ""}`}
                    value={body}
                    disabled={note.trashed}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Write something"
                />
                <p className="date">{formattedDate}</p>
                <div className="controls">
                    <Toolbar note={note} noteId={noteId} updateNoteProperties={updateNoteProperties} deleteForever={deleteForever} setBgColor={setBgColor} />
                    <button className="note-close-btn" onClick={handleClose}>Close</button>
                </div>
            </Modal>
        </div>
    );
}
export default NoteModal;