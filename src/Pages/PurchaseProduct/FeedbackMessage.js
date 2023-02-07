import "./styles.scss";

import { CarImage, FeedbackActiveIcon, FeedbackIcon } from "./../../Icons";
import React, { useState } from "react";
import { get, options, post } from "../../services/RestService";

import { Button } from "antd";
import Grid from "@mui/material/Grid";
import { Input } from "antd";

const { TextArea } = Input;
let FeedbackMessage = (props) => {

  const config = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };

  const userData = JSON.parse(localStorage.getItem("user"));
  let user_id = "";
  if(userData && userData.user.id && userData.user.id != ""){
    user_id = userData.user.id;
  }
  let [userId, setUserId] = useState(user_id);
  let [feedback, setFeedback] = useState("");

  let [firstRating, setFirstRating] = useState(false);
  let [secondRating, setSecondRating] = useState(false);
  let [thirdRating, setThirdRatign] = useState(false);
  let [fourthRating, setFourthRating] = useState(false);
  let [fifthRating, setFifthRating] = useState(false);
  let FirstRatingHandler = () => {
    setFirstRating(true);
    setSecondRating(false);
    setThirdRatign(false);
    setFourthRating(false);
    setFifthRating(false);
  };
  let SecondRatingHandler = () => {
    setFirstRating(true);
    setSecondRating(true);
    setThirdRatign(false);
    setFourthRating(false);
    setFifthRating(false);
  };
  let ThirdRatingHandler = () => {
    setFirstRating(true);
    setSecondRating(true);
    setThirdRatign(true);
    setFourthRating(false);
    setFifthRating(false);
  };
  let FourthRatingHandler = () => {
    setFirstRating(true);
    setSecondRating(true);
    setThirdRatign(true);
    setFourthRating(true);
    setFifthRating(false);
  };
  let FifthRatingHandler = () => {
    setFirstRating(true);
    setSecondRating(true);
    setThirdRatign(true);
    setFourthRating(true);
    setFifthRating(true);
  };

  const handleSubmitFeedback = (userId) => {
    let data = {
      review : feedback,
      rating: "3"
    }
    post("/ratings/by-provider/"+userId, data, config)
      .then((res) => {
        console.log("Feedback Results",res);
        window.location.reload();
      })
      .catch((err) => {
        console.log("Feedback Error",err);
      });
  }

  return (
    <div className="_purchase_container">
      <Grid container spacing={3}>
        <Grid item xl={2} lg={2} md={12} sm={12} xs={12}></Grid>
        <Grid item xl={8} lg={7} md={12} sm={12} xs={12}>
          <div className="_purchase_card_main">
            <div className="_feedback_message_card_image">
              <CarImage />
            </div>
            <h1 className="_feedback_message_heading">THANK YOU</h1>
            <div className="_feedback_message_rating_main">
              <button
                type="primary"
                className="_feedback_message_rating_btn"
                onClick={FirstRatingHandler}
              >
                {firstRating ? <FeedbackActiveIcon /> : <FeedbackIcon />}
              </button>
              <button
                type="primary"
                className="_feedback_message_rating_btn"
                onClick={SecondRatingHandler}
              >
                {secondRating ? <FeedbackActiveIcon /> : <FeedbackIcon />}
              </button>
              <button
                type="primary"
                className="_feedback_message_rating_btn"
                onClick={ThirdRatingHandler}
              >
                {thirdRating ? <FeedbackActiveIcon /> : <FeedbackIcon />}
              </button>
              <button
                type="primary"
                className="_feedback_message_rating_btn"
                onClick={FourthRatingHandler}
              >
                {fourthRating ? <FeedbackActiveIcon /> : <FeedbackIcon />}
              </button>
              <button
                type="primary"
                className="_feedback_message_rating_btn"
                onClick={FifthRatingHandler}
              >
                {fifthRating ? <FeedbackActiveIcon /> : <FeedbackIcon />}
              </button>
            </div>
            <p className="_feedback_message_sub_heading">
              How was your experience
            </p>
            <div className="_feedback_message_textarea_main">
              <TextArea
                rows={4}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Your Feedback"
                className="_feedback_message_textarea"
              />
            </div>
          </div>
        </Grid>
        <Grid item xl={2} lg={2} md={12} sm={12} xs={12}></Grid>
      </Grid>
      <Grid container>
        <Grid item xl={5} lg={4} md={3} sm={12} xs={12}></Grid>
        <Grid item xl={2} lg={4} md={6} sm={12} xs={12}>
          <Button className="_feedback_submit_btn" type="primary" onClick={() => handleSubmitFeedback(userId)}>
            SUBMIT
          </Button>
        </Grid>
        <Grid item xl={5} lg={4} md={3} sm={12} xs={12}></Grid>
      </Grid>
    </div>
  );
};
export default FeedbackMessage;
