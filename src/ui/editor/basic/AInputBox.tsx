import React from "react";
import { CloseOutlined } from "@ant-design/icons";
import { Input } from "antd";
import TextArea from "antd/lib/input/TextArea";
import _ from "lodash";
import { BaseViewer } from '../../BaseViewer';
import { MProp } from "../../../framework/Schema";


export class AInputBox extends BaseViewer {
  value: string;

  constructor(p:MProp){
    super(p);
    this.value = super.getValue();
  }

  element() {
    const lines = this.props.schema.stringLines ?? 1;
    const p = this.props.schema.props ?? {};
    const commonProps = {
      defaultValue:this.getValue(), 
      key:this.props.path, 
      onChange: (v:any)=> { this.value = v.target.value; this.changeValueEx(this.value, false, false) },
      onBlur: () => this.changeValue(this.value),
      placeholder: super.getPlaceholder(),
      bordered: this.props.hideBorder ? false : true,
      disabled: this.props.disable,
      maxLength: this.props.schema.max,
      ...p,
    };

    if(lines === 1) { // 单行
      let addon = undefined;
      if(!_.isNil(this.props.removeButton)){
        addon = <CloseOutlined
          className={this.props.removeButton ? "AForm_removeBtn" : "AForm_removeBtn_disabled"} 
          onClick={() => super.changeValue(undefined)}
          disabled={this.props.removeButton}/>
      }
      const inputProps = {
        className: "AInputBox",
        style: this.props.style,
        ...commonProps
      }
      //if(addon) {
        return <Input {...inputProps} addonAfter={addon}/>
      // } else {
      //   return <UnderlineInputBox {...inputProps}/>; // 等 UnderlineInputBox 支持addonAfter，上面的就能干掉了
      // }
    } else{ // 多行
      let styles:any = {minHeight: lines + "em"};
      if(this.props.hideBorder){
        styles.border = "none";
      }
      return <TextArea style={styles} {...commonProps}/>
    }
  }
}
