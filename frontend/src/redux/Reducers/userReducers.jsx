export const userReducer = (currentUserState = {userDetails: null, isLoading: false, userDataReceived: false}, action) => {
    if(action.type === 'USER_STATE_LOADING') { // Signup action...
        return {userDetails: null, isLoading: true, userDataReceived: false};
    } else if(action.type === 'USER_STATE_LOADED') { // Signup action...
        return {userDetails: action.payload, isLoading: false, userDataReceived: true};
    } else if (action.type === 'USER_STATE_LOAD_FAILED') {
        return {...currentUserState, isLoading: false};
    } else if(action.type === 'AUTHENTICATED') { // Login action...
        // Clear out the details of the user that signed up...
        return {userDetails: null, isLoading: false, userDataReceived: false};
    } else if(action.type === 'USER_STATE_DELETE') {
        // Clear out the details of the user that logged in previously...
        return {userDetails: null, isLoading: false, userDataReceived: false}
    }
 
    return currentUserState;
}

export const userShippingAddressesReducer = (currentUserShippingAddressesState = {userShippingAddresses: null, isLoading: false, userShippingAddressesDataReceived: false}, action) => {
    if(action.type === 'USER_SHIPPING_ADDRESSES_STATE_LOADING') {
        return {...currentUserShippingAddressesState, isLoading: true, userShippingAddressesDataReceived: false};
    } else if(action.type === 'USER_SHIPPING_ADDRESSES_STATE_LOADED') {
        return {userShippingAddresses: action.payload, isLoading: false, userShippingAddressesDataReceived: true};
    } else if(action.type === 'USER_SHIPPING_ADDRESSES_STATE_LOAD_FAILED') {
        return {...currentUserShippingAddressesState, isLoading: false, userShippingAddressesDataReceived: false};
    } else if(action.type === 'USER_SHIPPING_ADDRESSES_STATE_DELETE') {
        return {userShippingAddresses: null, isLoading: false, userShippingAddressesDataReceived: false};
    }

    return currentUserShippingAddressesState;
}

export const userShippingAddressReducer = (currentUserShippingAddressState = {userShippingAddress: null, isLoading: false,
    userShippingAddressDataReceived: false}, action) => {
    if(action.type === 'USER_SHIPPING_ADDRESS_STATE_LOADING') {

        return {...currentUserShippingAddressState, isLoading: true, userShippingAddressDataReceived: false};
    } else if(action.type === 'USER_SHIPPING_ADDRESS_STATE_LOADED') {

        return {userShippingAddress: action.payload, isLoading: false, userShippingAddressDataReceived: true};
    }

    return currentUserShippingAddressState;
}

export const userSelectedShippingAddressReducer = (currentUserSelectedShippingAddressState = {
        userSelectedShippingAddress: null, isLoading: false, userSelectedShippingAddressDataReceived: false
    }, action) => {
    
    if(action.type === 'ADD_USER_SHIPPING_ADDRESS_STATE_LOADING' || 
        action.type === 'USER_SELECTED_SHIPPING_ADDRESS_STATE_LOADING') {
        return {...currentUserSelectedShippingAddressState, isLoading: true, 
                userSelectedShippingAddressDataReceived: false};
    } else if (action.type === 'ADD_USER_SHIPPING_ADDRESS_STATE_LOADED' || 
        action.type === 'USER_SELECTED_SHIPPING_ADDRESS_STATE_LOADED') {
        return {userSelectedShippingAddress: action.payload, isLoading: false,
                userSelectedShippingAddressDataReceived: true
        };
    }

    return currentUserSelectedShippingAddressState;
}

export const userLoginReducer = (currentIsLoggedInState = false, action) => {
    if(action.type === 'AUTHENTICATING' || action.type === 'NOT_AUTHENTICATED' || action.type === 'AUTHENTICATION_FAILED') {
        return false;
    } else if(action.type === 'AUTHENTICATED' || action.type === 'NOT_AUTHENTICATION_LOADING' || action.type === 'NOT_AUTHENTICATION_FAILED') {
        return true;
    } 
    
    return currentIsLoggedInState;
}

export const autoLogoutTimerIDReducer = (currentTimerIDState = null, action) => {
    if(action.type === 'NEW_TIMER_ID') {
        return action.payload;
    }

    return currentTimerIDState;
}

export const updateUserProductsPageReducer = (currentDefaultProductsPage = null, action) => {
    if(action.type === 'UPDATE_USER_DEFAULT_PRODUCTS_PAGE') {
        return action.payload;
    }

    return currentDefaultProductsPage;
}