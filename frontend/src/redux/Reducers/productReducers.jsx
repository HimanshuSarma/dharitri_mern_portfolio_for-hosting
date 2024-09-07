export const productListReducer = (currentProductListState = {products: null, productsPageNumber: null, productListStateLoading: false, productListDataReceived: false}, action) => {
    if(action.type === 'PRODUCT_LIST_STATE_LOADING') {
        return {...currentProductListState, productListStateLoading: true, productListDataReceived: false};
    } else if(action.type === 'PRODUCT_LIST_STATE_LOADED') {
        return {products: action.payload.products, productsPageNumber: action.payload.productsPageNumber, productListStateLoading: false, productListDataReceived: true};
    }

    return currentProductListState;
}

export const productReducer = (currentProductState = {product: null, productStateLoading: false, productDataReceived: false}, action) => {
    if(action.type === 'PRODUCT_STATE_LOADING') {
        return {product: null, productStateLoading: true, productDataReceived: false};
    } else if(action.type === 'PRODUCT_STATE_LOADED') {
        return {product: action.payload, productStateLoading: false, productDataReceived: true};
    } else if(action.type === 'PRODUCT_STATE_LOADING_FAILED') {
        return {product: null, productStateLoading: false, productDataReceived: false};
    }

    return currentProductState;
}

export const productsCountInDBReducer = (productsCountInDB = null, action) => {
    if(action.type === 'PRODUCTS_COUNT_IN_DB_LOADED') {
        return action.payload;
    }

    return productsCountInDB;
}

