// Videos.jsx
import React, { useEffect, useState } from 'react';
import { database } from '../Firebase';
import { ref, onValue } from 'firebase/database';
import PropTypes from 'prop-types';
import './Videos.css';

// Video Card Component
const VideoCard = ({ videoId, title }) => (
  <article className="video-card">
    <iframe
      className="video-card__frame"
      src={`https://www.youtube.com/embed/${videoId}`}
      title={title}
      allowFullScreen
    />
    <h2 className="video-card__title">{title}</h2>
  </article>
);

VideoCard.propTypes = {
  videoId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

// Main Videos Component
const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = () => {
      const videoRef = ref(database, 'videos');

      onValue(videoRef, 
        (snapshot) => {
          try {
            const data = snapshot.val();
            const formattedVideos = Object.entries(data || {}).map(([id, video]) => ({
              id,
              title: video.title,
              videoId: video.link.split('v=')[1],
            }));
            
            setVideos(formattedVideos);
            setIsLoading(false);
          } catch (err) {
            setError('Failed to load videos. Please try again later.');
            setIsLoading(false);
          }
        },
        (error) => {
          setError(error.message);
          setIsLoading(false);
        }
      );
    };

    fetchVideos();
  }, []);

  if (isLoading) {
    return <div className="videos-section">Loading videos...</div>;
  }

  if (error) {
    return <div className="videos-section">Error: {error}</div>;
  }

  return (
    <section className="videos-section">
      <header className="videos-header">
        <h1 className="videos-header__title">Uploaded Videos</h1>
      </header>
      
      <div className="videos-grid">
        {videos.length > 0 ? (
          videos.map(({ id, title, videoId }) => (
            <VideoCard
              key={id}
              videoId={videoId}
              title={title}
            />
          ))
        ) : (
          <p>No videos available.</p>
        )}
      </div>
    </section>
  );
};

export default Videos;