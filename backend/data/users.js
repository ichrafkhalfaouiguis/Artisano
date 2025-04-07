import bcrypt from 'bcryptjs';

const users = [
  {
    name: 'ichraf khalfaoui',
    email: 'ichrafkhalfaoui1@gmail.com',
    password: bcrypt.hashSync('123456789', 10),
    isAdmin: true,
  },

  
];

export default users;