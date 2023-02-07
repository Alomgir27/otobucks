import { Col, Image, Input, Modal, Row, Switch, Table } from "antd";
import { DeleteFilled, EditFilled, EyeFilled } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { deleteService, get, patch } from "../../services/RestService";
import { downloadExcelFile, openNotification } from "../../helpers";

import { Button } from "antd";
import FormModal from "./FormModal";

const ProductCategories = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchData =
    (data &&
      data.filter((sd) =>
        sd?.title.toString().includes(search)
      )) ||
    [];
  const [viewModal, setViewModal] = useState(false);
  const [modalData, setModalData] = useState({});
  const [method, setMethod] = useState();

  const getData = () => {
    setLoading(true);
    const t = localStorage.getItem("token");
    const token = `Bearer ${t}`;
    var options = {
      headers: {
        Authorization: token,
      },
    };
    get("/categories?type=product", options)
      .then((data) => {
        setData(data.result);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const updateStatus = (id, checked) => {
    setLoading(true);
    const t = localStorage.getItem("token");
    const token = `Bearer ${t}`;
    var options = {
      headers: {
        Authorization: token,
      },
    };

    const data = {
      activeByAdmin: checked,
    };
    patch(`/categories/${id}`, data, options)
      .then((data) => {
        if (data.status === "success") {
          openNotification("Status Changed Successfully");
          getData();
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const deleteUser = (id) => {
    setLoading(true);
    const data = {
      id: id,
    };
    deleteService(`/categories/${id}`, data)
      .then((data) => {
        openNotification("Category Deleted Successfully");
        getData();
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
      title: "Image",
      dataIndex: "imagePath",
      key: "imagePath",
      render: (_, data) => (
        <Image
          style={{ width: 50, height: 50, objectFit: "contain" }}
          src={data && data.image}
        />
      ),
    },
    {
      title: "Created_At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (_, data) => <p>{data && data?.createdAt.substring(0, 10)}</p>,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (_, data) => <p>{data?.title}</p>,
    },
    {
      title: "Status",
      dataIndex: "activeByAdmin",
      key: "activeByAdmin",
      render: (_, data) => (
        <Switch
          checked={data.activeByAdmin}
          onChange={(e) => updateStatus(data._id, e)}
        />
      ),
      filters: [
        {
          text: "Active",
          value: true,
        },
        {
          text: "InActive",
          value: false,
        },
      ],
      onFilter: (value, data) => data.activeByAdmin === value,
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "action",
      render: (_, data) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <EyeFilled
            onClick={() => {
              setModalData(data);
              setMethod("view");
              setViewModal(true);
            }}
            style={{
              color: "grey",
              cursor: "pointer",
              fontSize: 25,
              marginRight: 10,
            }}
          />
          <EditFilled
            onClick={() => {
              setModalData(data);
              setMethod("edit");
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
              deleteUser(data._id);
            }}
            style={{ color: "grey", cursor: "pointer", fontSize: 25 }}
          />
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
          <h1>Product Categories</h1>
          <div>
            <Button
              onClick={() => downloadExcelFile(data, "categories")}
              type="primary"
            >
              Download
            </Button>
            <Button
              onClick={() => {
                setMethod("create");
                setViewModal(true);
              }}
              style={{ marginLeft: 30 }}
              type="primary"
            >
              Create Category
            </Button>
          </div>
        </div>

        <div style={{ marginTop: 30 }}>
          <Row gutter={[10, 10]}>
            {/* <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <div>
              <p>Filter By Status</p>
              <>
                <Select defaultValue="Select Option" style={{ width: '100%' }} onChange={handleChange}>
                  <Option value="All">All</Option>
                  <Option value="Active">Active</Option>
                  <Option value="Inactive">Inactive</Option>
                </Select>
              </>
            </div>
          </Col> */}
            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
              <div>
                <p>Search by Name</p>
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search By Name"
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
            dataSource={searchData.reverse()}
          />
        </div>
      </div>
      <Modal
        destroyOnClose
        footer={false}
        title="Category"
        okText="Done"
        visible={viewModal}
        onCancel={() => setViewModal(false)}
        onOk={() => {
          setViewModal(false);
        }}
      >
        <FormModal
          closeModal={() => setViewModal(false)}
          getTableData={getData}
          data={modalData}
          method={method}
        />
      </Modal>
    </div>
  );
};

export default ProductCategories;
