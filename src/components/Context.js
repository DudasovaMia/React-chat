import React, { useContext } from "react";

const defaultAppState = {
  bio: false,
  onHandleBio: (bio) => {
    console.log(`Handling bio: ${bio}`);
  },
};

const AppContext = React.createContext.defaultAppState;


export const Provider = ({ value, children }) => (
  <AppContext.Provider value={value}>{children}</AppContext.Provider>
);

export const useAppContainer = () => {
  return useContext(AppContext);
};
