import {base_url} from '../../Data/config';

export const getCurrentPageProducts = (currentProductsPage, pageSize, productsCountInDB) => {
    return async (dispatch, getState) => {
        dispatch({
            type: 'PRODUCT_LIST_STATE_LOADING'
        })

        try {

            const request = await fetch(`${base_url}/products/get-products?page=${currentProductsPage}&pageSize=${pageSize}&sendTotalProductsCount=${productsCountInDB}`);
            const products = await request.json();

            if(request.ok) {
                // Update productsCountInDB State in Products if server sends productsCountInDB value...
                if(products.productsCountInDB) {
                    dispatch({
                        type: 'PRODUCTS_COUNT_IN_DB_LOADED',
                        payload: products.productsCountInDB
                    })
                }

                // Dispatch action to update product list...
                dispatch({
                    type: 'PRODUCT_LIST_STATE_LOADED',
                    payload: products
                })
            }
            
        } catch (err) {
            console.log(err);
        }
    
    }
}


export const getProduct = (productID) => {
    return  async (dispatch, getState) => {
        dispatch({
            type: 'PRODUCT_STATE_LOADING'
        });

        try {
            const getProductRequest = await fetch(`${base_url}/products/${productID}`);

            const product = await getProductRequest.json();

            if(getProductRequest.ok) {
                dispatch({
                    type: 'PRODUCT_STATE_LOADED', 
                    payload: product
                })
            } else {
                dispatch({
                    type: 'PRODUCT_STATE_LOADING_FAILED'
                })
            } 
        } catch (err) {
            console.log(err);
        }
    }
}

