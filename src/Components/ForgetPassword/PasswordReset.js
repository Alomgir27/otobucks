import { useState } from "react";
import {
  Form,
  Card,
  Input,
  Button,
  Row,
  Col,
  Upload,
  Image,
  Select,
} from "antd";
import "./styles.scss";
import LockPassword from "../../assets/lockPassword.png";
import { useHistory } from "react-router";
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

export default function App() {
  const [OTP, setOTP] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const history = useHistory();

  const onFinish = (values) => {
    const email = values.email;
    const data = { ...values };
  };

  const onFinishFailed = (errorInfo) => {};
  return (
    <Row>
      <Col xs={24} xl={6}></Col>
      <Col xs={24} xl={12}>
        <img src={LockPassword} className="forget-password-lockIcon" />
        <Row
          type="flex"
          justify="center"
          align="middle"
          style={{ marginTop: 10, textAlign: "left" }}
        >
          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
            <p>Password</p>
            <Form.Item
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
              hasFeedback
            >
              <Input.Password />
            </Form.Item>
          </Col>
        </Row>
        <Row
          type="flex"
          justify="center"
          align="middle"
          style={{ marginTop: 10, textAlign: "left" }}
        >
          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
            <p>Confirm Password</p>
            <Form.Item
              name="passwordConfirm"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="Confirm Password"
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Passwords you entered do not match!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
          </Col>
        </Row>
        <Row type="flex" justify="center" align="middle">
          <Button
            type="primary"
            htmlType="submit"
            className="password-reset-form-button"
            onClick={() => history.push(`/login`)}
            //loading={loading.effects.login}
          >
            CHANGE PASSWORD
          </Button>
        </Row>
      </Col>
      <Col xs={24} xl={6}></Col>
    </Row>
  );
}
