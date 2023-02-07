import React, { useState, useEffect } from "react";
import { Spin, Button, Table, Image, Modal, Row, Col } from "antd";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import { get, patch, post, deleteService } from "../../services/RestService";
import { options, openNotification } from "../../helpers";
import FormInput from "../../Components/FormInput";
import UploadNoCrop from "../../Components/UploadNoCrop";

const Gallery = () => {
  const [loading, setLoading] = useState();
  const [data, setData] = useState();
  const [image, setImage] = useState();
  const [imageUrl, setImageUrl] = useState();
  const [id, setId] = useState();
  const [viewModal, setViewModal] = useState(false);
  const [title, setTitle] = useState();
  const [subTitle, setSubTitle] = useState();

  const getData = () => {
    setLoading(true);
    get("/sliders", options)
      .then((data) => {
        setData(data.result);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const createGallery = () => {
    const formData = new FormData();
    if (image) {
      formData.append("image", image ? image : imageUrl);
    }

    formData.append("title", title);
    formData.append("subTitle", subTitle);

    post("/sliders", formData, options)
      .then((res) => {
        if (res.status) {
          openNotification(res.message);
          setTitle();
          setSubTitle();
          setImage(null);
          getData();
        } else {
          openNotification(res.message);
        }
      })
      .catch((err) => {
        openNotification(err.message);
      });
  };

  const updateGalery = () => {
    const formData = new FormData();

    if (image) {
      formData.append("image", image ? image : imageUrl);
    }

    formData.append("title", title);
    formData.append("subTitle", subTitle);

    patch(`/sliders/${id}`, formData, options)
      .then((res) => {
        if (res.status) {
          openNotification(res.message);
          getData();
          setTitle();
          setSubTitle();
          setImageUrl();
          setImage();
          setViewModal(false);
        } else {
          openNotification(res.message);
        }
      })
      .catch((err) => {
        openNotification(err?.message);
      });
  };

  const deleteGallery = (id) => {
    setLoading(true);
    const formData = new FormData();

    deleteService(`/sliders/${id}`, formData)
      .then((data) => {
        if (data.status) {
          openNotification("Gallery Deleted Successfully");
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
      render: (_, data) => <p>{data?.title}</p>,
    },
    {
      title: "Sub Title",
      dataIndex: "subTitle",
      key: "subTitle",
      render: (_, data) => <p>{data?.subTitle}</p>,
    },
    {
      title: "Images",
      dataIndex: "imagesPath",
      key: "imagesPath",
      render: (_, data) => (
        <div>
          <Image
            style={{
              width: 100,
              height: 100,
              objectFit: "contain",
              marginRight: 10,
            }}
            src={data.image}
          />
        </div>
      ),
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "action",
      render: (_, data) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <EditFilled
            onClick={() => {
              setId(data._id);
              setImageUrl(data.image);
              setTitle(data.title);
              setSubTitle(data.subTitle);
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
            onClick={() => deleteGallery(data._id)}
            style={{ color: "grey", cursor: "pointer", fontSize: 25 }}
          />
        </div>
      ),
    },
  ];

  const dummyRequest = ({ _, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  return loading ? (
    <Spin style={{ marginTop: 20 }} />
  ) : (
    <div style={{ padding: 30 }}>
      <div style={{ backgroundColor: "white", padding: 20 }}>
        <h1>Sliders</h1>
        <div style={{ marginTop: 50 }}>
          <div>
            <h3>Title</h3>
            <FormInput
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <h3>SubTitle</h3>
            <FormInput
              value={subTitle}
              onChange={(e) => setSubTitle(e.target.value)}
            />
            <Row gutter={[10, 10]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                {(image || imageUrl) && (
                  <Image
                    style={{ width: 200, height: 200, objectFit: "contain" }}
                    src={image ? URL.createObjectURL(image) : imageUrl}
                  />
                )}
                <p>Upload Image</p>
                <UploadNoCrop image={image} setImage={setImage} />
              </Col>
            </Row>
            <div style={{ textAlign: "right" }}>
              <Button
                onClick={() => createGallery()}
                type="primary"
                htmlType="button"
              >
                Create
              </Button>
            </div>
            <div style={{ marginTop: 20 }}>
              <Table loading={loading} dataSource={data} columns={columns} />
            </div>
          </div>
        </div>
      </div>
      <Modal
        visible={viewModal}
        destroyOnClose
        footer={null}
        onCancel={() => {
          setTitle();
          setSubTitle();
          setImageUrl();
          setImage();
          setViewModal(false);
        }}
      >
        <div>
          <h3>Title</h3>
          <FormInput value={title} onChange={(e) => setTitle(e.target.value)} />
          <h3>SubTitle</h3>
          <FormInput
            value={subTitle}
            onChange={(e) => subTitle(e.target.value)}
          />
          <Row gutter={[10, 10]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Image
                style={{ width: 200, height: 200, objectFit: "contain" }}
                src={image ? URL.createObjectURL(image) : imageUrl}
              />
              <p>Upload Image</p>
              <UploadNoCrop image={image} setImage={setImage} />
            </Col>
          </Row>
          <div style={{ textAlign: "right" }}>
            <Button
              onClick={() => updateGalery()}
              type="primary"
              htmlType="button"
            >
              Update
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Gallery;
