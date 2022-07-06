import React, {useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {editCart} from '../redux/ActionCreators/cartActions';
// import {getUser} from '../redux/ActionCreators/cartActions'

import ContentWrapper from '../Components/UIElements/ContentWrapper';
import Backdrop from '../Components/UIElements/Backdrop';
import LoadingSpinner from '../Components/UIElements/LoadingSpinner';
import BottomRightCard from '../Components/UIElements/BottomRightCard';
import SuccessMessageIcon from '../Components/UIElements/SuccessMessageIcon';

import {getProduct} from '../redux/ActionCreators/productActions';

import './ProductScreen.css';

const ProductScreen = () => {

  const [productScreenMessage, setProductScreenMessage] = useState(null);
  const [qtyState, setQtyState] = useState(1);

  const productID = useParams().productID;
  const dispatch = useDispatch();

  const {isLoading} = useSelector(store => store.cartState);
  const {product, productStateLoading} = useSelector(store => store.productState);
  const _id = product ? product._id : null;
  // const isLoggedInState = useSelector(store => store.isLoggedInState);

  const navigate = useNavigate();

  const addProductToCartHandler = (event, productID) => {
    event.preventDefault();
    dispatch(editCart({productID, qty: qtyState}, navigateHandler, undefined, productScreenMessageHandler, 'add-product'));
  }

  const navigateHandler = (navigateTo) => {
    navigate(navigateTo);
  }

  const productScreenMessageHandler = (productScreenMessage) => {
    setProductScreenMessage(productScreenMessage);
  }

  useEffect(() => {
    if(!_id || (_id && _id !== productID)) {
      dispatch(getProduct(productID));
    }
  }, [dispatch, productID, _id]);

  return (
    <>
    {(isLoading || productStateLoading) && <Backdrop><LoadingSpinner /></Backdrop>}
    {productScreenMessage && <BottomRightCard>
      <SuccessMessageIcon />
      <h3 className='success-message'>{productScreenMessage}</h3>
    </BottomRightCard> }
    <div className='product-page-whole-screen-wrapper'>
      <ContentWrapper className='product-page-wrapper'>      
        <div className='product-page-product-wrapper'>
            {product && (
                <>
                  <div className='flex product-page-product-details-wrapper'>
                    <div className='product-page-product-image-wrapper'>
                      <img className='product-page-product-image' src={product.image} alt="" />
                    </div>
                    <div>
                      <h2 className='product-page-product-name'>{product.name}</h2>
                      <h3 className='product-page-product-price'>{`Price: $${product.price}`}</h3>
                      <h3 className='product-page-product-stock'>{`Status: ${product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}`}</h3>
                      {product.countInStock > 0 && <form>
                        <select value={qtyState} onChange={(event) => {setQtyState(parseInt(event.target.value))}} name="Qty"
                        className='product-stock-dropdown product-page-product-dropdown-btn'>
                            {[...Array(product.countInStock).keys()].map((x, index) => {
                                return <option key={index} value={x+1} >{x+1}</option>
                            })}
                        </select>
                        
                        <button className='rounded-dark-green-background-white-text-btn roboto-font product-page-add-to-cart-btn' 
                              onClick={(event) => {addProductToCartHandler(event, product._id)}}>
                            Add to Cart
                        </button>
                      </form>}
                    </div>
                  </div>
                  
                  <div>
                    <p className='product-page-product-desc'>{product.description}</p>
                  </div>
                  
                </>
            )}
        </div>
      </ContentWrapper>
    </div>
    </>
  )
}

export default ProductScreen;