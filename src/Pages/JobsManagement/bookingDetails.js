import GoogleMapReact from "google-map-react";
import Pin from "../../assets/placeholder.png";
import serviceImage from "../../assets/service.png";
import { CloseIcon } from "../../Icons";
import { Button } from "antd";
import { useHistory } from "react-router-dom";

const BookingDetails = ({
  selectedEstimation,
  setEstimationDetailsOpen,
}) => {
  let history = useHistory()

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
    <div className="estimation-details-wrapper">
      <div className="dialog-box">
        <div className="estimation-details-container">
          <div className="estimation-details-heading">
            <div className="font s18 font b6">View Estimation Details</div>
            <div
              className="close-button"
              onClick={() => {
                setEstimationDetailsOpen(false)
              }}
            >
              <CloseIcon />
            </div>
          </div>
          <div className="_google_map_container">
            <GoogleMapReact
              bootstrapURLKeys={{
                key: "AIzaSyA_jzgsNBD9FklOoEVmmdAH9nufXVgqQIE",
              }}
              defaultCenter={{
                lat: 25,
                lng: 55,
              }}
              defaultZoom={10}
            >
              <AnyReactComponent lat={25} lng={55} text={Pin} />
            </GoogleMapReact>
          </div>
          <div className="_estimation_details">
            <div className="_field_container">
              <div className="_label_text">Date</div>
              <input
                readOnly
                value={selectedEstimation?.date?.substring(0, 10)}
                className="_field_value"
              />
              <div className="_label_text">Status</div>
              <input
                readOnly
                value={selectedEstimation?.status}
                className="_field_value"
              />
            </div>
            <div className="_field_container">
              <div className="_label_text">Address</div>
              <input
                readOnly
                value={selectedEstimation?.address}
                className="_field_value"
              />
              <div className="_label_text">Time</div>
              <input
                readOnly
                value={selectedEstimation?.time}
                className="_field_value"
              />
            </div>
            <div className="_field_container">
              <div className="_label_text">Customer Name</div>
              <input
                readOnly
                value={`${selectedEstimation?.customer?.firstName} ${selectedEstimation?.customer?.lastName}`}
                className="_field_value"
              />
              <div className="_label_text">Customer country</div>
              <input
                readOnly
                value={selectedEstimation?.customer?.country}
                className="_field_value"
              />
            </div>
            <div className="_field_container">
              <div className="_label_text">Service Title</div>
              <input
                readOnly
                value={selectedEstimation?.source?.title}
                className="_field_value"
              />
              <div className="_label_text">Voice note</div>
              <audio controls className="_field_value">
                <source
                  src={selectedEstimation?.voice_note[0] && selectedEstimation.voice_note[0]}
                  type="audio/mp4"
                />
              </audio>
            </div>
            <div className="_field_container">
              <div className="_label_text">Estimation Image</div>
              <img
                src={selectedEstimation?.image ?? serviceImage}
                alt=""
                width="27%"
                height="150px"
                className="_field_value"
              />
              <div className="_label_text">Service Image</div>
              <img
                src={selectedEstimation?.source?.image ?? "./service.png"}
                alt=""
                width="27%"
                height="150px"
                className="_field_value"
              />
            </div>
            <div className="_field_container">
              <div className="_label_text">Estimation Video</div>
              <video width="27%" height="130" className="_field_value" controls>
                <source src={selectedEstimation?.video} type="video/mp4" />
              </video>
              <div className="_label_text">Estimation Notes</div>
              <textarea
                className="_field_value"
                readOnly
                value={selectedEstimation?.cutomerNote}
              >
              </textarea>
            </div>
            {
              selectedEstimation?.status != "pending" && selectedEstimation?.status != "declined" &&
              <div className="actions-btns-container">
                <Button
                  type="primary"
                  size="middle"
                  className="approve-btn"
                  onClick={() => history.push({ pathname: "/estimation", state: { id: selectedEstimation?._id, path: "estimations" } })}
                >
                  View Estimations
                </Button>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
