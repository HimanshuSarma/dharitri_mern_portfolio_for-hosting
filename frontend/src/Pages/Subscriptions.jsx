import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { getCart } from '../redux/ActionCreators/cartActions';
import ContentWrapper from '../Components/UIElements/ContentWrapper';

import './Subscriptions.css';

const Subscriptions = () => {

  const [totalCartCost, setTotalCartCost] = useState(null);

  const {cart} = useSelector(store => store.cartState);
  const isLoggedIn = useSelector(store => store.isLoggedInState);

  const dispatch = useDispatch();

  useEffect(() => {
    if(isLoggedIn && !cart) {
      dispatch(getCart());
    } else if(isLoggedIn && cart) {
      let cost = 0;
      for(let i = 0; i < cart.length; i++) {
        cost += cart[i].qty * cart[i].product.price;
      }

      setTotalCartCost(cost.toFixed(2));
    }
  }, [cart, isLoggedIn, dispatch]);


  return (
    <div className='subscriptions-page-whole-screen-wrapper'>
        {isLoggedIn && totalCartCost && <ContentWrapper className='subscriptions-wrapper'>
            <h1 className='page-main-header'>Subscription plans</h1>
            <div className='subscription-plan-wrapper flex'>
                <div className='subscription-plan-text-wrapper'>
                  <h3 className='subscription-plan-pricing-caption'>Subscription plan for 1 month</h3>
                  <div className='subscription-plan-pricing-1-month'>
                      <p>{`Total cost: $${totalCartCost}`}</p>
                  </div>
                </div>

                <div className='subscription-plan-buy-wrapper'>
                  <NavLink to='/checkout'>Buy Now</NavLink>
                </div>
            </div>

            {/* <div className='subscription-plan-wrapper flex'>
                <div className='subscription-plan-text-wrapper'>
                  <h3 className='subscription-plan-pricing-caption'>Subscription plan for 2 month</h3>
                  <div className='subscription-plan-pricing-2-month'>
                      <p>{`Total cost: $${totalCartCost * 2}`}</p>
                  </div>
                </div>

                <div className='subscription-plan-buy-wrapper'>
                  <NavLink to='/checkout'>Buy Now</NavLink>
                </div>
            </div>

            <div className='subscription-plan-wrapper flex'>
                <div className='subscription-plan-text-wrapper'>
                  <h3 className='subscription-plan-pricing-caption'>Subscription plan for 3 month</h3>
                  <div className='subscription-plan-pricing-3-month'>
                      <p>{`Total cost: $${totalCartCost * 3}`}</p>
                  </div>
                </div>

                <div className='subscription-plan-buy-wrapper'>
                  <NavLink to='/checkout'>Buy Now</NavLink>
                </div>
            </div> */}
        </ContentWrapper>}

        {!isLoggedIn && 
          <ContentWrapper>
            <p>Please login to view your subscription plans</p>
          </ContentWrapper>}
    </div>
  )
}

export default Subscriptions