import { useState } from "react";
import { Form, Input, Button, Row, Col, Card } from "antd";
import "./styles.scss";
import LockPassword from "../../assets/lockPassword.png";
import { useHistory } from "react-router";
import { patch } from "../../services/RestService";
import { logout, openErrorNotification, openNotification } from "../../helpers";
import { CloseOutlined } from "@ant-design/icons";
import { actionTypes } from "../../redux/types";
import { useDispatch } from "react-redux";

const UpdatePassword = () => {

  const dispatch = useDispatch();



  const history = useHistory();
  const [data, setData] = useState({
    passwordCurrent: "",
    password: "",
    passwordConfirm: "",
  });

  const onChangeHanlder = (e) => {
    const { name, value } = e.target;
    setData((pre) => {
      return { ...pre, [name]: value };
    });
  };

  const submit = async (e) => {
    e.preventDefault();

    if (data.password !== data.passwordConfirm) {
      openErrorNotification("Password does not match");
      return;
    }

    patch("/auth/users/updateMyPassword", data)
      .then(() => {
        openNotification("Password updated");
        logout();
      })
      .catch(() => {
        openErrorNotification("Password not updated");
      });
  };

  return (
    <div>
      <Card
        className="forget_password_card"
        extra={
          <CloseOutlined
            onClick={() => {
              // the sidebar will appear when the user click on the close button
              dispatch({
                type: actionTypes.SIDEBAR_DISAPPEAR,
                payload: false,
              });
              history.push("/profile");
            }}
          />
        }
      >
        <Row>
          <Col xs={24} xl={6}></Col>
          <Col xs={24} xl={12}>
            <Row
              type="flex"
              justify="center"
              align="middle"
              style={{ marginTop: 10, textAlign: "left" }}
            >
              <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                <p>Current Password</p>
                <Form.Item
                  value={data.passwordCurrent}
                  name="passwordCurrent"
                  onChange={onChangeHanlder}
                  rules={[
                    {
                      required: true,
                      message: "Please input your current password!",
                    },
                  ]}
                  hasFeedback
                >
                  <Input.Password name="passwordCurrent" />
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
                <p>Password</p>
                <Form.Item
                  name="password"
                  value={data.password}
                  onChange={onChangeHanlder}
                  rules={[
                    {
                      required: true,
                      message: "Please input your password!",
                    },
                  ]}
                  hasFeedback
                >
                  <Input.Password name="password" />
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
                  value={data.passwordConfirm}
                  onChange={onChangeHanlder}
                  placeholder="Confirm Password"
                  dependencies={["password"]}
                  name="passwordConfirm"
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
                  <Input.Password name="passwordConfirm" />
                </Form.Item>
              </Col>
            </Row>
            <Row type="flex" justify="center" align="middle">
              <Button
                type="primary"
                htmlType="submit"
                className="password-reset-form-button"
                onClick={submit}
                //loading={loading.effects.login}
              >
                UPDATE PASSWORD
              </Button>
            </Row>
          </Col>
          <Col xs={24} xl={6}></Col>
        </Row>
      </Card>
    </div>
  );
};

export default UpdatePassword;
