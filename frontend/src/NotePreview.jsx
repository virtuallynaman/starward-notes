import { MdPushPin, MdOutlinePushPin } from "react-icons/md";
import { useNotes } from "./NotesProvider";
import axios from "axios";
import { motion } from "framer-motion";
import { useAuth } from "./AuthProvider";
import { toast } from "sonner";

function NotePreview({ note, viewStyle, openModal }) {
    const { notes, setNotes, noteType } = useNotes();
    const { user } = useAuth();

    const pinNote = async (updatedProperty) => {
        if (!user) {
            return;
        }
        try {
            await axios.patch(`${import.meta.env.VITE_BASE_URL}/api/notes/${note.id}/properties`, { ...updatedProperty }, { headers: { "Authorization": `Bearer ${user.accessToken}` } });
            setNotes(prevNotes =>
                prevNotes.map(note =>
                    note.id === note.id ? { ...note, ...updatedProperty } : note
                )
            );
            toast.success(updatedProperty.pinned ? "Note pinned." : "Note unpinned.");
        } catch (err) {
            toast.error(`${err.message || "Something went wrong."}`);
            console.error("Error updating note property", err);
        }
    };

    return (
        <motion.div
            className={viewStyle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ background: note.color || "none" }}
        >
            <div
                className={`${viewStyle}-content`}
                onClick={() => openModal(note)}
            >
                {note.title.trim() !== "" ? <p className="title">{note.title}</p> : " "}
                <p className="body">{note.body}</p>
            </div>

            {noteType === "all" &&
                <span
                    className="home-pin-btn"
                    onClick={() => {
                        pinNote({ pinned: !note.pinned });
                        note.pinned = !note.pinned;
                    }}>
                    {note.pinned ? <MdPushPin /> : <MdOutlinePushPin />}
                </span>
            }
        </motion.div>
    )
}
export default NotePreview;