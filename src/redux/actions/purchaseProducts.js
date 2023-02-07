import {
  addToCart,
  buyProducts,
  getMineCart,
  getProductsData,
  getStores,
  getSubCategories,
} from "../../Api/purchaseProducts";

import { actionTypes } from "../types";

export const getAllStores = (setLoading) => async (dispatch) => {
  const response = await getStores(setLoading);
  dispatch({
    type: actionTypes.SET_ALL_STORES,
    payload: response?.result,
  });
};

export const getCartData = () => async (dispatch) => {
  const response = await getMineCart();
  dispatch({ type: actionTypes.SET_CART_DATA, payload: response?.result });
};

export const getSubcategories = () => async (dispatch) => {
  const response = await getSubCategories();
  dispatch({
    type: actionTypes.SET_SUBCATEGORIES,
    payload: [{ title: "All" }, ...response?.result],
  });
};

export const getProducts =
  (activeTag, storeId, setLoading) => async (dispatch) => {
    const response = await getProductsData(activeTag, storeId, setLoading);
    dispatch({ type: actionTypes.SET_PRODUCTS, payload: response?.result });
  };

export const setStoreId = (storeID) => (dispatch) => {
  dispatch({ type: actionTypes.SET_STORE_ID, payload: storeID });
};

export const setAddress =
  (activeTag, storeId, setLoading) => async (dispatch) => {
    const response = await getProductsData(activeTag, storeId, setLoading);
    dispatch({ type: actionTypes.SET_ADD_ADDRESS, payload: response?.result });
  };
//
export const addItemToCart =
  (
    productId,
    quantity,
    storeId,
    status,
    deleteProduct = false,
    setLoading,
    setShowComponent
  ) =>
  async (dispatch) => {
    try {
      await addToCart(
        productId,
        quantity,
        storeId,
        status,
        deleteProduct,
        setLoading,
        setShowComponent
      );
      dispatch(getCartData());
    } catch (error) {}
  };

export const buyProductsHandler =
  (
    data,
    setLoading,
    buyNowHandler,
    subTotal,
    card,
    address,
    taxTotal,
    delivery,
    currancy,
    deliver_date
  ) =>
  async (dispatch) => {
    await buyProducts(
      data,
      setLoading,
      buyNowHandler,
      subTotal,
      card,
      address,
      taxTotal,
      delivery,
      currancy,
      deliver_date
    );
  };
