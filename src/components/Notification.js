// NotificationComponent.js
import React from "react";

const NotificationComponent = () => {
  const handleNotification = () => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
      new Notification("New Message Received!"); // Trigger notification
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function (permission) {
        if (permission === "granted") {
          new Notification("New Message Received!"); // Trigger notification
        }
      });
    }
  };

  return (
    <div>
      <button onClick={handleNotification}>Trigger Notification</button>
    </div>
  );
};

export default NotificationComponent;
