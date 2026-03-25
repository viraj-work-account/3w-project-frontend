import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toggleLikeAPI } from "../services/api";
import CommentSection from "./CommentSection";

const PostCard = ({ post, onRefresh }) => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [showComments, setShowComments] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  const isLiked = post.likes.some(
    (id) => id === user?._id || id?._id === user?._id,
  );

  const handleLike = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setLikeLoading(true);
    try {
      await toggleLikeAPI(post._id);
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleCommentToggle = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setShowComments(!showComments);
  };

  return (
    <div className="post-card">
      {/* post header */}
      <div className="post-header">
        <div className="post-avatar">
          {/*  fallback to ? if author is deleted */}
          {post.author?.username?.charAt(0).toUpperCase() || "?"}
        </div>
        <div className="post-meta">
          {/*  fallback to deleted user if author is deleted */}
          <span className="post-username">
            @{post.author?.username || "deleted user"}
          </span>
          <span className="post-time">
            {new Date(post.createdAt).toLocaleString()}
          </span>
        </div>
      </div>

      {/* post content */}
      {post.text && <p className="post-text">{post.text}</p>}
      {post.image && <img src={post.image} alt="post" className="post-image" />}

      {/* post actions */}
      <div className="post-actions">
        <button
          className={`like-btn ${isLiked ? "liked" : ""}`}
          onClick={handleLike}
          disabled={likeLoading}
        >
          {isLiked ? "❤️" : "🤍"} {post.likes.length}
        </button>
        <button className="comment-btn" onClick={handleCommentToggle}>
          💬 {post.comments.length}
        </button>
      </div>

      {/* comments */}
      {showComments && (
        <CommentSection
          postId={post._id}
          comments={post.comments}
          onCommentAdded={onRefresh}
        />
      )}
    </div>
  );
};

export default PostCard;
