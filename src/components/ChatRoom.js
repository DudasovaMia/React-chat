import ChatComponent from "./Chat";
import UserSelect from "./Users";
import MessageList from "./Messages";
import { useEffect, useState } from "react";
import VideoUploader from "./VideoUploader";

function App() {
  const [selectedUserUserId, setSelectedUserUserId] = useState("");
  const [selectedUserUsername, setSelectedUserUsername] = useState("");
  const [loggedInUserToken, setLoggedInUserToken] = useState("");
  const [loggedInUserUserId, setLoggedInUserUserId] = useState("");
  const [loggedInUserUsername, setLoggedInUserUsername] = useState("");

  useEffect(() => {
    setSelectedUserUserId(localStorage.getItem("selectedUserUserId"));
    setSelectedUserUsername(localStorage.getItem("selectedUserUsername"));
    setLoggedInUserToken(localStorage.getItem("loggedInUserToken"));
    setLoggedInUserUserId(localStorage.getItem("loggedInUserUserId"));
    setLoggedInUserUsername(localStorage.getItem("loggedInUserUsername"));
  }, []);

  return (
    <div>
      <header>
        {loggedInUserUsername && <p>Logged in: {loggedInUserUsername}</p>}
        <UserSelect />
        <MessageList/>
        <ChatComponent />
        <VideoUploader/>
      </header>
    </div>
  );
}

export default App;
