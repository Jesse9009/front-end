import React, { Component } from 'react';
import Axios from 'axios';
import jwt_decode from 'jwt-decode';
import {
  Form,
  Input,
  Button,
  FormGroup,
  Label,
  Modal,
  ModalBody
} from 'reactstrap';
import { Redirect } from 'react-router-dom';

import '../App.css';

class WorkerDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      photo: '',
      fname: '',
      lname: '',
      jobTitle: '',
      tagline: '',
      totalTips: null,
      selectedFile: null,
      deleted: false,
      modal: false,
      updateModal: false,
      deleteModal: false,
      backdrop: true,
      // infoChanged: false,
      wantToUpdate: false
    };
  }

  componentDidMount() {
    this.refresh();
  }

  refresh = () => {
    const token = localStorage.getItem('jwt');
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
          photo: photo || '',
          fname,
          lname,
          jobTitle,
          tagline,
          totalTips,
          selectedFile: null
        });
      })
      .catch(err => console.log('Dashboard error:', err));
  };

  deleteAccount = e => {
    // Axios.delete(`http://localhost:3333/api/worker/delete/${id}`)
    const token = localStorage.getItem('jwt');
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
        localStorage.removeItem('jwt');
        this.toggleDelete();
        // this.setState({ deleted: true });
      })
      .catch(err => console.log(err));
  };

  toggleDelete = () => {
    this.setState({
      deleteModal: !this.state.deleteModal,
      modal: !this.state.modal
    });
  };

  redirectToRegister = () => {
    this.setState({
      deleteModal: !this.state.deleteModal,
      deleted: true
    });
  };

  updateAccount = e => {
    e.preventDefault();
    const token = localStorage.getItem('jwt');
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
        if (response.data.message === 'Profile was updated successfully') {
          this.updateToggle();
          this.refresh();
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  handleInput = async e => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value, infoChanged: true });
  };

  // handleChange(selectorFiles: FileList) {
  //   console.log(selectorFiles);
  // }

  fileSelectedHandler = e => {
    const files = e.target.files;

    this.setState({ selectedFile: files[0] });
  };

  uploadPhoto = e => {
    e.preventDefault();
    console.log('Photo in state: ', this.state.photo);
    const token = localStorage.getItem('jwt');
    const options = {
      headers: {
        Authorization: token
      }
    };
    const fd = new FormData();
    console.log(
      'file in state being appended to fd: ',
      this.state.selectedFile
    );
    fd.append('profilePic', this.state.selectedFile);
    console.log('form data being sent in axios: ', fd);
    const { id } = this.state;

    // Axios.post(`http://localhost:3333/upload/${id}`, fd, options)
    Axios.post(`https://tipease-server.herokuapp.com/upload/${id}`, fd, options)
      .then(response => {
        console.log('axios response', response);
        this.refresh();
      })
      .catch(err => {
        console.log('Upload error');
      });
  };

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  };

  updateToggle = () => {
    this.setState({
      updateModal: !this.state.updateModal,
      wantToUpdate: false
    });
  };

  allowUpdate = () => {
    this.setState({
      wantToUpdate: !this.state.wantToUpdate
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
    const URL = 'https://tipease-server.herokuapp.com';
    // const URL = "http://localhost:3333";
    const photoURL = photo.slice(6);
    console.log(URL, photoURL);
    return (
      <div className="worker-dashboard">
        <h3
          style={{ textAlign: 'center', color: 'snow', marginBottom: '20px' }}
        >
          Welcome to your dashboard, {fname}!
        </h3>
        <Form
          className="worker-dashboard-form"
          // onSubmit={this.updateAccount}
          style={{
            backgroundColor: 'white',
            boxShadow: '0 0 10px snow',
            border: '1px solid #333'
          }}
        >
          <img
            src={`${URL}${photoURL}`}
            style={{
              display: 'block',
              margin: '0 auto',
              borderRadius: '50%',
              width: '50%'
            }}
            alt="a pic"
          />
          {/*<h6>{photo}</h6>*/}
          <FormGroup>
            <Label for="fname-input">First Name</Label>
            <Input
              disabled={!this.state.wantToUpdate}
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
              disabled={!this.state.wantToUpdate}
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
              disabled={!this.state.wantToUpdate}
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
              disabled={!this.state.wantToUpdate}
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
              <Button
                type="submit"
                disabled={
                  this.state.selectedFile === null ||
                  this.state.selectedFile === undefined
                }
                color={
                  this.state.selectedFile === null ||
                  this.state.selectedFile === undefined
                    ? 'danger'
                    : 'success'
                }
                // hidden={
                //   this.state.selectedFile === null ||
                //   this.state.selectedFile === undefined
                // }
              >
                Upload Photo
              </Button>
            </Form>
          </FormGroup>
          {/*<FormGroup>
            <Label for="photo-input">Upload Image file</Label>
            <Input type="file" onChange={this.fileSelectedHandler} />
          </FormGroup>*/}
          <h3>Total Tips Recieved: ${totalTips || 0}</h3>
          <div className="worker-btns">
            <Button
              outline
              color="success"
              type="button"
              hidden={!this.state.wantToUpdate}
              onClick={this.updateAccount}
            >
              Submit Update
            </Button>
            <Button
              outline
              color="secondary"
              type="button"
              hidden={this.state.wantToUpdate}
              onClick={this.allowUpdate}
            >
              Update Information
            </Button>

            <Button outline color="danger" type="button" onClick={this.toggle}>
              Delete Profile
            </Button>
          </div>
        </Form>
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          className={this.props.className}
          backdrop={this.state.backdrop}
        >
          <ModalBody>
            <p>Are you sure you want to delete this account?</p>
            <div>
              <Button color="danger" onClick={this.deleteAccount}>
                Delete
              </Button>{' '}
              <Button color="primary" onClick={this.toggle}>
                No
              </Button>
            </div>
          </ModalBody>
        </Modal>
        <Modal
          isOpen={this.state.updateModal}
          toggle={this.updateToggle}
          className={this.props.className}
          backdrop={this.state.backdrop}
        >
          <ModalBody>
            <p>Update Successful</p>
          </ModalBody>
          <Button color="primary" className="okBtn" onClick={this.updateToggle}>
            Ok
          </Button>
        </Modal>
        <Modal
          isOpen={this.state.deleteModal}
          toggle={this.toggleDelete}
          backdrop={this.state.backdrop}
        >
          <ModalBody>
            <p>Delete Successful</p>
          </ModalBody>
          <Button
            color="primary"
            className="okBtn"
            onClick={this.redirectToRegister}
          >
            Ok
          </Button>
        </Modal>
      </div>
    );
  }
}

export default WorkerDashboard;
