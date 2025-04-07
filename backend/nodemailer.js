// nodemailer.js
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'societeguis@gmail.com',
    pass: 'daol mjre mvje wltw',
  },
});

export const sendVerificationEmail = async (email, activationCode) => {
  try {
    
    await transporter.sendMail({
      from: 'societeguis@gmail.com',
      to: email,
      subject: 'Email Verification',
      html: `
        <p>Welcome to Artisano!</p>
        <p>We're thrilled to have you on board. You recently visited our website and entered your email.</p>
        <p>Please follow the given link to verify your email:</p>
  
        <a href="https://artisano-urkx.onrender.com/verify/${activationCode}">Verify Email</a>

        <p>If you have any questions or need assistance, feel free to contact us. Thanks!</p>
      `,
    });

    console.log('Verification email sent successfully');
  } catch (error) {
    console.error('Error generating or sending verification email:', error);
    throw new Error('Error sending verification email');
  }
};

export const sendResetEmail = async (email, resetLink) => {
  try {
    // Create a nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'societeguis@gmail.com',
        pass: 'daol mjre mvje wltw',
      },
    });
    

    // Compose the email
    const mailOptions = {
      from: 'societeguis@gmail.com',
      to: email,
      subject: 'Password Reset Request',
      html: `
        <p>You have requested to reset your password.</p>
        <p>If you didn't perform this action, please contact us immediately.</p>
        <p>Click the following link to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    console.log('Password reset email sent successfully');
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Error sending password reset email');
  }
};


//confrmition order 

export const sendOrderConfirmationEmail = async (order, userEmail) => {
  try {
    // Set up your email transporter (replace the placeholders)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'societeguis@gmail.com',
        pass: 'daol mjre mvje wltw',
      },
    });

    // Email content
    const mailOptions = {
      from: 'societeguis@gmail.com',
      to: userEmail,
      subject: 'Order Confirmation',
      html: `
        <p>Thank you for your order!</p>
        <p>Order ID: ${order._id}</p>
        <p>paymentMethod: ${order.paymentMethod}</p>
        <p>itemsPrice: ${order.itemsPrice}</p>
        <p> taxPrice: ${order.taxPrice}</p>
        <p>  shippingPrice: ${order.shippingPrice}</p>
        
        <p>Shipping Address: ${order.shippingAddress}</p>
        <p>Order Total: $${order.totalPrice}</p>
        
     
      
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    console.log('Order confirmation email sent successfully');
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    throw new Error('Error sending order confirmation email');
  }
};