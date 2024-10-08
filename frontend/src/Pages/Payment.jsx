import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { useNavigate, NavLink } from 'react-router-dom';
import ContentWrapper from '../Components/UIElements/ContentWrapper';
import Backdrop from '../Components/UIElements/Backdrop';
import LoadingSpinner from '../Components/UIElements/LoadingSpinner';

import {getCart, deleteCart} from '../redux/ActionCreators/cartActions';
import {getUserSelectedShippingAddress, getUserPaymentStatus} from '../redux/ActionCreators/userActions';
import { calcTotalPriceHandler } from '../utils/computeCartPrice'

import { base_url } from '../Data/config';

import './Payment.css';

const Payment = () => {

  const [razorpaySdkLoading, setRazorpaySdkLoading] = useState(false);
  const [loadPaymentStatus, setLoadPaymentStatus] = useState(false);

  const {userSelectedShippingAddress} = useSelector(store => store.userSelectedShippingAddressState);
  const {userOrderID, isOrderPaid} = useSelector(store => store.userOrderDetails);
  const {cart} = useSelector(store => store.cartState);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loadRazorpay = async () => {
      setRazorpaySdkLoading(true);
      return new Promise(resolve => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
          resolve(true);
          setRazorpaySdkLoading(false);
        }
        
        script.onerror = () => {
          resolve(false);
          setRazorpaySdkLoading(false);
        }

        document.body.appendChild(script);
      })
      
  }

  const displayRazorpay = async () => {

    const res = await loadRazorpay();

    if(res) {

      const req = await fetch(`${base_url}/payment`, {
        method: 'POST',
        credentials: 'include'
      });

      const reqData = await req.json();

      var options = {
        key: "rzp_test_mtStAqKNFgh6Un", // Enter the Key ID generated from the Dashboard
        amount: reqData.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: reqData.currency,
        name: reqData.name,
        description: "Test Transaction",
        image: "https://example.com/your_logo",
        order_id: reqData.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        handler: function (response){
          setLoadPaymentStatus(true);
          dispatch({
            type: 'UPDATE_USER_ORDER_ID',
            payload: response.razorpay_order_id
          });
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
    dispatch(getCart());
    dispatch(getUserSelectedShippingAddress());
  }, []);

  useEffect(() => {
    if(!isOrderPaid && userOrderID) {
      setTimeout(() => {
        dispatch(getUserPaymentStatus(userOrderID)); 
      }, 2000);
    } else if (isOrderPaid && userOrderID) {
      setTimeout(() => {
        dispatch(deleteCart());
        dispatch({
          type: 'USER_PAYMENT_STATUS_DELETE'
        });
        navigate('/products?page=1')
      }, 5000)
    }
  }, [loadPaymentStatus, isOrderPaid, userOrderID]);

  return (
    <>
    {razorpaySdkLoading && 
    <Backdrop>
      <LoadingSpinner />
    </Backdrop> }
    <div className='payment-page-whole-screen-wrapper'>
      <ContentWrapper>
        <h1 className='page-main-header'>
          Payment Details: 
        </h1>

        {cart && userSelectedShippingAddress && 
        <div className='payment-page-details-wrapper flex-column'>
          <div className='payment-page-content-wrapper flex-column'>
            <h3 className='payment-page-secondary-header font-wt-400'>Deliver to</h3>
            <h3 className=''>{`${userSelectedShippingAddress.state}, ${userSelectedShippingAddress.district}, ${userSelectedShippingAddress.town_city}, 
              ${userSelectedShippingAddress.street}, ${userSelectedShippingAddress.house_number}, ${userSelectedShippingAddress.pincode}`}
            </h3>
          </div>

          {cart?.length > 0 ? <div className='payment-page-content-wrapper flex-column'>
            <h3 className='payment-page-secondary-header font-wt-400'>Products: </h3>
            {cart.map((cartItem, index) => {
              return (
                <div className='payment-page-cart-item-wrapper flex' key={index}>
                  <img className='payment-page-cart-item-image' src={cartItem.product.image} alt="" />
                  <div className='payment-page-cart-item-description-wrapper flex-column'>
                    <h4>{cartItem.product.name}</h4>
                    <p className='payment-page-cart-item-price'>
                      {`${cartItem.qty} * $${cartItem.product.price} = $${cartItem.product.price * cartItem.qty}`}
                    </p>
                  </div>
                </div>
              )
            })}

            <p className='payment-page-total-price'>{`Total: $${calcTotalPriceHandler(cart)}`}</p>
          </div> : null}

          <div>
            {userOrderID && !isOrderPaid &&
              <h3>
                Order payment processing...
              </h3>
            }

            {userOrderID && isOrderPaid &&
              <h3>
                Payment successfull, redirecting...
              </h3>
            }
          </div>
        </div>}

        <div className='payment-page-pay-btns-wrapper flex'>
          <button onClick={displayRazorpay}>Pay Now</button>
          {/* <button>Pay on delivery</button> */}
          <NavLink to='/orders'>View your orders</NavLink>
        </div>        
      </ContentWrapper>
    </div>
    </>
  )
}

export default Payment