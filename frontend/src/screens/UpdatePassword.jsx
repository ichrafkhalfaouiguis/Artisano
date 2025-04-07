import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';  
import axios from 'axios';
import { useResetMutation } from '../slices/usersApiSlice';
import { BASE_URL } from '../constants';
const UpdatePassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useParams(); 
  // Use the generated hook for the resetpwd mutation


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      setIsLoading(true);

      // Use the 'token' variable in the API endpoint
      await axios.post(`${BASE_URL}/api/users/resetPassword/${token}`, {
        password,
      });

      setMessage('Password updated successfully');
    } catch (error) {
      console.error('Error updating password:', error.message);
      setMessage('Failed to update password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <>
      <h1>{message}</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId='password'>
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter new password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId='confirmPassword'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Confirm password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>

        <Button type='submit' variant='primary' disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update Password'}
        </Button>
      </Form>
    </>
  );
};

export default UpdatePassword;
