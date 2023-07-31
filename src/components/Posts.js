import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";
import { NavLink } from "react-router-dom";

// Posts component
const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [comments, setComments] = useState({});

  useEffect(() => {
    const fetchComments = (posts) => {
      const updatedComments = {};
      const fetchCommentPromises = posts.map((post) => {
        return axios
          .get(`/post/${post.id}/comments`)
          .then((response) => {
            const commentsData = response.data;
            updatedComments[post.id] = commentsData;
          })
          .catch((error) => {
            console.error(error);
          });
      });

      Promise.all(fetchCommentPromises)
        .then(() => {
          setComments(updatedComments);
        })
        .catch((error) => {
          console.error(error);
        });
    };

    axios
      .get("/posts")
      .then((response) => {
        setPosts(response.data);
        fetchComments(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    axios
      .get("/login")
      .then((response) => {
        setLoggedInUserId(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleAddComment = (postId) => {
    console.log("logged in id is:");
    if (loggedInUserId) {
      const commentText = prompt("Enter your comment:");
      const commentAuthor = prompt("Enter your name:");
      const commentData = {
        text: commentText,
        author: commentAuthor,
      };

      axios
        .post(`/post/${postId}/comments`, commentData)
        .then((response) => {
          const newComment = response.data;
          const updatedComments = { ...comments };
          if (updatedComments[postId]) {
            updatedComments[postId] = [...updatedComments[postId], newComment];
          } else {
            updatedComments[postId] = [newComment];
          }
          setComments(updatedComments);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      alert("You need to log in to add a comment.");
    }
  };
  // You are shown an 'Edit' button only if you are the author of this post
  const canEditPost = (post) => {
    console.log(post.user_id);
    return post.user_id === loggedInUserId;
  };

  return (
    <div className="post">
      <ul className="post-list">
        {posts.map((post) => (
          <li key={post.id}>
            <h4 className="post-title">{post.title}</h4>
            <img className="post-image" src={post.img} alt="post" />
            <p>{post.body.slice(0, 10)} ... </p>
            <footer className="post-meta">
              <NavLink to={`/post/${post.id}`} className="post-link">
                read post
              </NavLink>{" "}
              <br></br>
              <br></br>
              Published {post.created_at} <br></br> by {post.author} <br></br>
            </footer>
            {canEditPost(post) && (
              <NavLink to={`/post-editing/${post.id}`} className={"edit"}>
                Edit
              </NavLink>
            )}
            {comments[post.id] && (
              <ul>
                {comments[post.id].map((comment) => (
                  <li key={comment.id}>
                    {comment.text} <br></br> comment by: {comment.author}
                  </li>
                ))}
              </ul>
            )}
            <div>
              <button
                onClick={() => {
                  handleAddComment(post.id);
                }}
              >
                Add Comment
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Posts;
