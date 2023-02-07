import { Col, DatePicker, Input, Modal, Row, Table, Tag } from "antd";
import { DeleteFilled, EyeFilled } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { deleteService, get, patch } from "../../services/RestService";
import { openNotification, options } from "../../helpers";

import { Button } from "antd";
import Grid from "@mui/material/Grid";
import { useHistory } from "react-router-dom";

import DownloadExcel from "../../services/DownloadExcel";

const { RangePicker } = DatePicker;

const Notifications = () => {
  const [data, setData] = useState([]);
  const [dataFilter, setFilterData] = useState([]);
  const [userData, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [viewModal, setViewModal] = useState(false);
  const history = useHistory();


  //download notification data convert excel file
  const downloadNotification = () => {
    let downloadData = [];
    data.map((item) => {
      downloadData.push({
        title: item?.title,
        from: item?.from?.firstName + " " + item?.from?.lastName,
        createdAt: item?.createdAt,
        status: item?.status,
        usertype: item?.from?.role,
      });
    });
    DownloadExcel(JSON.stringify(downloadData), "Notification", "Notification");
  };




  const searchByName = (name) => {
    if (name !== "") {
      const res = data.filter((sd) => {
        if (sd && sd.title && sd.title !== undefined && sd.title != "") {
          return sd.title.toString().includes(name);
        }
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

  const getData = () => {
    setLoading(true);
    get("/notifications", options)
      .then((data) => {
        setData(data.result);
        setFilterData(data.result);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const readNotification = (id) => {
    const data = {
      status: "read",
    };
    patch(`/notifications/${id}`, data, options)
      .then((data) => {
        if (data.status) {
          getData();
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const deleteNotification = (id) => {
    setLoading(true);
    const formData = new FormData();
    deleteService(`/notifications/${id}`, formData, options)
      .then((data) => {
        if (data.status) {
          openNotification("Deleted Successfully");
          getData();
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (_, data) => (
        <p
          classname="_notifications_tile"
          onClick={() => redirecttNotify(data.type)}
        >
          {data?.title}
        </p>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (_, data) => (
        <p>{data.createdAt && data?.createdAt?.substring(0, 10)}</p>
      ),
    },
    {
      title: "From",
      dataIndex: "from",
      key: "from",
      render: (_, data) => (
        <p>
          {data?.from?.firstName} {data?.from?.lastName}
        </p>
      ),
    },
    {
      title: "User Type",
      dataIndex: "userType",
      key: "from",
      render: (_, data) => <p>{data?.from?.role}</p>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, data) => (
        <Tag className="status_indicator" color={data?.status == "unread" ? "red" : data?.status == "read" ? "green" : "yellow"}>{data?.status}</Tag>
      ),
      filters: [
        {
          text: "Read",
          value: "read",
        },
        {
          text: "UnRead",
          value: "unread",
        },
      ],
      onFilter: (value, data) => data.status === value,
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "action",
      render: (_, data) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <EyeFilled
            onClick={() => {
              readNotification(data?._id);
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
          <DeleteFilled
            onClick={() => {
              deleteNotification(data._id);
            }}
            style={{ color: "grey", cursor: "pointer", fontSize: 25 }}
          />
        </div>
      ),
    },
  ];

  const redirecttNotify = (type) => {
    if (type === "product") {
      history.push("/products");
    }
    if (type === "service") {
      history.push("/services");
    }
    if (type === "promotion") {
      history.push("/promotions");
    }
    if (type === "booking") {
      history.push("/jobs");
    }
    if (type === "contactRequest") {
      history.push("/contact-request");
    }
    if (type === "transaction") {
      history.push("/transaction-history");
    }
    if (type === "vendor") {
      history.push("/vendors");
    }
    if (type === "customer") {
      history.push("/customers");
    }
  };
  

  return (
    <div id="users" style={{ padding: 30 }}>
      <div className="users-wrapper">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1>Notifications</h1>
          <div>
            <Button type="primary"
            onClick={downloadNotification}
            >Download</Button>
          </div>
        </div>

        <div style={{ marginTop: 30 }}>
          <Grid container spacing={2}>
            <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
              <div>
                <p>Search by Title</p>
                <Input
                  className="_invite_friends_input"
                  onChange={(e) => {
                    searchByName(e.target.value);
                  }}
                  placeholder="Search By Title"
                />
              </div>
            </Grid>
            <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
              <div>
                <p>Search by Date</p>
                <RangePicker
                  className="_invite_friends_input"
                  style={{ width: "100%" }}
                  onChange={(e, d) => searchByDate(d)}
                />
              </div>
            </Grid>
          </Grid>
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
      <Modal
        footer={false}
        title="View Notification"
        okText="Done"
        visible={viewModal}
        onCancel={() => setViewModal(false)}
        onOk={() => {
          setViewModal(false);
        }}
      >
        <div>
          {/* <center><Image style={{ width: 100 , height: 100, marginBottom: 30}} src={userData?.imagePath} /></center> */}
          <Row gutter={[10, 10]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <b>
                <p>Created At</p>
              </b>
              <p>{userData?.createdAt?.substring(0, 10)}</p>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <b>
                <p>Title</p>
              </b>
              <p>{userData?.title}</p>
            </Col>
          </Row>
          <Row gutter={[10, 10]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <b>
                <p>From</p>
              </b>
              <p>
                {userData?.from?.firstName} {userData?.from?.lastName}
              </p>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <b>
                <p>UserType</p>
              </b>
              <p>{userData?.from?.role}</p>
            </Col>
          </Row>
          <Row gutter={[10, 10]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <b>
                <p>Status</p>
              </b>
              <p>{userData?.status}</p>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <b>
                <p>Country</p>
              </b>
              <p>{userData?.country}</p>
            </Col>
          </Row>
          {(userData?.type == "estimation" || userData?.type == "estimationOffer" || userData?.type == "booking" || userData?.type == "promotion") &&
            <Row gutter={[10, 10]}>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <div className="_create_estimation_btn">
                  <Button
                    type="primary"
                    onClick={() => {
                      history.push(
                        userData?.type == "estimation" || userData?.type == "estimationOffer" || userData?.type == "booking" ?
                          { pathname: "/serviceBookings", state: { id: userData?.target, path: userData?.type } }
                          : userData?.type == "promotion" ?
                            { pathname: "/offers", state: { id: userData?.target } }
                            : null
                      );
                    }}
                  >
                    {userData?.type == "estimation" || userData?.type == "estimationOffer" || userData?.type == "booking" ? "Go To Bookings" : userData?.type == "promotion" ? "Go To Promotion" : null}
                  </Button>
                </div>
              </Col>
            </Row>
          }
        </div>
      </Modal>
    </div>
  );
};

export default Notifications;
