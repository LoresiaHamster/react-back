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

  useEffect(() => {
    axios
      .get<User[]>('https://jsonplaceholder.typicode.com/users')
      .then((res) => setUsers(res.data));
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
    </div>
  );
}

export default App;
