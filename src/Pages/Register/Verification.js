import { Button } from "antd";
import { useDispatch } from "react-redux";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import FormInput from "../../Components/FormInput";
import { openNotification } from "../../helpers";
import { patch } from "../../services/RestService";
import { sendVerificationCode } from "../../redux/actions/register";
import { ResendOTP } from "otp-input-react";

const Verification = ({ email }) => {
  const dispatch = useDispatch();
  const [code, setCode] = useState();
  const history = useHistory();

  const submitCode = () => {
    const data = {
      email,
    };
    patch(`/auth/users/verify-email/${code}`, data)
      .then((res) => {
        if (res.status === "success") {
          openNotification(
            "Thank you for verifying your email adress, your account is under review, once it is approved we will notify you by email"
          );
          history.push("/login");
        }
      })
      .catch((err) => {
        openNotification(err.message);
      });
  };

  return (
    <div>
      <h1>Verification </h1>
      <div>
        <p>OTP</p>
        <FormInput
          placeholder="code"
          onChange={(e) => setCode(e.target.value)}
        />
        <ResendOTP
          className="resendOTP"
          onResendClick={() => dispatch(sendVerificationCode(email, history))}
        />
        <Button type="primary" onClick={() => submitCode()}>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default Verification;
