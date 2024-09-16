import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleUserRegistration = async (e) => {
    e.preventDefault();
    // API call to register user
    try {
      await axios.post('/register', {
        name, 
        email,
        password
      });
      alert('Registration successful, you can login now');

    } catch (err) {
      alert('Registration failed, please try again later', err);
    }
   
  };
  return (
    <div className='mt-4 grow flex items-center justify-around'>
      <div className='mb-64'>
        <h1 className='text-4xl text-center mb-4'>Register</h1>
        <form className='max-w-lg mx-auto ' onSubmit={handleUserRegistration}>
          <input
            type='text'
            placeholder='John Doe'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type='email'
            placeholder='your@mail.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type='password'
            placeholder='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className='primary'>Register</button>
          <div className='text-center py-2 text-gray-500'>
            Already a member?{' '}
            <Link className='underline text-black' to={'/signin'}>
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
