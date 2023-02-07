import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Dialog from "@mui/material/Dialog";
import Grid from "@mui/material/Grid";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import getSymbolFromCurrency from "currency-symbol-map";
import { DatePicker, Input, Spin, Table } from "antd";
import SelectBox from "../../Components/SelectBox";
import { openNotification } from "../../helpers";
import { countries } from "../../constants";
import { AddIcon, DeleteCardIcon, VisaCardIcon } from "./../../Icons";
import { deleteService, get, post } from "../../services/RestService";

import "./styles.scss";
import { getTotalEarning } from "../../redux/actions/dashboard";

const { RangePicker } = DatePicker;
const t = localStorage.getItem("token");
const token = `Bearer ${t}`;

export const options = {
  headers: {
    Authorization: token,
  },
};
const MyWallet = () => {
  const dispatch = useDispatch();
  const [dataForCard, setDataForCard] = useState([]);
  const [data, setData] = useState([]);
  const [dataFilter, setFilterData] = useState([]);
  const [data1, setData1] = useState([]);
  const [dataFilter1, setFilterData1] = useState([]);
  const [selectedBank, setSelectedBank] = useState();
  const [activeId, setActiveId] = useState("");
  const [walletData, setWalletData] = useState({});
  const [withdrawalBalance, setWithdrawalBalance] = useState(1);
  const totalEarnings = useSelector((state) => state?.dashboard?.totalEarning);
  const user = useSelector((state) => state?.profile?.user);
  const [addWalletAmount, setAddWalletAmount] = useState(0);
  const [selectedAddMoneyCard, setSelectedAddMoneyCard] = useState([]);
  const [allCardsFormat, setallCardsFormat] = useState([]);
  const [open6, setOpen6] = useState(false);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [open4, setOpen4] = useState(false);
  const [open5, setOpen5] = useState(false);
  const [loading, setLoading] = useState(true);
  const [totalWithdrawals, setTotalWithdrawls] = useState(0);
  const [accountsData, setAccountsData] = useState([]);

  const [formData, setFormData] = useState({
    number: "",
    exp_month: "",
    exp_year: "",
    cvc: "",
    name: "",
  });
  const [bankDetails, setBankDetails] = useState({
    bank_name: "",
    IBAN_Number: "",
    swiftCode: "",
    branchName: "",
    account_holder_name: "",
    account_holder_type: "",
    routing_number: "",
    account_number: "",
  });

  useEffect(() => {
    getDataForCard();
    getEarningHistory();
    getTransaction();
    getWalletData();
    getAccounts();
    dispatch(getTotalEarning());
  }, []);

  const getAccounts = () => {
    setLoading(true);
    get("/accounts", options)
      .then((res) => {
        setAccountsData(res?.result?.data);
        setSelectedBank(res?.result?.data[0]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const getEarningHistory = () => {
    setLoading(true);
    get("/invites/mine", options).then((res) => {
      setData(res.result);
      setFilterData(res.result);
    });
  };

  const getWalletData = () => {
    get("/wallet/mine", options)
      .then((res) => {
        setWalletData(res?.result);
      })
      .catch(() => { });
  };

  const getTransaction = () => {
    setLoading(true);
    let totalWithdrawalAmount = 0;
    get("/transactions", options)
      .then((res) => {
        setData1(res.result);
        let resultsData = res.result;
        resultsData.forEach((item) => {
          totalWithdrawalAmount += parseFloat(item.amount);
        });
        if (totalWithdrawalAmount > 0) {
          setTotalWithdrawls(totalWithdrawalAmount);
        }
        setFilterData1(res.result);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const getDataForCard = () => {
    let tempData = [];
    get("/cards/", options).then((res) => {
      setDataForCard(res.result.data);
      let final_loop = res.result.data;
      if (final_loop && final_loop.length > 0) {
        final_loop.forEach((item) => {
          if (item.last4 !== "" && item.last4 !== undefined) {
            let objData = {
              value: item.id,
              title:
                item.name +
                " - ****" +
                item.last4 +
                " ," +
                item.exp_month +
                " " +
                item.exp_year,
            };
            tempData.push(objData);
          }
        });
        setallCardsFormat(tempData);
      }
      setLoading(false);
    });
  };

  const handleAddBankDetails = () => {
    const IsFormInvalid = Object.keys(bankDetails).some(
      (key) => bankDetails[key] === ""
    );
    if (IsFormInvalid) {
      openNotification("Please enter all required fields");
      return;
    }
    post(
      "/accounts",
      {
        ...bankDetails,
        country: countries.find((country) => country.value === user?.country[0])
          ?.code,
        currency: user?.currency,
      },
      options
    )
      .then(() => {
        openNotification("Account added successfullt");
        getAccounts();
        setOpen5(false);
      })
      .catch((err) => {
        err?.message && openNotification(err.message);
      });
  };

  const withdrawMoney = () => {
    if (withdrawalBalance === "") {
      openNotification("withdrawal amount should be at least 1");
    } else if (isNaN(withdrawalBalance)) {
      openNotification("Please enter valid amount !!!");
    } else if (parseFloat(walletData.balance) < parseFloat(withdrawalBalance)) {
      openNotification("You don't have much balance to withdraw");
    } else if (!selectedBank) {
      openNotification("please select a bank");
      return;
    } else {
      post(
        "/wallet/withdraw",
        {
          destination: selectedBank?.account,
          amount: withdrawalBalance,
        },
        options
      )
        .then(() => {
          openNotification("Withdraw successful");
          getEarningHistory();
          getTransaction();
          getWalletData();
        })
        .catch((error) => {
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
    setOpen6(false);
    setBankDetails({
      bank_name: "",
      IBAN_Number: "",
      swiftCode: "",
      branchName: "",
      account_holder_name: "",
      account_holder_type: "",
      routing_number: "",
      account_number: "",
    });
  };
  const formDataHandler = (e) => {
    let { name, value } = e.target;
    if (name == "name") {
      if (/^[A-Za-z\s]*$/.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  const bankDetailsHandler = (e) => {
    setBankDetails({ ...bankDetails, [e.target.name]: e.target.value });
  };
  const addCardHandler = () => {
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
      window.location.reload();
    });
  };

  const deleteBankHanlder = () => {
    deleteService("/accounts", { bankAccount: activeId }, options)
      .then(() => {
        setOpen6(false);
        openNotification("Deleted successfullt");
        getAccounts();
      })
      .catch(() => {
        openNotification("Failed to delete");
      });
  };

  const columns = [
    {
      title: "Booking Date",
      dataIndex: "booking_date",
      key: "booking_date",
      render: (_, data) => (
        <p>
          {data.bookingDetails &&
            data.bookingDetails.date &&
            data.bookingDetails.date !== undefined
            ? data.bookingDetails.date
            : ""}
        </p>
      ),
    },
    {
      title: "Customer",
      dataIndex: "customer_name",
      key: "customer_name",
      render: (_, data) => (
        <p>
          {data.customer &&
            data.customer.firstName &&
            data.customer.firstName !== undefined
            ? data.customer.firstName + " " + data.customer.lastName
            : ""}
        </p>
      ),
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      render: (_, data) => (
        <p>
          {data.customer && data.customer.country && data.customer.country[0]
            ? data.customer.country[0]
            : ""}
        </p>
      ),
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
    setData(
      dataFilter.filter(
        (sd) =>
          sd?.customer?.firstName?.toLowerCase()?.includes(name) ||
          sd?.customer?.lastName?.toLowerCase()?.includes(name)
      )
    );
  };

  const searchByCountry = (name) => {
    setData(
      dataFilter.filter((sd) =>
        sd?.customer?.country[0]?.toLowerCase()?.includes(name)
      )
    );
  };

  const searchByDate = (dates) => {
    if (dates[0] !== "") {
      setData(
        data.filter(
          (sd) =>
            sd?.bookingDetails.date.substring(0, 10) >= dates[0] &&
            sd?.bookingDetails.date.substring(0, 10) <= dates[1]
        )
      );
    } else {
      setData(dataFilter);
    }
  };

  const columns1 = [
    {
      title: "Date",
      dataIndex: "transaction_date",
      key: "transaction_date",
      render: (_, data1) => <p>{data1.createdAt?.substring(0, 10)}</p>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (_, data1) => <p>{data1.amount + " " + data1.currency}</p>,
    },
    {
      title: "Account Name",
      dataIndex: "account",
      key: "account",
      render: (_, data1) => <p>---</p>,
    },
    {
      title: "Bank Name",
      dataIndex: "bank",
      key: "bank",
      render: (_, data1) => <p>---</p>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: () => <p>Withdrawn</p>,
    },
    // {
    //   title: "Customer Name",
    //   dataIndex: "name",
    //   key: "name",
    //   render: (_, data1) => (
    //     <p>{`${data1?.metadata?.user?.firstName} ${data1?.metadata?.user?.lastName}`}</p>
    //   ),
    // },
  ];

  const withdrawHistoryNameSearch = (name) => {
    setData1(
      dataFilter1.filter((sd1) =>
        sd1?.metadata?.user?.email?.toLowerCase().includes(name)
      )
    );
  };

  const withdrawHistoryCountrySearch = (name) => {
    setData1(
      dataFilter1.filter((sd1) =>
        sd1?.metadata?.user?.country?.toLowerCase()?.includes(name)
      )
    );
  };

  const withdrawHistoryDateSearch = (dates) => {
    if (dates[0] !== "") {
      setData1(
        dataFilter1.filter(
          (sd1) =>
            sd1?.createdAt?.substring(0, 10) >= dates[0] &&
            sd1?.createdAt?.substring(0, 10) <= dates[1]
        )
      );
    } else {
      setData1(dataFilter1);
    }
  };

  const handleAddWalletAmount = () => {
    if (selectedAddMoneyCard === "") {
      openNotification("Please select the card !!!");
    } else if (addWalletAmount === "" || addWalletAmount === 0) {
      openNotification("Please enter wallet amount !!!");
    } else if (isNaN(addWalletAmount)) {
      openNotification("Please enter valid amount !!!");
    } else {
      let formData = {
        source: selectedAddMoneyCard,
        amount: addWalletAmount,
      };
      post("/wallet/addBalance", formData, options)
        .then((res) => {
          setOpen(false);
          window.location.reload();
        })
        .catch((err) => {
          err?.message && openNotification(err.message);
        });
    }
  };

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

  const DeleteBank = () => {
    return (
      <div className="delet-card flex flex-col jc">
        <div className="delet-card-heading flex aic jc">
          <div className="font s18 font b6">Delete Bank</div>
        </div>
        <div className="block flex flex-col aic">
          <p className="msg font s18 b5">
            Are you sure you wan’t to delete your bank?
          </p>
          <div className="action flex">
            <button
              className="btn cleanbtn button font s16 b5"
              onClick={deleteBankHanlder}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {
        loading ? (
          <div className="loader">
            <Spin />
          </div>
        ) :
          process.env.REACT_APP_NODE_ENV == "production" ?
            (
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
            )
            :
            (
              <>
                <div className="_purchase_container">
                  <Grid container spacing={3}>
                    <Grid item xl={4} lg={4} md={6} sm={12} xs={12}>
                      <div className="_my_wallet_add_money_card_main">
                        <div className="_my_wallet_total_balance_main">
                          <div className="_my_wallet_total_balance_circe_main" />
                          <h1 className="_my_wallet_total_balance_price">
                            {getSymbolFromCurrency(walletData?.currency)}
                            {walletData?.balance?.toFixed(2)}
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
                            {getSymbolFromCurrency(walletData?.currency)}
                            {totalEarnings?.toFixed(2)}
                          </h1>
                        </div>
                        <h3 className="_my_wallet_total_balance_price_title">
                          Total Earnings
                        </h3>
                      </div>
                    </Grid>
                    <Grid item xl={4} lg={4} md={6} sm={12} xs={12}>
                      <div className="_my_wallet_add_money_card_main">
                        <div className="_my_wallet_total_earning_main">
                          <div className="_my_wallet_total_earning_circe_main" />
                          <h1 className="_my_wallet_total_earning_price">
                            {getSymbolFromCurrency(walletData?.currency)}
                            {totalWithdrawals?.toFixed(2)}
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
                        {accountsData?.map((account) => (
                          <>
                            <div
                              className={
                                selectedBank?.id === account?.id
                                  ? "_my_wallet_visa_card_main_selected"
                                  : "_my_wallet_visa_card_main"
                              }
                              onClick={() => setSelectedBank(account)}
                            >
                              <div className="_my_wallet_visa_card_part1_main">
                                <p className="_my_wallet_visa_card_number">
                                  {account.bank_name}
                                </p>
                              </div>
                              <div className="_my_wallet_visa_card_part1_main">
                                <p className="_my_wallet_visa_card_holder_name">
                                  {account?.metadata?.account_number}
                                </p>
                              </div>
                              <div className="_my_wallet_visa_card_part1_main">
                                <button
                                  className="_my_wallet_visa_card_edit_btn"
                                  onClick={(e) => {
                                    setOpen6(true);
                                    setActiveId(account?.id);
                                  }}
                                >
                                  <DeleteCardIcon />
                                </button>
                              </div>
                            </div>
                          </>
                        ))}
                        <div className="_my_wallet_withdraw_current_balannce_main">
                          <div>
                            <h1 className="_my_wallet_withdraw_current_balannce">
                              <input
                                type="text"
                                value={
                                  withdrawalBalance !== ""
                                    ? parseInt(withdrawalBalance, 10)
                                    : 0
                                }
                                onChange={(e) => setWithdrawalBalance(e.target.value)}
                                className="ant-input _invite_friends_input wallet_input"
                                placeholder="Amount"
                              />
                            </h1>
                            <p className="_my_wallet_withdraw_current_balannce_title">
                              current Balance ({getSymbolFromCurrency(walletData?.currency)}
                              {walletData.balance?.toFixed(2)})
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
                      <p className="_my_wallet_card_header_title">Wallet earning History</p>
                    </div>
                    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
                      <Grid container spacing={3}>
                        <Grid item xl={3} lg={3} md={6} sm={12} xs={12}>
                          <p className="_invite_friends_input_title">Search by Customer</p>
                          <Input
                            onChange={(e) => {
                              searchByName(e.target.value.toLowerCase());
                            }}
                            placeholder="Search By Customer"
                            className="_invite_friends_input"
                          />
                        </Grid>
                        <Grid item xl={4} lg={4} md={6} sm={12} xs={12}>
                          <p className="_invite_friends_input_title">Search by Country</p>
                          <Input
                            placeholder="Search by Country"
                            onChange={(e) => {
                              searchByCountry(e.target.value.toLowerCase());
                            }}
                            className="_invite_friends_input"
                          />
                        </Grid>
                        <Grid item xl={5} lg={5} md={6} sm={12} xs={12}>
                          <p className="_invite_friends_input_title">Search by Date</p>
                          <RangePicker
                            style={{ width: "100%" }}
                            className="_invite_friends_input"
                            onChange={(e, d) => searchByDate(d)}
                          />
                        </Grid>
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
                </div>
              </>
            )}
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
                  className="btn1 smallbtn cleanbtn button font s16 b5"
                  onClick={addCardHandler}
                >
                  Save
                </button>
                <button
                  className="btn1 smallbtn cleanbtn button font s16 b5"
                  onClick={() => setOpen(false)}
                >
                  Cancel
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
          <div className="add-new-card flex flex-col">
            <div className="add-new-card-heading flex aic jc">
              <div className="font s18 font b6">Add Wallet Amount</div>
            </div>
            <div className="block flex flex-col">
              <div className="double-fields flex aic">
                <div className="input-sec flex flex-col mr">
                  <p className="lbl">Select Card</p>
                  <SelectBox
                    onChange={(e) => setSelectedAddMoneyCard(e)}
                    placeholder="Select Your Delivery Address"
                    rules={[{ required: true, message: "Required" }]}
                    data={allCardsFormat}
                    name="address"
                  />
                </div>
                <div className="input-sec flex flex-col mr">
                  <p className="lbl">Enter Amount</p>
                  <input
                    type="text"
                    className="txt cleanbtn _wallet_amount_field"
                    placeholder="Wallet Amount"
                    onChange={(e) => setAddWalletAmount(e.target.value)}
                  />
                </div>
              </div>
              <div className="action flex">
                <button
                  className="btn1 cleanbtn button smallbtn font s16 b5"
                  onClick={() => {
                    handleAddWalletAmount();
                  }}
                >
                  SAVE
                </button>
                <button
                  className="btn1 cleanbtn button smallbtn font s16 b5"
                  onClick={() => {
                    setOpen4(false);
                  }}
                >
                  Close
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

      <Dialog
        open={open6}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div className="dialog-box">
          <DeleteBank />
        </div>
      </Dialog>
      <Dialog
        open={open5}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div className="dialog-box">
          <div className="add-new-card flex flex-col">
            <div className="add-new-card-heading flex aic jc">
              <div className="font s18 font b6">Add Bank Details</div>
            </div>
            <div className="block flex flex-col">
              <div className="bank-name-and-account-holder-type-container input-sec flex flex-row">
                <div className="bank-name-and-account-holder-type">
                  <p className="lbl">Bank Name</p>
                  <input
                    type="text"
                    className="txt cleanbtn"
                    placeholder="Enter bank name"
                    name="bank_name"
                    onChange={(e) => bankDetailsHandler(e)}
                    value={formData.bank_name}
                  />
                </div>
                <div className="bank-name-and-account-holder-type">
                  <p className="lbl">Account Holder Type</p>
                  <FormControl className="radio-btns-container">
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="account_holder_type"
                      onChange={(e) => bankDetailsHandler(e)}
                    >
                      <FormControlLabel
                        value="individual"
                        control={<Radio />}
                        label="Individual"
                      />
                      <FormControlLabel
                        value="company"
                        control={<Radio />}
                        label="Company"
                      />
                    </RadioGroup>
                  </FormControl>
                </div>
              </div>
              <div className="double-fields flex aic">
                <div className="input-sec flex flex-col mr">
                  <p className="lbl">Account Holder Name</p>
                  <input
                    value={formData.account_holder_name}
                    onChange={(e) => bankDetailsHandler(e)}
                    type="text"
                    name="account_holder_name"
                    className="txt cleanbtn"
                    placeholder="Enter account holder name"
                  />
                </div>
                <div className="input-sec flex flex-col mr">
                  <p className="lbl">Account Number</p>
                  <input
                    value={formData.account_number}
                    onChange={(e) => bankDetailsHandler(e)}
                    type="text"
                    name="account_number"
                    className="txt cleanbtn"
                    placeholder="Enter account number"
                  />
                </div>
                <div className="input-sec flex flex-col ml">
                  <p className="lbl">IBAN Number</p>
                  <input
                    value={formData.IBAN_Number}
                    onChange={(e) => bankDetailsHandler(e)}
                    type="text"
                    name="IBAN_Number"
                    className="txt cleanbtn"
                    placeholder="Enter IBAN number"
                  />
                </div>
              </div>
              <div className="double-fields flex aic">
                <div className="input-sec flex flex-col mr">
                  <p className="lbl">Routing number</p>
                  <input
                    value={formData.routing_number}
                    onChange={(e) => bankDetailsHandler(e)}
                    type="text"
                    name="routing_number"
                    className="txt cleanbtn"
                    placeholder="Enter routing number"
                  />
                </div>
                <div className="input-sec flex flex-col mr">
                  <p className="lbl">Swift Code</p>
                  <input
                    value={formData.swiftCode}
                    onChange={(e) => bankDetailsHandler(e)}
                    type="text"
                    name="swiftCode"
                    className="txt cleanbtn"
                    placeholder="Enter swift code"
                  />
                </div>
                <div className="input-sec flex flex-col ml">
                  <p className="lbl">Branch Name</p>
                  <input
                    value={formData.branchName}
                    onChange={(e) => bankDetailsHandler(e)}
                    type="text"
                    name="branchName"
                    className="txt cleanbtn"
                    placeholder="Enter branch name"
                  />
                </div>
              </div>
              <div className="action flex">
                <button
                  className="smallbtn cleanbtn button font s16 b5"
                  onClick={handleAddBankDetails}
                >
                  Save
                </button>
                <button
                  className="smallbtn cleanbtn button font s16 b5"
                  onClick={handleClose}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  )
};
export default MyWallet;