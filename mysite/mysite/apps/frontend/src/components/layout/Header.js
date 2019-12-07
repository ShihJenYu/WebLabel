import React from 'react';
import { NavLink } from 'react-router-dom';

export const Header = () => (
    <nav className="navbar navbar-expand-sm navbar-light bg-light">
        <a className="navbar-brand" href="/">
            Navbar
        </a>
        <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
        >
            <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav">
                <li className="nav-item">
                    {/* <a className="nav-link" href="/">Home</a> */}
                    <NavLink to="/" className="nav-link" activeClassName="chosen">
                        Home
                    </NavLink>
                </li>
                <li className="nav-item">
                    {/* <a className="nav-link" href="/project">Project</a> */}

                    <NavLink to="/project" className="nav-link" activeClassName="chosen">
                        Project
                    </NavLink>
                </li>
                <li className="nav-item">
                    {/* <a className="nav-link" href="/pack">Pack</a> */}
                    <NavLink to="/pack" className="nav-link" activeClassName="chosen">
                        Pack
                    </NavLink>
                </li>
                <li className="nav-item">
                    {/* <a className="nav-link" href="/video">Video</a> */}
                    <NavLink to="/video" className="nav-link" activeClassName="chosen">
                        Video
                    </NavLink>
                </li>
                <li className="nav-item">
                    {/* <a className="nav-link" href="/batch">Batch</a> */}
                    <NavLink to="/batch" className="nav-link" activeClassName="chosen">
                        Batch
                    </NavLink>
                </li>
                {/* <li className="nav-item dropdown">
                    <a
                        className="nav-link dropdown-toggle"
                        href="# "
                        id="navbarDropdownMenuLink"
                        role="button"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                    >
                        Dropdown link
                    </a>
                    <div
                        className="dropdown-menu"
                        aria-labelledby="navbarDropdownMenuLink"
                    >
                        <a className="dropdown-item" href="# ">
                            Action
                        </a>
                        <a className="dropdown-item" href="# ">
                            Another action
                        </a>
                        <a className="dropdown-item" href="# ">
                            Something else here
                        </a>
                    </div>
                </li> */}
            </ul>
        </div>
    </nav>
);

export default Header;
