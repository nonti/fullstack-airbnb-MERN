import { Route, Routes } from 'react-router-dom';
import './App.css';
import IndexPage from './pages/IndexPage';
import SignInPage from './pages/SignInPage';
import Layout from './pages/Layout';
import RegisterPage from './pages/RegisterPage';
import axios from 'axios';
import { UserContextProvider } from './context/UserContext.jsx';
import AccountPage from './pages/AccountPage.jsx';

axios.defaults.baseURL = 'http://localhost:4001';
axios.defaults.withCredentials = true;
const App = () => {
  

  return (
    <UserContextProvider>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path='/signin' element={<SignInPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/account/:subpage?' element={<AccountPage />} />
          <Route path='/account/:subpage/:action' element={<AccountPage />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
};

export default App;
