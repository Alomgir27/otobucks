import React, { useState, useEffect } from "react";
import { Form, Row, Col, Spin, Button, Upload, Divider } from "antd";
import FormInput from "../../Components/FormInput";
import { get, patch } from "../../services/RestService";
import { options, openNotification } from "../../helpers";
import FormTextarea from "../../Components/FormTextarea";

const About = () => {
  const [loading, setLoading] = useState();
  const [data, setData] = useState();
  const [companyImages, setCompanyImages] = useState([]);
  const [missionImages, setMissionImages] = useState([]);
  const [visionImages, setVisionImages] = useState([]);
  const [clientImages, setClientImages] = useState([]);

  const getData = () => {
    setLoading(true);
    get("/about", options)
      .then((data) => {
        setData(data.result);
        const imgList = [];
        data?.result?.images.map((img, i) =>
          imgList.push({
            uid: i,
            name: img,
            status: "done",
            url: img,
          })
        );
        setCompanyImages(imgList);
        const img1List = [];
        data?.result?.visionImages.map((img, i) =>
          img1List.push({
            uid: i,
            name: img,
            status: "done",
            url: img,
          })
        );
        setVisionImages(img1List);
        const img2List = [];
        data?.result?.missionImages.map((img, i) =>
          img2List.push({
            uid: i,
            name: img,
            status: "done",
            url: img,
          })
        );
        setMissionImages(img2List);
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

  const cFileSelected = ({ file, fileList: newFileList }) => {
    setCompanyImages(newFileList);
  };

  const mFileSelected = ({ file, fileList: newFileList }) => {
    setMissionImages(newFileList);
  };

  const vFileSelected = ({ file, fileList: newFileList }) => {
    setVisionImages(newFileList);
  };

  const updateSetting = (values) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => formData.append(key, values[key]));
    if (companyImages) {
      companyImages.forEach((file) => {
        formData.append("images", file.originFileObj);
      });
    }
    if (visionImages) {
      visionImages.forEach((file) => {
        formData.append("visionImages", file.originFileObj);
      });
    }
    if (missionImages) {
      missionImages.forEach((file) => {
        formData.append("missionImages", file.originFileObj);
      });
    }

    patch(`/about/${data._id}`, formData, options)
      .then((res) => {
        if (res.status) {
          openNotification(res.message);
          getData();
        } else {
          openNotification(res.message);
        }
      })
      .catch((err) => {
        openNotification(err?.message);
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
        <h1>About Page Details</h1>

        <Divider />

        <h1>Company Profile</h1>

        <div style={{ marginTop: 20 }}>
          <h1>Upload Company Images</h1>
          <Upload
            customRequest={dummyRequest}
            listType="picture-card"
            fileList={companyImages}
            onChange={cFileSelected}
          >
            {"+ Upload"}
          </Upload>
        </div>

        <div style={{ marginTop: 20 }}>
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

            <Divider />
            <h1>Our Mission</h1>

            <div style={{ marginTop: 20 }}>
              <h1>Upload Mission Images</h1>
              <Upload
                customRequest={dummyRequest}
                listType="picture-card"
                fileList={missionImages}
                onChange={mFileSelected}
              >
                {"+ Upload"}
              </Upload>
            </div>

            <Row gutter={[10, 10]}>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <div style={{ border: "1px solid lightgrey", padding: 20 }}>
                  <h3>Heading</h3>
                  <FormInput name="missionHeading" />
                  <h3>Content</h3>
                  <FormTextarea name="missionContent" />
                </div>
              </Col>
            </Row>

            <Divider />
            <h1>Our Vision</h1>

            <div style={{ marginTop: 20 }}>
              <h1>Upload Vision Images</h1>
              <Upload
                customRequest={dummyRequest}
                listType="picture-card"
                fileList={visionImages}
                onChange={vFileSelected}
              >
                {"+ Upload"}
              </Upload>
            </div>

            <Row gutter={[10, 10]}>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <div style={{ border: "1px solid lightgrey", padding: 20 }}>
                  <h3>Heading</h3>
                  <FormInput name="visionHeading" />
                  <h3>Content</h3>
                  <FormTextarea name="visionContent" />
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

export default About;
