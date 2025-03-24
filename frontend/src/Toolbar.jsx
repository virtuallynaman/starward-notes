import { MdPushPin, MdOutlinePushPin, MdOutlineArchive, MdOutlineUnarchive, MdOutlinePalette, MdOutlineDelete, MdOutlineDeleteForever, MdOutlineRestore, MdOutlineRestorePage, MdOutlineRestoreFromTrash, MdRestoreFromTrash, MdDeleteForever, MdDeleteSweep, MdDelete } from "react-icons/md";

function Toolbar({ note, noteId, updateNoteProperties, deleteForever }) {
    const colors = ["#ffadad", "#ffd6a5", "#fdffb6", "#caffbf", "#9bf6ff", "#a0c4ff"];

    return (
        <div className="toolbar">
            {!note.archived && !note.trashed && (<button onClick={() => {
                updateNoteProperties({ pinned: note.pinned }, { pinned: !note.pinned });
                note.pinned = !note.pinned;
            }}>
                {note.pinned ? <MdPushPin className="toolbar-icon" /> : <MdOutlinePushPin className="toolbar-icon" />}
                <span className="tool-name">{note.pinned ? "Unpin" : "Pin"}</span>
            </button>)}

            {!note.trashed && (<button onClick={() => {
                updateNoteProperties({ archived: note.archived }, { archived: !note.archived });
                note.archived = !note.archived;
            }}>
                {note.archived ? <MdOutlineUnarchive className="toolbar-icon" /> : <MdOutlineArchive className="toolbar-icon" />}
                <span className="tool-name">{note.archived ? "Unarchive" : "Archive"}</span>
            </button>)}
            {!note.trashed && (<div className="color-picker-container">
                <button>
                    <MdOutlinePalette className="toolbar-icon" />
                    <span className="tool-name">Background</span>
                </button>
                <div className="color-picker">
                    <button className="color-option" style={{ background: "#f28b82" }} data-color="#f28b82"></button>
                    <button className="color-option" style={{ background: "#fbbc04" }} data-color="#fbbc04"></button>
                    <button className="color-option" style={{ background: "#fff475" }} data-color="#fff475"></button>
                    <button className="color-option" style={{ background: "#ccff90" }} data-color="#ccff90"></button>
                    <button className="color-option" style={{ background: "#a7ffeb" }} data-color="#a7ffeb"></button>
                    <button className="color-option" style={{ background: "#d7aefb" }} data-color="#d7aefb"></button>
                </div>
            </div>)}

            <button onClick={() => {
                updateNoteProperties({ trashed: note.trashed }, { trashed: !note.trashed });
                note.trashed = !note.trashed;
            }}>
                {note.trashed ?
                    <>
                        <MdOutlineRestore className="toolbar-icon" />
                        <span className="tool-name">Restore</span>
                    </>
                    :
                    <>
                        <MdDelete className="toolbar-icon" />
                        <span className="tool-name">Trash</span>
                    </>
                }
            </button>

            {note.trashed && (<button onClick={() => {
                deleteForever(note.id);
            }}>
                <MdDeleteForever className="toolbar-icon" />
                <span className="tool-name">Delete forever</span>
            </button>)}
        </div>
    );
};

export default Toolbar;