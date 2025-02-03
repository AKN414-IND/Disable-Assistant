import React, { useState, useEffect } from 'react';
import { ref, set, remove, onValue } from 'firebase/database';
import './VideoUpload.css';
import { database } from '../Firebase';

const VideoUpload = () => {
  const [videoLink, setVideoLink] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [videoList, setVideoList] = useState([]);
  const [editingVideo, setEditingVideo] = useState(null);
  const [errors, setErrors] = useState({ title: '', link: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const videoRef = ref(database, 'videos');
    onValue(videoRef, (snapshot) => {
      const videos = [];
      snapshot.forEach((childSnapshot) => {
        const videoData = childSnapshot.val();
        videos.push(videoData);
      });
      setVideoList(videos);
    });
  }, []);

  const validateInputs = () => {
    const newErrors = {};
    
    // Validate title
    if (!videoTitle.trim()) {
      newErrors.title = 'Title is required';
    } else if (videoTitle.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    
    // Validate YouTube link
    if (!videoLink.trim()) {
      newErrors.link = 'Video link is required';
    } else {
      const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
      if (!youtubeRegex.test(videoLink)) {
        newErrors.link = 'Please enter a valid YouTube URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpload = async () => {
    if (!validateInputs()) return;

    setIsLoading(true);
    try {
      const videoId = videoLink.split('v=')[1]?.split('&')[0];
      if (!videoId) {
        alert('Please enter a valid YouTube link!');
        return;
      }

      const videoData = {
        id: videoId,
        link: videoLink,
        title: videoTitle,
      };

      const videoRef = ref(database, 'videos/' + videoId);
      await set(videoRef, videoData);
      setVideoLink('');
      setVideoTitle('');
    } catch (error) {
      setErrors({ global: 'Failed to upload video. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingVideo.link || !editingVideo.title) {
      alert('Please enter both video title and link!');
      return;
    }

    const videoRef = ref(database, 'videos/' + editingVideo.id);
    try {
      await set(videoRef, editingVideo);
      setEditingVideo(null);
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  const handleDelete = async (id) => {
    const videoRef = ref(database, 'videos/' + id);
    try {
      await remove(videoRef);
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  return (
    <div className="video-upload-container">
      <div className="video-upload-wrapper">
        <h1>YouTube Video Library</h1>
        
        {errors.global && <div className="global-error">{errors.global}</div>}
        
        <div className="input-section">
          
            <input
              type="text"
              placeholder="Video Title"
              value={videoTitle}
              onChange={(e) => {
                setVideoTitle(e.target.value);
                setErrors({ ...errors, title: '' });
              }}
              className={errors.title ? 'input-error' : ''}
              disabled={isLoading}
              maxLength={100}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          
            <input
              type="text"
              placeholder="YouTube Video Link"
              value={videoLink}
              onChange={(e) => {
                setVideoLink(e.target.value);
                setErrors({ ...errors, link: '' });
              }}
              className={errors.link ? 'input-error' : ''}
              disabled={isLoading}
            />
            {errors.link && <span className="error-message">{errors.link}</span>}
          
          
          <button 
            onClick={handleUpload}
            disabled={isLoading || !videoTitle.trim() || !videoLink.trim()}
          >
            {isLoading ? 'Adding...' : 'Add Video'}
          </button>
        </div>

        <div className="video-list">
          {videoList.map((video) => (
            <div key={video.id} className="video-item">
              <a 
                href={`https://www.youtube.com/watch?v=${video.id}`} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <div className="video-details">
                  <h3>{video.title}</h3>
                  <p>{video.link}</p>
                </div>
              </a>
              <div className="video-actions">
                <button onClick={() => setEditingVideo(video)}>
                  Edit
                </button>
                <button 
                  className="delete-btn" 
                  onClick={() => handleDelete(video.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {editingVideo && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Edit Video</h2>
              <input
                type="text"
                value={editingVideo.title}
                onChange={(e) => setEditingVideo({...editingVideo, title: e.target.value})}
                placeholder="Video Title"
              />
              <input
                type="text"
                value={editingVideo.link}
                onChange={(e) => setEditingVideo({...editingVideo, link: e.target.value})}
                placeholder="Video Link"
              />
              <div className="modal-actions">
                <button onClick={() => setEditingVideo(null)}>
                  Cancel
                </button>
                <button onClick={handleUpdate}>
                  Update
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoUpload;