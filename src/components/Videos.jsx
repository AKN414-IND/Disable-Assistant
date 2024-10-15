import React, { useEffect, useState } from 'react';
import { database } from '../Firebase'; 
import { ref, onValue } from 'firebase/database';
import './Videos.css'; 
export default function Videos() {
  const [videoLinks, setVideoLinks] = useState([]);

  useEffect(() => {
    const videoRef = ref(database, 'videos');

    onValue(videoRef, (snapshot) => {
      const data = snapshot.val();
      const videosArray = [];

      for (let id in data) {
        videosArray.push({ id, ...data[id] }); 
      }
      setVideoLinks(videosArray);
    });
  }, []);

  return (
    <div>
      <div className="header123">
      <h1>Uploaded Videos</h1>
      </div>
      <div className="videos-container">
        {videoLinks.map((video) => (
          <div className="video-item" key={video.id}>
            <iframe
              src={`https://www.youtube.com/embed/${video.link.split('v=')[1]}`}
              title={video.link}
              frameBorder="0"
              allowFullScreen
            ></iframe>
            <div className="video-title">{video.title}</div> 
          </div>
        ))}
      </div>
    </div>
  );
}
