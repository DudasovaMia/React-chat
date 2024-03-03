import { useEffect, useState } from "react";
import { Provider } from "./Context";

const Container = ({ children }) => {
  const [bio, setBio] = useState("")

  const handleBio = (bio) => {
    setBio(bio)
  };

  const appState = {
    bio,
    onHandleBio: handleBio
  };

  return <Provider value={appState}>{children(appState)}</Provider>;
};

export default Container;
