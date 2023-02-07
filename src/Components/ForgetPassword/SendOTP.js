import { useEffect, Fragment, useState } from "react";
import { Form, Input, Button, Row, Checkbox, Col } from "antd";
import Logo from "../../assets/autofix.png";
import { useSelector, useDispatch } from "react-redux";
import { loginUser } from "../../redux/actions/authAction";
import { useHistory } from "react-router";

import "./styles.scss";
const FormItem = Form.Item;

const Login = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const auth = useSelector((state) => state.auth);
  const onFinish = (values) => {
    props.EmailSend(values.email);
    // dispatch(loginUser(values));
  };

  const [verify, setVerify] = useState(false);

  const onFinishFailed = (errorInfo) => {};

  useEffect(() => {
    auth.isAuthenticated && history.push("/home");
  }, [auth, history]);

  useEffect(() => {
    auth.isAuthenticated && window.location.reload();
  }, [auth]);

  return (
    <div id="login">
      <div className={"form"}>
        <div className={"logo"}>
          <img alt="logo" src={Logo} />
        </div>
        <h2 style={{ textAlign: "center" }}>Forgot Password</h2>
        <h4 style={{ textAlign: "center" }}>
          Enter your registered email to reset your password.
        </h4>
        <p style={{ color: "red" }}>{auth.error}</p>
        <Form onFinish={onFinish} onFinishFailed={onFinishFailed}>
          <FormItem
            name="email"
            rules={[{ required: true, message: "Please input your Email!" }]}
            hasFeedback
          >
            <Input placeholder={"email"} />
          </FormItem>
          <Row>
            <Button type="primary" htmlType="submit">
              Get OTP
            </Button>
          </Row>
          <Row style={{ marginTop: 20 }} gutter={[10, 10]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
              <p style={{ textAlign: "center" }}>
                New here?{" "}
                <a onClick={() => history.push("/register")}>Sign up</a>
              </p>
            </Col>
          </Row>
          <Row style={{ marginTop: 5, marginBottom: 20 }} gutter={[10, 10]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
              <p style={{ textAlign: "center" }}>
                Already have an account?{" "}
                <a onClick={() => history.push("/login")}>Sign in</a>
              </p>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
};

export default Login;
