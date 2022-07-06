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

  const loadRazorpay = async () => {
      return new Promise(resolve => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
          resolve(true);
        }
        
        script.onerror = () => {
          resolve(false);
        }

        document.body.appendChild(script);
      })
      
  }

  const displayRazorpay = async () => {

      const res = await loadRazorpay();

      if(res) {

        const req = await fetch(`${base_url}/payment`, {method: 'POST'});

        const reqData = await req.json();

        console.log(reqData);

        var options = {
          key: "rzp_test_PcYZNPLdjfBmIN", // Enter the Key ID generated from the Dashboard
          amount: reqData.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
          currency: reqData.currency,
          name: reqData.name,
          description: "Test Transaction",
          image: "https://example.com/your_logo",
          order_id: reqData.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
          handler: function (response){
              alert(response.razorpay_payment_id);
              alert(response.razorpay_order_id);
              alert(response.razorpay_signature);
              alert('Payment successful')
          },
          prefill: {
              "name": "Gaurav Kumar",
              "email": "gaurav.kumar@example.com",
              "contact": "9999999999"
          }
        };

        var rzp1 = new window.Razorpay(options);
        rzp1.open();
      } 

      
    }

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
      {/* <button onClick={displayRazorpay}>Pay</button> */}
    </>
  );
}

export default App;