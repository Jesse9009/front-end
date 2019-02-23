import React, { Component } from "react";
import Axios from "axios";
import jwt_decode from "jwt-decode";
import { Form, Input, Button, FormGroup, Label } from "reactstrap";
import { Redirect } from "react-router-dom";

import "../App.css";

class WorkerDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      photo: "",
      fname: "",
      lname: "",
      jobTitle: "",
      tagline: "",
      totalTips: null,
      selectedFile: null,
      deleted: false
    };
  }

  componentDidMount() {
    this.refresh();
  }

  refresh = () => {
    const token = localStorage.getItem("jwt");
    const options = {
      headers: {
        Authorization: token
      }
    };
    const { id } = jwt_decode(token);
    // const id = 1
    /* This is where an axios.get would be done to get worker by id */
    // Axios.get(`http://localhost:3333/api/worker/${id}`, options)
    Axios.get(`https://tipease-server.herokuapp.com/api/worker/${id}`, options)
      .then(response => {
        const {
          id,
          photo,
          fname,
          lname,
          jobTitle,
          tagline,
          totalTips
        } = response.data[0];
        this.setState({
          id,
          photo: photo || "",
          fname,
          lname,
          jobTitle,
          tagline,
          totalTips
        });
      })
      .catch(err => console.log("Dashboard error:", err));
  };

  deleteAccount = e => {
    // Axios.delete(`http://localhost:3333/api/worker/delete/${id}`)
    const token = localStorage.getItem("jwt");
    const options = {
      headers: {
        Authorization: token
      }
    };
    const { id } = this.state;
    console.log(id);
    Axios.delete(
      `https://tipease-server.herokuapp.com/api/worker/delete/${id}`,
      options
    )
      .then(response => {
        console.log(response);
        localStorage.removeItem("jwt");
        this.setState({ deleted: true });
      })
      .catch(err => console.log(err));
  };

  updateAccount = e => {
    e.preventDefault();
    const token = localStorage.getItem("jwt");
    const options = {
      headers: {
        Authorization: token
      }
    };
    const {
      id,
      photo,
      fname,
      lname,
      jobTitle,
      tagline,
      totalTips
    } = this.state;
    const user = {
      id,
      photo,
      fname,
      lname,
      jobTitle,
      tagline,
      totalTips
    };
    // console.log(id, user);
    // Axios.put(`http://localhost:3333/api/worker/update/${id}`, user, options)
    Axios.put(
      `https://tipease-server.herokuapp.com/api/worker/update/${id}`,
      user,
      options
    )
      .then(response => {
        this.refresh();
      })
      .catch(error => {
        console.log(error);
      });
  };

  handleInput = async e => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  };

  // handleChange(selectorFiles: FileList) {
  //   console.log(selectorFiles);
  // }

  fileSelectedHandler = e => {
    const files = e.target.files;

    this.setState({ selectedFile: files[0] });
  };

  uploadPhoto = () => {
    console.log("Photo in state: ", this.state.photo);
    const token = localStorage.getItem("jwt");
    const options = {
      headers: {
        Authorization: token
      }
    };
    const fd = new FormData();
    console.log(
      "file in state being appended to fd: ",
      this.state.selectedFile
    );
    fd.append("profilePic", this.state.selectedFile);
    console.log("form data being sent in axios: ", fd);
    const { id } = this.state;

    // Axios.post(`http://localhost:3333/upload/${id}`, fd, options)
    Axios.post(`https://tipease-server.herokuapp.com/upload/${id}`, fd, options)
      .then(response => {
        console.log("axios response", response);
        this.refresh();
      })
      .catch(err => {
        console.log("Upload error");
      });
  };

  render() {
    const {
      photo,
      fname,
      lname,
      jobTitle,
      tagline,
      totalTips,
      deleted
    } = this.state;
    if (deleted) {
      return <Redirect to="/register" />;
    }
    const URL = "https://tipease-server.herokuapp.com";
    // const URL = "http://localhost:3333";
    const photoURL = photo.slice(6);
    console.log(URL, photoURL);
    return (
      <div className="worker-dashboard">
        <h3
          style={{ textAlign: "center", color: "snow", marginBottom: "20px" }}
        >
          Welcome to your dashboard, {fname}!
        </h3>
        <Form
          className="worker-dashboard-form"
          onSubmit={this.updateAccount}
          style={{
            backgroundColor: "white",
            boxShadow: "0 0 10px snow",
            border: "1px solid #333"
          }}
        >
          <img
            src={`${URL}${photoURL}`}
            style={{
              display: "block",
              margin: "0 auto",
              borderRadius: "50%",
              width: "50%"
            }}
            alt="a pic"
          />
          {/*<h6>{photo}</h6>*/}
          <FormGroup>
            <Label for="fname-input">First Name</Label>
            <Input
              type="text"
              id="fname-input"
              value={fname}
              name="fname"
              placeholder="First Name"
              onChange={this.handleInput}
            />
          </FormGroup>
          <FormGroup>
            <Label for="lname-input">Last Name</Label>
            <Input
              type="text"
              id="lname-input"
              value={lname}
              name="lname"
              placeholder="Last Name"
              onChange={this.handleInput}
            />
          </FormGroup>
          <FormGroup>
            <Label for="jobTitle-input">Job Title</Label>
            <Input
              type="text"
              id="jobTitle-input"
              value={jobTitle}
              name="jobTitle"
              placeholder="Job Title"
              onChange={this.handleInput}
            />
          </FormGroup>
          <FormGroup>
            <Label for="tagline-input">Tagline</Label>
            <Input
              type="text"
              id="tagline-input"
              value={tagline}
              name="tagline"
              placeholder="Tagline"
              onChange={this.handleInput}
            />
          </FormGroup>
          <FormGroup>
            <Form encType="multipart/form-data" onSubmit={this.uploadPhoto}>
              <input type="file" onChange={e => this.fileSelectedHandler(e)} />
              <Button type="submit">Upload Photo</Button>
            </Form>
          </FormGroup>
          {/*<FormGroup>
            <Label for="photo-input">Upload Image file</Label>
            <Input type="file" onChange={this.fileSelectedHandler} />
          </FormGroup>*/}
          <h3>Total Tips Recieved: ${totalTips || 0}</h3>
          <div className="worker-btns">
            <Button outline type="submit">
              Update Information
            </Button>
            <Button outline type="button" onClick={this.deleteAccount}>
              Delete Profile
            </Button>
          </div>
        </Form>
      </div>
    );
  }
}

export default WorkerDashboard;
