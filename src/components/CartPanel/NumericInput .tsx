import { Input } from "antd";
import { memo, useCallback, useEffect, useState } from "react";

const NumericInput = (props: any) => {
  const { onChange, value, ...rest } = props;
  const [realValue, setRealValue] = useState(value);
  const handleChange = useCallback((e: any) => {
    const { value: val } = e.target;
    const reg = /^-?\d*$/;
    if ((!isNaN(val) && reg.test(val)) || val === "") {
      setRealValue(val);
    }
  }, []);

  const handleBlur = useCallback(() => {
    onChange(Number(realValue));
  }, [onChange, realValue]);

  useEffect(() => {
    setRealValue(value);
  }, [value]);

  return (
    <Input
      {...rest}
      style={{ width: 50, textAlign: "center" }}
      min={1}
      max={100}
      value={realValue}
      onBlur={handleBlur}
      onChange={handleChange}
      maxLength={25}
    />
  );
};

export default memo(NumericInput);
