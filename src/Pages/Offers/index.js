import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useSelector } from 'react-redux';
import {
  DatePicker,
  Image,
  Input,
  Switch,
  Table,
  Button,
  Spin,
  Tag,
  Modal,
  Select,
} from 'antd';
import { DeleteFilled, EditFilled, EyeFilled } from '@ant-design/icons';
import { AddIcon, VisaCardIcon } from './../../Icons';
import { deleteService, get, patch, post } from '../../services/RestService';
import { downloadExcelFile, openNotification, options } from '../../helpers';
import DownloadExcel from '../../services/DownloadExcel';
import Dialog from '@mui/material/Dialog';
import Grid from '@mui/material/Grid';

const { Option } = Select;
const { RangePicker } = DatePicker;

const Offers = () => {
  let Location = useLocation();
  let id = Location.state?.id;

  const currency = useSelector((state) => state?.profile?.user?.currency);
  const [data, setData] = useState([]);
  const [dataForCard, setDataForCard] = useState([]);
  const [selectedCard, setSelectedCard] = useState();
  const [selectedPromotion, setSelectedPromotion] = useState();
  const [allCardsFormat, setallCardsFormat] = useState([]);
  const [dataFilter, setDataFilter] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const history = useHistory();
  const [checkoutFormOpen, setCheckoutFormOpen] = useState(false);
  const [cardsModalOpen, setCardsModalOpen] = useState(false);
  const [setting, setSettings] = useState();
  const [chargesModalOpen, setChargesModalOpen] = useState(false);
  const [chargesText, setChargesText] = useState(false);
  const [location, setLocation] = useState();
  const [promotionCharges, setPromotionCharges] = useState({});
  const [days, setDays] = useState();
  const [formData, setFormData] = useState({
    number: '',
    exp_month: '',
    exp_year: '',
    cvc: '',
    name: '',
  });

  const getData = () => {
    setLoading(true);
    get('/promotions/myPromotions', options)
      .then((data) => {
        setData(data.result);
        setDataFilter(data.result);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const getSettings = () => {
    get('/promotions/promotionsCharges', options).then((res) =>
      setPromotionCharges(res?.result)
    );
  };

  const updateStatus = (id, checked) => {
    setLoading(true);

    const data = {
      offerId: id,
    };
    patch(`/promotions/activate/${id}`, data, options)
      .then((data) => {
        openNotification('Status Changed Successfully');
        getData();
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const deleteUser = (id) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('offerId', id);

    deleteService(`/promotions/${id}`, formData, options)
      .then((data) => {
        if (data.status === 'success') {
          openNotification('Promotions Deleted Successfully');
          getData();
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const getPrice = (type) => {
    const { user } = JSON.parse(localStorage.getItem('user'));
    if (type === 'servicePage') {
      const price = setting?.find((x) => x.country === user.country[0]);
      return price?.adminCommission +
        price?.promoServicePageCharge +
        ' ' +
        price &&
        price !== undefined &&
        price.currency !== undefined
        ? price.currency
        : '';
    }
    if (type === 'homePage') {
      const price = setting?.find((x) => x.country === user.country[0]);
      return price?.adminCommission + price &&
        price !== undefined &&
        price.promoHomePageCharge + ' ' + price &&
        price !== undefined &&
        price.currency !== undefined
        ? price.currency
        : '';
    }
  };

  const formDataHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getDataForCard = () => {
    let tempData = [];
    get('/cards/', options).then((res) => {
      setDataForCard(res.result.data);
      setSelectedCard(res.result.data[0]);
      let final_loop = res.result.data;
      if (final_loop && final_loop.length > 0) {
        final_loop.forEach((item) => {
          if (item.last4 !== '' && item.last4 !== undefined) {
            let objData = {
              value: item.id,
              title:
                item.name +
                ' - ****' +
                item.last4 +
                ' ,' +
                item.exp_month +
                ' ' +
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

  const handleDownloadSheet = () => {
    const downloadData = dataFilter.map((item) => {
      return {
        Date: item?.createdAt,
        Title: item?.title,
        Description: item?.description,
        Before_Discount: item?.previousPrice,
        Discount: item?.discount,
        After_Discount: item?.priceAfterDiscount,
        Country: item?.country,
        Location: item?.location,
        Days: item?.days,
        Promotion_Charges: item?.promotionCharges,
        Admin_Status: item?.activeByAdmin,
        Admin_Status: item?.adminStatus,
        Dispute_Status: item?.disputeStatus,
        payment: item?.paymentStatus,
      };
    });
    const jsonData = JSON.stringify(downloadData);
    DownloadExcel(jsonData, 'Promotions', 'Promotions');
  };

  useEffect(() => {
    getData();
    getDataForCard();
    getSettings();
  }, []);
  useEffect(() => {
    if (data && data.length >= 1) {
      if (id) {
        history.push(`offerform?type=view&id=${id}`);
      }
    }
  }, [data, id]);

  const addCardHandler = () => {
    setPaymentLoading(true);
    post('/cards', formData, options)
      .then((res) => {
        openNotification('Card Added Successfully');
        getDataForCard();
        setCheckoutFormOpen(false);
        setPaymentLoading(false);
      })
      .catch((err) => {
        err?.message && openNotification(err.message);
        setPaymentLoading(false);
      });
  };

  const makePayment = () => {
    setPaymentLoading(true);
    const body = {
      promotionId: selectedPromotion?.id,
      source: selectedCard?.id,
    };
    post('/promotions/checkout', body, options)
      .then(() => {
        openNotification('Payment Successful');
        setCardsModalOpen(false);
        setPaymentLoading(false);
      })
      .catch(() => {
        setPaymentLoading(false);
        openNotification('Payment Failed');
      });
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      ellipsis: true,
      render: (_, data) => <p>{data && data?.createdAt.substring(0, 10)}</p>,
    },
    {
      title: 'Image',
      dataIndex: 'promoImg',
      key: 'promoImg',
      render: (_, data) => (
        <Image
          style={{ width: 50, height: 50, objectFit: 'contain' }}
          src={data && data.promoImg}
        />
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      render: (_, data) => (
        <p>
          {data &&
            (data.title.length > 10
              ? `${data.title.substring(0, 10)}...`
              : data.title)}
        </p>
      ),
    },

    {
      title: 'Description',
      dataIndex: 'discount',
      key: 'discount',
      ellipsis: true,
      render: (_, data) => (
        <p>
          {data.discount &&
            (data.description.length > 10
              ? `${data.description.substring(0, 10)}...`
              : data.description)}
        </p>
      ),
    },
    {
      title: 'Before Discount',
      dataIndex: 'discount',
      key: 'discount',
      render: (_, data) => <p>{data.previousPrice && data.previousPrice}</p>,
    },
    {
      title: 'Discount',
      dataIndex: 'discount',
      key: 'discount',
      render: (_, data) => <p>{data.discount && data.discount} %</p>,
    },
    {
      title: 'After Discount',
      dataIndex: 'discount',
      key: 'discount',
      render: (_, data) => <p>{data && data.priceAfterDiscount}</p>,
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
      ellipsis: true,
      render: (_, data) => <p>{data.country && data.country}</p>,
    },
    {
      title: 'Location',
      dataIndex: 'loc',
      key: 'loc',
      render: (_, data) => <p>{data.location && data.location}</p>,
    },
    {
      title: 'Days',
      dataIndex: 'loc',
      key: 'loc',
      render: (_, data) => <p>{data.days && data.days}</p>,
    },
    {
      title: 'Promotion Charges',
      dataIndex: 'promotionCharges',
      key: 'promotionCharges',
      render: (_, data) => (
        <p>{data.promotionCharges && data.promotionCharges}</p>
      ),
    },
    {
      title: 'Admin Status',
      dataIndex: 'active',
      key: 'active',
      render: (_, data) => (
        <Tag
          className='status_indicator'
          color={
            data?.activeByAdmin == 'Active'
              ? 'green'
              : data?.activeByAdmin == 'Pending'
              ? 'yellow'
              : 'red'
          }
        >
          {data?.activeByAdmin}
        </Tag>
      ),
    },
    // {
    //   title: "Status",
    //   dataIndex: "active",
    //   key: "active",
    //   render: (_, data) => (
    //     <Switch
    //       checked={data.active}
    //       onChange={(e) => updateStatus(data._id, e)}
    //     />
    //   ),
    // },
    {
      title: 'Payment',
      dataIndex: 'Pay',
      key: 'Pay',
      align: 'center',
      render: (_, data) => (
        <Button
          type='primary'
          small
          disabled={
            data.activeByAdmin !== 'Active' ||
            data?.paymentStatus === 'completed'
          }
          className={
            data?.activeByAdmin === 'Reject'
              ? '_pay_btn_cancelled'
              : data?.paymentStatus === 'completed'
              ? '_pay_btn_completed'
              : data?.paymentStatus === 'pending'
              ? '_pay_btn_pending'
              : '_pay_btn_pending'
          }
          onClick={() => {
            setCardsModalOpen(true);
            setSelectedPromotion(data);
          }}
        >
          <div>
            <div>
              {data?.paymentStatus === 'completed'
                ? 'Paid'
                : data?.activeByAdmin == 'Pending'
                ? 'Pending'
                : 'Pay Now'}
            </div>
            <div style={{ marginLeft: 5, marginRight: 5 }}>
              {getPrice(data?.location)}
            </div>
          </div>
        </Button>
      ),
    },
    {
      title: 'Actions',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      render: (_, data) => (
        <div className='_actions_container'>
          <EyeFilled
            onClick={() => {
              history.push(`offerform?type=view&id=${data._id}`);
            }}
            style={{
              color: 'grey',
              cursor: 'pointer',
              fontSize: 25,
              marginRight: 10,
            }}
          />
          {data.activeByAdmin !== 'Active' && (
            <EditFilled
              onClick={() => {
                history.push(`offerform?type=edit&id=${data._id}`);
              }}
              style={{
                color: 'grey',
                cursor: 'pointer',
                fontSize: 25,
                marginRight: 10,
              }}
            />
          )}
          <DeleteFilled
            onClick={() => {
              deleteUser(data._id);
            }}
            style={{ color: 'grey', cursor: 'pointer', fontSize: 25 }}
          />
        </div>
      ),
    },
  ];

  const searchByName = (name) => {
    if (name !== '') {
      const res = data.filter((sd) =>
        sd.title.toString().toLowerCase().includes(name)
      );
      setData(res);
    } else {
      setData(dataFilter);
    }
  };

  const searchByDate = (dates) => {
    if (dates[0] !== '' && dates[1] !== '') {
      const res = data.filter((sd) => {
        return (
          sd?.createdAt.substring(0, 10) >= dates[0] &&
          sd?.createdAt.substring(0, 10) <= dates[1]
        );
      });
      setData(res);
    } else {
      setData(dataFilter);
    }
  };

  return (
    <div id='users' style={{ padding: 30 }}>
      <div className='users-wrapper'>
        <Grid container spacing={1}>
          <Grid item xl={9} lg={9} md={5} sm={12} xs={12}>
            <h1>Promotions</h1>
          </Grid>
          <Grid item xl={2} lg={2} md={4} sm={12} xs={12}>
            <Button
              className='w120'
              onClick={handleDownloadSheet}
              type='primary'
            >
              Download
            </Button>
          </Grid>
          <Grid item xl={1} lg={1} md={3} sm={12} xs={12}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                onClick={() => {
                  setChargesModalOpen(true);
                }}
                style={{ marginLeft: 30 }}
                type='primary'
              >
                Create Promotion
              </Button>
            </div>
          </Grid>
        </Grid>

        <div style={{ marginTop: 30 }}>
          <Grid container spacing={2}>
            <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
              <div>
                <p>Search By Title</p>
                <Input
                  onChange={(e) => {
                    searchByName(e.target.value.toLowerCase());
                  }}
                  className='_invite_friends_input'
                  placeholder='Search By Title'
                />
              </div>
            </Grid>
            <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
              <p>Search by Date</p>
              <RangePicker
                className='_invite_friends_input'
                style={{ width: '100%' }}
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
            dataSource={data.reverse()}
          />
        </div>
        <Dialog
          open={checkoutFormOpen}
          onClose={() => setCheckoutFormOpen(false)}
        >
          <div className='dialog-box'>
            <div className='add-new-card flex flex-col'>
              <div className='add-new-card-heading flex aic jc'>
                <div className='font s18 font b6'>Add New Card</div>
              </div>
              <div className='block flex flex-col'>
                <div className='input-sec flex flex-col'>
                  <p className='lbl'>Card Holder Name</p>
                  <input
                    name='name'
                    type='text'
                    className='txt cleanbtn'
                    placeholder='card holder name'
                    onChange={(e) => formDataHandler(e)}
                    value={formData.name}
                  />
                </div>
                <div className='input-sec flex flex-col'>
                  <p className='lbl'>Card Number</p>
                  <input
                    name='number'
                    onChange={(e) => formDataHandler(e)}
                    value={formData.number}
                    type='text'
                    className='txt cleanbtn'
                    placeholder='xxxx xxxx xxxx xxxx'
                  />
                </div>
                <div className='double-fields flex aic'>
                  <div className='input-sec flex flex-col mr'>
                    <p className='lbl'>Expiry Month</p>
                    <input
                      name='exp_month'
                      value={formData.exp_month}
                      onChange={(e) => formDataHandler(e)}
                      type='number'
                      className='txt cleanbtn'
                      placeholder='MM'
                    />
                  </div>
                  <div className='input-sec flex flex-col mr'>
                    <p className='lbl'>Expiry Year</p>
                    <input
                      name='exp_year'
                      value={formData.exp_year}
                      onChange={(e) => formDataHandler(e)}
                      type='number'
                      className='txt cleanbtn'
                      placeholder='YYYY'
                    />
                  </div>
                  <div className='input-sec flex flex-col ml'>
                    <p className='lbl'>cvv</p>
                    <input
                      name='cvc'
                      value={formData.cvc}
                      onChange={(e) => formDataHandler(e)}
                      type='text'
                      className='txt cleanbtn'
                      placeholder='xxx'
                    />
                  </div>
                </div>
                <div className='action flex'>
                  <button
                    className='btn1 smallbtn cleanbtn button font s16 b5'
                    disabled={paymentLoading}
                    onClick={addCardHandler}
                  >
                    {paymentLoading ? (
                      <div className='_payment_loader'>
                        <Spin />
                      </div>
                    ) : (
                      'Save'
                    )}
                  </button>
                  <button
                    className='btn1 smallbtn cleanbtn button font s16 b5'
                    onClick={() => setCheckoutFormOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Dialog>
        <Dialog
          open={cardsModalOpen}
          onClose={() => setCardsModalOpen(false)}
          width={50}
        >
          <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
            <div className='_my_wallet_card_main'>
              <div className='_my_wallet_card_header_main2'>
                <p className='_my_wallet_card_header_title'>Cards</p>
              </div>
              {dataForCard?.map((card) => (
                <>
                  <div
                    className={
                      selectedCard?.id === card?.id
                        ? '_my_wallet_visa_card_main_selected'
                        : '_my_wallet_visa_card_main'
                    }
                    onClick={() => setSelectedCard(card)}
                  >
                    <div className='_my_wallet_visa_card_part1_main'>
                      <div className='_my_wallet_visa_icon_main'>
                        <VisaCardIcon />
                      </div>
                    </div>
                    <p className='_my_wallet_visa_card_number'>{card.name}</p>
                    <p className='_my_wallet_visa_card_title'>{card.brand}</p>
                    <div className='_my_wallet_visa_card_part1_main'>
                      <p className='_my_wallet_visa_card_exp_date'>
                        {card.exp_month}/{card.exp_year}
                      </p>
                    </div>
                    <p className='_my_wallet_visa_card_holder_name'>
                      {card.country}
                    </p>
                  </div>
                </>
              ))}
              <div className='_cards_modal_pay_btn_container'>
                <button
                  className='btn1 smallbtn cleanbtn button'
                  disabled={paymentLoading}
                  onClick={makePayment}
                >
                  <div>
                    {paymentLoading ? (
                      <div className='_payment_loader'>
                        <Spin />
                      </div>
                    ) : (
                      `Pay ${currency} ${selectedPromotion?.promotionCharges}`
                    )}
                  </div>
                </button>
              </div>
              <div className='_cards_modal_Add_new_card_btn_main'>
                <button
                  className='_my_wallet_Add_new_card_btn flex aic jc'
                  onClick={(e) => {
                    setCheckoutFormOpen(true);
                  }}
                >
                  <div>Add new Card</div>
                  <AddIcon />
                </button>
              </div>
            </div>
          </Grid>
        </Dialog>
      </div>
      <Modal
        title='Where you want to display promotion?'
        okText='Ok'
        destroyOnClose
        visible={chargesModalOpen}
        onCancel={() => {
          setChargesModalOpen(false);
          setLocation(null);
        }}
        onOk={() => {
          location && setChargesModalOpen(false);
          location && setChargesText(true);
        }}
      >
        <Select
          placeholder='Select'
          rules={[{ required: true, message: 'Required' }]}
          style={{ width: '100%' }}
          onChange={(value) => setLocation(value)}
          optionLabelProp='label'
          size='large'
        >
          <Option value='servicePage' label='Service page' key='service'>
            <div className='demo-option-label-item'>
              <span>Service page</span>
            </div>
          </Option>
          <Option value='homePage' label='Home page' key='home'>
            <div className='demo-option-label-item'>
              <span>Home page</span>
            </div>
          </Option>
        </Select>
      </Modal>
      <Modal
        title='Select days'
        okText='Ok'
        destroyOnClose
        visible={chargesText}
        onCancel={() => {
          setChargesText(false);
          setDays(null);
        }}
        onOk={() => {
          if (days) {
            setChargesText(false);
            history.push(
              `offerform?type=create&location=${location}&days=${days}`
            );
          }
        }}
      >
        <h1 className='promotion-charges-text'>
          2 days charges will be{' '}
          {location === 'servicePage'
            ? promotionCharges?.promoServicePageTwoDays?.value
            : promotionCharges?.promoHomePageTwoDays?.value}{' '}
          {currency}
        </h1>
        <h1 className='promotion-charges-text'>
          5 days charges will be{' '}
          {location === 'servicePage'
            ? promotionCharges?.promoServicePageFiveDays?.value
            : promotionCharges?.promoHomePageFiveDays?.value}{' '}
          {currency}
        </h1>
        <Select
          placeholder='Select'
          rules={[{ required: true, message: 'Required' }]}
          style={{ width: '100%' }}
          onChange={(value) => setDays(value)}
          optionLabelProp='label'
          size='large'
        >
          <Option value='two' label='2 days' key='service'>
            <div className='demo-option-label-item'>
              <span>2 days</span>
            </div>
          </Option>
          <Option value='five' label='5 days' key='home'>
            <div className='demo-option-label-item'>
              <span>5 days</span>
            </div>
          </Option>
        </Select>
      </Modal>
    </div>
  );
};

export default Offers;
