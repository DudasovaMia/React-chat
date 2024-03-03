import React, { useState, useEffect } from "react";

const UserSelect = ({ onSelect, currentUserId }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("loggedInUserUsername")) {
      window.location.replace("/login");
    }
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:4000/users");
      if (response.ok) {
        const data = await response.json();
        // Exclude the currently logged-in user from the list
        const filteredUsers = data.users.filter(
          (user) => user._id !== localStorage.getItem("userId")
        );
        setUsers(filteredUsers);
      } else {
        console.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleChange = (username) => {
    if (localStorage.getItem("selectedUserUsername") === username) {
      localStorage.removeItem("selectedUserUsername");
      window.location.reload();
      return;
    }
    setSelectedUser(username);
    localStorage.setItem("selectedUserUsername", username);
    window.location.reload();
  };

  return (
    <div className="w-[25%] flex flex-col px-2 py-1">
      {users.map((user) => (
        <div key={user._id}>
          {" "}
          {user.username !== localStorage.getItem("loggedInUserUsername") && (
            <div
              className="flex w-[100%] border-2 border-gray-700 px-2 py-1 justify-between"
              onClick={() => handleChange(user.username)}
            >
              <div>{user.username}</div>
              {user.username ===
              localStorage.getItem("selectedUserUsername") ? (
                <div>{"<"}</div>
              ) : (
                <div>{">"}</div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default UserSelect;
