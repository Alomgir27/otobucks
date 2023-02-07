import React, { useState, useEffect } from "react";
import { Form, Row, Col, Spin, Button, Divider, Image } from "antd";
import FormInput from "../../Components/FormInput";
import { get, patch } from "../../services/RestService";
import { options, openNotification } from "../../helpers";
import UploadImage from "../../Components/UploadImage";
import FormTextarea from "../../Components/FormTextarea";

const Header = () => {
  const [loading, setLoading] = useState();
  const [data, setData] = useState();
  const [logo, setLogo] = useState();
  const [favLogo, setFavLogo] = useState();
  const [logoUrl, setLogoUrl] = useState();

  const getData = () => {
    setLoading(true);
    get("/header", options)
      .then((data) => {
        setLogo(null);
        setFavLogo(null);
        setData(data.result);
        setLogoUrl(data.result.logoImage);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const updateSetting = (values) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => formData.append(key, values[key]));
    formData.append("logoImage", logo ? logo : logoUrl);

    patch(`/header/${data._id}`, formData, options)
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
        <h1>Header Details</h1>
        <Divider />
        <div style={{ marginTop: 50 }}>
          <Row gutter={[10, 10]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Image
                style={{ width: 200, height: 200, objectFit: "contain" }}
                src={logo ? URL.createObjectURL(logo) : logoUrl}
              />
              <p>Upload Logo</p>
              <UploadImage image={logo} setImage={setLogo} />
            </Col>
          </Row>
        </div>
        <div style={{ marginTop: 50 }}>
          <Form initialValues={data} onFinish={updateSetting}>
            {/* <Row gutter={[10, 10]}>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <div style={{ border: '1px solid lightgrey', padding: 20}}>
                  <h1 style={{ textAlign: 'center' }}>English</h1>
                  <h3>English Heading</h3>
                  <FormInput name='nameEnglish' />
                  <h3>English Content</h3>
                  <FormTextarea name='contentEnglish' />
                </div>
              </Col>
            </Row> */}

            <Row style={{ marginTop: 20 }} gutter={[10, 10]}>
              <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                <h3>Email</h3>
                <FormInput name="email" />
              </Col>
              <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                <h3>Mobile Number*</h3>
                <FormInput name="mobileNo" />
              </Col>
              <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                <h3>Address</h3>
                <FormInput name="address" />
              </Col>
            </Row>
            <Row style={{ marginTop: 20 }} gutter={[10, 10]}>
              <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                <h3>Telephone Number*</h3>
                <FormInput name="telephoneNo" />
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

export default Header;
