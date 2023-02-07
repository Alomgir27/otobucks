import { Col, Image, Input, Modal, Row, Table } from 'antd';
import { DeleteFilled, EditFilled, EyeFilled } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { deleteService, get, post } from '../../services/RestService';
import { downloadExcelFile, openNotification, options, openErrorNotification} from '../../helpers';

import { Button } from 'antd';
import FormModal from './FormModal';

const Promotions = () => {
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchData =
    (data && data.filter((sd) => sd?.subject?.toString().includes(search))) ||
    [];
  const [viewModal, setViewModal] = useState(false);
  const [modalData, setModalData] = useState({});
  const [method, setMethod] = useState();

  const getData = () => {
    setLoading(true);
    get('/bulkEmails', options)
      .then((data) => {
        setData(data.result);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const deleteUser = (id) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('promotionId', id);
    deleteService(`/bulkEmails/${id}`, formData, options)
      .then((data) => {
        if (data.status) {
          openNotification('Deleted Successfully');
          getData();
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const sendPromotion = (id) => {
    const t = localStorage.getItem('token');
    const token = `Bearer ${t}`;
    var options = {
      headers: {
        Authorization: token,
      },
    };

    const formData = new FormData();
    formData.append('promotionId', id);
    post(`/bulkEmails/send/${id}`, formData, options)
      .then((res) => {
        if (res.status) {
          openNotification(res.message);
        } else {
          openNotification(res.message);
        }
      })
      .catch((err) => {
        console.log(err);
        openErrorNotification(err.message);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
      title: 'Image',
      dataIndex: 'promoImg',
      key: 'promoing',
      render: (_, data) => (
        <Image
          style={{ width: 50, height: 50, objectFit: 'contain' }}
          src={data && data.promoImg}
        />
      ),
    },
    {
      title: 'Created_At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (_, data) => <p>{data && data?.createdAt.substring(0, 10)}</p>,
    },
    {
      title: 'Target',
      dataIndex: 'target',
      key: 'target',
      render: (_, data) => <p>{data.target && data.target}</p>,
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
      render: (_, data) => <p>{data.country && data.country}</p>,
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      render: (_, data) => <p>{data.subject}</p>,
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
      render: (_, data) => <p>{data.message}</p>,
    },
    {
      title: 'Send_Email',
      dataIndex: 'activeStatus',
      key: 'activeStatus',
      render: (_, data) => (
        <Button onClick={() => sendPromotion(data._id)} type='primary'>
          Send
        </Button>
      ),
    },
    {
      title: 'Actions',
      dataIndex: 'action',
      key: 'action',
      render: (_, data) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <EyeFilled
            onClick={() => {
              setModalData(data);
              setMethod('view');
              setViewModal(true);
            }}
            style={{
              color: 'grey',
              cursor: 'pointer',
              fontSize: 25,
              marginRight: 10,
            }}
          />
          <EditFilled
            onClick={() => {
              setModalData(data);
              setMethod('edit');
              setViewModal(true);
            }}
            style={{
              color: 'grey',
              cursor: 'pointer',
              fontSize: 25,
              marginRight: 10,
            }}
          />
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
          <h1>Bulk Email</h1>
          <div>
            <Button onClick={() => downloadExcelFile(data)} type='primary'>
              Download
            </Button>
            <Button
              onClick={() => {
                setMethod('create');
                setViewModal(true);
              }}
              style={{ marginLeft: 30 }}
              type='primary'
            >
              Create
            </Button>
          </div>
        </div>

        <div style={{ marginTop: 30 }}>
          <Row gutter={[10, 10]}>
            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
              <div>
                <p>Search by Title</p>
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder='Search By Title'
                />
              </div>
            </Col>
          </Row>
        </div>

        <div style={{ marginTop: 30 }}>
          <Table
            scroll={{ x: true }}
            loading={loading}
            columns={columns}
            dataSource={searchData.reverse()}
          />
        </div>
      </div>
      <Modal
        destroyOnClose
        footer={false}
        title='Bulk Email'
        okText='Done'
        visible={viewModal}
        onCancel={() => setViewModal(false)}
        onOk={() => {
          setViewModal(false);
        }}
      >
        <FormModal
          closeModal={() => setViewModal(false)}
          getTableData={getData}
          data={modalData}
          method={method}
        />
      </Modal>
    </div>
  );
};

export default Promotions;
