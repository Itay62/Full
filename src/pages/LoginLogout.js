import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";

const LoginLogout = () => {
  const [data, setData] = useState([]);
  const [resp, setResp] = useState(null);
  const [user, setUser] = useState(null);
  const [signUser, setSignUser] = useState(null);
  const [pass, setPass] = useState(null);
  const [signPass, setSignPass] = useState(null);

  const doEditUserLogin = (e) => {
    setUser(e.target.value);
  };

  const doEditPassLogin = (e) => {
    setPass(e.target.value);
  };

  const doEditUserSign = (e) => {
    setSignUser(e.target.value);
  };

  const doEditPassSign = (e) => {
    setSignPass(e.target.value);
  };

  const doSignUp = (e) => {
    const url = "/signup";
    const data = {
      sign_user: signUser,
      sign_pass: signPass,
    };
    axios
      .post(url, data)
      .then((res) => {
        setResp(`Welcome ${data.sign_user}, You have signed up!`);
        setData([]);
      })
      .catch((err) => {
        setData([]);
        setResp("Username already exists!");
      });
  };

  const doLogin = (e) => {
    const url = "/login";
    const data = {
      user: user,
      pass: pass,
    };
    axios
      .post(url, data)
      .then((res) => {
        setData([]);
        setResp(`Welcome back ${data.user}!`);
      })
      .catch((err) => {
        setData([]);
        setResp("Error!");
      });
  };

  const doLogout = (e) => {
    const url = "/logout";
    axios
      .get(url)
      .then((res) => {
        setData([]);
        setResp("You have logged out!");
      })
      .catch((err) => {
        setData([]);
        setResp("No one is logged in!");
      });
  };

  useEffect(() => {}, []);

  return (
    <div className="container">
      <div className="signup">
        Username:{" "}
        <input
          type="text"
          onChange={doEditUserSign}
          placeholder="Username"
        ></input>
        <br />
        Password:{" "}
        <input
          type="text"
          onChange={doEditPassSign}
          placeholder="Password"
        ></input>
        <br />
        <button onClick={doSignUp}>Sign Up</button>
        <br></br>
      </div>
      <br></br>
      <div className="login">
        Username:{" "}
        <input
          type="text"
          onChange={doEditUserLogin}
          placeholder="Username"
        ></input>
        <br />
        Password:{" "}
        <input
          type="text"
          onChange={doEditPassLogin}
          placeholder="Password"
        ></input>
        <br />
        <button onClick={doLogin}>Login</button>
        <br></br>
        <button onClick={doLogout}>Logout</button>
        <br></br>
      </div>

      <div>{resp ? resp : null}</div>
    </div>
  );
};

export default LoginLogout;
