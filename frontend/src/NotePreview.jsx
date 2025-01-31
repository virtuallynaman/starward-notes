import { NavLink } from "react-router-dom";

function NotePreview({ notes, viewStyle }) {
    let titleLength = 17;
    let bodyLength = 100;

    if (viewStyle[0] !== "grid-view") {
        titleLength = 50;
        bodyLength = 200;
    }

    return (
        <div className="note-preview">
            {console.log(viewStyle)}
            {notes.map((note) => (
                <div className={viewStyle} key={note.id}>
                    <NavLink to={`/note/${note.id}`} key={note.id}>
                        <h2 className="title">{note.title.trim() !== "" ? note.title.slice(0, titleLength) + "..." : "Untitled"}</h2>
                        <p className="body">{note.body.trim() !== "" ? note.body.slice(0, bodyLength) + "..." : note.body.slice(0, bodyLength)}</p>
                    </NavLink>
                </div>
            ))}
        </div >
    )
}
export default NotePreview;