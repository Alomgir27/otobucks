import React, { useState, useEffect } from 'react';
import { Button, Form, Row, Col, Select, Spin, Modal } from 'antd';
import FormInput from '../../Components/FormInput';
import { post, patch, get } from '../../services/RestService';
import {
  openNotification,
  useQueryParams,
  options,
  openErrorNotification,
} from '../../helpers';
import { useHistory } from 'react-router';
import { useLocation } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import FormTextarea from '../../Components/FormTextarea';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../../constants';
import { BackIcon, CloseIcon } from '../../Icons';
import SupportIMG from '../../assets/support.png';
import BikeCarForm from './BikeCarForm';
import { CircularProgress } from '@mui/material';

const { Option } = Select;

const ServiceForm = () => {
  const location = useLocation();
  const config = {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
  };
  const [image, setImage] = useState([]);
  const [imagePath, setImagePath] = useState();
  const [video, setVideo] = useState();
  const [videoUrl, setVideoUrl] = useState();
  const [videoUploading, setVideoUploading] = useState(false);
  const history = useHistory();
  const query = useQueryParams();
  const [userData, setUserData] = useState();
  const method = query.get('type');
  const id = query.get('id');
  const edit = method === 'edit';
  const view = method === 'view';
  const create = method === 'create';
  const isMobileScreen = useMediaQuery({ query: '(max-width: 680px)' });
  const [cat, setCat] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [initialValues, setInitialValue] = useState();
  const [imagesModalOpen, setImagesModalOpen] = useState();
  const [locations, setLocation] = useState([
    { country: '', address: '', state: '', area: '' },
  ]);
  const [form] = Form.useForm();

  const [categoryId, setCategoryId] = useState();
  const [deliveryDetails, setDeliveryDetails] = useState({});
  const [details, setDetails] = useState({});
  const [features, setFeatures] = useState(['', '', '', '']);
  const [selectedSubCategories, setSelectedCategory] = useState();
  const [singleSelectedCategory, setSingleCategory] = useState();
  const [selecteSubCategoryId, setSelecteSubCategoryId] = useState();
  const [storesList, setStoresList] = useState(null);
  const [selectedStore, setSelectedStore] = useState();
  const [selectedStoresId, setSelectedStoresId] = useState([]);
  const [selectedState, setSelectedState] = useState();
  const [imageUploading, setImageUploading] = useState();
  const [loading, setLoading] = useState(false);

  const handleMakeChange = (name) => {
    const { make_id } = makes?.find((data) => data.name === name);
    setDetails({
      ...details,
      make: name,
    });
    getModels(make_id);
  };

  const handleModelChange = (name) => {
    setDetails({
      ...details,
      model: name,
    });
  };

  function handleSubCategoryId(state) {
    setSelecteSubCategoryId(state._id);
  }

  function handleSubCategory(value) {
    setSelectedCategory(value);
  }

  function handleStoreChanges(value) {
    setSelectedStore(value);
  }
  function handleStoreId(id) {
    selectedStoresId.push(id); // setSelectedStoresId({ id });
  }

  //Upload video on S3 Bucket
  async function uploadVidoe_S3(e) {
    try {
      setVideoUploading(true);
      let imageName = e.target.files[0].name;
      const options = {
        Key: imageName,
        Bucket: 'cdn.carbucks.com',
        Body: e.target.files[0],
      };

      await s3Client.send(new PutObjectCommand(options));
      let s3VideoLink = `https://s3.amazonaws.com/cdn.carbucks.com/${imageName}`;

      if (s3VideoLink) {
        handleVideoLink(s3VideoLink);
      }
      setVideoUploading(false);
    } catch (error) {
      setVideoUploading(false);
    }
  }
  //Upload Image on S3 Bucket
  async function uploadImg_S3(e) {
    try {
      setImageUploading(true);
      let imageName = e.target.files[0].name;
      const options = {
        Key: imageName,
        Bucket: 'cdn.carbucks.com',
        Body: e.target.files[0],
      };

      await s3Client.send(new PutObjectCommand(options));
      let s3ImgLink = `https://s3.amazonaws.com/cdn.carbucks.com/${imageName}`;

      if (s3ImgLink) {
        handleImageLink(s3ImgLink);
      }
      setImageUploading(false);
    } catch (error) {
      setImageUploading(false);
    }
    // }
  }
  function handleImageLink(s3ImgLink) {
    setImage([...image, s3ImgLink]);
  }

  function handleVideoLink(s3VideoLink) {
    setVideo(s3VideoLink);
  }

  useEffect(() => {
    getSubCategories(location?.state?.category || location?.state);
  }, [cat]);

  useEffect(() => {
    get('/categories/getCategories?type=service', options)
      .then((data) => {
        setCat(data?.result);
      })
      .catch((err) => {});
    getMakes();
  }, []);

  useEffect(() => {
    if (edit) {
      subCategories.forEach((category) => {
        if (category?._id === selecteSubCategoryId) {
          setSingleCategory(category);
        }
      });
    }
  }, [selecteSubCategoryId, subCategories, edit]);

  const getSubCategories = (slug) => {
    if (cat.length === 0) return;
    const { _id } = cat.find((data) => data.slug === slug || data._id === slug);
    setCategoryId(_id);
    get(`/categories/getSubCategories/${_id}`, options)
      .then((data) => {
        const cdata = [];
        data?.result?.forEach((d) => {
          const data = {
            value: d?.slug,
            title: `${d?.title}`,
            fields: d?.fields,
            _id: d?._id,
          };
          cdata.push(data);
        });
        setSubCategories(cdata);
      })
      .catch((err) => {});
  };

  const getMakes = () => {
    get('/cars/makes', options)
      .then((res) => {
        setMakes(res?.data?.result);
      })
      .catch((err) => {});
  };

  const getModels = (make_id) => {
    get(`/cars/models?make_id=${make_id}`, options)
      .then((res) => {
        setModels(res?.data?.result);
      })
      .catch((err) => {});
  };

  const onSubmit = (values) => {
    setLoading(true);
    values.labour_cost = values.labour_cost ? values.labour_cost : 0;
    const formData = new FormData();
    formData.append('category', categoryId);
    formData.append('subcategory', selecteSubCategoryId);
    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('details', JSON.stringify(details));
    formData.append('stores', JSON.stringify(selectedStore));
    formData.append('features', JSON.stringify(features));
    image.map((img) => {
      formData.append('image', img);
    });
    formData.append('video', video);
    formData.append('price', values.labour_cost);
    formData.append('s_id', values.s_id);

    edit
      ? patch(`/services/${id}`, formData, options)
          .then((res) => {
            if (res.status) {
              openNotification(res.message);
              history.push('services');
            } else {
              res?.error && openErrorNotification(res.message);
            }
            setLoading(false);
          })
          .catch((err) => {
            setLoading(false);
            err?.message && openErrorNotification(err.message);
          })
      : post('/services', formData, options)
          .then((res) => {
            if (res.status === 'success') {
              openNotification(res.message);
              history.push('services');
            } else {
              res?.error && openNotification(res.message);
            }
            setLoading(false);
          })
          .catch((err) => {
            setLoading(false);
            err?.message && openErrorNotification(err.message);
          });
  };

  const getData = () => {
    get(`/services/${id}`, options)
      .then((res) => {
        let obj = {
          category: res.result?.category?.title,
          subcategory: res.result?.subcategory?.title,
          labour_cost: res.result?.price,
          s_id: res.result?.id,
          description: res.result?.description,
          title: res.result?.title,
          Numberoflessons: res.result.details?.Numberoflessons,
          Typeofthevehicle: res.result.details?.Typeofthevehicle,
          VehicleClass: res.result.details?.VehicleClass,
          make: res.result.details?.make,
          year: res.result.details?.year,
          model: res.result.details?.model,
          bodyType: res.result.details?.bodyType,
          fuelType: res.result.details?.fuelType,
          color: res.result.details?.color,
          milage: res.result.details?.milage,
          seats: res.result.details?.seats,
          transmission: res.result.details?.transmission,
        };
        let store = res.result.stores.map((v, k) => {
          return v._id;
        });
        setCategoryId(res.result?.category?._id);
        setSelecteSubCategoryId(res.result?.subcategory?._id);
        setSelectedStore([...store]);
        setInitialValue({ ...obj });
        setImagePath(res.result?.image);
        setImage(res?.result?.image);
        setVideoUrl(res?.result?.video);
        setVideo(res?.result?.video);
        setFeatures(res?.result?.features);
        setLocation(res.result?.locations);
        setUserData(res.result);
        setDetails({
          make: res.result?.details?.make,
          model: res.result?.details?.model,
          year: res?.result?.details?.year,
        });
        if (res.result?.subcategory) {
          getSubCategories(res.result?.category);
          form.setFieldsValue({ 'sub-category': res.result?.subcategory });
        }
      })
      .catch((err) => {});
  };

  // API Run for get All Stores
  React.useEffect(() => {
    async function apiCall1() {
      await get(`/stores/mine`, config)
        .then((res) => {
          setStoresList(res?.result);
        })
        .catch((err) => {
          setStoresList([]);
        });
    }
    apiCall1();
  }, []);

  useEffect(() => {
    if (edit || view) getData();
  }, [edit, view]);

  return (location?.state && location?.state === 'rentacarservices') ||
    location?.state?.category === '62c06a80f909a95e98ec34bb' ? (
    <BikeCarForm />
  ) : storesList ? (
    storesList?.length >= 1 ? (
      <div
        style={{ padding: isMobileScreen ? 10 : 50 }}
        className='create-product'
      >
        <div style={{ backgroundColor: 'white', padding: 20 }}>
          <Button
            type='primary'
            className='_back_btn'
            onClick={() => history.push('/services')}
          >
            <BackIcon />
            <h1 className='_selected_store_heading' style={{ marginLeft: 20 }}>
              Services
            </h1>
          </Button>
          <h1 style={{ marginTop: 20 }}>
            <span
              style={{ marginRight: 5, cursor: 'pointer' }}
              onClick={() => history.push('/services')}
            >
              Services /
            </span>
            {edit ? 'Edit' : view ? 'View' : 'Create'} Service
          </h1>

          {((edit && userData && initialValues) ||
            (view && userData && initialValues) ||
            create) && (
            <div style={{ marginTop: 20 }}>
              <Form
                scrollToFirstError
                form={form}
                onFinish={onSubmit}
                initialValues={initialValues}
              >
                <Row gutter={[10, 10]}>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Row gutter={[10, 10]} className='file-box flex flex-col'>
                      <div className='img-sec flex flex-col aic jc'>
                        {image.length > 0 ? (
                          <div className='images-block'>
                            <div>
                              <div className='s-i-v flex'>
                                <img
                                  className='img-tag'
                                  src={image[0]}
                                  alt=''
                                />
                                <div
                                  className='cross-icon abs cfff'
                                  onClick={() => {
                                    const filtered = [...image];
                                    filtered.splice(0, 1);
                                    setImage(filtered);
                                  }}
                                >
                                  <CloseIcon />
                                </div>
                              </div>
                            </div>
                            {image.length > 1 && (
                              <div className='view-more-images'>
                                <div>+{image.length - 1} more</div>
                                <div
                                  className='_view_more_btn font s16'
                                  onClick={() => setImagesModalOpen(true)}
                                >
                                  View
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          !imageUploading && <p>Upload Product Image</p>
                        )}
                        <>
                          <input
                            className='input-img '
                            id='upload-file_Img'
                            type='file'
                            accept='image/*'
                            onChange={(e) => {
                              let file = e.target.files[0];
                              uploadImg_S3(e);
                              file && setImagePath(URL.createObjectURL(file));
                            }}
                          />
                          <Button
                            className='btn w200'
                            loading={imageUploading}
                            onClick={() =>
                              document.getElementById('upload-file_Img').click()
                            }
                          >
                            Upload Image
                          </Button>
                        </>
                      </div>
                      {videoUploading ? (
                        <div>
                          <Spin />
                        </div>
                      ) : (
                        <div
                          div
                          className='upload-video-sec flex flex-col aic jc'
                        >
                          {videoUrl ? (
                            <video
                              className='video-tag'
                              controls
                              src={videoUrl}
                              poster=''
                            />
                          ) : (
                            <p>Upload Product Video</p>
                          )}
                          <input
                            className='input-video'
                            id='upload-file_Video'
                            type='file'
                            accept='video/*'
                            onChange={(e) => {
                              let file = e.target.files[0];
                              // setVideo(e.target.files[0]);
                              uploadVidoe_S3(e);
                              file && setVideoUrl(URL.createObjectURL(file));
                            }}
                          />
                          <div
                            className='btn btn-select-video cleanbtn flex aic jc flex-col w200'
                            onClick={() =>
                              document
                                .getElementById('upload-file_Video')
                                .click()
                            }
                          >
                            Upload Video
                          </div>
                        </div>
                      )}
                      {videoUrl ? (
                        <></>
                      ) : (
                        <div className='other-video-link flex flex-col aic jc'>
                          <p>Upload Product Video Link</p>
                          <input
                            type='text'
                            className='video-link cleanbtn w200'
                            placeholder='Place here Youtube or any other source video link...'
                            onChange={(e) => setVideo(e.target.value)}
                          />
                        </div>
                      )}
                    </Row>
                    <Row gutter={[10, 10]}>
                      <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                        <p>Title</p>
                        <FormInput
                          name='title'
                          rules={[{ required: true, message: 'Required' }]}
                        />
                      </Col>
                      {/* <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                      <p>Categories</p>
                      <SelectBox
                        size="medium"
                        onChange={(e) => getSubCategories(e)}
                        data={categories}
                        rules={[{ required: true, message: "Required" }]}
                        style={{ width: "100%" }}
                        name="category"
                        optionLabelProp="label"
                      />
                    </Col> */}

                      <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                        <p>Sub Categories</p>
                        <Form.Item
                          rules={[{ required: true, message: 'Required' }]}
                          name='subcategory'
                        >
                          <Select
                            style={{ width: '100%' }}
                            placeholder='Select Sub Categories'
                            onChange={(e) => handleSubCategory(e)}
                            optionLabelProp='label'
                          >
                            {subCategories?.map((state, index) => {
                              return (
                                <Option
                                  value={state.title}
                                  label={state.title}
                                  key={index}
                                >
                                  <div
                                    className='demo-option-label-item'
                                    onClick={() => {
                                      setSingleCategory(state);
                                      handleSubCategoryId(state);
                                    }}
                                  >
                                    <span aria-label={state.title}>
                                      {state.title}
                                    </span>
                                  </div>
                                </Option>
                              );
                            })}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                        <p>Select Stores</p>
                        {/* <SelectBox data={storesList} name="stores" /> */}
                        <Select
                          mode='multiple'
                          name='stores-name'
                          style={{ width: '100%' }}
                          placeholder='Select stores'
                          rules={[{ required: true, message: 'Required' }]}
                          optionLabelProp='label'
                          // size="large"
                          value={selectedStore}
                          onChange={handleStoreChanges}
                        >
                          {storesList?.map((category, index) => {
                            return (
                              <Option
                                value={category._id}
                                label={category.name}
                                key={index}
                              >
                                <div className='demo-option-label-item'>
                                  <span
                                    aria-label={category.name}
                                    onClick={(e) => {
                                      handleStoreId(category);
                                    }}
                                  >
                                    {category.name}, {category.state}
                                  </span>
                                </div>
                              </Option>
                            );
                          })}
                        </Select>
                      </Col>
                      <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                        <p>Labour Cost Per Hour</p>
                        <FormInput value={0} name='labour_cost' type='number' />
                      </Col>
                    </Row>
                    <Row gutter={[10, 10]}>
                      {singleSelectedCategory?.fields?.map((item, index) => (
                        <Col xs={24} sm={24} md={6} lg={6} xl={6} key={index}>
                          <p>
                            {item.name.charAt(0).toUpperCase() +
                              item.name.slice(1)}
                          </p>
                          {item.name === 'make' || item.name === 'model' ? (
                            <Select
                              style={{ width: '100%' }}
                              placeholder={`Select ${
                                item.name.charAt(0).toUpperCase() +
                                item.name.slice(1)
                              }`}
                              defaultValue={
                                item.name === 'make'
                                  ? userData?.details?.make
                                  : userData?.details?.model
                              }
                              onChange={
                                item.name === 'make'
                                  ? handleMakeChange
                                  : handleModelChange
                              }
                              optionLabelProp='label'
                            >
                              {item.name === 'make'
                                ? makes?.map((state, index) => {
                                    return (
                                      <Option
                                        value={state.name}
                                        label={state.name}
                                        key={index}
                                      >
                                        <div className='demo-option-label-item'>
                                          <span aria-label={state.name}>
                                            {state.name}
                                          </span>
                                        </div>
                                      </Option>
                                    );
                                  })
                                : models?.map((state, index) => {
                                    return (
                                      <Option
                                        value={state.name}
                                        label={state.name}
                                        key={index}
                                      >
                                        <div className='demo-option-label-item'>
                                          <span aria-label={state.name}>
                                            {state.name}
                                          </span>
                                        </div>
                                      </Option>
                                    );
                                  })}
                            </Select>
                          ) : (
                            <input
                              type='text'
                              className='txtbox'
                              value={details?.year}
                              onChange={(e) =>
                                setDetails({
                                  ...details,
                                  [item.name]: e.target.value,
                                })
                              }
                            />
                          )}
                        </Col>
                      ))}
                    </Row>
                    {/* <Row gutter={[10, 10]} style={{ marginTop: "20px" }}>
                    {edit && (
                      <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                        <p>Service Id</p>
                        <FormInput name="s_id" />
                      </Col>
                    )}
                  </Row> */}
                    <Row gutter={[10, 10]}></Row>
                    <Row gutter={[10, 10]}>
                      {selectedState?.title === 'YES' ? (
                        <>
                          <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                            <p>Delivery with in Range</p>
                            <input
                              type='text'
                              className='txtbox'
                              value={deliveryDetails.range}
                              onChange={(e) => {
                                setDeliveryDetails({
                                  ...deliveryDetails,
                                  range: e.target.value,
                                });
                              }}
                            />
                          </Col>
                          <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                            <p>Delivery Charges</p>
                            <input
                              type='text'
                              className='txtbox'
                              value={deliveryDetails.charges}
                              onChange={(e) => {
                                setDeliveryDetails({
                                  ...deliveryDetails,
                                  charges: e.target.value,
                                });
                              }}
                            />
                          </Col>
                          <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                            <p>Delivery with in Days</p>
                            <input
                              type='text'
                              className='txtbox'
                              value={deliveryDetails.days}
                              onChange={(e) => {
                                setDeliveryDetails({
                                  ...deliveryDetails,
                                  days: e.target.value,
                                });
                              }}
                            />
                          </Col>
                        </>
                      ) : (
                        <></>
                      )}
                    </Row>
                    <Row gutter={[10, 10]}>
                      {features.map((v, k) => (
                        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                          <p>Key Feature {k + 1}</p>
                          <input
                            type='text'
                            name='title'
                            value={v}
                            className='txtbox'
                            style={{ marginBottom: '20px' }}
                            onChange={(e) => {
                              let array = [...features];
                              array[k] = e.target.value;
                              setFeatures([...array]);
                            }}
                          />
                        </Col>
                      ))}
                    </Row>

                    <div style={{ width: '75%' }}>
                      <p>Description</p>
                      <FormTextarea name='description' />
                    </div>
                  </Col>
                </Row>

                {!view && (
                  <Button
                    className='auto-service-submit-btn'
                    type='primary'
                    htmlType='submit'
                    disabled={
                      !storesList || storesList?.length <= 0 ? true : loading
                    }
                  >
                    {loading ? (
                      <div className='submit-loader'>
                        <Spin size='small' />
                      </div>
                    ) : (
                      'Create'
                    )}
                  </Button>
                )}
              </Form>
            </div>
          )}
        </div>
        <Modal
          footer={false}
          title='View Images'
          okText='Done'
          visible={imagesModalOpen}
          onCancel={() => setImagesModalOpen(false)}
        >
          <div>
            {image.map((img, index) => (
              <div className='s-i-v flex'>
                <img
                  className='images-modal-sinele-image'
                  src={img}
                  alt=''
                  height='100px'
                  width='100px'
                />
                <div
                  className='cross-icon abs cfff'
                  onClick={() => {
                    const filtered = [...image];
                    filtered.splice(index, 1);
                    setImage(filtered);
                  }}
                >
                  <CloseIcon />
                </div>
              </div>
            ))}
          </div>
        </Modal>
      </div>
    ) : (
      <>
        <div className='progress_box support_box'>
          <img src={SupportIMG} alt='ERROR' />
          <p className='note'>
            {' '}
            Please add a Store from Profile first to add a service.{' '}
          </p>
          <Button className='link_btn' onClick={() => history.push('/profile')}>
            {' '}
            Go To profile{' '}
          </Button>
        </div>
      </>
    )
  ) : (
    <>
      <div className='progress_box'>
        <CircularProgress />
      </div>
    </>
  );
};

export default ServiceForm;
