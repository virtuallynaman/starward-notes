import { NavLink } from "react-router-dom";

function NotePreview({ notes, viewStyle }) {
    return (
        <div>
            {console.log(notes)}
            {notes.map((note) => (
                <div className={viewStyle} key={note.id}>
                    <NavLink to={`/note/${note.id}`} key={note.id}>
                        <h2 className="title">{note.title}</h2>
                        <p className="body">{note.body.slice(0, 100)}</p>
                    </NavLink>
                </div>
            ))}
        </div >
    )
}
export default NotePreview;