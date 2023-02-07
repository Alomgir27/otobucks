import { DeleteOutlined } from '@ant-design/icons';
import { Button, Col, Row, Table, Spin } from 'antd';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import AddUserForm from '../../Components/Staff/AddUserForm';
import UpdateUserForm from '../../Components/Staff/UpdateUserForm';
import { options } from '../../helpers';
import DownloadExcel from '../../services/DownloadExcel';
import { deleteService, get } from '../../services/RestService';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
import { useHistory } from 'react-router';



import './styles.scss';

const Staff = () => {
  const history = useHistory();


  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [data, setData] = useState([]);


  const columns = [
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      ellipsis: true,
      render: (_, doc) => (
        <p>{doc && doc?.createdAt.substring(0, 10)}</p>
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (_, doc) => (
        <p> {doc?.firstName ? doc?.firstName + ' ' + doc?.lastName : ''}</p>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (_, doc) => <p>{doc?.email}</p>,
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (_, doc) => <p>{doc?.phone}</p>,
    },
    {
      title: 'Actions',
      dataIndex: 'action',
      key: 'action',
      render: (_, doc) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <EditFilled
            onClick={() => {
              history.push(`/staff/edit/${doc._id}`)
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
              deleteStaff(doc._id)
            }}
            style={{ color: 'grey', cursor: 'pointer', fontSize: 25, marginRight: 10 }}
          />
        </div>
      ),
    },
  ];

  const fetchData = async () => {
    setLoading(true);
    get('/auth/providers/staff', options)
      .then((response) => {
        // const mappedData = response.result.map((item, index) => {
        //   return {
        //     key: index + 1,
        //     firstName: item.firstName,
        //     lastName: item.lastName,
        //     email: item.email,
        //     phone: item.phone,
        //     action: (
        //       <DeleteOutlined
        //         onClick={() => {
        //           deleteStaff(item._id);
        //         }}
        //       />
        //     ),
        //   };
        // });
        setData(response.result);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };
  const deleteStaff = async (id) => {
    setLoading(true);

    deleteService(`/auth/providers/staff/${id}`)
      .then(() => {
        fetchData();
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDownloadSheet = () => {
    const downloadData = data.map((item) => {
      return {
        firstName: item?.firstName,
        lastName: item?.lastName,
        email: item?.email,
        phone: item?.phone,
      };
    });
    const jsonData = JSON.stringify(downloadData);
    DownloadExcel(jsonData, 'Staff', 'Staff');
  };

  return (
    <>
      <Spin spinning={loading}>
        <AddUserForm
          visible={showModal}
          setShowModal={setShowModal}
          fetchData={fetchData}
          setLoading={setLoading}
        />
        <UpdateUserForm
          visible={showUpdateModal}
          setShowModal={setShowUpdateModal}
          fetchData={fetchData}
          setLoading={setUpdateLoading}
        />
        <div id='users' style={{ padding: 30 }}>
          <div className='container-fluid'>
            <div className='users-wrapper'>
              <div className='heading_container'>
                <div>
                  <div>
                    <h1>Staff</h1>
                  </div>
                </div>
                <div className='btn_box'>
                  <div className='services-btns'>
                    <Button type='primary' onClick={handleDownloadSheet}>
                      Download
                    </Button>
                  </div>
                  <div className='services-btns'>
                    <Button
                      type='primary'
                      onClick={() => {
                        setShowModal(true);
                      }}
                    >
                      Create User
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <Table 
             columns={columns}
             dataSource={data} 
             scroll={{ x: true }}
             pagination={false}
             defaultExpandAllRows={true}
             />
          </div>
        </div>
      </Spin>
    </>
  );
};

export default Staff;
