import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import {productListReducer, productReducer, productsCountInDBReducer} from './Reducers/productReducers';

import {userReducer,
    userLoginReducer, updateUserProductsPageReducer, userSelectedShippingAddressReducer,
    userShippingAddressesReducer, userShippingAddressReducer,autoLogoutTimerIDReducer,
    userOrderDetailsReducer
} from './Reducers/userReducers';

import {cartReducer} from './Reducers/cartReducers';

const reducer = combineReducers({
    userState: userReducer,
    userShippingAddressesState: userShippingAddressesReducer,
    userShippingAddressState: userShippingAddressReducer,
    userSelectedShippingAddressState: userSelectedShippingAddressReducer,
    userOrderDetails: userOrderDetailsReducer,
    // userOrdersState: userOrdersReducer,
    isLoggedInState: userLoginReducer,
    autoLogoutTimerIDState: autoLogoutTimerIDReducer,
    productListState: productListReducer,
    productState: productReducer,
    userProductsPage: updateUserProductsPageReducer,
    productsCountInDB: productsCountInDBReducer,
    cartState: cartReducer
});

const initialState = {};

const middleware = [thunk];

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)));

export default store;