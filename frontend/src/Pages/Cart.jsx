import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import {getCart} from '../redux/ActionCreators/cartActions';
import {editCart} from '../redux/ActionCreators/cartActions';
import {deleteCartItem} from '../redux/ActionCreators/cartActions';
import Backdrop from '../Components/UIElements/Backdrop';
import LoadingSpinner from '../Components/UIElements/LoadingSpinner';
import BottomRightCard from '../Components/UIElements/BottomRightCard';
import SuccessMessageIcon from '../Components/UIElements/SuccessMessageIcon';

import './Cart.css';

const Cart = () => {

  const [cartMessage, setCartMessage] = useState(null);
  const [cartMessageTimerId, setCartMessageTimerId] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {cart, getCartState, isLoading} = useSelector(store => store.cartState);
  const isLoggedInState = useSelector(store => store.isLoggedInState);
  
  const computeTotalCartCost = () => {
    let cost = 0;
    for(let i = 0; i < cart.length; i++) {
      cost += cart[i].qty * cart[i].product.price;
    }

    return cost;
  }

  const setCartMessageHandler = (cartMessageArg) => {
    clearTimeout(cartMessageTimerId);
    setCartMessage(cartMessageArg);
    const timerId = setTimeout(() => {
      setCartMessage(null);
    }, 4000);
    setCartMessageTimerId(timerId);
  }

  const qtyChangeHandler = (productID, qty) => {
    if(productID && qty) {
      dispatch(editCart({productID, qty}, undefined, true, setCartMessageHandler, 'update-cart-item-qty'));
                        // Payload...   , // Navigate handler..., // getCartItemQty..., // setCartMessage... , // operation...
    }
  }

  const deleteProductFromCartHandler = (productID) => {
    if(productID) {
      dispatch(deleteCartItem(productID, setCartMessageHandler));
                        // Payload...   
    }
  }

  useEffect(() => {
    if(isLoggedInState && getCartState) {
      dispatch(getCart());
    }
  }, [dispatch, isLoggedInState, getCartState, navigate]);  
  
  return (
    <>
    {isLoading && <Backdrop><LoadingSpinner /></Backdrop>}
    {cartMessage && <BottomRightCard>
      <SuccessMessageIcon />
      <h3 className='success-message'>{cartMessage}</h3>
    </BottomRightCard>}
    <div className='cart-page-whole-screen-wrapper'>
      <div className='cart-wrapper flex-column'>
        <div className='cart-page-heading-wrapper'>
          <h1 className='page-main-header'>Cart</h1>
          {isLoggedInState && cart && cart.length > 0 && <h1 className='cart-page-price-header'>Price per unit</h1>}
        </div>
        {isLoggedInState && cart &&
            cart.map((el, index) => {
              return (
                <React.Fragment key={index}>
                  <div className='cart-item-wrapper'>
                    <img className='cart-item-image' src={el.product.image} alt="" />
                    <div className='cart-item-description-wrapper'>
                      <h3 className='cart-item-description-name'>{el.product.name}</h3>
                      <div className='cart-item-qty-wrapper'>
                      {el.product.countInStock > 0 && (
                        <div className='cart-item-edit-item-wrapper'>
                          <select value={el.qty} onChange={(event) => qtyChangeHandler(el.product._id, event.target.value)} name="Qty"
                            className='product-stock-dropdown'>
                                {[...Array(el.product.countInStock).keys()].map((x, index) => {
                                    return <option key={index} value={x+1} >{x+1}</option>
                                })}
                          </select>
                          <button onClick={() => deleteProductFromCartHandler(el.product._id)} className='cart-item-delete-btn'>Delete from cart</button>
                        </div>)}
                        <h3 className='cart-item-cost'>{`Total cost: ${el.qty} * $${el.product.price} = $${(el.qty * el.product.price).toFixed(2)}`}</h3>
                      </div>
                    </div>
                    <div className='cart-item-price-wrapper'>
                      <h3 className='cart-item-price'>{`$${el.product.price}`}</h3>
                    </div>
                  </div>
                </React.Fragment>
              )
            })
        }

        {isLoggedInState && cart && cart.length === 0 && <h2>
          Your cart is empty
        </h2>}

        {isLoggedInState && cart && cart.length > 0 && <div className='cart-total-price-wrapper'>
          <h3>{`Total cart cost: $${(computeTotalCartCost()).toFixed(2)}`}</h3>
        </div>}

        {isLoggedInState && cart && cart.length > 0 && <NavLink className='rounded-dark-green-background-white-text-btn align-self-flex-start' to='/subscriptions'>Proceed to view subscription plans</NavLink>}

        {!isLoggedInState && <p>Please <NavLink className='cart-page-login-btn' to='/login'>login</NavLink>  to view your cart</p> }
      </div>
    </div>
    </>
  )
}

export default Cart