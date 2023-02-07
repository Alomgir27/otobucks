import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import {
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Table,
  Tag,
  Button,
  Popconfirm,
  Select,
  Image,
  Popover,
} from 'antd';
import Grid from '@mui/material/Grid';
import { EyeFilled, DeleteFilled, DeleteOutlined } from '@ant-design/icons';
import { get, post, deleteService } from '../../services/RestService';
import {
  openNotification,
  options,
  downloadExcelFile,
  openErrorNotification,
} from '../../helpers';
import ViewDetailsModal from './ViewDetailsModal';
import DownloadExcel from '../../services/DownloadExcel';
import './styles.scss';

const { RangePicker } = DatePicker;
let { Option } = Select;

const Disputes = () => {
  const { state } = useLocation();
  let history = useHistory();

  const [data, setData] = useState([]);
  const [dataFilter, setFilterData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [singleDispute, setSingleDispute] = useState({});
  const [viewModal, setViewModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const [searchValues, setSearchValues] = useState({
    title: '',
    date: '',
    status: '',
  });

  const getData = () => {
    setLoading(true);
    get('/disputes ', options)
      .then((data) => {
        setData(data.result);
        setFilterData(data.result);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const getBookingDetails = async () => {
    setViewModal(true);
    setModalLoading(true);
    const Dispute = await data.find((dis) => dis._id == state?.id);
    if (Dispute) {
      setSingleDispute(Dispute);
      setModalLoading(false);
    } else {
      openNotification('Failed to get Dispute details');
      setViewModal(false);
      setModalLoading(false);
    }
  };

  const handleDownloadSheet = () => {
    const downloadData = dataFilter.map((item) => {
      return {
        Date: item?.createdAt,
        Title: item?.title,
        Description: item?.description,
        Admin_Status: item?.adminStatus,
        Dispute_Status: item?.disputeStatus,
      };
    });
    const jsonData = JSON.stringify(downloadData);
    DownloadExcel(jsonData, 'Dispute', 'Dispute');
  };

  const goToBooking = (id) => {
    history.push({ pathname: '/serviceBookings', state: { id } });
  };

  const deleteDispute = (id) => {
    setLoading(true);
    deleteService(`/disputes/${id}`)
      .then((data) => {
        setLoading(false);
        openNotification(data.message);
        getData();
      })
      .catch(() => {
        openErrorNotification('Dispute not deleted');
      });
  };

  const [disputeDetails, setDisputeDetails] = useState({});
  useEffect(() => {
    if (singleDispute) {
      setDisputeDetails({
        Date: singleDispute?.createdAt?.substring(0, 10),
        Country: singleDispute?.country?.toString(),
        Title: singleDispute?.title,
        Description: singleDispute?.description,
        'Admin Status': singleDispute?.adminStatus,
        'Dispute Status': singleDispute?.disputeStatus,
        'Booking ID': singleDispute?.booking,
        ...((singleDispute.disputeStatus == 'acknowledge' ||
          singleDispute.disputeStatus == 'resolved') && {
          'Admin Note': singleDispute?.adminRemarks,
        }),
      });
    }
  }, [singleDispute]);
  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {
    if (data.length >= 1) {
      if (state?.id) {
        getBookingDetails();
      }
    }
  }, [data]);

  const handleSearch = (event) => {
    let { name, value } = event.target;
    setSearchValues({
      title: '',
      date: '',
      status: '',
      [name]: value,
    });
  };
  useEffect(() => {
    setFilterData(
      data?.filter((provider) => {
        return (
          provider?.title?.toLocaleLowerCase()?.includes(searchValues.title) &&
          provider?.disputeStatus
            ?.toLocaleLowerCase()
            ?.includes(searchValues.status) &&
          (!searchValues?.date[0] ||
            (provider?.createdAt.substring(0, 10) >= searchValues.date[0] &&
              provider?.createdAt.substring(0, 10) <= searchValues.date[1]))
        );
      })
    );
  }, [searchValues, data]);

  const columns = [
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (_, data) => <p>{data && data?.createdAt?.substring(0, 10)}</p>,
    },
    {
      title: 'Image',
      dataIndex: 'disputeImage',
      key: 'disputeImage',
      render: (_, data) => (
        <Image
          style={{ width: 50, height: 50, objectFit: 'contain' }}
          src={data && data?.disputeImage?.Location}
        />
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (_, data) => <p>{data.title && data.title}</p>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (_, data) => (
        <p>
          {data?.description.length > 10
            ? data?.description.substring(0, 10) + '...'
            : data?.description}
        </p>
      ),
    },
    {
      title: 'Admin Status',
      dataIndex: 'status',
      key: 'status',
      render: (_, data) => (
        <Tag
          className='status_indicator'
          color={data?.adminStatus == 'unread' ? 'red' : 'green'}
        >
          {data?.adminStatus.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Dispute Status',
      dataIndex: 'disputeStatus',
      key: 'disputeStatus',
      render: (_, data) => (
        <Popover
          content={
            data?.disputeStatus == 'resolved' ||
            data?.disputeStatus == 'acknowledge' ||
            data?.disputeStatus == 'terminated'
              ? 'View Dispute Details to See Admin Note'
              : null
          }
        >
          {' '}
          <Tag
            className='status_indicator'
            color={
              data?.disputeStatus == 'pending'
                ? 'yellow'
                : data?.disputeStatus == 'terminated'
                ? 'red'
                : 'green'
            }
          >
            {data?.disputeStatus.toUpperCase()}
          </Tag>
        </Popover>
      ),
    },
    {
      title: 'Actions',
      dataIndex: 'action',
      key: 'action',
      render: (_, data) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Popover content={<> View Dispute </>}>
            <EyeFilled
              className='action-icon-view-delete'
              onClick={() => {
                setSingleDispute(data);
                setViewModal(true);
              }}
            />
          </Popover>
          {data.disputeStatus == 'completed' ||
          data.disputeStatus == 'resolved' ? (
            <Popover content={<> Delete Dispute </>}>
              <DeleteFilled
                className='action-icon-view-delete'
                onClick={() => {
                  deleteDispute(data._id);
                }}
              />
            </Popover>
          ) : (
            <Popover content={<> Only completed disputes can be deleted </>}>
              <DeleteFilled
               className='action-icon-view-delete' />
            </Popover>
          )}
          <div
            className='action_box'
            onClick={() => goToBooking(data?.booking)}
          >
            {' '}
            View Booking{' '}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div id='users' className='disputes-container'>
      <div className='users-wrapper'>
        <Grid container spacing={2}>
          <Grid item xl={9} lg={9} md={5} sm={12} xs={12}>
            <h1>Disputes</h1>
          </Grid>
          <Grid item xl={2} lg={2} md={4} sm={12} xs={12}>
            <div className='download-btn-wrapper'>
              <Button onClick={handleDownloadSheet} type='primary'>
                Download
              </Button>
            </div>
          </Grid>
          {/* <Grid item xl={1} lg={1} md={3} sm={12} xs={12}>
            <div className="download-btn-wrapper">
              <Button
                onClick={() => {
                  setBookingTypeOpen(true);
                }}
                className="create-btn"
                type="primary"
              >
                Create
              </Button>
            </div>
          </Grid> */}
        </Grid>

        <div className='search-btns-container'>
          <Grid container spacing={2}>
            <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
              <div>
                <p>Search By Title</p>
                <Input
                  name='title'
                  value={searchValues.title}
                  onChange={handleSearch}
                  className='_invite_friends_input'
                  placeholder='Search By Title'
                />
              </div>
            </Grid>
            <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
              <div>
                <h3>Search By Status</h3>
                <Select
                  style={{ width: '100%' }}
                  value={searchValues.status}
                  onChange={(value) =>
                    handleSearch({ target: { name: 'status', value: value } })
                  }
                >
                  <Option value=''>All</Option>
                  <Option value='pending'>Pending</Option>
                  <Option value='acknowledge'>Acknowledge</Option>
                  <Option value='completed'>Completed</Option>
                </Select>
              </div>
            </Grid>
            <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
              <div>
                <p>Search by Date</p>
                <RangePicker
                  className='_invite_friends_input'
                  onChange={(e, d) =>
                    handleSearch({ target: { name: 'date', value: d } })
                  }
                />
              </div>
            </Grid>
          </Grid>
        </div>

        <div className='table-container'>
          <Table
            scroll={{ x: true }}
            loading={loading}
            columns={columns}
            dataSource={dataFilter}
          />
        </div>
      </div>

      <ViewDetailsModal
        title='View Dispute Details'
        profileImage={singleDispute && singleDispute?.disputeImage?.Location}
        isViewDetailsOpen={viewModal}
        modalLoading={modalLoading}
        setIsViewDetails={setViewModal}
        data={disputeDetails}
      />
    </div>
  );
};

export default Disputes;
