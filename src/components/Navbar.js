import { useState, useEffect } from "react";

const Navbar = ({ theme, toggleTheme }) => {
  function ToggleThemeButton({ theme, toggleTheme }) {
    return (
      <button onClick={toggleTheme}>
        {theme === "light" ? "Switch to Dark Theme" : "Switch to Light Theme"}
      </button>
    );
  }

  const [pfp, setPFP] = useState();
  const [loading, setLoading] = useState();

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

  return (
    <div className="flex justify-between self-center px-10 py-4 items-center">
      <h2 className="text-lg font-bold">ICQ z Wishu</h2>
      <div className="flex items-center">
        {localStorage.getItem("loggedInUserUsername") ? (
          <div className="flex justify-center items-center">
            <img
              src={"http://localhost:4000/uploads/profile/" + pfp}
              className="w-[50px] aspect-square rounded-full border-2 border-gray-700 p-1 mx-5"
              onClick={() => {
                localStorage.removeItem("selectedUserUsername");
                window.location.reload();
              }}
            />
          </div>
        ) : (
          <a href="/login" className="mx-5">
            Login
          </a>
        )}
        <ToggleThemeButton theme={theme} toggleTheme={toggleTheme} />
      </div>
    </div>
  );
};

export default Navbar;
