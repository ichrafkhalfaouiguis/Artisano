import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';  
import axios from 'axios';
import Message from './Message';
import { BASE_URL } from '../constants';

const VideoCarousel = () => {
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/about/media`);
        
        setImages(response.data.images || []);
      } catch (error) {
        console.error('Error fetching images:', error.message);
        setError('Failed to fetch images');
      }
    };
  
    fetchImages();
  }, []);
  

  return (
    <>
      {error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Link to="/aboutus" style={{ textDecoration: 'none' }}>
          <Carousel pause="hover" className="bg-secondary mb-4">
            {images.map((image, index) => (
              <Carousel.Item key={index}>
                <img
                  src={image.url}
                  alt={`carousel-item-${index}`}
                  className="d-block w-100"  // Bootstrap responsive class for images
                  style={{ maxHeight: '500px', objectFit: 'cover' }} // Add max height and cover style
                />
                <Carousel.Caption>
                  <h2 className="text-white text-center">About Us</h2>
                </Carousel.Caption>
              </Carousel.Item>
            ))}
          </Carousel>
        </Link>
      )}
    </>
  );
};

export default VideoCarousel;
