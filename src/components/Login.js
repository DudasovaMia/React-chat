import React, { useState } from "react";

const LoginUserButton = () => {
  const [username, setUsername] = useState(""); // Initialize username state
  const [password, setPassword] = useState(""); // Initialize password state

  const handleChange = (event) => {
    if (event.target.name === "username") {
      setUsername(event.target.value);
    } else if (event.target.name === "password") {
      setPassword(event.target.value);
    }
  };

  const loginUser = async () => {
    try {
      const userData = {
        username,
        password,
      };

      const response = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("loggedInUserToken", data.token);
        localStorage.setItem("loggedInUserUserId", data.userId);
        localStorage.setItem("loggedInUserUsername", data.username);
        console.log("Login successful.");
        window.location.replace("/")
      } else {
        console.error("Failed to login.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <div>
      <header>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={username}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={handleChange}
        />
        <button onClick={loginUser}>Login</button>
      </header>
      I don't have an account <a href="/register">Register</a>
    </div>
  );
};

export default LoginUserButton;
