const Navbar = ({ theme, toggleTheme }) => {
  function ToggleThemeButton({ theme, toggleTheme }) {
    return (
      <button onClick={toggleTheme}>
        {theme === "light" ? "Switch to Dark Theme" : "Switch to Light Theme"}
      </button>
    );
  }

  const Logout = () => {
    localStorage.removeItem("loggedInUserUsername");
    localStorage.removeItem("loggedInUserUserId");
    localStorage.removeItem("loggedInUserToken");
    window.location.reload();
  };
  return (
    <div className="flex justify-between self-center px-10 py-4 items-center">
      <h2 className="text-lg font-bold">ICQ z Wishu</h2>
      <div className="flex items-center">
        {localStorage.getItem("loggedInUserUsername") ? (
          <div className="flex justify-center items-center">
            {localStorage.getItem("loggedInUserUsername")}
            <button
              onClick={Logout}
              className="mx-5 px-2 py-1 border-gray-700 border-2 rounded-md"
            >
              Logout
            </button>
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
