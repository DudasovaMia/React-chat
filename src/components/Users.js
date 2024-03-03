import React, { useState, useEffect } from "react";

const UserSelect = ({ onSelect, currentUserId }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [checkedUsers, setCheckedUsers] = useState([]);
  const [groupMessages, setGroupMessages] = useState(new Set()); // Use a Set to maintain unique group names

  useEffect(() => {
    if (!localStorage.getItem("loggedInUserUsername")) {
      window.location.replace("/login");
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchGroups(); // Fetch groups when component mounts
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

  const fetchGroups = async () => {
    try {
      const response = await fetch(
        "http://localhost:4000/groupmessages?username=" +
          localStorage.getItem("loggedInUserUsername")
      );
      if (response.ok) {
        const data = await response.json();
        const uniqueGroups = new Set(); // Initialize a Set to store unique group names
        data.messages.forEach((message) => {
          uniqueGroups.add(message.to); // Add each group name to the Set
        });
        setGroupMessages(uniqueGroups); // Set the state with unique group names
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

  const handleCheckboxChange = (username) => {
    const isChecked = checkedUsers.includes(username);
    if (isChecked) {
      setCheckedUsers(checkedUsers.filter((user) => user !== username));
    } else {
      setCheckedUsers([...checkedUsers, username]);
    }
  };

  const handleCreateString = () => {
    const updatedCheckedUsers = [...checkedUsers];
    const loggedInUsername = localStorage.getItem("loggedInUserUsername");
    if (!updatedCheckedUsers.includes(loggedInUsername)) {
      updatedCheckedUsers.push(loggedInUsername);
    }
    console.log(updatedCheckedUsers.join(","));
    localStorage.setItem("selectedUserUsername", updatedCheckedUsers.join(","));
    window.location.reload();
  };

  return (
    <div className="w-[25%] flex flex-col px-2 py-1 max-h-[75vh]">
      <div className="w-full max-h-[60vh] overflow-y-auto overflow-x-hidden">
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
        {[...groupMessages].map((groupName, i) => (
          <div
            key={i}
            onClick={() => {
              localStorage.setItem("selectedUserUsername", groupName);
              window.location.reload();
            }}
            className="flex w-[100%] border-2 border-gray-700 px-2 py-1 justify-between"
          >
            {groupName}
          </div>
        ))}
      </div>
      {users.map(
        (user, i) =>
          user.username !== localStorage.getItem("loggedInUserUsername") && ( // Exclude logged-in user from being displayed as a checkbox
            <div key={i}>
              <input
                type="checkbox"
                onChange={() => handleCheckboxChange(user.username)}
              />
              <label>{user.username}</label>
            </div>
          )
      )}
      <button onClick={handleCreateString}>Create Group</button>
    </div>
  );
};

export default UserSelect;
