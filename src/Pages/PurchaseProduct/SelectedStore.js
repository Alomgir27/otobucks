import "./styles.scss";

import { BackIcon, CartIcon, SearchIcon } from "./../../Icons";
import { Button, Input, Spin } from "antd";
import React, { useEffect, useState } from "react";
import {
  getCartData,
  getProducts,
  getSubcategories,
  setStoreId,
} from "../../redux/actions/purchaseProducts";
import { useDispatch, useSelector } from "react-redux";

import Grid from "@mui/material/Grid";
import { get } from "../../services/RestService";
import { options } from "../../helpers";

const SelectedStore = ({
  storeId,
  BackHandler,
  CartHandler,
  AddToCartHandler,
}) => {
  const dispatch = useDispatch();
  const [data, setData] = useState();
  const [allProducts, setAllProducts] = useState();
  const [loading, setLoading] = useState(false);
  const [activeTag, setActiveTag] = useState({ title: "All" });
  const productsData = useSelector(
    (state) => state?.purchaseProducts?.products
  );
  const subcategories = useSelector(
    (state) => state?.purchaseProducts?.subCategories
  );
  const cartItems = useSelector(
    (state) => state?.purchaseProducts?.cart?.items
  );

  useEffect(() => {
    setData(productsData);
  }, [productsData]);

  useEffect(() => {
    dispatch(getCartData());
    dispatch(getSubcategories());
    dispatch(getProducts({ title: "All" }, storeId, setLoading));
    getData(storeId);
    dispatch(setStoreId(storeId));
  }, []);

  const getData = (storeId) => {
    const subcategoryParam = "";
    get(`/products?storeId=${storeId}${subcategoryParam}`, options)
      .then((data) => {
        setData(data.result);
        setAllProducts(data.result);
      })
      .catch(() => {});
  };

  const searchByName = (name) => {
    if (name !== "") {
      const res = data.filter((sd) => {
        if (sd && sd.brand && sd.brand !== undefined && sd.brand != "") {
          return sd?.brand?.toLowerCase().includes(name?.toLowerCase());
        }
      });
      setData(res);
    } else {
      setData(productsData);
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

  return (
    <div className="_purchase_container">
      <div className="_car_mart_header_main">
        <div className="_back_btn_main">
          <Button type="primary" className="_back_btn" onClick={BackHandler}>
            <BackIcon />
          </Button>
          <h1 className="_selected_store_heading">Back</h1>
        </div>
        <div>
          <Button
            type="primary"
            className="_back_btn"
            onClick={() => CartHandler(cartItems)}
          >
            {cartItems?.length > 0 && (
              <div className="_add_to_cart_show_main">
                <span className="_add_to_cart_show">{cartItems?.length}</span>
              </div>
            )}
            <CartIcon />
          </Button>
        </div>
      </div>

      <div className="_purchase__search_main">
        <SearchIcon />
        <Input
          onChange={(e) => {
            searchByName(e.target.value);
          }}
          placeholder="Search By Green Label"
          className="_purchase_search_input"
        />
      </div>

      {loading || (
        <div className="_car_mart_tags_main">
          {subcategories
            ?.filter(
              (cat) =>
                allProducts?.some((d) => d?.subcategory?.slug === cat.slug) ||
                cat.title === "All"
            )
            .map((category, tagsIndex) => {
              return (
                <Button
                  key={tagsIndex}
                  onClick={() => {
                    setActiveTag(category);
                    dispatch(getProducts(category, storeId, setLoading));
                  }}
                  className={
                    activeTag.title === category.title
                      ? "_car_mart_tags_active"
                      : "_car_mart_tags"
                  }
                  type="primary"
                >
                  {category.title}
                </Button>
              );
            })}
        </div>
      )}
      {loading ? (
        <div className="storesLoader">
          <Spin />
        </div>
      ) : data?.length === 0 ? (
        <div className="noStores">There are no products available</div>
      ) : (
        <>
          <Grid container spacing={3}>
            {data &&
              data !== undefined &&
              data != "" &&
              data?.map((product) => {
                return (
                  <Grid
                    item
                    xl={4}
                    lg={4}
                    md={4}
                    sm={6}
                    xs={12}
                    id={product.p_id}
                  >
                    <div className="_car_mart_product_card_container">
                      <div className="_car_mart_card_header_main">
                        <img
                          src={showImage(product)}
                          className="_car_mart_card_image"
                          alt="product"
                        />
                      </div>
                      <p className="_car_mart_card_heading2">
                        {product.description}
                      </p>

                      <div className="flexWrap">
                        <div className="insidePrice badge badge-success">
                          {product.brand}
                        </div>
                        <div className="insidePrice">
                          {product?.category?.slug === "buyacar/bike"
                            ? product?.details?.price
                            : product?.category?.slug === "autoinsurance"
                            ? product?.details?.policies[0].price
                            : product?.wholesalePrice}
                          {product.currency}
                        </div>
                        <div className="insidePrice insidePriceRight">
                          <Button
                            onClick={() => AddToCartHandler(product)}
                            className="btn-custom _car_mart_card_btn"
                            type="primary"
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Grid>
                );
              })}
          </Grid>
        </>
      )}
    </div>
  );
};
export default SelectedStore;
