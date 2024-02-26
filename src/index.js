import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import ChatRoom from "./components/ChatRoom";

function ToggleThemeButton({ theme, toggleTheme }) {
  return (
    <button onClick={toggleTheme}>
      {theme === "light" ? "Switch to Dark Theme" : "Switch to Light Theme"}
    </button>
  );
}

const root = createRoot(document.getElementById("root"));

function App() {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <React.StrictMode>
      <Router>
        <div className={`App ${theme}`}>
          <ToggleThemeButton theme={theme} toggleTheme={toggleTheme} />
          <div className="content">
            <Routes>
              <Route path="/" element={<ChatRoom />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </div>
        </div>
      </Router>
    </React.StrictMode>
  );
}

root.render(<App />);

reportWebVitals();
