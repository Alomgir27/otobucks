import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Select } from "antd";
import { CircularProgress } from "@mui/material";
import { State } from "country-state-city";
import { CloseIcon } from "../../Icons";
import { countries } from "../../constants";
import { uploadUserPictures, updateUser } from "../../redux/actions/profile";
import { openNotification } from "../../helpers";
const { Option } = Select;

const EditContactInfo = ({ userData, setLoading, setOpen }) => {
  const dispatch = useDispatch();

  const [apiState, setApiState] = useState(userData?.states);
  const [phone, setPhone] = useState(userData?.phone);
  const [secondNumber, setSecondNumber] = useState(userData?.secondNumber);
  const [states, setState] = useState([]);
  const [ImgBrochure, setImgBrochure] = useState("");
  const [ImgLogo, setImgLogo] = useState("");
  const [ImgTRN, setImgTRN] = useState("");
  const [ImgLicence, setImgLicence] = useState("");
  const [picUrlBrochure, setPicUrlBrochure] = useState();
  const [picUrlLogo, setPicUrlLogo] = useState();
  const [emiratesFront, setEmiratesFront] = useState();
  const [emiratesImgFront, setEmiratesImgFront] = useState();
  const [emiratesBack, setEmiratesBack] = useState();
  const [imgEmiratesBack, setImgEmiratesBack] = useState();
  const [picUrlLicence, setPicUrlLicence] = useState();
  const [picUrlTRN, setPicUrlTRN] = useState();

  const setCode = () => {
    const code = countries.find((x) => x.value === userData?.country[0]);
    const state = State.getStatesOfCountry(code.code);
    setState(state);
  };

  function handleStateChange(value) {
    setApiState(value);
  }

  const data =
    userData?.provider?.providerType !== "individual"
      ? {
          brochure: ImgBrochure,
          tradeLicence: {
            image: ImgLicence,
            text: "TradeLicence",
          },
          logo: ImgLogo,
          trnCertificate: {
            image: ImgTRN,
            text: "TRN Certificate",
          },
        }
      : {
          emiratesID: {
            frontImage: emiratesImgFront,
            frontText: "Front Text",
            backImage: imgEmiratesBack,
            backText: "Back Text",
          },
        };

  console.log("apiState", apiState?.length);

  const saveContactInfo = () => {
    if (!phone) {
      openNotification("Please enter phone number");
    } else if (apiState?.length === 0) {
      openNotification("Please select at least one state");
    } else {
      dispatch(
        updateUser(
          setLoading,
          {
            ...data,
            phone,
            states: [...apiState],
            secondNumber,
          },
          setOpen
        )
      );
    }
  };

  useEffect(() => {
    setCode();
    setPicUrlLogo(userData?.provider?.logo);
    setImgLogo(userData?.provider?.logo);
    setEmiratesFront(userData?.provider?.emiratesID?.frontImage);
    setEmiratesImgFront(userData?.provider?.emiratesID?.frontImage);
    setEmiratesBack(userData?.provider?.emiratesID?.backImage);
    setImgEmiratesBack(userData?.provider?.emiratesID?.backImage);
    setPicUrlLicence(userData?.provider?.tradeLicence?.image);
    setImgLicence(userData?.provider?.tradeLicence?.image);
    setPicUrlTRN(userData?.provider?.trnCertificate?.image);
    setImgTRN(userData?.provider?.trnCertificate?.image);
    setPicUrlBrochure(userData?.provider?.brochure);
    setImgBrochure(userData?.provider?.brochure);
  }, [userData]);

  return (
    <div className="edit-contact-info flex">
      <div className="wrap flex flex-col">
        <div className="edit-contact-heading s18 font b5 flex aic  jc-sb">
          <div>Edit Contact Information</div>
          <div className="close-icon pointer" onClick={(e) => setOpen(false)}>
            <CloseIcon />
          </div>
        </div>
        <div className="edit-contact-block flex ">
          <div className="block-left flex flex-col">
            <div className="txt-item flex flex-col">
              <div className="txt-lbl font">Email ID</div>
              <div className="txt-box">
                <input
                  disabled
                  type="text"
                  value={userData?.email}
                  className="txt-input cleanbtn"
                />
              </div>
            </div>
            <div className="txt-item flex flex-col">
              <div className="txt-lbl font">Country</div>
              <div className="txt-box s16 font b4">{userData?.country[0]}</div>
            </div>
          </div>
          <div className="block-right flex flex-col">
            <div className="txt-item flex flex-col">
              <div className="txt-lbl font">Phone Number</div>
              <div className="txt-box">
                <input
                  type="text"
                  className="txt-input cleanbtn"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                  }}
                />
              </div>
            </div>

            <div className="txt-item flex flex-col">
              <div className="txt-lbl font">
                Land Line/2<sup>nd</sup> Number
              </div>
              <div className="txt-box">
                <input
                  type="text"
                  className="txt-input cleanbtn"
                  value={secondNumber}
                  onChange={(e) => {
                    setSecondNumber(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="edit-contact-block flex ">
          <div className="block-left flex flex-col">
            <div className="txt-item flex flex-col">
              <div className="txt-lbl font">State</div>
              <Select
                mode="multiple"
                style={{ width: "100%" }}
                placeholder="select states"
                rules={[{ required: true, message: "Required" }]}
                onChange={handleStateChange}
                defaultValue={apiState}
                optionLabelProp="label"
                size="large"
              >
                {states.map((state, index) => {
                  return (
                    <Option value={state.name} label={state.name} key={index}>
                      <div className="demo-option-label-item">
                        <span aria-label={state.name}>{state.name}</span>
                      </div>
                    </Option>
                  );
                })}
              </Select>
            </div>
          </div>
        </div>
        <>
          {userData?.provider?.providerType === "individual" ? (
            <>
              <div className="select-doc flex aic flex-col">
                <div className="pics-row flex aic">
                  <div className="l-img flex flex-col">
                    {emiratesFront ? (
                      <div className="img-preview rel">
                        <img
                          src={
                            emiratesFront
                              ? emiratesFront
                              : "/images/Profile.jpg"
                          }
                          className="img"
                          alt=""
                        />
                        <div
                          className="cross-icon flex aic jc abs"
                          onClick={(e) => {
                            setEmiratesFront(null);
                            setEmiratesImgFront("");
                          }}
                        >
                          <CloseIcon />
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}
                    <input
                      className="input-img"
                      id="_upload-file_"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        setEmiratesFront(
                          URL.createObjectURL(e.target.files[0])
                        );
                        dispatch(
                          uploadUserPictures(
                            e.target.files[0],
                            undefined,
                            setEmiratesFront,
                            setEmiratesImgFront
                          )
                        );
                      }}
                    />

                    <div
                      className="btn btn-select-img button cleanbtn flex aic jc flex-col"
                      onClick={() =>
                        document.getElementById("_upload-file_").click()
                      }
                    >
                      <>Upload Emirates ID Front</>
                    </div>
                  </div>
                  <div className="r-img flex flex-col">
                    {emiratesBack ? (
                      <div className="img-preview rel">
                        <img
                          src={
                            emiratesBack ? emiratesBack : "/images/Profile.jpg"
                          }
                          className="img"
                          alt=""
                        />
                        <div
                          className="cross-icon flex aic jc abs"
                          onClick={(e) => {
                            setEmiratesBack(null);
                            setImgEmiratesBack("");
                          }}
                        >
                          <CloseIcon />
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}
                    <input
                      className="input-img"
                      id="_upload-file_logo"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        setEmiratesBack(URL.createObjectURL(e.target.files[0]));
                        dispatch(
                          uploadUserPictures(
                            e.target.files[0],
                            undefined,
                            setEmiratesBack,
                            setImgEmiratesBack
                          )
                        );
                      }}
                    />

                    <div
                      className="btn btn-select-img button cleanbtn flex aic jc flex-col"
                      onClick={() =>
                        document.getElementById("_upload-file_logo").click()
                      }
                    >
                      <>Upload Emirates ID Back</>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="select-doc flex aic flex-col">
                <div className="pics-row flex aic">
                  <div className="l-img flex flex-col">
                    {picUrlBrochure ? (
                      <div className="img-preview rel">
                        <img
                          src={
                            picUrlBrochure
                              ? picUrlBrochure
                              : "/images/Profile.jpg"
                          }
                          className="img"
                          alt=""
                        />
                        <div
                          className="cross-icon flex aic jc abs"
                          onClick={(e) => {
                            setImgBrochure("");
                            setPicUrlBrochure(null);
                          }}
                        >
                          <CloseIcon />
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}
                    <input
                      className="input-img"
                      id="_upload-file_"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        setPicUrlBrochure(
                          URL.createObjectURL(e.target.files[0])
                        );
                        dispatch(
                          uploadUserPictures(
                            e.target.files[0],
                            undefined,
                            setPicUrlBrochure,
                            setImgBrochure
                          )
                        );
                      }}
                    />

                    {picUrlBrochure ? (
                      <p>{ImgBrochure?.name}</p>
                    ) : (
                      <div
                        className="btn btn-select-img button cleanbtn flex aic jc flex-col"
                        onClick={() =>
                          document.getElementById("_upload-file_").click()
                        }
                      >
                        <>Upload Product Brochure</>
                      </div>
                    )}
                  </div>
                  <div className="r-img flex flex-col">
                    {picUrlLogo ? (
                      <div className="img-preview rel">
                        <img
                          src={picUrlLogo ? picUrlLogo : "/images/Profile.jpg"}
                          className="img"
                          alt=""
                        />
                        <div
                          className="cross-icon flex aic jc abs"
                          onClick={(e) => {
                            setImgLogo("");
                            setPicUrlLogo(null);
                          }}
                        >
                          <CloseIcon />
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}
                    <input
                      className="input-img"
                      id="_upload-file_logo"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        setPicUrlLogo(URL.createObjectURL(e.target.files[0]));
                        dispatch(
                          uploadUserPictures(
                            e.target.files[0],
                            undefined,
                            setPicUrlLogo,
                            setImgLogo
                          )
                        );
                      }}
                    />

                    {picUrlLogo ? (
                      <p>{ImgLogo.name}</p>
                    ) : (
                      <div
                        className="btn btn-select-img button cleanbtn flex aic jc flex-col"
                        onClick={() =>
                          document.getElementById("_upload-file_logo").click()
                        }
                      >
                        <>Upload Logo</>)
                      </div>
                    )}
                  </div>
                </div>
                <div className="pics-row flex aic">
                  <div className="l-img flex flex-col">
                    {picUrlLicence ? (
                      <div className="img-preview rel">
                        <img
                          src={
                            picUrlLicence
                              ? "/images/document.png"
                              : "/images/document.png"
                          }
                          className="img"
                          alt=""
                        />
                        <div
                          className="cross-icon flex aic jc abs"
                          onClick={(e) => {
                            setImgLicence("");
                            setPicUrlLicence(null);
                          }}
                        >
                          <CloseIcon />
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}
                    <input
                      className="input-img"
                      id="_upload-file_Licence"
                      type="file"
                      // accept="/*"
                      onChange={(e) => {
                        setPicUrlLicence(
                          URL.createObjectURL(e.target.files[0])
                        );
                        dispatch(
                          uploadUserPictures(
                            e.target.files[0],
                            undefined,
                            setPicUrlLicence,
                            setImgLicence
                          )
                        );
                      }}
                    />

                    {picUrlLicence ? (
                      <p>{ImgLicence.name}</p>
                    ) : (
                      <div
                        className="btn btn-select-img button cleanbtn flex aic jc flex-col"
                        onClick={() =>
                          document
                            .getElementById("_upload-file_Licence")
                            .click()
                        }
                      >
                        <>Upload PDF Company Licence</>)
                      </div>
                    )}
                  </div>
                  <div className="r-img flex flex-col aic jc">
                    {picUrlTRN ? (
                      <div className="img-preview rel">
                        <img
                          src={
                            picUrlTRN
                              ? "/images/document.png"
                              : "/images/document.png"
                          }
                          className="img"
                          alt=""
                        />
                        <div
                          className="cross-icon flex aic jc abs"
                          onClick={(e) => {
                            setImgTRN("");
                            setPicUrlTRN(null);
                          }}
                        >
                          <CloseIcon />
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}
                    <input
                      className="input-img"
                      id="_upload-file_TRN"
                      type="file"
                      accept="/*"
                      onChange={(e) => {
                        setPicUrlTRN(URL.createObjectURL(e.target.files[0]));
                        dispatch(
                          uploadUserPictures(
                            e.target.files[0],
                            undefined,
                            setPicUrlTRN,
                            setImgTRN
                          )
                        );
                      }}
                    />
                    {picUrlTRN ? (
                      <p>{ImgTRN.name}</p>
                    ) : (
                      <div
                        className="btn btn-select-img button cleanbtn flex aic jc flex-col"
                        onClick={() =>
                          document.getElementById("_upload-file_TRN").click()
                        }
                      >
                        <>Upload PDF TRN Certificate</>)
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </>
        <div className="action flex">
          <button
            className="btn cleanbtn button font s16 b4"
            onClick={saveContactInfo}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditContactInfo;
