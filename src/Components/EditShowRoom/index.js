import "react-toastify/dist/ReactToastify.css";

import { City, State } from "country-state-city";
import { CloseIcon, PlusIcon } from "../../Icons";
import React, { useEffect, useState } from "react";
import { Select, Spin } from "antd";
import { countries, s3Client } from "../../constants";
import { get, patch } from "../../services/RestService";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSubCategories } from "../../redux/actions/profile";
import { getUserStores } from "../../redux/actions/profile";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import MapBox from "./ReactMapBox/MapBox";
import SelectPlace from "../SelectPlace";

toast.configure();

const { Option } = Select;

const EditShowRoom = ({ userData, setOpen4, storeId, setLoading }) => {
  const dispatch = useDispatch();
  const [storeName, setStoreName] = useState();
  const [Img, setImg] = useState();
  const [picUrl, setPicUrl] = useState();
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState();
  const [selectedCategoryId, setSelectedCategoryId] = useState();
  const [selectedState, setSelectedState] = useState();
  const [cities, setCities] = useState([]);
  const [selectedCities, setSelectedCities] = useState();
  const [states, setState] = useState([]);
  const [serviceRadius, setServiceRadius] = useState("");
  const [address, setAddress] = useState();
  const [description, setDescription] = useState();
  const [editStoreData, setEditStoreData] = useState();
  const [storeLoading, setStoreLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [geoLocation, setGeoLocation] = useState({
    latitude: "",
    longitude: "",
  });

  const config = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };

  useEffect(() => {
    apiCall1SingleStore(storeId);
  }, []);

  const apiCall1SingleStore = async (storeId) => {
    setStoreLoading(true);
    await get(`/stores/${storeId}`, config)
      .then((res) => {
        setEditStoreData(res.result);
        setStoreName(res.result?.name);
        setImg(res.result?.images[0]);
        setPicUrl(res.result?.images[0]);
        setSelectedState(res.result?.state);
        setSelectedCities(res.result?.city);
        setAddress(res.result?.address);
        setServiceRadius(res.result?.serviceRadius);
        setDescription(res.result?.description);
        setSelectedCategoryId(res?.result?.category);
        dispatch(getSubCategories(res?.result?.category));
        setSelectedSubCategoryId(res?.result?.subcategory);
        setGeoLocation(res?.result?.geoLocation);
        setStoreLoading(false);
      })
      .catch((err) => {});
  };

  const setCode = (e) => {
    setSelectedCountry(userData?.country[0]);
    const code = countries.find((x) => x.value === userData?.country[0]);
    const state = State.getStatesOfCountry(code.code);
    setCities([]);
    setState(state);
  };

  const setLatLong = (e) => {
    setGeoLocation(() => {
      return { latitude: e.lat, longitude: e.lng };
    });
  };

  // ? State MultiSelect Handler
  function handleStateChange(value) {
    setSelectedState(value ? value : editStoreData?.state);
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

  //Upload Cover Images on S3 Bucket
  async function uploadImages_S3(e) {
    try {
      setImageUploading(true);
      let imageName = `${uuidv4()}` + e.target.files[0].name;
      const options = {
        Key: imageName,
        Bucket: "cdn.carbucks.com",
        Body: e.target.files[0],
      };
      await s3Client.send(new PutObjectCommand(options));
      let s3CoverImageLink = `https://s3.amazonaws.com/cdn.carbucks.com/${imageName}`;
      setImageUploading(false);
      setImg(s3CoverImageLink);
    } catch (error) {
      setImageUploading(false);
    }
  }

  const udate_store = {
    name: storeName,
    country: selectedCountry,
    state: selectedState,
    city: selectedCities ? selectedState : editStoreData?.city,
    address: address,
    serviceRadius: serviceRadius,
    description: description,
    images: Img,
    category: selectedCategoryId,
    subcategory: selectedSubCategoryId,
    geoLocation: geoLocation,
  };
  async function update_store() {
    try {
      const res = await patch(`/stores/${editStoreData?._id}`, udate_store, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      if (res.status === "success") {
        dispatch(getUserStores(setLoading));
        setOpen4(false);
        toast.success(`${res.message}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      toast.error(`Error on Update Profile`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }
  React.useEffect(() => {
    setCode();
  }, [userData]);

  return (
    <div className="edit-show-room flex">
      {storeLoading ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "300px",
          }}
        >
          <Spin size="large" />
        </div>
      ) : (
        <div className="wrap flex flex-col">
          <div className="edit-show-room s18 font b5 flex aic jc-sb">
            <div>Edit Workshop</div>
            <div
              className="close-icon pointer"
              onClick={(e) => setOpen4(false)}
            >
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
                  value={storeName}
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
                    value={
                      selectedCities ? selectedCities : editStoreData?.city
                    }
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
                    value={selectedState ? selectedState : editStoreData?.state}
                    optionLabelProp="label"
                    size="large"
                  >
                    {states.map((state, index) => {
                      return (
                        <Option
                          value={state.name}
                          label={state.name}
                          key={index}
                        >
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
                      value={address}
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
                  value={serviceRadius}
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
                  value={description}
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
              <div className="edit-img flex aic">
                {imageUploading ? (
                  <div>
                    <Spin />
                  </div>
                ) : picUrl ? (
                  <div className="s-i-v flex flex-col rel">
                    <img
                      src={picUrl}
                      className="selected-img-view"
                      onChange={uploadImages_S3}
                      alt=""
                    />
                    <div
                      className="cross-icon abs cfff"
                      onClick={() => setPicUrl("")}
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
                    let file = e.target.files[0];
                    setImg(e.target.files[0]);
                    file && setPicUrl(URL.createObjectURL(file));
                    uploadImages_S3(e);
                  }}
                />
              </div>
            </div>
          </div>
          <div className="action flex">
            <button
              disabled={imageUploading}
              className={
                imageUploading
                  ? "btn cleanbtn font s16 b4"
                  : "btn cleanbtn button font s16 b4"
              }
              onClick={() => {
                update_store();
              }}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditShowRoom;
