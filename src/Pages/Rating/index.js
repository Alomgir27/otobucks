import { Col, DatePicker, Input, Row, Table } from "antd";
import React, { useEffect, useState } from "react";
import { get, patch } from "../../services/RestService";
import { openNotification, openErrorNotification, options } from "../../helpers";
import { CloseIcon } from "../../Icons";
import ServiceRating from "@mui/material/Rating";
import { styled } from "@mui/material/styles";
import ProviderRating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';

import { Button } from "antd";
import { EyeFilled } from "@ant-design/icons";

const { RangePicker } = DatePicker;


const Rating = () => {
  const [data, setData] = useState([]);
  const [dataFilter, setFilterData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingData, setRatingData] = useState();
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [feedbackRating, setFeedBackRating] = useState(0)
  const [providerFeedBack, setProviderFeedBack] = useState("")

  const rateBack = () => {
    setLoading(true);
    const data = {
      ratingID: ratingData?._id,
      review: providerFeedBack,
      stars: feedbackRating
    };
    patch(`/ratings/booking/byProvider`, data, options)
      .then((data) => {
        openNotification("Rating Submit Successfully");
        getData();
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        openErrorNotification("Rating Submit Failed");
      });
  };

  const getData = () => {
    setRatingModalOpen(false)
    setRatingData()
    setFeedBackRating(0)
    setProviderFeedBack("")
    setLoading(true);
    get("/ratings", options)
      .then((data) => {
        setData(data.result);
        console.log(data.result)
        setFilterData(data.result);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  

  const StyledRating = styled(ServiceRating)({
    "& .MuiRating-iconFilled": {
      color: "#0E4A86",
    },
  });

  const columns = [
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (_, data) => <p>{data?.createdAt.substring(0, 10)}</p>,
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
      render: (_, data) => (
        <p>
          {data?.customer?.firstName} {data?.customer?.lastName}
        </p>
      ),
    },
    {
      title: "Vendor Name",
      dataIndex: "item",
      key: "item",
      render: (_, data) => (
        <p>{`${data?.provider?.firstName} ${data?.provider?.lastName}`}</p>
      ),
    },
    {
      title: "Service",
      dataIndex: "service",
      key: "service",
      render: (_, data) => <p>{data?.booking?.source?.title}</p>,
    },
    {
      title: "FeedBack",
      dataIndex: "feedback",
      key: "feedback",
      render: (_, data) => <p>{data?.customer_to_provider?.review ?? "-"}</p>,
    },
    {
      title: "Ratings",
      dataIndex: "ratings",
      key: "ratings",
      render: (_, data) => (
        <StyledRating
          defaultValue={data?.customer_to_provider?.stars}
          // size="large"
          color="blue"
          readOnly
        />
      ),
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "action",
      render: (_, data) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <EyeFilled
            onClick={() => {
              setRatingData(data);
              setFeedBackRating(data?.provider_to_customer?.stars)
              setProviderFeedBack(data?.provider_to_customer?.review)
              setRatingModalOpen(true);
            }}
            style={{
              color: "grey",
              cursor: "pointer",
              fontSize: 25,
              marginRight: 10,
            }}
          />
        </div>
      ),
    },
  ];

  const searchByName = (name) => {
    if (name !== "") {
      const res = data.filter((sd) => {
        return sd?.customer?.firstName?.toString().toLowerCase().includes(name);
      });
      setData(res);
    } else {
      setData(dataFilter);
    }
  };

  const searchByDate = (dates) => {
    if (dates[0] !== "" && dates[1] !== "") {
      const res = data.filter((sd) => {
        return (
          sd?.createdAt.substring(0, 10) >= dates[0] &&
          sd?.createdAt.substring(0, 10) <= dates[1]
        );
      });
      setData(res);
    } else {
      setData(dataFilter);
    }
  };

  const searchByRatings = (name) => {
    if (name !== "") {
      const res = data.filter((sd) => {
        return sd?.customer_to_provider?.stars.toString().includes(name);
      });
      setData(res);
    } else {
      setData(dataFilter);
    }
  };

  return ratingModalOpen ? (
    <div className="estimation-details-wrapper">
      <div className="dialog-box">
        <div className="estimation-details-container">
          <div className="estimation-details-heading">
            <div className="font s18 font b6">View Rating Details</div>
            <div
              className="close-button"
              onClick={() => setRatingModalOpen(false)}
            >
              <CloseIcon />
            </div>
          </div>
          <div className="_estimation_details">
            <div className="_field_container">
              <div className="_label_text">Rating date</div>
              <input
                readOnly
                value={ratingData?.createdAt?.substring(0, 10)}
                className="_field_value"
              />
              <div className="_label_text">Customer name</div>
              <input
                readOnly
                value={`${ratingData?.customer?.firstName} ${ratingData?.customer?.lastName}`}
                className="_field_value"
              />
            </div>
            <div className="_field_container">
              <div className="_label_text">Customer country</div>
              <input
                readOnly
                value={ratingData?.customer?.country}
                className="_field_value"
              />
              <div className="_label_text">FeedBack</div>
              <input
                readOnly
                value={ratingData?.customer_to_provider?.review}
                className="_field_value"
              />
            </div>
            <div className="_field_container">
              <div className="_label_text">Rating</div>
              <ServiceRating
                defaultValue={ratingData?.customer_to_provider?.stars}
                size="large"
                readOnly
              />
            </div>
          </div>
          <div className="rate_back_contianer">
            <div className="estimation-details-heading">
              <div className="font s18 font b6">Provider FeedBack</div>
            </div>
            <div className="_estimation_details">
              <div className="_field_container">
                <div className="_label_text">Rating</div>
                <ProviderRating
                  style={{ backgroundColor: "transparent", border: "none" }}
                  className="_field_value"
                  name="simple-controlled"
                  value={feedbackRating}
                  readOnly={ratingData?.provider_to_customer?.stars}
                  size="large"
                  onChange={(event, newValue) => {
                    setFeedBackRating(newValue);
                  }}
                />
                <div className="_label_text">FeedBack</div>
                <input
                  value={providerFeedBack}
                  disabled={ratingData?.provider_to_customer?.review}
                  className="_field_value"
                  onChange={(e) => setProviderFeedBack(e.target.value)}
                />
              </div>
              <div className="line_end">
                {
                  !ratingData?.provider_to_customer?.stars && !ratingData?.provider_to_customer?.review &&
                  <Button type="primary" onClick={rateBack}loading={loading} >Submit</Button>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div id="users" style={{ padding: 30 }}>
      <div className="users-wrapper">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1>Ratings</h1>
          <div>
            <Button type="primary">Download</Button>
          </div>
        </div>
        <div style={{ marginTop: 30 }}>
          <Row gutter={[10, 10]}>
            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
              <div>
                <p>Search by Customer</p>
                <Input
                  className="_invite_friends_input"
                  onChange={(e) => {
                    searchByName(e.target.value.toLowerCase());
                  }}
                  placeholder="Search By Customer"
                />
              </div>
            </Col>
            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
              <p>Search by Date</p>
              <RangePicker
                style={{ width: "100%" }}
                className="_invite_friends_input"
                onChange={(e, d) => searchByDate(d)}
              />
            </Col>
            <Col item xl={8} lg={8} md={8} sm={24} xs={24}>
              <div>
                <p>Search by Rating</p>
                <Input
                  className="_invite_friends_input"
                  onChange={(e) => {
                    searchByRatings(e.target.value);
                  }}
                  placeholder="Search By Rating"
                />
              </div>
            </Col>
          </Row>
        </div>
        <div style={{ marginTop: 30 }}>
          <Table
            scroll={{ x: true }}
            loading={loading}
            columns={columns}
            dataSource={data}
          />
        </div>
      </div>
    </div>
  );
};

export default Rating;
