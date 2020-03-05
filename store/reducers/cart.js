import { ADD_TO_CART, REMOVE_FROM_CART } from "../actions/cart";
import CartItem from "../../models/cart-item";

const initialState = {
  items: {},
  totalAmount: 0,
  count: 0
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const addedProduct = action.product;
      const prodPrice = addedProduct.price;
      const prodTitle = addedProduct.title;

      let updatedOrNewCartItem;

      if (state.items[addedProduct.id]) {
        // already exists in the cart
        const prodQuantity = state.items[addedProduct.id].quantity + 1;

        updatedOrNewCartItem = new CartItem(
          prodQuantity,
          prodPrice,
          prodTitle,
          state.items[addedProduct.id].sum + prodPrice
        );
      } else {
        updatedOrNewCartItem = new CartItem(1, prodPrice, prodTitle, prodPrice);
      }
      return {
        ...state,
        items: { ...state.items, [addedProduct.id]: updatedOrNewCartItem },
        totalAmount: state.totalAmount + prodPrice,
        count: state.count + 1
      };

    case REMOVE_FROM_CART:
      const productId = action.productId;
      const selectedCartItem = state.items[productId];
      const currentQty = selectedCartItem.quantity;

      let updatedCartItems;

      if (currentQty > 1) {
        //need to reduce it
        const updatedCartItem = new CartItem(
          selectedCartItem.quantity - 1,
          selectedCartItem.productPrice,
          selectedCartItem.productTitle,
          selectedCartItem.sum - selectedCartItem.productPrice
        );
        updatedCartItems = { ...state.items, [productId]: updatedCartItem };
      } else {
        updatedCartItems = { ...state.items };
        delete updatedCartItems[productId];
      }
      return {
        ...state,
        items: updatedCartItems,
        totalAmount: state.totalAmount - selectedCartItem.productPrice,
        count: state.count - 1
      };
  }
  return state;
};
