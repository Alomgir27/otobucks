import { useState } from 'react';
import { Row, Col } from 'antd';
import { useHistory } from 'react-router';
import './styles.scss';
import { useQueryParams } from '../../helpers';
import Verification from './Verification';

// ? Import Components
import ServiceProvider from '../../Components/Register/ServiceProvider';
// import ProductSeller from '../../Components/Register/ProductSeller';

const Register = () => {
  const [changeClasses, setChangeClasses] = useState(false);
  const [activeTab, setActiveTab] = useState(true);
  const query = useQueryParams();
  const isVerify = query.get('email');
  const history = useHistory();

  const ChangeClasses = (value) => {
    if (value == 'company') {
      setChangeClasses(true);
    } else {
      setChangeClasses(false);
    }
  };
  return (
    <div id='register'>
      <Row>
        <Col xs={0} sm={0} md={8} lg={8} xl={8} xxl={8}>
          <div className={'main'}>
            <div className='sidebar_box'>
              <div className='logo_box'>
                <img src={'https://d23jwszswncmo3.cloudfront.net/logo.png'} />
              </div>
              <div className='sidebar_text'>
                We're a market place that helps auto workshops find long term
                customers. We provide a space where people can find the best
                auto workshops in their area and book appointments with their
                preferred mechanic. You can also promote your services and
                gain new clients.
              </div>
            </div>
          </div>
        </Col>
        <Col
          style={{
            padding: 50,
            paddingRight: 20,
            height: '100vh',
            overflowY: 'scroll',
          }}
          xs={24}
          sm={24}
          md={16}
          lg={16}
          xl={16}
          xxl={16}
        >
          <div className='pt-4 pb-2' style={{ marginTop: '1.5em' }}>
            <h1 className='heading' style={{ marginTop: 20 }}>
              Welcome To Service Provider Registration!
            </h1>

            <h4 className='heading_2'>
              We look forward to long term business partnership
            </h4>
          </div>
          {!isVerify && (
            <ServiceProvider changeClasses={(value) => ChangeClasses(value)} />
          )}
          {!isVerify && (
            <>
              {/* <div onClick={() => history.push("/")}>
                <img
                  src={Logo}
                  style={{ width: 192, height: 110, cursor: "pointer" }}
                  alt="logo"
                />
              </div> */}
              {/* <h1 style={{ marginTop: 20 }}>Create your Account</h1> */}
              <h4 style={{ marginTop: 10 }}>
                Already Have An Account,{' '}
                <span
                  onClick={() => history.push('login')}
                  style={{
                    fontWeight: 'bold',
                    color: '#0E4A86',
                    cursor: 'pointer',
                    textDecorationLine: 'underline',
                  }}
                >
                  Sign In
                </span>
              </h4>
            </>
          )}
          {isVerify && <Verification email={isVerify} />}
        </Col>
      </Row>
    </div>
  );
};

export default Register;
