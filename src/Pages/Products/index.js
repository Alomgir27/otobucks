import { Col, DatePicker, Image, Input, Row, Switch, Table } from "antd";
import { DeleteFilled, EditFilled, EyeFilled } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { deleteService, get, patch, post } from "../../services/RestService";
import { downloadExcelFile, openNotification, options } from "../../helpers";

import { Button } from "antd";
import UploadFile from "../../Components/UploadExcelFile";
import { useHistory } from "react-router";

const { RangePicker } = DatePicker;

const Products = () => {
  const [data, setData] = useState([]);
  const [dataFilter, setDataFilter] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  const getData = () => {
    setLoading(true);
    const t = localStorage.getItem("token");
    const token = `Bearer ${t}`;
    var options = {
      headers: {
        Authorization: token,
      },
    };
    get("/products/myProducts", options)
      .then((data) => {
        setData(data.result);
        setDataFilter(data.result);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const updateStatus = (id, checked) => {
    setLoading(true);

    const data = {
      id: id,
    };
    patch(
      checked ? `/products/activate/${id}` : `/products/activate/${id}`,
      data,
      options
    )
      .then((data) => {
        openNotification("Status Changed Successfully");
        getData();
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
    deleteService(`/products/${id}`, data, options)
      .then((data) => {
        openNotification("Product Deleted Successfully");
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
          src={data && data?.details?.image}
        />
      ),
    },
    {
      title: "Created At",
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
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (_, data) => <p>{data?.category}</p>,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (_, data) => <p>{data?.details?.price}</p>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (_, data) => <p>{data?.details?.description}</p>,
    },
    {
      title: "Status",
      dataIndex: "active",
      key: "active",
      render: (_, data) => (
        <Switch
          checked={data.active}
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
      onFilter: (value, data) => data.active === value,
    },
    {
      title: "Admin Approved",
      dataIndex: "activeByAdmin",
      key: "activeByAdmin",
      render: (_, data) => (
        <p>{data.activeByAdmin ? "Active" : "Non Active"}</p>
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
              history.push(`product-form?type=view&id=${data._id}`);
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
              history.push(`product-form?type=edit&id=${data._id}`);
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

  const searchByName = (name) => {
    if (name !== "") {
      const res = data.filter((sd) => {
        return sd.title.toString().includes(name);
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

  const searchByPrice = (price) => {
    if (price !== "") {
      const res = data.filter((sd) => {
        return sd.details.price.toString().includes(price);
      });
      setData(res);
    } else {
      setData(dataFilter);
    }
  };

  const uploadFile = (e) => {
    if (e.file.percent === 100) {
      const file = e.file.originFileObj;
      const formData = new FormData();
      formData.append("file", file);
      post("/products/upload", file, options)
        .then((res) => {
          openNotification(res.message);
          getData();
        })
        .catch((err) => {
          openNotification(err.message);
        });
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
          <h1>Products</h1>
          <div style={{ display: "flex" }}>
            <Button onclick={() => downloadExcelFile(data)} type="primary">
              Download
            </Button>
            <UploadFile fileSelected={(e) => uploadFile(e)} />
            <Button
              onClick={() => {
                history.push(`product-form?type=create`);
              }}
              style={{ marginLeft: 30 }}
              type="primary"
            >
              Create Products
            </Button>
          </div>
        </div>

        <div style={{ marginTop: 30 }}>
          <Row gutter={[10, 10]}>
            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
              <div>
                <p>Search By Name</p>
                <Input
                  onChange={(e) => {
                    searchByName(e.target.value);
                  }}
                  placeholder="Search By Name"
                />
              </div>
            </Col>
            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
              <div>
                <p>Search By Price</p>
                <Input
                  onChange={(e) => {
                    searchByPrice(e.target.value);
                  }}
                  placeholder="Search By Price"
                />
              </div>
            </Col>
            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
              <p>Search by Date</p>
              <RangePicker
                style={{ width: "100%" }}
                onChange={(e, d) => searchByDate(d)}
              />
            </Col>
          </Row>
        </div>

        <div style={{ marginTop: 30 }}>
          <Table
            scroll={{ x: true }}
            loading={loading}
            columns={columns}
            dataSource={data.reverse()}
          />
        </div>
      </div>
    </div>
  );
};

export default Products;
