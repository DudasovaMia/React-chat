import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios for making HTTP requests

const MessageList = ({ loggedId, selectedId }) => {
  const [messages, setMessages] = useState([]);
  const [usernames, setUsernames] = useState({});
  const selectedUser = localStorage.getItem("selectedUserUsername");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const loggedId = localStorage.getItem("loggedInUserUsername");
        const selectedId = localStorage.getItem("selectedUserUsername");
        const response = await axios.get("http://localhost:4000/messages", {
          params: {
            loggedId: loggedId,
            selectedId: selectedId,
          },
        });
        setMessages(response.data.messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [loggedId, selectedId]);

  const fetchUsername = async (id) => {
    try {
      const response = await fetch("http://localhost:4000/users");
      const data = await response.json();
      const user = data.users.find((user) => user._id === id); // Accessing data.users instead of data directly
      const { username } = user;
      console.log(username);
      return username;
    } catch (error) {
      console.error("Error fetching username:", error);
      return null;
    }
  };

  useEffect(() => {
    const updateUsername = async () => {
      const newUsername = await fetchUsername("65dcd6eb05c71e52b0460a80");
      setUsernames((prevUsernames) => ({
        ...prevUsernames,
        "65dcd6eb05c71e52b0460a80": newUsername,
      }));
    };
    updateUsername();
  }, []);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col w-[95%] justify-center mx-auto">
        {messages
          .sort(function (a, b) {
            return new Date(a.timestamp) - new Date(b.timestamp);
          })
          .map((message) => (
            <div
              className="px-4 py-2 border-2 border-gray-700 my-2 rounded-md"
              key={message._id}
            >
              <div className="text-sm">
                {message.sender ===
                localStorage.getItem("loggedInUserUsername") ? (
                  <>From: me</>
                ) : (
                  <>From: {message.sender}</>
                )}
              </div>
              <strong> {message.text}</strong>
            </div>
          ))}
      </div>
    </div>
  );
};

export default MessageList;
