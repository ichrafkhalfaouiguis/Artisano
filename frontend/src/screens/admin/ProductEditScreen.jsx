import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify';
import axios from 'axios';
import { BASE_URL } from '../../constants';

const ProductEditScreen = () => {
  const { id: productId } = useParams();

  const [productInfo, setProductInfo] = useState({
    name: '',
    price: 0,
    brand: '',
    category: '',
    countInStock: 0,
    description: '',
    images: [],
    videos: [],
  });

  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [errorProduct, setErrorProduct] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/products/${productId}`);
        setProductInfo({
          name: data.name,
          price: data.price,
          brand: data.brand,
          category: data.category,
          countInStock: data.countInStock,
          description: data.description,
          images: data.images || [],
          videos: data.videos || [],
        });
        setLoadingProduct(false);
      } catch (error) {
        setErrorProduct(error.response?.data?.message || 'Error fetching product details');
        setLoadingProduct(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductInfo((prevProductInfo) => ({
      ...prevProductInfo,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    setProductInfo((prevProductInfo) => ({
      ...prevProductInfo,
      images: [...prevProductInfo.images, ...files],
    }));
  };
  
  const handleVideoChange = (e) => {
    const files = e.target.files;
    setProductInfo((prevProductInfo) => ({
      ...prevProductInfo,
      videos: [...prevProductInfo.videos, ...files],
    }));
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', productInfo.name);
    formData.append('price', productInfo.price);
    formData.append('brand', productInfo.brand);
    formData.append('category', productInfo.category);
    formData.append('countInStock', productInfo.countInStock);
    formData.append('description', productInfo.description);

// Clear existing images and append new ones
formData.delete('images');
productInfo.images.forEach((image) => {
  formData.append('images', image);
});

// Clear existing videos and append new ones
formData.delete('videos');
productInfo.videos.forEach((video) => {
  formData.append('videos', video);
});


    try {
      setLoadingUpdate(true);
      await axios.put(`${BASE_URL}/api/products/${productId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setLoadingUpdate(false);
      toast.success('Product updated');
    } catch (error) {
      setLoadingUpdate(false);
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  return (
    <>
      <Link to='/productlist' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Product</h1>
        {loadingUpdate && <Loader />}
        {loadingProduct ? (
          <Loader />
        ) : errorProduct ? (
          <Message variant='danger'>{errorProduct}</Message>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='text'
                name='name'
                value={productInfo.name}
                onChange={handleChange}
                placeholder='Enter name'
              />
            </Form.Group>

            <Form.Group controlId='price'>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type='text' 
                name='price'
                value={productInfo.price}
                onChange={handleChange}
                placeholder='Enter price'
              />
            </Form.Group>

            <Form.Group controlId='brand'>
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type='text'
                name='brand'
                value={productInfo.brand}
                onChange={handleChange}
                placeholder='Enter brand'
              />
            </Form.Group>

            <Form.Group controlId='countInStock'>
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type='number'
                name='countInStock'
                value={productInfo.countInStock}
                onChange={handleChange}
                placeholder='Enter countInStock'
              />
            </Form.Group>

            <Form.Group controlId='category'>
              <Form.Label>Category</Form.Label>
              <Form.Control
                as='select'
                name='category'
                value={productInfo.category}
                onChange={handleChange}
              >
                <option>select category</option>
                <option value='Arts'>Arts</option>
                <option value='Ceramic'>Ceramic</option>
                <option value='Homewear'>Homewear</option>
                <option value='Furniture'>Furniture</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId='description'>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type='text'
                name='description'
                value={productInfo.description}
                onChange={handleChange}
                placeholder='Enter description'
              />
            </Form.Group>

            {/* Conditionally render image field if there are existing images */}
            {productInfo.images.length > 0 && (
              <Form.Group controlId='images'>
                <Form.Label>Images</Form.Label>
                <Form.Control type='file' multiple onChange={handleImageChange} />
              </Form.Group>
            )}

            {/* Conditionally render video field if there are existing videos */}
            {productInfo.videos.length > 0 && (
              <Form.Group controlId='videos'>
                <Form.Label>Videos</Form.Label>
                <Form.Control type='file' multiple onChange={handleVideoChange} />
              </Form.Group>
            )}

            <Button type='submit' variant='primary' style={{ marginTop: '1rem' }}>
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default ProductEditScreen;
