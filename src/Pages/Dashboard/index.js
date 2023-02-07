import "./styles.scss";

import { Card, Col, DatePicker, Row, Select, Spin } from "antd";
import React, { useEffect, useState } from "react";
import {
  getBookings,
  getDashboardStatistics,
  getTotalEarning,
  getTransactionStats,
} from "../../redux/actions/dashboard";
import { useDispatch, useSelector } from "react-redux";

import Calendar from "react-calendar";
import EarningGraph from "../../Components/EarningGraph";
import Geocode from "react-geocode";
import GoogleMapReact from "google-map-react";
import { MAPS_API_KEY } from "../../constants";
import Pin from "../../assets/placeholder.png";
//import PureComponent from "../../Components/PureComponent";
import ProductPerformance from "../../Components/ProductPerformance";
import StatCard from "../../Components/StatCard";
import bookingIcon from "../../assets/booking.png";
import { getUserProfileData } from "../../redux/actions/profile";
import graphIcon from "../../assets/graph.png";
import moment from "moment";
import { useHistory } from "react-router-dom";

// ? Add root classes  for dashboard
const rootClass = ["dashboard_right_side", "dashboard_left_side"];
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

const Dashboard = () => {
  Geocode.setApiKey(MAPS_API_KEY);
  const history = useHistory();
  const dispatch = useDispatch();
  const { Option } = Select;
  const earningGraphData = useSelector(
    (state) => state?.dashboard?.earningStats
  );
  const servicePerformanceData = useSelector(
    (state) => state?.dashboard?.servicePerformanceStats
  );

  const currentUser = useSelector((state) => state?.profile?.user);
  const userStats = useSelector((state) => state?.dashboard?.stats);
  const bookings = useSelector((state) => state?.dashboard?.upComingBookings);
  const totalEarnings = useSelector((state) => state?.dashboard?.totalEarning);
  const [coordinates, setCoordinates] = useState([]);
  const [loadingGraph, setLoadingGraph] = useState({
    earning: false,
    servicePerformance: false,
  });
  const [customOptionSelected, setCustomOptionSelected] = useState({
    graph: "",
    value: false,
  });

  const value = new Date();
  const statusData = [
    { id: 3, title: "Monthly" },
    { id: 1, title: "Daily" },
    { id: 2, title: "Weekly" },
    { id: 4, title: "Custom Date Range" },
  ];

  const { RangePicker } = DatePicker;

  useEffect(() => {
    if (!userStats) {
      const startDate = formattedDate(new Date(Date.now() + 3600 * 1000 * 24));
      const endDate = formattedDate(
        new Date(
          new Date(new Date(Date.now() + 3600 * 1000 * 24)).getTime() -
            30 * 86400000
        )
      );

      dispatch(getUserProfileData());
      dispatch(getBookings());
      dispatch(getDashboardStatistics());
      dispatch(getTransactionStats("earning", startDate, endDate));
      dispatch(getTransactionStats("servicePerformance", startDate, endDate));
      dispatch(getTotalEarning());
    }
  }, []);

  useEffect(() => {
    if (currentUser?.country) {
      let locations = currentUser?.country?.concat(
        currentUser?.cities,
        currentUser?.states
      );
      locations?.forEach((location) => {
        Geocode.fromAddress(location).then((response) => {
          const { lat, lng } = response.results[0].geometry.location;
          setCoordinates((prev) => [...prev, { lat, lng }]);
        });
      });
    }
  }, [currentUser]);

  const onDateChange = (e) => {
    // var newDate = moment(e).format("LL");
    // var result = [];
    // result = allBooking.filter((x) => {
    //   return x.order.some((val) => formatDate(val.date) == newDate);
    // });
    // setBookings(result);
  };

  const formattedDate = (date) => {
    let dd = String(date.getDate()).padStart(2, "0");
    let mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
    let yyyy = date.getFullYear();
    const newDate = yyyy + "-" + mm + "-" + dd;
    return newDate;
  };

  const setEarningStatsDate = (value, graph) => {
    if (value === "Custom Date Range") {
      setCustomOptionSelected({ graph: graph, value: true });
      return;
    }
    setCustomOptionSelected({ graph: graph, value: false });
    const today = new Date();
    const startDate = formattedDate(today);
    const days = value === "Daily" ? 1 : value === "Weekly" ? 7 : 30;
    const endDate = formattedDate(new Date(today.getTime() - days * 86400000));
    dispatch(getTransactionStats(graph, startDate, endDate, setLoadingGraph));
  };

  const setCustomDateRange = (event, dates) => {
    dates[0].length > 0 &&
      dispatch(
        getTransactionStats("earning", dates[0], dates[1], setLoadingGraph)
      );
  };
  const setCustomDateRangeService = (event, dates) => {
    dates[0].length > 0 &&
      dispatch(
        getTransactionStats(
          "servicePerformance",
          dates[0],
          dates[1],
          setLoadingGraph
        )
      );
  };

  const goToBooking = (booking) => {
    history.push({ pathname: "/jobs", state: { id: booking._id } });
  };

  return (
    <>
      <div className="dashboard flex">
        <div className="left-side flex">
          <div className={`${rootClass[0]}_main map-blcok`}>
            {coordinates[0] && (
              <GoogleMapReact
                bootstrapURLKeys={{
                  key: "AIzaSyA_jzgsNBD9FklOoEVmmdAH9nufXVgqQIE",
                }}
                defaultCenter={{
                  lat: coordinates[0].lat,
                  lng: coordinates[0].lng,
                }}
                defaultZoom={7}
              >
                {coordinates?.map((data) => {
                  return (
                    <AnyReactComponent
                      lat={data.lat}
                      lng={data.lng}
                      text={Pin}
                    />
                  );
                })}
              </GoogleMapReact>
            )}
            <div className={`${rootClass[0]}_statistics total-earning-block`}>
              <Row gutter={24}>
                <Col
                  style={{
                    padding: "0em",
                  }}
                  className="gutter-row"
                  span={12}
                >
                  <Card
                    style={{
                      color: "#9D441C",
                      background: "#FDEFE3",
                    }}
                    bodyStyle={{ padding: "0.9em" }}
                  >
                    <div>
                      <StatCard
                        icon={graphIcon}
                        title="Total Earning"
                        number={`$${!totalEarnings ? 0 : totalEarnings}`}
                      />
                    </div>
                  </Card>
                </Col>
                <Col className="gutter-row" span={12}>
                  <Card
                    style={{
                      color: "#6C3477",
                      background: "#F8DBFF",
                    }}
                    bodyStyle={{ padding: "0.9em" }}
                  >
                    <div>
                      <StatCard
                        icon={bookingIcon}
                        title="Total Booking"
                        number={userStats?.bookings ? userStats?.bookings : 0}
                      />
                    </div>
                  </Card>
                </Col>
              </Row>
            </div>
            <div className="earning-graph flex flex-col">
              <div className="grap-head flex aic">
                <h1 className="left-s flex" style={{ fontSize: "20px" }}>
                  Earning
                </h1>
                <div className="right-s flex">
                  {customOptionSelected.graph === "earning" &&
                    customOptionSelected.value && (
                      <RangePicker
                        style={{ width: "100%", marginRight: "30px" }}
                        onChange={setCustomDateRange}
                      />
                    )}
                  <Select
                    size={"medium"}
                    style={{ width: 180 }}
                    defaultValue={statusData[0].title}
                    onChange={(value) => setEarningStatsDate(value, "earning")}
                  >
                    {statusData.map((value, index) => (
                      <Option key={index} value={value.title}>
                        {value.title}
                      </Option>
                    ))}
                  </Select>
                </div>
              </div>
              {loadingGraph.earning ? (
                <div
                  style={{
                    display: "flex",
                    height: "350px",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Spin size="large" />
                </div>
              ) : (
                <div style={{ width: "100%" }}>
                  <EarningGraph data={earningGraphData} />
                </div>
              )}
            </div>
            <div className="progress-chart flex flex-col">
              <div className="grap-head flex aic">
                <h1 className="left-s flex service-performance-text">
                  Service perfomance
                </h1>
                {customOptionSelected.graph === "servicePerformance" &&
                  customOptionSelected.value && (
                    <RangePicker
                      className="range-picker"
                      onChange={setCustomDateRangeService}
                    />
                  )}
                <Select
                  className="date-range-select"
                  size={"medium"}
                  defaultValue={statusData[0].title}
                  onChange={(value) =>
                    setEarningStatsDate(value, "servicePerformance")
                  }
                >
                  {statusData.map((value, index) => (
                    <Option key={index} value={value.title}>
                      {value.title}
                    </Option>
                  ))}
                </Select>
              </div>
              {loadingGraph.servicePerformance ? (
                <div className="service-performance-graph-loader">
                  <Spin size="large" />
                </div>
              ) : (
                <ProductPerformance data={servicePerformanceData} />
              )}
            </div>
          </div>
        </div>

        <div className="right-side flex flex-col aic" style={{ width: "50%" }}>
          <div>
            <Calendar onChange={(e) => onDateChange(e)} value={value} />
          </div>
          <div className="status-order flex flex-col">
            <div className="status-header flex aic">
              <h1 className={`${rootClass[0]}_heading`}>Upcoming</h1>
              {bookings?.length > 0 && (
                <div
                  className="see-all s18 font b5"
                  onClick={() => history.push("/jobs")}
                >
                  See All
                </div>
              )}
            </div>
            {bookings && bookings.length > 0 ? (
              bookings.slice(0, 5).map((booking) => (
                <>
                  <div
                    onClick={() => goToBooking(booking)}
                    className={`order-item flex aic anim ${
                      booking.status === "pending"
                        ? "pending"
                        : booking.status === "booked"
                        ? "process"
                        : "reject"
                    }`}
                  >
                    <div className="item-left flex flex-col">
                      <div className="tag s14 font b6">
                        ORDER STATUS:
                        <span className="tag-s b4">{booking.status}</span>
                      </div>
                      <div className="no-prd s13 font b6 c444">
                        TOTAL NO. OF PRODUCTS:
                        <span className="num b4 font c444">
                          {booking.items?.length}
                        </span>
                      </div>
                    </div>
                    <div className="item-right flex flex-col">
                      <div className="date s14 font b6 c444">
                        {booking?.createdAt?.substring(0, 10)}
                      </div>
                      <div className="time s13 font b6 c444">06:00 - 07:30</div>
                    </div>
                  </div>
                </>
              ))
            ) : (
              <div> You have no Upcoming Bookings</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
