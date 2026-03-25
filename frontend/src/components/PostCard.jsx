import { useState } from "react";
import { useSelector } from "react-redux";
import { toggleLikeAPI } from "../services/api";
import CommentSection from "./CommentSection";

const PostCard = ({ post, onRefresh }) => {
  const { user } = useSelector((state) => state.auth);
  const [showComments, setShowComments] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  const isLiked = post.likes.some(
    (id) => id === user?._id || id?._id === user?._id,
  );

  const handleLike = async () => {
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

  return (
    <div className="post-card">
      {/* post header */}
      <div className="post-header">
        <div className="post-avatar">
          {post.author?.username?.charAt(0).toUpperCase()}
        </div>
        <div className="post-meta">
          <span className="post-username">@{post.author?.username}</span>
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
        <button
          className="comment-btn"
          onClick={() => setShowComments(!showComments)}
        >
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
