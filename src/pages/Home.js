import React from "react";
import Separator from "../components/Seperator";
import Sidebar from "../components/Sidebar";
import Posts from "../components/Posts";

const latest = [
  { id: 1, name: "Blog post #1", link: "#post1" },
  { id: 2, name: "Blog post #2", link: "#post2" },
  { id: 3, name: "Blog post #3", link: "#post3" },
];
const popular = [
  { id: 3, name: "Blog post #3", link: "#post3" },
  { id: 1, name: "Blog post #1", link: "#post1" },
  { id: 2, name: "Blog post #2", link: "#post2" },
];

// Main app component
function Home() {
  return (
    <div>
      <div className="wrapper">
        <div className="main-content">
          <h1 className="title">This is my blog</h1>
          <Posts />
        </div>
        <div className="side">
          <Sidebar title="Latest" categories={latest} />
          <Separator />
          <Sidebar title="Popular" categories={popular} />
        </div>
      </div>
    </div>
  );
}

export default Home;
