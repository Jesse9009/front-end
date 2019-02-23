import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Button, Collapse } from "reactstrap";
import { AvForm, AvField } from 'availity-reactstrap-validation';
import Axios from "axios";

import "../App.css";

class Register extends Component {
  state = {
    username: "",
    password: "",
    accountType: "",
    isWorker: false,
    fname: "",
    lname: "",
    jobTitle: "",
    tagline: "",
    isRegistered: false,
    collapseCustomer: false,
    collapseWorker: false,
    match: false
  };

  toggleCustomer = () => {
    // this.setState({ collapseCustomer: !this.state.collapseCustomer });
    this.setState({
      collapseCustomer: !this.state.collapseCustomer,
      collapseWorker: false,
      accountType: "customer",
      isWorker: false
    });
  };

  toggleWorker = () => {
    //this.setState({ collapseWorker: !this.state.collapseWorker });
    this.setState({
      collapseWorker: !this.state.collapseWorker,
      collapseCustomer: false,
      accountType: "worker"
      //isWorker: true
    });
  };

  submitHandler = e => {
    e.preventDefault();
    const {
      username,
      password,
      accountType,
      fname,
      lname,
      jobTitle,
      tagline
    } = this.state;
    const user = {
      username,
      password,
      accountType,
      fname,
      lname,
      jobTitle,
      tagline
    };

    if (accountType === "customer") {
      Axios.post("https://tipease-server.herokuapp.com/api/register", {
        username,
        password,
        accountType
      })
        .then(response => {
          this.setState({ isRegistered: true });
        })
        .catch(error => {
          console.log("Error registering customer: ", error);
        });
    } else {
      Axios.post("https://tipease-server.herokuapp.com/api/register", user)
        .then(response => {
          this.setState({ isRegistered: true });
        })
        .catch(error => {
          console.log("Error registering worker: ", error);
        });
    }
  };

  handleInput = async e => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  };

  handleOptionChange = e => {
    const accntType = e.target.value;
    if (accntType === "worker") {
      this.setState({
        accountType: accntType,
        isWorker: true
      });
    } else {
      this.setState({
        accountType: accntType,
        isWorker: false
      });
    }
  };

  checkPassword = e => {
    const style1 = { border: "none" };

    return style1;
  };

  render() {
    if (this.state.isRegistered) {
      return <Redirect to="/login" />;
    }

    if (!this.state.isWorker) {
      return (
        <div
          className="registration-container"
          style={{
            backgroundColor: "white",
            boxShadow: "0 0 10px snow",
            border: "1px solid #333"
          }}
        >
          <h3 className="registration-legend">Registration</h3>
          <div className="register-buttons">
            <Button
              outline
              color="primary"
              onClick={this.toggleCustomer}
              style={{ marginBottom: "1rem" }}
            >
              Customer
            </Button>
            <Button
              outline
              color="success"
              onClick={this.toggleWorker}
              style={{ marginBottom: "1rem" }}
            >
              Worker
            </Button>
          </div>
          <Collapse isOpen={this.state.collapseCustomer}>
            <h4 style={{ textAlign: "center", color: "#555" }}>Customer</h4>
            <AvForm className="input-form" onSubmit={this.submitHandler}>
                <AvField
                  type="text"
                  name="username"
                  id="username"
                  placeholder="username"
                  value={this.state.username}
                  onChange={this.handleInput}
                />
                <AvField
                  type="password"
                  name="password"
                  id="password"
                  placeholder="password"
                  value={this.state.password}
                  onChange={this.handleInput}
                />
                <AvField
                  type="password"
                  name="confirmationPassword"
                  placeholder="password"
                  validate={{match:{value:'password'}}}
                />
              <Button outline type="submit">
                Register
              </Button>
            </AvForm>
          </Collapse>
          <Collapse isOpen={this.state.collapseWorker}>
            <h4 style={{ textAlign: "center", color: "#555" }}>Worker</h4>
            <AvForm className="input-form" onSubmit={this.submitHandler}>
                <AvField
                  type="text"
                  name="username"
                  id="username"
                  placeholder="username"
                  value={this.state.username}
                  onChange={this.handleInput}
                />
                <AvField
                  type="password"
                  name="password"
                  id="password"
                  placeholder="password"
                  value={this.state.password}
                  onChange={this.handleInput}
                />
                <AvField
                  type="password"
                  name="confirmationPassword"
                  placeholder="password"
                  validate={{match:{value:'password'}}}
                />
                <AvField
                  type="text"
                  name="fname"
                  placeholder="first name"
                  value={this.state.fname}
                  onChange={this.handleInput}
                />
                <AvField
                  type="text"
                  name="lname"
                  placeholder="last name"
                  value={this.state.lname}
                  onChange={this.handleInput}
                />
                <AvField
                  type="text"
                  name="jobTitle"
                  placeholder="job title"
                  value={this.state.jobTitle}
                  onChange={this.handleInput}
                />
                <AvField
                  type="text"
                  name="tagline"
                  placeholder="tagline"
                  value={this.state.tagline}
                  onChange={this.handleInput}
                />
              <Button outline type="submit">
                Register
              </Button>
            </AvForm>
          </Collapse>
        </div>
      );
    }
  }
}

export default Register;
