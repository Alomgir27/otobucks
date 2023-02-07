import React, { useState, useEffect } from "react";
import { Button, Form, Row, Col, Image } from "antd";
import UploadImage from "../../Components/UploadImage";
import FormInput from "../../Components/FormInput";
import { post, patch } from "../../services/RestService";
import { openNotification } from "../../helpers";

const FormModal = ({ method, id, closeModal, getTableData, data }) => {
  const [image, setImage] = useState();
  const [imagePath, setImagePath] = useState();
  const [userData, setUserData] = useState();
  const edit = method === "edit";
  const view = method === "view";
  const create = method === "create";

  const onSubmit = (values) => {
    const t = localStorage.getItem("token");
    const token = `Bearer ${t}`;
    var options = {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    };
    const formdata = new FormData();

    formdata.append("image", image ? image : imagePath);
    formdata.append("title", values.title);
    formdata.append("type", "service");

    post("/categories", formdata, options)
      .then((res) => {
        if (res.status === "success") {
          openNotification(res.message);
          closeModal();
          getTableData();
        } else {
          openNotification(res.message);
        }
      })
      .catch((err) => {
        openNotification(err.message);
      });
  };

  useEffect(() => {
    if (edit || view) setUserData(data);
    setImagePath(data?.image);
  }, [edit, view, setUserData, data]);

  const onEdit = (values) => {
    const t = localStorage.getItem("token");
    const token = `Bearer ${t}`;
    var options = {
      headers: {
        Authorization: token,
      },
    };
    const formdata = new FormData();
    formdata.append("image", image ? image : imagePath);
    formdata.append("title", values.title);
    formdata.append("type", "service");

    patch("/categories", formdata, options)
      .then((res) => {
        if (res.status) {
          openNotification(res.message);
          closeModal();
          getTableData();
        } else {
          openNotification(res.message);
        }
      })
      .catch((err) => {
        openNotification(err.message);
      });
  };

  return (
    <div>
      <div>
        {(image || imagePath) && (
          <div style={{ textAlign: "center" }}>
            <Image
              src={image ? URL.createObjectURL(image) : imagePath}
              style={{ width: 100, heigt: 100, objectFit: "contain" }}
            />
          </div>
        )}

        {!view && (
          <div style={{ marginTop: 10 }}>
            <p>Upload Image</p>
            <UploadImage image={image} setImage={setImage} />
          </div>
        )}

        {((edit && userData) || (view && userData) || create) && (
          <div style={{ marginTop: 20 }}>
            <Form onFinish={edit ? onEdit : onSubmit} initialValues={userData}>
              <Row gutter={[10, 10]}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <p>Title</p>
                  <FormInput name="title" />
                </Col>
              </Row>

              {!view && (
                <Button type="primary" htmlType="submit">
                  {edit ? "Edit" : "Create"} Category
                </Button>
              )}
            </Form>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormModal;
