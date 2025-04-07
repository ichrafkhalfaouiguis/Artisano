import React, { useState, useEffect } from 'react';
import {  useNavigate } from 'react-router-dom';
import { Table, Button, Image } from 'react-bootstrap';
import { FaTrash, FaEdit } from 'react-icons/fa';
import axios from 'axios';
import { BASE_URL } from '../../constants';
import { toast } from 'react-toastify';
//import Loader from '../../components/Loader';
import Paginate from '../../components/Paginate';

const AboutListScreen = () => {
  const navigate = useNavigate();
  const [aboutInfo, setAboutInfo] = useState({
    images: [],
    videos: [],
    text: '',
  });

  useEffect(() => {
    const fetchAboutInfo = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/about`);
        setAboutInfo(response.data || { images: [], videos: [], text: '' });
      } catch (error) {
        console.error('Error fetching about information:', error.message);
      }
    };

    fetchAboutInfo();
  }, []);


  const handleDelete = async (type, index, url) => {
    try {
      const updatedInfo = { ...aboutInfo };
      updatedInfo[type].splice(index, 1);
      setAboutInfo(updatedInfo);

      if (type === 'images') {
        const deleteUrl = `${BASE_URL}/api/about/deleteImage/${encodeURIComponent(url)}`;
        console.log('Delete Image URL:', deleteUrl);
        await axios.delete(deleteUrl);
      } else if (type === 'videos') {
        const deleteUrl = `${BASE_URL}/api/about/deleteVideo/${encodeURIComponent(url)}`;
        console.log('Delete Video URL:', deleteUrl);
        await axios.delete(deleteUrl);
      }
    } catch (error) {
      console.error('Error deleting item:', error.message);
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <>
      <h1>About List</h1>
      <Button variant="primary" className="mb-3" onClick={() => navigate('/admin/about/edit')}>
        <FaEdit /> Edit About
      </Button>
      {aboutInfo.images.length === 0 && aboutInfo.videos.length === 0 && (
        <p>No images or videos available.</p>
      )}

{aboutInfo.images.length > 0 && (
  <>
    <h2>Images</h2>
    <Table striped bordered hover>
      {/* Table header */}
      <thead>
        <tr>
          <th>Type</th>
          <th>Media</th>
          <th>Action</th>
        </tr>
      </thead>
      {/* Table body */}
      <tbody>
        {aboutInfo.images.map((image, index) => (
          <tr key={index}>
            <td>Image</td>
            <td>
              <Image
                src={image.url}
                alt={`Image ${index}`}
                thumbnail
                style={{ maxWidth: '100px', maxHeight: '100px' }}
              />
            </td>
            <td>
              <Button
                variant="danger"
                className="btn-sm"
                onClick={() => handleDelete('images', index, image.url)}
              >
                <FaTrash style={{ color: 'white' }} />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  </>
)}

{aboutInfo.videos.length > 0 && (
  <>
    <h2>Videos</h2>
    <Table striped bordered hover>
      {/* Table header */}
      <thead>
        <tr>
          <th>Type</th>
          <th>Media</th>
          <th>Action</th>
        </tr>
      </thead>
      {/* Table body */}
      <tbody>
        {aboutInfo.videos.map((video, index) => (
          <tr key={index}>
            <td>Video</td>
            <td>
                <video  autoPlay muted playsInline>
              
                <source src={video.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </td>
            <td>
              <Button
                variant="danger"
                className="btn-sm"
                onClick={() => handleDelete('videos', index, video.url)}
              >
                <FaTrash style={{ color: 'white' }} />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  </>
)}

<Paginate pages={1} page={1} isAdmin={true} />

    </>
  );
};

export default AboutListScreen;
