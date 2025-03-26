import { useAuth } from "./AuthProvider";
import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const NotesContext = createContext();

export function NotesProvider({ children }) {
    const { user } = useAuth();
    const [notes, setNotes] = useState([]);
    // const [pinnedNotes, setPinnedNotes] = useState([]);
    // const [otherNotes, setOtherNotes] = useState([]);
    const [viewStyle, setViewStyle] = useState("grid-view");
    const [noteType, setNoteType] = useState("all")
    const [sortOrder, setSortOrder] = useState("DESC");
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [noInternet, setNoInternet] = useState(!navigator.onLine);
    const [warnNoInternet, setWarnNoInternet] = useState(false);

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
        const fetchNotes = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/notes?noteType=${noteType}&sortOrder=${sortOrder}`, { headers: { "Authorization": `Bearer ${user.accessToken}` } });
                setNotes(response.data);
            } catch (err) {
                console.error("Error fetching notes:", err);
                toast.error(err.response?.data?.error || "Something went wrong.");
            } finally {
                setIsLoading(false);
            }
        };

        if (!noInternet && !warnNoInternet) {
            setIsLoading(true);
            fetchNotes();
        }
    }, [user, noteType, sortOrder, warnNoInternet]);

    useEffect(() => {
        const handleOnline = () => {
            setNoInternet(false);
            if (warnNoInternet) {
                setWarnNoInternet(false);
            }
            toast.info("Internet connection is back.");
        }

        const handleOffline = () => {
            setNoInternet(true);
            setWarnNoInternet(true);
        }

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        }

    }, [warnNoInternet]);

    // Pinned Notes
    const pinnedNotes = useMemo(() =>
        notes.filter(note => note.pinned), [notes]);
    const otherNotes = useMemo(() => 
        notes.filter(note => !note.pinned), [notes]);

    // Filter notes
    const filteredNotes = useMemo(() => {
        if (!searchTerm) {
            return [];
        }

        return notes.filter(note =>
            note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.body.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [searchTerm]);

    return (
        <NotesContext.Provider value={{ notes, setNotes, pinnedNotes, otherNotes, viewStyle, setViewStyle, noteType, setNoteType, sortOrder, setSortOrder, searchTerm, setSearchTerm, filteredNotes, isLoading, noInternet, warnNoInternet, setWarnNoInternet }}>
            {children}
        </NotesContext.Provider>
    );
};

export function useNotes() {
    return useContext(NotesContext);
}