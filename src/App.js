import React, { Component } from "react";
import "./App.css";
import Map from "./Components/Map";
import Marker from "./Components/Marker";

class App extends Component {
  render() {
    return (
      <div>
        <Map>
          <Marker
            id="myLocation"
            message="This is a placeholder message"
            coords={[24.9383, 60.1691]}
            color="blue"
          />
          <Marker
            id="anotherLocation"
            coords={[13.339826, 52.488932]}
            color="orange"
          />
        </Map>
      </div>
    );
  }
}

export default App;
