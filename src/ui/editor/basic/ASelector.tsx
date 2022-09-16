import React from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Divider } from "antd";
import Select from "antd/lib/select";
import { MUtil } from "../../../framework/MUtil";
import { MEnumField, MProp } from '../../../framework/Schema';
import { BaseViewer } from '../../BaseViewer';
import { SelectBox } from "../../widget/SelectBox";
import _ from "lodash";
import { MFieldViewer } from '../../../framework/MFieldViewer';
import { MEnumType } from "../../../types/MEnumType";
import { assembly } from "../../../framework/Assembly";

/**
 * 下拉选择框
 * 定义示例： {label:"1.1 您的性别是",   name:"gendar",          type:"enum",    typeArg: [{label:"男", value:"M"},{label:"女", value:"F"}] },
 */
export class ASelector extends BaseViewer {
  /** 开放输入框的值 */
  _inputBoxValue: string = "";
  _enums: MEnumField[];

  constructor(p: MProp) {
    super(p);
    this._enums = _.cloneDeep(MUtil.option(this.props.schema));
  }

  element() {
    const value =super.getValue();

    const p = this.props.schema.props ?? {};
    if (MUtil.phoneLike()) {
      if (this.props.schema.openOption) {
        return MUtil.error("手机上的ASelector还不支持openOption");
      }
      return <SelectBox
        key={this.props.path}
        data={value}
        // @ts-ignore
        options={this._enums.map(e => { return { label: e.label ?? e.value?.toString(), value: e.value } })}
        {...p}
        onChange={(newValue?: string) => { super.changeValue(newValue) }} />
    } else {
      let initIndex = undefined;
      const options = this._enums.map((m, index) => {
        if (_.isObject(value)) {
          // @ts-ignore
          if (value.value === m.value) {
            initIndex = index;
          }
        } else {
          if (value === m.value) {
            initIndex = index;
          }
        }
        return <Select.Option key={index} value={index}>{m.label ?? m.value}</Select.Option>
      });
      return <Select
        key={this.props.path}
        defaultValue={initIndex}
        placeholder={super.getPlaceholder()}
        bordered={this.props.hideBorder ? false : true}
        //style={{minWidth: width + 20}}
        dropdownRender={menu => {
          return this.props.schema.openOption
            ? <>
              {menu}
              <Divider key="分割线" style={{ margin: '4px 0' }} />
              <div key="开放选择" style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                <MFieldViewer morph={this.props.morph} schema={this.props.schema.openOption} database={this} path="_inputBoxValue" parent={this.props.schema} forceValid={false} style={{ width: "inherit" }} />
                <Button shape="circle" icon={<PlusOutlined />} onClick={() => {
                  let matchEnum = this._enums.findIndex(e => e.value === this._inputBoxValue);
                  if (matchEnum < 0) {
                    matchEnum = this._enums.findIndex(e => e.label === this._inputBoxValue);
                  }
                  if (matchEnum >= 0) { // 不能让用户输入了某个候选值
                    super.changeValue(this._enums[matchEnum].value);
                  } else {
                    this._enums.unshift({ value: this._inputBoxValue, label: this._inputBoxValue });
                    this.setState({});
                  }
                }} />
              </div>
            </>
            : menu
        }}
        style={{ width: "100%" }}
        onChange={(vv: any) => {
          super.changeValue(p?.labelInValue ? this._enums[vv.value] : this._enums[vv].value)
        }}
        {...p}
      >
        {options}
      </Select>;
    }
  }
}