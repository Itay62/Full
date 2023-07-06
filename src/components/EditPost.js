import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function EditPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [resp, setResp] = useState("");
  const navigate = useNavigate();

  const fetchPost = () => {
    axios
      .get(`/post/${id}`)
      .then((response) => {
        setPost(response.data);
        setTitle(response.data.title);
        setBody(response.data.body);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const doEditTitle = (e) => {
    setTitle(e.target.value);
  };

  const doEditBody = (e) => {
    setBody(e.target.value);
  };

  const editPost = () => {
    const url = `/post-editing/${id}`;
    const data = {
      title: title,
      body: body,
    };
    axios
      .put(url, data)
      .then((response) => {
        setResp("Success, post edited!");
        navigate(`/post/${id}`);
      })
      .catch((error) => {
        console.error(error);
        setResp("Editing failed.");
      });
  };

  const deletePost = () => {
    axios
      .delete(`/post-editing/${id}`)
      .then((response) => {
        setResp("Success, post deleted!");
        navigate("/");
      })
      .catch((error) => {
        console.error(error);
        setResp("Deleting failed");
      });
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  return (
    <div>
      {post && (
        <>
          <input
            type="text"
            onChange={doEditTitle}
            placeholder={post.title}
          ></input>

          <input
            type="text"
            onChange={doEditBody}
            placeholder={post.body}
          ></input>

          <button onClick={editPost} className="edit-button">
            Edit Post
          </button>
          <br></br>
          <button onClick={deletePost} className="delete-button">
            Delete Post
          </button>
          <div>{resp ? resp : null}</div>
        </>
      )}
    </div>
  );
}

export default EditPost;
