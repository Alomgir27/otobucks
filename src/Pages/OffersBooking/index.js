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
  Tooltip,
  Popover,
} from 'antd';
import { DeleteFilled, EditFilled, EyeFilled } from '@ant-design/icons';
import { AddIcon, VisaCardIcon } from './../../Icons';
import { deleteService, get, patch, post } from '../../services/RestService';
import {
  downloadExcelFile,
  openErrorNotification,
  openNotification,
  options,
} from '../../helpers';
import DownloadExcel from '../../services/DownloadExcel';
import Dialog from '@mui/material/Dialog';
import Grid from '@mui/material/Grid';

import ViewDetailsModal from './ViewDetailsModal';

const { Option } = Select;
const { RangePicker } = DatePicker;

const Offers = () => {
  const history = useHistory();
  let Location = useLocation();
  let id = Location.state?.id;

  const currency = useSelector((state) => state?.profile?.user?.currency);

  const [data, setData] = useState([]);
  const [dataFilter, setDataFilter] = useState([]);
  const [loading, setLoading] = useState(true);
  const [singleBooking, setSingleBooking] = useState({});
  const [singleBookingDetails, setSingleBookingDetails] = useState({});
  const [viewModal, setViewModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const getData = () => {
    setLoading(true);
    get('/promotions/myPromotions/bookings', options)
      .then((data) => {
        setData(data.result);
        setDataFilter(data.result);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const completeOrder = async (id) => {
    setLoading(true);
    patch('/promotions/myPromotions/bookings', { promotionID: id }, options)
      .then((data) => {
        getData();
      })
      .catch((err) => {
        setLoading(false);
        openErrorNotification(err.message);
      });
  };

  const handleDownloadSheet = () => {
    const downloadData = dataFilter.map((item) => {
      return {
        Date: item?.createdAt,
        Title: item?.promotion?.title,
        Description: item?.promotion?.description,
        Customer: `${item?.customer?.firstName} ${item?.customer?.lastName}`,
        Booking_Date: item?.bookingDetails?.date,
        Booking_Time: item?.bookingDetails?.time,
        Total_Price: item?.totalprice,
        Payment_Method: item?.paymentMethod,
        status: item?.status,
        Dispute_Status: item?.disputeStatus,
      };
    });
    const jsonData = JSON.stringify(downloadData);
    DownloadExcel(jsonData, 'PromotionBooking', 'PromotionBooking');
  };

  useEffect(() => {
    if (singleBooking) {
      setSingleBookingDetails({
        Date: singleBooking?.createdAt?.substring(0, 10),
        Address: singleBooking?.address,
        Title: singleBooking?.promotion?.title,
        Description: singleBooking?.promotion?.description,
        'Previous Price': singleBooking?.promotion?.previousPrice,
        Discount: singleBooking?.promotion?.discount + ' %',
        'price After Discount': singleBooking?.promotion?.priceAfterDiscount,
        'Customer Name': `${singleBooking?.customer?.firstName} ${singleBooking?.customer?.lastName}`,
        'Customer Email': singleBooking?.customer?.email,
        'Booking Address': singleBooking?.bookingDetails?.address,
        'Booking Date': singleBooking?.bookingDetails?.date,
        'Booking Time': singleBooking?.bookingDetails?.time,
        'Booking Note': singleBooking?.bookingDetails?.note,
        'Payment Status': singleBooking?.paymentStatus,
      });
    }
  }, [singleBooking]);

  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {
    if (data && data.length >= 1) {
      if (id) {
        history.push(`offerform?type=view&id=${id}`);
      }
    }
  }, [data, id]);

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
          src={data && data?.promotion?.promoImg[0]}
        />
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      render: (_, data) => <p>{data && data?.promotion?.title}</p>,
    },
    {
      title: 'Description',
      dataIndex: 'discount',
      key: 'discount',
      ellipsis: true,
      render: (_, data) => <p>{data?.promotion?.description}</p>,
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
      ellipsis: true,
      render: (_, data) => (
        <p>{`${data?.customer?.firstName} ${data?.customer?.lastName}`}</p>
      ),
    },
    // {
    //   title: "Booking Address",
    //   dataIndex: "booking_address",
    //   key: "booking_address",
    //   ellipsis: true,
    //   render: (_, data) => (
    //     <Tooltip placement="topLeft" title={data?.bookingDetails?.address}>
    //       {data?.bookingDetails?.address}
    //     </Tooltip>
    //   ),
    // },
    {
      title: 'Booking Date',
      dataIndex: 'booking_date',
      key: 'booking_date',
      ellipsis: true,
      render: (_, data) => <p>{data?.bookingDetails?.date}</p>,
    },
    {
      title: 'Booking Time',
      dataIndex: 'booking_time',
      key: 'booking_time',
      ellipsis: true,
      render: (_, data) => <p>{data?.bookingDetails?.time}</p>,
    },
    // {
    //   title: "Booking Note",
    //   dataIndex: "booking_note",
    //   key: "booking_note",
    //   ellipsis: true,
    //   render: (_, data) => <p>{data?.bookingDetails?.note}</p>,
    // },
    {
      title: 'Total Price',
      dataIndex: 'totalprice',
      key: 'totalprice',
      ellipsis: true,
      render: (_, data) => <p>{data?.totalprice + ' AED'}</p>,
    },
    {
      title: 'Payment Method',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      ellipsis: true,
      render: (_, data) => <p>{data?.paymentMethod}</p>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      ellipsis: true,
      render: (_, data) => (
        <Tag
          className='status_indicator'
          color={data?.status == 'booked' ? 'blue' : 'green'}
        >
          {data?.status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      dataIndex: 'action',
      key: 'action',
      render: (_, data) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Popover content={<> View Bookings </>}>
            <EyeFilled
              className='action-icon-view-delete'
              onClick={() => {
                setSingleBooking(data);
                setViewModal(true);
              }}
            />
          </Popover>
          {data.status == 'completed' ? (
            <div className='action_box no_drop'>Completed</div>
          ) : (
            <div className='action_box' onClick={() => completeOrder(data._id)}>
              Complete
            </div>
          )}
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
        <div className='line_space'>
          <h1>Promotions Bookings</h1>
          <Button className='w120' onClick={handleDownloadSheet} type='primary'>
            Download
          </Button>
        </div>

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
      </div>
      <ViewDetailsModal
        title='View Promotion Booking Details'
        profileImage={singleBooking && singleBooking?.promotion?.promoImg[0]}
        isViewDetailsOpen={viewModal}
        modalLoading={modalLoading}
        setIsViewDetails={setViewModal}
        data={singleBookingDetails}
      />
    </div>
  );
};

export default Offers;
