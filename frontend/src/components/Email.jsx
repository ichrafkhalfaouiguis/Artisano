import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { BASE_URL } from '../constants';

const Email = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setMessage('Please enter a valid email address.');
      return;
    }

    try {
      setLoading(true);

      await axios.post(`${BASE_URL}/api/users/resetPasswordRequest`, { email });

      // Update the message state upon successful submission
      setMessage('Check your email to update your password.');
    } catch (error) {
      console.error('Error sending email:', error.message);
      setMessage('Failed to send the email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1>{message}</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Button type='submit' variant='primary' disabled={loading}>
          {loading ? 'Sending...' : 'Send Email'}
        </Button>
      </Form>
    </>
  );
};

export default Email;
