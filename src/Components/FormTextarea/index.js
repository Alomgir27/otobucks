import React from "react";
import { Form, Input } from "antd";

const { TextArea } = Input;
const FormTextarea = ({
  name,
  rules,
  placeholder,
  rows,
  title,
  onChange,
  value,
  disabled,
}) => {
  return (
    <Form.Item name={name} rules={rules}>
      <TextArea
        value={value}
        onChange={onChange}
        disabled={disabled}
        showCount
        title={title}
        placeholder={placeholder}
        rows={rows}
      />
    </Form.Item>
  );
};

export default FormTextarea;
