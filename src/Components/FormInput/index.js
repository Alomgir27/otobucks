import React from "react";
import { Form, Input } from "antd";

const FormInput = ({
  name,
  rules,
  placeholder,
  type,
  className,
  title,
  onChange,
  disabled,
  addonBefore,
  addonAfter,
  reference,
  min,
  value,
}) => {
  const inputProps = {};
  if (type) inputProps.type = type || "text";
  if (min) inputProps.min = min;

  return (
    <Form.Item name={name} rules={rules} type={type}>
      <Input
        ref={reference}
        value={value}
        addonBefore={addonBefore}
        addonAfter={addonAfter}
        disabled={disabled}
        title={title}
        onChange={onChange}
        className={className}
        placeholder={placeholder}
        {...inputProps}
      />
    </Form.Item>
  );
};

export default FormInput;
