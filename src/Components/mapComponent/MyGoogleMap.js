// MyGoogleMaps.js
import React, { Component } from "react";
import { useDispatch, useSelector } from "react-redux";
import GoogleMapReact from "google-map-react";
import styled from "styled-components";

import AutoComplete from "./Autocomplete";
import Marker from "./Marker";

const Wrapper = styled.main`
  width: 100%;
  height: 50%;
`;

class MyGoogleMap extends Component {
  state = {
    mapApiLoaded: false,
    mapInstance: null,
    mapApi: null,
    geoCoder: null,
    places: [],
    center: [],
    zoom: 15,
    address:
      "52-A Sultanabad Near PNN News, Gulgasht Colony, Multan, Punjab, Pakistan",
    draggable: true,
    lat: 30.2188559,
    lng: 71.4702801,
  };

  componentWillMount() {
    this.setCurrentLocation();
  }

  onMarkerInteraction = (childKey, childProps, mouse) => {
    this.setState({
      draggable: false,
      lat: mouse.lat,
      lng: mouse.lng,
    });
  };
  onMarkerInteractionMouseUp = (childKey, childProps, mouse) => {
    this.setState({ draggable: true });
    this._generateAddress();
  };

  _onChange = ({ center, zoom }) => {
    this.setState({
      center: center,
      zoom: zoom,
    });
  };

  _onClick = (value) => {
    this.setState({
      lat: value.lat,
      lng: value.lng,
    });
  };

  apiHasLoaded = (map, maps) => {
    this.setState({
      mapApiLoaded: true,
      mapInstance: map,
      mapApi: maps,
    });

    this._generateAddress();
  };

  addPlace = (place) => {
    this.setState({
      places: [place],
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    });
    this._generateAddress();
  };

  _generateAddress() {
    const { mapApi } = this.state;

    const geocoder = new mapApi.Geocoder();

    geocoder.geocode(
      { location: { lat: this.state.lat, lng: this.state.lng } },
      (results, status) => {
        if (status === "OK") {
          if (results[0]) {
            this.zoom = 12;
            this.setState({ address: results[0].formatted_address });
          } else {
            window.alert("No results found");
          }
        } else {
          window.alert("Geocoder failed due to: " + status);
        }
      }
    );
  }

  // Get Current Location Coordinates
  setCurrentLocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.setState({
          center: [position.coords.latitude, position.coords.longitude],
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  }

  render() {
    const { places, mapApiLoaded, mapInstance, mapApi } = this.state;

    const { handleLog } = this.props;
    // handleLog(this.state.lat, this.state.lng, this.state.address)

    //Address lat and lng are stored in localStorage
    localStorage.setItem("currentAddress", this.state.address);
    localStorage.setItem("Latitude", this.state.lat);
    localStorage.setItem("Longitude", this.state.lng);

    return (
      <Wrapper className="map-1">
        {mapApiLoaded && (
          <div className="map-3">
            <AutoComplete
              className="map-4"
              map={mapInstance}
              mapApi={mapApi}
              addplace={this.addPlace}
            />
          </div>
        )}
        <div className="mapScreen">
          <GoogleMapReact
            className="map-2"
            center={this.state.center}
            zoom={this.state.zoom}
            draggable={this.state.draggable}
            onChange={this._onChange}
            onChildMouseDown={this.onMarkerInteraction}
            onChildMouseUp={this.onMarkerInteractionMouseUp}
            onChildMouseMove={this.onMarkerInteraction}
            onChildClick={() => {}}
            onClick={this._onClick}
            // style={{padding: '60px', overflow: 'hidden'}}
            bootstrapURLKeys={{
              // Google Map Key
              key: "AIzaSyA_jzgsNBD9FklOoEVmmdAH9nufXVgqQIE",
              libraries: ["places", "geometry"],
            }}
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({ map, maps }) => this.apiHasLoaded(map, maps)}
          >
            <Marker
              text={this.state.address}
              lat={this.state.lat}
              lng={this.state.lng}
            />
          </GoogleMapReact>
        </div>
        <div className="info-wrapper flex aic">
          {/* <div className="map-details">Latitude: <span>{this.state.lat}</span>, Longitude: <span>{this.state.lng}</span></div> */}
          {/* <div className="map-details">Zoom: <span>{this.state.zoom}</span></div> */}
          {/* <div className="map-details">Address: <span className='s14 c666 font'>{this.state.address}</span></div> */}
          {/* <div className='button cleanbtn anim cfff s12 s6 font'>Confirm Address</div> */}
        </div>
      </Wrapper>
    );
  }
}

export default MyGoogleMap;
