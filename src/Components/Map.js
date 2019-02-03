import React from "react";
import mapboxGl from "mapbox-gl";
import axios from "axios";

class Map extends React.Component {
  state = {
    map: null,
    helsinkiArea: null,

    geojson: {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [24.9384, 60.161]
            },
            properties: {
              message: "Message placeholder"
            }
          },
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [24.9384, 60.1699]
            },
            properties: {
              message: "Message placeholder"
            }
          }
        ]
      }
    }
  };

  componentDidMount() {
    mapboxGl.accessToken =
      "pk.eyJ1IjoicHlyeWthIiwiYSI6ImNqcmNjc3F5cTBqZ3U0YW1sN2U0NWdwaGEifQ.ObuMlu8asDW2CCOLDmf-Kg";

    // axios
    //   .get("https://goecache-e75b9.firebaseio.com/markers.json")
    //   .then(res => {
    //     console.log(res);
    //     console.log(res.data);
    //     this.setState({ geojson: res.data });
    //   });

    axios
      .get("https://goecache-e75b9.firebaseio.com/helsinki.json")
      .then(res => {
        this.setState({ helsinkiArea: res.data });
      });

    const map = new mapboxGl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/mapbox/streets-v9",
      center: [24.9384, 60.185],
      zoom: 11
    });

    map.on("load", (...args) => {
      this.setState({ map });

      console.log(this.state.geojson);

      map.addSource("markers", this.state.geojson);
      console.log(this.state.helsinkiArea);
      map.addSource("helsinki", this.state.helsinkiArea);

      //Layer for the markers
      map.addLayer({
        id: "markers",
        type: "circle",
        source: "markers",
        paint: {
          "circle-radius": 10,
          "circle-color": "red"
        }
      });

      //Layer for Helsinki area
      map.addLayer({
        id: "helsinki-layer",
        type: "fill",
        source: this.state.helsinkiArea,
        paint: {
          "fill-color": "green",
          "fill-opacity": 0.15
        },
        filter: ["==", "$type", "Polygon"]
      });

      //Create the popup for showing messages
      const popup = new mapboxGl.Popup({
        closeButton: false,
        closeOnClick: false
      });

      //Take the coordinates from cursor and save to DB, only if pointer in helsinki-layer
      map.on("click", "helsinki-layer", function(e) {
        axios
          .post(
            "https://goecache-e75b9.firebaseio.com/markers/data/features.json",
            {
              type: "Feature",
              geometry: {
                coordinates: [e.lngLat],
                type: "Point"
              },
              properties: {
                message: "Placeholder"
              }
            }
          )
          .then(alert("Marker succesfully added"));
      });

      //Change cursor to pointer on mouse enter and show popup
      map.on("mouseenter", "markers", function(e) {
        map.getCanvas().style.cursor = "pointer";

        let coordinates = e.features[0].geometry.coordinates.slice();
        let message = e.features[0].properties.message;

        //if multiple features visible, show popup on the one that is poited at
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        popup
          .setLngLat(coordinates)
          .setHTML(message)
          .addTo(map);
      });

      //Change cursor back on mouse leave
      map.on("mouseleave", "markers", function() {
        map.getCanvas().style.cursor = "";
        popup.remove();
      });
    });
  }

  render() {
    const style = {
      height: "800px",
      width: "100%"
    };

    return (
      <div style={style} ref={x => (this.mapContainer = x)}>
        {this.state.map && this.props.children}
      </div>
    );
  }
}

export default Map;
