import { NavLink } from "react-router-dom"
function NavBar() {
    return (
        <div className="navbar">
            <h2>HyperBloom</h2>
            <div className="nav-links">
                <NavLink to="/">Home</NavLink>
                <NavLink to="/new"> New</NavLink>
            </div>
        </div>
    )
};

export default NavBar;