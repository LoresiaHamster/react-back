import { useEffect, useRef, useState } from 'react';
import ProductList from './components/ProductList';
import { CanceledError } from './services/api-client';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import userService, { User } from './services/user-service';

const connect = () => console.log('Connecting');
const disconnect = () => console.log('Disconnecting');

function App() {
  const [category, setCategory] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');

  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    // get -> promise -> response / error

    setLoading(true);
    const { request, cancel } = userService.getAll<User>();
    request
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
        setLoading(false);
      });
    return () => cancel();
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

  const deleteUser = (user: User) => {
    const origianlUsers = [...users];
    setUsers(users.filter((u) => u.id != user.id));
    userService.delete(user.id).catch((err) => {
      setError(err.message);
      setUsers(origianlUsers);
    });
  };

  const addUser = () => {
    const origianlUsers = [...users];
    const newUser = { id: 0, name: 'Mosh' };
    setUsers([newUser, ...users]);
    userService
      .create(newUser)
      .then(({ data: savedUser }) => setUsers([savedUser, ...users]))
      .catch((err) => {
        setError(err.message);
        setUsers(origianlUsers);
      });
  };

  const updateUser = (user: User) => {
    const origianlUsers = [...users];
    const updatedUser = { ...user, name: user.name + '!' };
    setUsers(users.map((u) => (u.id === user.id ? updatedUser : u)));
    userService.update(updatedUser).catch((err) => {
      setError(err.message);
      setUsers(origianlUsers);
    });
  };

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

      <button className='btn btn-primary mb-3' onClick={addUser}>
        Add
      </button>
      {error && <p className='text-danger'>{error}</p>}
      <ul className='list-group'>
        {users.map((user) => (
          <li
            key={user.id}
            className='list-group-item d-flex gap-5 justify-content-between align-items-center'
          >
            {user.name}
            <div>
              <button
                className='btn btn-outline-secondary mx-1'
                onClick={() => updateUser(user)}
              >
                Update
              </button>
              <button
                onClick={() => deleteUser(user)}
                className='btn btn-outline-danger'
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
