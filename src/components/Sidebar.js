import React from "react";
import { NavLink } from "react-router-dom";

// Sidebar component
function Sidebar(props) {
  return (
    <div className="sidebar">
      <h3 className="sidebar-title">{props.title}</h3>
      <ul className="category-list">
        {props.categories.map((category) => (
          <li key={`${category.id}-${props.title}`}>
            <p> {category.name}</p>{" "}
            <NavLink to={`/post/${category.id}`}>go to page</NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
