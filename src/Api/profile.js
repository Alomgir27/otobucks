import "react-toastify/dist/ReactToastify.css";

import { deleteService, get, patch, post } from "../services/RestService";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../constants";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { openNotification } from "../helpers";

toast.configure();

const config = {
  headers: {
    Authorization: "Bearer " + localStorage.getItem("token"),
  },
};

export const getUserData = async (setLoading) => {
  try {
    setLoading && setLoading(true);
    const res = await get(`/auth/users/currentUser`, config);
    setLoading && setLoading(false);
    return res;
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const getProductCategories = async (setLoading) => {
  try {
    setLoading(true);
    const res = await get(`/categories/getCategories?type=service`, config);
    setLoading(false);
    return res;
  } catch (error) {
    setLoading(false);
  }
};

export const getStores = async (setLoading) => {
  try {
    setLoading(true);
    const res = await get(`/stores/mine`, config);
    setLoading(false);
    return res;
  } catch (error) {
    setLoading(false);
  }
};

export const updateUserProviders = async (s3ImageLink, image, setLoading) => {
  try {
    const res = await patch(
      `/auth/providers/updateMe`,
      { [image]: s3ImageLink },
      config
    );
    setLoading(false);
    toast.success(`${res?.message}`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  } catch (error) {
    setLoading(false);
    toast.error(`Error on Update Profile`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }
};

export const uploadAvatar = async (
  file,
  image,
  setPicUrlBrochure,
  setImgBrochure,
  setLoading,
  setImageUploading
) => {
  try {
    setLoading && setLoading(true);
    setImageUploading && setImageUploading(true);
    let imageName = `${uuidv4()}.png`;
    const options = {
      Key: imageName,
      Bucket: "cdn.carbucks.com",
      Body: file,
    };
    await s3Client.send(new PutObjectCommand(options));
    let s3ImageLink = `https://s3.amazonaws.com/cdn.carbucks.com/${imageName}`;
    setImgBrochure && setImgBrochure(s3ImageLink);
    image && updateUserProviders(s3ImageLink, image, setLoading);
    setImageUploading && setImageUploading(false);
    setLoading && setLoading(false);
   
  } catch (error) {
    setPicUrlBrochure && setPicUrlBrochure("");
    setImageUploading && setImageUploading(false);
    setLoading && setLoading(false);
    toast.error(`Error on Uploading Image`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }
};

export const updateUserData = async (setLoading, data, setOpen) => {
  try {
    setLoading(true);
    const res = await patch(`/auth/providers/updateMe`, data, config);
    openNotification("Updated successfully");
    setLoading(false);
    setOpen && setOpen(false);
    return res;
  } catch (error) {
    openNotification(error?.message);
    setLoading(false);
  }
};

export const deleteSpecificStore = async (id) => {
  try {
    await deleteService(`/stores/${id}`, config);
  } catch (error) {}
};

export const createNewStore = async (data, setOpen2) => {
  try {
    const res = await post(`/stores`, data, config);
    setOpen2(false);
    return res;
  } catch (error) {}
};

export const getSubcategories = async (id) => {
  try {
    const res = await get(`/categories/getSubCategories/${id}`, config);
    return res;
  } catch (error) {}
};

export const AddNewAddress = async (data, setOpen) => {
  try {
    const res = await post(`/address`, data, config);
    setOpen && setOpen(false);
    return res;
  } catch (error) {
    console.log(error);
  }
};
