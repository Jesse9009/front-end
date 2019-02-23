import React, { Component } from "react";
import Navigation from "./components/Navigation";
import { Route } from "react-router-dom";

import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import WorkerDashboard from "./components/WorkerDashboard";
import CustomerHomePage from "./components/CustomerHomePage";

class App extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true
    };
  }

  componentDidMount() {
    this.setState({ isLoading: false });
  }

  render() {
    if (this.state.isLoading) {
      return <div>Loading...</div>;
    }
    return (
      <div className="App">
        <Navigation />
        <Route exact path="/" render={props => <Home {...props} />} />
        <Route exact path="/login" render={props => <Login {...props} />} />
        <Route exact path="/register" component={Register} />
        {localStorage.getItem("jwt") ? (
          <Route exact path="/dashboard" component={WorkerDashboard} />
        ) : null}
        {localStorage.getItem("jwt") ? (
          <Route path="/customer" component={CustomerHomePage} />
        ) : null}
      </div>
    );
  }
}

export default App;
