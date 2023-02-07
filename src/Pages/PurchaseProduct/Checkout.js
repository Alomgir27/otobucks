import "./styles.scss";

import React, { useEffect, useState } from "react";
import { addItemToCart, buyProductsHandler, getCartData } from "../../redux/actions/purchaseProducts";
import { get, options, post } from "../../services/RestService";
import { useDispatch, useSelector } from "react-redux";

import { BackIcon } from "./../../Icons";
import { Button } from "antd";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import { Input } from "antd";
import SelectBox from "../../Components/SelectBox";

const config = {
  headers: {
    Authorization: "Bearer " + localStorage.getItem("token"),
  },
};

const label = { inputProps: { "aria-label": "Checkbox demo" } };

let Checkout = ({ buyNowData, BackHandler, ProceesToPayHandler }) => {
  //console.log("buyNowData",buyNowData);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [allAddresses, setAllAddresses] = useState([]);
  const [allAddressesFormat, setAllAddressesFormat] = useState([]);
  const [selectedCard, setSelectedCard] = useState("");
  const [currentAddress, setCurrentAddress] = useState("");
  const [myCards, setMyCards] = useState([]);
  
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCvv] = useState();
  const [saveCard, setSaveCard] = useState(true);
  const [error, setError] = useState("");
  const [payError, setPayError] = useState("");
  const [proceesToPayLabel, setProceesToPayLabel] = useState("Procees to pay");
  const [confirmYourCard, setConfirmYourCard] = useState("Confirm Your Card");
  const [cardAddedMessage, setCardAddedMessage] = useState("");
  
  let storeID = useSelector((state) => state?.purchaseProducts.storeId);

  let total_amount = 0;
  let current_currancy = "$";
  
  if(buyNowData && buyNowData !== undefined && buyNowData.currancy != "" ){
    current_currancy = buyNowData.currancy;
  }

  if(buyNowData && buyNowData.delivery && buyNowData !== undefined){
    total_amount += deliveryCharge;
  }
  if(buyNowData && buyNowData !== undefined && buyNowData.productTotal && buyNowData.productTotal > 0){
    total_amount += buyNowData.productTotal;
  }
  if(buyNowData && buyNowData !== undefined && buyNowData.taxTotal && buyNowData.taxTotal > 0){
    total_amount += buyNowData.taxTotal;
  }

  const handleChecked = (checked) => {
    if(checked){
      setSaveCard(true);
    } else {
      setSaveCard(false);
    }
  }

  function getStores() {
    get(`/stores/${storeID}`, config)
      .then((res) => {
        if(res.result.deliver && res.result.deliver !== false){
          setDeliveryCharge(res.result.deliveryDetails.charge);
        }
      })
      .catch((err) => {});
  }

  const getAddress = () => {
    let tempData = [];
    get("/address", options).then((res) => {
      if(res && res.result && res.result[0] != false){
        let final_loop = res.result[0];
        if(final_loop && final_loop.length > 0){
          final_loop.map((item,index) => {
            if(buyNowData?.address == item._id){
              setCurrentAddress(item.addressOne+" "+item.addressTwo+" ,"+item.city+" "+item.state+" "+item.country+" - "+item.postal_code);
            }
          });
          setAllAddresses(tempData);
        }
      }
    });
  };

  const myAllCards = () => {
    let tempData = [];
    get("/cards", options).then((res) => {
      setMyCards(res.result.data);
      let final_loop = res.result.data;
      if(final_loop && final_loop.length > 0){
        final_loop.map((item,index) => {
          if(item.last4 != "" && item.last4 !== undefined){
            let objData = {
              value: item.id,
              title: item.name+" - ****"+item.last4+" ,"+item.exp_month+" "+item.exp_year
            }
            tempData.push(objData);
          }
        });
        setAllAddressesFormat(tempData);
      }
    })
  }

  const placeOrder = () => {
    setPayError("");
    setProceesToPayLabel("Please Wait...");
    if(selectedCard == ''){
      setPayError("Please select your card for the payment");
    } else {
      let payDetails = {
        source: selectedCard,
        delivery: buyNowData.delivery,
        shipping_address: currentAddress && currentAddress != "" ? currentAddress : buyNowData?.address,
        paymentType: "card",
        savecard: saveCard,
        date: buyNowData.deliver_date,
        note: buyNowData.delivery ? "To be delivered on "+buyNowData.deliver_date : "Customer Will pick order on "+buyNowData.deliver_date,
        files: [],
      }
      post("/bookings/productCheckout", payDetails, config)
      .then((res) => {
        console.log("Place Order Details",res.booking[0]);
        ProceesToPayHandler();
        setProceesToPayLabel("Procees to pay");
      })
      .catch((err) => {
        console.log("Error",err.error.message);
        setPayError(err.error.message);
        setProceesToPayLabel("Procees to pay");
      });
      //ProceesToPayHandler();
      //console.log("payDetails ---->",payDetails);
    }
  }

  const handleAddCard = () => {
    setError("");
    setConfirmYourCard("Please Wait...");
    if(cardHolderName == ""){
      setError("Please enter card holder name !!!");
    } else if(cardNumber == ""){
      setError("Please enter card number !!!");
    } else if(cardNumber != "" && cardNumber.length != 16){
      setError("Please enter 16 digit card number !!!");
    } else if(expiryMonth == ""){
      setError("Please enter expiry month");
    } else if(expiryMonth != "" && expiryMonth.length != 2){
      setError("Please enter month in number !!!");
    } else if(expiryYear == ""){
      setError("Please enter expiry year");
    } else if(expiryYear != "" && expiryYear.length != 4){
      setError("Please enter month in year !!!");
    } else if(cvv == ""){
      setError("Please enter cvv");
    } else if(cvv != "" && cvv.length != 3){
      setError("Please enter 3 digit cvv number !!!");
    } else {
      let cardData = {
        cvc : cvv,
        exp_month : expiryMonth,
        exp_year : expiryYear,
        name: cardHolderName,
        number: cardNumber,
      }

      post("/cards", cardData, options)
      .then((res) => {
        //console.log("res.result ===>",res.result,"=========>",res.result.id);
        setSelectedCard(res.result.id)
        setCardHolderName("");
        setCardNumber("");
        setExpiryMonth("");
        setExpiryYear("");
        setCvv("");
        setConfirmYourCard("Confirm Your Card");
        setCardAddedMessage("Card Successfully Confirmed. Please proceed to pay !!!")
        myAllCards();
      })
      .catch((error) => {
        setConfirmYourCard("Confirm Your Card");
        setError(error.message);
        console.log("Error",error);
        myAllCards();
      });
    }
  }
  
  useEffect(() => {
    getAddress();
    getStores();
    myAllCards();
  }, []);

  const expiryDate = buyNowData?.card?.exp_year
    ? `${buyNowData?.card?.exp_month}/${buyNowData?.card?.exp_year
        ?.toString()
        ?.substr(-2)}`
    : "";
  return (
    <div className="_purchase_container">
      <div className="_car_mart_header_main">
        <div className="_back_btn_main">
          <Button type="primary" className="_back_btn" onClick={BackHandler}>
            <BackIcon />
          </Button>

          <h1 className="_confirm_heading">Checkout</h1>
        </div>
      </div>
      <Grid container spacing={3}>
        <Grid item xl={7} lg={7} md={12} sm={12} xs={12}>
          <div className="_checkout_card_main">
            
            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
              <div className="_checkout_pay_card_input_main1">
                <p className="lbl" style={{color:"#9c9b9b", marginBottom:10}}>
                  Select Your Card For The Payment
                </p>
                <SelectBox
                  onChange={(e) => setSelectedCard(e)}
                  placeholder="Select Your Delivery Address"
                  rules={[{ required: true, message: "Required" }]}
                  data={allAddressesFormat}
                  name="address"
                />
              </div>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                <p className="checkout-new-card">Add New Card?</p>
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xl={9} lg={9} md={9} sm={12} xs={12}>
                <div className="_checkout_pay_card_main">
                  <div className="_checkout_pay_card_header_main">
                    <div className="_checkout_pay_card_input_main">
                      <p className="_checkout_pay_card_heading2">Name On Card</p>
                      <Input
                        className="_checkout_pay_card_input"
                        placeholder="Name On Card"
                        onChange={(cardHolderName) =>
                          setCardHolderName(cardHolderName.target.value)
                        }
                      />
                    </div>

                    <div className="_checkout_pay_card_input_main">
                      <p className="_checkout_pay_card_heading2">Card Number</p>
                      <Input
                        className="_checkout_pay_card_input"
                        placeholder="Card Number"
                        maxLength={16}
                        onChange={(cardNumber) =>
                          setCardNumber(cardNumber.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="_checkout_pay_card_header_main">
                    <div className="_checkout_pay_card_input_main">
                      <p className="_checkout_pay_card_heading2">Expiry Month</p>
                      <input
                        name="exp_month"
                        onChange={(e) => setExpiryMonth(e.target.value)}
                        type="number"
                        style={{width:'80%'}}
                        maxLength={2}
                        className="txt cleanbtn"
                        placeholder="MM"
                      />
                    </div>
  
                    <div className="_checkout_pay_card_input_main">
                      <p className="_checkout_pay_card_heading2">Expiry Year</p>
                      <input
                        name="exp_year"
                        onChange={(e) => setExpiryYear(e.target.value)}
                        type="number"
                        style={{width:'80%'}}
                        maxLength={4}
                        className="txt cleanbtn"
                        placeholder="YYYY"
                      />
                    </div>
                  </div>
  
                  <div className="_checkout_pay_card_header_main">
                    <div className="_checkout_pay_card_input_main">
                      <p className="_checkout_pay_card_heading2">CVV</p>
                      <Input
                        className="_checkout_pay_card_input"
                        placeholder="CVV"
                        onChange={(e) => setCvv(e.target.value)}
                      />
                    </div>                
                  </div>
                  
                  

                  { 
                    error && error != "" && error !== undefined && 
                    <div className="_checkout_pay_card_checkbox_main" style={{width:'100%',color:'red'}}>
                      <p>{error}</p>
                    </div>
                  }
                  <div className="_checkout_pay_card_checkbox_main">
                    <div className="_checkout_pay_card_checkbox_main">
                      <Checkbox {...label} onChange={(e) => handleChecked(e.target.checked)} defaultChecked />
                      <p className="_checkout_pay_card_checkbox_heading">
                        Save the card for further transactions
                      </p>
                    </div>
                  </div>
                  { 
                    cardAddedMessage && cardAddedMessage != "" && cardAddedMessage !== undefined && 
                    <div className="_checkout_pay_card_checkbox_main" style={{width:'100%',color:'green'}}>
                      <p>{cardAddedMessage}</p>
                    </div>
                  }
                  <div className="_checkout_pay_card_checkbox_main">
                    <Button
                      className="_my_wallet_withdraw_withdraw_money_btn"
                      type="primary"
                      onClick={() => handleAddCard()}
                    >{confirmYourCard}</Button>
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>
        </Grid>
        <Grid item xl={5} lg={5} md={12} sm={12} xs={12}>
          <div className="_purchase_card_main">
            <p className="_checkout_delivery_address_heading">
              Delivery Address
            </p>
            <p>
              <span className="_confirm_product_radio_heading"></span>{" "}
              <span className="_confirm_product_radio_des">
                { currentAddress && currentAddress != "" ? currentAddress : buyNowData?.address } ({ buyNowData.deliver_date})
              </span>
            </p>
            <div className="_confirm_product_line" />

            <div className="_confirm_product_price_details_main">
              <p className="_confirm_product_price_details_title">Subtotal</p>
              <p className="_confirm_product_price_details_title">{current_currancy}{buyNowData !== undefined && buyNowData?.subTotal > 0 ? buyNowData?.subTotal : 0}</p>
            </div>

            <div className="_confirm_product_price_details_main">
              <p className="_confirm_product_price_details_title">Tax</p>
              <p className="_confirm_product_price_details_title">{current_currancy}{buyNowData !== undefined && buyNowData.taxTotal > 0 ? buyNowData.taxTotal : 0}</p>
            </div>

            {
              buyNowData !== undefined && buyNowData.delivery && <div className="_confirm_product_price_details_main">
              <p className="_confirm_product_price_details_title">Delivery</p>
              <p className="_confirm_product_price_details_title">{current_currancy}{deliveryCharge}</p>
            </div>
            }
            

            <div className="_confirm_product_price_details_main">
              <p className="_confirm_product_price_details_title">
                Total Amount
              </p>
              <p className="_confirm_product_price_details_total_price">
              {current_currancy}{total_amount}
              </p>
            </div>
            {
              payError && payError != "" && payError !== undefined && 
              <div className="_checkout_pay_card_checkbox_main" style={{width:'100%',color:'red',justifyContent: 'center'}}>
                <p>{payError}</p>
              </div>
            }
            <div className="_confirm_product_buy_btn_main">
            {
              proceesToPayLabel == 'Please wait...' && <Button
                className="_checkout_procced_to_pay_btn"
                type="primary"
              >
                {proceesToPayLabel}
              </Button>
            }
            {
              proceesToPayLabel != 'Please wait...' && <Button
                className="_checkout_procced_to_pay_btn"
                type="primary"
                onClick={() => {placeOrder()}}
              >
                {proceesToPayLabel}
              </Button>
            }
              
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};
export default Checkout;
