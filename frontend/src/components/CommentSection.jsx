import { useState } from "react";
import { addCommentAPI } from "../services/api";

const CommentSection = ({ postId, comments, onCommentAdded }) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    setError("");

    try {
      await addCommentAPI(postId, { text });
      setText("");
      onCommentAdded(); // refresh feed
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add comment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="comment-section">
      {comments.length > 0 && (
        <div className="comments-list">
          {comments.map((comment) => (
            <div key={comment._id} className="comment">
              <span className="comment-username">{comment.user?.username}</span>
              <span className="comment-text">{comment.text}</span>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="comment-form">
        <input
          type="text"
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "..." : "Post"}
        </button>
      </form>
      {error && <div className="error-msg">{error}</div>}
    </div>
  );
};

export default CommentSection;
