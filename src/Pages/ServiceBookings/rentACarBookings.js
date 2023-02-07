import { Table, Spin } from 'antd';
import { useState, useEffect } from 'react';
import { openErrorNotification } from '../../helpers';
import { get } from '../../services/RestService';

const RentACarBookings = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  useEffect(() => {
    const fetchData = async () => {
      get('/bookings/bookService', options)
        .then((res) => {
          console.log(res);
          setData(res.result);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          err?.message && openErrorNotification(err.message);
        });
    };
    fetchData();
  }, []);

  const columns = [
    {
      title: 'Customer Name',
      dataIndex: 'customerFirstName',
      key: 'customerFirstName',
      render: (text, record) =>
        `${record.customerFirstName} ${record.customerLastName}`,
    },
    {
      title: 'Vehicle',
      dataIndex: 'vehicle',
      key: 'vehicle',
    },
    {
      title: 'Date From',
      dataIndex: 'dateFrom',
      key: 'dateFrom',
    },
    {
      title: 'Date To',
      dataIndex: 'dateTo',
      key: 'dateTo',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Paid',
      dataIndex: 'paid',
      key: 'paid',
    },
    {
      title: 'Pickup Location',
      dataIndex: 'pickupLocation',
      key: 'pickupLocation',
    },
    {
      title: 'Dropoff Location',
      dataIndex: 'dropOffLocation',
      key: 'dropOffLocation',
    },
    {
      title: 'Note',
      dataIndex: 'note',
      key: 'note',
    },
  ];

  return (
    <>
      {loading ? (
        <Spin size='large' />
      ) : (
        <Table dataSource={data} columns={columns} />
      )}
    </>
  );
};

export default RentACarBookings;
