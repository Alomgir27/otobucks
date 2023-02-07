import React, { useState, useEffect } from "react";

import GoogleMapReact from "google-map-react";
import { MAPS_API_KEY } from "../../../constants";

import LocationIcon from "../../../Icons/LocIcon";
import Pin from "../../../assets/placeholder.png";

import "./MapBox.scss";

const AnyReactComponent = ({ text }) => (
  <img
    src={text}
    alt=""
    srcset=""
    style={{ objectFit: "contain" }}
    width="30px"
    height="30px"
  />
);
export default function MapBox({ currentLocation, setCurrentLocation }) {
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(function (position) {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
    }
  };

  return (
    <div className="map_box_container">
      <GoogleMapReact
        bootstrapURLKeys={{
          key: MAPS_API_KEY,
        }}
        center={
          currentLocation
            ? {
                lat: currentLocation.latitude,
                lng: currentLocation.longitude,
              }
            : {
                lat: 25.276987,
                lng: 55.296249,
              }
        }
        defaultZoom={12}
      >
        {currentLocation && (
          <AnyReactComponent
            lat={currentLocation.latitude}
            lng={currentLocation.longitude}
            text={Pin}
          />
        )}
        {/* {coordinates?.map((data) => {
              return (
              );
            })} */}
      </GoogleMapReact>
      <div className="current_location_box" onClick={getCurrentLocation}>
        <LocationIcon />
      </div>
    </div>
  );
}
