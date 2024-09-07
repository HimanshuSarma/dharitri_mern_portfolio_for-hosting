import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {getCurrentPageProducts} from '../redux/ActionCreators/productActions';
import {updateUserProductsPage} from '../redux/ActionCreators/userActions';
import ContentWrapper from '../Components/UIElements/ContentWrapper';
import Backdrop from '../Components/UIElements/Backdrop';
import LoadingSpinner from '../Components/UIElements/LoadingSpinner';

import './Products.css';

const Products = () => {

    const [pageSize, setPageSize] = useState(6);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {products, isLoading} = useSelector(store => store.productListState);
    const {productsPageNumber, productListStateLoading} = useSelector(store => store.productListState);
    
    const productsCountInDB = useSelector(store => store.productsCountInDB);
    const userProductsPage = useSelector(store => store.userProductsPage); // The default user products page that loads on
                                                                                 // when the App loads...  
    
    const totalPages = Math.ceil(productsCountInDB / pageSize);

    const currentProductsPageQueryParam = parseInt(useLocation().search.split('=')[1]);

    const productPageRedirection = (productID) => {
        navigate(`/product/${productID}`);
    }

    const updateProductsPageHandler = (pageNumber) => {
        navigate(`/products?page=${pageNumber}`);
    }

    const incrementDecrementProductsPageHandler = (type) => {
        if(type === 'inc') {
            if(userProductsPage < totalPages) {
                navigate(`/products?page=${userProductsPage+1}`);
            }
        } else if(type === 'dec') {
            if(userProductsPage > 1) {
                navigate(`/products?page=${userProductsPage-1}`);
            }
        }
    }

    useEffect(() => {
        if(currentProductsPageQueryParam && userProductsPage && userProductsPage !== currentProductsPageQueryParam) {
            dispatch(updateUserProductsPage(currentProductsPageQueryParam));
        } else if(!currentProductsPageQueryParam) {
            navigate('/products?page=1'); // If the products page query param is null or undefined or some
                                          // invalid value, then redirect to page 1 of the products page.
        }
    }, [currentProductsPageQueryParam, dispatch, navigate]);

    useEffect(() => {
        if((userProductsPage && (userProductsPage >= 1 && userProductsPage <= Math.ceil(productsCountInDB / pageSize))) || 
            !productsCountInDB) {
            if(((productsPageNumber && productsPageNumber !== userProductsPage) || !productsPageNumber) && 
                !productListStateLoading) {
                dispatch(getCurrentPageProducts(userProductsPage, pageSize, productsCountInDB));
            }
        }
    }, [dispatch, userProductsPage, pageSize, productsCountInDB]);

    return (
        <>
        {productListStateLoading && <Backdrop><LoadingSpinner /></Backdrop>}
        <div className='products-page-whole-screen-wrapper flex-column align-items-center'>
            <ContentWrapper className='products-grid' isProductsPage={true}>
                {products && products.map((product, index) => {
                    return (
                        <React.Fragment key={index}>
                          <div onClick={() => productPageRedirection(product._id)} className='products-page-product-wrapper flex-column'>
                            <img className='products-page-product-image' src={product.image} alt="" />
                            <p className='products-page-product-category roboto-font'>{product.category}</p>
                            <h2 className='products-page-product-name font-wt-400'>{product.name}</h2>
                            <div className='products-page-product-rating-wrapper flex-align-items-center'>
                                <span className='product-rating-value'>{product.rating}</span>
                                <i className="product-rating-icon fa-solid fa-star"></i>
                            </div>
                            <p className='font-wt-700'>{`$${product.price}`}</p>
                          </div>
                        </React.Fragment>
                    )
                })}
            </ContentWrapper>

            {totalPages >= 1 && <ContentWrapper>
                <div className='flex'>
                    <button onClick={() => incrementDecrementProductsPageHandler('dec')} 
                        className='products-page-btn margin-right'>
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>
                    {[...Array(totalPages).keys()].map((el, idx) => {
                        return (
                            <button onClick={(event) => updateProductsPageHandler(el+1)} 
                                className={`products-page-btn roboto-font font-wt-400 margin-right ${(userProductsPage === el + 1) ? 'dark-green-hex-background-white-text-transition': ''}`} key={idx}>
                                {el+1}
                            </button>
                        )
                    })}
                    <button onClick={() => incrementDecrementProductsPageHandler('inc')} 
                        className='products-page-btn'><i className="fa-solid fa-chevron-right">
                        </i>
                    </button>
                </div>
            </ContentWrapper>}
        </div>
        </>
    )
}

export default Products
