import './styles.scss';

import {
  AddIcon,
  CameraIcon,
  DeletIcon,
  EditIcon,
  LocIcon,
  MailIcon,
  PhoneIcon,
  StarsIcon,
} from '../../Icons';
import React, { useEffect, useState, useRef } from 'react';
import {
  deleteStore,
  getProductCategory,
  getUserProfileData,
  getUserStores,
  uploadUserPictures,
} from '../../redux/actions/profile';
import { useDispatch, useSelector } from 'react-redux';

import AddNewService from '../../Components/AddNewService/index';
import AddRecommendation from '../../Components/AddRecommendation/index';
import AddShowRoom from '../../Components/AddShowRoom/index';
import Dialog from '@mui/material/Dialog';
import EditAboutUs from '../../Components/EditAboutUs/index';
import EditContactInfo from '../../Components/EditContactInfo/index';
import EditShowRoom from '../../Components/EditShowRoom/index';
import ExperienceLevel from '../../Components/ExperienceLevel/index';
import Grid from '@mui/material/Grid';
import LoaderRounder from '../../Components/LoaderRound/LoaderRounder';
import dummyProfile from '../../assets/profile.png';
import { useHistory } from 'react-router';
import { Button, Tooltip } from 'antd';
import WhatsAppIconSmall from '../../Icons/WhatsAppIconSmall';
import { actionTypes } from '../../redux/types';
import { Password } from '@mui/icons-material';



const Profile = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const fileInput = useRef(null);

  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [open4, setOpen4] = useState(false);
  const [open5, setOpen5] = useState(false);
  const [coverImage, setCoverImage] = useState(null);
  const [storeId, setStoreId] = useState();
  const [selectedService, setSelectedService] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  const serviceCategories = useSelector(
    (state) => state?.profile?.serviceCategories
  );
  const user = useSelector((state) => state?.profile?.user);
  const stores = useSelector((state) => state?.profile?.stores);

  const handleClose = () => {
    setOpen(false);
    setOpen1(false);
    setOpen2(false);
    setOpen3(false);
    setOpen4(false);
    setOpen5(false);
  };

  function handleChange(value) {
    setSelectedService(value);
    const ids = [];
    serviceCategories.forEach((category) => {
      if (value.includes(category.title)) {
        ids.push(category._id);
      }
    });
    setSelectedIds(ids);
  }

  useEffect(() => {
    dispatch(getProductCategory(setLoading));
    dispatch(getUserProfileData(setLoading));
    dispatch(getUserStores(setLoading));
  }, []);

  useEffect(() => {
    setUserData(user);
    let arr = user?.provider?.categories.map((v, k) => {
      return v.title;
    });
    setSelectedService(arr);
  }, [user]);
  const cover = coverImage ? coverImage : userData?.coverImage;
  const profile = profileImg
    ? profileImg
    : userData?.provider?.providerType === 'individual'
    ? userData?.image
    : userData?.provider?.logo;

  const changingProfileImg = () => {
    fileInput.current.click();
  };

  return (
    <div>
      <div className='profile'>
        <div className='wrap flex flex-col'>
          {loading ? (
            <LoaderRounder />
          ) : (
            <>
              <div
                className='user-imges flex'
                style={{
                  backgroundImage: `url(${cover})`,
                }}
              >
                <div className='user-profile flex' onClick={changingProfileImg}>
                  <img
                    src={profile ? profile : dummyProfile}
                    className='profile_user'
                    alt=''
                  />
                  <div className='camera-icon flex'>
                    <CameraIcon />
                  </div>
                </div>
                <input
                  type='file'
                  ref={fileInput}
                  id='profile-image-upload'
                  hidden
                  accept='image/*'
                  onChange={async (e) => {
                    dispatch(
                      uploadUserPictures(
                        e.target.files[0],
                        'image',
                        undefined,
                        undefined,
                        setLoading
                      )
                    );
                    setProfileImg(URL.createObjectURL(e.target.files[0]));
                    dispatch({
                      type: actionTypes?.SET_USER_DATA,
                      payload: {
                        ...user,
                        image: URL.createObjectURL(e.target.files[0]),
                      },
                    });
                  }}
                />
                <div className='user-banner flex'>
                  <div className='camera-icon-e flex aic jc'>
                    <EditIcon />
                    <input
                      className='cleanbtn select-dp flex aic jc'
                      type='file'
                      accept='image/*'
                      onChange={(e) => {
                        dispatch(
                          uploadUserPictures(
                            e.target.files[0],
                            'coverImage',
                            undefined,
                            undefined,
                            setLoading
                          )
                        );
                        setCoverImage(URL.createObjectURL(e.target.files[0]));
                        
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className='user-info flex'>
                <Grid container spacing={2}>
                  <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                    <div
                      style={{ marginTop: 20 }}
                      className='user-name s24 font b5'
                    >
                      {userData
                        ? userData.firstName + ' ' + userData.lastName
                        : '-'}
                    </div>
                  </Grid>
                  <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                    <div className='contact-me flex flex-col'>
                      <div className='lbl s20 font b5'>Contact Information</div>
                      <div className='c-item flex aic'>
                        <div className='ico'>
                          <MailIcon />
                        </div>
                        <div className='tag s12 font'>
                          {userData ? userData.email : '-'}
                        </div>
                      </div>
                      <div className='c-item flex aic'>
                        <div className='ico'>
                          <PhoneIcon />
                        </div>
                        <div className='tag s12 font'>
                          {userData ? userData.phone : '-'}
                        </div>
                      </div>
                      <div className='c-item flex aic'>
                        <div className='ico'>
                          <WhatsAppIconSmall />
                        </div>
                        <div className='tag s12 font'>
                          {userData?.phone ? (
                            <snap> {userData.phone}</snap>
                          ) : (
                            <Tooltip title="Click here to add What's App">
                              <Button
                                type='text'
                                danger
                                onClick={() => {
                                  setOpen(true);
                                }}
                              >
                                Please Add what's app for chat
                              </Button>
                            </Tooltip>
                          )}
                        </div>
                      </div>

                      <div className='c-item flex aic'>
                        <div className='ico'>
                          <Password />
                        </div>
                        <div className='tag s12 font'>
                           <div
                              className='update-password'
                              onClick={() => {
                                dispatch({
                                  type: actionTypes.SIDEBAR_DISAPPEAR,
                                  payload: true,
                                });
                                history.push('/updatePassword');
                              }}
                            >
                              <Tooltip title='Click here to update password'>
                                <span>Update Password</span>
                              </Tooltip>
                            </div>
                          </div>
                        </div>

                    </div>
                  </Grid>
                  <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                    {userData?.provider?.providerType === 'individual' ? (
                      <>
                        <div className='doc-list flex flex-col'>
                          <div className='flex flex-row'>
                            <div className='lbl s20 font b5'>My Documents</div>
                            <div
                              className='edit-documents-icon ico flex aic jc'
                              style={{ marginLeft: '40%' }}
                              onClick={(e) => {
                                setOpen(true);
                              }}
                            >
                              <EditIcon />
                            </div>
                          </div>
                          <div
                            className='flex flex-col'
                            style={{ paddingTop: '15px' }}
                          >
                            <div className='flex flex-row'>
                              <div className='flex flex-col'>
                                <div className='doc-tag s16 font b5'>
                                  Back Image Of Emirated ID
                                </div>
                                <div>
                                  {userData?.provider?.emiratesID?.backImage ===
                                  '' ? (
                                    <div className='not-provided not-provided doc-navil s14 font b4'>
                                      NOT PROVIDED YET..
                                    </div>
                                  ) : (
                                    <img
                                      src={
                                        userData?.provider?.emiratesID
                                          ?.backImage
                                      }
                                      alt=''
                                      height='90px'
                                    />
                                  )}
                                </div>
                              </div>

                              <div
                                className='flex flex-col'
                                style={{ paddingLeft: '40px' }}
                              >
                                <div className='doc-tag s16 font b5'>
                                  Front Image Of Emirated ID
                                </div>
                                <div>
                                  {userData?.provider?.emiratesID
                                    ?.frontImage === '' ? (
                                    <div className='not-provided doc-navil s14 font b4'>
                                      NOT PROVIDED YET..
                                    </div>
                                  ) : (
                                    <img
                                      src={
                                        userData?.provider?.emiratesID
                                          ?.frontImage
                                      }
                                      alt=''
                                      height='90px'
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className='doc-list flex flex-col'>
                          <div className='flex flex-row'>
                            <div className='lbl s20 font b5'>My Documents</div>
                            <div
                              className='edit-documents-icon ico flex aic jc'
                              style={{ marginLeft: '40%' }}
                              onClick={(e) => {
                                setOpen(true);
                              }}
                            >
                              <EditIcon />
                            </div>
                          </div>
                          <div
                            className='flex flex-col'
                            style={{ paddingTop: '15px' }}
                          >
                            <div className='flex flex-row'>
                              <div className='flex flex-col'>
                                <div className='doc-tag s16 font b5'>
                                  Brochure File
                                </div>
                                <div>
                                  {userData?.provider?.brochure === '' ? (
                                    <div className='not-provided doc-navil s14 font b4'>
                                      NOT PROVIDED YET..
                                    </div>
                                  ) : (
                                    <img
                                      src={userData?.provider?.brochure}
                                      alt=''
                                      height='100px'
                                      width='100px'
                                    />
                                  )}
                                </div>
                              </div>

                              <div
                                className='flex flex-col'
                                style={{ paddingLeft: '20%' }}
                              >
                                <div className='doc-tag s16 font b5'>
                                  Logo File
                                </div>
                                <div>
                                  {userData?.provider?.logo === '' ? (
                                    <div className='not-provided doc-navil s14 font b4'>
                                      NOT PROVIDED YET..
                                    </div>
                                  ) : (
                                    <img
                                      src={userData?.provider?.logo}
                                      alt=''
                                      height='100px'
                                      width='100px'
                                    />
                                  )}
                                </div>
                              </div>
                            </div>

                            <div
                              className='flex flex-row'
                              style={{ paddingTop: '30px' }}
                            >
                              <div className='flex flex-row'>
                                <div className='flex flex-col'>
                                  <div className='doc-tag s16 font b5'>
                                    Company Licence File
                                  </div>
                                  <div>
                                    {userData?.provider?.tradeLicence?.image ===
                                    '' ? (
                                      <div className='not-provided doc-navil s14 font b4'>
                                        NOT PROVIDED YET..
                                      </div>
                                    ) : (
                                      <img
                                        src={'/images/document.png'}
                                        alt=''
                                        height='100px'
                                        width='100px'
                                      />
                                    )}
                                  </div>
                                </div>

                                <div
                                  className='flex flex-col'
                                  style={{ paddingLeft: '10%' }}
                                >
                                  <div className='doc-tag s16 font b5'>
                                    TRN Certificate File
                                  </div>
                                  <div>
                                    {userData?.provider?.trnCertificate
                                      ?.image === '' ? (
                                      <div className='not-provided doc-navil s14 font b4'>
                                        NOT PROVIDED YET..
                                      </div>
                                    ) : (
                                      <div className='img-preview rel'>
                                        <img
                                          src={'/images/document.png'}
                                          alt=''
                                          height='100px'
                                          width='100px'
                                        />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </Grid>
                </Grid>
              </div>

              {/* <div className='show-room-sec flex flex-col'>
                <div className='showRoom-blcok update-password flex flex-col'>
                  <div className='show-room-header flex aic'>
                    <div className='left-heading s24 b5 font'></div>
                    <div
                      className='right-icon'
                      onClick={() => {
                        dispatch({
                          type: actionTypes.SIDEBAR_DISAPPEAR,
                          payload: true,
                        });
                        history.push('/updatePassword');
                      }}
                    >
                      <Tooltip title='Click here to update password'>
                        <span>Update Password</span>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div> */}

              <div className='about-us-sec flex flex-col'>
                <div className='about-blcok flex flex-col'>
                  <div className='about-us-header flex aic'>
                    <div className='left-heading s24 b5 font'>About Us</div>
                    <div
                      className='right-icon'
                      onClick={(e) => {
                        setOpen1(true);
                      }}
                    >
                      <EditIcon />
                    </div>
                  </div>
                  <div className='desc s14 font'>
                    {userData ? userData.about : '-'}
                  </div>
                  {/* <div className="about-footer flex aic jc">
                    <div className="btn s14 font">See All Details</div>
                  </div> */}
                </div>
              </div>
              <ExperienceLevel
                userData={userData}
                setLoading={setLoading}
                history={history}
              />

              <div className='show-room-sec flex flex-col'>
                <div className='showRoom-blcok flex flex-col'>
                  <div className='show-room-header flex aic'>
                    <div className='left-heading s24 b5 font'>
                      Add Workshops Here
                    </div>
                    <div
                      className='right-icon'
                      onClick={() => {
                        setOpen2(true);
                      }}
                    >
                      <AddIcon />
                    </div>
                  </div>
                  {stores ? (
                    stores.map((item, index) => (
                      <div key={index} className='show-room-meta flex aic aia'>
                        <div className='left flex flex-col_small'>
                          <div className='pic'>
                            <img src={`${item.images[0]}`} className='img' />
                          </div>
                          <div className='meta flex flex-col'>
                            <div className='tag s16 font b5'>
                              {stores ? item.name : '-'}
                            </div>
                            <div className='desc font'>
                              {stores ? item.description : '-'}
                            </div>
                            <div className='loc flex aic'>
                              <LocIcon />
                              <span className='loc-des'>
                                {stores
                                  ? item.address +
                                    ', ' +
                                    item.city +
                                    ', ' +
                                    item.country +
                                    ''
                                  : '-'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className='right flex aic'>
                          <div
                            className='del-icon flex'
                            onClick={(e) => {
                              dispatch(deleteStore(item._id, setLoading));
                            }}
                          >
                            <DeletIcon />
                          </div>
                          <div
                            className='edit-ico'
                            onClick={() => {
                              setStoreId(item._id);
                              setOpen4(true);
                            }}
                          >
                            <EditIcon />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <></>
                  )}
                </div>
              </div>

              <div className='service-sec flex flex-col'>
                <div className='service-blcok flex flex-col'>
                  <div className='service-header2 flex aic'>
                    <div className='left-heading s24 b5 font'>
                      Services Categories
                    </div>
                    <div className='right-icon flex aic'>
                      <div className='new-service flex aic '></div>
                      {/* <div
                        className="add-icon"
                        style={{ cursor: "pointer", marginRight: "20px" }}
                        onClick={() => {
                          setOpen3(true);
                        }}
                      >
                        <AddIcon />
                      </div>
                      <div
                        className="add-icon"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setOpen3(true);
                        }}
                      >
                        <EditIcon />
                      </div> */}
                    </div>
                  </div>
                  <div
                    className='service-items flex'
                    style={{ overflow: 'scroll' }}
                  >
                    {userData?.provider ? (
                      userData?.provider.categories.map((item, i) => (
                        <button className='item cleanbtn flex aic' key={i}>
                          <div className='btn-lbl cfff font s14'>
                            {userData?.provider.categories[i].title}
                          </div>
                        </button>
                      ))
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>

              {/* <div className="recommend-sec flex flex-col">
                <div className="recommend-blcok flex flex-col">
                  <div className="recommend-header flex aic">
                    <div className="left-heading s24 b5 font">
                      Recommendations
                    </div>
                    <div className="right-icon flex aic">
                      <div className="recommend flex aic ">
                        <div className="lbl font">Ask for recommendation</div>
                      </div>
                      <div
                        className="edit-icon"
                        onClick={() => {
                          setOpen5(true);
                        }}
                      >
                        <AddIcon />
                      </div>
                    </div>
                  </div>
                  <div className="recommend-meta flex flex-col">
                    <div className="item flex">
                      <div className="meta-left flex flex-col">
                        <div className="about flex aic">
                          <img
                            src="/images/pexels-photo.png"
                            className="user-img"
                          />
                          <div className="about-me flex flex-col">
                            <div className="name s16 font b5">Johan smith</div>
                            <div className="time s14 font">
                              5 Lectures, 45 min
                            </div>
                          </div>
                        </div>
                        <div className="desc font">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. In in lorem congue, euismod urna vitae,
                          porttitor mi. Aliquam consectetur eu turpis ac congue.
                        </div>
                      </div>
                      <div className="meta-right flex">
                        <div className="flex flex-col aic jc">
                          <div className="stars-icon">
                            <StarsIcon />
                          </div>
                          <div className="day font b5">Yesterday</div>
                        </div>
                        <div className="del-icon pointer">
                          <DeletIcon />
                        </div>
                      </div>
                    </div>
                    <div className="item flex">
                      <div className="meta-left flex flex-col">
                        <div className="about flex aic">
                          <img
                            src="/images/pexels-photo.png"
                            className="user-img"
                          />
                          <div className="about-me flex flex-col">
                            <div className="name s16 font b5">Johan smith</div>
                            <div className="time s14 font">
                              5 Lectures, 45 min
                            </div>
                          </div>
                        </div>
                        <div className="desc font">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. In in lorem congue, euismod urna vitae,
                          porttitor mi. Aliquam consectetur eu turpis ac congue.
                        </div>
                      </div>
                      <div className="meta-right flex">
                        <div className="flex flex-col aic jc">
                          <div className="stars-icon">
                            <StarsIcon />
                          </div>
                          <div className="day font b5">30 dec 2021</div>
                        </div>
                        <div className="del-icon pointer">
                          <DeletIcon />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
            </>
          )}
        </div>
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <div className='dialog-box'>
          <EditContactInfo
            userData={userData}
            setLoading={setLoading}
            setOpen={setOpen}
          />
        </div>
      </Dialog>

      <Dialog
        open={open1}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <div className='dialog-box'>
          <EditAboutUs
            about={userData?.about}
            setOpen1={setOpen1}
            setLoading={setLoading}
          />
        </div>
      </Dialog>

      <Dialog
        open={open2}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <div className='dialog-box'>
          <AddShowRoom
            userData={userData}
            setLoading={setLoading}
            setOpen2={setOpen2}
            serviceCategories={serviceCategories}
          />
        </div>
      </Dialog>

      <Dialog
        open={open4}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <div className='dialog-box'>
          <EditShowRoom
            history={history}
            userData={userData}
            setOpen4={setOpen4}
            setLoading={setLoading}
            storeId={storeId}
            serviceCategories={serviceCategories}
          />
        </div>
      </Dialog>

      <Dialog
        open={open3}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <div className='dialog-box'>
          <AddNewService
            history={history}
            setLoading={setLoading}
            selectedIds={selectedIds}
            setOpen3={setOpen3}
            selectedService={selectedService}
            handleChange={handleChange}
            serviceCategories={serviceCategories}
          />
        </div>
      </Dialog>

      <Dialog
        open={open5}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <div className='dialog-box'>
          <AddRecommendation setOpen5={setOpen5} />
        </div>
      </Dialog>
    </div>
  );
};

export default Profile;
