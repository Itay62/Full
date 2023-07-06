import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import AboutMe from "./pages/AboutMe";
import NewPost from "./pages/NewPost";
import FullPost from "./components/FullPost";
import LoginLogout from "./pages/LoginLogout";
import EditPost from "./components/EditPost";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about-me" element={<AboutMe />} />
          <Route path="new-post" element={<NewPost />} />
          <Route path="post/:id" element={<FullPost />} />
          <Route path="login" element={<LoginLogout />} />
          <Route path="post-editing/:id" element={<EditPost />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
