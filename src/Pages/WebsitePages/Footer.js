import React, { useState, useEffect } from "react";
import { Form, Row, Col, Spin, Button, Divider } from "antd";
import FormInput from "../../Components/FormInput";
import { get, patch } from "../../services/RestService";
import { options, openNotification } from "../../helpers";
import FormTextarea from "../../Components/FormTextarea";

const Footer = () => {
  const [loading, setLoading] = useState();
  const [data, setData] = useState();

  const getData = () => {
    setLoading(true);
    get("/footer", options)
      .then((data) => {
        setData(data.result);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const updateSetting = (values) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => formData.append(key, values[key]));

    patch(`/footer/${data._id}`, formData, options)
      .then((res) => {
        if (res.status) {
          openNotification(res.message);
          getData();
        } else {
          openNotification(res.message);
        }
      })
      .catch((err) => {
        openNotification(err.message);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  return loading ? (
    <Spin style={{ marginTop: 20 }} />
  ) : (
    <div style={{ padding: 30 }}>
      <div style={{ backgroundColor: "white", padding: 20 }}>
        <h1>Footer Page Details</h1>
        <Divider />

        <div style={{ marginTop: 50 }}>
          <Form initialValues={data} onFinish={updateSetting}>
            <Row gutter={[10, 10]}>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <div style={{ border: "1px solid lightgrey", padding: 20 }}>
                  <h3>Heading</h3>
                  <FormInput name="heading" />
                  <h3>Content</h3>
                  <FormTextarea name="content" />
                </div>
              </Col>
            </Row>

            <Row style={{ marginTop: 20 }} gutter={[10, 10]}>
              <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                <h3>Facebook URL</h3>
                <FormInput name="facebookUrl" />
              </Col>
              <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                <h3>Twitter URL</h3>
                <FormInput name="twitterUrl" />
              </Col>
              <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                <h3>LinkedIn URL</h3>
                <FormInput name="linkedinUrl" />
              </Col>
            </Row>
            <Row style={{ marginTop: 20 }} gutter={[10, 10]}>
              <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                <h3>Email</h3>
                <FormInput name="email" />
              </Col>
              <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                <h3>Phone No</h3>
                <FormInput name="phone" />
              </Col>
              <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                <h3>Address</h3>
                <FormInput name="address" />
              </Col>
            </Row>

            <div style={{ marginTop: 30, textAlign: "right" }}>
              <Button size="large" type="primary" htmlType="submit">
                Save Information
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Footer;
