import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

// Post component
function FullPost(props) {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  const fetchPost = () => {
    axios
      .get(`/post/${id}`)
      .then((response) => {
        setPost(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  return (
    <div className="full-post-page">
      <h1>This is my blog</h1>
      {post && (
        <div className="single-post">
          <h4 className="post-title">{post.title}</h4>
          <img className="post-image" src={post.img} alt="post" />
          <p>{post.body}</p>
          <footer className="post-meta">
            Published {post.created_at} <br></br> by {post.author} <br></br>
          </footer>
        </div>
      )}
    </div>
  );
}

export default FullPost;
