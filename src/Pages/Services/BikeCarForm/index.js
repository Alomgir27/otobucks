import { Button, Grid, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React, { useState, useEffect } from 'react';
import { cloneDeep } from 'lodash';
import { Select, Input, Spin } from 'antd';
import { get, post, patch } from '../../../services/RestService';
import {
  openErrorNotification,
  openNotification,
  options,
  useQueryParams,
} from '../../../helpers';
import { useHistory } from 'react-router';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../../../constants';
import '../styles.scss';
import { log } from '@craco/craco/lib/logger';

const { Option } = Select;
const { TextArea } = Input;

const BikeCarForm = ({ productData, isEdit, isView }) => {
  const query = useQueryParams();

  const method = query.get('type');
  const id = query.get('id');
  const edit = method === 'edit';
  isEdit = edit;
  const view = method === 'view';
  const create = method === 'create';

  const config = {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
  };
  const [loadModel, setLoadModel] = useState(true);
  const history = useHistory();
  const [selectedImageFiles, setSelectedImageFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [selectedVideoFiles, setSelectedVideoFiles] = useState([]);
  const [previewVideos, setPreviewVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productState, setProductState] = useState({
    youtubeLink: '',
    title: '',
    subcategory: '',
    p_id: '',
    stores: [],
    warrantyMonths: '',
    features: ['', '', '', ''],
    description: '',
    price: '',
    details: {
      newOrUsed: '',
      make: '',
      model: '',
      year: '',
      bodyType: '',
      transmissionType: '',
      fuelRange: '',
      kilometers: '',
      color: '',
      usage: '',
      type: '',
      badges: [],
    },
  });
  const [allStores, setAllStores] = useState([]);
  const [allSubCategories, setAllSubCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);

  // API Run for get All Stores
  React.useEffect(() => {
    async function getStores() {
      await get(`/stores/mine`, config)
        .then((res) => {
          setAllStores(res?.result);
        })
        .catch((err) => {});
    }
    getStores();
  }, []);
  // API Run for get All Subcategories
  React.useEffect(() => {
    async function getSubCategories() {
      await get(`/categories/getSubCategories/62c06a80f909a95e98ec34bb`, config)
        .then((res) => {
          setAllSubCategories(res?.result);
        })
        .catch((err) => {});
    }
    getSubCategories();
  }, []);

  async function getBrand() {
    await get(`/cars/makes`, config)
      .then((res) => {
        setBrands(res?.data?.result);
        if (isEdit) {
          getData();
        }
      })
      .catch((err) => {});
  }

  useEffect(() => {
    if (productData) {
      let cloneProductState = {};
      cloneProductState.title = productData.title;
      cloneProductState.subcategory = productData.subcategory._id;
      cloneProductState.p_id = productData.p_id;
      cloneProductState.stores = [];
      productData.stores.map((store) => {
        if (store.store) {
          cloneProductState.stores.push(store.store.name);
        }
        return null;
      });
      cloneProductState.features = productData.features;
      cloneProductState.description = productData.description;
      cloneProductState.details = productData.details;
      setProductState(cloneProductState);

      let parsedImages = JSON.parse(productData.image[0]);
      let cloneSelectedFiles = [];
      let clonePreviewImages = [];
      parsedImages.forEach((image) => {
        cloneSelectedFiles.push('');
        clonePreviewImages.push(image);
      });
      setSelectedImageFiles(cloneSelectedFiles);
      setPreviewImages(clonePreviewImages);

      let parsedVideos = JSON.parse(productData.video[0]);
      let cloneSelectedVideoFiles = [];
      let clonePreviewVideos = [];
      parsedVideos.forEach((video) => {
        cloneSelectedVideoFiles.push('');
        clonePreviewVideos.push(video);
      });
      setSelectedVideoFiles(cloneSelectedVideoFiles);
      setPreviewVideos(clonePreviewVideos);
    }
  }, [productData]);

  const selectFiles = (event, tag) => {
    if (tag === 'images') {
      let images = [];
      for (let i = 0; i < event.target.files.length; i++) {
        images.push(URL.createObjectURL(event.target.files[i]));
      }
      setSelectedImageFiles([...selectedImageFiles, ...event.target.files]);
      setPreviewImages([...previewImages, ...images]);
    } else {
      let videos = [];
      for (let i = 0; i < event.target.files.length; i++) {
        videos.push(URL.createObjectURL(event.target.files[i]));
      }
      setSelectedVideoFiles([...selectedVideoFiles, ...event.target.files]);
      setPreviewVideos([...previewVideos, ...videos]);
    }
  };
  const handleClose = (i, tag) => {
    if (tag === 'images') {
      let images = cloneDeep(previewImages);
      let imageFiles = cloneDeep(selectedImageFiles);
      images.splice(i, 1);
      imageFiles.splice(i, 1);
      setPreviewImages(images);
      setSelectedImageFiles(imageFiles);
    } else {
      let videos = cloneDeep(previewVideos);
      let videoFiles = cloneDeep(selectedVideoFiles);
      videos.splice(i, 1);
      videoFiles.splice(i, 1);
      setPreviewVideos(videos);
      setSelectedVideoFiles(videoFiles);
    }
  };

  const handleChange = (e, key) => {
    let cloneProductState = cloneDeep(productState);
    cloneProductState[key] = e.target.value;
    setProductState(cloneProductState);
  };
  const handleSelectChange = (value, key) => {
    let cloneProductState = cloneDeep(productState);
    cloneProductState[key] = value;
    setProductState(cloneProductState);
  };

  const handleFeatureChange = (value, index) => {
    let cloneProductState = cloneDeep(productState);
    cloneProductState.features[index] = value;
    setProductState(cloneProductState);
  };

  const detailsChange = (value, key) => {
    let cloneProductState = cloneDeep(productState);
    cloneProductState['details'][key] = value;
    setProductState(cloneProductState);
  };

  const handleBrandChange = async (name) => {
    const { make_id } = brands.find((brand) => {
      return brand.name === name;
    });
    let cloneProductState = cloneDeep(productState);
    cloneProductState.details.make = name;
    cloneProductState.details.model = '';
    setProductState(cloneProductState);
    await get(`/cars/models?make_id=${make_id}`, config)
      .then((res) => {
        setModels(res?.data?.result);
      })
      .catch((err) => {});
  };

  const handleModelChange = (name) => {
    let cloneProductState = cloneDeep(productState);
    cloneProductState.details.model = name;
    setProductState(cloneProductState);
  };

  const onSubmit = async () => {
    setLoading(true);
    let imageLinks = [];
    let videoLinks = [];
    await Promise.all(
      selectedImageFiles.map(async (file, i) => {
        if (file) {
          let imageName = file.name;
          const options = {
            Key: imageName,
            Bucket: 'cdn.carbucks.com',
            Body: file,
          };
          await s3Client.send(new PutObjectCommand(options));
          let s3Link = `https://s3.amazonaws.com/cdn.carbucks.com/${imageName}`;
          imageLinks.push(s3Link);
          return null;
        } else {
          imageLinks.push(previewImages[i]);
          return null;
        }
      })
    );

    imageLinks.length == 0 && (imageLinks = previewImages);
    await Promise.all(
      selectedVideoFiles.map(async (file, i) => {
        if (file) {
          let imageName = file.name;
          const options = {
            Key: imageName,
            Bucket: 'cdn.carbucks.com',
            Body: file,
          };
          await s3Client.send(new PutObjectCommand(options));
          let s3Link = `https://s3.amazonaws.com/cdn.carbucks.com/${imageName}`;
          videoLinks.push(s3Link);
          return null;
        } else {
          videoLinks.push(previewVideos[i]);
          return null;
        }
      })
    );
    videoLinks.length == 0 && (videoLinks = previewImages);

    if (imageLinks.length == 0) {
      openErrorNotification('One image is required!');
      setLoading(false);
      return;
    } else if (!productState.title) {
      openErrorNotification('Title is required!');
      setLoading(false);
      return;
    } else if (!productState.subcategory) {
      openErrorNotification('SubCategory is required!');
      setLoading(false);
      return;
    } else if (!productState.details.make) {
      openErrorNotification('Brand is required!');
      setLoading(false);
      return;
    } else if (!productState.details.model) {
      openErrorNotification('Model is required!');
      setLoading(false);
      return;
    } else if (!productState.details.bodyType) {
      openErrorNotification('Body Type is required!');
      setLoading(false);
      return;
    } else if (!productState.details.transmissionType) {
      openErrorNotification('Transmission Type is required!');
      setLoading(false);
      return;
    } else if (!productState.details.fuelRange) {
      openErrorNotification('Fule Range  Type is required!');
      setLoading(false);
      return;
    } else if (!productState.details.kilometers) {
      openErrorNotification('Kilometers  Type is required!');
      setLoading(false);
      return;
    } else if (!productState.details.color) {
      openErrorNotification('Color  Type is required!');
      setLoading(false);
      return;
    } else if (!productState.details.type) {
      openErrorNotification('Type is required!');
      setLoading(false);
      return;
    } else if (productState.stores.length == 0) {
      openErrorNotification('Select at least one store!');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('category', '62c06a80f909a95e98ec34bb');
    formData.append('subcategory', productState.subcategory);
    formData.append('p_id', productState.p_id);
    formData.append('title', productState.title || '');
    formData.append('description', productState.description || '');
    formData.append('details', JSON.stringify(productState.details));
    formData.append('wholesalePrice', -1);
    formData.append('retailPrice', -1);
    formData.append('image', imageLinks);
    formData.append('video', JSON.stringify(videoLinks));
    formData.append('price', productState?.price);
    let stores = [];
    productState.stores?.forEach((store) => {
      let completeStore = allStores.find((option) => option.name === store);
      stores.push(completeStore._id);
    });
    formData.append('stores', JSON.stringify(stores));
    formData.append('features', JSON.stringify(productState.features));

    if (isEdit) {
      patch(`/services/${productState._id}`, formData, options)
        .then((res) => {
          if (res.status === 'success') {
            openNotification(res.message);
            history.push('/services');
          } else {
            res?.error && openNotification(res.message);
          }
        })
        .catch((err) => {
          err?.message && openNotification(err.message);
        });
    } else {
      post('/services', formData, options)
        .then((res) => {
          if (res.status === 'success') {
            openNotification(res.message);
            setLoading(false);
            history.push('services');
          } else {
            res?.error && openNotification(res.message);
          }
        })
        .catch((err) => {
          setLoading(false);
          err?.message && openNotification(err.message);
        });
    }
  };

  const getData = () => {
    get(`/services/${id}`, options)
      .then((res) => {
        const result = res.result;
        if (result) {
          let cloneProductState = {
            details: {},
          };
          cloneProductState._id = result._id;
          cloneProductState.title = result.title;
          cloneProductState.subcategory = result.subcategory._id;
          cloneProductState.p_id = result.p_id;
          cloneProductState.price = result.price;
          cloneProductState.stores = [];

          const previousStore = result.stores.map((store) => {
            return store.name;
          });
          cloneProductState.stores = previousStore;
          cloneProductState.features = result.features;
          cloneProductState.description = result.description;
          cloneProductState.details = result.details;
          setPreviewImages(result.image);
          setProductState(cloneProductState);
          let parsedImages = JSON.parse(result.image[0]);
          let cloneSelectedFiles = [];
          let clonePreviewImages = [];
          parsedImages.forEach((image) => {
            cloneSelectedFiles.push('');
            clonePreviewImages.push(image);
          });
          setSelectedImageFiles(cloneSelectedFiles);
          let parsedVideos = JSON.parse(result.video[0]);
          let cloneSelectedVideoFiles = [];
          let clonePreviewVideos = [];
          parsedVideos.forEach((video) => {
            cloneSelectedVideoFiles.push('');
            clonePreviewVideos.push(video);
          });
          setSelectedVideoFiles(cloneSelectedVideoFiles);
          setPreviewVideos(clonePreviewVideos);
        }
      })
      .catch((err) => {});
  };

  if (productState.details.make && isEdit) {
    const make = brands.find((brand) => {
      return brand.name == productState.details.make;
    });
    if (make && loadModel) {
      get(`/cars/models?make_id=${make.make_id}`, config)
        .then((res) => {
          setModels(res?.data?.result);
          if (res.data) {
            setLoadModel(false);
          }
        })
        .catch((err) => {});
    }
  }

  useEffect(() => {
    getBrand();
  }, [edit]);

  return (
    <div style={{ backgroundColor: 'white', padding: 50 }}>
      <Grid container spacing={3} style={{ margin: 10 }}>
        <Grid item xs={12}>
          <Button
            variant='outlined'
            color='primary'
            onClick={() => history.push('services')}
          >
            Go Back
          </Button>
        </Grid>
        <Grid item xs={12}>
          <h1> {isEdit ? 'Edit' : isView ? 'View' : 'Create'} Service</h1>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={3}>
          <Typography variant='body2' style={{ paddingBottom: 16 }}>
            Upload Product Images
          </Typography>
          <input
            style={{ display: 'none' }}
            type='file'
            multiple
            accept='image/*'
            onChange={(e) => selectFiles(e, 'images')}
            id='product-image-upload'
          />
          <div>
            <Button
              disabled={isView}
              variant='outlined'
              onClick={() =>
                document.getElementById('product-image-upload').click()
              }
            >
              Upload Images
            </Button>
          </div>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={3}>
          <Typography variant='body2' style={{ paddingBottom: 16 }}>
            Upload Product Video
          </Typography>
          <input
            style={{ display: 'none' }}
            type='file'
            accept='video/*'
            onChange={(e) => selectFiles(e, 'videos')}
            id='product-video-upload'
          />
          <div>
            <Button
              variant='outlined'
              onClick={() =>
                document.getElementById('product-video-upload').click()
              }
              disabled={isView}
            >
              Upload Video
            </Button>
          </div>
        </Grid>
      </Grid>
      <Grid container spacing={3} style={{ margin: 10 }}>
        {previewImages?.map((img, i) => {
          return (
            <Grid item xs={12} sm={12} md={6} lg={3} key={i}>
              <div style={{ position: 'relative' }}>
                <img
                  style={{
                    height: '144px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    width: '200px',
                  }}
                  src={img}
                  alt={'image-' + i}
                  key={i}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    if (!isView) {
                      handleClose(i, 'images');
                    }
                  }}
                >
                  <CloseIcon />
                </div>
              </div>
            </Grid>
          );
        })}
        {previewVideos?.map((video, i) => {
          return (
            <Grid item xs={12} sm={12} md={6} lg={3} key={i}>
              <div style={{ position: 'relative' }}>
                <video
                  style={{
                    height: '144px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    width: '200px',
                  }}
                  controls
                  src={video}
                  poster=''
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    if (!isView) {
                      handleClose(i, 'videos');
                    }
                  }}
                >
                  <CloseIcon />
                </div>
              </div>
            </Grid>
          );
        })}
      </Grid>
      <Grid container spacing={3} style={{ margin: 10 }}>
        <Grid item xs={12} sm={12} md={6} lg={3}>
          <p>Title</p>
          <Input
            disabled={isView}
            name='title'
            value={productState.title}
            onChange={(e) => handleChange(e, 'title')}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={3}>
          <p>Subcategory</p>
          <Select
            disabled={isView}
            style={{ width: '100%' }}
            rules={[{ required: true, message: 'Required' }]}
            optionLabelProp='label'
            value={productState.subcategory}
            onChange={(value) => handleSelectChange(value, 'subcategory')}
          >
            {allSubCategories.map((subCategory, index) => {
              return (
                <Option
                  value={subCategory._id}
                  label={subCategory.title}
                  key={index}
                >
                  <div>
                    <span>{subCategory.title}</span>
                  </div>
                </Option>
              );
            })}
          </Select>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={3}>
          <p>Product Id</p>
          <Input
            disabled={isView}
            name='p_id'
            value={productState.p_id}
            onChange={(e) => handleChange(e, 'p_id')}
          />
        </Grid>

        <Grid item xs={12} sm={12} md={6} lg={3}>
          <p>Brand</p>
          <Select
            disabled={isView}
            style={{ width: '100%' }}
            rules={[{ required: true, message: 'Required' }]}
            // defaultValue={productState.details.make}
            value={productState.details.make}
            optionLabelProp='label'
            onChange={handleBrandChange}
          >
            {brands?.map((brand) => {
              return (
                <Option value={brand?.name} label={brand?.name}>
                  <div>
                    <span>{brand?.name}</span>
                  </div>
                </Option>
              );
            })}
          </Select>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={3}>
          <p>New/Used</p>
          <Select
            disabled={isView}
            style={{ width: '100%' }}
            rules={[{ required: true, message: 'Required' }]}
            optionLabelProp='label'
            value={productState.details.newOrUsed}
            onChange={(value) => detailsChange(value, 'newOrUsed')}
          >
            <Option value={'New'} label={'New'}>
              <div>
                <span>{'New'}</span>
              </div>
            </Option>
            <Option value={'Used'} label={'Used'}>
              <div>
                <span>{'Used'}</span>
              </div>
            </Option>
          </Select>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={3}>
          <p>Model</p>
          <Select
            disabled={isView}
            style={{ width: '100%' }}
            rules={[{ required: true, message: 'Required' }]}
            optionLabelProp='label'
            value={productState.details.model}
            onChange={handleModelChange}
          >
            {models?.map((model) => {
              return (
                <Option value={model?.name} label={model?.name}>
                  <div>
                    <span>{model?.name}</span>
                  </div>
                </Option>
              );
            })}
          </Select>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={3}>
          <p>Model Year</p>
          <Input
            disabled={isView}
            value={productState.details.year}
            onChange={(e) => detailsChange(e.target.value, 'year')}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={3}>
          <p>Price</p>
          <Input
            disabled={isView}
            value={productState.price}
            onChange={(e) => handleChange(e, 'price')}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={3}>
          <p>Body Type</p>
          <Input
            disabled={isView}
            value={productState.details.bodyType}
            onChange={(e) => detailsChange(e.target.value, 'bodyType')}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={3}>
          <p>Transmission Type</p>
          <Input
            disabled={isView}
            value={productState.details.transmissionType}
            onChange={(e) => detailsChange(e.target.value, 'transmissionType')}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={3}>
          <p>Fuel Range</p>
          <Input
            disabled={isView}
            value={productState.details.fuelRange}
            onChange={(e) => detailsChange(e.target.value, 'fuelRange')}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={3}>
          <p>Kilometers</p>
          <Input
            disabled={isView}
            value={productState.details.kilometers}
            onChange={(e) => detailsChange(e.target.value, 'kilometers')}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={3}>
          <p>Color</p>
          <Input
            disabled={isView}
            value={productState.details.color}
            onChange={(e) => detailsChange(e.target.value, 'color')}
          />
        </Grid>
        {productState.details.newOrUsed === 'Used' && (
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <p>Usage</p>
            <Input
              disabled={isView}
              value={productState.details.usage}
              onChange={(e) => detailsChange(e.target.value, 'usage')}
            />
          </Grid>
        )}
        <Grid item xs={12} sm={12} md={6} lg={3}>
          <p>Type</p>
          <Select
            disabled={isView}
            style={{ width: '100%' }}
            rules={[{ required: true, message: 'Required' }]}
            optionLabelProp='label'
            value={productState.details.type}
            onChange={(value) => detailsChange(value, 'type')}
          >
            <Option value={'Brand New'} label={'Brand New'}>
              <div>
                <span>{'Brand New'}</span>
              </div>
            </Option>
            <Option value={'Slightly Used'} label={'Slightly Used'}>
              <div>
                <span>{'Slightly Used'}</span>
              </div>
            </Option>
            <Option value={'Heavy Used'} label={'Heavy Used'}>
              <div>
                <span>{'Heavy Used'}</span>
              </div>
            </Option>
          </Select>
        </Grid>

        {/* <Grid item xs={12} sm={12} md={6} lg={3}>
          <p>Seller Type</p>
          <Select
            disabled={isView}
            style={{ width: '100%' }}
            rules={[{ required: true, message: 'Required' }]}
            optionLabelProp='label'
            value={productState.details.sellerType}
            onChange={(value) => detailsChange(value, 'sellerType')}
          >
            <Option value={'Owner'} label={'Owner'}>
              <div>
                <span>{'Owner'}</span>
              </div>
            </Option>
            <Option value={'Reseller'} label={'Reseller'}>
              <div>
                <span>{'Reseller'}</span>
              </div>
            </Option>
            <Option value={'Distributor'} label={'Distributor'}>
              <div>
                <span>{'Distributor'}</span>
              </div>
            </Option>
          </Select>
        </Grid> */}

        {productState.details.newOrUsed === 'Used' && (
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <p>Badges</p>
            <Select
              disabled={isView}
              mode='multiple'
              style={{ width: '100%' }}
              placeholder='Badges'
              rules={[{ required: true, message: 'Required' }]}
              optionLabelProp='label'
              value={productState.details.badges}
              onChange={(value) => detailsChange(value, 'badges')}
            >
              <Option value={'First Owner'} label={'First Owner'}>
                <div>
                  <span>{'First Owner'}</span>
                </div>
              </Option>
              <Option value={'In Warranty'} label={'In Warranty'}>
                <div>
                  <span>{'In Warranty'}</span>
                </div>
              </Option>
              <Option value={'No Accident'} label={'No Accident'}>
                <div>
                  <span>{'No Accident'}</span>
                </div>
              </Option>
              <Option value={'Service History'} label={'Service History'}>
                <div>
                  <span>{'Service History'}</span>
                </div>
              </Option>
            </Select>
          </Grid>
        )}

        <Grid item xs={12} sm={12} md={6} lg={3}>
          <p>Select Stores</p>
          <Select
            disabled={isView}
            mode='multiple'
            name='stores'
            style={{ width: '100%' }}
            placeholder='Select stores'
            rules={[{ required: true, message: 'Required' }]}
            optionLabelProp='label'
            value={productState.stores}
            onChange={(value) => handleSelectChange(value, 'stores')}
          >
            {allStores?.map((category, index) => {
              return (
                <Option value={category.name} label={category.name} key={index}>
                  <div>
                    <span aria-label={category.name}>
                      {category.name}, {category.state}
                    </span>
                  </div>
                </Option>
              );
            })}
          </Select>
        </Grid>
      </Grid>
      <Grid container spacing={3} style={{ margin: 10 }}>
        {productState.features.map((feature, index) => {
          return (
            <Grid item xs={12} sm={12} md={6} lg={3} key={index}>
              <p>Key Feature {index + 1}</p>
              <Input
                disabled={isView}
                value={feature}
                onChange={(e) => handleFeatureChange(e.target.value, index)}
              />
            </Grid>
          );
        })}
      </Grid>
      <Grid container spacing={3} style={{ margin: 10 }}>
        <Grid item xs={12} sm={12} md={6} lg={5}>
          <p>Description</p>
          <TextArea
            disabled={isView}
            name='description'
            value={productState.description}
            onChange={(e) => handleChange(e, 'description')}
          />
        </Grid>
      </Grid>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {!isView && (
          <Button variant='outlined' onClick={onSubmit} disabled={loading}>
            {loading ? (
              <div className='submit-loader'>
                <Spin size='small' />
              </div>
            ) : isEdit ? (
              'Save'
            ) : (
              'Submit'
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default BikeCarForm;
