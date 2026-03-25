import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { logout } from "../features/auth/authSlice.js";
import { getFeedAPI, logoutAPI } from "../services/api.js";
import CreatePost from "../components/CreatePost.jsx";
import PostCard from "../components/PostCard.jsx";

const Feed = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

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
      navigate("/");
    }
  };

  return (
    <div className="feed-container">
      {/* navbar */}
      <div className="navbar">
        <h1 className="navbar-title">Social</h1>
        <div className="navbar-right">
          {isAuthenticated ? (
            <>
              <span className="navbar-username">@{user?.username}</span>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-nav">
                Login
              </Link>
              <Link to="/signup" className="btn-nav btn-nav-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* main content */}
      <div className="feed-content">
        {/* only show create post if logged in */}
        {isAuthenticated && <CreatePost onPostCreated={fetchFeed} />}

        {/* guest banner */}
        {!isAuthenticated && (
          <div className="guest-banner">
            <p>
              Welcome! <Link to="/signup">Sign up</Link> or{" "}
              <Link to="/login">Login</Link> to create posts, like and comment.
            </p>
          </div>
        )}

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
