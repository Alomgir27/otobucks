import { Form, Input, Button, Modal } from 'antd';
import axios from 'axios';
import { useState } from 'react';
import {
  openErrorNotification,
  openNotification,
  options,
} from '../../helpers';
import { post } from '../../services/RestService';

const AddUserForm = (props) => {
  const [user, setUser] = useState({});

  const handleOk = (e) => {
    props.setShowModal(false);
  };

  const handleCancel = (e) => {
    props.setShowModal(false);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    props.setLoading(true);
    post('/auth/providers/staff', user, options)
      .then((res) => {
        openNotification('User added successfully');
        handleCancel();
        props.fetchData();
      })
      .catch((error) => {
        openErrorNotification('Error adding user');
      });
    props.setLoading(false);
  };

  const handleChange = (e) => {
    setUser((preval) => {
      return { ...preval, [e.target.name]: e.target.value };
    });
  };

  return (
    <Modal
      title='Add User'
      visible={props.visible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button type='primary' onClick={handleSubmit} className='ms-auto'>
          Add User
        </Button>,
      ]}
    >
      <Form layout='horizontal'>
        <Form.Item
          label='First Name'
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 12 }}
          className='formItem'
        >
          <Input name='firstName' onChange={handleChange} />
        </Form.Item>
        <Form.Item
          label='Last Name'
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 12 }}
          className='formItem'
        >
          <Input name='lastName' onChange={handleChange} />
        </Form.Item>
        <Form.Item
          label='Email'
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 12 }}
          className='formItem'
        >
          <Input name='email' onChange={handleChange} />
        </Form.Item>
        <Form.Item
          label='Phone'
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 12 }}
          className='formItem'
        >
          <Input name='phone' onChange={handleChange} />
        </Form.Item>
        <Form.Item
          label='Password'
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 12 }}
          className='formItem'
        >
          <Input name='password' onChange={handleChange} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddUserForm;
