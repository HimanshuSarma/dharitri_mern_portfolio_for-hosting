import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {NavLink, useNavigate} from 'react-router-dom';
import ContentWrapper from '../Components/UIElements/ContentWrapper';
import {shippingAddressFormInputs, signupFormInputs} from '../Data/FormInputs';
import FormInput from '../Components/UIElements/FormInput';

import Backdrop from '../Components/UIElements/Backdrop';
import WhiteMessageCard from '../Components/UIElements/WhiteMessageCard';

import {getUserShippingAddress, updateUserShippingAddress, getUserShippingAddresses} from '../redux/ActionCreators/userActions';
import {getCart} from '../redux/ActionCreators/cartActions';
import { calcTotalPriceHandler } from '../utils/computeCartPrice'

import './Checkout.css';

const Checkout = () => {

  const [checkoutFormInputs, setCheckoutFormInputs] = useState(shippingAddressFormInputs);
  const [checkoutFormState, setCheckoutFormState] = useState({
    state: '',
    district: '',
    post_office: '',
    town_city: '',
    street: '',
    house_number: '',
    pincode: ''
  });
  const [selectShippingAddressMessage, setSelectShippingAddressMessage] = useState(null);

  const {userShippingAddresses} = useSelector(store => store.userShippingAddressesState);
  const {userShippingAddress} = useSelector(store => store.userShippingAddressState);
  const {userSelectedShippingAddress} = useSelector(store => store.userSelectedShippingAddressState);
  const {cart} = useSelector(store => store.cartState);

  const dispatch = useDispatch();
  const navigate = useNavigate();


  useEffect(() => {
    if(!cart) {
      dispatch(getCart());
    }

    dispatch(getUserShippingAddresses());
    dispatch(getUserShippingAddress());
  }, []);

  // useEffect(() => {
  //   dispatch()
  // }, [userShippingAddress]);

  return (
    <div className='checkout-page-whole-screen-wrapper'>
      {selectShippingAddressMessage && 
      <Backdrop setSelectShippingAddressMessage={setSelectShippingAddressMessage}>
        <WhiteMessageCard style={{}} setSelectShippingAddressMessage={setSelectShippingAddressMessage}>
          <h3>{selectShippingAddressMessage}</h3>
        </WhiteMessageCard>
      </Backdrop>}
      <ContentWrapper>
        {cart && cart.length > 0 && 
        <div className='checkout-page-flex-wrapper flex'>
          <div className='checkout-page-shipping-wrapper address'>
            <h1 className='page-main-header'>Shipping Info: </h1>

            {userSelectedShippingAddress && 
            <div>
              <h3 className='checkout-page-shipping-secondary-header font-wt-400'>
                Selected address: 
              </h3>

              <h3 className='checkout-page-shipping-address'>{`${userSelectedShippingAddress.state}, ${userSelectedShippingAddress.district}, ${userSelectedShippingAddress.town_city}, 
                ${userSelectedShippingAddress.street}, ${userSelectedShippingAddress.house_number}, ${userSelectedShippingAddress.pincode}`}
              </h3>
            </div>}

            {/* {Showing the most recently used user shipping address} */}
            {userShippingAddress && !userSelectedShippingAddress && <div className='checkout-page-shipping-address-wrapper'>
              <h3 className='checkout-page-shipping-secondary-header font-wt-400'>
                Most recently used address: 
              </h3>

              <h3 className='checkout-page-shipping-address'>{`${userShippingAddress.state}, ${userShippingAddress.district}, ${userShippingAddress.town_city}, 
                ${userShippingAddress.street}, ${userShippingAddress.house_number}, ${userShippingAddress.pincode}`}
              </h3>

              <button onClick={() => dispatch(updateUserShippingAddress(userShippingAddress))}>
                Deliver to this address
              </button>
            </div>}
            {/* {Showing the most recently used user shipping address} */}

            {/* {Showing the list of saved user addresses} */}
            {userShippingAddresses && userShippingAddresses.length > 0 && !userSelectedShippingAddress &&
            <div className='checkout-page-shipping-addresses-wrapper'>
              <h3 className='checkout-page-shipping-secondary-header font-wt-400'>
                {`${userShippingAddress ? 'Other shipping addresses: ' : 'Your shipping addresses: '}`} 
              </h3>
              {userShippingAddresses.map((shippingAddress, index) => {
                return (
                  <div key={index} className='checkout-page-shipping-address-wrapper'>
                    <h3 className='checkout-page-shipping-address'>{`${index + 1}. ${shippingAddress.state}, ${shippingAddress.district}, ${shippingAddress.town_city}, 
                      ${shippingAddress.street}, ${shippingAddress.house_number}, ${shippingAddress.pincode}`}
                    </h3>
                    <button onClick={() => dispatch(updateUserShippingAddress(userShippingAddresses[index], false))}>
                      Deliver to this address
                    </button>
                  </div>
                )
              })}
            </div>}
            {/* {Showing the list of saved user addresses} */}

            {/* {Form for adding new shipping address} */}
            {!userSelectedShippingAddress && 
            <>
            <h3 className='checkout-page-shipping-secondary-header font-wt-400'>Add a new address: </h3>
            <form>
              {checkoutFormState && checkoutFormInputs.map((formInput, index) => {
                return (
                  <React.Fragment key={index}>
                    <FormInput htmlFor={formInput.property} label={formInput.label} value={checkoutFormState[formInput.property] ? checkoutFormState[formInput.property] : ''}
                      property={formInput.property} type={formInput.type} setFormState={setCheckoutFormState} 
                      />
                  </React.Fragment>
                )
              })}

              <button onClick={(event) => {
                  event.preventDefault(); 
                  dispatch(updateUserShippingAddress(checkoutFormState, true))
                }}>
                Deliver to this address
              </button>
            </form>
            </>}
            {/* {Form for adding new shipping address} */}

          </div>

          <div className='checkout-page-payment-wrapper flex-column'>
              <h1 className='page-main-header'>Payment Info: </h1>
              <div>
                {cart.map((cartItem, index) => {
                  return (
                    <React.Fragment key={index}>
                      <div className='checkout-page-cart-item-wrapper flex' >
                        <span className='checkout-page-cart-item-sequence-number'>{index + 1}.</span>
                        <div className='checkout-page-cart-item-product flex'>
                          <p className='checkout-page-cart-item-product-name'>{cartItem.product.name}</p>

                          <div className='checkout-page-cart-item-price flex'>
                            <h4 className='checkout-page-cart-item-price-calculation'>{`${cartItem.qty} * ${cartItem.product.price} = $${cartItem.qty * cartItem.product.price}`}</h4>
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  )
                })}

                <div className='checkout-page-payment-wrapper-separator-line'></div>

                <div className='checkout-page-payment-total-wrapper flex'>
                  <h3 className='font-wt-500'>Total: </h3>
                  <h3>{`$${calcTotalPriceHandler(cart)}`}</h3>
                </div>
              </div>

              <button onClick={() => {
                  if(userSelectedShippingAddress) navigate('/payment');
                  else setSelectShippingAddressMessage('Please select a shipping address');
                }} className='checkout-btn rounded-dark-green-background-white-text-btn'>
                Proceed to checkout
              </button>
          </div>
        </div>}
      </ContentWrapper>
    </div>
  )
}

export default Checkout