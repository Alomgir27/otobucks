import React, { useState } from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

import "./style.css";

const SelectPlace = (props) => {
  //   handleChange = (address) => {
  //     setState({ address });
  //   };

  const handleSelect = (address) => {
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => props.setLatLong(latLng))
      .catch((error) => {
        alert("Map Error");
      });
    props.setAddress(address);
  };

  const handleChange = (e) => {
    props.setAddress(e);
  };

  return (
    <PlacesAutocomplete
      value={props.address}
      onChange={handleChange}
      onSelect={handleSelect}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div>
          <div className="txt-item flex flex-col">
            <div>
              {" "}
              <div className="txt-lbl font">Address</div>
              <div className="txt-box flex">
                <input
                  type="text"
                  {...getInputProps({
                    placeholder: "Search Places ...",
                    //   className: "location-search-input",
                    className: "txt-input cleanbtn",
                  })}
                />{" "}
              </div>
            </div>
          </div>
          <div className="autocomplete-dropdown-container">
            {loading && <div>Loading...</div>}
            {suggestions.map((suggestion) => {
              const className = suggestion.active
                ? "suggestion-item--active"
                : "suggestion-item";
              // inline style for demonstration purpose
              const style = suggestion.active
                ? { backgroundColor: "#fafafa", cursor: "pointer" }
                : { backgroundColor: "#ffffff", cursor: "pointer" };
              return (
                <div
                  {...getSuggestionItemProps(suggestion, {
                    className,
                    style,
                  })}
                >
                  <span>{suggestion.description}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </PlacesAutocomplete>
  );
};

export default SelectPlace;
