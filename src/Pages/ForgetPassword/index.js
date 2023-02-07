import React, { useState } from "react";
import { Card } from "antd";
import SendEmail from "../../Components/ForgetPassword/SendOTP";
import OTPVerify from "../../Components/ForgetPassword/OTPVerify";
import PasswordReset from "../../Components/ForgetPassword/PasswordReset";
import { patch } from "../../services/RestService";
import "./styles.scss";
import { openNotification } from "../../helpers";

const ForgetPassword = () => {
  const [showOTPScreen, setShowOTPScreen] = useState(true);
  const [sendEmail, setSendEmail] = useState(true);
  const [email, setEmail] = useState("");

  function confirmOTP() {
    setShowOTPScreen(false);
  }

  const sendOTP = (emailAddress) => {
    patch("/auth/providers/forgotPassword", {
      data: emailAddress,
    })
      .then(() => {
        setSendEmail(false);
        setEmail(emailAddress);
      })
      .catch((err) => openNotification(err.message));
  };

  function EmailSend(emailAddress) {
    sendOTP(emailAddress);
  }
  return (
    <div>
      {sendEmail ? (
        <SendEmail EmailSend={EmailSend} />
      ) : (
        <Card className="forget_password_card">
          {showOTPScreen ? (
            <OTPVerify confirmOTP={confirmOTP} email={email} />
          ) : (
            <PasswordReset />
          )}
        </Card>
      )}
    </div>
  );
};

export default ForgetPassword;
