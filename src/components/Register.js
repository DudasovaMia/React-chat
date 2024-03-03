import React from "react";

class RegisterUserForm extends React.Component {
  state = {
    username: "",
    password: "",
    // bio: "",
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  registerUser = async () => {
    try {
      const userData = {
        username: this.state.username,
        password: this.state.password,
        // bio: this.state.bio,
      };

      const response = await fetch("http://localhost:4000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        console.log("User registered successfully.");
        window.location.replace("/login");
        // Optionally, you can redirect the user to the login page after successful registration
      } else {
        console.error("Failed to register user.");
      }
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  render() {
    return (
      <div className="flex flex-col w-[95%] h-[75vh] mx-auto justify-center items-center">
        <div className="flex flex-col justify-center px-10 py-7 rounded-md border-2 border-gray-700">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={this.state.username}
            onChange={this.handleChange}
            className="px-2 py-1 rounded-md"
          />
          <br />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={this.state.password}
            onChange={this.handleChange}
            className="px-2 py-1 rounded-md"
          />
          <br />
          {/* <input
            type="text"
            name="bio"
            placeholder="Bio"
            value={this.state.bio}
            onChange={this.handleChange}
            className="px-2 py-1 rounded-md"
          />
          <br /> */}
          <button onClick={this.registerUser} className="mb-2">
            Register
          </button>
          <div>
            I already have an account{" "}
            <a href="/login" className="border-b-2 border-gray-700">
              Login
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default RegisterUserForm;
