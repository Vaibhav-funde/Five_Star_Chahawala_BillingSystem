import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function AddAdvertisement() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaType, setMediaType] = useState("IMAGE");
  const [loading, setLoading] = useState(false);

  const submitAd = async () => {
    if (!file || !title) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("mediaType", mediaType);

      await axios.post(
        "http://localhost:8081/api/ads/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Advertisement Added Successfully ✅");

      // Reset form
      setTitle("");
      setDescription("");
      setFile(null);
      setMediaType("IMAGE");

    } catch (error) {
      console.error(error);
      alert("Upload failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-ad-container">
      <h2>Add Advertisement</h2>

      <input
        type="text"
        placeholder="Advertisement Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Advertisement Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <select
        value={mediaType}
        onChange={(e) => setMediaType(e.target.value)}
      >
        <option value="IMAGE">Image</option>
        <option value="VIDEO">Video</option>
      </select>

      <input
        type="file"
        accept={mediaType === "IMAGE" ? "image/*" : "video/*"}
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={submitAd} disabled={loading}>
        {loading ? "Uploading..." : "Upload Advertisement"}
      </button>
    </div>
  );
}

export default AddAdvertisement;
