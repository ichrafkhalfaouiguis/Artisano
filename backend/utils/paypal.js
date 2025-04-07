import axios from 'axios';

const PAYPAL_API_URL = 'https://api.paypal.com/v2';

const verifyPayPalPayment = async (orderId) => {
  try {
    const response = await axios.get(`${PAYPAL_API_URL}/checkout/orders/${orderId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer YOUR_PAYPAL_ACCESS_TOKEN`,
      },
    });

    const orderStatus = response.data.status;
    const transactionAmount = response.data.purchase_units[0].amount.value;

    // Check if the order is approved and the transaction amount matches your expectations
    const verified = orderStatus === 'APPROVED' && transactionAmount === 'YOUR_EXPECTED_AMOUNT';

    return { verified, value: transactionAmount };
  } catch (error) {
    console.error('Error verifying PayPal payment:', error.message);
    throw error;
  }
};

const checkIfNewTransaction = async (OrderModel, transactionId) => {
  try {
    // Check if the transaction ID already exists in the database
    const existingOrder = await OrderModel.findOne({
      'paymentResult.id': transactionId,
    });

    return !existingOrder;
  } catch (error) {
    console.error('Error checking if transaction is new:', error.message);
    throw error;
  }
};

export { verifyPayPalPayment, checkIfNewTransaction };
