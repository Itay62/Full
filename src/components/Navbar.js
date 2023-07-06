import React from "react";
import { NavLink } from "react-router-dom";

// Navigation bar component
function Navbar() {
  return (
    <nav className="nav">
      <NavLink to="/" className="not-last">
        Home
      </NavLink>
      <NavLink to="/about-me" className="not-last">
        About Me
      </NavLink>
      <NavLink to="/new-post">New Post</NavLink>
      <NavLink to="/login" className="login-link">
        Login
      </NavLink>
    </nav>
  );
}

export default Navbar;
