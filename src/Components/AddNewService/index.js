import React from "react";
import { useDispatch } from "react-redux";
import { Select } from "antd";
import { CloseIcon } from "../../Icons";
import { updateUser } from "../../redux/actions/profile";

const { Option } = Select;

const AddNewService = ({
  setLoading,
  selectedIds,
  setOpen3,
  selectedService,
  handleChange,
  serviceCategories,
}) => {
  const dispatch = useDispatch();

  return (
    <div className="add-new-service flex">
      <div className="wrap flex flex-col">
        <div className="add-new-service-heading s18 font b5 flex aic jc-sb">
          <div> Add New Services </div>
          <div className="close-icon pointer" onClick={(e) => setOpen3(false)}>
            <CloseIcon />
          </div>
        </div>
        <div>
          <Select
            // mode="multiple"
            allowClear
            style={{ width: "100%" }}
            placeholder="select Category"
            rules={[{ required: true, message: "Required" }]}
            optionLabelProp="label"
            size="large"
            defaultValue={selectedService}
            onChange={handleChange}
          >
            {serviceCategories?.map((category, index) => {
              return (
                <Option
                  value={category?.title}
                  label={category?.title}
                  key={index}
                >
                  <div
                    style={{
                      height: "100%",
                      width: "100%",
                    }}
                    className="demo-option-label-item"
                  >
                    <span aria-label={category}>{category?.title}</span>
                  </div>
                </Option>
              );
            })}
          </Select>
        </div>
        <div className="action flex">
          <button
            className="btn cleanbtn button font s16 b4"
            onClick={() => {
              dispatch(
                updateUser(setLoading, { categories: selectedIds }, setOpen3)
              );
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewService;
