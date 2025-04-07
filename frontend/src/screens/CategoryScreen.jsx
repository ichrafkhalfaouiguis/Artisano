// Import necessary modules and hooks
import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetProductsByCategoryQuery } from '../slices/productsApiSlice';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';

// Create the TypeScreen component
const TypeScreen = () => {
  // Extract the category parameter from the URL
  const { category } = useParams();

  // Fetch data based on the category using the useGetProductsByCategoryQuery hook
  const { data, isLoading, error } = useGetProductsByCategoryQuery(category);

  return (
    <>
      <h1>{category} Products</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <div className="row">
            {data.map((product) => (
              <div key={product._id} className="col-md-3">
                <Product product={product} />
              </div>
            ))}
          </div>
          <Paginate
            pages={data.pages}
            page={data.page}
            keyword={category}
          />
        </>
      )}
    </>
  );
};

export default TypeScreen;
