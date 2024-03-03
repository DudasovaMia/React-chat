import React from "react";

class RegisterUserForm extends React.Component {
  state = {
    username: "",
    password: "",
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  registerUser = async () => {
    try {
      const userData = {
        username: this.state.username,
        password: this.state.password,
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
      <div>
        <header>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={this.state.username}
            onChange={this.handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={this.state.password}
            onChange={this.handleChange}
          />
          <button onClick={this.registerUser}>Register</button>
        </header>
        I already have an account <a href="/login">Login</a>
      </div>
    );
  }
}

export default RegisterUserForm;
