import './styles.scss';

import {
  BellFilled,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CustomerServiceOutlined,
  DashboardOutlined,
  ExceptionOutlined,
  ExclamationCircleOutlined,
  FireOutlined,
  HistoryOutlined,
  MessageOutlined,
  NotificationOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  StarOutlined,
  UserOutlined,
  UserSwitchOutlined,
  WalletOutlined,
  LogoutOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Modal, Row, Col, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { makeStyles } from '@mui/styles';
import { io } from 'socket.io-client';

import Logo from '../../assets/autofix.png';
import { WhatsAppIcon } from '../../Icons';
import dummyProfile from '../../assets/profile.png';
import { get, patch } from '../../services/RestService';
import { logout } from '../../helpers';
import {
  getUserProfileData,
  setUnreadChats,
} from '../../redux/actions/profile';
import { countries } from '../../constants';

const useStyles = makeStyles((theme) => ({
  welcomeFont: {
    color: '#92E3A9 !important',
    padding: '6rem 0rem 3rem 0rem',
    fontSize: '2.3rem !important',
    fontWeight: '600',
  },
  messagingStyle: {
    color: 'white',
    cursor: 'pointer',
    fontSize: 30,
    marginRight: 20,
    marginBottom: 5,
  },
}));
const { Header, Content, Sider } = Layout;
const config = {
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('token'),
  },
};

const SiderLayout = ({ children }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [collapsed, setCollapse] = useState(false);
  const onCollapse = (collapsed) => {
    setCollapse(collapsed);
  };
  const history = useHistory();
  const isMobileScreen = useMediaQuery({ query: '(max-width: 680px)' });
  const userData = useSelector((state) => state?.profile?.user);
  const unReadChats = useSelector((state) => state?.profile?.unReadChats);

  const [showNoti, setShowNoti] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [countryCode, setCountryCode] = useState('');
  const [viewModal, setViewModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState();
  const [socket, setSocket] = useState();
  const [rooms, setRooms] = useState([]);
  const [searchMenuValue, setSearchMenuValue] = useState('');
  const [type, setType] = useState('');
  const isSidebarDisappeared = useSelector(
    (state) => state?.others?.isSidebarDisappear
  );

  const getData = async () => {
    await get(`/notifications/`, config)
      .then((res) => {
        setNotifications(
          res.result.filter((notification) => notification.status !== 'read')
        );
      })
      .catch(() => {});
  };

  const readNotification = (id) => {
    const data = {
      status: 'read',
    };
    patch(`/notifications/${id}`, data, config)
      .then(() => getData())
      .catch(() => {});
  };

  const getRooms = () => {
    get(`/chat/myRooms`, config)
      .then((res) => {
        setRooms(res.result);
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (userData) {
      let currentCountryData = countries.find(
        (data) => data.value == userData.country[0]
      );
      setCountryCode(currentCountryData.code);
    }
  }, [userData]);

  useEffect(() => {
    let unRead = 0;
    rooms.forEach((room) => {
      if (
        room?.chat[room.chat?.length - 1]?.status === 'unread' &&
        room?.chat[room.chat?.length - 1]?.from?.email !== userData?.email
      ) {
        unRead++;
      }
    });
    dispatch(setUnreadChats(unRead));
  }, [rooms, userData, dispatch]);

  useEffect(() => {
    const socket = io('https://api.otobucks.com', {
      transports: ['websocket'],
    });
    getRooms();
    setSocket(socket);
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('message', (res) => {
        getRooms();
      });
    }
  }, [socket]);

  useEffect(() => {
    socket && socket.on('connect', () => {});

    return () => {
      socket && socket.emit('disconnect');
    };
  }, []);

  useEffect(() => {
    setInterval(() => getData(), 5000);
    dispatch(getUserProfileData());
    setType(JSON.parse(localStorage.getItem('user')).type);
  }, []);
  useEffect(() => {
    if (isMobileScreen) {
      setCollapse(true);
    }
  }, [isMobileScreen]);

  const hideNotification = () => setShowNoti(false);
  const image =
    userData?.provider?.providerType === 'individual'
      ? userData?.image
      : userData?.provider?.logo;



  return (
    <div>
      <Layout style={{ minHeight: '100vh' }}>
        {showNoti && (
          <div
            onClick={hideNotification}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              zIndex: 1,
            }}
          />
        )}
        {!isSidebarDisappeared && (
          <Sider
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
            
          }}
          className='sider-menu'
          collapsible
          collapsed={collapsed}
          onCollapse={onCollapse}
        >
          <div className='logo'>
            <center
              style={{
                backgroundColor: 'white',
              }}
            >
              <img
                src={Logo}
                style={{
                  padding: 12,
                  width: collapsed ? 80 : 150,
                }}
                alt='logo'
              />
            </center>
          </div>
          <div>
            <input
              type='text'
              className='menu-items-search'
              placeholder='Search...'
              value={searchMenuValue}
              onChange={(event) =>
                setSearchMenuValue(event.target.value?.toLocaleLowerCase())
              }
            />
          </div>
          <Menu
            style={{ marginBottom: 20 }}
            theme='dark'
            defaultSelectedKeys={[history.location.pathname]}
            mode='vertical'
          >
            {'dashboard'.includes(searchMenuValue) && (
              <Menu.Item
                key='/home'
                icon={<DashboardOutlined />}
                onClick={() => history.push('/home')}
              >
                Dashboard
              </Menu.Item>
            )}
            {'profile'.includes(searchMenuValue) && (
              <Menu.Item
                key='/profile'
                icon={<UserOutlined />}
                onClick={() => history.push('/profile')}
              >
                Profile
              </Menu.Item>
            )}
            {type == 'provider' && 'staff'.includes(searchMenuValue) && (
              <Menu.Item
                key='/staff'
                icon={<UsergroupAddOutlined />}
                onClick={() => history.push('/staff')}
              >
                Staff
              </Menu.Item>
            )}
            {'services'.includes(searchMenuValue) && (
              <Menu.Item
                key='/services'
                icon={<ShoppingCartOutlined />}
                onClick={() => history.push('/services')}
              >
                Services
              </Menu.Item>
            )}
            {'service bookings'.includes(searchMenuValue) && (
              <Menu.Item
                key='/serviceBookings'
                icon={<UserOutlined />}
                onClick={() => history.push('/serviceBookings')}
              >
                Service Bookings
              </Menu.Item>
            )}
            {'disputes'.includes(searchMenuValue) && (
              <Menu.Item
                key='/disputes'
                icon={<CloseCircleOutlined />}
                onClick={() => history.push('/disputes')}
              >
                Disputes
              </Menu.Item>
            )}
            {'estimations settings'.includes(searchMenuValue) && (
              <Menu.Item
                key='/EstimationSettings'
                icon={<UserOutlined />}
                onClick={() => history.push('/EstimationSettings')}
              >
                Estimation Settings
              </Menu.Item>
            )}
            {'purchase products'.includes(searchMenuValue) && (
              <Menu.Item
                key='/purchase-product'
                icon={<ShoppingOutlined />}
                onClick={() => history.push('/purchase-product')}
              >
                Purchase Product
              </Menu.Item>
            )}
            {'orders'.includes(searchMenuValue) && (
              <Menu.Item
                key='/my-orders'
                icon={<ShoppingOutlined />}
                onClick={() => history.push('/my-orders')}
              >
                My Orders
              </Menu.Item>
            )}
            {'invite friends'.includes(searchMenuValue) && (
              <Menu.Item
                key='/invite-friends'
                icon={<UserSwitchOutlined />}
                onClick={() => history.push('/invite-friends')}
              >
                Invite Friends
              </Menu.Item>
            )}
            {'add cards'.includes(searchMenuValue) && (
              <Menu.Item
                key='/my-wallet'
                icon={<WalletOutlined />}
                onClick={() => history.push('/my-wallet')}
              >
                Add Cards
              </Menu.Item>
            )}
            
            {'rating'.includes(searchMenuValue) && (
              <Menu.Item
                key='/rating'
                icon={<StarOutlined />}
                onClick={() => history.push('/rating')}
              >
                Rating
              </Menu.Item>
            )}
            {'promotions'.includes(searchMenuValue) && (
              <Menu.Item
                key='/offers'
                icon={<FireOutlined />}
                onClick={() => history.push('/offers')}
              >
                Promotions
              </Menu.Item>
            )}
            {'promotionsbookings'.includes(searchMenuValue) && (
              <Menu.Item
                key='/offers-bookings'
                icon={<FireOutlined />}
                onClick={() => history.push('/offers-bookings')}
              >
                Promotions Bookings
              </Menu.Item>
            )}
            {'notifications'.includes(searchMenuValue) && (
              <Menu.Item
                key='/notifications'
                icon={<NotificationOutlined />}
                onClick={() => history.push('/notifications')}
              >
                Notifications
              </Menu.Item>
            )}
            {'transaction history'.includes(searchMenuValue) && (
              <Menu.Item
                key='/transaction-history'
                icon={<HistoryOutlined />}
                onClick={() => history.push('/transaction-history')}
              >
                Transaction History
              </Menu.Item>
            )}
            
            {'privacy policy'.includes(searchMenuValue) && (
              <Menu.Item
                key='/privacy-policy'
                icon={<ExclamationCircleOutlined />}
                onClick={() => history.push('/privacy-policy')}
              >
                Privacy Policy
              </Menu.Item>
            )}
            {'terms and conditions'.includes(searchMenuValue) && (
              <Menu.Item
                key='/terms'
                icon={<ExceptionOutlined />}
                onClick={() => history.push('/terms')}
              >
                Terms And Condition
              </Menu.Item>
            )}
            {'contsct us'.includes(searchMenuValue) && (
              <Menu.Item
                key='/contact'
                icon={<CustomerServiceOutlined />}
                onClick={() => history.push('/contact')}
              >
                Contact Us
              </Menu.Item>
            )}
            {'logout'.includes(searchMenuValue) && (
              <Menu.Item
                style={{ marginBottom: '50px' }}
                key='/logout'
                icon={<LogoutOutlined />}
                onClick={() => {
                  logout(history);
                }}
              >
                Logout
              </Menu.Item>
            )}
          </Menu>
        </Sider>
        )}
        <Layout
          style={{ marginLeft: isSidebarDisappeared ? 0 : collapsed ? 80 : 200 }}
          className='site-layout'
        >
          <Header className='site-layout-background' style={{ padding: 0 }}>
            <div className='topBar_box'>
              <div className='flex aic' id='_header_welcome_message'>
                <div className='img-block'>
                  <img
                    src={image ? image : dummyProfile}
                    className='user-img'
                    alt=''
                  />
                </div>
                <h1
                  className='user-name font'
                  style={{
                    color: 'white',
                    marginLeft: 10,
                    marginBottom: '0px',
                  }}
                >
                  Hello &nbsp;
                  {userData
                    ? userData.firstName + ' ' + userData.lastName + '!'
                    : '-'}
                </h1>
                <div
                  className='s14 b5 cfff'
                  style={{
                    color: 'white',
                    marginLeft: 10,
                    marginBottom: '0px',
                  }}
                >
                  welcome to Otobucks
                </div>
              </div>
              <div className='topBar_action'>
                <div
                  className='support flex aic'
                  id='_header_Facing_assue_heading_main'
                >
                  <div
                    className='support-tag s14 font b4 cfff'
                    id='_header_Facing_assue_heading'
                  >
                    Facing issues? Chat with support
                  </div>
                  <div
                    className='img flex aic jc'
                    onClick={() => {
                      window.open(
                        `//api.whatsapp.com/send?phone=971542457866`,
                        '_blank'
                      );
                    }}
                  >
                    <WhatsAppIcon />
                  </div>
                  <div
                    onClick={() => history.push('/chat')}
                    className='notification flex rel'
                  >
                    <MessageOutlined className='message-icon' />
                    {unReadChats > 0 && (
                      <div className='notifications-count-container'>
                        <div>{unReadChats > 99 ? '99+' : unReadChats}</div>
                      </div>
                    )}
                  </div>
                </div>
                <div
                  className='notification flex rel'
                  onClick={() => setShowNoti(!showNoti)}
                  style={{ cursor: 'pointer' }}
                >
                  <BellFilled
                    style={{
                      color: 'white',
                      fontSize: 30,
                    }}
                  />
                  {notifications.length > 0 && (
                    <div
                      className='notifications-count'
                      style={{
                        marginTop: '10px',
                        marginLeft: '20px',
                      }}
                    >
                      <div className='_add_to_cart_show'>
                        {notifications.length}
                      </div>
                    </div>
                  )}
                  <div
                    className={`notifications-menu flex flex-col abs ${
                      showNoti ? 'show' : ''
                    }`}
                  >
                    <div className='notification-heading flex aic jc s16 font b6'>
                      Notifications
                    </div>
                    {notifications.length > 0 ? (
                      <div className='notification-items flex flex-col font'>
                        {notifications.map((item, index) => (
                          <div
                            key={index}
                            className='item flex aic'
                            onClick={() => {
                              setViewModal(true);
                              readNotification(item?._id);
                              setSelectedNotification(item);
                            }}
                          >
                            <div className='lbl font'>{item.title}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ marginLeft: '10px' }}>
                        There are no unread notifications{' '}
                      </div>
                    )}
                  </div>
                </div>
                <img
                  src={`https://flagcdn.com/48x36/${countryCode.toLowerCase()}.png`}
                  alt='...'
                  width='40px'
                />
              </div>
            </div>
          </Header>
          <Content style={{ margin: '0 0px', background: '#f9f9f9' }}>
            {children}
          </Content>
        </Layout>
      </Layout>
      <Modal
        footer={false}
        title='View Notification'
        okText='Done'
        visible={viewModal}
        onCancel={() => setViewModal(false)}
      >
        <div>
          <Row gutter={[10, 10]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <b>
                <p>Title</p>
              </b>
              <p>{selectedNotification?.title}</p>
            </Col>
          </Row>
          <Row gutter={[10, 10]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <b>
                <p>Created At</p>
              </b>
              <p>{selectedNotification?.createdAt?.substring(0, 10)}</p>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <b>
                <p>Type</p>
              </b>
              <p>{selectedNotification?.type}</p>
            </Col>
          </Row>
          <Row gutter={[10, 10]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <b>
                <p>From</p>
              </b>
              <p>
                {selectedNotification?.from?.firstName}{' '}
                {selectedNotification?.from?.lastName}
              </p>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <b>
                <p>UserType</p>
              </b>
              <p>{selectedNotification?.from?.role}</p>
            </Col>
          </Row>
          <Row gutter={[10, 10]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <b>
                <p>Status</p>
              </b>
              <p>{selectedNotification?.status}</p>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <b>
                <p>Country</p>
              </b>
              <p>{selectedNotification?.country}</p>
            </Col>
          </Row>
          {(selectedNotification?.type == 'estimation' ||
            selectedNotification?.type == 'estimationOffer' ||
            selectedNotification?.type == 'promotion' ||
            selectedNotification?.type == 'dispute') && (
            <Row gutter={[10, 10]}>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <div className='_create_estimation_btn'>
                  <Button
                    type='primary'
                    onClick={() => {
                      history.push(
                        selectedNotification?.type == 'estimation' ||
                          selectedNotification?.type == 'estimationOffer'
                          ? {
                              pathname: '/serviceBookings',
                              state: {
                                id: selectedNotification?.target,
                                path: selectedNotification?.type,
                              },
                            }
                          : selectedNotification?.type == 'promotion'
                          ? {
                              pathname: '/offers',
                              state: { id: selectedNotification?.promotionId },
                            }
                          : selectedNotification?.type == 'dispute'
                          ? {
                              pathname: '/disputes',
                              state: { id: selectedNotification?.target },
                            }
                          : null
                      );
                      setViewModal(false);
                    }}
                  >
                    {selectedNotification?.type == 'estimation'
                      ? 'Go To Bookings'
                      : selectedNotification?.type == 'promotion'
                      ? 'Go To Promotion'
                      : selectedNotification?.type == 'dispute'
                      ? 'Go To Dispute'
                      : null}
                  </Button>
                </div>
              </Col>
            </Row>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default SiderLayout;
