import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function ManageAdvertisements() {
  const [ads, setAds] = useState([]);
  const [editAd, setEditAd] = useState(null);

  const fetchAds = () => {
    axios.get("http://localhost:8081/api/ads/active")
      .then(res => setAds(res.data));
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const deleteAd = (id) => {
    if (window.confirm("Delete this advertisement?")) {
      axios.delete(`http://localhost:8081/api/ads/delete/${id}`)
        .then(() => fetchAds());
    }
  };

  const updateAd = () => {
    axios.put(
      `http://localhost:8081/api/ads/update/${editAd.id}`,
      null,
      {
        params: {
          title: editAd.title,
          description: editAd.description,
          active: editAd.active
        }
      }
    ).then(() => {
      setEditAd(null);
      fetchAds();
    });
  };

  return (
    <div className="manage-ad-container">
      <h2>Manage Advertisements</h2>

      {ads.map(ad => (
        <div className="ad-row" key={ad.id}>
          {/* Render IMAGE or VIDEO based on mediaType */}
          {ad.mediaType === "IMAGE" ? (
            <img
              className="ad-media"
              src={`http://localhost:8081${ad.mediaUrl}`}
              alt={ad.title}
            />
          ) : (
            <video
              className="ad-media"
              src={`http://localhost:8081${ad.mediaUrl}`}
              muted
              loop
              controls
            />
          )}

          <div className="ad-info">
            <h4>{ad.title}</h4>
            <p>{ad.description}</p>
          </div>

          <div className="ad-actions">
            <button onClick={() => setEditAd(ad)}>Edit</button>
            <button className="delete" onClick={() => deleteAd(ad.id)}>Delete</button>
          </div>
        </div>
      ))}

      {editAd && (
        <div className="edit-box">
          <h3>Edit Advertisement</h3>

          <input
            value={editAd.title}
            onChange={e => setEditAd({ ...editAd, title: e.target.value })}
          />

          <textarea
            value={editAd.description}
            onChange={e => setEditAd({ ...editAd, description: e.target.value })}
          />

          <select
            value={editAd.active}
            onChange={e => setEditAd({ ...editAd, active: e.target.value === "true" })}
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

          <button onClick={updateAd}>Update</button>
          <button className="cancel" onClick={() => setEditAd(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default ManageAdvertisements;
