import { patch, post } from "../services/RestService";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { openErrorNotification, openNotification } from "../helpers";
import { s3Client } from "../constants";
import { v4 as uuidv4 } from "uuid";

const config = {
  headers: {
    Authorization: "Bearer " + localStorage.getItem("token"),
  },
};

export const getServices = async (country) => {
  //console.log("=========>",`/categories/getCategoriesPublic?type=service`,country,config);
  const res = await post(
    `/categories/getCategoriesPublic?type=service`,
    { country },
    config
  );
  return res;
};

export const uploadS3File = async (file, setFile, name, setFileUploading) => {
  try {
    setFileUploading({ name, loading: true });
    let imageName = `${uuidv4()}/${file.name}`;
    const options = {
      Key: imageName,
      Bucket: "cdn.carbucks.com",
      Body: file,
    };

    await s3Client.send(new PutObjectCommand(options));
    let s3ImageLink = `https://s3.amazonaws.com/cdn.carbucks.com/${imageName}`;
    setFile({ image: s3ImageLink });
    setFileUploading({ name, loading: false });
  } catch (error) {
    setFileUploading({ name, loading: false });
  }
};

export const sendCode = async (email, history) => {
  try {
    const res = await patch(`/auth/users/send-email-verification-token`, {
      email,
    });
    openNotification(res.message);
    history.push(`/register?email=${email}`);
  } catch (error) {
    openNotification(error.message);
  }
};

export const register = async (data, setLoading) => {
  try {
    setLoading(true);
    const response = await post(`/auth/providers/register`, data);
    openNotification(
      "Thank you for registering with Otobucks! we have sent an otp on your email adress, if you did not receive it please check spam folder or contact support"
    );
    setLoading(false);
    return response;
  } catch (err) {
    setLoading(false);
    const errorMessage =
      err?.message || "Something went Wrong" 
    openErrorNotification(errorMessage);
  }
};
