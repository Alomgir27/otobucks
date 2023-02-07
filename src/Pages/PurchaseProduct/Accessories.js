import './styles.scss';

import { Button, Input, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Grid from '@mui/material/Grid';
import LocationIcon from '../../assets/locationIcon.png';
import { SearchIcon } from './../../Icons';
import { get } from '../../services/RestService';
import { options } from '../../helpers';

let Accessories = ({ ExploreHandler }) => {
  const stores = useSelector((state) => state?.purchaseProducts?.stores);
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [dataFilter, setDataFilter] = useState();

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    setLoading(true);
    get('/stores', options)
      .then((data) => {
        setData(data.result);
        setDataFilter(data.result);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const searchByName = (name) => {
    if (name !== '') {
      const res = data.filter((sd) => {
        if (sd && sd.name && sd.name !== undefined && sd.name != '') {
          return sd?.name.toLocaleLowerCase().includes(name);
        }
      });
      setData(res);
    } else {
      setData(dataFilter);
    }
  };

  return (
    <div className='_purchase_container'>
      <h1 className='_purchase_heading'>All Stores</h1>
      {loading ? (
        <div className='storesLoader'>
          <Spin />
        </div>
      ) : stores?.length === 0 ? (
        <div className='noStores'>There are no products available</div>
      ) : (
        <>
          <div className='_purchase__search_main'>
            <SearchIcon />
            <Input
              onChange={(e) => {
                searchByName(e.target.value);
              }}
              placeholder='Search By Store Name'
              className='_purchase_search_input'
            />
          </div>
          <Grid container spacing={3}>
            {data &&
              data !== undefined &&
              data != false &&
              data?.map((store) => {
                return (
                  <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                    <div className='_purchase_card_main'>
                      <div className='_purchase_card_header_main'>
                        <Grid container spacing={2}>
                          <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                            <div className='_purchase_card_header_image_main'>
                              <img
                                src={store.images[0]}
                                height={150}
                                width={150}
                                alt=''
                              />
                            </div>
                          </Grid>
                          <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                            <div className='_purchase_card_container'>
                              <div className='_purchase_card_heading_main'>
                                <h1 className='_purchase_card_heading'>
                                  {store.name}
                                </h1>
                                <div className='_purchase_card_city'>
                                  <img
                                    src={LocationIcon}
                                    height='15px'
                                    width='15px'
                                    alt=''
                                  />
                                  {store.state}
                                </div>
                                <p className='_purchase_card_des'>
                                  {store.description?.length > 34
                                    ? store.description.substring(0, 34) + '...'
                                    : store.description}
                                </p>
                              </div>
                              <div className='_explore_now_btn_container'>
                                <Button
                                  onClick={() => ExploreHandler(store._id)}
                                  className='_purchase_explore_btn'
                                  type='primary'
                                >
                                  Explore Now
                                </Button>
                              </div>
                            </div>
                          </Grid>
                        </Grid>
                      </div>
                    </div>
                  </Grid>
                );
              })}
          </Grid>
        </>
      )}
    </div>
  );
};
export default Accessories;
