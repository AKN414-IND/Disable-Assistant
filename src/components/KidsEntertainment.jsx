import React, { useState, useEffect } from 'react';
import { List } from 'antd';
import { database } from '../Firebase';
import { ref, onValue } from 'firebase/database';
import './KidsEntertainment.css';

const KidsEntertainment = () => {
  const [videoList, setVideoList] = useState([]);

  useEffect(() => {
    const videoRef = ref(database, 'kids');
    onValue(videoRef, (snapshot) => {
      const videos = [];
      snapshot.forEach((childSnapshot) => {
        const videoData = childSnapshot.val();
        videos.push(videoData);
      });
      setVideoList(videos);
    });
  }, []);

  return (
    <div className="kids-entertainment-page">
      <h1>Kids Entertainment Videos</h1>
      <div className="videos-container">
        <List
          bordered
          dataSource={videoList}
          renderItem={(item) => (
            <List.Item>
              <div className="video-container">
                <h3>{item.title}</h3>
                <iframe
                  className="video-iframe"
                  width="560"
                  height="315"
                  src={`https://www.youtube.com/embed/${item.id}`}
                  title={item.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </List.Item>
          )}
          style={{ marginTop: '20px' }}
        />
      </div>
    </div>
  );
};

export default KidsEntertainment;
