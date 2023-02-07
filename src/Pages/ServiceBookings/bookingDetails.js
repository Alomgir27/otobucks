import GoogleMapReact from "google-map-react";
import Pin from "../../assets/placeholder.png";
import serviceImage from "../../assets/service.png";
import { CloseIcon } from "../../Icons";

const BookingDetails = ({
  selectedBooking,
  setCreateEstimationForm,
  cancelBooking,
  setBookingDetailsOpen,
  setEstimationEditable,
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
              onClick={() => {
                setEstimationEditable(true)
                setBookingDetailsOpen(false)
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
                value={selectedBooking?.bookingDetails?.date?.substring(0, 10)}
                className="_field_value"
              />
              <div className="_label_text">Status</div>
              <input
                readOnly
                value={selectedBooking?.status}
                className="_field_value"
              />
            </div>
            <div className="_field_container">
              <div className="_label_text">Address</div>
              <input
                readOnly
                value={selectedBooking?.address}
                className="_field_value"
              />
              <div className="_label_text">Time</div>
              <input
                readOnly
                value={selectedBooking?.bookingDetails?.time}
                className="_field_value"
              />
            </div>
            <div className="_field_container">
              <div className="_label_text">Customer Name</div>
              <input
                readOnly
                value={`${selectedBooking?.customer?.firstName} ${selectedBooking?.customer?.lastName}`}
                className="_field_value"
              />
              <div className="_label_text">Customer country</div>
              <input
                readOnly
                value={selectedBooking?.customer?.country}
                className="_field_value"
              />
            </div>
            <div className="_field_container">
              <div className="_label_text">Service Title</div>
              <input
                readOnly
                value={selectedBooking?.source?.title}
                className="_field_value"
              />
              <div className="_label_text">Car Brand</div>
              <input
                readOnly
                value={selectedBooking?.bookingDetails?.car?.brand}
                className="_field_value"
              />
            </div>
            <div className="_field_container">
              <div className="_label_text">Car Color</div>
              <input
                readOnly
                value={selectedBooking?.bookingDetails?.car?.color}
                className="_field_value"
              />
              <div className="_label_text">Car City</div>
              <input
                readOnly
                value={selectedBooking?.bookingDetails?.car?.carCity}
                className="_field_value"
              />
            </div>
            <div className="_field_container">
              <div className="_label_text">Car Code</div>
              <input
                readOnly
                value={selectedBooking?.bookingDetails?.car?.carCode}
                className="_field_value"
              />
              <div className="_label_text">Car Number</div>
              <input
                readOnly
                value={selectedBooking?.bookingDetails?.car?.carNumber}
                className="_field_value"
              />
            </div>
            <div className="_field_container">
              <div className="_label_text">Car Mileage</div>
              <input
                readOnly
                value={selectedBooking?.bookingDetails?.car?.mileage}
                className="_field_value"
              />
              <div className="_label_text">Car Model Year</div>
              <input
                readOnly
                value={selectedBooking?.bookingDetails?.car?.modelYear}
                className="_field_value"
              />
            </div>
            <div className="_field_container">
              <div className="_label_text">Car Color</div>
              <input
                readOnly
                value={selectedBooking?.bookingDetails?.car?.color}
                className="_field_value"
              />
              <div className="_label_text">Voice note</div>
              <audio controls className="_field_value">
                <source
                  src={selectedBooking?.bookingDetails?.voiceNote[0]}
                  type="audio/mp4"
                />
              </audio>
            </div>
            <div className="_field_container">
              <div className="_label_text">Booking Image</div>
              <img
                src={selectedBooking?.bookingDetails?.image[0]}
                alt=""
                width="200px"
                height="150px"
                className="_field_value"
              />
              <div className="_label_text">Service Image</div>
              <img
                src={selectedBooking?.source?.image[0] ?? "./service.png"}
                alt=""
                width="200px"
                height="150px"
                className="_field_value"
              />
            </div>
            <div className="_field_container">
              <div className="_label_text">Booking Video</div>
              <video width="200px" height="130" className="_field_value" controls>
                <source src={selectedBooking?.bookingDetails?.video[0]} type="video/mp4" />
              </video>
              <div className="_label_text">Booking Notes</div>
              <textarea
                className="_field_value"
                readOnly
                value={selectedBooking?.bookingDetails?.customerNote}
              >
              </textarea>
            </div>
          </div>
          {selectedBooking?.status === "pending" && (
            <div className="_save_cancel_btns_container">
              <button
                className="_save_cancel_btns font s16"
                onClick={() => {
                  setCreateEstimationForm(true);
                  setEstimationEditable(true)
                  setBookingDetailsOpen(false);
                }}
              >
                Create Estimation
              </button>
              <button
                className="_save_cancel_btns font s16"
                onClick={cancelBooking}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
