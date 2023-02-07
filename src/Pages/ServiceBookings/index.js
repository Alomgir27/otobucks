import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DownloadExcel from '../../services/DownloadExcel';
// MUI | ANT-D :
import Grid from '@mui/material/Grid';
import moment from 'moment';
import { DatePicker, Input, Table, Select, Button, Tag, Popover } from 'antd';
import { DeleteFilled, EditFilled } from '@ant-design/icons';


// ASSETS | Icons :
import {
  EyeFilled,
  PicCenterOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

// Components :
import BookingDetails from './bookingDetails';
import ViewDetailsModal from './ViewDetailsModal';
import DisputeModal from './DisputeModal';

// APIs | Helpers :
import {
  openErrorNotification,
  openNotification,
  options,
} from '../../helpers';
import { deleteService, get, patch } from '../../services/RestService';
import { useReactToPrint } from 'react-to-print';

import './styles.scss';

const { Option } = Select;

const Jobs = () => {
  let location = useLocation();

  const [id, setId] = useState(location?.state?.id);
  let path = location?.state?.path;

  const componentRef = useRef();
  const estimationRef = useRef();

  const { RangePicker } = DatePicker;

  const [bookingDetailsOpen, setBookingDetailsOpen] = useState(false);
  const [createEstimationForm, setCreateEstimationForm] = useState(false);

  const [bookings, setBookings] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState();
  const [settingsData, setSettingsData] = useState();

  const [estimationEditable, setEstimationEditable] = useState(false);
  const [reSubmit, setResubmit] = useState(false);

  const [isOfferModalView, setIsOfferModalView] = useState(false);
  const [offerModalLoading, setOfferModalLoading] = useState(false);
  const [selectedOfferData, setSelectedOfferData] = useState({});
  const [offerAccepted, setofferAccepted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [reloadPage, setReloadPage] = useState(false);

  const [disputeModal, setDisputeModal] = useState({
    open: false,
    id: null,
  });

  const [searchValues, setSearchValues] = useState({
    serviceName: '',
    customerName: '',
    totalPrice: '',
    status: '',
    date: '',
  });

  const [data, setData] = useState([
    {
      title: '',
      description: '',
      quantity: '',
      price: '',
      tax: 5,
      amount: '',
    },
  ]);

  const viewingOfferDetails = (data) => {
    setIsOfferModalView(true);
    setOfferModalLoading(true);
    setSelectedBooking(data);
    setSelectedOfferData({
      // "Estimation Amount": data?.estimation?.subTotal,
      // "Estimation Tax": data?.estimation?.serviceTax,
      // "Estimation Total Amount": data?.estimation?.grandTotal,
      'Offer Amount': data?.estimation?.offerAmount,
      'Offer Note': data?.estimation?.offerNote,
    });
    setOfferModalLoading(false);
  };

  const getBookings = () => {
    setLoading(true);
    setSelectedBooking(null);
    setCreateEstimationForm(false);
    setEstimationEditable(false);
    setIsOfferModalView(false);
    setResubmit(false);
    setData([
      {
        title: '',
        description: '',
        quantity: '',
        price: '',
        tax: 5,
        amount: '',
      },
    ]);
    setofferAccepted(false);
    get('/bookings/bookService', options)
      .then((res) => {
        setBookings(res.result);
        setFilterData(res.result.reverse());
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        err?.message && openNotification(err.message);
      });
  };
  const gettingSingleBooking = async () => {
    const findBooking = bookings.find((data) => data._id == id);
    if (findBooking) {
      setBookingDetailsOpen(true);
      setSelectedBooking(findBooking);
    } else {
      openErrorNotification('Booking not found');
    }
  };
  const getSettings = () => {
    setLoading(true);
    get('/estimate-setting/', options)
      .then((res) => {
        const estimationSettings = res?.result[0];
        setSettingsData({
          invoiceTitle: estimationSettings?.invoiceTitle,
          website: estimationSettings?.website,
          taxNumber: estimationSettings?.taxNumber ?? '',
          taxPercentage: estimationSettings?.taxPercentage,
          logoImage: estimationSettings?.logoImage,
        });
        setData([
          {
            ...data[0],
            tax: estimationSettings?.taxPercentage,
          },
        ]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const showEstimations = async ({ id = null, data = null }) => {
    let findBooking;
    if (id) {
      findBooking = bookings.find((data) => data._id == id);
    } else {
      findBooking = data;
    }
    setSelectedBooking(findBooking);
    setData(findBooking?.estimation?.items ?? data);
    setCreateEstimationForm(true);
  };

  useEffect(() => {
    getSettings();
  }, []);
  useEffect(() => {
    getBookings();
  }, [reloadPage]);
  useEffect(() => {
    if (bookings.length >= 1) {
      if (id) {
        if (path == 'estimation') {
          showEstimations({ id: id });
        } else {
          gettingSingleBooking();
        }
      }
    }
  }, [bookings, id]);

  const getSubTotal = () => {
    let total = 0;
    data?.forEach((estimation) => {
      total =
        parseFloat(total) +
        parseFloat(estimation.price) * parseFloat(estimation.quantity);
    });
    return total;
  };
  const getDiscount = (subTotal) => {
    let offerAmount = selectedBooking?.estimation?.offerAmount;
    let discount = parseFloat(subTotal) - parseFloat(offerAmount);
    return discount;
  };

  const getFinalTotal = () => {
    let total = 0;
    data?.forEach((estimation) => {
      total =
        parseFloat(total) +
          estimation.quantity * estimation.price +
          (estimation.quantity * estimation.price * estimation.tax) / 100 ?? '';
    });
    return total;
  };

  const handleDownloadSheet = () => {
   
    const downloadData = filterData.map((item) => {
      return {
        Date: item?.createdAt,
        Customer_Name: `${item?.customer?.firstName} ${item?.customer?.lastName}`,
        Service_Name: item?.source?.title,
        Time: item?.bookingDetails?.time,
        Total_Amount: item?.totalprice,
        Paid_Amount: item?.paymentCompleted,
        Balance_Amount: item?.totalprice - item?.paymentCompleted,
        Offer_Status: item.estimation
          ? item.estimation.isOfferCreated == true
            ? item.estimation.offerStatus == 'pending'
              ? 'Customer submitted an Offer'
              : item.estimation.offerStatus == 'accepted'
              ? 'Offer accepted by you'
              : 'Offer was Declined'
            : 'Customer has not given any offer yet'
          : 'Customer has not given any offer yet',
        Estimation_Status: item?.status,
        Booking_Status: item?.status,
      };
    });
    const jsonData = JSON.stringify(downloadData);
    DownloadExcel(jsonData, 'ServiceBooking', 'Service Booking');
  };

  const downloadPdf = useReactToPrint({
    content: () => componentRef.current,
  });
  const downloadEstimationPdf = useReactToPrint({
    content: () => estimationRef.current,
  });

  const handleChange = (index, key1, value1, key2, value2) => {
    const deepCopy = [...data];
    deepCopy[index] = key2
      ? {
          ...deepCopy[index],
          [key1]: value1,
          [key2]: value2,
        }
      : {
          ...deepCopy[index],
          [key1]: value1,
        };
    setData(deepCopy);
  };

  const handleSubmitForm = () => {
    if (data?.lenght === 0) {
      openNotification('Please add at least one item');
    } else if (
      isNaN(getSubTotal()) ||
      isNaN(getFinalTotal() - getSubTotal()) ||
      isNaN(getFinalTotal())
    ) {
      openNotification('Invalid quotation for customer');
    } else {
      if (offerAccepted) {
        let customer_data = {
          bookingID: selectedBooking?._id,
          items: data,
          status: reSubmit ? 'reSubmitted' : 'submitted',
          subTotal: getSubTotal(),
          discount: getDiscount(getSubTotal()),
          discountedPrice: selectedBooking?.estimation?.offerAmount,
          serviceTax:
            (parseFloat(selectedBooking?.estimation?.offerAmount) *
              parseFloat(settingsData.taxPercentage)) /
            100,
          grandTotal:
            parseFloat(selectedBooking?.estimation?.offerAmount) +
            (parseFloat(selectedBooking?.estimation?.offerAmount) *
              parseFloat(settingsData.taxPercentage)) /
              100,
          invoiceNumber: `0${bookings?.length + 1}`,
          estimationImage: settingsData.logoImage,
        };
        patch(`/bookings/bookService/offer/accept`, customer_data, options)
          .then(() => {
            openNotification(
              `Estimation ${
                reSubmit ? 'reSubmitted' : 'submitted'
              } Successfully`
            );
            setBookingDetailsOpen(false);
            setCreateEstimationForm(false);
            setResubmit(false);
            setData([
              {
                title: '',
                description: '',
                quantity: '',
                price: '',
                tax: '5',
                amount: '',
              },
            ]);
            setofferAccepted(false);
            getBookings();
          })
          .catch((error) => {
            openNotification(error.message);
          });
      } else {
        let customer_data = {
          bookingID: selectedBooking?._id,
          items: data,
          status: reSubmit ? 'reSubmitted' : 'submitted',
          subTotal: getSubTotal(),
          serviceTax: getFinalTotal() - getSubTotal(),
          grandTotal: getFinalTotal(),
          invoiceNumber: `0${bookings?.length + 1}`,
          estimationImage: settingsData.logoImage,
        };
        patch(`/bookings/bookService/createEstimation`, customer_data, options)
          .then(() => {
            openNotification(
              `Estimation ${
                reSubmit ? 'Resubmitted' : 'Submitted'
              } Successfully`
            );
            setBookingDetailsOpen(false);
            setCreateEstimationForm(false);
            setResubmit(false);
            setData([
              {
                title: '',
                description: '',
                quantity: '',
                price: '',
                tax: '5',
                amount: '',
              },
            ]);
            setofferAccepted(false);
            getBookings();
          })
          .catch((error) => {
            openNotification(error.message);
          });
      }
    }
  };

  const cancelBooking = () => {
    patch(
      '/bookings/bookService/cancel',
      { bookingID: selectedBooking?._id },
      options
    )
      .then(() => {
        openNotification('Booking Cancelled successfully');
        getBookings();
        setBookingDetailsOpen(false);
      })
      .catch(() => {
        openNotification('Failed to Cancel Booking');
        setBookingDetailsOpen(false);
      });
  };

  const deleteBooking = (id) => {
    setLoading(true);
    deleteService(`/bookings/${id}`)
      .then(() => {
        setLoading(false);
        openNotification('Booking Deleted successfully');
        getBookings();
        setBookingDetailsOpen(false);
      })
      .catch(() => {
        setLoading(false);
        openNotification('Failed to Delete Booking');
        setBookingDetailsOpen(false);
      });
  };

  const acceptOffer = () => {
    setofferAccepted(true);
    setCreateEstimationForm(true);
    setEstimationEditable(true);
    setBookingDetailsOpen(false);
    setResubmit(true);
    setData(selectedBooking?.estimation?.items ?? data);
  };
  const declineOffer = () => {
    setOfferModalLoading(true);
    patch(
      `/bookings/bookService/offer/decline`,
      { bookingID: selectedBooking._id },
      options
    )
      .then(() => {
        openNotification('Offer declined successfully');
        setIsOfferModalView(false);
        getBookings();
      })
      .catch((err) => {
        setOfferModalLoading(false);
        openErrorNotification(err.message);
      });
  };

  const handleSearch = (event) => {
    let { name, value } = event.target;
    setSearchValues({
      serviceName: '',
      customerName: '',
      totalPrice: '',
      status: '',
      date: '',
      [name]: value,
    });
  };
  useEffect(() => {
    setFilterData(
      bookings?.filter((provider) => {
        return (
          `${provider?.customer?.firstName} ${provider?.customer?.lastName}`
            .toLocaleLowerCase()
            .includes(searchValues.customerName) &&
          provider?.source?.title
            ?.toLocaleLowerCase()
            ?.includes(searchValues.serviceName) &&
          `${provider?.totalprice}`
            ?.toLocaleLowerCase()
            ?.includes(searchValues.totalPrice) &&
          provider?.status
            ?.toLocaleLowerCase()
            ?.includes(searchValues.status) &&
          (!searchValues?.date[0] ||
            (provider?.createdAt.substring(0, 10) >= searchValues.date[0] &&
              provider?.createdAt.substring(0, 10) <= searchValues.date[1]))
        );
      })
    );
  }, [searchValues, bookings]);

  const handleEstimationStatus = (status) => {
    switch (status) {
      case 'pending':
        return (
          <Popover content='Customer Requested for Estimation'>
            <Tag className='status_indicator' color='yellow'>
              {status}
            </Tag>
          </Popover>
        );
        break;
      case 'submitted':
        return (
          <Popover content='Estimation was Submitted to Customer'>
            <Tag className='status_indicator' color='blue'>
              {status}
            </Tag>
          </Popover>
        );
        break;
      case 'reSubmitted':
        return (
          <Popover content='Estimation was ReSubmitted to Customer'>
            <Tag className='status_indicator' color='blue'>
              {status}
            </Tag>
          </Popover>
        );
        break;
      case 'inProgress':
        return (
          <Popover content='Customer PartialPaid the Booking'>
            <Tag className='status_indicator' color='green'>
              Partially Paid
            </Tag>
          </Popover>
        );
        break;
      case 'completed':
        return (
          <Popover content='Booking was Completed'>
            <Tag className='status_indicator' color='green'>
              Complete Paid
            </Tag>
          </Popover>
        );
        break;
      case 'declined':
        return (
          <Popover content='Booking Declined by Customer'>
            <Tag className='status_indicator' color='red'>
              {status}
            </Tag>
          </Popover>
        );
        break;
      case 'cancelled':
        return (
          <Popover content='Booking was Cancelled by You'>
            <Tag className='status_indicator' color='red'>
              {status}
            </Tag>
          </Popover>
        );
        break;
      default:
        return (
          <Popover content='NULL'>
            <Tag className='status_indicator' color='purple'>
              NULL
            </Tag>
          </Popover>
        );
        break;
    }
  };
  const handleBookingStatus = (status) => {
    switch (status) {
      case 'pending':
        return (
          <Popover content='Booking is Pending'>
            <Tag className='status_indicator' color='yellow'>
              {status}
            </Tag>
          </Popover>
        );
        break;
      case 'submitted':
        return (
          <Popover content='Booking is Pending'>
            <Tag className='status_indicator' color='yellow'>
              pending
            </Tag>
          </Popover>
        );
        break;
      case 'reSubmitted':
        return (
          <Popover content='Booking is Pending'>
            <Tag className='status_indicator' color='yellow'>
              pending
            </Tag>
          </Popover>
        );
        break;
      case 'inProgress':
        return (
          <Popover content='Booking is in Progress'>
            <Tag className='status_indicator' color='blue'>
              {status}
            </Tag>
          </Popover>
        );
        break;
      case 'completed':
        return (
          <Popover content='Booking Completed'>
            <Tag className='status_indicator' color='green'>
              {status}
            </Tag>
          </Popover>
        );
        break;
      case 'declined':
        return (
          <Popover content='Booking Declined by Customer'>
            <Tag className='status_indicator' color='red'>
              cancelled
            </Tag>
          </Popover>
        );
        break;
      case 'cancelled':
        return (
          <Popover content='Booking Cancelled by You'>
            <Tag className='status_indicator' color='red'>
              {status}
            </Tag>
          </Popover>
        );
        break;
      default:
        return (
          <Popover content='NULL'>
            <Tag className='status_indicator' color='purple'>
              NULL
            </Tag>
          </Popover>
        );
        break;
    }
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      ellipsis: true,
      render: (_, dataFilter) => (
        <p>{dataFilter?.createdAt.substring(0, 10)}</p>
      ),
    },
    {
      title: 'Customer Name',
      dataIndex: 'customer',
      key: 'customer',
      ellipsis: true,
      render: (_, dataFilter) => (
        <p>
          {`${dataFilter?.customer?.firstName} ${dataFilter?.customer?.lastName}`}
        </p>
      ),
    },
    {
      title: 'Service Name',
      dataIndex: 'Service',
      key: 'Service',
      ellipsis: true,
      render: (_, dataFilter) => <p>{dataFilter?.source?.title}</p>,
    },
    {
      title: 'Time',
      dataIndex: 'Time',
      key: 'Time',
      render: (_, dataFilter) => <p>{dataFilter?.bookingDetails?.time}</p>,
    },
    {
      title: 'Total Amount',
      dataIndex: 't_amount',
      key: 't_amount',
      render: (_, dataFilter) => <p>{dataFilter?.totalprice}</p>,
    },
    {
      title: 'Amount Paid',
      dataIndex: 'price',
      key: 'price',
      render: (_, dataFilter) => <p>{dataFilter?.paymentCompleted}</p>,
    },
    {
      title: 'Balance Amount',
      dataIndex: 'price',
      key: 'price',
      render: (_, dataFilter) => (
        <p>{dataFilter?.totalprice - dataFilter?.paymentCompleted}</p>
      ),
    },
    {
      title: 'Offer Status',
      dataIndex: 'offer',
      key: 'offer',
      align: 'center',
      render: (_, dataFilter) => (
        <Popover
          content={
            dataFilter.estimation
              ? dataFilter.estimation.isOfferCreated == true
                ? dataFilter.estimation.offerStatus == 'pending'
                  ? 'Customer submitted an Offer'
                  : dataFilter.estimation.offerStatus == 'accepted'
                  ? 'Offer accepted by you'
                  : 'Offer was Declined'
                : 'Customer has not given any offer yet'
              : 'Customer has not given any offer yet'
          }
        >
          {' '}
          <Tag
            className='status_indicator'
            color={
              dataFilter?.estimation?.isOfferCreated == true
                ? dataFilter?.estimation?.offerStatus == 'pending'
                  ? 'blue'
                  : dataFilter?.estimation?.offerStatus == 'accepted'
                  ? 'green'
                  : 'red'
                : 'yellow'
            }
            onClick={() =>
              dataFilter?.estimation?.isOfferCreated
                ? viewingOfferDetails(dataFilter)
                : null
            }
          >
            {' '}
            {dataFilter?.estimation?.isOfferCreated == true
              ? dataFilter?.estimation?.offerStatus == 'pending'
                ? 'View Offer'
                : dataFilter?.estimation?.offerStatus
              : 'No Offer'}{' '}
          </Tag>{' '}
        </Popover>
      ),
    },
    {
      title: 'Estimation Status',
      dataIndex: 'Status',
      key: 'Status',
      align: 'center',
      render: (_, dataFilter) => handleEstimationStatus(dataFilter?.status),
    },
    {
      title: 'Booking Status',
      dataIndex: 'Status',
      key: 'Status',
      align: 'center',
      render: (_, dataFilter) => handleBookingStatus(dataFilter.status),
    },
    {
      title: 'Actions',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      ellipsis: true,
      render: (_, dataFilter) => (
        <div className='action-icons'>
          {dataFilter.status == 'declined' ||
          dataFilter.status == 'completed' ||
          dataFilter.status == 'cancelled' ? (
            <Popover content='Delete Booking'>
              <DeleteFilled
                onClick={() => {
                  deleteBooking(dataFilter._id);
                }}
              />
            </Popover>
          ) : (
            <Popover
              content={'You cannot delete booking in ' + dataFilter.status}
            >
              <DeleteFilled
              // onClick={() => {
              //   deleteBooking(dataFilter._id);
              // }}
              />
            </Popover>
          )}
          <Popover content='View Booking'>
            <EyeFilled
              onClick={() => {
                setBookingDetailsOpen(true);
                setSelectedBooking(dataFilter);
              }}
            />
          </Popover>
          {dataFilter.status != 'pending' &&
          dataFilter.status != 'cancelled' ? (
            <div
              className='action_box'
              onClick={() => {
                showEstimations({ data: dataFilter });
              }}
            >
              {' '}
              Show Estimation{' '}
            </div>
          ) : (
            <>
              {dataFilter.status == 'cancelled' ? (
                <>
                  <Popover
                    className='no_drop'
                    content='Estimation cannot be created when booking is Cancelled'
                  >
                    <div className='action_box no_drop'>
                      {' '}
                      Create Estimation{' '}
                    </div>
                  </Popover>
                </>
              ) : (
                <div
                  className='action_box'
                  onClick={() => {
                    setSelectedBooking(dataFilter);
                    setCreateEstimationForm(true);
                    setEstimationEditable(true);
                    setBookingDetailsOpen(false);
                  }}
                >
                  Create Estimation
                </div>
              )}
            </>
          )}
          {dataFilter.status == 'pending' ||
          dataFilter.status == 'cancelled' ? (
            <Popover
              className='no_drop'
              content={
                dataFilter.status == 'pending'
                  ? 'Dispute cannot be created when booking is still in pending'
                  : dataFilter.status == 'cancelled'
                  ? 'dispute cannot be created when booking was Cancelled'
                  : ''
              }
            >
              <div className='action_box no_drop'> create Dispute </div>
            </Popover>
          ) : dataFilter.disputeStatus ? (
            <div className='action_box no_drop' onClick={() => {}}>
              {' '}
              Dispute Created{' '}
            </div>
          ) : (
            <>
              <div
                className='action_box'
                onClick={() => {
                  setDisputeModal({ open: true, id: dataFilter._id });
                }}
              >
                create Dispute
              </div>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      {disputeModal.open && (
        <DisputeModal
          modalData={disputeModal}
          setModalData={setDisputeModal}
          setReloadPage={setReloadPage}
        />
      )}
      {bookingDetailsOpen ? (
        <div className='estimation-details'>
          <BookingDetails
            setBookingDetailsOpen={setBookingDetailsOpen}
            selectedBooking={selectedBooking}
            cancelBooking={cancelBooking}
            setCreateEstimationForm={setCreateEstimationForm}
            setEstimationEditable={setEstimationEditable}
          />
        </div>
      ) : !createEstimationForm ? (
        <>
          <div id='users' className='estimations-form-wrapper'>
            <div className='users-wrapper'>
              <Grid container spacing={1}>
                <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                  <h1>Bookings</h1>
                </Grid>
                <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                  <div className='services-btns'>
                    <Button onClick={handleDownloadSheet} type='primary'>
                      Download
                    </Button>
                  </div>
                </Grid>
              </Grid>

              <div className='line_column' style={{ marginTop: 30 }}>
                <Grid container spacing={2}>
                  <Grid item xl={4} lg={4} md={3} sm={12} xs={12}>
                    <div>
                      <p>Search by Customer Name</p>
                      <Input
                        className='_search_input'
                        name='customerName'
                        value={searchValues.customerName}
                        onChange={handleSearch}
                        placeholder='Search By Service Title'
                      />
                    </div>
                  </Grid>
                  <Grid item xl={4} lg={4} md={3} sm={12} xs={12}>
                    <div>
                      <p>Search by Service Name</p>
                      <Input
                        className='_search_input'
                        name='serviceName'
                        value={searchValues.serviceName}
                        onChange={handleSearch}
                        placeholder='Search By Service Title'
                      />
                    </div>
                  </Grid>
                  <Grid item xl={4} lg={4} md={3} sm={12} xs={12}>
                    <div>
                      <p>Search by Total Amount</p>
                      <Input
                        className='_search_input'
                        name='totalPrice'
                        value={searchValues.totalPrice}
                        onChange={handleSearch}
                        placeholder='Search By Total Amount'
                      />
                    </div>
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xl={4} lg={4} md={3} sm={12} xs={12}>
                    <div>
                      <p>Search by Status</p>
                      <Select
                        placeholder='select status'
                        optionLabelProp='label'
                        className='_search_input'
                        value={searchValues.status}
                        onChange={(value) =>
                          handleSearch({
                            target: { name: 'status', value: value },
                          })
                        }
                      >
                        <Option value=''>All</Option>
                        <Option value='pending'>Pending</Option>
                        <Option value='submitted'>Submitted</Option>
                        <Option value='inProgress'>InProgress</Option>
                        <Option value='completed'>Completed</Option>
                        <Option value='cancelled'>Cancelled by Provider</Option>
                        <Option value='declined'>Declined by Customer</Option>
                      </Select>
                    </div>
                  </Grid>
                  <Grid item xl={4} lg={4} md={3} sm={12} xs={12}>
                    <div>
                      <p>Search by Date</p>
                      <RangePicker
                        className='_search_input'
                        onChange={(e, d) =>
                          handleSearch({ target: { name: 'date', value: d } })
                        }
                      />
                    </div>
                  </Grid>
                </Grid>
              </div>

              <div ref={componentRef}>
                <Table
                  scroll={{ x: true }}
                  loading={loading}
                  columns={columns}
                  dataSource={filterData}
                  pagination={true}
                  // defaultExpandAllRows={true}
                />
              </div>
            </div>
          </div>
          <ViewDetailsModal
            title='View Offer Details'
            isViewDetailsOpen={isOfferModalView}
            modalLoading={offerModalLoading}
            setIsViewDetails={setIsOfferModalView}
            data={selectedOfferData}
            acceptTitle={'Accept'}
            rejectTitle={'Declined'}
            accpetAction={
              selectedBooking?.estimation?.offerStatus == 'pending'
                ? acceptOffer
                : null
            }
            rejectAction={
              selectedBooking?.estimation?.offerStatus == 'pending'
                ? declineOffer
                : null
            }
          />
        </>
      ) : (
        <div id='users' className='estimations-form-wrapper'>
          <div className='users-wrapper'>
            <div className='header-text-container line_space'>
              <h1
                className='go-back-btn'
                onClick={() => {
                  setId(null);
                  getBookings();
                }}
              >
                Go back
              </h1>
              <div className='services-btns'>
                <Button onClick={downloadEstimationPdf} type='primary'>
                  Download PDF
                </Button>
              </div>
            </div>
            <h1>{settingsData?.invoiceTitle}</h1>
            <br />
            <div className='invoice_header'>
              <div className='img_box'>
                <img src={settingsData?.logoImage[0]} />
              </div>
              <div className='line_column'>
                <div className='line_space'>
                  <div className='input_box'>
                    <div className='title'>Customer Name</div>
                    <p className='details'>
                      {' '}
                      {`${selectedBooking?.customer?.firstName} ${selectedBooking?.customer?.lastName}`}{' '}
                    </p>
                  </div>
                  <div className='input_box'>
                    <div className='title'>Tax Number</div>
                    <p className='details'> {settingsData?.taxNumber} </p>
                  </div>
                </div>
                <div className='line_space'>
                  <div className='input_box'>
                    <div className='title'>Invoice Number</div>
                    <p className='details'> {`0${bookings?.length + 1}`} </p>
                  </div>
                  <div className='input_box'>
                    <div className='title'>Invoice Date</div>
                    <DatePicker
                      disabled
                      defaultValue={moment(selectedBooking?.date)}
                      className='_purchase_search_input1 invoice-date'
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className='search-btns-container'>
              <div className='ant-table-content'>
                <table ref={estimationRef}>
                  <thead className='ant-table-thead'>
                    <tr>
                      <th className='ant-table-cell'>Title</th>
                      <th className='ant-table-cell'>Description</th>
                      <th className='ant-table-cell'>Quantity</th>
                      <th className='ant-table-cell'>Price / Quantity</th>
                      <th className='ant-table-cell'>Tax (%)</th>
                      <th className='ant-table-cell'>Amount</th>
                      <th className='ant-table-cell' />
                    </tr>
                  </thead>
                  <tbody className='ant-table-tbody' id='table_id'>
                    {data?.map((estimation, index) => {
                      return (
                        <tr className='row_class'>
                          <td
                            scope='row'
                            id={index}
                            className='title-input-field'
                          >
                            <input
                              type='text'
                              value={estimation.title}
                              disabled={!estimationEditable}
                              placeholder='Please enter title'
                              className='txt-input cleanbtn'
                              onChange={(event) =>
                                handleChange(index, 'title', event.target.value)
                              }
                            />
                          </td>
                          <td className='description-input-field'>
                            <input
                              type='text'
                              value={estimation.description}
                              disabled={!estimationEditable}
                              placeholder='Please enter description'
                              className='txt-input cleanbtn'
                              onChange={(event) =>
                                handleChange(
                                  index,
                                  'description',
                                  event.target.value
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              type='number'
                              placeholder='Quantity'
                              value={estimation.quantity}
                              disabled={!estimationEditable || offerAccepted}
                              pattern='[0-9]*'
                              onChange={(event) =>
                                handleChange(
                                  index,
                                  'quantity',
                                  event.target.value,
                                  'amount',
                                  event.target.value * estimation.price +
                                    (event.target.value *
                                      estimation.price *
                                      estimation.tax) /
                                      100 ?? ''
                                )
                              }
                              className='txt-input cleanbtn'
                            />
                          </td>
                          <td>
                            <input
                              type='number'
                              placeholder='Price'
                              value={estimation.price}
                              disabled={!estimationEditable || offerAccepted}
                              onChange={(event) =>
                                handleChange(
                                  index,
                                  'price',
                                  event.target.value,
                                  'amount',
                                  estimation.quantity * event.target.value +
                                    (estimation.quantity *
                                      event.target.value *
                                      estimation.tax) /
                                      100 ?? ''
                                )
                              }
                              className='txt-input cleanbtn'
                            />
                          </td>
                          <td>
                            <input
                              type='number'
                              placeholder='Tax'
                              value={estimation.tax}
                              disabled={!estimationEditable}
                              onChange={(event) =>
                                handleChange(
                                  index,
                                  'tax',
                                  event.target.value,
                                  'amount',
                                  estimation.quantity * estimation.price +
                                    (estimation.quantity *
                                      estimation.price *
                                      event.target.value) /
                                      100 ?? ''
                                )
                              }
                              className='txt-input cleanbtn'
                            />
                          </td>
                          <td>
                            <input
                              type='number'
                              value={estimation.amount}
                              disabled={!estimationEditable}
                              placeholder='Final Amount'
                              className='txt-input cleanbtn'
                            />
                          </td>
                          <td>
                            <Button
                              type='primary'
                              className='save-submit'
                              htmlType='submit'
                              disabled={!estimationEditable}
                              onClick={() => {
                                const deepCopy = [...data];
                                deepCopy.splice(index, 1);
                                setData(deepCopy);
                              }}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className='ant-table-tbody'>
                    <tr>
                      <td colspan='7'>
                        <Button
                          type='primary'
                          className='save-submit'
                          disabled={!estimationEditable}
                          htmlType='submit'
                          onClick={() =>
                            setData((prev) => [
                              ...prev,
                              {
                                title: '',
                                description: '',
                                quantity: '',
                                price: '',
                                tax: 5,
                                amount: '',
                              },
                            ])
                          }
                        >
                          + Add Another Line
                        </Button>
                      </td>
                    </tr>
                  </tfoot>
                </table>

                <div className='wrapperSubtotal'>
                  <table className='margin-table'>
                    <tbody className='ant-table-tbody ant-table-tbody2'>
                      <tr>
                        <td>Sub Total</td>
                        <td className='second'>{getSubTotal()}</td>
                      </tr>
                      {offerAccepted && (
                        <>
                          <tr>
                            <td>Discount</td>
                            <td className='second'>
                              {getDiscount(getSubTotal())}
                            </td>
                          </tr>
                          <tr>
                            <td>Discounted Price</td>
                            <td className='second'>
                              {selectedBooking?.estimation?.offerAmount}
                            </td>
                          </tr>
                        </>
                      )}
                      {offerAccepted ? (
                        <>
                          <tr>
                            <td>VAT</td>
                            <td className='second'>
                              {Math.round(
                                (parseFloat(
                                  selectedBooking?.estimation?.offerAmount
                                ) *
                                  parseFloat(settingsData.taxPercentage)) /
                                  100
                              ).toFixed(2)}
                            </td>
                          </tr>
                          <tr>
                            <td>Total</td>
                            <td className='second'>
                              {Math.round(
                                parseFloat(
                                  selectedBooking?.estimation?.offerAmount
                                ) +
                                  (parseFloat(
                                    selectedBooking?.estimation?.offerAmount
                                  ) *
                                    parseFloat(settingsData.taxPercentage)) /
                                    100
                              )}
                            </td>
                          </tr>
                        </>
                      ) : (
                        <>
                          <tr>
                            <td>VAT</td>
                            <td className='second'>
                              {(
                                Math.round(
                                  (getFinalTotal() - getSubTotal()) * 100
                                ) / 100
                              ).toFixed(2)}
                            </td>
                          </tr>
                          <tr>
                            <td>Total</td>
                            <td className='second'>{getFinalTotal()}</td>
                          </tr>
                        </>
                      )}
                    </tbody>
                    {selectedBooking.status !== 'declined' && (
                      <tfoot>
                        <tr>
                          <td colspan='2' className='save-submit'>
                            {selectedBooking?.status != 'completed' && (
                              <Button
                                type='primary'
                                className='save-submit'
                                onClick={() =>
                                  estimationEditable
                                    ? handleSubmitForm()
                                    : setEstimationEditable(true)
                                }
                                htmlType='submit'
                              >
                                {!estimationEditable
                                  ? 'Edit'
                                  : selectedBooking.status === 'submitted' ||
                                    selectedBooking.status === 'reSubmitted'
                                  ? 'Save & Resubmit'
                                  : 'Save and Submit'}
                              </Button>
                            )}
                          </td>
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              </div>
              <div className='mb300'></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Jobs;
