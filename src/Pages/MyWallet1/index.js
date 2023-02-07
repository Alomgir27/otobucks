import "./styles.scss";

import {
  AddIcon,
  DeleteCardIcon,
  TickMarkIcon,
  VisaCardIcon,
} from "./../../Icons";
import {
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Spin,
  Table,
  Tag,
} from "antd";
import React, { useEffect, useState } from "react";
import { deleteService, get, post } from "../../services/RestService";
import { useDispatch, useSelector } from "react-redux";

import Dialog from "@mui/material/Dialog";
import Grid from "@mui/material/Grid";
import SelectBox from "../../Components/SelectBox";
import getSymbolFromCurrency from "currency-symbol-map";
import { getTotalEarning } from '../../redux/actions/dashboard';
import { openNotification } from "../../helpers";

const { RangePicker } = DatePicker;
const t = localStorage.getItem("token");
const token = `Bearer ${t}`;

export const options = {
  headers: {
    Authorization: token,
  },
};
const MyWallet = () => {
  
  const [dataForCard, setDataForCard] = useState([]);
  const [earningHistory, setEarningHistory] = useState();
  const [transactionHistory, setTransactionHistory] = useState();
  const [data, setData] = useState([]);
  const [dataFilter, setFilterData] = useState([]);
  const [data1, setData1] = useState([]);
  const [dataFilter1, setFilterData1] = useState([]);
  const [selectedCard, setSelectedCard] = useState();
  const [name, setName] = useState("");
  const [activeId, setActiveId] = useState("");
  const [country, setCountry] = useState("");
  const [walletData, setWalletData] = useState({});
  const [withdrawalBalance, setWithdrawalBalance] = useState(0);
  const totalEarnings = useSelector((state) => state?.dashboard?.totalEarning);
  const [addWalletAmount, setAddWalletAmount] = useState(0);
  const [selectedAddMoneyCard, setSelectedAddMoneyCard] = useState([]);
  const [allCardsFormat, setallCardsFormat] = useState([]);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [open4, setOpen4] = useState(false);
  const [open5, setOpen5] = useState(false);
  const [loading, setLoading] = useState(true);

  const [bankCountry, setBankCountry] = useState("");
  const [bankCurrancy, setBankCurrancy] = useState("");
  const [bankAccountHolder, setBankAccountHolder] = useState("");
  const [bankAccountType, setBankAccountType] = useState("");
  const [bankRoutingNumber, setBankRoutingNumber] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");

  const [formData, setFormData] = useState({
    number: "",
    exp_month: "",
    exp_year: "",
    cvc: "",
    name: "",
  });

  useEffect(() => {
    getDataForCard();
    getEarningHistory();
    getTransaction();
    getWalletData();
  }, []);

  const getEarningHistory = () => {
    get(
      //"/auth/providers/dashboard/transactionStats/2020-01-01/2022-12-12?type=earning",
      "/bookings",
      options
    ).then((res) => {
      //console.log("Earning History ===>",res.result.length);
      setData(res.result);
      setFilterData(res.result);
      setEarningHistory(res?.result);
    });
  };

  const getWalletData = () => {
    get("/wallet/mine", options)
      .then((res) => {
        console.log("Wallet Data ===>",res.result.length);
        setWalletData(res?.result);
      })
      .catch((error) => {});
  };

  const getTransaction = () => {
    get("/transactions", options).then((res) => {
      setTransactionHistory(res?.result);
      setData1(res.result);
      setFilterData1(res.result);
    });
  };

  const getDataForCard = () => {
    let tempData = [];
    get("/cards/", options).then((res) => {
      setDataForCard(res.result.data);
      let final_loop = res.result.data;
        if (final_loop && final_loop.length > 0) {
          final_loop.map((item, index) => {
            if (item.last4 != "" && item.last4 !== undefined) {
              let objData = {
                value: item.id,
                title: item.name + " - ****" + item.last4 + " ," + item.exp_month + " " + item.exp_year
              }
              tempData.push(objData);
            }
          });
          setallCardsFormat(tempData);
        }
      setLoading(false);
    });
  };

  const handleAddBankDetails = () => {
    
    if(bankCountry == ''){
      openNotification("Please set your country !!!");
    } else if(bankCurrancy == ''){
      openNotification("Please set your currancy !!!");
    } else if(bankAccountHolder == ''){
      openNotification("Please set your account holder !!!");
    } else if(bankAccountType == ''){
      openNotification("Please set your bank type !!!");
    } else if(bankRoutingNumber == ''){
      openNotification("Please set your bank routing number !!!");
    } else if(bankAccountNumber == ''){
      openNotification("Please set your account number !!!");
    } else {
      let formData = {
        country: bankCountry,
        currency: bankCurrancy,
        account_holder_name: bankAccountHolder,
        account_holder_type: bankAccountType,
        routing_number: bankRoutingNumber,
        account_number: bankAccountNumber
      }
      post("/account/addBankAccount", formData, options)
        .then((res) => {
          setOpen(false);
          window.location.reload();
        })
        .catch((err) => {
          err?.message && openNotification(err.message);
          //window.location.reload();
        });
    }
  }

  const withdrawMoney = () => {
    if(withdrawalBalance == ''){
      openNotification("Please enter withdrawal amount !!!");
    } else if(isNaN(withdrawalBalance)){
      openNotification("Please enter valid amount !!!");
    } else if(parseFloat(walletData.balance) < parseFloat(withdrawalBalance)){
      openNotification("Your Withdrawal amount should maximum "+walletData.balance);
    } else if (!selectedCard) {
      openNotification("please select a card");
      return;
    } else {
      post(
        "/wallet/withdraw", {
          destination: selectedCard?.id,
          amount: withdrawalBalance,
        },
        options
      )
        .then((res) => { 
          console.log("Results",res)
        })
        .catch((error) => {
          console.log("Error", error);
          openNotification(error.message);
        });
    }
    
  };

  const handleClose = () => {
    setOpen(false);
    setOpen2(false);
    setOpen3(false);
    setOpen4(false);
    setOpen5(false);
  };
  const formDataHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const addCardHandler = () => {
    // console.log("formData===>",formData);
    // return false;
    post("/cards", formData, options)
      .then((res) => {
        getDataForCard();
        setOpen(false);
      })
      .catch((err) => {
        err?.message && openNotification(err.message);
      });
  };

  const deleteHanlder = () => {
    deleteService("/cards", { cardId: activeId }, options).then((res) => {
      //setSelectedCard(res?.result[0]);
      //setActiveId("");
      //setOpen3(false);
      //getDataForCard();
      window.location.reload();
    });
  };

  const columns = [
    {
      title: "Booking Date",
      dataIndex: "booking_date",
      key: "booking_date",
      render: (_, data) => <p>{data.bookingDetails && data.bookingDetails.date && data.bookingDetails.date !== undefined ? data.bookingDetails.date : ''}</p>,
    },
    {
      title: "Customer",
      dataIndex: "customer_name",
      key: "customer_name",
      render: (_, data) => <p>{data.customer && data.customer.firstName && data.customer.firstName !== undefined ? data.customer.firstName + " " + data.customer.lastName : ''}</p>,
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      render: (_, data) => <p>{data.customer && data.customer.country && data.customer.country[0] ? data.customer.country[0] : ''}</p>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, data) => <p>{data.status}</p>,
    },
    {
      title: "Booking Price",
      dataIndex: "booking_price",
      key: "booking_price",
      render: (_, data) => <p>{data.totalprice}</p>,
    },
    {
      title: "Provider Price",
      dataIndex: "provider_price",
      key: "provider_price",
      render: (_, data) => <p>{data.amountproviderReceive}</p>,
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (_, data) => <p>{data.paymentMethod}</p>,
    },
  ];

  const searchByName = (name) => {
    if (name !== "") {
      const res = data.filter((sd) => {
        if (sd.customer && sd.customer.firstName !== undefined && sd.customer.firstName != "") {
          return sd?.customer.firstName.toString().toLowerCase().includes(name);
        }
      });
      setData(res);
    } else {
      setData(dataFilter);
    }
  };

  const searchByCountry = (name) => {
    if (name !== "") {
      const res = data.filter((sd) => {
        if (sd.customer && sd.customer.country !== undefined) {
          return sd?.customer.country.toString().includes(name);
        }
      });
      //console.log("Results", res);
      setData(res);
    } else {
      setData(dataFilter);
    }
  };

  const searchByDate = (dates) => {
    if (dates[0] !== "" && dates[1] !== "") {
      const res = data.filter((sd) => {
        if (sd.bookingDetails && sd.bookingDetails.date !== undefined) {
          return (
            sd?.bookingDetails.date.substring(0, 10) >= dates[0] &&
            sd?.bookingDetails.date.substring(0, 10) <= dates[1]
          );
        }
      });
      setData(res);
    } else {
      setData(dataFilter);
    }
  };

  const columns1 = [
    {
      title: "Date",
      dataIndex: "transaction_date",
      key: "transaction_date",
      render: (_, data1) => <p>{data1.createdAt}</p>,
    },
    {
      title: "Transaction ID",
      dataIndex: "transactionId",
      key: "transactionId",
      render: (_, data1) => <p>{data1.transactionId}</p>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (_, data1) => <p>{data1.amount + " " + data1.currency}</p>,
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      render: (_, data1) => <p>{data1 && data1.metadata && data1.metadata.user && data1.metadata.user.country && data1.metadata.user.country !== undefined ? data1.metadata.user.country : ''}</p>,
    },
    {
      title: "Customer",
      dataIndex: "email",
      key: "email",
      render: (_, data1) => <p>{data1 && data1.metadata && data1.metadata.user && data1.metadata.user.email && data1.metadata.user.email !== undefined ? data1.metadata.user.email : ''}</p>,
    },
  ];

  const searchByName1 = (name) => {
    if (name !== "") {
      const res = data1.filter((sd1) => {
        if (sd1.metadata && sd1.metadata.user && sd1.metadata.user.email && sd1.metadata.user.email !== undefined && sd1.metadata.user.email != "") {
          return sd1?.metadata.user.email.toString().toLowerCase().includes(name);
        }
      });
      setData1(res);
    } else {
      setData1(dataFilter1);
    }
  };

  const searchByCountry1 = (name) => {
    if (name !== "") {
      const res = data1.filter((sd1) => {
        if (sd1.metadata && sd1.metadata.user && sd1.metadata.user.country && sd1.metadata.user.country !== undefined) {
          return sd1?.metadata.user.country.toString().includes(name);
        }
      });
      setData1(res);
    } else {
      setData1(dataFilter1);
    }
  };

  const searchByDate1 = (dates) => {
    if (dates[0] !== "" && dates[1] !== "") {
      const res = data1.filter((sd1) => {
        if (sd1.createdAt && sd1.createdAt !== undefined) {
          return (
            sd1?.createdAt.substring(0, 10) >= dates[0] &&
            sd1?.createdAt.substring(0, 10) <= dates[1]
          );
        }
      });
      setData1(res);
    } else {
      setData1(dataFilter1);
    }
  };

  const handleAddWalletAmount = () => {
    if (selectedAddMoneyCard == '') {
      openNotification("Please select the card !!!");
    } else if (addWalletAmount == '' || addWalletAmount == 0) {
      openNotification("Please enter wallet amount !!!");
    } else if (isNaN(addWalletAmount)) {
      openNotification("Please enter valid amount !!!");
    } else {
      let formData = {
        source: selectedAddMoneyCard,
        amount: addWalletAmount
      }
      post("/wallet/addBalance", formData, options)
        .then((res) => {
          setOpen(false);
          window.location.reload();
        })
        .catch((err) => {
          err?.message && openNotification(err.message);
          //window.location.reload();
        });
    }
  }
  
  const EditCard = () => {
    return (
      <div className="add-new-card flex flex-col">
        <div className="add-new-card-heading flex aic jc">
          <div className="font s18 font b6">Edit Card</div>
        </div>
        <div className="block flex flex-col">
          <div className="input-sec flex flex-col">
            <p className="lbl">Card Holder Name</p>
            <input
              type="text"
              className="txt cleanbtn"
              placeholder="card holder name"
            />
          </div>
          <div className="input-sec flex flex-col">
            <p className="lbl">Card Number</p>
            <input
              type="text"
              className="txt cleanbtn"
              placeholder="xxxx xxxx xxxx xxxx"
            />
          </div>
          <div className="double-fields flex aic">
            <div className="input-sec flex flex-col mr">
              <p className="lbl">Expiry Date</p>
              <input type="text" className="txt cleanbtn" placeholder="dd/mm" />
            </div>
            <div className="input-sec flex flex-col ml">
              <p className="lbl">cvv</p>
              <input type="text" className="txt cleanbtn" placeholder="xxx" />
            </div>
          </div>
          <div className="action flex">
            <button
              className="btn cleanbtn button font s16 b5"
              onClick={() => {
                setOpen2(false);
              }}
            >
              UPDATE
            </button>
          </div>
        </div>
      </div>
    );
  };
  const DeleteCard = () => {
    return (
      <div className="delet-card flex flex-col jc">
        <div className="delet-card-heading flex aic jc">
          <div className="font s18 font b6">Delete Card</div>
        </div>
        <div className="block flex flex-col aic">
          <p className="msg font s18 b5">
            Are you sure you wan’t to delete your card?
          </p>
          <div className="action flex">
            <button
              className="btn cleanbtn button font s16 b5"
              onClick={deleteHanlder}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  };
  return loading ? (
    <div className="loader">
      <Spin />
    </div>
  ) : (
    <div className="_purchase_container">
      <Grid container spacing={3}>
        <Grid item xl={4} lg={4} md={6} sm={12} xs={12}>
          <div className="_my_wallet_add_money_card_main">
            <div className="_my_wallet_add_money_btn_main">
              <button 
              onClick={(e) => {
                  setOpen4(true);
                }}
              className="_my_wallet_add_money_btn"
              >Add Money</button>
            </div>
            <div className="_my_wallet_total_balance_main">
              <div className="_my_wallet_total_balance_circe_main" />
              <h1 className="_my_wallet_total_balance_price">
                {getSymbolFromCurrency(walletData?.currency)}
                {walletData?.balance}                                               
              </h1>
            </div>
            <h3 className="_my_wallet_total_balance_price_title">
              Total Wallet Balance
            </h3>
          </div>
        </Grid>
        <Grid item xl={4} lg={4} md={6} sm={12} xs={12}>
          <div className="_my_wallet_add_money_card_main">
            <div className="_my_wallet_total_earning_main">
              <div className="_my_wallet_total_earning_circe_main" />
              <h1 className="_my_wallet_total_earning_price">
                {getSymbolFromCurrency(walletData?.currency)}{totalEarnings > 0 ? totalEarnings : 33.00}
              </h1>
            </div>
            <h3 className="_my_wallet_total_balance_price_title">
              Total Earnings
            </h3>
          </div>
        </Grid>
        <Grid item xl={4} lg={4} md={6} sm={12} xs={12}>
          <div className="_my_wallet_add_money_card_main">
            <div className="_my_wallet_add_money_btn_main">
              <button 
              className="_my_wallet_add_money_btn"
              onClick={(e) => {
                setOpen5(true);
              }}
              >Add Bank</button>
            </div>
            <div className="_my_wallet_total_earning_main">
              <div className="_my_wallet_total_earning_circe_main" />
              <h1 className="_my_wallet_total_earning_price">
                {getSymbolFromCurrency(walletData?.currency)}33.00
              </h1>
            </div>
            <h3 className="_my_wallet_total_balance_price_title">
              Total withdrawals
            </h3>
          </div>
        </Grid>
      </Grid>
      <br />
      <br />
      <Grid container spacing={3}>
        <Grid item xl={6} lg={6} md={12} sm={12} xs={12}>
          <div className="_my_wallet_card_main">
            <div className="_my_wallet_card_header_main2">
              <p className="_my_wallet_card_header_title">Cards</p>
            </div>
            {dataForCard?.map((v, k) => (
              <>
                <div className="_my_wallet_visa_card_main">
                  <div className="_my_wallet_visa_card_part1_main">
                    <div className="_my_wallet_visa_icon_main">
                      <VisaCardIcon />
                    </div>
                    <p className="_my_wallet_visa_card_number">{v.name}</p>
                  </div>
                  <p className="_my_wallet_visa_card_title">{v.brand}</p>
                  <div className="_my_wallet_visa_card_part1_main">
                    <p className="_my_wallet_visa_card_exp_date">
                      {v.exp_month}/{v.exp_year}
                    </p>
                    <p className="_my_wallet_visa_card_holder_name">
                      {v.country}
                    </p>
                  </div>
                  <div className="_my_wallet_visa_card_part1_main">
                    <button
                      className="_my_wallet_visa_card_edit_btn"
                      onClick={(e) => {
                        setOpen3(true);
                        setActiveId(v.id);
                      }}
                    >
                      <DeleteCardIcon />
                    </button>
                  </div>
                </div>
              </>
            ))}

            <div className="_my_wallet_Add_new_card_btn_main">
              <button
                className="_my_wallet_Add_new_card_btn flex aic jc"
                onClick={(e) => {
                  setOpen(true);
                }}
              >
                <div style={{ marginRight: "10px" }}>Add new Card</div>{" "}
                <AddIcon />
              </button>
            </div>
          </div>
        </Grid>
        <Grid item xl={6} lg={6} md={12} sm={12} xs={12}>
          <div className="_my_wallet_card_main">
            <div className="_my_wallet_card_header_main2">
              <p className="_my_wallet_card_header_title">
                Withdraw your money
              </p>
            </div>

            {dataForCard?.map((card, index) => {
              return (
                <div
                  className={
                    card.id === selectedCard?.id
                      ? "_my_wallet_visa__withdrawal_card_main"
                      : "_my_wallet_visa_card_main"
                  }
                  key={index}
                  onClick={() => setSelectedCard(card)}
                >
                  <div className="_my_wallet_visa_card_part1_main">
                    <div className="_my_wallet_visa_icon_main">
                      <VisaCardIcon />
                    </div>
                    <p className="_my_wallet_visa_card_number">
                      1234 1234 1234 1234
                    </p>
                  </div>
                  <p className="_my_wallet_visa_card_title">{card.brand}</p>
                  <div className="_my_wallet_visa_card_part1_main">
                    <p className="_my_wallet_visa_card_exp_date">
                      {card.exp_month}/{card.exp_year}
                    </p>
                    <p className="_my_wallet_visa_card_holder_name">
                      {card.name}
                    </p>
                  </div>
                  <div className="_my_wallet_visa_card_part1_main">
                    <button className="_my_wallet_visa_card_edit_btn">
                      <TickMarkIcon />
                    </button>
                  </div>
                </div>
              );
            })}

            <div className="_my_wallet_withdraw_current_balannce_main">
              <div>
                <h1 className="_my_wallet_withdraw_current_balannce">
                  <input type="text" onChange={(e) => setWithdrawalBalance(e.target.value)} className="ant-input _invite_friends_input wallet_input" placeholder="Amount" />
                </h1>
                <p className="_my_wallet_withdraw_current_balannce_title">
                  current Balance ({getSymbolFromCurrency(walletData?.currency)}{walletData.balance})
                </p>
              </div>
              <button
                className="_my_wallet_withdraw_withdraw_money_btn"
                onClick={withdrawMoney}
              >
                Withdraw money
              </button>
            </div>
          </div>
        </Grid>
      </Grid>
      <br />
      <br />





      
      <div className="_my_wallet_withdrawal_history_main">
        <div className="_my_wallet_card_header_main">
          <p className="_my_wallet_card_header_title">Withdraw History</p>
        </div>

        <div style={{ paddingLeft: 10, paddingRight: 10 }}>
          <Grid container spacing={3}>
            <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
              <div>
                <p className="_invite_friends_input_title">Search by Customer</p>
                <Input
                  onChange={(e) => { searchByName1(e.target.value.toLowerCase()); }}
                  className="_invite_friends_input"
                  placeholder='Search By Customer'
                />
              </div>
            </Grid>
            <Grid item xl={4} lg={4} md={6} sm={12} xs={12}>
              <p className="_invite_friends_input_title">Search by Country</p>
              <Input
                placeholder="Search by Country"
                onChange={(e) => { searchByCountry1(e.target.value); }}
                className="_invite_friends_input"
              />
            </Grid>
            <Grid item xl={5} lg={5} md={6} sm={12} xs={12}>
              <p className="_invite_friends_input_title">Search by Date</p>
              <RangePicker
                style={{ width: "100%" }}
                className="_invite_friends_input"
                onChange={(e, d) => searchByDate1(d)}
              />
            </Grid>

          </Grid>
        </div>
        <div style={{ marginTop: 30 }}>
          <Table
            scroll={{ x: true }}
            loading={loading}
            columns={columns1}
            dataSource={data1}
          />
        </div>
      </div>
      <br />
      <br />
      <div className="_my_wallet_withdrawal_history_main">
        <div className="_my_wallet_card_header_main">
          <p className="_my_wallet_card_header_title">Wallet earning History</p>
        </div>
        <div style={{ paddingLeft: 10, paddingRight: 10 }}>
          <Grid container spacing={3}>
            <Grid item xl={3} lg={3} md={6} sm={12} xs={12}>
              <p className="_invite_friends_input_title">Search by Customer</p>
              <Input
                onChange={(e) => { searchByName(e.target.value.toLowerCase()); }}
                placeholder='Search By Customer'
                className="_invite_friends_input"
              />
            </Grid>
            <Grid item xl={4} lg={4} md={6} sm={12} xs={12}>
              <p className="_invite_friends_input_title">Search by Country</p>
              <Input
                placeholder="Search by Country"
                onChange={(e) => { searchByCountry(e.target.value); }}
                className="_invite_friends_input"
              />
            </Grid>
            <Grid item xl={5} lg={5} md={6} sm={12} xs={12}>
              <p className="_invite_friends_input_title">Search by Date</p>
              <RangePicker
                style={{ width: "100%" }}
                className="_invite_friends_input"
                //onChange={(e, d) => console.log(d)}
                onChange={(e, d) => searchByDate(d)}
              />
            </Grid>
            {/* <Grid item xl={2} lg={2} md={6} sm={12} xs={12}>
              <p className="_invite_friends_input_title">.</p>
              <button className="_invite_friends_apply_btn">APPLY</button>
            </Grid> */}
          </Grid>
        </div>
        <div style={{ marginTop: 30 }}>
          <Table
            scroll={{ x: true }}
            loading={loading}
            columns={columns}
            dataSource={data}
          />
        </div>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div className="dialog-box">
          <div className="add-new-card flex flex-col">
            <div className="add-new-card-heading flex aic jc">
              <div className="font s18 font b6">Add New Card</div>
            </div>
            <div className="block flex flex-col">
              <div className="input-sec flex flex-col">
                <p className="lbl">Card Holder Name</p>
                <input
                  name="name"
                  type="text"
                  className="txt cleanbtn"
                  placeholder="card holder name"
                  onChange={(e) => formDataHandler(e)}
                  value={formData.name}
                />
              </div>
              <div className="input-sec flex flex-col">
                <p className="lbl">Card Number</p>
                <input
                  name="number"
                  onChange={(e) => formDataHandler(e)}
                  value={formData.number}
                  type="text"
                  className="txt cleanbtn"
                  placeholder="xxxx xxxx xxxx xxxx"
                />
              </div>
              <div className="double-fields flex aic">
                <div className="input-sec flex flex-col mr">
                  <p className="lbl">Expiry Month</p>
                  <input
                    name="exp_month"
                    value={formData.exp_month}
                    onChange={(e) => formDataHandler(e)}
                    type="number"
                    className="txt cleanbtn"
                    placeholder="MM"
                  />
                </div>
                <div className="input-sec flex flex-col mr">
                  <p className="lbl">Expiry Year</p>
                  <input
                    name="exp_year"
                    value={formData.exp_year}
                    onChange={(e) => formDataHandler(e)}
                    type="number"
                    className="txt cleanbtn"
                    placeholder="YYYY"
                  />
                </div>
                <div className="input-sec flex flex-col ml">
                  <p className="lbl">cvv</p>
                  <input
                    name="cvc"
                    value={formData.cvc}
                    onChange={(e) => formDataHandler(e)}
                    type="text"
                    className="txt cleanbtn"
                    placeholder="xxx"
                  />
                </div>
              </div>
              <div className="action flex">
                <button
                  className="btn cleanbtn button font s16 b5"
                  onClick={addCardHandler}
                >
                  SAVE
                </button>
              </div>
            </div>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={open2}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div className="dialog-box">
          <EditCard />
        </div>
      </Dialog>

      <Dialog open={open4} onClose={handleClose}>
        <div className="dialog-box">
          {/* <AddCard
            createCard={addCardHandler}
            formDataHandler={formDataHandler}
            formData={formData}
          /> */}
          <div className="add-new-card flex flex-col">
            <div className="add-new-card-heading flex aic jc">
              <div className="font s18 font b6">Add Wallet Amount</div>
            </div>
            <div className="block flex flex-col">
    <div className="double-fields flex aic">
        <div className="input-sec flex flex-col mr">
            <input
            type="text"
            className="form-field"
            placeholder="Enter Country"
            onChange={(e) => setBankCountry(e.target.value)}
            />
        </div>
        <div className="input-sec flex flex-col mr" style={{ marginTop: -10 }}>
            <input
                type="text"
                className="form-field"
                placeholder="Enter Currancy"
                onChange={(e) => setBankCurrancy(e.target.value)}
            />
        </div>
        <div className="input-sec flex flex-col mr" style={{ marginTop: -10 }}>
        <input
                  type="text"
                  className="form-field"
                  placeholder="Enter Currancy"
                  onChange={(e) => setBankCurrancy(e.target.value)}
                />
        </div>
        <div className="input-sec flex flex-col mr" style={{ marginTop: -10 }}>
        <input
                  type="text"
                  className="form-field"
                  placeholder="Enter Account Holder Name"
                  onChange={(e) => setBankAccountHolder(e.target.value)}
                />
        </div>
        <div className="input-sec flex flex-col mr" style={{ marginTop: -10 }}>
        <input
                  type="text"
                  className="form-field"
                  placeholder="Enter Account Holder Type"
                  onChange={(e) => setBankAccountType(e.target.value)}
                />
        </div>
        <div className="input-sec flex flex-col mr" style={{ marginTop: -10 }}>
        <input
                  type="text"
                  className="form-field"
                  placeholder="Enter Account Number"
                  onChange={(e) => setBankAccountNumber(e.target.value)}
                />
        </div>
    </div>
    <div className="action flex">
    {/* <button
                  className="save-btn"
                  style={{marginRight:10, marginLeft:'10%'}}
                  onClick={() => { handleAddBankDetails() }}
                >SAVE
                </button>
                <button
                  className="save-btn"
                  onClick={() => { setOpen5(false); }}
                >Cancel
                </button>
         */}
        <button
            className="btn cleanbtn button font s16 b5"
            onClick={() => { handleAddWalletAmount() }}
        >
            SAVE
        </button>
    </div>
</div>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={open3}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div className="dialog-box">
          <DeleteCard />
        </div>
      </Dialog>


      <Dialog open={open5} onClose={handleClose}>
      <div className="dialog-box">
          <div className="add-new-card" style={{overflow:'hidden'}}>
            <div className="add-new-card-heading">
              <div className="font s18 font b6">Add Bank Details</div>
            </div>
            <div className="add-card-form">
              <div className="form-field-container">
              <input
                  type="text"
                  className="form-field"
                  placeholder="Enter Country"
                  onChange={(e) => setBankCountry(e.target.value)}
                />
              </div>
              <div className="form-field-container">
                <input
                  type="text"
                  className="form-field"
                  placeholder="Enter Currancy"
                  onChange={(e) => setBankCurrancy(e.target.value)}
                />
              </div>
              <div className="form-field-container">
                <input
                  type="text"
                  className="form-field"
                  placeholder="Enter Account Holder Name"
                  onChange={(e) => setBankAccountHolder(e.target.value)}
                />
              </div>
              <div className="form-field-container">
                <input
                  type="text"
                  className="form-field"
                  placeholder="Enter Account Holder Type"
                  onChange={(e) => setBankAccountType(e.target.value)}
                />
              </div>
              <div className="form-field-container">
                <input
                  type="text"
                  className="form-field"
                  placeholder="Enter Routing Number"
                  onChange={(e) => setBankRoutingNumber(e.target.value)}
                />
              </div>
              <div className="form-field-container">
                <input
                  type="text"
                  className="form-field"
                  placeholder="Enter Account Number"
                  onChange={(e) => setBankAccountNumber(e.target.value)}
                />
              </div>
            </div>
            <div className="save-btn-container3" style={{justifyContent:'center', alignContent:'center', flex:1, flexDirection:'row', marginBottom:30}}>
                <button
                  className="save-btn"
                  style={{marginRight:10, marginLeft:'10%'}}
                  onClick={() => { handleAddBankDetails() }}
                >SAVE
                </button>
                <button
                  className="save-btn"
                  onClick={() => { setOpen5(false); }}
                >Cancel
                </button>
            </div>
            
          </div>
        </div>
      </Dialog>
    </div>
  );
};
export default MyWallet;
