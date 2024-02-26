import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios for making HTTP requests

const MessageList = ({ loggedId, selectedId }) => {
  const [messages, setMessages] = useState([]);
  const [usernames, setUsernames] = useState({});
  const selectedUser = localStorage.getItem("selectedUserUsername");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const loggedId = localStorage.getItem("loggedInUserUserId");
        const selectedId = localStorage.getItem("selectedUserUserId");
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
    <div>
      <h2>Messages: {selectedUser}</h2>
      <ul>
        {messages.map((message) => (
          <li key={message._id}>
            <strong>Sender:</strong> {usernames[message.sender]}
            <strong>Message:</strong> {message.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MessageList;
