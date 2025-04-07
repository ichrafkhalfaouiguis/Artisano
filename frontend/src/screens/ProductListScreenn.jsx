import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import Paginate from '../components/Paginate';
import { Row, Col } from 'react-bootstrap';

const ProductListScreen = () => {
  const { pageNumber, keyword } = useParams();

  const { data, isLoading, error } = useGetProductsQuery({
    keyword: keyword || '',
    page: pageNumber || 1,
  });

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Meta />
          <h1>Products</h1>
          {data.products.length === 0 ? (
            <Message>No products found</Message>
          ) : (
            <>
              <Row>
                {data.products.map((product) => (
                  <Col key={product.id} sm={12} md={6} lg={4} xl={3}>
                    <Product product={product} />
                  </Col>
                ))}
              </Row>
              <Paginate
                pages={data.totalPages}
                page={data.page}
                keyword={keyword ? keyword : ''}
              />
            </>
          )}
        </>
      )}
    </>
  );
};

export default ProductListScreen;
