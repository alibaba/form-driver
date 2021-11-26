// 统一移动端的Picker和PC的Selector

import { Select } from "antd";
import { Picker } from "antd-mobile";
import { PickerData } from "antd-mobile/lib/picker/PropsType";
import _ from "lodash";
import React from "react";
//import { InputHTMLAttributes } from "react";
import { MUtil } from '../../framework/MUtil';

interface Prop { // extends InputHTMLAttributes<HTMLInputElement> {
  data: string;
  options: PickerData[],
  onChange: (newValue?:string)=>void;
  onBlur?:()=>void;
  
  // 是否允许开放选项
  openLabel?: string;
}

export class SelectBox extends React.Component<Prop, any> {
  render(){
    if(MUtil.phoneLike()) {
      const looked = this.props.options.find(o=>o.value === this.props.data);
      const backfillClass = looked ? "backfill" : "backfill_empty";

      return <Picker extra="请选择(可选)"
        cols={1}
        data={this.props.options}
        value={[this.props.data]}
        onOk={e => this.props.onChange(_.last(e))}
        onDismiss={() => {
          if(this.props.onBlur) { this.props.onBlur() }
        }}>
        <div className={backfillClass}>{looked?.label ?? "点击选择"}</div>
      </Picker>
    } else {
      return <Select defaultValue={this.props.data}> 
        {this.props.options.map(o=><Select.Option value={o.value}>{o.label ?? o.value}</Select.Option>)} 
      </Select>;
    }
  }
}