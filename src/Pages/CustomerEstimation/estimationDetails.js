import GoogleMapReact from "google-map-react";
import Pin from "../../assets/placeholder.png";
import { CloseIcon } from "../../Icons";

const EstimationDetails = ({
  selectedEstimation,
  setCreateEstimationForm,
  setEstimationDetailsOpen,
  setData,
  data,
  setDiscount,
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
    <div className="estimation-details-wrapper">
      <div className="dialog-box">
        <div className="estimation-details-container">
          <div className="estimation-details-heading">
            <div className="font s18 font b6">View Estimation Details</div>
            <div
              className="close-button"
              onClick={() => setEstimationDetailsOpen(false)}
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
              <div className="_label_text">Service request date</div>
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
              <div className="_label_text">Customer address</div>
              <input
                readOnly
                value={selectedEstimation?.address}
                className="_field_value"
              />
              <div className="_label_text">Service request time</div>
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
              <div className="_label_text">Text note</div>
              <input
                readOnly
                value={selectedEstimation?.note[0] ?? "---"}
                className="_field_value"
              />
            </div>
            <div className="_field_container">
              {selectedEstimation?.source?.image && (
                <div className="_label_text">Image</div>
              )}
              {selectedEstimation?.source?.image && (
                <img
                  src={selectedEstimation?.source?.image}
                  alt=""
                  width="27%"
                  height="150px"
                  className="_field_value"
                />
              )}
              {selectedEstimation?.video[0] && (
                <div className="_label_text">Video</div>
              )}
              {selectedEstimation?.video[0] && (
                <video width="27%" height="150" className="_field_value" controls>
                  <source src={selectedEstimation?.video} type="video/mp4" />
                </video>
              )}
            </div>
            {selectedEstimation?.voice_note[0] && (
              <div className="_field_container">
                <div className="_label_text">Voice note</div>
                <audio controls className="_field_value">
                  <source
                    src={selectedEstimation?.voice_note[0]}
                    type="audio/mp4"
                  />
                </audio>
              </div>
            )}
          </div>
          <div className="_save_cancel_btns_container">
            {selectedEstimation?.status === "declined" ? (
              <button className="_save_cancel_btns font s16">
                Give Feedback
              </button>
            ) : (
              <button
                className="_save_cancel_btns font s16"
                onClick={() => {
                  setCreateEstimationForm(true);
                  setData(selectedEstimation?.items ?? data);
                  setDiscount(selectedEstimation?.discount);
                  setEstimationDetailsOpen(false);
                }}
              >
                Edit Estimation
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstimationDetails;
