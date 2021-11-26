import React from "react";
import _ from "lodash";
import { BaseViewer } from "../../BaseViewer";
import { InputNumber } from "antd";

/**
 * 输入整数的输入框
 * 定义示例：{label:"2.3 请问今年以来您平均每月工作多少天?",name:"workdayPerMonth", type:"int"},
 */
export class AIntBox extends BaseViewer {
  element() {
    const p = this.props.schema.props ?? {};
    const props = {
      ...super.antProp(),
      bordered: undefined,
      style: {border: this.props.hideBorder ? "none" : undefined, ...this.props.style},
      min: this.props.schema.min,
      max: this.props.schema.max,
      // type: "number",
      pattern: "\\d*",
      defaultValue: super.getValue(),
      onChange: (v)=>{
        let n: number | undefined = Number(v)
        if(_.isNaN(n)){
          n = undefined;
        }
        if (p.onChange) p.onChange(n)
        console.log(n)
        this.changeValueEx(n, false, false);
      },
      onBlur: () =>{
        if (p.onBlur) p.onBlur()
        this.changeValueEx(super.getValue(), false, true);
      },
      ...p,
    }
    return <InputNumber {...props}></InputNumber>
  }
}
