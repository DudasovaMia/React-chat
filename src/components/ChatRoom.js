import ChatComponent from "./Chat";
import UserSelect from "./Users";
import MessageList from "./Messages";
import { useEffect, useState } from "react";
import VideoUploader from "./VideoUploader";
import Videos from "./Videos";
import Images from "./Images";
import UserDetails from "./UserDetails";
import Voices from "./Voices";

function MessageRoom() {
  const [mediaOpened, setMediaOpened] = useState(false);
  const [mediaType, setMediaType] = useState("videos");

  return (
    <div className="flex">
      <UserSelect />
      {localStorage.getItem("selectedUserUsername") ? (
        <div className="flex flex-col w-[75%] border-2 px-2 py-1 border-gray-700 mr-2 my-1">
          {mediaOpened ? (
            <div className="w-[100%]">
              <div className="flex items-center border-b-2 border-gray-700 justify-between w-[95%] mx-auto">
                <h2>
                  Messages:{" "}
                  <strong>
                    {localStorage.getItem("selectedUserUsername")}
                  </strong>
                </h2>
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
              </div>
              {mediaType === "images" && (
                <div className="flex flex-col">
                  <div className="flex py-2 border-b-1 border-gray-700">
                    <button
                      onClick={() => setMediaType("videos")}
                      className="ml-5"
                    >
                      Videos
                    </button>
                    <button
                      onClick={() => setMediaType("voices")}
                      className="mx-5"
                    >
                      Voices
                    </button>
                    <p className="px-2 py-1 border-0.5 border-gray-700 rounded-md">
                      Images
                    </p>
                  </div>
                  <div className="w-[95%] mx-auto">
                    <Images />
                  </div>
                </div>
              )}
              {mediaType === "videos" && (
                <div className="flex flex-col">
                  <div className="flex my-2">
                    <p className="mx-5 px-2 py-1 border-0.5 border-gray-700 rounded-md">
                      Videos
                    </p>
                    <button
                      onClick={() => setMediaType("voices")}
                      className="mr-5"
                    >
                      Voices
                    </button>
                    <button onClick={() => setMediaType("images")}>
                      Images
                    </button>
                  </div>
                  <div className="w-[95%] mx-auto">
                    <Videos />
                  </div>
                </div>
              )}
              {mediaType === "voices" && (
                <div className="flex flex-col">
                  <div className="flex my-2">
                    <button
                      onClick={() => setMediaType("videos")}
                      className="ml-5"
                    >
                      Videos
                    </button>
                    <p className="mx-5 px-2 py-1 border-0.5 border-gray-700 rounded-md">
                      Voices
                    </p>
                    <button onClick={() => setMediaType("images")}>
                      Images
                    </button>
                  </div>
                  <div className="w-[95%] mx-auto">
                    <Voices />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="w-[100%]">
              <div className="flex items-center border-b-2 border-gray-700 justify-between w-[95%] mx-auto">
                <h2>
                  Messages:{" "}
                  <strong>
                    {localStorage.getItem("selectedUserUsername")}
                  </strong>
                </h2>
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
              </div>
              <MessageList />
              <ChatComponent />
            </div>
          )}
        </div>
      ) : (
        <UserDetails />
      )}
    </div>
  );
}

export default MessageRoom;
