import { Link, NavLink } from "react-router-dom";

export const Header = () => {
    return (
        <header className="header">
            <Link to="/" className="logo">
                HN Summarizer
            </Link>
            <nav className="nav">
                <NavLink to="/" end className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                    Feed
                </NavLink>
                <NavLink to="/bookmarks" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                    Bookmarks
                </NavLink>
            </nav>
        </header>
    );
};

