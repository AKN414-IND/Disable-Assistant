import React, { useState, useEffect } from 'react';
import { Button, Input, List, Modal } from 'antd';
import { database } from '../Firebase'; 
import { ref, set, remove, onValue } from 'firebase/database'; 
import './VideoUpload.css'; 

const VideoUpload = () => {
  const [videoLink, setVideoLink] = useState('');
  const [videoTitle, setVideoTitle] = useState(''); 
  const [videoList, setVideoList] = useState([]);
  const [editingVideoId, setEditingVideoId] = useState(null); 
  const [editingVideoLink, setEditingVideoLink] = useState(''); 
  const [editingVideoTitle, setEditingVideoTitle] = useState(''); 

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

  const handleUpload = async () => {
    if (!videoLink || !videoTitle) {
      alert('Please enter both video title and link!');
      return;
    }

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

    try {
      const videoRef = ref(database, 'videos/' + videoId);
      await set(videoRef, videoData);
      alert('Video link uploaded successfully!');
      setVideoLink('');
      setVideoTitle(''); 
    } catch (error) {
      alert('Error uploading video link. Please try again.');
    }
  };

  const handleEdit = (id, link, title) => {
    setEditingVideoId(id);
    setEditingVideoLink(link);
    setEditingVideoTitle(title); 
  };

  const handleUpdate = async () => {
    if (!editingVideoLink || !editingVideoTitle) {
      alert('Please enter both video title and link!');
      return;
    }

    const videoRef = ref(database, 'videos/' + editingVideoId);
    try {
      await set(videoRef, { id: editingVideoId, link: editingVideoLink, title: editingVideoTitle }); 
      alert('Video link updated successfully!');
      setEditingVideoId(null);
      setEditingVideoLink('');
      setEditingVideoTitle(''); 
    } catch (error) {
      alert('Error updating video link. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    const videoRef = ref(database, 'videos/' + id);
    try {
      await remove(videoRef);
      alert('Video link deleted successfully!');
    } catch (error) {
      alert('Error deleting video link. Please try again.');
    }
  };

  return (
    <div className="video-upload-page">
      <h1>Upload YouTube Video Link</h1>
      <Input
        placeholder="Enter video title"
        value={videoTitle}
        onChange={(e) => setVideoTitle(e.target.value)} 
        style={{ width: '300px', marginRight: '10px' }}
      />
      <Input
        placeholder="Enter YouTube video link"
        value={videoLink}
        onChange={(e) => setVideoLink(e.target.value)}
        style={{ width: '300px', marginRight: '10px' }}
      />
      <Button type="primary" onClick={handleUpload}>
        Upload
      </Button>

      <h2 style={{ marginTop: '20px' }}>Uploaded Videos</h2>
      <List
        bordered
        dataSource={videoList}
        renderItem={(item) => (
          <List.Item>
            <a href={`https://www.youtube.com/watch?v=${item.id}`} target="_blank" rel="noopener noreferrer">
              {item.title} - {item.link} 
            </a>
            <Button onClick={() => handleEdit(item.id, item.link, item.title)} style={{ marginLeft: '10px' }}>
              Edit
            </Button>
            <Button onClick={() => handleDelete(item.id)} type="danger" style={{ marginLeft: '10px' }}>
              Delete
            </Button>
          </List.Item>
        )}
        style={{ marginTop: '20px' }}
      />

      {editingVideoId && (
        <Modal
          title="Edit Video Link"
          visible={!!editingVideoId}
          onOk={handleUpdate}
          onCancel={() => setEditingVideoId(null)}
        >
          <Input
            placeholder="Enter new video title"
            value={editingVideoTitle}
            onChange={(e) => setEditingVideoTitle(e.target.value)} 
          />
          <Input
            placeholder="Enter new YouTube video link"
            value={editingVideoLink}
            onChange={(e) => setEditingVideoLink(e.target.value)}
          />
        </Modal>
      )}
    </div>
  );
};

export default VideoUpload;
