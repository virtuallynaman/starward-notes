import { useState } from "react";
import { MdPushPin, MdOutlinePushPin, MdOutlineArchive, MdOutlineUnarchive, MdOutlinePalette, MdOutlineRestore, MdDeleteForever, MdDelete, MdOutlineFormatColorReset } from "react-icons/md";

function Toolbar({ note, updateNoteProperties, deleteForever, setBgColor }) {
    const colors = ["#2D2E30", "#3B3F52", "#27374D", "#264d3b", "#256377", "#472e5b", "#4b443a", "#77172e", "#692b17", "#7c4a03"];
    const [showColorPicker, setShowColorPicker] = useState(false);

    const handlePicker = () => {
        setShowColorPicker(!showColorPicker);
    }

    return (
        <div className="toolbar">
            {!note.archived && !note.trashed && (
                <button className="toolbar-button" onClick={() => {
                    updateNoteProperties({ pinned: note.pinned }, { pinned: !note.pinned });
                    note.pinned = !note.pinned;
                }}>
                    {note.pinned ? <MdPushPin className="toolbar-icon" /> : <MdOutlinePushPin className="toolbar-icon" />}
                    <span className="tool-name">{note.pinned ? "Unpin" : "Pin"}</span>
                </button>
            )}

            {!note.trashed && (
                <button className="toolbar-button" onClick={() => {
                    updateNoteProperties({ archived: note.archived }, { archived: !note.archived });
                    note.archived = !note.archived;
                }}>
                    {note.archived ? <MdOutlineUnarchive className="toolbar-icon" /> : <MdOutlineArchive className="toolbar-icon" />}
                    <span className="tool-name">{note.archived ? "Unarchive" : "Archive"}</span>
                </button>
            )}
            {!note.trashed && (
                <div className="color-picker-container">
                    <button className="toolbar-button" onClick={handlePicker}>
                        <MdOutlinePalette className="toolbar-icon" />
                        <span className="tool-name">Background</span>
                    </button>
                    <div className={`color-picker ${showColorPicker ? "color-picker-visible" : ""}`}>
                        {colors.map(color =>
                            <button
                                key={color}
                                className="color-option"
                                style={{ background: color }}
                                onClick={() => {
                                    updateNoteProperties("", { color: color });
                                    setBgColor(color);
                                }}
                            />
                        )}
                        <MdOutlineFormatColorReset
                            className="color-option"
                            style={{ background: "transparent", border: "1px solid" }}
                            onClick={() => {
                                updateNoteProperties("", { color: "#212121" });
                                setBgColor("#212121");
                            }}
                        />

                    </div>
                </div>
            )}

            <button className="toolbar-button" onClick={() => {
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

            {note.trashed && (
                <button className="toolbar-button" onClick={() => {
                    deleteForever(note.id);
                }}>
                    <MdDeleteForever className="toolbar-icon" />
                    <span className="tool-name">Delete forever</span>
                </button>
            )}
        </div>
    );
}
;

export default Toolbar;