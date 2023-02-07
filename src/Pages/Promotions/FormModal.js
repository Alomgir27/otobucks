import { Button, Col, Form, Image, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import { patch, post } from '../../services/RestService'

import FormInput from '../../Components/FormInput'
import FormTextarea from '../../Components/FormTextarea'
import SelectBox from '../../Components/SelectBox'
import UploadImage from '../../Components/UploadImage'
import { countries } from '../../constants'
import { openNotification } from '../../helpers'

const role = [
  { value: 'all', title: 'All' },
  { value: 'customer', title: 'Customer' },
  { value: 'vendor', title: 'Vendor' }
]

const FormModal = ({ method, closeModal, getTableData, data }) => {
  const [image, setImage] = useState()
  const [imagePath, setImagePath] = useState()
  const [userData, setUserData] = useState()
  const edit = method === 'edit'
  const view = method === 'view'
  const create = method === 'create'

  const onSubmit = (values) => {

    const t = localStorage.getItem('token')
    const token = `Bearer ${t}`
    var options = {
      headers: {
        'Authorization': token
      }
    }

    const formData = new FormData();
    Object.keys(values).forEach(key => formData.append(key, values[key]));
    formData.append('promoImg', image)

    post('/bulkEmails', formData, options).then((res) => {
      if (res.status) {
        openNotification(res.message)
        closeModal()
        getTableData()
      } else {
        openNotification(res.message)
      }
    }).catch((err) => {
      console.log(err)
      openNotification(err.message)
    })
  }


  useEffect(() => {
    if (edit || view)
      setUserData(data)
    setImagePath(data.promoImg)
  }, [edit, view, setUserData, data])


  const onEdit = (values) => {

    alert(JSON.stringify(values))
    const t = localStorage.getItem('token')
    const token = `Bearer ${t}`
    var options = {
      headers: {
        'Authorization': token
      }
    }
    const formData = new FormData();
    Object.keys(values).forEach(key => formData.append(key, values[key]));

    formData.append('promoImg', image ? image : imagePath)

    patch(`/bulkEmails/${data._id}`, formData, options).then((res) => {
      if (res.status) {
        openNotification(res.message)
        closeModal()
        getTableData()
      } else {
        openNotification(res.message)
      }
    }).catch((err) => {
      console.log(err)
      openNotification(err.message)
    })
  }


  return (
    <div >
      <div >
        {(image || imagePath) && <Image style={{ width: 100, height: 100, objectFit: 'contain' }} src={image ? URL.createObjectURL(image) : imagePath} />}
        {!view && <div style={{ marginTop: 10 }}>
          <p>Upload Image</p>
          <UploadImage image={image} setImage={setImage} />
        </div>}

        {((edit && userData) || (view && userData) || create) &&
          <div style={{ marginTop: 20 }}>
            <Form onFinish={edit ? onEdit : onSubmit} initialValues={userData}>

              <Row gutter={[10, 10]}>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <p>Select By Target</p>
                  <SelectBox data={role} name='target' />
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <p>Select By Country</p>
                  <SelectBox country data={countries} name='country' />
                </Col>
              </Row>

              <Row gutter={[10, 10]}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <p>Subject</p>
                  <FormInput name='subject' />
                </Col>
              </Row>
              <Row gutter={[10, 10]}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <p>Message</p>
                  <FormTextarea name='message' />
                </Col>
              </Row>


              {!view && <Button type='primary' htmlType='submit' >{edit ? 'Edit' : 'Create'}</Button>}
            </Form>
          </div>}
      </div>

    </div>
  )
}

export default FormModal
