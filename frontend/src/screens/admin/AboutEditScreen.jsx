import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { BASE_URL } from '../../constants';
import { useNavigate } from 'react-router-dom';

const AboutEditScreen = () => {
  const [aboutInfo, setAboutInfo] = useState({
    images: [],
    videos: [],
    text: '',
  });

  const navigate = useNavigate();

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAboutInfo((prevAboutInfo) => ({
      ...prevAboutInfo,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    setAboutInfo((prevAboutInfo) => ({
      ...prevAboutInfo,
      images: [...prevAboutInfo.images, ...files],
    }));
  };

  const handleVideoChange = (e) => {
    const files = e.target.files;
    setAboutInfo((prevAboutInfo) => ({
      ...prevAboutInfo,
      videos: [...prevAboutInfo.videos, ...files],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('text', aboutInfo.text);

    // Append images to the form data
    aboutInfo.images.forEach((image) => {
      formData.append('images', image);
    });

    // Append videos to the form data
    aboutInfo.videos.forEach((video) => {
      formData.append('videos', video);
    });

    try {
      await axios.post(`${BASE_URL}/api/about`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/aboutus');
    } catch (error) {
      console.error('Error updating about information:', error.message);
    }
  };

  return (
    <div>
        <h1>Edit About Information</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="text">
          <Form.Label>About Text</Form.Label>
          <Form.Control
            type="text"
            name="text"
            value={aboutInfo.text}
            onChange={handleChange}
            placeholder="Enter about text"
          />
        </Form.Group>


        <Form.Group controlId="image">
          <Form.Label>Upload Image</Form.Label>
          <Form.Control type="file" multiple onChange={handleImageChange} />
        </Form.Group>

        <Form.Group controlId="video">
          <Form.Label>Upload Video</Form.Label>
          <Form.Control type="file" multiple onChange={handleVideoChange} />
        </Form.Group>

        <Button type="submit" variant="primary">
          Update About Information
        </Button>
      </Form>
    </div>
  );
};

export default AboutEditScreen;