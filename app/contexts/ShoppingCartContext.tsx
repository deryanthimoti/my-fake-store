import React, { useEffect, useReducer, createContext, ReactNode } from "react";
import axios from 'axios';

import { useSnackbarActionContext } from '@/app/contexts/SnackbarContext';

import type { ShoppingCart, Product, User } from "../types";

import { API_SHOPPING_CARTS, API_PRODUCTS, API_GET_USERS } from "../constants";

type State = {
  isLoading: boolean;
  list: ShoppingCart[];
  products: Product[];
  users: User[];
};

type Action = {
  addShoppingCart: (userId: number, products: any[]) => void;
};

type ReducerAction = 
{ type: 'SET_SHOPPING_CART_LIST', data: ShoppingCart[] } |
{ type: 'SET_IS_LOADING', data: boolean } | 
{ type: 'SET_PRODUCTS', data: Product[] } |
{ type: 'SET_USERS', data: User[] };

type Props = {
  children: ReactNode;
};

const initialState: State = {
  isLoading: true,
  list: [],
  products: [],
  users: [],
};

function reducer(state: State, action: ReducerAction) {
  switch (action.type) {
    case 'SET_SHOPPING_CART_LIST':
      return { ...state, list: action.data };
    case 'SET_IS_LOADING':
      return { ...state, isLoading: action.data };
    case 'SET_PRODUCTS':
      return { ...state, products: action.data };
    case 'SET_USERS':
      return { ...state, users: action.data };
    default:
      return state;
  }
};

const ShoppingCartStateContext = createContext<State | null>(null);
ShoppingCartStateContext.displayName = 'ShoppingCartStateContext';

const ShoppingCartActionContext = createContext<Action | null>(null);
ShoppingCartActionContext.displayName = 'ShoppingCartActionContext';

export default function ShoppingCartContext(props: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const action = useSnackbarActionContext();

  useEffect(() => {
    dispatch({ type: 'SET_IS_LOADING', data: true });
    
    const productResponse = axios({
      url: API_PRODUCTS,
    });
    productResponse.then(productRes => {
      dispatch({ type: 'SET_PRODUCTS', data: productRes.data });

      const usersResponse = axios({
        url: API_GET_USERS,
      });
      usersResponse.then(usersRes => {
        dispatch({ type: 'SET_USERS', data: usersRes.data});

        const shoppingCartResponse = axios({
          url: API_SHOPPING_CARTS,
        });
        shoppingCartResponse.then(res => {
          const tempShoppingCartList = [...res.data];
          tempShoppingCartList.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            // @ts-ignore
            return dateB - dateA;
          });
          dispatch({ type: 'SET_SHOPPING_CART_LIST', data: tempShoppingCartList });
          dispatch({ type: 'SET_IS_LOADING', data: false });
        });
      });
    });
  }, []);

  const addShoppingCart = async (userId: number, products: any[]) => {
    dispatch({ type: 'SET_IS_LOADING', data: true });
    const response = await axios({
      method: 'POST',
      baseURL: API_SHOPPING_CARTS,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        userId: userId,
        products: products,
      }
    });
    // Hard code it here
    const currentDate = new Date();
    const tempShoppingCartList = [...state.list];
    tempShoppingCartList.unshift({
      id: response.data.id,
      userId,
      date: currentDate.toISOString(),
      products: products.map(product => {
        return {
          productId: product.id,
          quantity: product.quantity,
        }
      }),
    });
    action?.showSnackbar('Shopping Cart successfully added');
    dispatch({ type: 'SET_SHOPPING_CART_LIST', data: tempShoppingCartList });
    dispatch({ type: 'SET_IS_LOADING', data: false });
  };

  const actions = {
    addShoppingCart
  };

  return (
    <ShoppingCartStateContext.Provider value={state}>
      <ShoppingCartActionContext.Provider value={actions}>
        {props.children}
      </ShoppingCartActionContext.Provider>
    </ShoppingCartStateContext.Provider>
  );
};

export function useShoppingCartStateContext() {
  return React.useContext(ShoppingCartStateContext);
}

export function useShoppingCartActionContext() {
  return React.useContext(ShoppingCartActionContext);
}