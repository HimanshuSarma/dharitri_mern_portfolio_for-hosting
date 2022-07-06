import React from 'react';
import { useEffect } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import ContentWrapper from '../Components/UIElements/ContentWrapper';

import {getCart} from '../redux/ActionCreators/cartActions';
import {getUserSelectedShippingAddress} from '../redux/ActionCreators/userActions';

import './Payment.css';

const Payment = () => {

  const {userSelectedShippingAddress} = useSelector(store => store.userSelectedShippingAddressState);
  const {cart} = useSelector(store => store.cartState)

  const dispatch = useDispatch();

  const calcTotalPriceHandler = () => {
    let price = 0;
    
    for(let i = 0; i < cart.length; i++) {
      price += cart[i].product.price;
    }

    return price;
  }

  useEffect(() => {
    dispatch(getCart());
    dispatch(getUserSelectedShippingAddress());
  }, []);

  return (
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

          <div className='payment-page-content-wrapper flex-column'>
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

            <p className='payment-page-total-price'>{`Total: $${calcTotalPriceHandler()}`}</p>
          </div>
        </div>}

        <div className='payment-page-pay-btns-wrapper flex'>
          <button>Pay Now</button>
          <button>Pay on delivery</button>
        </div>
      </ContentWrapper>
    </div>
  )
}

export default Payment