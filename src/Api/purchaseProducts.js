import { get, post } from "../services/RestService";

import { openNotification } from "../helpers";

const config = {
  headers: {
    Authorization: "Bearer " + localStorage.getItem("token"),
  },
};

export const getStores = async (setLoading) => {
  try {
    setLoading(true);
    const res = await get(`/stores`, config);
    setLoading(false);
    return res;
  } catch (error) {
    setLoading(false);
  }
};

export const getMineCart = async () => {
  try {
    const res = await get(`/cart/mine`, config);
    return res;
  } catch (error) {}
};

export const getSubCategories = async () => {
  try {
    const res = get(`/categories/getSubCategories?type=product`, config);
    return res;
  } catch (error) {}
};

export const getProductsData = async (activeTag, storeId, setLoading) => {
  try {
    setLoading(true);
    const subcategoryParam =
      activeTag.title === "All" ? "" : `&subcategory=${activeTag._id}`;
    const res = await get(
      `/products?storeId=${storeId}${subcategoryParam}`,
      config
    );
    setLoading(false);
    return res;
  } catch (error) {
    setLoading(false);
  }
};

export const addToCart = async (
  productId,
  quantity,
  storeId,
  status,
  deleteProduct = false,
  setLoading,
  setShowComponent
) => {
  try {
    setLoading(productId);
    const data = {
      productId,
      quantity,
      storeId,
      deleteProduct,
    };
    const endpoint = status === "increment" ? "add-item" : "remove-item";
    await post(`/cart/${endpoint}`, data, config);
    setLoading("");
    setShowComponent && setShowComponent(2);
  } catch (error) {
    openNotification(error?.message);
    setLoading("");
  }
};

export const buyProducts = async (
  data,
  setLoading,
  buyNowHandler,
  subTotal,
  taxTotal,
  delivery,
  card,
  address,
  currancy,
  deliver_date
) => {
  try {
    setLoading("buyProducts");
    data.taxTotal = taxTotal;
    data.productTotal = subTotal;
    //await post(`/bookings/productCheckout`, data, config);
    buyNowHandler(
      subTotal,
      card,
      address,
      taxTotal,
      delivery,
      subTotal,
      subTotal + taxTotal + delivery ? 20 : 0,
      currancy,
      deliver_date
    );
    setLoading("");
  } catch (error) {
    openNotification("Invalid card details");
    setLoading("");
  }
};
