import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Carousel, Card } from 'react-bootstrap';
import axios from 'axios';
import { BASE_URL } from '../constants';

const AboutUsScreen = () => {
  const [aboutInfo, setAboutInfo] = useState({
    images: [],
    videos: [],
    text: '',
  });

  useEffect(() => {
    const fetchAboutInfo = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/about/media`);
   
        setAboutInfo(response.data || { images: [], videos: [], text: '' });
      } catch (error) {
        console.error('Error fetching about information:', error.message);
      }
    };
  
    fetchAboutInfo();
  }, []);
  

  return (
    <Container>
      <Row>
        <Col md={6}>
          {/* Video Carousel */}
          <Carousel>
  {aboutInfo.videos.map((video, index) => (
    <Carousel.Item key={index}>
      <video className="d-block w-100" autoPlay muted playsInline>
        <source src={video.url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </Carousel.Item>
  ))}
</Carousel>

        </Col>
        <Col md={6}>
          {/* About Text */}
          <div className="mt-4">
            <p>{aboutInfo.text}</p>
          </div>
          {/* Image Cards */}
          <Row className="mt-4">
            {aboutInfo.images.map((image, index) => (
              <Col key={index} md={4}>
                <Card>
                  <Card.Img variant="top" src={image.url} alt={`Image ${index}`} />
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default AboutUsScreen;
