import './index.scss';

import {
  FacebookIcon,
  LinkdinIcon,
  TwitterIcon,
  WhatsAppBIcon,
} from './../../Icons';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Table, Tag } from 'antd';
import { get } from '../../services/RestService';

const InviteFriends = () => {
  const userId = useSelector((state) => state?.profile?.user?.id);
  const config = {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
  };
  const [allInvite, setAllInviteData] = useState();
  const [inviteCode, setInviteCode] = useState();
  const [loading, setLoading] = useState(false);
  const [searchValues, setSearchValues] = useState({
    name: '',
    country: '',
    date: ['', ''],
  });

  const [filteredData, setFilteredData] = useState([]);

  const columns = [
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (_, dataFilter) => (
        <p>{dataFilter?.createdAt.substring(0, 10)}</p>
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (_, dataFilter) => (
        <p>{`${dataFilter?.firstName} ${dataFilter?.lastName}`}</p>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (_, dataFilter) => <p>{dataFilter?.email}</p>,
    },
    {
      title: 'Platform',
      dataIndex: 'Platform',
      key: 'Platform',
      render: (_, dataFilter) => <p>{dataFilter?.refrence}</p>,
    },
    {
      title: 'Status',
      dataIndex: 'Status',
      key: 'Status',
      render: (_, dataFilter) => (
        <Tag
          className='status_indicator'
          color={dataFilter?.status == 'approved' ? 'green' : 'red'}
        >
          {dataFilter?.status}
        </Tag>
      ),
    },
  ];

  // API Run for get user Invitation Link
  async function apiCall1() {
    setLoading(true);
    await get(`/invites/mine`, config)
      .then((res) => {
        setLoading(false);
        setAllInviteData(res?.result);
        setFilteredData(res?.result[0]?.joiner);
      })
      .catch(() => setLoading(false));
  }
  const getInviteId = async () => {
    await get(`/invites/${userId}`, config).then((res) => {
      setInviteCode(res?.result[0]?.code);
    });
  };

  React.useEffect(() => {
    apiCall1();
  }, []);

  useEffect(() => {
    if (userId) getInviteId();
  }, [userId]);

  return (
    <div className='_purchase_container'>
      <p className='_invite_friends_heading'>Invite Supplier</p>
      <p className='_invite_friends_sub_heading'>
        Donec enim lectus, venenatis nec aliquam a, varius sed ex. Ut laoreet
        augue velit, vel malesuada elit euismod ut. Nam at dui eros. Vivamus sem
        <br />
        quam, tincidunt a urna congue, malesuada consectetur leo. Donec ornare
        consectetur ante, ac viverra arcu rhoncus ac
      </p>
      <div className='_invite_friends_code_copy_main'>
        <p id='div1' className='_invite_friends_code_copy_text'>
          {`https://service-providers.otobucks.com/register?invite=${inviteCode}`}
        </p>
        <button
          className='_invite_friends_code_copy_btn'
          onClick={() => {
            navigator.clipboard.writeText(
              `https://service-providers.otobucks.com/register?invite=${inviteCode}`
            );
          }}
        >
          COPY
        </button>
      </div>
      <div className='_invite_friends_share_main flex flex-col'>
        <p className='_invite_friends_share_heading'>Share with supplier</p>
        <div>
          <a
            target='_blank'
            rel='noreferrer'
            href={`http://www.facebook.com/sharer.php?u=https://service-providers.otobucks.com/register?invite=${inviteCode}`}
            className='_invite_friends_facebook_btn'
          >
            <FacebookIcon />
          </a>
          <a
            target='_blank'
            rel='noreferrer'
            href={`http://www.linkedin.com/shareArticle?mini=true&url=https://service-providers.otobucks.com/register?invite=${inviteCode}`}
            className='_invite_friends_facebook_btn'
          >
            <LinkdinIcon />
          </a>
          <a
            target='_blank'
            rel='noreferrer'
            href={`http://twitter.com/share?text=[Auto Fixz Products Saller]&url=https://service-providers.otobucks.com/register?invite=${inviteCode}`}
            className='_invite_friends_facebook_btn'
          >
            <TwitterIcon />
          </a>
          <a
            target='_blank'
            rel='noreferrer'
            href={`whatsapp://send?abid=phonenumber&text=https://service-providers.otobucks.com/register?invite=${inviteCode}`}
            className='_invite_friends_facebook_btn'
          >
            <WhatsAppBIcon />
          </a>
        </div>
      </div>
      <div className='_invite_friends_image_main'>{/* <InviteIcon /> */}</div>
      {/* <Grid item xl={3} lg={3} md={6} sm={12} xs={12}>
              <p className="_invite_friends_input_title">Search by name</p>
              <Input
                onChange={(e) =>
                  setSearchValues((prev) => {
                    return { ...prev, name: e.target.value };
                  })
                }
                placeholder="Search by name"
                value={searchValues.name}
                className="_invite_friends_input"
              />
            </Grid> */}
      {/* <Grid item xl={2} lg={2} md={6} sm={12} xs={12}>
              <p className="_invite_friends_input_title">Search by Country</p>
              <Input
                onChange={(e) =>
                  setSearchValues((prev) => {
                    return { ...prev, country: e.target.value };
                  })
                }
                placeholder="Search by Country"
                value={searchValues.country}
                className="_invite_friends_input"
              />
            </Grid> */}
      {/* <Grid item xl={5} lg={5} md={6} sm={12} xs={12}>
              <p className="_invite_friends_input_title">Search by Date</p>
              <RangePicker
                className="_invite_friends_input"
                onChange={(e, date) => {
                  setSearchValues((prev) => {
                    return { ...prev, date };
                  });
                }}
              />
            </Grid> */}
      {/* <Grid item xl={2} lg={2} md={6} sm={12} xs={12}>
              <p className="_invite_friends_input_title">.</p>
              <button
                className="_invite_friends_apply_btn"
                // onClick={applyFilters}
              >
                APPLY
              </button>
            </Grid> */}
      <div className='_table_container'>
        <Table
          scroll={{ x: true }}
          loading={loading}
          columns={columns}
          dataSource={filteredData}
          pagination={true}
          defaultExpandAllRows={true}
        />
      </div>
    </div>
  );
};
export default InviteFriends;
