import { Form, Select } from "antd";

import React from "react";

const { Option } = Select;

const SelectBox = ({
  size,
  data,
  country,
  value,
  defaultValue,
  name,
  rules,
  type,
  onChange,
  disabled,
  min,
  width,
}) => {
  const inputProps = {};
  if (type) inputProps.type = type || "text";
  if (min) inputProps.min = min;

  return (
    <Form.Item name={name} rules={rules}>
      <Select
        size={size ? size : "large"}
        showSearch
        value={value}
        style={{ borderRadius: 10, width: width ? width : "100%" }}
        defaultValue={defaultValue ? defaultValue : "Select"}
        onChange={onChange}
        disabled={disabled}
      >
        {data.map((d, i) => (
          <Option key={i} value={d.value}>
            {country ? d.value : d.title}
          </Option>
        ))}
      </Select>
    </Form.Item>
  );
};

export default SelectBox;
