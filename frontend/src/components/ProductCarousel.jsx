import React from 'react';
import { Link } from 'react-router-dom';
import { Carousel, Image } from 'react-bootstrap';
import Message from './Message';
import { useGetProductsByCategoryQuery } from '../slices/productsApiSlice';


const ProductCarousel = () => {
  const categories = ['Arts', 'Ceramic', 'Homewear', 'Furniture'];

  return (
   
    <>
    
      <div className="row">
        <div className="col-md-6">
          <CategoryCarousel category={categories[0]} />
        </div>
        <div className="col-md-6">
          <CategoryCarousel category={categories[1]} />
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <CategoryCarousel category={categories[2]} />
        </div>
        <div className="col-md-6">
          <CategoryCarousel category={categories[3]} />
        </div>
      </div>
    </>
  );
};



const CategoryCarousel = ({ category }) => {
  const { data: products, isLoading, error } = useGetProductsByCategoryQuery(category);

  return isLoading ? null : error ? (
    <Message variant='danger'>{error?.data?.message || error.error}</Message>
  ) : (
    <div className="text-center mb-4">
      <h2>{category}</h2>
      <div className="d-flex justify-content-center align-items-center flex-column">
        <Carousel pause='hover' className='bg-primary' style={{ width: '80%', height: '200px' }}>
          {products.map((product) => (
            <Carousel.Item key={product._id}>
              {/* Update the Link component to navigate to the specific category screen */}
              <Link to={`/category/${category}`} style={{ textDecoration: 'none' }}>
                <Image
                  src={product.images[0].url}
                  alt={product.name}
                  fluid
                  style={{ objectFit: 'cover', width: '100%', height: '200px' }}
                />

                <Carousel.Caption className='carousel-caption text-center'>
                  <h3 className='text-white' style={{ fontSize: '16px' }}>
                    {product.name} (${product.price})
                  </h3>
                </Carousel.Caption>
              </Link>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
    </div>
  );
};


export default ProductCarousel;