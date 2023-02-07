import React, { useState, useEffect } from "react";
import { Form, Row, Col, Spin, Button, Upload } from "antd";
import FormInput from "../../Components/FormInput";
import { get, patch } from "../../services/RestService";
import { options, openNotification } from "../../helpers";
import FormTextarea from "../../Components/FormTextarea";

const Home = () => {
  const [loading, setLoading] = useState();
  const [data, setData] = useState();
  const [selectedFile, setSelectedFile] = useState([]);

  const getData = () => {
    setLoading(true);
    get("/admin/getHome", options)
      .then((data) => {
        setData(data);
        const imgList = [];
        data?.sliderImagesPath.map((img, i) =>
          imgList.push({
            uid: i,
            name: img,
            status: "done",
            url: img,
          })
        );
        setSelectedFile(imgList);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const dummyRequest = ({ _, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  const fileSelected = ({ file, fileList: newFileList }) => {
    setSelectedFile(newFileList);
  };

  const updateSetting = (values) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => formData.append(key, values[key]));
    formData.append("homeId", data._id);
    if (selectedFile) {
      selectedFile.forEach((file) => {
        formData.append("sliderImages", file.originFileObj);
      });
    }

    patch("/admin/updateHome", formData, options)
      .then((res) => {
        if (res.status) {
          openNotification(res.message);
          getData();
        } else {
          openNotification(res.error);
        }
      })
      .catch((err) => {
        openNotification(err.error);
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
        <h1>Home Page</h1>

        <div style={{ marginTop: 20 }}>
          <h1>Slider Section (Must upload three images)</h1>
          <Upload
            customRequest={dummyRequest}
            listType="picture-card"
            fileList={selectedFile}
            onChange={fileSelected}
          >
            {"+ Upload"}
          </Upload>
        </div>

        <div style={{ marginTop: 20 }}>
          <Form initialValues={data} onFinish={updateSetting}>
            <Row gutter={[10, 10]}>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <div style={{ border: "1px solid lightgrey", padding: 20 }}>
                  <h1 style={{ textAlign: "center" }}>English</h1>
                  <h3>Slider Text</h3>
                  <FormTextarea name="sliderTextEnglish" />
                </div>
              </Col>
            </Row>

            <Row style={{ marginTop: 20 }} gutter={[10, 10]}>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <div style={{ border: "1px solid lightgrey", padding: 20 }}>
                  <h1 style={{ textAlign: "center" }}>Arabic</h1>
                  <h3>Slider Text*</h3>
                  <FormTextarea name="sliderTextArabic" />
                </div>
              </Col>
            </Row>

            <div style={{ marginTop: 30 }}>
              <h1>Well come to civil group & institutes section</h1>
            </div>
            <Row gutter={[10, 10]}>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <div style={{ border: "1px solid lightgrey", padding: 20 }}>
                  <h1 style={{ textAlign: "center" }}>English</h1>
                  <h3>Enter Title</h3>
                  <FormInput name="titleEnglish" />
                  <h3>Tagline</h3>
                  <FormInput name="taglineEnglish" />
                  <h3>Description*</h3>
                  <FormTextarea name="descriptionEnglish" />
                </div>
              </Col>
            </Row>

            <Row style={{ marginTop: 20 }} gutter={[10, 10]}>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <div style={{ border: "1px solid lightgrey", padding: 20 }}>
                  <h3>Enter Title</h3>
                  <FormInput name="titleArabic" />
                  <h3>Tagline</h3>
                  <FormInput name="taglineArabic" />
                  <h3>Description*</h3>
                  <FormTextarea name="descriptionArabic" />
                </div>
              </Col>
            </Row>

            <div style={{ marginTop: 30, textAlign: "right" }}>
              <Button size="large" type="primary" htmlType="submit">
                Save
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Home;
