import { useAuth } from "./AuthProvider";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

const NotesContext = createContext();

export function NotesProvider({ children }) {
    const { user } = useAuth();
    const [notes, setNotes] = useState([]);
    const [viewStyle, setViewStyle] = useState("grid-view");
    const [noteType, setNoteType] = useState("all")
    const [sortOrder, setSortOrder] = useState("DESC");
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    // Check for saved sort order and viewstyle
    useEffect(() => {
        const savedSortOrder = localStorage.getItem("sortOrder");
        const savedViewStyle = localStorage.getItem("viewStyle");

        if (savedSortOrder) {
            setSortOrder(savedSortOrder);
        }

        if (savedViewStyle) {
            setViewStyle(savedViewStyle);
        }
    }, []);

    // Save sort order and view style to localstorage
    useEffect(() => {
        localStorage.setItem("sortOrder", sortOrder);
        localStorage.setItem("viewStyle", viewStyle);
    }, [sortOrder, viewStyle]);

    useEffect(() => {
        setSearchTerm("");
        setIsLoading(true);

        const fetchNotes = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/notes?noteType=${noteType}&sortOrder=${sortOrder}`, { headers: { "Authorization": `Bearer ${user.accessToken}` } });
                setNotes(response.data);
            } catch (err) {
                console.error("Error fetching notes:", err);
                toast.error(err.message);
            } finally {
                setIsLoading(false);
            }
        }
        setTimeout(() => {
            fetchNotes();
        }, 1000);
    }, [user, noteType, sortOrder]);

    // Filter notes
    const filteredNotes = searchTerm
        ? notes.filter(note =>
            note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.body.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : [];

    return (
        <NotesContext.Provider value={{ notes, setNotes, viewStyle, setViewStyle, noteType, setNoteType, sortOrder, setSortOrder, searchTerm, setSearchTerm, filteredNotes, isLoading }}>
            {children}
        </NotesContext.Provider>
    );
};

export function useNotes() {
    return useContext(NotesContext);
}