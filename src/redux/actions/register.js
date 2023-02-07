import {
  getServices,
  uploadS3File,
  sendCode,
  register,
} from "../../Api/register";
import { actionTypes } from "../types";

export const getAllServices = (country) => async (dispatch) => {
  const response = await getServices(country);
  dispatch({
    type: actionTypes.SET_SERVICE_CATEGORIES,
    payload: response?.result,
  });
};

export const uploadFile =
  (file, setFile, name, setFileUploading) => async (dispatch) => {
    await uploadS3File(file, setFile, name, setFileUploading);
  };

export const sendVerificationCode = (email, history) => async (dispatch) => {
  await sendCode(email, history);
};

export const registerUser = (data, history, setLoading) => async (dispatch) => {
  try {
    const res = await register(data, setLoading);
    res && dispatch(sendVerificationCode(data?.email, history));
  } catch (error) {}
};
