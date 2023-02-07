import "./styles.css";

import { Button } from "antd";
import React from "react";

export default function UploadFile({ style, fileSelected }) {
  const clickUpload = () => {
    document.getElementById("fileUpload").click();
  };

  return (
    <div style={style}>
      <Button className="upload-file-btn" onClick={clickUpload}>
        <input id="fileUpload" type="file" hidden onChange={fileSelected} />
        Upload Excel
      </Button>
    </div>
  );
}
