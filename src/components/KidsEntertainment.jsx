import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';
import { database } from '../Firebase';
import { ref, onValue } from 'firebase/database';
import './KidsEntertainment.css';

const KidsEntertainment = () => {
  const [videoList, setVideoList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const videoRef = ref(database, 'kids');
    
    try {
      onValue(videoRef, (snapshot) => {
        const videos = [];
        snapshot.forEach((childSnapshot) => {
          videos.push({ id: childSnapshot.key, ...childSnapshot.val() });
        });
        setVideoList(videos);
        setLoading(false);
      }, (error) => {
        setError('Error loading videos: ' + error.message);
        setLoading(false);
      });
    } catch (err) {
      setError('Error connecting to database');
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="kids-entertainment-page">
        <div className="loading-container">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="kids-entertainment-page">
        <div className="error-container">{error}</div>
      </div>
    );
  }

  return (
    <div className="kids-entertainment-page">
      <div className="header123">
        <h1>Kids Entertainment Videos</h1>
      </div>
      {videoList.length === 0 ? (
        <div className="empty-container">No videos available</div>
      ) : (
        <div className="videos-container">
          {videoList.map((video) => (
            <div className="video-item" key={video.id}>
              <iframe
                src={`https://www.youtube.com/embed/${video.id}`}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <div className="video-title">{video.title}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default KidsEntertainment;