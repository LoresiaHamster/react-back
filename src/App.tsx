import { useEffect, useRef, useState } from 'react';
import axios, { AxiosError, CanceledError } from 'axios';
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

  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    // get -> promise -> response / error
    const controller = new AbortController();

    setLoading(true);
    axios
      .get<User[]>('https://jsonplaceholder.typicode.com/users', {
        signal: controller.signal,
      })
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
        setLoading(false);
      });
    return () => controller.abort();
  }, []);

  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     try {
  //       const res = await axios.get<User[]>(
  //         'https://jsonplaceholder.typicode.com/xusers'
  //       );
  //       setUsers(res.data);
  //     } catch (err) {
  //       setError((err as AxiosError).message);
  //     }
  //   };
  //   fetchUsers();
  // }, []);

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
      {isLoading && <div className='spinner-border'></div>}
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
