import React, { useState, useEffect } from "react";
import { Input, Spin, Button } from "antd";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import Grid from "@mui/material/Grid";
import { openNotification } from "../../helpers";
import { post, get } from "../../services/RestService";
import { s3Client } from "../../constants";
import { CloseIcon } from "../../Icons";
import "./styles.scss";

const EstimationSettings = () => {
  const [loading, setLoading] = useState(false);
  const [imagePath, setImagePath] = useState();
  const [imageUploading, setImageUploading] = useState();
  const [settingsData, setSettingsData] = useState({
    invoiceTitle: "",
    website: "www.otobucks.com",
    taxNumber: "",
    taxPercentage: "",
    logoImage: "",
  });

  const config = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };

  const getSettings = () => {
    setLoading(true);
    get("/estimate-setting/", config)
      .then((res) => {
        const estimationSettings = res?.result[0];
        setSettingsData({
          invoiceTitle: estimationSettings?.invoiceTitle,
          // website: estimationSettings?.website,
          website: "www.otobucks.com",
          taxNumber: estimationSettings?.taxNumber ?? "",
          taxPercentage: estimationSettings?.taxPercentage,
          logoImage: estimationSettings?.logoImage,
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    getSettings();
  }, []);

  //Upload Image on S3 Bucket
  async function uploadImg_S3(e) {
    try {
      setImageUploading(true);
      let imageName = e.target.files[0].name;
      const options = {
        Key: imageName,
        Bucket: "cdn.carbucks.com",
        Body: e.target.files[0],
      };

      await s3Client.send(new PutObjectCommand(options));
      let s3ImgLink = `https://s3.amazonaws.com/cdn.carbucks.com/${imageName}`;

      if (s3ImgLink) {
        setSettingsData((prev) => ({
          ...prev,
          logoImage: s3ImgLink,
        }));
      }
      setImageUploading(false);
    } catch (error) {
      setImageUploading(false);
    }
  }

  const handleSubmitForm = () => {
    const keys = Object.keys(settingsData);
    for (let i = 0; i < keys.length; i++) {
      if (keys[i] !== "taxNumber" && !settingsData[keys[i]]) {
        openNotification(
          keys[i] === "logoImage"
            ? "Please upload logo image"
            : "Please enter all required fields"
        );
        return;
      }
    }

    const formData = new FormData();
    Object.keys(settingsData).forEach((key) =>
      formData.append(key, settingsData[key])
    );
    post("/estimate-setting", formData, config)
      .then(() => {
        openNotification("Settings updated successfully");
      })
      .catch((err) => {
        err?.message && openNotification(err.message);
      });
  };

  return (
    <div id="users" className="_estimation_settings_container">
      {loading ? (
        <div className="_settings_loader">
          <Spin size="default" />
        </div>
      ) : (
        <>
          <div className="users-wrapper">
            <div className="_estimation_settings_text">
              <h1>Estimation Settings</h1>
            </div>
            <br />
            <div>Invoice Title</div>
            <div className="_purchase__search_main1">
              <Input
                placeholder="Enter Invoice Title"
                value={settingsData.invoiceTitle}
                onChange={(e) =>
                  setSettingsData((prev) => ({
                    ...prev,
                    invoiceTitle: e.target.value,
                  }))
                }
                className="_purchase_search_input2"
              />
            </div>
            <div className="_tax_invoice_text">Tax Number (Optional)</div>
            <div className="_purchase__search_main1">
              <Input
                placeholder="Enter Tax Number"
                value={settingsData.taxNumber}
                onChange={(e) =>
                  setSettingsData((prev) => ({
                    ...prev,
                    taxNumber: e.target.value,
                  }))
                }
                className="_purchase_search_input2"
              />
            </div>
            <div className="_tax_invoice_text">Tax Percentage</div>
            <div className="_purchase__search_main1">
              <Input
                type="number"
                placeholder="Enter Tax Percentage"
                value={settingsData.taxPercentage}
                onChange={(e) =>
                  setSettingsData((prev) => ({
                    ...prev,
                    taxPercentage: e.target.value,
                  }))
                }
                className="_purchase_search_input2"
              />
            </div>
          </div>
          <div className="search-btns-container">
            <Grid container spacing={2}>
              <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                <div className="img-sec flex flex-col aic jc">
                  {imageUploading ? (
                    <div className="_settings_img_spinner">
                      <Spin size="large" />
                    </div>
                  ) : (
                    <>
                      <input
                        className="input-img "
                        id="upload-file_Img"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          let file = e.target.files[0];
                          uploadImg_S3(e);
                          file && setImagePath(URL.createObjectURL(file));
                        }}
                      />
                      <div
                        className="flex aic jc flex-col w200"
                        onClick={() =>
                          document.getElementById("upload-file_Img").click()
                        }
                      />
                      {(imagePath || settingsData?.logoImage) && (
                        <div
                          className="_image_close_icon pointer"
                          onClick={() => {
                            setImagePath(null);
                            setSettingsData((prev) => ({
                              ...prev,
                              logoImage: null,
                            }));
                          }}
                        >
                          <CloseIcon />
                        </div>
                      )}
                      <img
                        src={
                          imagePath ?? settingsData?.logoImage ?? "/upload.png"
                        }
                        alt="upload box"
                        className="_upload_image-box"
                        onClick={() =>
                          document.getElementById("upload-file_Img").click()
                        }
                      />
                    </>
                  )}
                </div>
              </Grid>
            </Grid>
          </div>
          <div className="search-btns-container">
            <Grid container spacing={2}>
              <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                <div>
                  <p>Website</p>
                  <Input
                    placeholder="Enter your website"
                    value={settingsData.website}
                    disabled
                    onChange={(e) =>
                      setSettingsData((prev) => ({
                        ...prev,
                        website: e.target.value,
                      }))
                    }
                    className="_purchase_search_input2"
                  />
                </div>
              </Grid>
            </Grid>
          </div>
          <div className="save-changes">
            <Button
              className="mt30"
              type="primary"
              htmlType="submit"
              onClick={() => handleSubmitForm()}
            >
              Save Changes
            </Button>
          </div>

          <div className="search-btns-container">
            <div className="mb300"></div>
          </div>
        </>
      )}
    </div>
  );
};

export default EstimationSettings;
