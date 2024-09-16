import axios from 'axios';
import { useContext, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const SignInPage = () => {
  const [email, setEmail]  = useState('');
  const [ password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const {setUser} = useContext(UserContext);

  const handleSigninSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // API call to signin user
    const {data} = await axios.post('/signin', {email, password});
    setUser(data);
      alert('Sign in successful, you can now access your account');
      setRedirect(true);
    } catch (err) {
      alert(err)
    }
  }

  if(redirect) {
    return <Navigate to={'/'}/>
  }
  return (
    <div className='mt-4 grow flex items-center justify-around'>
      <div className='mb-64'>
      <h1 className='text-4xl text-center mb-4'>Sign in </h1>
      <form className='max-w-lg mx-auto ' onSubmit={handleSigninSubmit}>
        <input type='email' 
        placeholder='your@mail.com' 
        value={email}  
        onChange={e => setEmail(e.target.value)}/>
        <input type='password' 
        placeholder='password' 
        value={password} 
        onChange={e => setPassword(e.target.value) }/>
        <button className='primary'>Signin</button>
        <div className='text-center py-2 text-gray-500'>
          Don&apos;t have an acount yet? <Link to={'/register'} className='underline text-black'>Register now</Link>
        </div>
      </form>
      </div>
    </div>
  )
}

export default SignInPage;