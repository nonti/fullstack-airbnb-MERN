import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { useContext, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import PlacesPage from './PlacesPage';
import AccountNav from '../AccountNav';

const AccountPage = () => {
  const [redirect, setRedirect] = useState(null);
  const { ready, user, setUser } = useContext(UserContext);

  let { subpage } = useParams();
  if (subpage === undefined) {
    subpage = 'profile';
  }

  if (!ready) {
    return <div>Loading...</div>;
  }

  if (ready && !user && !redirect) {
    return <Navigate to='/signin' />;
  }

  

  const signOut = async () => {
    await axios.post('/signout');
    setRedirect('/');
    setUser(null);
  };
  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div>
      <AccountNav/>
      {subpage === 'profile' && (
        <div className='text-center max-w-lg mx-auto'>
          Signed in as {user.name} {user.email}
          <br />
          <button className='primary max-w-sm mt-2' onClick={signOut}>
            Sign out
          </button>
        </div>
      )}
      {subpage === 'places' && <PlacesPage />}
    </div>
  );
};

export default AccountPage;
