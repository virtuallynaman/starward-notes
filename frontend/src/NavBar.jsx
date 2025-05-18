import { MdMenu, MdRefresh, MdSearch, MdClose, MdGridView, MdOutlineViewAgenda, MdSort, MdDeleteOutline, MdOutlineArchive, MdOutlineHome, MdHome, MdArchive, MdDelete, MdLogout } from "react-icons/md";
import { FaGithub } from "react-icons/fa"
import { useNotes } from "./NotesProvider";
import { useAuth } from "./AuthProvider";
import { useEffect, useRef, useState } from "react";

function NavBar() {
    const { logout } = useAuth();
    const { viewStyle, setViewStyle, sortOrder, setSortOrder, searchTerm, setSearchTerm, noteType, setNoteType, setNotes } = useNotes();
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
    const sortDropdownRef = useRef(null);
    const profileDropdownRef = useRef(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);


    // ====================
    // Search Bar
    // ====================

    // Change the search term
    const handleChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // Close search
    const handleClear = () => {
        setSearchTerm("");
    }

    // Sidebar navigation
    const handleNavigation = (type) => {
        if (type !== noteType) {
            setNoteType(type);
            setSearchTerm("");
            setNotes([]);
        }
        setIsMenuOpen(false);
    }

    // ====================
    // Sort Button
    // ====================

    // Toggle sorting dropdown menu
    const toggleSortDropdown = () => {
        setIsSortDropdownOpen(!isSortDropdownOpen);
    };

    // Handle option click
    const handleSortChange = (order) => {
        setSortOrder(order);
        setIsSortDropdownOpen(false);
    };

    // Profile Dropdown
    const toggleProfileDropdown = () => {
        setIsProfileDropdownOpen(!isProfileDropdownOpen);
    }

    // useRef to close the dropdown on outside clicks
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
                setIsSortDropdownOpen(false);
            }
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
                setIsProfileDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="navbar" >
            <div className="menu-logo-container">
                <MdMenu className="navbar-icon" onClick={() => setIsMenuOpen(!isMenuOpen)} />
                <h2 className="logo">{noteType === "all" ? "Starward Notes" : (noteType === "archived" ? "Archive" : "Trash")}</h2>
                <div className="search-bar">
                    <MdSearch className="search-icon" />
                    <input
                        className="search-input"
                        type="text"
                        placeholder="Search notes"
                        onChange={handleChange}
                        value={searchTerm}
                    />
                    <MdClose className={`search-close-icon ${searchTerm ? "visible" : ""}`} onClick={handleClear} />
                </div>
            </div>
            <div className={`sidebar ${isMenuOpen ? "open" : ""}`}>
                <div className="sidebar-logo-container">
                    <MdMenu className="navbar-icon" onClick={() => setIsMenuOpen(!isMenuOpen)} />
                    <h2 className="logo">{noteType === "all" ? "Starward Notes" : (noteType === "archived" ? "Archive" : "Trash")}</h2>
                </div>

                <div className={`sidebar-item ${noteType === "all" && "active"}`}
                    onClick={() => handleNavigation("all")}>
                    {noteType === "all" ? <MdHome className="sidebar-icon" /> : <MdOutlineHome className="sidebar-icon" />}Notes
                </div>
                <div className={`sidebar-item ${noteType === "archived" && "active"}`}
                    onClick={() => handleNavigation("archived")}>
                    {noteType === "archived" ? <MdArchive className="sidebar-icon" /> : <MdOutlineArchive className="sidebar-icon" />}Archive
                </div>
                <div className={`sidebar-item ${noteType === "trashed" && "active"}`}
                    onClick={() => handleNavigation("trashed")}>
                    {noteType === "trashed" ? <MdDelete className="sidebar-icon" /> : <MdDeleteOutline className="sidebar-icon" />}Trash
                </div>
                <a className="github-link" href="https://github.com/virtuallynaman/starward-notes" target="_blank" rel="noopener noreferrer" onClick={() => setIsMenuOpen(false)} ><FaGithub className="sidebar-icon" /> Github Repo</a>
            </div>

            {isMenuOpen && <div className="sidebar-overlay" onClick={() => setIsMenuOpen(false)}></div>}

            <div className="navbar-options-container">
                <div className="navbar-options" ref={sortDropdownRef} onClick={toggleSortDropdown}>
                    <MdSort className="navbar-icon" />
                    <p className="navbar-text">Sort by ▾</p>
                    {isSortDropdownOpen && (
                        <div className="sort-dropdown">
                            <span className="tooltip"></span>
                            <div className={`sort-dropdown-item ${sortOrder === "DESC" ? "dropdown-active" : ""}`} onClick={() => handleSortChange("DESC")}>Newest</div>
                            <div className={`sort-dropdown-item ${sortOrder === "ASC" ? "dropdown-active" : ""}`} onClick={() => handleSortChange("ASC")}>Oldest</div>
                        </div>
                    )}
                </div>
                <div className="navbar-options" onClick={() => { viewStyle === "grid-view" ? setViewStyle("list-view") : setViewStyle("grid-view") }}>
                    {viewStyle === "grid-view" ? <MdOutlineViewAgenda className="navbar-icon" /> : <MdGridView className="navbar-icon" />}
                    <p className="navbar-text">{viewStyle === "grid-view" ? "List View" : "Grid View"}</p>
                </div>
                <div className="navbar-options" ref={profileDropdownRef} onClick={toggleProfileDropdown}>
                    <img className="profile-pic" src="https://picsum.photos/id/10/200/200" alt="profile-pic" />
                    {isProfileDropdownOpen && (
                        <div className="profile-dropdown">
                            <span className="tooltip"></span>
                            <div className="profile-dropdown-item" onClick={() => logout()}>
                                <MdLogout className="navbar-icon" />
                                <span>Log out</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div >
    )
};

export default NavBar;