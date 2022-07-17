import { createContext, useReducer } from "react";
import Cookies from "js-cookie";

export const Store = createContext();

const initialState = {
  cart: Cookies.get('myamazon.cart')
    ? JSON.parse(Cookies.get('myamazon.cart'))
    : { cartItems: [], shippingAddress: {}, paymentMethod: '' }
}

function reducer(state, action) {
    switch (action.type) {
      case 'CART_ADD_ITEM': {
        const newItem = action.payload;
        const existItem = state.cart.cartItems.find(
          (item) => item.slug === newItem.slug
        );
        let cartItems;
        if (existItem) {
          cartItems = state.cart.cartItems.map((item) => {
            return item.name === existItem.name ? newItem : item
          })
        } else {
          cartItems = [...state.cart.cartItems, newItem]
        }
        Cookies.set('myamazon.cart', JSON.stringify({ ...state.cart, cartItems }));
        return { ...state, cart: { ...state.cart, cartItems } }
      }

      case 'CART_REMOVE_ITEM': {
        const cartItems = state.cart.cartItems.filter(
          (item) => item.slug !== action.payload.slug
        )
        Cookies.set('myamazon.cart', JSON.stringify({ ...state.cart, cartItems }));
        return { ...state, cart: { ...state.cart, cartItems } }
      }

      case 'CART_RESET':
        return {
          ...state,
          cart: {
            cartItems: [],
            shippingAddress: { location: {} },
            paymentMethod: ''
          }
        }

      case 'SAVE_ADDRESS':
        return {
          ...state,
          cart: {
            ...state.cart,
            shippingAddress: {
              ...state.cart.shippingAddress,
              ...action.payload
            },
          }
        }

      case 'SAVE_PAYMENT_METHOD':
        return {
          ...state,
          cart: {
            ...state.cart,
            paymentMethod: action.payload
          }
        }

      case 'CART_CLEAR_ITEMS':
        return {
          ...state,
          cart: {
            ...state.cart,
            cartItems: []
          }
        }

      default:
        return state;
    }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = {state, dispatch}
  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  )
}
