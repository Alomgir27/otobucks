import { useState } from "react";
import { useHistory } from "react-router-dom";
import OTPInput from "otp-input-react";
import { Form, Input, Row, Col } from "antd";
import { patch } from "../../services/RestService";
import EmailIcon from "../../assets/emailIcon.png";
import { openNotification } from "../../helpers";
import "./styles.scss";

export default function App(props) {
  const history = useHistory();
  const [OTP, setOTP] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const submitOTP = () => {
    if (OTP?.length < 6) {
      openNotification("Please enter OTP");
      return;
    } else if (password?.length < 8) {
      openNotification("Password must be at least 8 characters long");
      return;
    } else if (password !== passwordConfirm) {
      openNotification("Passwords do not match");
      return;
    } else {
      patch(`/auth/providers/resetPassword/${OTP}`, {
        password,
        passwordConfirm: passwordConfirm,
      })
        .then(() => {
          openNotification("Password Updated Successfully");
          history.push("/login");
        })
        .catch((error) => openNotification(error.message));
    }
  };

  return (
    <div className="forget-password-otp">
      <img src={EmailIcon} className="forget-password-emailIcon" alt="" />
      <p>
        Please Enter The Verification Code We Sent To
        <br />
        Your Email Address <strong>{props.email}</strong>
      </p>
      <OTPInput
        value={OTP}
        onChange={setOTP}
        autoFocus
        OTPLength={6}
        otpType="number"
        disabled={false}
        secure
        className="forget-password-OTPVerify"
      />
      <Row>
        <Col xs={24} xl={6}></Col>
        <Col xs={24} xl={12}>
          <Row className="password-field">
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
          <Row className="password-field">
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
        </Col>
        <Col xs={24} xl={6}></Col>
      </Row>
      <button
        className="forget-password-otp-submit"
        onClick={() => submitOTP()}
      >
        SUBMIT
      </button>
      <br />
      <br />
      <br />
      <br />
      <br />
    </div>
  );
}
