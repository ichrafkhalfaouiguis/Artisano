import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    // Set JWT as an HTTP-Only cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
      sameSite: 'strict', // Prevent CSRF attacks
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
  } catch (error) {
    console.error('Error generating token:', error);
    // Handle the error as needed, e.g., return an HTTP response with an error message.
  }
};

export default generateToken;
