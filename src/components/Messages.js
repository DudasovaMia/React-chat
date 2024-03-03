import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios for making HTTP requests

const MessageList = () => {
  const [reactions, setReactions] = useState([]);
  const [allMessages, setAllMessages] = useState([]);
  const [loading, setLoading] = useState();

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
      setAllMessages((prevMessages) => {
        // Filter out messages that already exist in allMessages
        const newMessages = response.data.messages.filter(
          (message) => !prevMessages.some((m) => m._id === message._id)
        );
        return [...prevMessages, ...newMessages];
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const fetchVideos = async () => {
    try {
      const to = localStorage.getItem("loggedInUserUsername");
      const from = localStorage.getItem("selectedUserUsername");
      const response = await axios.post(
        "http://localhost:4000/getvideos?from=" + from + "&to=" + to
      );
      setAllMessages((prevMessages) => {
        // Filter out messages that already exist in allMessages
        const newVideos = response.data.videos.filter(
          (video) => !prevMessages.some((m) => m._id === video._id)
        );
        return [...prevMessages, ...newVideos];
      });
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  const fetchVoices = async () => {
    try {
      const response = await fetch("http://localhost:4000/voices");
      if (response.ok) {
        const data = await response.json();
        const filteredVoices = data.voices.filter(
          (voice) =>
            (voice.from === localStorage.getItem("loggedInUserUsername") &&
              voice.to === localStorage.getItem("selectedUserUsername")) ||
            (voice.from === localStorage.getItem("selectedUserUsername") &&
              voice.to === localStorage.getItem("loggedInUserUsername"))
        );
        setAllMessages((prevMessages) => {
          // Filter out messages that already exist in allMessages
          const newVoices = filteredVoices.filter(
            (voice) => !prevMessages.some((m) => m._id === voice._id)
          );
          return [...prevMessages, ...newVoices];
        });
      } else {
        console.error("Failed to fetch voices");
      }
    } catch (error) {
      console.error("Error fetching voices:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchImages = async () => {
    try {
      const to = localStorage.getItem("loggedInUserUsername");
      const from = localStorage.getItem("selectedUserUsername");
      const response = await axios.post(
        "http://localhost:4000/getimages?from=" + from + "&to=" + to
      );
      setAllMessages((prevMessages) => {
        // Filter out messages that already exist in allMessages
        const newImages = response.data.images.filter(
          (image) => !prevMessages.some((m) => m._id === image._id)
        );
        return [...prevMessages, ...newImages];
      });
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const fetchReactions = async () => {
    try {
      const response = await axios.get("http://localhost:4000/reactions");
      setReactions(response.data.reactions);
    } catch (error) {
      console.error("Error fetching reactions:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchReactions();
    fetchVideos();
    fetchVoices();
    fetchImages();
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
    <div className="flex flex-col h-[60vh] max-h-[60vh] overflow-y-auto overflow-x-hidden py-1">
      <div className="flex flex-col w-[95%] justify-center mx-auto">
        {allMessages
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
                  {message.from ==
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
                      {"  "}From: {message.from}
                    </>
                  )}
                </div>
                {message.text && <strong>{message.text}</strong>}
                {message.filename && message.filename.endsWith(".mp4") && (
                  <video
                    src={
                      "http://localhost:4000/uploads/video/" + message.filename
                    }
                    className="max-h-[25vh]"
                    controls
                  />
                )}
                {message.filename &&
                  /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i.test(message.filename) && (
                    <img
                      src={
                        "http://localhost:4000/uploads/images/" +
                        message.filename
                      }
                      alt="Image"
                      className="max-h-[25vh]"
                    />
                  )}
                {message.filename && message.filename.endsWith(".mp3") && (
                  <audio
                    src={
                      "http://localhost:4000/uploads/voice/" + message.filename
                    }
                    controls
                    className="max-h-[25vh]"
                  />
                )}
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
