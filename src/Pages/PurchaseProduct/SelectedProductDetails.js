import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "antd";
import Grid from "@mui/material/Grid";
import { addItemToCart } from "../../redux/actions/purchaseProducts";
import { IncrementIcon, SubtractIcon, BackIcon } from "./../../Icons";
import "./styles.scss";
const SelectedProductDetails = ({ setShowComponent, product, storeId }) => {
  const dispatch = useDispatch();
  const [counter, setCounter] = useState(1);
  const [loading, setLoading] = useState();

  const Decrement = () => {
    if (counter > 1) {
      setCounter(counter - 1);
    }
  };
  const Increment = () => {
    setCounter(counter + 1);
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

  return (
    <div className="_purchase_container">
      <div className="_car_mart_header_main">
        <div className="_back_btn_main">
          <Button
            type="primary"
            className="_back_btn"
            onClick={() => setShowComponent(2)}
          >
            <BackIcon />
          </Button>
          <h1 className="_purchase_heading">Back</h1>
        </div>
      </div>
      <Grid container spacing={3}>
        <Grid item xl={5} lg={5} md={12} sm={12} xs={12}>
          <div className="_product_details_image_main">
            <img
              src={showImage(product)}
              className="_selected_product_details_image"
              alt=""
            />
          </div>
          <Button
              className="_selected_product_details_add_btn"
              type="primary"
              disabled={loading}
              onClick={() =>
                dispatch(
                  addItemToCart(
                    product.id,
                    counter,
                    storeId,
                    "increment",
                    false,
                    setLoading,
                    setShowComponent
                  )
                )
              }
            >
              Add to cart
            </Button>
        </Grid>
        <Grid item xl={7} lg={7} md={12} sm={12} xs={12}>
          <div className="_product_details_data_main">
            <p className="_selected_product_details_heading"> <b> Title :-  </b> {product.title}</p>
            <p className="_selected_product_details_heading">
              <b>Brand :- </b>
              {product.brand}
            </p>
            <p className="_selected_product_details_heading">
              <b>Price :- </b>
              {product.wholesalePrice} {product.currency}
            </p>
            <p className="_selected_product_details_heading">
              <b>Warranty :- </b>
              {product?.warranty}
            </p>
            <p className="_selected_product_details_heading">
              <b>Features : </b>
              <div className="feature_box">
              {product?.features?.map((feature)=> <p>{feature}</p>)}
              </div>
            </p>
            <p className="_selected_product_details_heading">
              <b>Description : </b>
              <p className="_selected_product_details_des">{product?.description}</p>
            </p>
            {/* <h1 className="_selected_product_details_price">
              {product.currency}{" "}
              {counter *
                (product?.category?.slug === "buyacar/bike"
                  ? product?.details?.price
                  : product?.category?.slug === "autoinsurance"
                    ? product?.details?.policies[0].price
                    : product?.wholesalePrice)}
            </h1> */}
            {/* <div className="_selected_product_details_counter_main">
              <Button
                className="_product_add_counter_btn"
                type="primary"
                onClick={Decrement}
              >
                <SubtractIcon />
              </Button>
              <span className="_product_add_counter_show">{counter}</span>
              <Button
                className="_product_add_counter_btn"
                type="primary"
                onClick={Increment}
              >
                <IncrementIcon />
              </Button>
            </div> */}
          </div>
        </Grid>
      </Grid>
      {/* <div className="product_details_box">
        <div className="details">
          <div className="name"> Discription </div>
          <div className="detail"> {product?.description}</div>
        </div>
        <div className="details">
          <div className="name"> ActiveByAdmin </div>
          <div className="detail"> {product?.activeByAdmin}</div>
        </div>
        <div className="details">
          <div className="name"> Retail Price </div>
          <div className="detail"> {product?.retailPrice}</div>
        </div>
        <div className="details">
          <div className="name"> WholeSale Price </div>
          <div className="detail"> {product?.wholesalePrice}</div>
        </div>
        <div className="details">
          <div className="name"> Currency </div>
          <div className="detail"> {product?.currency}</div>
        </div>
        <div className="details">
          <div className="name"> Warranty </div>
          <div className="detail"> {product?.warranty}</div>
        </div>
        <div className="details">
          <div className="name"> Category Title </div>
          <div className="detail"> {product?.category?.title}</div>
        </div>
        <div className="details">
          <div className="name"> Category Type </div>
          <div className="detail"> {product?.category?.type}</div>
        </div>
        <div className="details">
          <div className="name"> Product Usage </div>
          <div className="detail"> {product?.category?.newOrOld} - {product?.category?.usage}</div>
        </div>
        <div className="details">
          <div className="name"> Provider Name </div>
          <div className="detail"> {product?.provider?.firstName} {product?.provider?.lastName}</div>
        </div>
        <div className="details">
          <div className="name"> Provider Email </div>
          <div className="detail"> {product?.provider?.email}</div>
        </div>
        <div className="details">
          <div className="name"> Store Name </div>
          <div className="detail"> {product?.stores[0]?.store?.name}</div>
        </div>
        <div className="details">
          <div className="name"> Store Address </div>
          <div className="detail"> {product?.stores[0]?.store?.address}</div>
        </div>
        <div className="details">
          <div className="name"> Store City </div>
          <div className="detail"> {product?.stores[0]?.store?.city}</div>
        </div>
        <div className="details">
          <div className="name"> Store State </div>
          <div className="detail"> {product?.stores[0]?.store?.state}</div>
        </div>
        <div className="details">
          <div className="name"> Store Country </div>
          <div className="detail"> {product?.stores[0]?.store?.country}</div>
        </div>
        <div className="details">
          <div className="name"> Features </div>
          <div className="detail"> {product?.features?.toString()}</div>
        </div>
      </div> */}
    </div>
  );
};
export default SelectedProductDetails;
