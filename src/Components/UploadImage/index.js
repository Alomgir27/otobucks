import React from 'react';
import { Upload } from 'antd';
import './styles.css';
import { openNotification } from '../../helpers';
import ImgCrop from 'antd-img-crop';

export default function UploadImage({
  label,
  setImage,
  image,
  imageIndex,
  test,
}) {
  const dummyRequest = ({ _, onSuccess }) => {
    setTimeout(() => {
      onSuccess('ok');
    }, 0);
  };

  const beforeUpload = (file) => {
    // extract file type
    const fileType = file.type.toLowerCase();

    // allowed types
    const allowedTypes = ['image/png', 'image/jpeg', 'image/gif'];

    const allowed = allowedTypes.includes(fileType);

    if (!allowed) {
      openNotification(
        `Invalid file type selected. Allowed file types are ${allowedTypes.join(
          ', '
        )}.`
      );
    }
    return allowed;
  };

  const fileSelected = (e) => {
    if (e.file.percent === 100) {
      // extract selected file
      const file = e.file.originFileObj;

      // if file not available return
      if (!file) return;

      // set state with seleted file
      test ? setImage(file, imageIndex) : setImage(file);
      //setImageUrl(file.name)
    }
  };
  return (
    <div className='cst-textinput cst-text-width'>
      <label className='fw600 fs24 lh48'>{label}</label>

      <div
        className='uploadBox'
        style={{ textAlign: 'center', justifyContent: 'center' }}
      >
        <ImgCrop beforeCrop={beforeUpload}>
          <Upload
            dummyRequest={dummyRequest}
            showUploadList={false}
            beforeUpload={beforeUpload}
            onChange={(e) => fileSelected(e)}
          >
            <p style={{ marginTop: 8 }}>
              {image ? 'Image Selected' : 'Upload Image'}
            </p>
          </Upload>
        </ImgCrop>
      </div>
    </div>
  );
}
