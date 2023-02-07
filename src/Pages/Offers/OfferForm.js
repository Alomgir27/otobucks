import React, { useState, useEffect } from 'react';
import { Button, Form, Row, Col, Image, DatePicker, Input, Select } from 'antd';
import UploadImage from '../../Components/UploadImage';
import FormInput from '../../Components/FormInput';
import FormTextArea from '../../Components/FormTextarea';
import SelectBox from '../../Components/SelectBox';
import { post, patch, get } from '../../services/RestService';
import { openNotification, useQueryParams, options, openErrorNotification} from '../../helpers';
import { useHistory } from 'react-router';
import { useMediaQuery } from 'react-responsive';
import moment from 'moment';

const OfferForm = () => {
  const [image, setImage] = useState();
  const [imageUrl, setImageUrl] = useState();
  const [sDate, setSDate] = useState();
  const [eDate, setEDate] = useState();
  const [userData, setUserData] = useState();
  const [services, setServices] = useState([{ values: '', title: '' }]);
  const [price, setPrice] = useState();
  const [discount, setDiscount] = useState(0);
  const [priceAfterDiscount, setPriceAfterDiscount] = useState(0);
  const history = useHistory();
  const query = useQueryParams();
  const method = query.get('type');
  const id = query.get('id');
  const location = query.get('location');
  const days = query.get('days');
  const edit = method === 'edit';
  const view = method === 'view';
  const create = method === 'create';
  const isMobileScreen = useMediaQuery({ query: '(max-width: 680px)' });
  const [form] = Form.useForm();

  const [myServices, setMyServices] = useState(null);
  const [selectedServices, setSelectedServices] = useState(null);
  const [selectedSource, setSelectedSource] = useState(null);

  const selectingService = (event) => {
    const findService = myServices.find((val) => val._id == event);
    console.log(findService);
    setSelectedServices(findService);
    // setPrice(findService?.price)
  };

  useEffect(() => {
    get('/services/myServices', options)
      .then((data) => {
        setMyServices(data?.result);
        const cdata = [];
        data?.result?.map((d) =>
          cdata.push({ value: d?._id, title: `${d?.title}` })
        );
        setServices(cdata);
      })
      .catch((err) => {});
    let presentDate = new Date();
    let endDate =
      days == 'five'
        ? presentDate.getTime() + 4.32e8
        : presentDate.getTime() + 1.728e8;
    let finalEndDate = new Date(endDate);
    setEDate(finalEndDate.toISOString()?.substring(0, 10));
  }, []);

  const onSubmit = (values) => {
    const { user } = JSON.parse(localStorage.getItem('user'));
    const formData = new FormData();
    Object.keys(values).forEach((key) => formData.append(key, values[key]));
    formData.append('previousPrice', price);
    formData.append('discount', discount);
    formData.append('priceAfterDiscount', priceAfterDiscount);
    formData.append('promoImg', image ? image : imageUrl);
    formData.append('startDate', sDate?.substring(0, 10) || new Date());
    formData.append('endDate', eDate?.substring(0, 10) || new Date());
    formData.append('country', user.country);
    formData.append('location', location);
    formData.append('days', days);
    formData.append('sourceType', 'service');

    post('/promotions', formData, options)
      .then((res) => {
        if (res.status) {
          openNotification(res.message);
          history.push('offers');
        } else {
          openNotification(res.message);
        }
      })
      .catch((err) => {
        openErrorNotification(err.message);
      });
  };
  const getData = () => {
    get(`/promotions/${id}`, options)
      .then((res) => {
        console.log(res.result);
        setSelectedSource(res?.result?.source?._id);
        setSelectedServices(res?.result?.source);
        setUserData(res.result);
        setImageUrl(res?.result?.promoImg);
        setSDate(res?.result?.startDate);
        setEDate(res?.result?.endDate);
        setPrice(res?.result?.previousPrice);
        setDiscount(res?.result?.discount);
      })
      .catch((err) => {});
  };

  const handleSetDate = (_, date) => {
    let presentDate = new Date(date);
    let endDate =
      days == 'five'
        ? presentDate.getTime() + 4.32e8
        : presentDate.getTime() + 1.728e8;
    let finalEndDate = new Date(endDate);
    setSDate(date);
    setEDate(finalEndDate.toISOString()?.substring(0, 10));
  };

  useEffect(() => {
    if (price && discount) {
      setPriceAfterDiscount(
        price -
          (price * discount) / 100 +
          (price - (price * discount) / 100) * 0.05
      );
    } else if (price) {
      setPriceAfterDiscount(Number(price) + price * 0.05);
    } else {
      setPriceAfterDiscount(0);
    }
  }, [price, discount]);
  useEffect(() => {
    if (edit || view) getData();
  }, [edit, view]);

  const onEdit = (values) => {
    alert('edit');
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      if ([key] == 'source') {
        formData.append(key, values[key]._id);
        return;
      }
      formData.append(key, values[key]);
    });
    formData.append('previousPrice', price);
    formData.append('discount', discount);
    formData.append('priceAfterDiscount', priceAfterDiscount);
    formData.append('startDate', sDate?.substring(0, 10));
    formData.append('endDate', eDate?.substring(0, 10));
    formData.append('offerImg', image ? image : imageUrl);
    patch(`/promotions/${userData._id}`, formData, options)
      .then((res) => {
        if (res.status) {
          openNotification(res.message);
          history.push('/offers');
        } else {
          openNotification(res.message);
        }
      })
      .catch((err) => {
        openErrorNotification(err.message);
      });
  };
  const pages = [
    { value: 'servicePage', title: 'Service Page' },
    { value: 'homePage', title: 'Home Page' },
  ];

  return (
    <div style={{ padding: isMobileScreen ? 10 : 50 }}>
      <div style={{ backgroundColor: 'white', padding: 20 }}>
        <h1>
          <span
            style={{ marginRight: 5, cursor: 'pointer' }}
            onClick={() => history.push('/offers')}
          >
            Promotions /
          </span>
          {edit ? 'Edit' : view ? 'View' : 'Create'} Promotion
        </h1>
        {(image || imageUrl) && (
          <div style={{ textAlign: 'center' }}>
            <Image
              src={image ? URL.createObjectURL(image) : imageUrl}
              style={{ width: 100, heigt: 100, objectFit: 'contain' }}
            />
          </div>
        )}
        {((edit && userData) || (view && userData) || create) && (
          <div style={{ marginTop: 20 }}>
            <Form
              form={form}
              onFinish={edit ? onEdit : onSubmit}
              initialValues={userData}
            >
              <Row gutter={[10, 10]}>
                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                  {!view && (
                    <div style={{ marginTop: 20, marginBottom: 10 }}>
                      <p>Upload Promotion Image</p>
                      <UploadImage image={image} setImage={setImage} />
                    </div>
                  )}
                </Col>
              </Row>

              {/* <Row gutter={[10, 10]}>
                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                  <p>Services</p>
                  {view || edit ? (
                    <Select disabled defaultValue={userData?.source?.title} />
                  ) : (
                    <SelectBox
                      data={services}
                      onChange={selectingService}
                      name='source'
                    />
                  )}
                </Col>
              </Row> */}

              <Row gutter={[10, 10]}>
                <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                  <p>Services Title</p>
                  <FormInput name='title' disabled={view} />
                </Col>
                <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                  <p>Price Before</p>
                  {/* <FormInput name="previousPrice" /> */}
                  <Form.Item>
                    <Input
                      name='previousPrice'
                      type='number'
                      value={price}
                      disabled={view}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                  <p>Discount</p>
                  {/* <FormInput name="discount" addonAfter="%" /> */}
                  <Form.Item>
                    <Input
                      name='discount'
                      type='number'
                      addonAfter='%'
                      value={discount}
                      disabled={view}
                      onChange={(e) => setDiscount(e.target.value)}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[10, 10]}>
                <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                  <p>Price After Inc. Tax</p>
                  {/* <FormInput name="priceAfterDiscount" /> */}
                  <Form.Item>
                    <Input
                      name='priceAfterDiscount'
                      value={priceAfterDiscount}
                      type='number'
                      disabled={view}
                      readOnly
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                  <p>Promotion Start Date</p>
                  <DatePicker
                    style={{ width: '100%' }}
                    value={moment(sDate)}
                    disabled={view}
                    onChange={handleSetDate}
                  />
                </Col>
                <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                  <p>Promotion End Date</p>
                  <DatePicker
                    style={{ width: '100%' }}
                    value={moment(eDate)}
                    disabled
                    // onChange={(_, date) => setEDate(date)}
                  />
                </Col>

                {/* <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                  <p>On Page</p>
                  <SelectBox
                    size="medium"
                    data={pages}
                    name="location"
                    disabled={view}
                  />
                </Col> */}
              </Row>

              <Row gutter={[10, 10]}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <p>Description</p>
                  <FormTextArea name='description' disabled={view} />
                </Col>
              </Row>

              {!view && (
                <Button
                  style={{ marginTop: 30 }}
                  type='primary'
                  htmlType='submit'
                >
                  Submit
                </Button>
              )}
            </Form>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfferForm;
