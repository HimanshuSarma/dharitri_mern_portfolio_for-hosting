export const cartReducer = (currentCartState = {cart: null, 
    getCartState: true, isLoading: false, cartDataReceived: false}, action) => {
    if(action.type === 'CART_STATE_LOADING') {
        return {...currentCartState, isLoading: true, cartDataReceived: false};
    } else if(action.type === 'CART_STATE_LOADED') {
        return {cart: action.payload, getCartState: false, isLoading: false, cartDataReceived: true};
    } else if(action.type === 'CART_STATE_LOAD_FAILED') {
        return {...currentCartState, getCartState: true, isLoading: false, cartDataReceived: false};
    } else if(action.type === 'GET_CART_STATE') {
        return {...currentCartState, getCartState: true, isLoading: false, cartDataReceived: true};
    } else if(action.type === 'CART_ITEM_LOADING' || action.type === 'DELETE_CART_ITEM_LOADING') {
        return {...currentCartState, isLoading: true, cartDataReceived: false};
    } else if(action.type === 'CART_ITEM_LOADED') {
        return {cart: currentCartState.cart.map(cartItem => {
            if(cartItem._id === action.payload._id) {
                return {
                    ...cartItem,
                    qty: action.payload.qty
                }
            } else return {...cartItem};
        }), getCartState: false, isLoading: false, cartDataReceived: true};
    } else if(action.type === 'CART_ITEM_LOAD_FAILED' || action.type === 'DELETE_CART_ITEM_FAILED') {
        return {...currentCartState, isLoading: false, cartDataReceived: false};
    } else if(action.type === 'CART_STATE_DELETE_LOADING') {
        return {...currentCartState, isLoading: true, cartDataReceived: false};
    } else if(action.type === 'CART_STATE_DELETE') {
        return {...currentCartState, getCartState: true, cart: [], isLoading: false, cartDataReceived: true};
    }

    return currentCartState;
}