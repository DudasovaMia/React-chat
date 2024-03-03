import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios for making HTTP requests

const MessageList = ({ loggedId, selectedId }) => {
  const [messages, setMessages] = useState([]);
  const [reactions, setReactions] = useState([]);

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

  useEffect(() => {
    const fetchReactions = async () => {
      try {
        const response = await axios.get("http://localhost:4000/reactions");
        setReactions(response.data.reactions);
      } catch (error) {
        console.error("Error fetching reactions:", error);
      }
    };

    fetchReactions();
    console.log(reactions);
  }, []);

  const addReaction = async (messageId, emojiCode) => {
    try {
      const userData = {
        message: messageId,
        from: localStorage.getItem("loggedInUserUsername"),
        emoji: emojiCode,
      };

      const response = await fetch("http://localhost:4000/add-reaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        console.log("Reaction added successfully.");
        window.location.reload();
      } else {
        console.error("Failed to add reaction.");
      }
    } catch (error) {
      console.error("Error adding reaction:", error);
    }
  };

  const getReactionsForMessage = (messageId) => {
    return reactions.filter((reaction) => reaction.message === messageId);
  };

  return (
    <div className="flex flex-col h-[70vh] max-h-[70vh] overflow-y-auto overflow-x-hidden py-1">
      <div className="flex flex-col w-[95%] justify-center mx-auto">
        {messages
          .sort(function (a, b) {
            return new Date(a.timestamp) - new Date(b.timestamp);
          })
          .map((message) => (
            <div
              className="flex justify-between px-4 py-2 border-2 border-gray-700 my-2 rounded-md"
              key={message._id}
            >
              <div className="w-fit">
                <div className="text-sm">
                  {message.sender ===
                  localStorage.getItem("loggedInUserUsername") ? (
                    <>
                      {new Date(message.timestamp)
                        .toLocaleString("en-US", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })
                        .replace(",", "")}
                      {"  "}
                      From: me{" "}
                    </>
                  ) : (
                    <>
                      {new Date(message.timestamp)
                        .toLocaleString("en-US", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })
                        .replace(",", "")}
                      {"  "}From: {message.sender}
                    </>
                  )}
                </div>
                <strong> {message.text}</strong>
              </div>
              <div className="w-fit">
                {!getReactionsForMessage(message._id).some(
                  (reaction) =>
                    reaction.from ===
                    localStorage.getItem("loggedInUserUsername")
                ) && (
                  <select
                    onChange={(e) => addReaction(message._id, e.target.value)}
                  >
                    <option style={{ display: "inline" }}>&#128522;</option>
                    <option style={{ display: "inline" }}>&#128077;</option>
                    <option style={{ display: "inline" }}>&#127881;</option>
                    <option style={{ display: "inline" }}>&#128525;</option>
                    <option style={{ display: "inline" }}>&#128640;</option>
                  </select>
                )}

                {getReactionsForMessage(message._id).map((reaction) => (
                  <div key={reaction._id} style={{ display: "inline" }}>
                    {reaction.emoji}
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default MessageList;
