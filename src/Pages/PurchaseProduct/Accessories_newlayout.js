import "./styles.scss";

import { Button, Col, DatePicker, Input, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Grid from "@mui/material/Grid";
import LocationIcon from "../../assets/locationIcon.png";
import { SearchIcon } from "./../../Icons";
import { getAllStores } from "../../redux/actions/purchaseProducts";

const { RangePicker } = DatePicker;

let Accessories = ({ ExploreHandler }) => {
  const dispatch = useDispatch();

  let [search, setSearch] = useState("");
  const stores = useSelector((state) => state?.purchaseProducts?.stores);
  const [data, setData] = useState(stores);
  const [dataFilter, setFilterData] = useState(stores);
  const [loading, setLoading] = useState(false);
  
  const searchByName = (name) => {
    if (name !== "") {
      const res = data.filter((sd) => {
        return sd.name.toString().includes(name);
      });
      setData(res);
    } else {
      setData(dataFilter);
    }
  };

  const searchByCity = (name) => {
    if (name !== "") {
      const res = data.filter((sd) => {
        return sd.city.toString().includes(name);
      });
      setData(res);
    } else {
      setData(dataFilter);
    }
  };

  const searchByCountry = (name) => {
    if (name !== "") {
      const res = data.filter((sd) => {
        return sd.country.toString().includes(name);
      });
      setData(res);
    } else {
      setData(dataFilter);
    }
  };

  
  const columns = [
    {
      title: "Store Name",
      dataIndex: "name",
      key: "name",
      render: (_, data) => <p>{data && data.name}</p>,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (_, data) => <p>{data && data.address}</p>,
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
      render: (_, data) => <p>{data && data?.city}</p>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (_, data) => <p>{data.description && data.description}</p>,
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      render: (_, data) => <p>{data.country && data.country}</p>,
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "action",
      render: (_, data) =>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Button
              onClick={() => ExploreHandler(data._id)}
              className="_purchase_explore_btn"
              type="primary"
            >
              Explore Now
            </Button>
          </div>
    },
  ];

  useEffect(() => {
    stores || dispatch(getAllStores(setLoading));
  }, []);
  return (
    <div className="_purchase_container">
      <h1 className="_purchase_heading">Accessories</h1>
          <Grid container spacing={2}>
            <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
              <div>
                <p>Search By Store Name</p>
                <Input
                  onChange={(e) => {
                    searchByName(e.target.value);
                  }}
                  className="_invite_friends_input"
                  placeholder="Search By Store Name"
                />
              </div>
            </Grid>
            <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
              <div>
                <p>Search By City</p>
                <Input
                  onChange={(e) => {
                    searchByCity(e.target.value);
                  }}
                  className="_invite_friends_input"
                  placeholder="Search By City"
                />
              </div>
            </Grid>
            <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
              <div>
                <p>Search By Country</p>
                <Input
                  onChange={(e) => {
                    searchByCountry(e.target.value);
                  }}
                  className="_invite_friends_input"
                  placeholder="Search By Country"
                />
              </div>
            </Grid>
          </Grid>
        {
          data && data != false && data !== undefined &&
              <div className="table-container">
                <Table
                  scroll={{ x: true }}
                  loading={loading}
                  columns={columns}
                  dataSource={data}
                />
            </div>
        }
    </div>
  );
};
export default Accessories;
