import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/auth/authSlice";
import { getFeedAPI, logoutAPI } from "../services/api";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";

const Feed = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFeed = async () => {
    try {
      const res = await getFeedAPI();
      setPosts(res.data.data);
    } catch (err) {
      setError("Failed to load feed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutAPI();
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(logout());
      navigate("/login");
    }
  };

  return (
    <div className="feed-container">
      {/* navbar */}
      <div className="navbar">
        <h1 className="navbar-title">Social</h1>
        <div className="navbar-right">
          <span className="navbar-username">@{user?.username}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* main content */}
      <div className="feed-content">
        <CreatePost onPostCreated={fetchFeed} />

        {loading && <div className="loading">Loading feed...</div>}
        {error && <div className="error-msg">{error}</div>}

        {!loading && posts.length === 0 && (
          <div className="no-posts">No posts yet. Be the first to post!</div>
        )}

        <div className="posts-list">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} onRefresh={fetchFeed} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Feed;
