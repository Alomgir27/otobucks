import { Button, Col, Input, Modal, Row, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { downloadExcelFile, openNotification, options } from "../../helpers";
import { get, patch } from "../../services/RestService";

import FormTextarea from "../../Components/FormTextarea";

const CancelBookingRequest = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [id, setId] = useState();
  const [approve, setApprove] = useState();
  const [remarks, setRemarks] = useState();
  const [viewModal, setViewModal] = useState();

  const searchData =
    (data &&
      data.filter(
        (sd) =>
          sd?.student?.firstName?.toString().includes(search) ||
          sd?.student?.lastname?.toString().includes(search)
      )) ||
    [];

  const getData = () => {
    setLoading(true);
    get("/admin/getAllCourseCancelReqs", options)
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const updateRequest = () => {
    const formData = new FormData();
    formData.append("requestId", id);
    formData.append("adminFeedBack", remarks);
    patch(
      approve
        ? "/admin/acceptCourseBookingCancel"
        : "/admin/rejectCourseBookingCancel",
      formData,
      options
    )
      .then((data) => {
        if (data.status) {
          openNotification("Request Updated !");
          setRemarks("");
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
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (_, data) => (
        <p>{data?.createdAt && data?.createdAt.substring(0, 10)}</p>
      ),
    },
    {
      title: "Student",
      dataIndex: "student",
      key: "student",
      render: (_, data) => (
        <p>
          {data?.student?.firstName} {data?.student?.lastName}
        </p>
      ),
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
      render: (_, data) => <p>{data?.reason}</p>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, data) => (
        <Tag
          color={
            data?.status === "rejected"
              ? "volcano"
              : data?.status === "accepted"
              ? "green"
              : "blue"
          }
        >
          {data?.status}
        </Tag>
      ),
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "action",
      render: (_, data) =>
        data.status === "pending" && (
          <div style={{ display: "flex", alignItems: "center" }}>
            <Button
              style={{ marginRight: 10 }}
              onClick={() => {
                setId(data._id);
                setApprove(true);
                setViewModal(true);
              }}
              type="primary"
              size="small"
            >
              Approve
            </Button>
            <Button
              onClick={() => {
                setId(data._id);
                setApprove(false);
                setViewModal(true);
              }}
              type="primary"
              size="small"
            >
              Reject
            </Button>
          </div>
        ),
    },
  ];

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
          <h1>Cancel Course Request</h1>
          <div>
            <Button onClick={() => downloadExcelFile(data)} type="primary">
              Download
            </Button>
          </div>
        </div>

        <div style={{ marginTop: 30 }}>
          <Row gutter={[10, 10]}>
            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
              <div>
                <p>Search by Student</p>
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search"
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
            dataSource={searchData}
          />
        </div>
      </div>
      <Modal
        title="Send FeedBack"
        okText="Send"
        destroyOnClose
        visible={viewModal}
        onCancel={() => setViewModal(false)}
        onOk={() => {
          setViewModal(false);
          updateRequest();
        }}
      >
        <FormTextarea
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          label="FeedBack"
        />
      </Modal>
    </div>
  );
};

export default CancelBookingRequest;
