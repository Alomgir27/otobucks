import './styles.scss';

import {
  Button,
  Col,
  Form,
  Image,
  Input,
  Row,
  Select,
  Spin,
  Upload,
} from 'antd';
import { City, State } from 'country-state-city';
import {
  getAllServices,
  registerUser,
  uploadFile,
} from '../../redux/actions/register';
import { useDispatch, useSelector } from 'react-redux';

import SelectBox from '../SelectBox';
import { countries } from '../../constants';
import { openNotification } from '../../helpers';
import { useHistory } from 'react-router';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import PrivacyPolicyModal from '../PrivacyPolicyModal/PrivacyPolicyModal';
import TermsModal from '../TermsModal/TermsModal';

const { Option } = Select;

const FormItem = Form.Item;

const dummyRequest = ({ _, onSuccess }) => {
  setTimeout(() => {
    onSuccess('ok');
  }, 0);
};

const ServiceProvider = (props) => {
  const dispatch = useDispatch();
  const subCategory = useSelector((state) => state?.profile?.serviceCategories);
  const location = useLocation();
  let inviteCode = new URLSearchParams(location.search).get('invite');
  const [subCategory_id, setSubCategory_id] = useState([]);
  const [states, setState] = useState([]);
  const [selectedState, setSelectedState] = useState([]);
  const [pCode, setPCode] = useState('');
  const [vType, setVType] = useState('');
  const [pImage, setImage] = useState('');
  const [logo, setLogo] = useState('');
  const [country, setCountry] = useState('');
  const [tradeLicence, setTradeLicence] = useState('');
  const [trnCertificate, setTrnCertificate] = useState('');
  const [emirate, setEmirate] = useState();
  const [emirateBack, setEmirateBack] = useState();
  const [loading, setLoading] = useState(false);
  const [hearField, setHearField] = useState('');
  const [otherField, setOtherField] = useState('');
  const [loadingName, setLoadingName] = useState('');
  const [privacy, setPrivacy] = useState(false);
  const [privacyError, setPrivacyError] = useState(null);
  const history = useHistory();
  const [fileUploading, setFileUploading] = useState({
    name: '',
    loading: false,
  });

  const [openPrivacyModal, setOpenPrivacyModal] = useState(false);
  const [openTermModal, setOpenTermModal] = useState(false);

  const onFinishFailed = () => {};

  const vendorData = [{ value: 'company', title: 'Company' }];

  const hearAboutData = [
    { value: 'facebook', title: 'Facebook' },
    { value: 'linkedin', title: 'LinkedIn' },
    { value: 'whatsapp', title: 'Whatsapp' },
    { value: 'google', title: 'Google' },
    { value: 'instagram', title: 'Instagram' },
    { value: 'other', title: 'Other' },
  ];

  const onCountryChangeHandle = (country) => {
    dispatch(getAllServices(country));
    const code = countries.find((x) => x.value === country);
    setPCode(code?.phoneCode);
    const state = State.getStatesOfCountry(code.code);
    setState(state);
    setCountry(country);
  };

  useEffect(() => {
    onCountryChangeHandle('United Arab Emirates');
  }, []);

  // ? Category MultiSelect Handler
  function handleChange(value) {
    setSubCategory_id([value]);
  }

  // ? State MultiSelect Handler
  function handleStateChange(value) {
    setSelectedState(value);
    const cities = [];
    for (let i = 0; i < value.length; i++) {
      for (let j = 0; j < states.length; j++) {
        if (value[i] === states[j].name) {
          const city = City.getCitiesOfState(
            states[j].countryCode,
            states[j].isoCode
          );
          cities.push(...city);
        }
      }
    }
  }

  const onFinish = async (values) => {
    setLoading(true);
    const data = { ...values };
    data.country = country;
    data.role = 'serviceProvider';
    data.cities = data.state;
    data.providerType = data.vType;
    data.states = data.cities;
    data.refrence = data.HearField;
    data.categories = subCategory_id;
    if (vType === 'company') {
      if (!pImage || !logo || !tradeLicence || !trnCertificate) {
        openNotification('Please upload required documents');
        setLoading(false);
        return;
      }
      data.brochure = pImage?.image;
      data.logo = logo?.image;
      data.tradeLicence = tradeLicence;
      data.trnCertificate = trnCertificate;
    } else {
      if (!pImage || !emirate || !emirateBack) {
        openNotification('Please upload required documents');
        setLoading(false);
        return;
      }
      data.image = pImage?.image;
      data.emiratesID = {
        frontImage: emirate?.image,
        frontText: emirate?.text,
        backImage: emirateBack?.image,
        backText: emirateBack?.text,
      };
    }
    if (!privacy) {
      setPrivacyError('Please Agree to the terms and conditions');
      setLoading(false);
      return;
    }
    if (inviteCode) {
      data.invite = inviteCode;
    }

    data.firstName = data?.firstName?.trim();
    dispatch(registerUser(data, history, setLoading));
  };

  return (
    <div id='register_form'>
      <Form onFinish={onFinish} onFinishFailed={onFinishFailed}>
        <Row style={{ marginTop: 20 }} gutter={[10, 10]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
            <h1>First Name</h1>
            <FormItem
              name='firstName'
              rules={[
                {
                  pattern: new RegExp('^[a-zA-Z0-9]*$'),
                  required: true,
                  message: 'Invalid input',
                },
              ]}
              hasFeedback
            >
              <Input placeholder={'First Name'} size='large' />
            </FormItem>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
            <h1>Last Name</h1>
            <FormItem
              name='lastName'
              rules={[
                {
                  pattern: new RegExp('^[a-zA-Z0-9]*$'),
                  required: true,
                  message: 'Invalid input',
                },
              ]}
              hasFeedback
            >
              <Input placeholder={'Last Name'} size='large' />
            </FormItem>
          </Col>
        </Row>
        <Row style={{ marginTop: 10 }} gutter={[10, 10]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
            <h1>Email</h1>
            <FormItem
              name='email'
              rules={[
                { type: 'email', required: true, message: 'Email is required' },
              ]}
              hasFeedback
            >
              <Input placeholder={'E-mail'} size='large' />
            </FormItem>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
            <h1>Type</h1>
            <SelectBox
              onChange={(e) => {
                setVType(e);
              }}
              data={vendorData}
              rules={[{ required: true, message: 'Type is required' }]}
              placeholder={'Type'}
              name='vType'
              hasFeedback
            />
          </Col>
        </Row>
        <Row style={{ marginTop: 10 }} gutter={[10, 10]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
            <h1>Country</h1>
            <SelectBox
              onChange={onCountryChangeHandle}
              country
              defaultValue={country}
              value={country}
              data={countries}
              rules={[{ required: false, message: 'Country is required' }]}
              placeholder={'Country'}
              name='country'
              hasFeedback
            />
          </Col>

          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
            <h1>State</h1>
            <FormItem
              name='state'
              rules={[{ required: true, message: 'State is required' }]}
            >
              <Select
                mode='multiple'
                style={{ width: '100%' }}
                placeholder='Select States'
                onChange={handleStateChange}
                value={selectedState}
                optionLabelProp='label'
                size='large'
              >
                {states.map((state, index) => {
                  return (
                    <Option value={state.name} label={state.name} key={index}>
                      <div className='demo-option-label-item'>
                        <span aria-label={state.name}>{state.name}</span>
                      </div>
                    </Option>
                  );
                })}
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row style={{ marginTop: 10 }} gutter={[10, 10]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
            <h1>Phone No & What's App Number</h1>
            <FormItem
              name='phone'
              rules={[{ required: true, message: 'Phone number is required' }]}
              hasFeedback
            >
              <Input
                type='number'
                addonBefore={pCode}
                placeholder={'Phone'}
                size='large'
                disabled={!pCode}
              />
            </FormItem>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
            <h1>Select Service</h1>
            <FormItem
              name='service'
              rules={[{ required: true, message: 'Service is required' }]}
            >
              <Select
                style={{ width: '100%' }}
                placeholder='Select Services'
                rules={[{ required: true, message: 'Service is required' }]}
                onChange={handleChange}
                optionLabelProp='label'
                size='large'
                disabled={!pCode}
              >
                {subCategory?.map((item, i) => {
                  return (
                    <Option key={i} value={item._id} label={item.title}>
                      <div className='demo-option-label-item'>
                        <p>{item.title}</p>
                      </div>
                    </Option>
                  );
                })}
              </Select>
            </FormItem>
          </Col>
        </Row>
        {vType === 'company' && (
          <Row style={{ marginTop: 10 }} gutter={[10, 10]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
              <h1>Company Name</h1>
              <FormItem name='companyName' Feedback>
                <Input placeholder={'Company Name'} size='large' />
              </FormItem>
            </Col>
          </Row>
        )}

        {vType === 'company' && (
          <>
            <p>Documents</p>
            <Row style={{ marginTop: 10 }} gutter={[10, 10]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {fileUploading.name === 'pImage' && fileUploading.loading ? (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '145px',
                      }}
                    >
                      <Spin />
                    </div>
                  ) : (
                    <>
                      {pImage?.image && (
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: '16px',
                          }}
                        >
                          <Image
                            src={pImage?.image}
                            style={{ width: 100, height: 100 }}
                          />
                        </div>
                      )}
                      <Upload
                        style={{ width: '100%' }}
                        accept='image/*'
                        dummyRequest={dummyRequest}
                        beforeUpload={() => {
                          /* update state here */
                          return false;
                        }}
                        showUploadList={false}
                        name='pImage'
                        onChange={(e) =>
                          dispatch(
                            uploadFile(
                              e.file,
                              setImage,
                              'pImage',
                              setFileUploading
                            )
                          )
                        }
                      >
                        <Button
                          style={{ width: '100%' }}
                          loading={loadingName === 'pImage'}
                        >
                          Upload your Image
                        </Button>
                      </Upload>
                    </>
                  )}
                </div>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {fileUploading.name === 'logo' && fileUploading.loading ? (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '145px',
                      }}
                    >
                      <Spin />
                    </div>
                  ) : (
                    <>
                      {logo?.image && (
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: '16px',
                          }}
                        >
                          <Image
                            accept='image/*'
                            src={logo?.image}
                            style={{ width: 100, height: 100 }}
                          />
                        </div>
                      )}
                      <Upload
                        style={{ width: '100%' }}
                        accept='image/*'
                        dummyRequest={dummyRequest}
                        showUploadList={false}
                        beforeUpload={() => {
                          /* update state here */
                          return false;
                        }}
                        onChange={(e) =>
                          dispatch(
                            uploadFile(
                              e.file,
                              setLogo,
                              'logo',
                              setFileUploading
                            )
                          )
                        }
                      >
                        <Button
                          style={{ width: '100%' }}
                          loading={loadingName === 'logo'}
                        >
                          Upload Logo
                        </Button>
                      </Upload>
                    </>
                  )}
                </div>
              </Col>
            </Row>
            <Row style={{ marginTop: 10 }} gutter={[10, 10]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                  }}
                >
                  {fileUploading.name === 'trade_licence' &&
                  fileUploading.loading ? (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '145px',
                      }}
                    >
                      <Spin />
                    </div>
                  ) : (
                    <>
                      {tradeLicence?.image && (
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: '16px',
                          }}
                        >
                          <Image
                            src={
                              tradeLicence?.image
                                ? '/images/document.png'
                                : '/images/document.png'
                            }
                            style={{ width: 100, height: 100 }}
                          />
                        </div>
                      )}
                      <Upload
                        style={{ width: '100%' }}
                        accept='.pdf'
                        dummyRequest={dummyRequest}
                        showUploadList={false}
                        beforeUpload={() => {
                          /* update state here */
                          return false;
                        }}
                        onChange={async (e) => {
                          dispatch(
                            uploadFile(
                              e.file,
                              setTradeLicence,
                              'trade_licence',
                              setFileUploading
                            )
                          );
                        }}
                      >
                        <Button
                          loading={loadingName === 'tradeLicence'}
                          style={{ width: '100%' }}
                        >
                          Upload Trade Licence
                        </Button>
                      </Upload>
                    </>
                  )}
                </div>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {fileUploading.name === 'certificate' &&
                  fileUploading.loading ? (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '145px',
                      }}
                    >
                      <Spin />
                    </div>
                  ) : (
                    <>
                      {trnCertificate?.image && (
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: '16px',
                          }}
                        >
                          <Image
                            src={
                              trnCertificate?.image
                                ? '/images/document.png'
                                : ''
                            }
                            style={{ width: 100, height: 100 }}
                          />
                        </div>
                      )}
                      <Upload
                        style={{ width: '100%' }}
                        accept='.pdf'
                        dummyRequest={dummyRequest}
                        showUploadList={false}
                        beforeUpload={() => {
                          /* update state here */
                          return false;
                        }}
                        onChange={async (e) => {
                          dispatch(
                            uploadFile(
                              e.file,
                              setTrnCertificate,
                              'certificate',
                              setFileUploading
                            )
                          );
                        }}
                      >
                        <Button
                          style={{ width: '100%' }}
                          loading={loadingName === 'trnCertificate'}
                        >
                          Upload Trn Certificate
                        </Button>
                      </Upload>
                    </>
                  )}
                </div>
              </Col>
            </Row>
          </>
        )}

        {vType === 'individual' && (
          <>
            <p>Documents</p>
            <Row style={{ marginTop: 10 }} gutter={[10, 10]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {fileUploading.name === 'image' && fileUploading.loading ? (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '145px',
                      }}
                    >
                      <Spin />
                    </div>
                  ) : (
                    <>
                      {pImage?.image && (
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: '16px',
                          }}
                        >
                          <Image
                            src={pImage?.image}
                            style={{ width: 100, height: 100 }}
                          />
                        </div>
                      )}
                      <Upload
                        style={{ width: '100%' }}
                        accept='image/*'
                        dummyRequest={dummyRequest}
                        showUploadList={false}
                        beforeUpload={() => {
                          /* update state here */
                          return false;
                        }}
                        onChange={(e) =>
                          dispatch(
                            uploadFile(
                              e.file,
                              setImage,
                              'image',
                              setFileUploading
                            )
                          )
                        }
                      >
                        <Button
                          style={{ width: '100%' }}
                          loading={loadingName === 'pImage'}
                        >
                          Upload your Images
                        </Button>
                      </Upload>
                    </>
                  )}
                </div>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {fileUploading.name === 'id_front' &&
                  fileUploading.loading ? (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '145px',
                      }}
                    >
                      <Spin />
                    </div>
                  ) : (
                    <>
                      {emirate?.image && (
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: '16px',
                          }}
                        >
                          <Image
                            src={emirate?.image}
                            style={{ width: 100, height: 100 }}
                          />
                        </div>
                      )}
                      <Upload
                        style={{ width: '100%' }}
                        accept='image/*'
                        beforeUpload={() => {
                          /* update state here */
                          return false;
                        }}
                        showUploadList={false}
                        onChange={(e) => {
                          dispatch(
                            uploadFile(
                              e.file,
                              setEmirate,
                              'id_front',
                              setFileUploading
                            )
                          );
                        }}
                      >
                        <Button
                          style={{ width: '100%' }}
                          loading={loadingName === 'emirate'}
                        >
                          Upload Emirates ID Front
                        </Button>
                      </Upload>
                    </>
                  )}
                </div>
              </Col>
            </Row>
            <Row style={{ marginTop: 10 }} gutter={[10, 10]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {fileUploading.name === 'id_back' && fileUploading.loading ? (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '145px',
                      }}
                    >
                      <Spin />
                    </div>
                  ) : (
                    <>
                      {emirateBack?.image && (
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: '16px',
                          }}
                        >
                          <Image
                            src={emirateBack?.image}
                            style={{ width: 100, height: 100 }}
                          />
                        </div>
                      )}
                      <Upload
                        style={{ width: '100%' }}
                        accept='image/*'
                        showUploadList={false}
                        beforeUpload={() => {
                          /* update state here */
                          return false;
                        }}
                        onChange={(e) => {
                          dispatch(
                            uploadFile(
                              e.file,
                              setEmirateBack,
                              'id_back',
                              setFileUploading
                            )
                          );
                        }}
                      >
                        <Button
                          style={{ width: '100%' }}
                          loading={loadingName === 'emirateBack'}
                        >
                          Upload Emirates ID Back
                        </Button>
                      </Upload>
                    </>
                  )}
                </div>
              </Col>
            </Row>
          </>
        )}

        <Row style={{ marginTop: 10 }} gutter={[10, 10]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
            <h1>Password</h1>
            <Form.Item
              name='password'
              rules={[
                {
                  required: true,
                  message: (rule, value, callback) => {
                    if (
                      /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi.test(
                        value
                      )
                    ) {
                      callback('Error!');
                    } else {
                      callback();
                    }
                  },
                },
              ]}
              hasFeedback
            >
              <Input.Password size='large' placeholder='Enter password' />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
            <h1>Confirm Password</h1>
            <Form.Item
              name='passwordConfirm'
              dependencies={['password']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: 'Please confirm your password!',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error('Passwords you entered do not match!')
                    );
                  },
                }),
              ]}
            >
              <Input.Password size='large' placeholder='Confirm Password' />
            </Form.Item>
          </Col>
        </Row>
        <Row style={{ marginTop: 10 }} gutter={[10, 10]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
            <h1>
              Land Line/2<sup>nd</sup> Number{' '}
            </h1>
            <FormItem name='secondNumber' sFeedback>
              <Input
                type='number'
                addonBefore={pCode}
                placeholder={'Land Line or 2nd Number'}
                size='large'
                disabled={!pCode}
              />
            </FormItem>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
            <h1>How Did You Hear About Us</h1>
            <SelectBox
              onChange={(e) => {
                props.changeClasses(e);
                setHearField(e);
              }}
              rules={[{ required: true, message: 'Reference is required' }]}
              data={hearAboutData}
              placeholder={'HearField'}
              name='HearField'
              hasFeedback
            />
          </Col>
          {hearField === 'other' && (
            <>
              <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                <p>if other *</p>
                <FormItem
                  name='otherField'
                  value={otherField}
                  onChange={(e) => setOtherField(e.target.value)}
                  hasFeedback
                >
                  <Input placeholder={'Where Did You Here'} size='large' />
                </FormItem>
              </Col>
            </>
          )}
        </Row>
        <div>
          <FormControlLabel
            control={
              <Checkbox
                className='check_box'
                checked={privacy}
                onChange={(event) => {
                  setPrivacy(event.target.checked);
                  setPrivacyError(null);
                }}
              />
            }
            label={
              <>
                I agree to the{' '}
                <span
                  className='terms'
                  onClick={() => setOpenPrivacyModal(true)}
                >
                  {' '}
                  Privacy{' '}
                </span>{' '}
                and{' '}
                <span className='terms' onClick={() => setOpenTermModal(true)}>
                  {' '}
                  Terms{' '}
                </span>
                .
              </>
            }
          />
          {privacyError != null && (
            <p className='privacy_error'> {privacyError} </p>
          )}
        </div>
        <Row>
          <Button
            htmlType='submit'
            loading={loading}
            className='submit_btn'
            size='large'
          >
            Register
          </Button>
        </Row>
      </Form>
      <PrivacyPolicyModal
        openPrivacyModal={openPrivacyModal}
        setOpenPrivacyModal={setOpenPrivacyModal}
      />
      <TermsModal
        openTermModal={openTermModal}
        setOpenTermModal={setOpenTermModal}
      />
    </div>
  );
};

export default ServiceProvider;
