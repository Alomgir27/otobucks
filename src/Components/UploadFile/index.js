import React from "react";
import { Upload } from "antd";
import { openNotification } from "../../helpers";
import "./styles.css";

export default function UploadFile({
  label,
  setFile,
  file,
  audio,
  fileIndex,
  test,
}) {
  const dummyRequest = ({ _, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  const beforeUploadAudio = (file) => {
    // extract file type
    const fileType = file.type.toLowerCase();

    const allowed = fileType.substring(0, 5) === "audio";

    if (!allowed) {
      openNotification(`Invalid file type selected. Select audio file please.`);
    }
    return allowed;
  };

  const beforeUpload = (file) => {
    return true;
  };

  const fileSelected = (e) => {
    if (e.file.percent === 100) {
      // extract selected file
      const file = e.file.originFileObj;

      // if file not available return
      if (!file) return;

      // set state with seleted file
      test ? setFile(file, fileIndex) : setFile(file);
      //setImageUrl(file.name)
    }
  };
  return (
    <div className="cst-textinput cst-text-width">
      <label className="fw600 fs24 lh48">{label}</label>

      <div
        className="uploadBox"
        style={{ textAlign: "center", justifyContent: "center" }}
      >
        <Upload
          dummyRequest={dummyRequest}
          showUploadList={false}
          beforeUpload={audio ? beforeUploadAudio : beforeUpload}
          onChange={(e) => fileSelected(e)}
        >
          <p style={{ marginTop: 8 }}>
            {file ? "File Selected" : "Upload File"}
          </p>
        </Upload>
      </div>
    </div>
  );
}
