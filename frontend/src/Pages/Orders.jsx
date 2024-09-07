import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

import ContentWrapper from '../Components/UIElements/ContentWrapper';
import Backdrop from '../Components/UIElements/Backdrop';
import LoadingSpinner from '../Components/UIElements/LoadingSpinner';

import {getUserOrders} from '../redux/ActionCreators/userActions';

import './Orders.css';

const Orders = () => {

  const [userOrders, setUserOrders] = useState(null);
  const [isUserOrdersLoading, setIsUserOrdersLoading] = useState(false);

  const dispatch = useDispatch();

  const computeTotalOrderCostHandler = (index) => {
    let cost = 0;
    for(let i = 0; i < userOrders[index].orderItems.length; i++) {
      cost += userOrders[index].orderItems[i].qty * userOrders[index].orderItems[i].product.price;
    }

    return cost;
  }

  useEffect(() => {
    setIsUserOrdersLoading(true);
    dispatch(getUserOrders(setUserOrders, setIsUserOrdersLoading));
  }, []);
  return (
    <div className='orders-page-whole-screen-wrapper'>
      {isUserOrdersLoading && 
      <Backdrop>
        <LoadingSpinner></LoadingSpinner>
      </Backdrop>}
      {userOrders && userOrders.length > 0 && 
      <ContentWrapper>
        <h1 className='page-main-header'>
          Your orders: 
        </h1>

        <div className='orders-page-main-content-wrapper flex-column'>
          {userOrders.map((userOrder, ordersIndex) => {
            return (
            <div className='orders-page-order-wrapper flex-column' key={ordersIndex}>
              {/* {All orders we get from the /get-orders route are paid orders} */}
              {userOrder.orderItems.map((orderItem, orderItemIndex) => {
                return (
                  <div className='orders-page-order-item-wrapper flex' key={orderItemIndex}>
                    <img className='orders-page-order-item-product-image' src={orderItem.product.image} alt="" />
                    <div className='orders-page-order-item-product-description'>
                      <h3 className='orders-page-order-item-product-name'>
                        {orderItem.product.name}
                      </h3>

                      <div className='orders-page-order-item-description-btns-wrapper flex-column'>
                        <NavLink to='/delivery-status'>Check delivery status</NavLink>
                      </div>

                      <div className='orders-page-order-item-description-price flex'>
                        <h3>{`${orderItem.qty} * $${orderItem.product.price} = $${orderItem.qty * orderItem.product.price}`}</h3>
                      </div>
                    </div>
                  </div>)
              })}

              <div className='orders-page-order-price-separator'></div>

              <div className='orders-page-order-total-price-wrapper flex'>
                <h3 className='orders-page-order-total-price'>Total price: {`$${computeTotalOrderCostHandler(ordersIndex)}`}</h3>
              </div>
            </div>)
          })}
        </div>
      </ContentWrapper>}
    </div>
  )
}

export default Orders