import {
  AddNewAddress,
  createNewStore,
  deleteSpecificStore,
  getProductCategories,
  getStores,
  getSubcategories,
  getUserData,
  updateUserData,
  uploadAvatar,
} from "../../Api/profile";

import { actionTypes } from "../types";

export const setUnreadChats = (unReadChats) => (dispatch) => {
  dispatch({
    type: actionTypes.SET_UNREAD_CHATS,
    payload: unReadChats,
  });
};

export const getUserProfileData = (setLoading) => async (dispatch) => {
  const response = await getUserData(setLoading);
  dispatch({
    type: actionTypes.SET_USER_DATA,
    payload: { ...response?.result, currency: response?.currency },
  });
};

export const getProductCategory = (setLoading) => async (dispatch) => {
  const response = await getProductCategories(setLoading);
  dispatch({
    type: actionTypes.SET_SERVICE_CATEGORIES,
    payload: response?.result,
  });
};

export const getSubCategories = (id) => async (dispatch) => {
  const response = await getSubcategories(id);
  dispatch({
    type: actionTypes.SET_SERVICE_SUBCATEGORIES,
    payload: response?.result,
  });
};

export const getUserStores = (setLoading) => async (dispatch) => {
  const response = await getStores(setLoading);
  dispatch({
    type: actionTypes.SET_USER_STORES,
    payload: response?.result,
  });
};

export const getCustomerAddress = (setLoading) => async (dispatch) => {
  const response = await getCustomerAddress(setLoading);
  dispatch({
    type: actionTypes.GET_CUSTOMER_ADDRESS,
    payload: response?.result,
  });
};

export const AddAddress = (data) => async (dispatch) => {
  const response = await AddNewAddress(data);
  dispatch({
    type: actionTypes.SET_ADD_ADDRESS,
    payload: response?.result,
  });
};

export const uploadUserPictures =
  (
    file,
    image,
    setPicUrlBrochure,
    setImgBrochure,
    setLoading,
    setImageUploading
  ) =>
  async (dispatch) => {
    await uploadAvatar(
      file,
      image,
      setPicUrlBrochure,
      setImgBrochure,
      setLoading,
      setImageUploading
    );
  };

export const createStore = (data, setLoading, setOpen2) => async (dispatch) => {
  await createNewStore(data, setOpen2);
  dispatch(getUserStores(setLoading));
};

export const updateUser = (setLoading, data, setOpen) => async (dispatch) => {
  await updateUserData(setLoading, data, setOpen);
  dispatch(getUserProfileData(setLoading));
};

export const deleteStore = (id, setLoading) => async (dispatch) => {
  await deleteSpecificStore(id);
  dispatch(getUserStores(setLoading));
};
