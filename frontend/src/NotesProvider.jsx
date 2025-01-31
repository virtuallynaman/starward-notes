import axios from "axios";
import { useEffect, useState } from "react";
import { NotesContext } from "./NotesContext";

function NotesProvider({ children }) {
    const [notes, setNotes] = useState([]);

    //Get notes
    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/notes`);
                setNotes(response.data);
            } catch (err) {
                console.error("Error fetching notes:", err);
            }
        };
        fetchNotes();
    }, []);

    return (
        <NotesContext.Provider value={{notes, setNotes}}>
            {children}
        </NotesContext.Provider>
    );
};

export default NotesProvider;