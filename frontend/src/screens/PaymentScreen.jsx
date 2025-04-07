import { useState, useEffect } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../slices/cartSlice';

const PaymentScreen = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [navigate, shippingAddress]);

  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();

    // Handle Cash on Delivery logic
    if (paymentMethod === 'CashOnDelivery') {
      // Add additional processing logic if needed
      // For example, you can display a confirmation message to the user
      // and initiate the order placement
    }

    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as='legend'>Select Method</Form.Label>
          <Col>
            <Form.Check
              className='my-2'
              type='radio'
              label='PayPal or Credit Card'
              id='PayPal'
              name='paymentMethod'
              value='PayPal'
              checked={paymentMethod === 'PayPal'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>

            <Form.Check
              className='my-2'
              type='radio'
              label='Cash on Delivery'
              id='CashOnDelivery'
              name='paymentMethod'
              value='CashOnDelivery'
              checked={paymentMethod === 'CashOnDelivery'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
          </Col>
        </Form.Group>

        {paymentMethod === 'CashOnDelivery' && (
          // You can add additional information for COD, if needed
          // For example, a confirmation message or instructions
          <div>
            <p>Cash on Delivery is available for this order.</p>
            {/* Add any additional information or instructions */}
          </div>
        )}

        <Button type='submit' variant='primary'>
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;
