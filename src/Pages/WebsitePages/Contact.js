import React, { useState, useEffect } from "react";
import { Form, Row, Col, Spin, Divider, Image } from "antd";
import { get } from "../../services/RestService";
import { options } from "../../helpers";
import Grid from "@mui/material/Grid";

const Contact = () => {
  const [loading, setLoading] = useState();
  const [data, setData] = useState();

  const getData = () => {
    setLoading(true);
    get("/header", options)
      .then((data) => {
        setData(data.result);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
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
        <h1>Contact Us</h1>
        <Divider />
        <div style={{ marginTop: 20 }}>
          <Form initialValues={data}>
            <Grid container spacing={3}>
              <Grid item xl={4} lg={4} md={6} sm={12} xs={12}>
                <h3>Email</h3>
                <p>{data?.email}</p>
              </Grid>
              <Grid item xl={4} lg={4} md={6} sm={12} xs={12}>
                <h3>Mobile Number</h3>
                <p>{data?.mobileNo}</p>
              </Grid>
              <Grid item xl={4} lg={4} md={6} sm={12} xs={12}>
                <h3>Address</h3>
                <p>{data?.address}</p>
              </Grid>
            </Grid>

            <Row style={{ marginTop: 20 }} gutter={[10, 10]}>
              <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                <h3>Telephone Number</h3>
                <p>{data?.telephoneNo}</p>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
