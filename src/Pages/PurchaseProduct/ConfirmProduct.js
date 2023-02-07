import "./styles.scss";

import {
  BackIcon,
  DeleteIcon,
  IncrementIcon,
  SubtractIcon,
} from "./../../Icons";
import { Button, DatePicker, Spin } from "antd";
import React, { useEffect, useState } from "react";
import {
  addItemToCart,
  buyProductsHandler,
} from "../../redux/actions/purchaseProducts";
import { get, options } from "../../services/RestService";
import { useDispatch, useSelector } from "react-redux";

import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import SelectBox from "../../Components/SelectBox";
import { openNotification } from "../../helpers";

const config = {
  headers: {
    Authorization: "Bearer " + localStorage.getItem("token"),
  },
};

const ConfirmProduct = ({
  BackHandler,
  AddNewAddressHandler,
  address,
  buyNowHandler,
}) => {
  const dispatch = useDispatch();
  let cart = useSelector((state) => state?.purchaseProducts?.cart?.items);
  let storeID = useSelector((state) => state?.purchaseProducts.storeId);
  const [pickupDeliveryDate, setPickupDeliveryDate] = useState();
  const [cartItems, setCartItems] = useState(cart);
  const [delivery, setDelivery] = useState(true);
  const [storeAddress, setStoreAddress] = useState("");
  const [completeAddress, setCompletedAddress] = useState("");
  const [allAddresses, setAllAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedAddressDetails, setSelectedAddressDetails] = useState("");
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [loading, setLoading] = useState();
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [cards, setCards] = useState([]);
  const setAddress = () => {
    let newAddress = "";
    address &&
      Object.keys(address).forEach((key, index) => {
        let isComma = index === 2 ? "" : ", ";
        newAddress = newAddress + address[key] + isComma;
      });
    setCompletedAddress(newAddress);
  };

  const getAddress = () => {
    let tempData = [];
    get("/address", options).then((res) => {
      if (res && res.result && res.result[0] !== false) {
        let final_loop = res.result[0];
        if (final_loop && final_loop.length > 0) {
          final_loop.map((item, index) => {
            let objData = {
              value: item._id,
              title:
                item.addressOne +
                " " +
                item.addressTwo +
                " ," +
                item.city +
                " " +
                item.state +
                " " +
                item.country +
                " - " +
                item.postal_code,
            };
            tempData.push(objData);
          });
          setAllAddresses(tempData);
        }
      }
    });
  };

  const getCards = () => {
    get("/cards", options).then((res) => setCards(res.result.data));
  };

  async function getStores() {
    await get(`/stores/${storeID}`, config)
      .then((res) => {
        setStoreAddress(
          res.result.address + " " + res.result.city + " ," + res.result.country
        );
        if (res.result.deliver && res.result.deliver !== false) {
          let deliveryCharge = res.result.deliveryDetails.charge;
          setDeliveryCharge(res.result.deliveryDetails.charge);
        }
      })
      .catch((err) => {});
  }

  useEffect(() => {
    getCards();
    getAddress();
    getStores();
  }, []);

  let subTotal = 0;
  let taxTotal = 0;
  let finalTotal = 0;

  cartItems.forEach((item) => {
    subTotal = subTotal + item.price * item.quantity;
  });

  taxTotal = (parseFloat(subTotal) * parseInt(5)) / parseInt(100);
  if (taxTotal > 0) {
    finalTotal = taxTotal + subTotal;
  }

  function onChangeDate(date, dateString) {
    setPickupDeliveryDate(dateString);
  }

  /// BuyHandler Start //
  const buyHandler = () => {
    if (delivery && !selectedAddress) {
      openNotification("Please Select Address");
      return;
    }

    if (!pickupDeliveryDate) {
      openNotification("Please Select date");
      return;
    }

    let today = new Date();
    let yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;

    today = yyyy + "-" + mm + "-" + dd;
    let selectedDate = pickupDeliveryDate;

    let date1 = new Date(today);
    let date2 = new Date(selectedDate);
    if (date2 < date1) {
      openNotification("Please select date greater then today !!!");
      return;
    } else {
      if (
        selectedAddress &&
        selectedAddress !== "" &&
        selectedAddress !== undefined
      ) {
        get("/address", options).then((res) => {
          if (res && res.result && res.result[0] !== false) {
            let final_loop = res.result[0];
            if (final_loop && final_loop.length > 0) {
              final_loop.map((item, index) => {
                if (selectedAddress === item._id) {
                  setSelectedAddressDetails(
                    item.addressOne +
                      " " +
                      item.addressTwo +
                      " ," +
                      item.city +
                      " " +
                      item.state +
                      " " +
                      item.country +
                      " - " +
                      item.postal_code
                  );
                }
              });
            }
          }
        });
      }
      const myData = {
        source: cards[0]?.id,
        delivery: delivery,
        paymentType: "card",
        cards: cards,
        date: pickupDeliveryDate,
        cardTotal: subTotal,
        shipping_address: selectedAddress,
      };

      dispatch(
        buyProductsHandler(
          myData,
          setLoading,
          buyNowHandler,
          subTotal,
          taxTotal,
          delivery,
          cards[0],
          selectedAddress,
          cartItems && cartItems[0]?.currency ? cartItems[0]?.currency : "$",
          pickupDeliveryDate +
            " " +
            selectedTime.getHours() +
            ":" +
            selectedTime.getMinutes()
        )
      );
    }
  };
  /// BuyHandler Over //

  let ItemCounterIncrement = (i) => {
    cartItems[i].quantity = cartItems[i].quantity + 1;
    setCartItems([...cartItems]);
  };

  let ItemCounterDecrement = (i) => {
    if (cartItems[i].quantity > 1) {
      cartItems[i].quantity = cartItems[i].quantity - 1;
      setCartItems([...cartItems]);
    }
  };

  const showImage = (product) => {
    let src = "";
    try {
      src = JSON.parse(product.image);
    } catch (e) {
      src = product.image[0];
    }
    return src;
  };

  const handleDeliveryAddress = (status) => {
    setDelivery(status);
    if (!status) {
      setSelectedAddress(storeAddress);
    }
  };

  return (
    <div className="_purchase_container">
      <div className="_car_mart_header_main">
        <div className="_back_btn_main">
          <Button type="primary" className="_back_btn" onClick={BackHandler}>
            <BackIcon />
          </Button>
          <h1 className="_confirm_heading">Cart</h1>
        </div>
      </div>
      {cartItems.length === 0 ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
            fontSize: "40px",
          }}
        >
          {" "}
          Your cart is Empty{" "}
        </div>
      ) : (
        <Grid container spacing={3}>
          <Grid item xl={7} lg={7} md={12} sm={12} xs={12}>
            <div className="_purchase_card_main">
              {cartItems.map((item, index) => {
                return loading === item.source.id ? (
                  <div className="addItemToCartLoader">
                    <Spin />
                  </div>
                ) : (
                  item.quantity > 0 && (
                    <div className="_confirm_products_list_main" key={index}>
                      <div className="_confirm_products_list_img_main">
                        <img
                          src={showImage(item?.source)}
                          className="_confirm_products_list_img"
                          alt=""
                        />
                      </div>
                      <div className="_confirm_products_list_product_details_main">
                        <div>
                          <p className="_confirm_products_list_card_heading">
                            {item.source.title}
                          </p>
                          <p className="_confirm_products_list_card_des">
                            {item.source.description}
                          </p>
                          <div className="_selected_product_details_counter_main">
                            <Button
                              className="_confirm_product_add_counter_btn"
                              type="primary"
                              onClick={() => {
                                ItemCounterDecrement(index);
                                dispatch(
                                  addItemToCart(
                                    item.source.id,
                                    1,
                                    item.store,
                                    "decrement",
                                    false,
                                    setLoading
                                  )
                                );
                              }}
                            >
                              <SubtractIcon />
                            </Button>
                            <span className="_product_add_counter_show">
                              {item.quantity}
                            </span>
                            <Button
                              className="_confirm_product_add_counter_btn"
                              type="primary"
                              onClick={() => {
                                ItemCounterIncrement(index);
                                dispatch(
                                  addItemToCart(
                                    item.source.id,
                                    1,
                                    item.store,
                                    "increment",
                                    false,
                                    setLoading
                                  )
                                );
                              }}
                            >
                              <IncrementIcon />
                            </Button>
                          </div>
                        </div>
                        <div className="_confirm_product_delete_section_main">
                          <button
                            className="_confirm_product_delete_btn"
                            onClick={() => {
                              cartItems.splice(index, 1);
                              setCartItems([...cartItems]);
                              dispatch(
                                addItemToCart(
                                  item.source.id,
                                  item.quantity,
                                  item.store,
                                  "decrement",
                                  true,
                                  setLoading
                                )
                              );
                            }}
                          >
                            <DeleteIcon />
                          </button>
                          <h1 className="_confirm_product_card_price">
                            ${item.price * item.quantity}
                          </h1>
                        </div>
                      </div>
                    </div>
                  )
                );
              })}
            </div>
          </Grid>
          <Grid item xl={5} lg={5} md={12} sm={12} xs={12}>
            <div className="_purchase_card_main">
              <div className="_confirm_product_delivery_btn_main">
                <Button
                  className={
                    delivery
                      ? "_confirm_product_delivery_btn"
                      : "_confirm_product_pickup_btn"
                  }
                  type="primary"
                  onClick={() => handleDeliveryAddress(true)}
                >
                  Delivery
                </Button>
                <Button
                  className={
                    delivery
                      ? "_confirm_product_pickup_btn"
                      : "_confirm_product_delivery_btn"
                  }
                  type="primary"
                  onClick={() => handleDeliveryAddress(false)}
                >
                  Pickup
                </Button>
              </div>

              <div className="_confirm_product_select_address_main"></div>
              {delivery && (
                <div>
                  <div className="_confirm_product_select_address_main">
                    <h1 className="_confirm_product_select_address_heading _confirm_product_select_address_heading2">
                      <SelectBox
                        onChange={(e) => setSelectedAddress(e)}
                        placeholder="Select Your Delivery Address"
                        rules={[{ required: true, message: "Required" }]}
                        data={allAddresses}
                        name="address"
                      />
                    </h1>
                  </div>
                  <div className="_confirm_product_select_address_main">
                    <button
                      className="_confirm_product_delete_btn"
                      onClick={AddNewAddressHandler}
                    >
                      <span className="_confirm_product_select_address_btn_text">
                        {address ? "Edit" : "+ Add New"} Address
                      </span>
                    </button>
                  </div>
                  {completeAddress && completeAddress != "" && (
                    <div style={{ marginTop: "10px" }}>
                      <div>{completeAddress}</div>
                    </div>
                  )}
                </div>
              )}
              {delivery === false && (
                <div>
                  <div className="_confirm_product_select_address_main">
                    <h1 className="_confirm_product_select_address_heading _confirm_product_select_address_heading2">
                      {storeAddress}
                    </h1>
                  </div>
                </div>
              )}
              <div className="_confirm_product_line" />
              <div className="_confirm_product_select_address_main">
                <h1 className="_confirm_product_select_address_heading">
                  Select Date
                </h1>
              </div>
              <DatePicker
                onChange={onChangeDate}
                style={{ width: "100%", marginTop: "10px", Height: "35px" }}
              />

              {delivery && (
                <div className="_confirm_product_price_details_main_timings">
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <TimePicker
                      label="Time"
                      value={selectedTime}
                      onChange={(value) => setSelectedTime(value)}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </div>
              )}

              <div className="_confirm_product_price_details_main">
                <p className="_confirm_product_price_details_title">Subtotal</p>
                <p className="_confirm_product_price_details_title">
                  {cartItems[0]?.currency ? cartItems[0].currency : "$"}
                  {subTotal}
                </p>
              </div>

              {delivery && (
                <div className="_confirm_product_price_details_main">
                  <p className="_confirm_product_price_details_title">
                    Delivery Charge
                  </p>
                  <p className="_confirm_product_price_details_title">
                    {cartItems[0]?.currency ? cartItems[0].currency : "$"}
                    {deliveryCharge}
                  </p>
                </div>
              )}

              <div className="_confirm_product_price_details_main">
                <p className="_confirm_product_price_details_title">Tax</p>
                <p className="_confirm_product_price_details_title">
                  {cartItems[0]?.currency ? cartItems[0].currency : "$"}
                  {taxTotal}
                </p>
              </div>

              <div className="_confirm_product_price_details_main">
                <p className="_confirm_product_price_details_title">
                  Total Amount
                </p>
                <p className="_confirm_product_price_details_total_price">
                  ${delivery ? finalTotal + deliveryCharge : finalTotal}
                </p>
              </div>

              <div className="_confirm_product_buy_btn_main">
                <Button
                  className="_confirm_product_buy_btn"
                  type="primary"
                  onClick={() => buyHandler()}
                  disabled={loading}
                >
                  {loading === "buyProducts" ? <Spin /> : "Buy Now"}
                </Button>
              </div>
            </div>
          </Grid>
        </Grid>
      )}
    </div>
  );
};
export default ConfirmProduct;
