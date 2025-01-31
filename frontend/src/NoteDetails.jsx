import { useParams } from "react-router-dom";
import { NotesContext } from "./NotesContext";
import { useContext, useEffect, useState } from "react";
import axios from "axios";

function NoteDetails() {
    const { id } = useParams();
    const { notes, setNotes } = useContext(NotesContext);
    const note = notes.find((note) => note.id === parseInt(id));

    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");

    useEffect(() => {
        if (note) {
            setTitle(note.title);
            setBody(note.body);
        }
    }, [note]);

    if (!note) {
        return <p>Note not found. Please go back to the Homepage.</p>;
    }

    return (
        <div className="note-details">
            <input
                type="text"
                className="title"
                value={title || ""}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={title.trim() === "" ? "Untitled": ""}
            />
            <textarea
                className="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write something"
            />
        </div>
    );
}
export default NoteDetails;