
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../constants';

function Activation() {
  const{activationCode} = useParams();
   axios.post(`${BASE_URL}/api/users/verifyuser/${activationCode}`);
       
  return (
    <div>
      <h2>Account Activation</h2>
      <h1>Account activated successfully!</h1>
    </div>
  );
}

export default Activation;
