import { useEffect, useState } from "react";
import axios from "axios";

const UserDetails = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState(null);
  const [file, setFile] = useState(null);
  const [bio, setBio] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("profile", file);
      formData.append("user", localStorage.getItem("loggedInUserUsername"));

      await axios.post("http://localhost:4000/upload-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Profile uploaded successfully.");
      window.location.reload();
    } catch (error) {
      console.error("Error uploading profile:", error);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:4000/users");
        if (response.ok) {
          const data = await response.json();
          const filteredUsers = data.users.filter(
            (user) =>
              user.username === localStorage.getItem("loggedInUserUsername")
          );
          setUsers(filteredUsers.length > 0 ? filteredUsers[0] : null);
        } else {
          console.error("Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    };
    fetchUsers();
  }, []);

  const [pfp, setPFP] = useState();

  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        const response = await fetch("http://localhost:4000/profile");
        if (response.ok) {
          const data = await response.json();
          const loggedInUsername = localStorage.getItem("loggedInUserUsername");
          const profilePicture = data.profile.find(
            (user) => user.user === loggedInUsername
          );
          setPFP(profilePicture ? profilePicture.filename : null);
        } else {
          console.error("Failed to fetch profile pictures");
        }
      } catch (error) {
        console.error("Error fetching profile pictures:", error);
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    };
    fetchProfilePicture();
  }, []);

  const updateBio = async () => {
    try {
      await axios.post("http://localhost:4000/update-bio", {
        username: localStorage.getItem("loggedInUserUsername"),
        bio: bio,
      });
      console.log("Bio updated successfully.");
      window.location.reload()
    } catch (error) {
      console.error("Error updating bio:", error);
    }
  };

  const Logout = () => {
    localStorage.removeItem("loggedInUserUsername");
    localStorage.removeItem("loggedInUserUserId");
    localStorage.removeItem("loggedInUserToken");
    window.location.reload();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col w-[75%] border-2 px-2 py-1 border-gray-700 mr-2 my-1">
      {users && (
        <div className="w-full px-2 py-1 flex space-x-8 my-auto ml-[15%]">
          {pfp ? (
            <div className="flex items-center justify-center p-3 w-[25%] aspect-square rounded-full border-2 border-gray-700">
              <img src={"http://localhost:4000/uploads/profile/" + pfp}></img>
            </div>
          ) : (
            <div>
              {file ? (
                <>
                  {file.name}
                  <button onClick={() => setFile(null)}>Cancel</button>
                  <button onClick={handleUpload}>Send</button>
                </>
              ) : (
                <>
                  <label
                    htmlFor="profileUpload"
                    className="px-2 py-1 border-2 border-gray-700 rounded-md"
                  >
                    Set profile picture
                  </label>
                  <input
                    id="profileUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ visibility: "hidden", display: "none" }}
                  />
                </>
              )}
            </div>
          )}
          <div className="my-auto">
            <div>
              Username: <strong>{users.username}</strong>{" "}
            </div>
            {users.bio ? (
              <div>
                Bio: <strong>{users.bio}</strong>{" "}
              </div>
            ) : (
              <div>
                <input
                  type="text"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
                <button onClick={() => updateBio()}>Update Bio</button>
              </div>
            )}
            <button
              onClick={Logout}
              className="mt-2 px-2 py-1 border-gray-700 border-2 rounded-md"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
