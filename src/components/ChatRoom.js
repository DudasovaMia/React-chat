import ChatComponent from "./Chat";
import UserSelect from "./Users";
import MessageList from "./Messages";
import { useEffect, useState } from "react";
import VideoUploader from "./VideoUploader";
import Videos from "./Videos";
import Images from "./Images";

function MessageRoom() {
  const [selectedUserUserId, setSelectedUserUserId] = useState("");
  const [selectedUserUsername, setSelectedUserUsername] = useState("");
  const [loggedInUserToken, setLoggedInUserToken] = useState("");
  const [loggedInUserUserId, setLoggedInUserUserId] = useState("");
  const [loggedInUserUsername, setLoggedInUserUsername] = useState("");

  const [mediaOpened, setMediaOpened] = useState(false);
  const [mediaType, setMediaType] = useState("images");

  useEffect(() => {
    setSelectedUserUserId(localStorage.getItem("selectedUserUserId"));
    setSelectedUserUsername(localStorage.getItem("selectedUserUsername"));
    setLoggedInUserToken(localStorage.getItem("loggedInUserToken"));
    setLoggedInUserUserId(localStorage.getItem("loggedInUserUserId"));
    setLoggedInUserUsername(localStorage.getItem("loggedInUserUsername"));
  }, []);

  return (
    <div className="flex">
      <UserSelect />
      <div className="flex flex-col w-[75%] border-2 px-2 py-1 border-gray-700 mr-2 my-1">
        {mediaOpened ? (
          <div className="w-[100%]">
            <div className="flex items-center border-b-2 border-gray-700 justify-between w-[95%] mx-auto">
              <h2>Messages: {localStorage.getItem("selectedUserUsername")}</h2>
              <div className="flex items-center">
                <button
                  onClick={() => setMediaOpened(false)}
                  className="mx-5 my-2"
                >
                  Chat
                </button>
                <p className="mx-5 px-2 py-1 border-0.5 border-gray-700 rounded-md">
                  Media
                </p>
              </div>
              <hr />
            </div>
            {mediaType === "images" ? (
              <div className="flex flex-col">
                <div className="flex py-2 border-b-1 border-gray-700">
                  <button
                    onClick={() => setMediaType("videos")}
                    className="mx-5"
                  >
                    Videos
                  </button>
                  <p className="px-2 py-1 border-0.5 border-gray-700 rounded-md">
                    Images
                  </p>
                </div>
                <div className="w-[95%] mx-auto">
                  <Images />
                </div>
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="flex my-2">
                  <p className="mx-5 px-2 py-1 border-0.5 border-gray-700 rounded-md">
                    Videos
                  </p>
                  <button onClick={() => setMediaType("images")}>Images</button>
                </div>
                <div className="w-[95%] mx-auto">
                  <Videos />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="w-[100%]">
            <div className="flex items-center border-b-2 border-gray-700 justify-between w-[95%] mx-auto">
              <h2>Messages: {localStorage.getItem("selectedUserUsername")}</h2>
              <div className="flex items-center">
                <p className="mx-5 px-2 py-1 border-0.5 border-gray-700 rounded-md">
                  Chat
                </p>
                <button
                  onClick={() => setMediaOpened(true)}
                  className="mx-5 my-2"
                >
                  Media
                </button>
              </div>
              <hr />
            </div>
            <MessageList />
            <ChatComponent />
          </div>
        )}
      </div>
    </div>
  );
}

export default MessageRoom;
