import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Select, Spin } from "antd";
import { countries } from "../../constants";
import { State, City } from "country-state-city";
import { CloseIcon, PlusIcon } from "../../Icons";
import { uploadUserPictures, createStore } from "../../redux/actions/profile";
import MapBox from "./ReactMapBox/MapBox";
import SelectPlace from "../SelectPlace";

const { Option } = Select;

const AddShowRoom = ({ userData, setLoading, setOpen2 }) => {
  const dispatch = useDispatch();
  const [storeName, setStoreName] = useState("");
  const [Img, setImg] = useState();
  const [picUrl, setPicUrl] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState();
  const [cities, setCities] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [states, setState] = useState([]);
  const [serviceRadius, setServiceRadius] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  // const [latLong, setLatLong] = useState({lat:"",lon:""});
  const [geoLocation, setGeoLocation] = useState({
    latitude: null,
    longitude: null,
  });

  const setCode = (e) => {
    setSelectedCountry(userData?.country[0]);
    const code = countries.find((x) => x.value === userData?.country[0]);
    const state = State.getStatesOfCountry(code.code);
    setSelectedState();
    setSelectedCities([]);
    setCities([]);
    setState(state);
  };

  const setLatLong = (e) => {
    setGeoLocation(() => {
      return { latitude: e.lat, longitude: e.lng };
    });
  };

  function handleStateChange(value) {
    setSelectedState(value);
    const cities = [];
    for (let i = 0; i < 1; i++) {
      for (let j = 0; j < states.length; j++) {
        if (value === states[j].name) {
          const city = City.getCitiesOfState(
            states[j].countryCode,
            states[j].isoCode
          );
          cities.push(...city);
        }
      }
    }
    setCities(cities);
  }

  function handleCityChanges(value) {
    setSelectedCities(value);
  }

  const store_data = {
    name: storeName,
    country: selectedCountry,
    state: selectedState,
    city: selectedCities,
    address: address,
    serviceRadius: serviceRadius,
    description: description,
    images: Img,
    geoLocation: geoLocation,
  };

  useEffect(() => {
    setCode();
  }, [userData]);

  return (
    <div className="edit-show-room flex">
      <div className="wrap flex flex-col">
        <div className="edit-show-room s18 font b5 flex aic jc-sb">
          <div>Add Workshop</div>
          <div className="close-icon pointer" onClick={(e) => setOpen2(false)}>
            <CloseIcon />
          </div>
        </div>
        <div className="edit-show-room flex flex-col">
          <MapBox
            currentLocation={geoLocation}
            setCurrentLocation={setGeoLocation}
          />
          <div className="txt-item flex flex-col">
            <div className="txt-lbl font">Store/Showroom name</div>
            <div className="txt-box flex">
              <input
                type="text"
                className="txt-input cleanbtn"
                onChange={(e) => setStoreName(e.target.value)}
              />
            </div>
          </div>
          <div className="flex">
            <div className="block-left flex flex-col">
              <div className="txt-item flex flex-col">
                <div className="txt-lbl font">Country</div>
                <div className="txt-box s16 font b4">
                  {userData?.country[0]}
                </div>
              </div>
              <div className="txt-item flex flex-col">
                <div className="txt-lbl font">City</div>
                <Select
                  style={{ width: "100%" }}
                  placeholder="select cities"
                  rules={[{ required: true, message: "Required" }]}
                  onChange={handleCityChanges}
                  value={selectedCities}
                  optionLabelProp="label"
                  size="large"
                >
                  {cities.map((city, index) => {
                    return (
                      <Option value={city.name} label={city.name} key={index}>
                        <div className="demo-option-label-item">
                          <span aria-label={city.name}>{city.name}</span>
                        </div>
                      </Option>
                    );
                  })}
                </Select>
              </div>
            </div>
            <div className="block-right flex flex-col">
              <div className="txt-item flex flex-col">
                <div className="txt-lbl font">State</div>
                <Select
                  style={{ width: "100%" }}
                  placeholder="select states"
                  rules={[{ required: true, message: "Required" }]}
                  onChange={handleStateChange}
                  value={selectedState}
                  optionLabelProp="label"
                  size="large"
                >
                  {states.map((state, index) => {
                    return (
                      <Option value={state.name} label={state.name} key={index}>
                        <div className="demo-option-label-item">
                          <span aria-label={state.name}>{state.name}</span>
                        </div>
                      </Option>
                    );
                  })}
                </Select>
              </div>
              <SelectPlace
                address={address}
                setAddress={setAddress}
                setLatLong={setLatLong}
              />
              {/* <div className="txt-item flex flex-col">
                <div className="txt-lbl font">Address</div>
                <div className="txt-box flex">
                  <input
                    type="text"
                    className="txt-input cleanbtn"
                    onChange={(e) => {
                      setAddress(e.target.value);
                    }}
                  />
                </div>
              </div> */}
            </div>
          </div>
          <div className="txt-item flex flex-col">
            <div className="txt-lbl font">Service Radius</div>
            <div className="txt-box flex">
              <input
                type="text"
                className="txt-input cleanbtn"
                placeholder="Enter your Service Radius in KM."
                onChange={(e) => {
                  setServiceRadius(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="txt-item flex flex-col">
            <div className="txt-lbl font">Descriptions</div>
            <div className="txt-box flex">
              <input
                type="text"
                className="txt-input cleanbtn"
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="txt-item flex flex-col">
            <div className="txt-lbl font">Latitude</div>
            <div className="txt-box flex">
              <input
                type="number"
                className="txt-input cleanbtn"
                disabled
                value={geoLocation.latitude}
                onChange={(e) => {
                  setGeoLocation((pre) => {
                    return { ...pre, latitude: e.target.value };
                  });
                }}
              />
            </div>
            <div className="txt-lbl font">Longitude</div>
            <div className="txt-box flex">
              <input
                type="number"
                className="txt-input cleanbtn"
                disabled
                value={geoLocation.longitude}
                onChange={(e) => {
                  setGeoLocation((pre) => {
                    return { ...pre, longitude: e.target.value };
                  });
                }}
              />
            </div>
          </div>
          <div className="add-img flex aic mt">
            {imageUploading ? (
              <div>
                <Spin />
              </div>
            ) : picUrl ? (
              <div className="s-i-v flex flex-col rel">
                <img src={picUrl} className="selected-img-view" alt="" />
                <div
                  className="cross-icon abs cfff"
                  onClick={() => {
                    setPicUrl(null);
                    setImg(null);
                  }}
                >
                  <CloseIcon />
                </div>
              </div>
            ) : (
              <div
                className="add-img-box flex flex-col aic jc"
                onClick={() =>
                  document.getElementById("upload_store_img").click()
                }
              >
                <div className="add-icon">
                  <PlusIcon />
                </div>
                <div className="add-img-lbl font">Add Image</div>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              title=""
              id="upload_store_img"
              className="select-file cleanbtn"
              name="myfile"
              onChange={(e) => {
                setPicUrl(URL.createObjectURL(e.target.files[0]));
                dispatch(
                  uploadUserPictures(
                    e.target.files[0],
                    undefined,
                    setPicUrl,
                    setImg,
                    undefined,
                    setImageUploading
                  )
                );
              }}
            />
          </div>
        </div>
        <div className="action flex">
          <button
            className={
              imageUploading
                ? "btn cleanbtn font s16 b4"
                : "btn cleanbtn button font s16 b4"
            }
            onClick={() => {
              dispatch(createStore(store_data, setLoading, setOpen2));
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddShowRoom;
