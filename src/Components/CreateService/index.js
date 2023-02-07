import React, { useState } from "react";
import { useHistory } from "react-router";
import { Select } from "antd";
import { CloseIcon } from "../../Icons";

const { Option } = Select;

const CreateService = ({ setOpenDialogue, serviceCategories }) => {
  const history = useHistory();
  const [selectedService, setSelectedService] = useState();

  const createService = () => {
    if (!selectedService) {
      return;
    }
    history.push("/service-form?type=create", selectedService);
  };

  return (
    <div className="add-new-service flex">
      <div className="wrap flex flex-col">
        <div className="add-new-service-heading s18 font b5 flex aic jc-sb">
          <div>
            {" "}
            Please select the category of the service you want to create{" "}
          </div>
          <div
            className="close-icon pointer"
            onClick={() => {
              setOpenDialogue(false);
            }}
          >
            <CloseIcon />
          </div>
        </div>
        <div>
          <Select
            style={{ width: "100%" }}
            placeholder="Select Category"
            rules={[{ required: true, message: "Required" }]}
            optionLabelProp="label"
            size="large"
            onChange={(value) => setSelectedService(value)}
          >
            {serviceCategories.map((service, index) => {
              return (
                <Option
                  value={service?.slug}
                  label={service?.title}
                  key={index}
                >
                  <div
                    style={{
                      height: "100%",
                      width: "100%",
                    }}
                    className="demo-option-label-item"
                  >
                    <span aria-label={service}>{service?.title}</span>
                  </div>
                </Option>
              );
            })}
          </Select>
        </div>
        <div className="action flex">
          <button
            className="btn cleanbtn button font s16 b4"
            onClick={createService}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateService;
