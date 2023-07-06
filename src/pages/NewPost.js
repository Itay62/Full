import React from "react";
import axios from "axios";
import "../App.css";

export default class NewPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: null,
      body: null,
      author: null,
      resp: null,
      data: [],
    };
  }
  doEditTitle = (e) => {
    this.setState({
      title: e.target.value,
    });
  };

  doEditBody = (e) => {
    this.setState({
      body: e.target.value,
    });
  };

  doEditAuthor = (e) => {
    this.setState({
      author: e.target.value,
    });
  };

  addPost = (e) => {
    const url = "/posts";
    const data = {
      title: this.state.title,
      body: this.state.body,
      author: this.state.author,
    };
    axios
      .post(url, data)
      .then((res) => {
        this.setState({
          data: [],
          resp: "Success, great new post added!",
        });
      })
      .catch((err) => {
        this.setState({
          data: [],
          resp: "Error: something went wrong, try another post.",
        });
      });
  };
  render() {
    return (
      <div>
        <input
          type="text"
          onChange={this.doEditTitle}
          placeholder="title"
        ></input>

        <input
          type="text"
          onChange={this.doEditBody}
          placeholder="body"
        ></input>

        <input
          type="text"
          onChange={this.doEditAuthor}
          placeholder="author"
        ></input>

        <button onClick={this.addPost}>Add Post</button>
        <div>{this.state.resp ? this.state.resp : null}</div>
      </div>
    );
  }
}
