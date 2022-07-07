import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {Routes, Route, Navigate} from 'react-router-dom';
import Header from './Components/Header';
import Signup from './Pages/Signup';
import UserID from './Pages/UserID';
import Login from './Pages/Login';
import Products from './Pages/Products';
import ProductScreen from './Pages/ProductScreen';
import Cart from './Pages/Cart';
import Subscriptions from './Pages/Subscriptions';
import Checkout from './Pages/Checkout';
import Payment from './Pages/Payment';
import NotFound from './Pages/NotFound';

import {base_url} from './Data/config';

import {checkUserLogin} from './redux/ActionCreators/userActions';
// import {getUserDefaultProductsPage} from './redux/ActionCreators/userActions';

import './App.css';

function App() {
  const dispatch = useDispatch();

  const isLoggedInState = useSelector(store => store.isLoggedInState);

  useEffect(() => {
    dispatch(checkUserLogin());
  }, []);

  return (
    <>
      <Header />
      <main className='width-limit-center main-component-margin'>
        <Routes>
          {!isLoggedInState && <Route path='/signup' element={<Signup />} />}
          <Route path='/userID' element={<UserID />} />
          <Route path='/login' element={<Login />} />
          <Route path='/products' element={<Products />} />
          <Route path='/product/:productID' element={<ProductScreen />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/subscriptions' element={<Subscriptions />} />
          <Route path='/not-found' element={<NotFound />} />
          <Route path='/checkout' element={<Checkout />} />
          <Route path='/payment' element={<Payment />} />
          {!isLoggedInState && <Route path='/*' element={<Navigate to='/signup' />} />}
          {isLoggedInState && <Route path='/*' element={<Navigate to='/products?page=1' />} />}
        </Routes> 
      </main>
    </>
  );
}

export default App;