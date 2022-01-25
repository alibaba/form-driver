import React from "react";
import { Radio } from "antd";
import _ from "lodash";
import { MFieldViewer } from "../../../framework/MFieldViewer";
import { MUtil } from "../../../framework/MUtil";
import { BaseViewer } from '../../BaseViewer';
import { MEnumType } from "../../../types/MEnumType";
import { assembly } from "../../../framework/Assembly";

// "其他(请填写)"这样的开放选项Radio的value
const OPEN_ENUM_RADIO_VALUE = -1;

/**
 * 单选框，用于enum
 * 支持开放选项。
 * 定义示例：
 * {label:"1.1 您的性别是", name:"gendar", type:"enum", option: [{label:"男", value:"M"},{label:"女", value:"F"}]},
 * {label:"1.1 您的性别是", name:"gendar", type:"enum", option:"男 女"},
 */
export class ARadio extends BaseViewer {
  /** 开放输入框的值 */
  _inputBoxValue: string = "";

  element(ctx) {
    const value = super.getValue();
    const option = MUtil.option(this.props.schema);
    const style = (this.props.schema.layoutHint ?? "v") === "v" ? { display: "block" } : undefined;

    let initIndex = undefined;
    const options = option.map((m: any, index) => {
      const isShow = MUtil.isShow(this.props.database, ctx.rootProps.schema?.objectFields, m.showIf)
      if (!isShow) return null;
      if (value === m.value) {
        initIndex = index;
      }
      return <Radio disabled={this.props.disable} key={index} value={index} style={style}>{m.label ?? m.value}</Radio>;
    });
    if (initIndex === undefined) {
      this._inputBoxValue = value;
      if (!_.isNil(value)) {
        initIndex = OPEN_ENUM_RADIO_VALUE;
      }
    }

    if (this.props.schema.openOption) {
      const editor = <MFieldViewer morph={this.props.morph} schema={this.props.schema.openOption} database={this} path="_inputBoxValue"
        afterChange={(path: string, str: any, final: boolean) => {
          const matchEnum = option.find(e => e.value === str);
          if (matchEnum) { // 不能让用户输入了某个候选值
            this._inputBoxValue = "";
            super.changeValueEx(str, true, final);
          } else {
            this._inputBoxValue = str;
            super.changeValueEx(this._inputBoxValue, false, final);
          }
        }}
        parent={this.props.schema} forceValid={false} disable={initIndex !== OPEN_ENUM_RADIO_VALUE}
        style={{ width: "inherit" }} />;

      options.push(<Radio disabled={this.props.disable} key={"_open_"} value={OPEN_ENUM_RADIO_VALUE}>
        <span style={{ marginRight: "10px" }}>{this.props.schema.openOption.label ?? "其他"}</span>
        {editor}
      </Radio>);
    }

    const p = this.props.schema.props ?? {};
    return <Radio.Group
      key={this.state.ctrlVersion}
      defaultValue={initIndex}
      onChange={(vv) => {
        let v = vv.target.value;
        if (v !== OPEN_ENUM_RADIO_VALUE) {
          super.changeValue(option[v].value);
        } else {
          if (!this._inputBoxValue) {
            this._inputBoxValue = "";
          }
          super.changeValue(this._inputBoxValue);
        }
      }}
      {...p}
      >
      {options}
    </Radio.Group>
  }
}