import {base_url} from '../../Data/config';

export const createUserAction = (formState, changeUserDetailsValidity, changeWillNavigate) => {
    return async (dispatch, getState) => {
        try {

            dispatch({
                type: 'USER_STATE_LOADING'
            })

            const createUserReq = await fetch(`${base_url}/user/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(formState)
            })

            const userDetails = await createUserReq.json();

            if(createUserReq.ok) {
                dispatch({
                    type: 'USER_STATE_LOADED',
                    payload: userDetails
                });

                changeUserDetailsValidity(true);
                changeWillNavigate(true);
            } else {
                changeUserDetailsValidity(false);
                changeWillNavigate(false);
            }
        } catch(err) {
            console.log(err);
        }
    }
}


export const loginUserAction = (loginCredentials, setIsLoggedIn) => {
    return async (dispatch, getState) => {

        dispatch({type: 'AUTHENTICATING'});
        dispatch({type: 'USER_STATE_LOADING'});

        try {
            const loginUserRequest = await fetch(`${base_url}/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(loginCredentials)
            })

            const loginUserRequestDataReceived = await loginUserRequest.json();

            if(loginUserRequest.ok) {
                dispatch({
                    type: 'CART_STATE_DELETE' // To empty the cart state when user logs in...
                });

                dispatch({
                    type: 'AUTHENTICATED' // To update the user details when user logs in...
                });

                dispatch({type: 'USER_STATE_DELETE'});

                dispatch({type: 'GET_CART_STATE'});

                dispatch({type: 'USER_SHIPPING_ADDRESSES_STATE_DELETE'});

                dispatch({type: 'USER_SELECTED_SHIPPING_ADDRESS_STATE_DELETE'})
                    
                setIsLoggedIn(true);

                clearTimeout(getState().autoLogoutTimerIDState);
                const timerID = setTimeout(() => {
                    /* Dispatching auto logout actions when token expires */

                    dispatch({type: 'NOT_AUTHENTICATED'});
                    dispatch({type: 'USER_STATE_DELETE'});
                    dispatch({type: 'CART_STATE_DELETE'});

                    /* Dispatching auto logout actions when token expires */
                }, loginUserRequestDataReceived.expiresIn);

                dispatch({
                    type: 'NEW_TIMER_ID',
                    payload: timerID
                })
            } else {
                if(loginUserRequest.status === 401) {
                    dispatch({type: 'NOT_AUTHENTICATED'});
                    dispatch({type: 'USER_STATE_LOAD_FAILED'})
                }
            }
        } catch (err) {
            console.log(err);
        }
    }
}

export const userLogout = (setIsLogoutLoading) => {
    return async (dispatch, getState) => {
        dispatch({type: 'NOT_AUTHENTICATION_LOADING'});
        setIsLogoutLoading(true)

        try {
            const userLogoutReq = await fetch(`${base_url}/user/logout`, {
                credentials: 'include'
            })

            if(userLogoutReq.ok) {
                dispatch({
                    type: 'NOT_AUTHENTICATED' // To update the user state and clear user data...
                });

                dispatch({type: 'USER_STATE_DELETE'});

                dispatch({
                    type: 'CART_STATE_DELETE' // To update the cart state and empty the cart state...
                });

                dispatch({type: 'USER_SHIPPING_ADDRESSES_STATE_DELETE'});

                dispatch({type: 'USER_SELECTED_SHIPPING_ADDRESS_STATE_DELETE'})

                setIsLogoutLoading(false);

                clearTimeout(getState().autoLogoutTimerIDState);
            } else {
                dispatch({type: 'NOT_AUTHENTICATION_FAILED' })
            }
        } catch (err) {
            console.log(err);
        }
    }
}

export const checkUserLogin = () => {
    return async (dispatch, getState) => {
        try {

            const checkUserLoginReq = await fetch(`${base_url}/user/check-login`, {
                credentials: 'include',
            })

            const checkUserLoginData = await checkUserLoginReq.json();

            if(checkUserLoginReq.ok) {
                dispatch({type: 'AUTHENTICATED'});

                // Dispatching GET_CART_STATE not reqd bcoz getCartState will be set to true of App load...
            } else {
                dispatch({type: 'NOT_AUTHENTICATED'});
                dispatch({type: 'USER_STATE_DELETE'});
                // Clearing cart state is not reqd bcoz cart will be empty on App load...
            }
        } catch (err) {
            console.log(err);
        }
    }
}


export const getUserShippingAddresses = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({type: 'USER_SHIPPING_ADDRESSES_STATE_LOADING'});

            const getUserAddressesReq = await fetch(`${base_url}/user/user-addresses`, {
                method: 'GET',
                credentials: 'include'
            });

            const getUserAddressesData = await getUserAddressesReq.json();

            if(getUserAddressesReq.ok) {
                dispatch({
                    type: 'USER_SHIPPING_ADDRESSES_STATE_LOADED',
                    payload: getUserAddressesData
                })
            }
        } catch (err) {
            console.log(err);
        }
    }
}

export const getUserShippingAddress = () => {
    return async(dispatch, getState) => {
        try {
            dispatch({type: 'USER_SHIPPING_ADDRESS_STATE_LOADING'});

            const getUserShippingAddressReq = await fetch(`${base_url}/user/user-address`, {
                method: 'GET',
                credentials: 'include'
            });

            const getUserShippingAddressReqData = await getUserShippingAddressReq.json();

            if(getUserShippingAddressReq.ok) {
                dispatch({
                    type: 'USER_SHIPPING_ADDRESS_STATE_LOADED',
                    payload: getUserShippingAddressReqData.payload
                });
            }
        } catch (err) {
            console.log(err);
        }
    }
}

export const updateUserShippingAddress = (payload, newAddress) => {
    return async(dispatch, getState) => {
        try {
            dispatch({type: 'ADD_USER_SHIPPING_ADDRESS_STATE_LOADING'});

            const addUserAddressReq = await fetch(`${base_url}/user/update-user-address`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({payload, newAddress: newAddress ? true : false}),
                credentials: 'include'
            });

            const addUserAddressReqData = await addUserAddressReq.json();

            if(addUserAddressReq.ok) {
                dispatch({
                    type: 'ADD_USER_SHIPPING_ADDRESS_STATE_LOADED', 
                    payload: addUserAddressReqData.payload
                });
            }

        } catch (err) {
            console.log(err);
        }
    }
}

export const getUserSelectedShippingAddress = () => {
    return async (dispatch, getState) => {
        dispatch({type: 'USER_SELECTED_SHIPPING_ADDRESS_STATE_LOADING'});

        try {
            const getUserSelectedShippingAddressReq = await fetch(`${base_url}/user/get-user-selected-cart`, {
                method: 'GET',
                credentials: 'include'
            });

            const getUserSelectedShippingAddressReqData = await getUserSelectedShippingAddressReq.json();

            if(getUserSelectedShippingAddressReq.ok) {
                dispatch({
                    type: 'USER_SELECTED_SHIPPING_ADDRESS_STATE_LOADED',
                    payload: getUserSelectedShippingAddressReqData.payload
                })
            } else {
                if(getUserSelectedShippingAddressReq.status === 401) {
                    
                }
            }

        } catch(err) {
            console.log(err);
        }
    }
}

export const updateUserProductsPage = (userProductsPage) => {
    return async(dispatch, getState) => {
        dispatch({
            type: 'UPDATE_USER_DEFAULT_PRODUCTS_PAGE',
            payload: userProductsPage
        })
    }
}