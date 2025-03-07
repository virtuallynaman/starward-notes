import { MdPushPin, MdOutlinePushPin } from "react-icons/md";
import { NotesContext } from "./NotesContext";
import { useContext } from "react";
import axios from "axios";

function NotePreview({ note, viewStyle, openModal }) {
    const { notes, setNotes, noteType } = useContext(NotesContext);

    const updateNoteProperties = async (previousProperty, updatedProperty) => {
        setNotes(prevNotes =>
            prevNotes.map(n =>
                n.id === note.id ? { ...n, ...updatedProperty } : n
            )
        );

        try {
            await axios.patch(`${import.meta.env.VITE_BASE_URL}/api/notes/${note.id}/properties`, { ...updatedProperty });
            console.log("updating property:", updatedProperty);
        } catch (err) {
            console.error("Error updating note property", err);

            setNotes(prevNotes =>
                prevNotes.map(n =>
                    n.id === note.id ? { ...n, ...previousProperty } : n
                )
            );
        }
    }
    return (
        <div className={viewStyle}>
            <div className={`${viewStyle}-content`} onClick={() => openModal(note)}>
                {note.title.trim() !== "" ? <p className="title">{note.title}</p> : " "}
                <p className="body">{note.body}</p>
            </div>
            { noteType === "all" && <span className="home-pin-btn" onClick={() => {
                updateNoteProperties(note.pinned, { pinned: !note.pinned });
                note.pinned = !note.pinned;
            }}>
                {note.pinned ? <MdPushPin /> : <MdOutlinePushPin />}
            </span>}
        </div>
    )
}
export default NotePreview;