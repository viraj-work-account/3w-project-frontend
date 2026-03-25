import { useState } from "react";
import { createPostAPI } from "../services/api";

const CreatePost = ({ onPostCreated }) => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!text.trim() && !image) {
      setError("Warning: Post must have either text or image!");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      if (text) formData.append("text", text);
      if (image) formData.append("image", image);

      await createPostAPI(formData);
      setText("");
      setImage(null);
      setPreview(null);
      onPostCreated(); // refresh feed
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post">
      <h3>Create Post</h3>
      {error && <div className="error-msg">{error}</div>}
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Ready to Post? What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
        />
        {preview && (
          <div className="image-preview">
            <img src={preview} alt="preview" />
            <button
              type="button"
              className="remove-image"
              onClick={() => {
                setImage(null);
                setPreview(null);
              }}
            >
              ✕
            </button>
          </div>
        )}
        <div className="create-post-actions">
          <label className="image-upload-label">
            Click to upload Photo
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              hidden
            />
          </label>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
