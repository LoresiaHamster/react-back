import { useEffect, useRef, useState } from 'react';
import ProductList from './components/ProductList';
import { CanceledError } from './services/api-client';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import userService, { User } from './services/user-service';
import useUsers from './hooks/useUsers';

const connect = () => console.log('Connecting');
const disconnect = () => console.log('Disconnecting');

function App() {
  const { users, error, isLoading, setUsers, setError } = useUsers();

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
