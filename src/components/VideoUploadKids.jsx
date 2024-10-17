import React, { useState, useEffect } from 'react';
import { Button, Input, List, Modal } from 'antd';
import { database } from '../Firebase'; // Import the database
import { ref, set, remove, onValue } from 'firebase/database'; // Import necessary functions from Firebase
import './VideoUpload.css'; // Import CSS for styling (you can reuse the same CSS)

const VideoUploadKids = () => {
  const [videoLink, setVideoLink] = useState('');
  const [videoList, setVideoList] = useState([]);
  const [editingVideoId, setEditingVideoId] = useState(null); // State to hold the video ID being edited
  const [editingVideoLink, setEditingVideoLink] = useState(''); // State to hold the new video link
  const [videoTitle, setVideoTitle] = useState(''); // State to hold the video title
  const [editingVideoTitle, setEditingVideoTitle] = useState(''); // State to hold the new video title during editing

  // Fetch the videos from Firebase Realtime Database under the 'kids' path
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

  // Upload a video with its link and title
  const handleUpload = async () => {
    if (!videoLink || !videoTitle) {
      alert('Please enter a video title and link!');
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
      title: videoTitle, // Store the video title
    };

    try {
      const videoRef = ref(database, 'kids/' + videoId); // Store under 'kids'
      await set(videoRef, videoData);
      alert('Video link and title uploaded successfully!');
      setVideoLink('');
      setVideoTitle(''); // Clear the input fields
    } catch (error) {
      alert('Error uploading video. Please try again.');
    }
  };

  // Handle editing of a video
  const handleEdit = (id, link, title) => {
    setEditingVideoId(id);
    setEditingVideoLink(link);
    setEditingVideoTitle(title);
  };

  // Update the edited video link and title
  const handleUpdate = async () => {
    if (!editingVideoLink || !editingVideoTitle) {
      alert('Please enter a valid video title and link!');
      return;
    }

    const videoRef = ref(database, 'kids/' + editingVideoId);
    try {
      await set(videoRef, { id: editingVideoId, link: editingVideoLink, title: editingVideoTitle });
      alert('Video updated successfully!');
      setEditingVideoId(null);
      setEditingVideoLink('');
      setEditingVideoTitle('');
    } catch (error) {
      alert('Error updating video. Please try again.');
    }
  };

  // Handle deletion of a video
  const handleDelete = async (id) => {
    const videoRef = ref(database, 'kids/' + id);
    try {
      await remove(videoRef);
      alert('Video deleted successfully!');
    } catch (error) {
      alert('Error deleting video. Please try again.');
    }
  };

  return (
    <div className="video-upload-page">
      <h1>Upload YouTube Video for Kids</h1>
      <Input
        placeholder="Enter Video Title"
        value={videoTitle}
        onChange={(e) => setVideoTitle(e.target.value)}
        style={{ width: '300px', marginRight: '10px' }}
      />
      <Input
        placeholder="Enter YouTube Video Link"
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
              {item.title} ({item.link})
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
          title="Edit Video Details"
          visible={!!editingVideoId}
          onOk={handleUpdate}
          onCancel={() => setEditingVideoId(null)}
        >
          <Input
            placeholder="Edit Video Title"
            value={editingVideoTitle}
            onChange={(e) => setEditingVideoTitle(e.target.value)}
            style={{ marginBottom: '10px' }}
          />
          <Input
            placeholder="Edit YouTube Video Link"
            value={editingVideoLink}
            onChange={(e) => setEditingVideoLink(e.target.value)}
          />
        </Modal>
      )}
    </div>
  );
};

export default VideoUploadKids;
