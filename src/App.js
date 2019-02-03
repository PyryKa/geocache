import React, { Component } from "react";
import "./App.css";
import Map from "./Components/Map";
import Header from "./Components/Header";

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <Map />
      </div>
    );
  }
}

export default App;
