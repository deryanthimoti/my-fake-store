import React, { useReducer, createContext, ReactNode } from "react";

type State = {
  message: string;
  isVisible: boolean;
  type: 'SUCCESS' | 'ERROR';
};

type Action = {
  showSnackbar: (message: string, type?: 'SUCCESS' | 'ERROR') => void;
}

type ReducerAction = 
{ type: 'SET_MESSAGE', data: string } | 
{ type: 'SET_TYPE', data: 'SUCCESS' | 'ERROR' } |
{ type: 'SET_IS_VISIBLE', data: boolean };

type Props = {
  children: ReactNode;
};

const initialState: State = {
  message: 'Successfully Logged in, welcome ...',
  isVisible: false,
  type: 'SUCCESS',
};

function reducer(state: State, action: ReducerAction) {
  switch (action.type) {
    case 'SET_MESSAGE':
      return { ...state, message: action.data };
    case 'SET_TYPE':
      return { ...state, type: action.data };
    case 'SET_IS_VISIBLE':
      return { ...state, isVisible: action.data };
    default:
      return state;
  }
};

const SnackbarStateContext = createContext<State | null>(null);
SnackbarStateContext.displayName = 'SnackbarStateContext';

const SnackbarActionContext = createContext<Action | null>(null);
SnackbarActionContext.displayName = 'SnackbarActionContext';

export default function SnackbarContext(props: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const showSnackbar = (message: string, type?: 'SUCCESS' | 'ERROR') => {
    dispatch({ type: 'SET_MESSAGE', data: message});
    dispatch({ type: 'SET_TYPE', data: type || 'SUCCESS' });
    dispatch({ type: 'SET_IS_VISIBLE', data: true });
    setTimeout(() => {
      dispatch({ type: 'SET_IS_VISIBLE', data: false });
    }, 2500);
  };

  const actions = {
    showSnackbar,
  };

  return (
    <SnackbarStateContext.Provider value={state}>
      <SnackbarActionContext.Provider value={actions}>
        {props.children}
      </SnackbarActionContext.Provider>
    </SnackbarStateContext.Provider>
  );
};

export function useSnackbarStateContext() {
  return React.useContext(SnackbarStateContext);
}

export function useSnackbarActionContext() {
  return React.useContext(SnackbarActionContext);
}