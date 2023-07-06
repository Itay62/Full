import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";

const AboutMe = () => {
  const [aboutMe, setAboutMe] = useState("");

  useEffect(() => {
    axios
      .get("/aboutme")
      .then((response) => {
        setAboutMe(response.data);
        console.log("about me activated");
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <h1>About Me</h1>
      <p>{aboutMe}</p>
    </div>
  );
};
export default AboutMe;
