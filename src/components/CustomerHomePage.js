import React, { Component } from "react";
import Modal from "react-responsive-modal";
import Axios from "axios";
import jwt_decode from "jwt-decode";
import {
  Card,
  CardImg,
  CardText,
  CardBody,
  CardSubtitle,
  Button,
  Input,
  Form,
  FormText,
  FormGroup
} from "reactstrap";

import "../App.css";

class CustomerHomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      workers: [],
      open: false,
      tip: "0.00",
      id: null,
      tipSuccess: false
    };
  }

  componentDidMount() {
    const token = localStorage.getItem("jwt");
    const { username, id } = jwt_decode(token);
    const options = {
      headers: {
        Authorization: token
      }
    };
    /* This is where an axios.get would be done to get all of the workers from the database, then set your this.state.workers to the response.data */
    // Axios.get("http://localhost:3333/api/customer", options)
    Axios.get("https://tipease-server.herokuapp.com/api/customer", options)
      // .then(response => console.log(response))
      .then(response =>
        this.setState({
          username,
          workers: response.data,
          tipSuccess: true,
          id
        })
      )
      .catch(err => console.log(err));
  }

  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  };

  handleChange(event, maskedvalue, floatvalue) {
    this.setState({ amount: maskedvalue });
  }

  onOpenModal = id => {
    this.setState({
      open: true,
      id: id
    });
  };

  onCloseModal = () => {
    this.setState({ open: false });
  };

  handleInput = async e => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  };

  tipSubmitHandler = e => {
    e.preventDefault();
    const { id, tip } = this.state;
    const token = localStorage.getItem("jwt");
    const options = {
      headers: {
        Authorization: token
      }
    };
    console.log("tipSubmitHandler args: ", tip);
    // Update server with amount
    // Axios.post(
    //   `http://localhost:3333/api/customer/worker/${id}`,
    //   { tip: +tip },
    //   options
    // )
    Axios.post(
      `https://tipease-server.herokuapp.com/api/customer/worker/${id}`,
      { tip: +tip },
      options
    )
      .then(response => {
        console.log("TipResponse: ", response);
        //  close modal
        this.setState({ open: false });
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    const { open, tip } = this.state;
    const URL = "https://tipease-server.herokuapp.com";
    return (
      <>
        <legend
          className="welcome-tip"
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "1.5rem",
            color: "snow",
            padding: "0 1%"
          }}
        >
          Welcome, {this.state.username.toUpperCase()}. Who would you like to
          tip?
        </legend>
        <div className="card-container">
          {this.state.workers.map(worker => {
            const { photo } = worker;
            const photoURL = photo.slice(6);
            return (
              <Card
                className="card"
                key={worker.id}
                style={{ boxShadow: "0px 0px 15px #333" }}
              >
                <CardImg
                  key={worker.id}
                  className="card-img"
                  top
                  width="100%"
                  src={`${URL}${photoURL}`}
                  alt="Card image cap"
                />
                <CardBody>
                  <CardSubtitle>
                    {worker.fname} {worker.lname}
                  </CardSubtitle>
                  <CardText>{worker.jobTitle}</CardText>
                  <CardText>{worker.tagline}</CardText>
                  {/* Store id on state when the tip button is clicked to open modal */}
                  <Button
                    color="success"
                    size="lg"
                    type="button"
                    onClick={() => this.onOpenModal(worker.id)}
                    block
                  >
                    Leave Tip
                  </Button>
                </CardBody>
              </Card>
            );
          })}
          <div className="modal-container">
            <Modal
              className="modal"
              open={open}
              onClose={this.onCloseModal}
              center
            >
              <Form onSubmit={this.tipSubmitHandler}>
                <FormText className="tip-amount-text">
                  Enter Tip Amount
                </FormText>
                <FormGroup>
                  <Input
                    className="tip-input-field"
                    bsSize="sm"
                    type="currency"
                    name="tip"
                    value={tip}
                    onChange={this.handleInput}
                  />
                  <Button className="tip-button" type="submit">
                    Process
                  </Button>
                </FormGroup>
              </Form>
            </Modal>
          </div>
        </div>
      </>
    );
  }
}

export default CustomerHomePage;
