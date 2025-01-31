import { useState, useContext } from "react";
import { NotesContext } from "./NotesContext";
import NotePreview from "./NotePreview";

function HomePage() {
    // const [isLoading, setIsLoading] = useState([true]);
    const [viewStyle, setViewStyle] = useState(["grid-view"]);
    const {notes} = useContext(NotesContext);

    return (
        <div className="home">
            {/* {isLoading && <span>Loading...</span>} */}
            {notes && <NotePreview notes={notes} viewStyle={viewStyle} />}
        </div>
    )
}

export default HomePage;