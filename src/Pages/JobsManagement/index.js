import "./styles.scss";

import { Col, DatePicker, Input, Row, Select, Table, Tag, Button } from "antd";
import { EyeFilled } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";

import { Popover } from "antd";
import { downloadExcelFile, openNotification } from "../../helpers";
import { get } from "../../services/RestService";
import ViewDetailsModal from "./ViewDetailsModal";
import DisputeModal from "./DisputeModal";
import BookingDetailsModal from "./bookingDetails";

const { RangePicker } = DatePicker;
const { Option } = Select;

const Jobs = () => {
  let history = useHistory()

  const [data, setData] = useState([]);
  const [userData, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [viewModal, setViewModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const { state } = useLocation();

  const [filterData, setFilterData] = useState([]);
  const [searchValues, setSearchValues] = useState({
    customer: "",
    service: "",
    date: "",
    status: "",
  });
  const [disputeModal, setDisputeModal] = useState({
    open: false,
    id: null
  })
  const [reloadPage, setReloadPage] = useState(false)

  //Jwt Token
  const t = localStorage.getItem("token");
  const token = `Bearer ${t}`;
  var options = {
    headers: {
      Authorization: token,
    },
  };

  const [bookingDetails, setBookingDetails] = useState({});

  useEffect(() => {
    if (userData) {
      setBookingDetails({
        "Booking Date": userData?.bookingDetails?.date?.substring(0, 10),
        "Service Title":
          userData?.items && userData?.items[0]?.source?.title
            ? userData?.items[0]?.source?.title
            : userData?.bookingDetails?.serviceTitle,
        Customer: `${userData?.customer?.firstName} ${userData?.customer?.lastName}`,
        CustomerEmail: userData?.customer?.email,
        ServiceQuantity: userData?.estimate?.items ? userData.estimate?.items[0]?.quantity : "---",
        "Booking Price": userData?.estimate?.items ? userData.estimate?.items[0]?.amount : "---",
        ServiceFee: userData?.estimate?.serviceTax,
        Tax: userData?.estimate?.items ? userData?.estimate?.items[0]?.tax : "---",

        Address: !userData?.address ? "------" : userData?.address,
        Status: userData?.status,
        Source: userData?.source,
        PaymentMethod: userData?.paymentMethod
      })
    }
  }, [userData]);

  //Get  Details
  const getData = async () => {
    try {
      setLoading(true);
      let res = await get("/bookings", options);
      setData(res.result?.filter((booking) => booking?.itemType === "service"));
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const getBookingDetails = () => {
    setViewModal(true);
    setModalLoading(true);
    get(`/bookings/${state?.id}`, options)
      .then((response) => {
        setUser(response?.result);
        setModalLoading(false);
      }).catch(() => {
        openNotification("Failed to get booking details");
        setViewModal(false);
        setModalLoading(false);
      });
  };

  const handleSearch = (event) => {
    let { name, value } = event.target;
    setSearchValues({
      customer: "",
      service: "",
      date: "",
      status: "",
      [name]: value
    })
  };
  useEffect(() => {
    setFilterData(
      data?.filter((provider) => {
        return (
          (`${provider?.customer?.firstName} ${provider?.customer?.lastName}`
            .toLocaleLowerCase()
            .includes(searchValues.customer)) &&
          provider?.status
            ?.toLocaleLowerCase()
            ?.includes(searchValues.status) &&
          (provider?.items[0] ? provider?.items[0]?.source?.title : provider?.bookingDetails?.serviceTitle)
            ?.toLocaleLowerCase()
            ?.includes(searchValues.service) &&
          (!searchValues?.date[0] ||
            (provider?.createdAt.substring(0, 10) >= searchValues.date[0] &&
              provider?.createdAt.substring(0, 10) <= searchValues.date[1]))
        );
      })
    );
  }, [searchValues, data]);

  const goToDispute = (id) => {
    history.push({ pathname: "/disputes", state: { id } })
  }

  useEffect(() => {
    getData();
  }, [reloadPage]);

  useEffect(() => {
    if (state?.id) {
      getBookingDetails();
    }
  }, []);

  const columns = [
    {
      title: "Booking Date",
      dataIndex: "booking_date",
      key: "booking_date",
      render: (_, data) => <p>{data.createdAt?.substring(0, 10)}</p>,
    },
    {
      title: "Customer Name",
      dataIndex: "customer_name",
      key: "customer_name",
      render: (_, data) => (
        <p>
          {data?.customer?.firstName} {data?.customer?.lastName}
        </p>
      ),
    },
    {
      title: "Service Name",
      dataIndex: "Service_name",
      key: "Service_name",
      render: (_, data) => {
        return (
          <p>
            {data?.items && data?.items[0]?.source?.title
              ? data?.items[0]?.source?.title
              : data?.bookingDetails?.serviceTitle}
          </p>
        );
      },
    },
    {
      title: "Total Amount",
      dataIndex: "t_amount",
      key: "t_amount",
      render: (_, data) => <p>{data.totalprice}</p>,
    },
    {
      title: "Amount Paid",
      dataIndex: "price",
      key: "price",
      render: (_, data) => <p>{data?.paymentCompleted}</p>,
    },
    {
      title: "Balance Amount",
      dataIndex: "price",
      key: "price",
      render: (_, data) => <p>{data?.totalprice - data?.paymentCompleted}</p>,
    },
    {
      title: "Booking Status",
      dataIndex: "status",
      key: "status",
      render: (_, data) => <Tag className="status_indicator" color={data?.status == "completed" ? "green" : data?.status == "pending" ? "yellow" : data?.status == "partialPaid" ? "blue" : "red"}>{data?.status}</Tag>,
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "action",
      render: (_, data) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <EyeFilled
            onClick={() => {
              setUser(data);
              setViewModal(true);
            }}
            style={{
              color: "grey",
              cursor: "pointer",
              fontSize: 25,
              marginRight: 10,
            }}
          />
          {
            data?.status == "pending" ?
              <Popover content={"The Booking is in Pending"}>
                <div className="action_box" style={{ cursor: "not-allowed" }}> Create Dispute </div>
              </Popover>
              :
              data?.status == "cancelled" ?
                <Popover content={"The Booking was Canceled"}>
                  <div className="action_box" style={{ cursor: "not-allowed" }}> Create Dispute </div>
                </Popover>
                :
                (
                  data?.disputeStatus == true ?
                    <div className="action_box" onClick={() => goToDispute(data._id)}> Show Dispute </div>
                    :
                    <div className="action_box" onClick={() => setDisputeModal({ open: true, id: data._id })}> Create Dispute </div>
                )
          }
        </div>
      ),
    },
  ];

  return (
    <>
      {disputeModal.open && <DisputeModal modalData={disputeModal} setModalData={setDisputeModal} setReloadPage={setReloadPage} />}
      {
        viewModal ?
          <BookingDetailsModal
            selectedEstimation={userData?.estimate}
            setEstimationDetailsOpen={setViewModal}
          />
          :
          <div id="users" style={{ padding: 30 }}>
            <div className="users-wrapper">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h1>Bookings</h1>
                <div>
                  <Button
                    onClick={() => downloadExcelFile(data, "Bookings")}
                    type="primary"
                  >
                    Download
                  </Button>
                </div>
              </div>

              <div style={{ marginTop: 30 }}>
                <Row gutter={[10, 10]}>
                  <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                    <div>
                      <h3>Search by Customer</h3>
                      <Input
                        name="customer"
                        value={searchValues.customer}
                        onChange={handleSearch}
                        placeholder="Search By Customer"
                      />
                    </div>
                  </Col>
                  <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                    <div>
                      <h3>Search by Service</h3>
                      <Input
                        name="service"
                        value={searchValues.service}
                        onChange={handleSearch}
                        placeholder="Search By Service"
                      />
                    </div>
                  </Col>
                  <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                    <h3>Search by Date</h3>
                    <RangePicker
                      style={{ width: "100%" }}
                      onChange={(e, d) => handleSearch({ target: { name: "date", value: d } })}
                    />
                  </Col>
                </Row>

                <div style={{ marginTop: 30 }}>
                  <Row gutter={[10, 10]}>
                    <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                      <div>
                        <h3>Search By Status</h3>
                        <Select
                          style={{ width: "100%" }}
                          value={searchValues.status}
                          onChange={(value) => handleSearch({ target: { name: "status", value: value } })}
                        >
                          <Option value="">All</Option>
                          <Option value="pending">Pending</Option>
                          <Option value="inprogress">InProgress</Option>
                          <Option value="partialpaid">PartialPaid</Option>
                          <Option value="booked">Booked</Option>
                          <Option value="completed">Completed</Option>
                          <Option value="cancelled">Cancelled</Option>
                        </Select>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>

              <div style={{ marginTop: 30 }}>
                <Table
                  scroll={{ x: true }}
                  loading={loading}
                  columns={columns}
                  dataSource={filterData}
                />
              </div>
            </div>
            {/* <ViewDetailsModal
              title="View Booking Details"
              profileImage={userData?.items && userData?.items[0]?.source?.image[0]}
              isViewDetailsOpen={viewModal}
              modalLoading={modalLoading}
              setIsViewDetails={setViewModal}
              data={bookingDetails}
              location={{ lat: 25, lng: 55 }}
              text_note={userData?.estimate?.note && userData?.estimate?.note[0]}
              bookingImage={userData?.estimate?.image && userData?.estimate?.image[0]}
              bookingVideo={userData?.estimate?.video && userData?.estimate?.video[0]}
              voice_note={
                userData?.estimate?.voice_note && userData?.estimate?.voice_note[0]
              }
            /> */}
          </div>
      }
    </>
  );
};

export default Jobs;