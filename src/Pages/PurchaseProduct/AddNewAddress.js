import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Input, Select } from "antd";
import Grid from "@mui/material/Grid";
import { State } from "country-state-city";
import { BackIcon } from "./../../Icons";
import { countries } from "../../constants";
import { openNotification } from "../../helpers";
import { getUserProfileData } from "../../redux/actions/profile";
import { post } from "../../services/RestService";
import "./styles.scss";

const { Option } = Select;

const AddNewAddress = ({ BackHandler }) => {
  const country = useSelector((state) => state?.profile?.user?.country);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUserProfileData());
  }, []);

  const [states, setState] = useState([]);
  const [address, setAddress] = useState("");
  const [selectedState, setSelectedState] = useState();

  const config = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };

  useEffect(() => {
    const code = countries.find((x) => x.value === country[0]);
    const state = State.getStatesOfCountry(code?.code);
    setState(state);
  }, [country]);

  async function handleAddNewAddress() {
    if (address === "") {
      openNotification("Please enter address");
    } else if (!selectedState) {
      openNotification("Please select state");
    } else {
      let data = {
        address,
        state: selectedState,
        country: country[0],
      };

      post(`/address`, data, config)
        .then(() => {
          openNotification("Address added successfully");
          document.getElementById("back_button").click();
        })
        .catch(() => openNotification("Failed to add address"));
    }
  }

  return (
    <div className="_purchase_container">
      <div className="_car_mart_header_main">
        <div className="_back_btn_main">
          <Button
            type="primary"
            className="_back_btn"
            id="back_button"
            onClick={BackHandler}
          >
            <BackIcon />
          </Button>
          <h1 className="_new_Address_heading">Add New Address</h1>
        </div>
      </div>
      <Grid container spacing={3}>
        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
          <Grid container spacing={3}>
            <Grid item xl={6} lg={6} md={12} sm={12} xs={12}>
              <p className="_new_add_title">Address</p>
              <Input
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Address"
                className="_new_address_title_input"
              />
            </Grid>
            <Grid item xl={3} lg={3} md={6} sm={12} xs={12}>
              <p className="_new_add_title">State</p>
              <Select
                showSearch
                size="large"
                style={{ width: "100%" }}
                placeholder="select states"
                rules={[{ required: true, message: "Required" }]}
                onChange={(value) => setSelectedState(value)}
                value={selectedState}
                optionLabelProp="label"
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
            </Grid>
            <Grid item xl={3} lg={3} md={6} sm={12} xs={12}>
              <p className="_new_add_title">Country</p>
              <Input
                readOnly
                value={country}
                className="_new_address_title_input"
              />
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xl={2} lg={4} md={6} sm={12} xs={12}>
              <Button
                className="_feedback_submit_btn"
                type="primary"
                onClick={() => handleAddNewAddress()}
              >
                Add Address
              </Button>
            </Grid>
            <Grid item xl={5} lg={4} md={3} sm={12} xs={12}></Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};
export default AddNewAddress;
