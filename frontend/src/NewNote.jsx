import { NotesContext } from "./NotesContext";
import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function NewNote() {
    const { notes, setNotes } = useContext(NotesContext);
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const navigate = useNavigate();

    const handleSave = async () => {
        const newNote = {title: title || " ", body};
        
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/notes`, newNote);
            setNotes([response.data, ...notes]);
            navigate(`/note/${response.data.id}`);
        } catch (err) {
            console.error("Error saving note", err);
        }
    };

    return (
        <div className="new-note">
            <input
                type="text"
                placeholder="Insert title here"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
                placeholder="Write your note here..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required 
            />
            <button onClick={handleSave}>Save</button>
        </div>
    );
}
export default NewNote;