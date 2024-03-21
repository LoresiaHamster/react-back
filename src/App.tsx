import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import ProductList from './components/ProductList';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';

const connect = () => console.log('Connecting');
const disconnect = () => console.log('Disconnecting');

interface User {
  id: number;
  name: string;
}

function App() {
  const [category, setCategory] = useState('');

  const [users, setUsers] = useState<User[]>([]);

  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get<User[]>('https://jsonplaceholder.typicode.com/xusers')
      .then((res) => setUsers(res.data))
      .catch((err) => setError(err.message));
  }, []);

  // useEffect(() => {
  //   connect();
  //   return () => disconnect();
  // });

  return (
    <div>
      <select
        className='form-select'
        onChange={(event) => setCategory(event.target.value)}
      >
        <option value=''></option>
        <option value='Clothing'>Clothing</option>
        <option value='Household'>Household</option>
      </select>
      {/* <ProductList category={category} /> */}
      <br />
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
      {error && <p className='text-danger'>{error}</p>}
    </div>
  );
}

export default App;
