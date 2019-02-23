import React from "react";
import { Redirect, Link } from "react-router-dom";
import Axios from "axios";
import {
  Button,
  Form,
  FormGroup,
  Input
} from "reactstrap";

import "../App.css";

export default class Login extends React.Component {
  state = {
    username: "",
    password: "",
    accountType: "",
    isLoggedIn: false
  };

  submitHandler = e => {
    e.preventDefault();
    const user = {
      username: this.state.username,
      password: this.state.password,
      accountType: this.state.accountType
    };

    // Axios.post("http://localhost:3333/api/login", user)
    Axios.post("https://tipease-server.herokuapp.com/api/login", user)
      .then(response => {
        localStorage.setItem("jwt", response.data.token);
        this.setState({ isLoggedIn: true });
      })
      .catch(error => {
        console.log("Axios Error Msg: ", error);
      });
  };

  handleInput = async e => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    if (this.state.isLoggedIn) {
      return <Redirect to="/" />;
    }

    return (
      <div
        className="login-container"
        style={{
          backgroundColor: "white",
          boxShadow: "0 0 10px snow",
          border: "1px solid #333"
        }}
      >
        <legend className="login-legend">Please Login</legend>
        <Form className="input-form" onSubmit={this.submitHandler}>
          <FormGroup>
            <Input
              type="text"
              name="username"
              id="username"
              placeholder="username"
              value={this.state.username}
              onChange={this.handleInput}
            />
          </FormGroup>
          <FormGroup>
            <Input
              type="password"
              name="password"
              id="password"
              placeholder="******"
              value={this.state.password}
              onChange={this.handleInput}
            />
          </FormGroup>
          <div className="login-buttons">
            <Button outline type="submit">
              Submit
            </Button>
            <Link to="/register">Don't have an account?</Link>
          </div>
        </Form>
      </div>
    );
  }
}
