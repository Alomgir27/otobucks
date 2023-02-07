import './styles.scss';

import {
  Button,
  DatePicker,
  Image,
  Input,
  Switch,
  Table,
  Tag,
  Popover,
  Modal,
} from 'antd';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
import React, { useEffect, useRef, useState } from 'react';
import { deleteService, get, patch, post } from '../../services/RestService';
import { openNotification, options, openErrorNotification} from '../../helpers';

import Grid from '@mui/material/Grid';
import UploadFile from '../../Components/UploadExcelFile';
import sampleFile from '../../assets/sample-csv-services.xlsx';
import { useHistory } from 'react-router';
import { useReactToPrint } from 'react-to-print';
import DownloadExcel from '../../services/DownloadExcel';

const { RangePicker } = DatePicker;

const Services = () => {
  const componentRef = useRef();

  const [dataFilter, setDataFilter] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModel, setOpenModel] = useState(false);
  const history = useHistory();
  const [filters, setFilters] = useState({
    name: '',
    price: '',
    date: ['', ''],
  });

  const showModal = () => {
    setOpenModel(!openModel);
  };
  const userData = JSON.parse(localStorage.getItem('user'));

  const getData = () => {
    setLoading(true);
    const t = localStorage.getItem('token');
    const token = `Bearer ${t}`;
    var options = {
      headers: {
        Authorization: token,
      },
    };
    get('/services/myServices', options)
      .then((data) => {
        setData(data.result.reverse());
        setDataFilter(data.result.reverse());
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const filterByName = filters.name
      ? data.filter((sd) => {
          return sd.title.toString().toLowerCase().includes(filters.name);
        })
      : data;
    const filterByPrice = filters.price
      ? filterByName.filter((sd) => {
          return sd.price === parseInt(filters.price);
        })
      : filterByName;
    const filteredData = filters.date[0]
      ? filterByPrice.filter((sd) => {
          return (
            sd?.createdAt.substring(0, 10) >= filters.date[0] &&
            sd?.createdAt.substring(0, 10) <= filters.date[1]
          );
        })
      : filterByPrice;
    setDataFilter(filteredData);
  }, [filters]);

  const applyFilters = (key, value) => {
    setFilters((prev) => {
      return {
        ...prev,
        [key]: value,
      };
    });
  };

  const handleDownloadSheet = () => {
    const downloadData = dataFilter.map((item) => {
      return {
        Date: item?.createdAt,
        Image: item?.image[0],
        Title: item?.title,
        Price: item?.price,
        Currency: item?.currency,
        Description: item?.description,
        Status: item?.active,
        AdminApproval:
          item?.activeByAdmin == 'Pending'
            ? 'Waiting for Admin approval'
            : item?.activeByAdmin == 'Active'
            ? 'Approved by Admin'
            : 'Rejected by Admin, contact support to know more',
      };
    });
    const jsonData = JSON.stringify(downloadData);
    DownloadExcel(jsonData, 'Services', 'Services');
  };

  const updateStatus = (id, checked) => {
    setLoading(true);

    const data = {
      id: id,
    };
    patch(
      checked ? `/services/activate/${id}` : `/services/activate/${id}`,
      data,
      options
    )
      .then(() => {
        openNotification('Status Changed Successfully');
        getData();
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const deleteUser = (id) => {
    setLoading(true);
    const data = {
      id: id,
    };
    deleteService(`/services/${id}`, data, options)
      .then(() => {
        openNotification('Service Deleted Successfully');
        getData();
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const downloadPdf = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      ellipsis: true,
      render: (_, dataFilter) => (
        <p>{dataFilter && dataFilter?.createdAt.substring(0, 10)}</p>
      ),
    },
    {
      title: 'Image',
      dataIndex: 'imagePath',
      key: 'imagePath',
      render: (_, dataFilter) => (
        <>
          <Image
            style={{
              width: 50,
              height: 50,
              objectFit: 'contain',
              backgroundPosition: '19px 85px',
            }}
            src={dataFilter?.image[0]}
          />
        </>
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (_, dataFilter) => (
        <p> {dataFilter?.title ? dataFilter?.title : '-'}</p>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'Price',
      key: 'Price',
      render: (_, dataFilter) => <p>{dataFilter?.price}</p>,
    },
    {
      title: 'currency',
      dataIndex: 'currency',
      key: 'currency',
      render: (_, dataFilter) => <p>{dataFilter?.currency}</p>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (_, dataFilter) => (
        <p>
          {dataFilter?.description.length > 10
            ? dataFilter?.description.substring(0, 10) + '...'
            : dataFilter?.description}
        </p>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'active',
      key: 'active',
      render: (_, dataFilter) => (
        <Switch
          checked={dataFilter.active}
          onChange={(e) => updateStatus(dataFilter._id, e)}
        />
      ),
    },
    {
      title: 'Admin Approved',
      dataIndex: 'activeByAdmin',
      key: 'activeByAdmin',
      render: (_, dataFilter) => (
        <Popover
          content={
            dataFilter?.activeByAdmin == 'Pending'
              ? 'Waiting for Admin approval'
              : dataFilter?.activeByAdmin == 'Active'
              ? 'Approved by Admin'
              : 'Rejected by Admin, contact support to know more'
          }
        >
          {' '}
          <Tag
            className='status_indicator'
            color={
              dataFilter.activeByAdmin == 'Pending'
                ? 'yellow'
                : dataFilter.activeByAdmin == 'Active'
                ? 'green'
                : 'red'
            }
          >
            {dataFilter.activeByAdmin}
          </Tag>
        </Popover>
      ),
    },
    {
      title: 'Actions',
      dataIndex: 'action',
      key: 'action',
      render: (_, dataFilter) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <EditFilled
            onClick={() => {
              history.push(`/service-form?type=edit&id=${dataFilter._id}`, {
                category: dataFilter?.category,
              });
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
              deleteUser(dataFilter._id);
            }}
            style={{ color: 'grey', cursor: 'pointer', fontSize: 25 }}
          />
        </div>
      ),
    },
  ];

  const uploadFile = (e) => {
    setLoading(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    post('/services/upload', formData, options)
      .then((res) => {
        setTimeout(() => {
          openNotification(res.message);
          getData();
        }, 4000);
      })
      .catch((err) => {
        openErrorNotification(err.message);
        setLoading(false);
      });
  };

  return (
    <>
      <div id='users' style={{ padding: 30 }}>
        <div className='users-wrapper'>
          <div className='heading_container'>
            <div>
              <div>
                <h1>Services</h1>
              </div>
            </div>
            <div className='btn_box'>
              <div className='services-btns'>
                <Button onClick={handleDownloadSheet} type='primary'>
                  Download
                </Button>
              </div>
              <div className='services-btns'>
                <Button
                  onClick={() => {
                    history.push(
                      '/service-form?type=create',
                      userData?.user?.provider?.categories[0]?.slug
                    );
                  }}
                  type='primary'
                >
                  Create Services
                </Button>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 30 }}>
            <Grid container spacing={2}>
              <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                <div>
                  <p>Search By Title</p>
                  <Input
                    className='_services_search_input'
                    onChange={(e) => {
                      applyFilters('name', e.target.value.toLowerCase());
                    }}
                    placeholder='Search By Title'
                  />
                </div>
              </Grid>
              <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                <div>
                  <p>Search By Price</p>
                  <Input
                    className='_services_search_input'
                    onChange={(e) => {
                      applyFilters('price', e.target.value);
                    }}
                    placeholder='Search By Price'
                  />
                </div>
              </Grid>
              <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                <p>Search by Date</p>
                <RangePicker
                  style={{ width: '100%' }}
                  className='_services_search_input'
                  onChange={(e, d) => {
                    applyFilters('date', d);
                  }}
                />
              </Grid>
            </Grid>
          </div>

          <div className='_table_container' ref={componentRef}>
            <Table
              scroll={{ x: true }}
              loading={loading}
              columns={columns}
              dataSource={dataFilter.reverse()}
              pagination={false}
              defaultExpandAllRows={true}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Services;
