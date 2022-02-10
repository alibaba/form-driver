import React from "react";
import _ from "lodash"
import { Input } from "antd";
import { BaseViewer } from '../../BaseViewer';

/**
 * 手机号/邮箱等输入框
 * cnPhone/tel/email
 */
export class ASpecInputBox extends BaseViewer {
  element() {
    const p = this.props.schema.props ?? {};
    const deepCloneP = _.cloneDeep(p)
    const selfOnChange = p.onChange
    delete deepCloneP.onChange
    
    return <Input
      {...super.antProp()}
      defaultValue={super.getValue()}
      onBlur={() => this.changeValueEx(super.getValue(), false, true)}
      onChange={(v) => {
        this.changeValueEx(v.target.value, false, false);
        selfOnChange && selfOnChange(v)
      }}
      {...deepCloneP}
    />;
  }
}

