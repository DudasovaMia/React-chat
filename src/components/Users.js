import React, { useState, useEffect } from "react";

const UserSelect = ({ onSelect, currentUserId }) => {

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

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

  const handleChange = (event) => {
    setSelectedUser(event.target.value);
    const selectedUserData = users.find(
      (user) => user._id === event.target.value
    );
    localStorage.setItem("selectedUserUserId", selectedUserData._id)
    localStorage.setItem("selectedUserUsername", selectedUserData.username)
    window.location.reload()
  };

  return (
    <select value={selectedUser} onChange={handleChange}>
      <option value="">Select User</option>
      {users.map((user) => (
        <option key={user._id} value={user._id}>
          {user.username} ({user._id})
        </option>
      ))}
    </select>
  );
};

export default UserSelect;
