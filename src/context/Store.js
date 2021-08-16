import React, { Dispatch, useReducer } from "react";
import { Actions, State, reducer, initState } from "./Reducer";

export const Store = React.createContext({});

export const StoreProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initState);

  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
};
