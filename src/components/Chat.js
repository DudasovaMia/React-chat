import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import VideoUploader from "./VideoUploader";
import ImageUploader from "./ImageUploader";
import UploadVoice from "./VoiceUploader";

const Chat = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [username, setUsername] = useState(""); // State to hold the username

  useEffect(() => {
    if (!localStorage.getItem("loggedInUserUsername")) {
      window.location.replace("/login");
    }
  });

  useEffect(() => {
    const newSocket = io("http://localhost:4000"); // Replace with your server URL
    setSocket(newSocket);

    // Cleanup function to disconnect socket when component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on("messageHistory", (history) => {
      setMessages(history);
    });

    // Cleanup function to remove event listeners when component unmounts
    return () => {
      socket.off("message");
      socket.off("messageHistory");
    };
  }, [socket]);

  useEffect(() => {
    // Retrieve username from local storage
    const storedUsername = localStorage.getItem("loggedInUserUsername");
    setUsername(storedUsername);
  }, []); // Run this effect only once when the component mounts

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        console.log("Notification permission:", permission);
      });
    }
  }, []);

  const sendMessage = () => {
    const logged = localStorage.getItem("loggedInUserUsername");
    const selected = localStorage.getItem("selectedUserUsername");
    if (!inputMessage.trim() || !username) return;

    if (logged && selected && inputMessage) {
      const message = {
        logged: logged,
        selected: selected,
        text: inputMessage,
        timestamp: new Date(),
      };
      socket.emit("message", message);
      setInputMessage("");

      // Display a notification for the sent message
      if (Notification.permission === "granted") {
        new Notification("Message Sent", {
          body: `Your message has been sent to ${selected}`,
        });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            new Notification("Message Sent", {
              body: `Your message has been sent to ${selected}`,
            });
          }
        });
      }
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col">
      <div>
        {messages.map((message, index) => (
          <div key={index}>
            <strong>{new Date(message.timestamp).toLocaleString()}:</strong>{" "}
            {message.text}
          </div>
        ))}
      </div>
      <div className="flex w-[95%] justify-between mx-auto my-2">
        <ImageUploader />
        <VideoUploader />
        <UploadVoice/>
        <div className="flex w-[80%] justify-end">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message..."
            className="w-[80%]"
          />
          <button onClick={sendMessage} className="ml-1">Send</button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
