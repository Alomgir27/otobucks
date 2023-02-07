import { useEffect } from 'react';
import { Form, Input, Button, Row, Checkbox } from 'antd';
import Logo from '../../assets/autofix.png';
import { useSelector, useDispatch } from 'react-redux';
import { loginUser } from '../../redux/actions/authAction';
import { useHistory } from 'react-router';
import { actionTypes } from '../../redux/types';
import { openErrorNotification, openNotification } from '../../helpers';

import './styles.scss';
import { getTokenFound } from '../../firebase';
const FormItem = Form.Item;

const Login = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const auth = useSelector((state) => state.auth);
  const onFinish = async (values) => {
    const firebaseToken = await getTokenFound();
    values.firebaseToken = firebaseToken;
    dispatch({ type: actionTypes.SET_LOADING });
    dispatch(loginUser(values));
  };

  const onFinishFailed = (errorInfo) => {};

  useEffect(() => {
    auth.isAuthenticated && history.push('/home');
  }, [auth, history]);

  useEffect(() => {
    auth.isAuthenticated && window.location.reload();
  }, [auth]);

  return (
    <div id='login'>
      <div className={'form'}>
        <div className={'logo'}>
          <img alt='logo' src={Logo} />
        </div>
        <h2 style={{ textAlign: 'center' }}>Service Panel</h2>
        <Form onFinish={onFinish} onFinishFailed={onFinishFailed}>
          <FormItem
            name='email'
            rules={[{ required: true, message: 'Please input your Email!' }]}
            hasFeedback
          >
            <Input placeholder={'Username'} />
          </FormItem>
          <FormItem
            name='password'
            rules={[{ required: true, message: 'Please input your password!' }]}
            hasFeedback
          >
            <Input.Password placeholder={'Password'} />
          </FormItem>
          <Form.Item>
            <Form.Item name='remember' valuePropName='checked' noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <a
              style={{ float: 'right', color: '#0E4A86' }}
              className='login-form-forgot'
              onClick={() => history.push('/forget-password')}
            >
              Forgot password
            </a>
          </Form.Item>
          <Row>
            <Button type='primary' htmlType='submit' loading={auth.loading}>
              Login
            </Button>
          </Row>
        </Form>
        <p style={{ color: 'black', textAlign: 'center', marginTop: 10 }}>
          New Vendor ?{' '}
          <span
            onClick={() => history.push('/register')}
            style={{
              cursor: 'pointer',
              color: '#0E4A86',
              fontWeight: 'bolder',
            }}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
