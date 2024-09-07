import {base_url} from '../../Data/config';

export const editCart = (payload, navigateHandler, getCartItemQty, setMessageHandler, operation) => {
    return async (dispatch, getState) => {
        // Update state to display cart update loading message...
        dispatch({
            type: 'CART_STATE_LOADING'
        });

        console.log('editCartRequest2');

        try {
             
            const editCartRequest = await fetch(`${base_url}/cart/patch-cart`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({product: payload, operation})
            })

            console.log('editCartRequest1', editCartRequest);

            const editCartRequestDataReceived = await editCartRequest.json();

            if(editCartRequest.ok) {
                // Update state to display cart updated message...
                if(getCartItemQty) // getCartItemQty is when qty of a cart item changes...
                    dispatch(getCartQty(payload.productID));
                else {
                    dispatch({
                        type: 'GET_CART_STATE'
                    })
                }

                setMessageHandler(editCartRequestDataReceived.message);
            } else {
                if(editCartRequest.status === 401) { 
                    // User is NOT_AUTHENTICATED (Either user is not logged in or the user token is invalid)...
                    // Dispatch an NOT_AUTHENTICATED action to set the isLoggedInState to false...
                    dispatch({
                        type: 'NOT_AUTHENTICATED'
                    });

                    dispatch({
                        type: 'USER_STATE_DELETE' // Clear the user data since user is not authenticated...
                    });

                    dispatch({
                        type: 'CART_STATE_DELETE' // Empty the cart state since the user is not authenticated...
                    });

                    if(navigateHandler) { // If the cart action is invoked from Cart.jsx, then navigate handler 
                                          // will be undefined...

                        // Redirect user to login page...
                        navigateHandler('/login');
                    }
                } else if(editCartRequest.status === 401) {
                    // Update state to display user does not exist message...
                    dispatch({type: 'USER_STATE_DELETE'});
                    dispatch({type: 'USER_SHIPPING_ADDRESSES_STATE_DELETE'});
                    dispatch({type: 'NOT_AUTHENTICATED'});
                    dispatch({type: 'CART_STATE_DELETE'});
                } else if(editCartRequest.status === 500) {
                    // Update state to display some error occured message and ask the user to try again...
                }
            }
        } catch(err) {
            console.log(err);
        }
    }
}

export const getCart = (setMessageHandlerOptionalArg, messageOptional) => {
    return async (dispatch, getState) => {
        console.log('action')
        dispatch({
            type: 'CART_STATE_LOADING'
        })

        try {

            const getCartReq = await fetch(`${base_url}/cart/get-cart`, {
                method: 'GET',
                credentials: 'include'
            })

            const dataReceived = await getCartReq.json();
            
            if(getCartReq.ok) {
                dispatch({
                    type: 'CART_STATE_LOADED',
                    payload: dataReceived.cart
                })
               
                if(setMessageHandlerOptionalArg) setMessageHandlerOptionalArg(messageOptional);
                
            } else {
                if(getCartReq.status === 401 || getCartReq.status === 404) { // The user is not authenticated...
                                                                             // or the user doesn't exist...

                    // 401 because authetication failed and 404 for authenticated user doesn't exist in the database...

                    dispatch({
                        type: 'USER_STATE_DELETE' // Clear the user data since user is not authenticated...
                    });

                    dispatch({
                        type: 'CART_STATE_DELETE' // Empty the cart state since the user is not authenticated...
                    });

                    dispatch({
                        type: 'NOT_AUTHENTICATED' // Set is isLoggedIn redux state to false and make the user state
                                                  // NOT AUTHENTICATED...
                    })
                } else if(getCartReq.status === 500) { // Some other error...
                    dispatch({
                        type: 'CART_STATE_LOAD_FAILED'
                    })
                }  
            } 
            
        } catch (err) {
            console.log(err);
        }
    }
}

export const getCartQty = (productID) => {
    return async (dispatch, getState) => {
        dispatch({
            type: 'CART_ITEM_LOADING'
        })

        try {
            const getCartProductReq = await fetch(`${base_url}/cart/get-cart-item/${productID}`, {
                method: 'GET',
                credentials: 'include'
            })

            const cartProduct = await getCartProductReq.json();

            if(getCartProductReq.ok) {
                // Dispatch action to update the cart
                dispatch({
                    type: 'CART_ITEM_LOADED',
                    payload: cartProduct
                });
            } else {
                // Dispatch action to cart loading failed...
                // 401 error for authentication failed...
                // 404 error for cart item not found...

                if(getCartProductReq.status === 401) {
                    dispatch({
                        type: 'NOT_AUTHENTICATED' // Set is isLoggedIn redux state to false and make the user state
                                                  // NOT AUTHENTICATED...
                    }); 
                    dispatch({
                        type: 'USER_STATE_DELETE' // Clear the user data since user is not authenticated...
                    });

                    dispatch({
                        type: 'CART_STATE_DELETE' // Empty the cart state since the user is not authenticated...
                    });
                }

                dispatch({
                    type: 'CART_ITEM_LOAD_FAILED'
                });
            }
        } catch (err) {
            console.log(err);
        }
    }
}

export const deleteCartItem = (productID, setMessageHandler) => {
    return async (dispatch, getState) => {
        dispatch({
            type: 'DELETE_CART_ITEM_LOADING'
        });

        try {
            const deleteCartItemReq = await fetch(`${base_url}/cart/delete-cart-item/${productID}`, {
                method: 'DELETE',
                credentials: 'include'
            })

            const deleteCartItemReqData = await deleteCartItemReq.json();

            if(deleteCartItemReq.ok) {
                // Passing the optional message handler...
                dispatch(getCart(setMessageHandler, deleteCartItemReqData.message));
            } else {
                // 401 error for authentication failed...
                // 404 error for cart item not found...
                // 500 error for some other error...

                if(deleteCartItemReq.status === 401) {
                    dispatch({
                        type: 'CART_STATE_DELETE' // Delete the cart state when user is not authenticated...
                    });

                    dispatch({
                        type: 'NOT_AUTHENTICATED' // Set is isLoggedIn redux state to false and make the user state
                                                 // NOT AUTHENTICATED...
                    });

                    dispatch({
                        type: 'USER_STATE_DELETE' // Clear the user data since user is not authenticated...
                    })
                } else if(deleteCartItemReq.status === 404 || deleteCartItemReq.status === 500) {
                    dispatch({
                        type: 'DELETE_CART_ITEM_FAILED'
                    })
                }
            }
        } catch (err) {
            console.log(err);
        }
    }
}


export const deleteCart = () => {
    return async (dispatch, getState) => {
        dispatch({
            type: 'CART_STATE_DELETE_LOADING'
        });

        try {
            const deleteCartReq = await fetch(`${base_url}/cart/delete-cart`, {
                method: 'DELETE',
                credentials: 'include'
            })

            const deleteCartReqData = await deleteCartReq.json();

            if(deleteCartReqData.ok) {
                // Passing the optional message handler...
                dispatch({
                    type: 'CART_STATE_DELETE'
                });
            } else {
                // 401 error for authentication failed...
                // 404 error for cart item not found...
                // 500 error for some other error...

                if(deleteCartReqData.status === 401) {
                    dispatch({
                        type: 'CART_STATE_DELETE' // Delete the cart state when user is not authenticated...
                    });

                    dispatch({
                        type: 'NOT_AUTHENTICATED' // Set is isLoggedIn redux state to false and make the user state
                                                 // NOT AUTHENTICATED...
                    });

                    dispatch({
                        type: 'USER_STATE_DELETE' // Clear the user data since user is not authenticated...
                    })
                } else if(deleteCartReqData.status === 404 || deleteCartReqData.status === 500) {
                    dispatch({
                        type: 'DELETE_CART_ITEM_FAILED'
                    })
                }
            }
        } catch (err) {
            console.log(err);
        }
    }
}


