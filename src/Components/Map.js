import React from "react";
import mapboxGl from "mapbox-gl";

class Map extends React.Component {
  state = {
    map: null
  };

  componentDidMount() {
    mapboxGl.accessToken =
      "pk.eyJ1IjoicHlyeWthIiwiYSI6ImNqcmNjc3F5cTBqZ3U0YW1sN2U0NWdwaGEifQ.ObuMlu8asDW2CCOLDmf-Kg";
    const map = new mapboxGl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/mapbox/streets-v9",
      center: [24.9384, 60.185],
      zoom: 11
    });

    map.on("load", (...args) => {
      this.setState({ map });
    });
  }

  render() {
    const style = {
      height: "500px",
      width: "100%"
    };

    return (
      <div style={style} ref={x => (this.mapContainer = x)}>
        {this.state.map &&
          this.props.children &&
          React.Children.map(this.props.children, child =>
            React.cloneElement(child, {
              map: this.state.map
            })
          )}
      </div>
    );
  }
}

export default Map;