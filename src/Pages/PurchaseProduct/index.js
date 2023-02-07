import React, { useState } from "react";

import Accessories from "./Accessories";
import AddNewAddress from "./AddNewAddress";
import Checkout from "./Checkout";
import ConfirmProduct from "./ConfirmProduct";
import FeedbackMessage from "./FeedbackMessage";
import SelectedProductDetails from "./SelectedProductDetails";
import SelectedStore from "./SelectedStore";
import { openNotification } from "../../helpers";
import CommingSoon from "../../Components/CommingSoonScreen/CommingSoon";

const PurchaseProduct = () => {
  const [showComponent, setShowComponent] = useState(1);
  const [storeId, setStoreId] = useState();
  const [product, setProduct] = useState();
  const [cartItems, setCartItems] = useState([]);
  const [address, setAddres] = useState();
  const [buyNowData, setBuyNowData] = useState();

  const ExploreHandler = (id) => {
    setStoreId(id);
    setShowComponent(2);
  };

  const AddToCardHandler = (product) => {
    setShowComponent(3);
    setProduct(product);
  };

  const CartHandler = (cartItems) => {
    setCartItems(cartItems);
    setShowComponent(4);
  };

  const AddNewAddressHandler = (addressvalues) => {
    if (Object.keys(addressvalues).some((key) => addressvalues[key] === "")) {
      openNotification("Please Enter all fields");
    } else {
      setAddres(addressvalues);
      setShowComponent(4);
    }
  };

  const buyNowHandler = (subTotal, card, address, taxTotal, delivery, productTotal, cardTotal, currancy, deliver_date) => {
    setShowComponent(5);
    setBuyNowData({ subTotal, card, address, taxTotal, delivery, productTotal, cardTotal, currancy, deliver_date });
  };

  return (
    process.env.REACT_APP_NODE_ENV != "development" ?
      <>
      <CommingSoon/>
      </>
      :
      <div>
        {showComponent === 1 && <Accessories ExploreHandler={ExploreHandler} />}
        {showComponent === 2 && (
          <SelectedStore
            AddToCartHandler={AddToCardHandler}
            BackHandler={() => setShowComponent(1)}
            CartHandler={CartHandler}
            storeId={storeId}
          />
        )}
        {showComponent === 3 && (
          <SelectedProductDetails
            setShowComponent={setShowComponent}
            product={product}
            storeId={storeId}
          />
        )}
        {showComponent === 4 && (
          <ConfirmProduct
            BackHandler={() => setShowComponent(2)}
            buyNowHandler={buyNowHandler}
            AddNewAddressHandler={() => setShowComponent(7)}
            cartItems={cartItems}
            address={address}
          />
        )}
        {showComponent === 5 && (
          <Checkout
            BackHandler={() => setShowComponent(4)}
            ProceesToPayHandler={() => setShowComponent(6)}
            buyNowData={buyNowData}
          />
        )}

        {showComponent === 6 && <FeedbackMessage />}
        {showComponent === 7 && (
          <AddNewAddress
            BackHandler={() => setShowComponent(4)}
            AddNewAddressHandler={AddNewAddressHandler}
            country=""
          />
        )}
      </div>
  );
};
export default PurchaseProduct;
