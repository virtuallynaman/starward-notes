import { useParams } from "react-router-dom";
import { NotesContext } from "./NotesContext";
import { useContext } from "react";

function NoteDetails() {
    const { id } = useParams();
    const { notes } = useContext(NotesContext);
    const note = notes.find((note) => note.id === parseInt(id));
    if (!note) {
        return <p>Note not found. Please go back to the Homepage.</p>;
    }
    return (
        <div className="note-details">
            <h1>{note.title}</h1>
            <p>{note.body}</p>
        </div>
    );
}
export default NoteDetails;