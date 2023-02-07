import React, { useEffect, useState } from 'react';
import {
  Col,
  DatePicker,
  Input,
  Modal,
  Row,
  Table,
  Button,
  Tag,
  Select,
} from 'antd';
import { EyeFilled } from '@ant-design/icons';
import Grid from '@mui/material/Grid';
import { get } from '../../services/RestService';
import { options } from '../../helpers';
import DownloadExcel from '../../services/DownloadExcel';

const { RangePicker } = DatePicker;
const { Option } = Select;

const TransactionHistory = () => {
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewModal, setViewModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState();

  const [searchValues, setSearchValues] = useState({
    serviceName: '',
    customerName: '',
    totalPrice: '',
    type: '',
    status: '',
    date: '',
  });

  const handleDownloadSheet = () => {
    const downloadData = data.map((item) => {
      return {
        Date: item?.createdAt,
        Title: item?.serviceTitle,
        Recipient: `${item?.metadata?.user?.firstName} ${item?.metadata?.user?.lastName}`,
        TransactionType: item?.itemType,
        Amount: item?.amount,
        Currency: item?.currency,
        Status: item?.transactionStatus,
      };
    });
    const jsonData = JSON.stringify(downloadData);
    DownloadExcel(jsonData, 'Transaction', 'Transaction');
  };

  const getData = () => {
    setLoading(true);
    get('/transactions', options)
      .then((data) => {
        setData(data.result.reverse());
        setFilterData(data.result.reverse());
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const handleSearch = (event) => {
    let { name, value } = event.target;
    setSearchValues({
      serviceName: '',
      customerName: '',
      totalPrice: '',
      type: '',
      status: '',
      date: '',
      [name]: value,
    });
  };
  useEffect(() => {
    setFilterData(
      data?.filter((provider) => {
        return (
          provider?.serviceTitle
            ?.toLocaleLowerCase()
            ?.includes(searchValues.serviceName) &&
          `${provider?.metadata?.user?.firstName} ${provider?.metadata?.user?.lastName}`
            .toLocaleLowerCase()
            .includes(searchValues.customerName) &&
          `${provider?.amount}`
            ?.toLocaleLowerCase()
            ?.includes(searchValues.totalPrice) &&
          provider?.itemType
            ?.toLocaleLowerCase()
            ?.includes(searchValues.type) &&
          provider?.transactionStatus
            ?.toLocaleLowerCase()
            ?.includes(searchValues.status) &&
          (!searchValues?.date[0] ||
            (provider?.createdAt.substring(0, 10) >= searchValues.date[0] &&
              provider?.createdAt.substring(0, 10) <= searchValues.date[1]))
        );
      })
    );
  }, [searchValues, data]);

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'Date',
      render: (_, data) => <p>{data.createdAt.substring(0, 10)}</p>,
    },
    {
      title: 'Title',
      dataIndex: 'type',
      key: 'type',
      render: (_, data) => <p>{data?.serviceTitle}</p>,
    },
    {
      title: 'Recipient Name',
      dataIndex: 'type',
      key: 'type',
      render: (_, data) => (
        <p>{`${data?.metadata?.user?.firstName} ${data?.metadata?.user?.lastName}`}</p>
      ),
    },
    {
      title: 'Transaction  Type',
      dataIndex: 'type',
      key: 'type',
      render: (_, data) => <p>{data?.itemType}</p>,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (_, data) => <p>{data?.amount}</p>,
    },
    {
      title: 'Currency',
      dataIndex: 'amount',
      key: 'amount',
      render: (_, data) => <p>{data?.currency}</p>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (_, data) => (
        <Tag
          className='status_indicator'
          color={
            data?.transactionStatus == 'paid'
              ? 'blue'
              : data?.transactionStatus == 'received'
              ? 'green'
              : 'yellow'
          }
        >
          {data?.transactionStatus}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      dataIndex: 'action',
      key: 'action',
      render: (_, filterData) => (
        <div className='action-icons'>
          <EyeFilled
            onClick={() => {
              setViewModal(true);
              setSelectedTransaction(filterData);
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div id='users' style={{ padding: 30 }}>
      <div className='users-wrapper'>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h1>Transaction History</h1>
          <div>
            <Button type='primary' onClick={handleDownloadSheet}>
              Download
            </Button>
          </div>
        </div>

        <div style={{ marginTop: 30 }} className='line_column'>
          <Grid container spacing={2}>
            <Grid item xl={4} lg={4} md={3} sm={12} xs={12}>
              <div>
                <p>Search by Title</p>
                <Input
                  className='_invite_friends_input'
                  value={searchValues.serviceName}
                  name='serviceName'
                  onChange={handleSearch}
                  placeholder='Title'
                />
              </div>
            </Grid>
            <Grid item xl={4} lg={4} md={3} sm={12} xs={12}>
              <div>
                <p>Search by Recipient Name</p>
                <Input
                  className='_invite_friends_input'
                  value={searchValues.customerName}
                  name='customerName'
                  onChange={handleSearch}
                  placeholder='Name'
                />
              </div>
            </Grid>
            <Grid item xl={4} lg={4} md={3} sm={12} xs={12}>
              <div>
                <p>Search by Amount</p>
                <Input
                  className='_invite_friends_input'
                  value={searchValues.totalPrice}
                  name='totalPrice'
                  onChange={handleSearch}
                  placeholder='Search By Amount'
                />
              </div>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xl={4} lg={4} md={3} sm={12} xs={12}>
              <div>
                <p>Search by Type</p>
                <Select
                  placeholder='select status'
                  optionLabelProp='label'
                  className='_search_input'
                  value={searchValues.type}
                  onChange={(value) =>
                    handleSearch({ target: { name: 'type', value: value } })
                  }
                >
                  <Option value=''>All</Option>
                  <Option value='booking'>Bookings</Option>
                  <Option value='promotion'>Promotions</Option>
                </Select>
              </div>
            </Grid>
            <Grid item xl={4} lg={4} md={3} sm={12} xs={12}>
              <div>
                <p>Search by Status</p>
                <Select
                  placeholder='select status'
                  optionLabelProp='label'
                  className='_search_input'
                  value={searchValues.status}
                  onChange={(value) =>
                    handleSearch({ target: { name: 'status', value: value } })
                  }
                >
                  <Option value=''>All</Option>
                  <Option value='paid'>Paid Transactions</Option>
                  <Option value='received'>Received Transactions</Option>
                </Select>
              </div>
            </Grid>
            <Grid item xl={4} lg={4} md={3} sm={12} xs={12}>
              <div>
                <p>Search by Date</p>
                <RangePicker
                  className='_invite_friends_input'
                  style={{ width: '100%' }}
                  onChange={(e, d) =>
                    handleSearch({ target: { name: 'date', value: d } })
                  }
                />
              </div>
            </Grid>
          </Grid>
        </div>

        <div style={{ marginTop: 30 }}>
          <Table
            scroll={{ x: true }}
            loading={loading}
            columns={columns}
            dataSource={filterData}
          />
        </div>
      </div>
      <Modal
        footer={false}
        title='View Transaction Details'
        okText='Done'
        visible={viewModal}
        onCancel={() => setViewModal(false)}
        onOk={() => {
          setViewModal(false);
        }}
      >
        <div>
          <Row gutter={[10, 10]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <b>
                <p>Customer Name</p>
              </b>
              <p>
                {selectedTransaction?.metadata?.user?.firstName}{' '}
                {selectedTransaction?.metadata?.user?.lastName}
              </p>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <b>
                <p>Type</p>
              </b>
              <p>{selectedTransaction?.metadata?.type}</p>
            </Col>
          </Row>
          <Row gutter={[10, 10]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <b>
                <p>Customer Country</p>
              </b>
              <p>{selectedTransaction?.metadata?.user?.country}</p>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <b>
                <p>Customer Email</p>
              </b>
              <p>{selectedTransaction?.metadata?.user?.email}</p>
            </Col>
          </Row>
          <Row gutter={[10, 10]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <b>
                <p>Date</p>
              </b>
              <p>{selectedTransaction?.createdAt?.substring(0, 10)}</p>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <b>
                <p>Amount</p>
              </b>
              <p>{`${selectedTransaction?.amount} ${selectedTransaction?.currency}`}</p>
            </Col>
          </Row>
          <Row gutter={[10, 10]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <b>
                <p>Item Type</p>
              </b>
              <p>{selectedTransaction?.itemType}</p>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <b>
                <p>Source</p>
              </b>
              <p>{selectedTransaction?.source}</p>
            </Col>
          </Row>
        </div>
      </Modal>
    </div>
  );
};

export default TransactionHistory;
