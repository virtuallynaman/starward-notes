import { useState } from "react";
import { useNotes } from "./NotesProvider";
import NotePreview from "./NotePreview";
import Modal from "react-modal";
import NoteModal from "./NoteModal";
import { MdAdd } from "react-icons/md";
import NavBar from "./NavBar";

Modal.setAppElement("#root");

function HomePage() {
    const { notes, viewStyle, noteType, searchTerm, filteredNotes, isLoading } = useNotes();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);

    let pinnedNotes = [];
    let otherNotes = notes;

    if (noteType === "all") {
        pinnedNotes = notes.filter(note => note.pinned);
    }

    pinnedNotes.length > 0 && (otherNotes = notes.filter(note => !note.pinned));

    const openModal = (note) => {
        setSelectedNote(note);
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedNote(null);
    }

    return (
        <>
            <NavBar />
            <div className="home">
                {isLoading ? (
                    <div className="loading">
                        <span className="loader"></span>
                        Bringing your notes to life...
                    </div>
                ) : (
                    <>
                        {!searchTerm ?
                            <>
                                {noteType === "all" && (
                                    <button className="newNoteBtn" onClick={() => openModal({ id: null, title: null, body: null, pinned: false, archived: false, color: "default_bg", trashed: false, date: "" })}>
                                        <MdAdd className="newNoteIcon" />
                                    </button>
                                )}

                                {pinnedNotes.length > 0 ? (
                                    <div className={`${viewStyle}-container`}>
                                        <p className="section-name">Pinned</p>
                                        <section className={`${viewStyle}-section`}>
                                            {pinnedNotes.map((note) => (
                                                <NotePreview key={note.id} note={note} viewStyle={viewStyle} openModal={openModal} />
                                            ))}
                                        </section>

                                        {otherNotes.length > 0 && (
                                            <>
                                                <p className="section-name">Others</p>
                                                <section className={`${viewStyle}-section`}>
                                                    {otherNotes.map((note) => (
                                                        <NotePreview key={note.id} note={note} viewStyle={viewStyle} openModal={openModal} />
                                                    ))}
                                                </section>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        {otherNotes.length > 0 && (
                                            <div className={`${viewStyle}-container`}>
                                                <section className={`${viewStyle}-section`}>
                                                    {otherNotes.map((note) => (
                                                        <NotePreview key={note.id} note={note} viewStyle={viewStyle} openModal={openModal} />
                                                    ))}
                                                </section>
                                            </div>
                                        )}
                                    </>
                                )}
                            </>
                            :
                            <>
                                {filteredNotes.length > 0 ? (
                                    <div className={`${viewStyle}-container`}>
                                        <section className={`${viewStyle}-section`}>
                                            {filteredNotes.map((note) => (
                                                <NotePreview key={note.id} note={note} viewStyle={viewStyle} openModal={openModal} />
                                            ))}
                                        </section>
                                    </div>
                                ) : (
                                    <div className="empty-notes-container">
                                        {pinnedNotes.length > 0 || otherNotes.length > 0 ?
                                            <span>No matching notes found. Try a different search term!</span>
                                            :
                                            <span>You don’t have any notes yet, so there’s nothing to search. Create your first note to get started!</span>
                                        }
                                    </div>
                                )}
                            </>
                        }
                    </>
                )}

                {isModalOpen &&
                    <NoteModal
                        isOpen={isModalOpen}
                        onClose={closeModal}
                        note={selectedNote}
                        isAutoSave={true}
                    />
                }
            </div >
        </>
    )
}

export default HomePage;