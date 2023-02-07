import React from "react";
import { Modal, Row, Col, Button, Image, Spin } from "antd";
import GoogleMapReact from "google-map-react";
import Pin from "../../assets/placeholder.png";
import { MAPS_API_KEY } from "../../constants"
import "./styles.scss";

const ViewDetailsModal = ({
  title,
  data,
  isViewDetailsOpen,
  setIsViewDetails,
  acceptTitle,
  rejectTitle,
  accpetAction,
  rejectAction,
  profileImage,
  modalLoading,
  location,
  text_note,
  bookingImage,
  bookingVideo,
  voice_note,
}) => {
  const AnyReactComponent = ({ text }) => (
    <img
      src={text}
      alt=""
      srcset=""
      style={{ objectFit: "contain" }}
      width="30px"
      height="30px"
    />
  );

  return (
    <Modal
      width="800px"
      footer={false}
      title={title}
      visible={isViewDetailsOpen}
      onCancel={() => setIsViewDetails(false)}
      onOk={() => {
        setIsViewDetails(false);
      }}
    >
      {modalLoading ? (
        <div className="modal-loader">
          <Spin />
        </div>
      ) : (
        <div>
          {location && (
            <div className="_google_map_container">
              <GoogleMapReact
                bootstrapURLKeys={{
                  key: MAPS_API_KEY,
                }}
                defaultCenter={{
                  lat: 25,
                  lng: 55,
                }}
                defaultZoom={10}
              >
                <AnyReactComponent
                  lat={location?.lat}
                  lng={location?.lng}
                  text={Pin}
                />
              </GoogleMapReact>
            </div>
          )}
          {profileImage && (
            <Image className="header-image" src={profileImage} />
          )}
          <Row style={{ padding: "1rem" }} gutter={[10, 10]}>
            {Object.keys(data).map((key) => {
              if (key == "Booking Id") {
                // Need to Discuss Which Fields are going to show
              } else {
                return (
                  <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    <b>
                      <p>{key}</p>
                    </b>
                    <p>{data[key]}</p>
                  </Col>
                )
              }
            })}
            {text_note && (
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <b>
                  <p>Text Note</p>
                </b>
                <p>{text_note}</p>
              </Col>
            )}
            {voice_note && (
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <b>
                  <p>Voice Note</p>
                </b>
                <audio controls>
                  <source src={voice_note} type="audio/mp4" />
                </audio>
              </Col>
            )}
            {bookingImage && (
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <b>
                  <p>Image</p>
                </b>
                <img
                  src={bookingImage}
                  alt=""
                  width="100px"
                  height="100px"
                  className="_field_value"
                />
              </Col>
            )}
            {bookingVideo && (
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <b>
                  <p>video</p>
                </b>
                <video width="100px" height="100px" controls>
                  <source src={bookingVideo} type="video/mp4" />
                </video>
              </Col>
            )}
            {accpetAction && (
              <div className="actions-btns-container">
                <Button
                  type="primary"
                  size="middle"
                  className="approve-btn"
                  onClick={accpetAction}
                >
                  {acceptTitle}
                </Button>
                <Button
                  type="danger"
                  size="middle"
                  className="reject-btn"
                  onClick={rejectAction}
                >
                  {rejectTitle}
                </Button>
              </div>
            )}
          </Row>
        </div>
      )}
    </Modal>
  );
};

export default ViewDetailsModal;
