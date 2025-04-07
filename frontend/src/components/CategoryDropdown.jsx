// CategoryDropdown.jsx
import React from 'react';
import { NavDropdown } from 'react-bootstrap'; 
import { useNavigate } from 'react-router-dom';
import { useGetProductsByCategoryQuery } from '../slices/productsApiSlice';

const CategoryDropdown = ({ categories, selectedCategory }) => {
  const navigate = useNavigate();
  const { data: products } = useGetProductsByCategoryQuery(selectedCategory);

  const handleSelect = (category) => {
    if (category === 'All Categories') {
      // If "All Categories" is selected, navigate to a route that fetches all products
      navigate(`/product`);
    } else {
      // Otherwise, navigate to the selected category route
      navigate(`/category/${encodeURIComponent(category)}`);
    }
  };
  

  const dropdownStyle = {
    color: '#ffffff', 
    fontSize: '16px', 
  
  };

  return (
    <NavDropdown
      onSelect={handleSelect}
      style={dropdownStyle}
      title={selectedCategory}
      id='basic-nav-dropdown'
      aria-label='Select a category'
    >
      {categories.map((category) => (
        <NavDropdown.Item key={category} eventKey={category}>
          {category === 'All Categories' ? 'All Categories' : category}
        </NavDropdown.Item>
      ))}
    </NavDropdown>
  );
};

export default CategoryDropdown;
