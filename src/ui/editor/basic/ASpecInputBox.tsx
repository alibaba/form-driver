import React from "react";
import { Input } from "antd";
import { BaseViewer } from '../../BaseViewer';

/**
 * 手机号/邮箱等输入框
 * cnPhone/tel/email
 */
export class ASpecInputBox extends BaseViewer {
  element() {
    const p = this.props.schema.props ?? {};
    return <Input
      {...super.antProp()}
      defaultValue={super.getValue()}
      onBlur={() => this.changeValueEx(super.getValue(), false, true)}
      onChange={(v) => this.changeValueEx(v.target.value, false, false)} 
      {...p}
    />;
  }
}
