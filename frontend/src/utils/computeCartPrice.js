const calcTotalPriceHandler = (cart) => {
    let price = 0;
  
    console.log(cart, 'cart');
    for(let i = 0; i < cart.length; i++) {
      price += (cart[i].qty * cart[i].product.price);
    }

    return price;
}

export { calcTotalPriceHandler };