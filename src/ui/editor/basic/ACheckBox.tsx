import React from "react";
import { Checkbox } from "antd";
import _ from "lodash";
import { MUtil } from "../../../framework/MUtil";
import { BaseViewer } from '../../BaseViewer';
import { MEnumField, MProp, ValueConst } from '../../../framework/Schema';
import { MSetType } from '../../../types/MSetType';
import { MFieldViewer } from "../../../framework/MFieldViewer";
import { assembly } from "../../../framework/Assembly";

function ACheckBoxLabel(field: MEnumField) {
  if (field.html) {
    return <div dangerouslySetInnerHTML={{ __html: field.html }} />
  } else {
    return field.label ?? field.value
  }
}

/**
 * 多选
 * 示例：{label:"1.13 除爱人/对象之外，目前和您一起生活的家庭成员包括(多选):",name:"familyAccompany",type:"set", option: "父亲 母亲 孩子 爱人/对象的父亲 爱人/对象的母亲 兄弟姐妹"},
 * 值：["孩子", "父亲"]
 */
export class ACheckBox extends BaseViewer {
  _enumFields: MEnumField[];
  _enumValues: ValueConst[];

  /** 这个是开放输入框的值 */
  _inputBoxValue: ValueConst;

  constructor(p: MProp) {
    super(p);
    this._enumFields = MUtil.option(this.props.schema);
    this._enumValues = this._enumFields.map(e => e.value);

    const openOpt = p.schema.openOption ?? p.schema.setOpen;
    if(openOpt) {
      this._inputBoxValue = 
        _.first(_.difference(super.getValue(), this._enumValues)) ?? 
        assembly.types[openOpt.type].createDefaultValue(assembly, openOpt);
    }
  }

  _createBr() {
    return this.props.schema.layoutHint == "h" ? undefined : <div key={MUtil.unique()} />;
  }

  element(ctx) {
    let data: any[] = super.getValue()

    const openIndex = MSetType.openValueIndex(this.props.schema, data);
    let checkboxs: any[] = this._enumFields.map((m: any, index) => {
      const isShow = MUtil.isShow(this.props.database, ctx.rootProps.schema?.objectFields, m.showIf)
      if (!isShow) return null;
      return [
        <Checkbox key={index} disabled={this.props.disable} checked={_.includes(data, m.value)} onChange={(e) =>
          super.changeValue(MSetType.change(e.target.checked, m.value, data, this.props.schema))}>
          {ACheckBoxLabel(m)}
        </Checkbox>,
        this._createBr()
      ]
    });

    // 开放选项
    if (this.props.schema.openOption) {
      checkboxs.push(
        <Checkbox
          disabled={this.props.disable}
          key="opened:"
          checked={openIndex >= 0}
          onChange={(e) => {
            if(e.target.checked) {
              super.changeValue(MSetType.change(true, this._inputBoxValue, data, this.props.schema))
            } else {
              super.changeValue(MSetType.clearOpenValue(this.props.schema, data, false)) // 不能用MSetType.change，因为可能有多个开放值
            }
          }}>
          <span style={{ marginRight: "10px" }}>{this.props.schema.openOption.label ?? "其他"}</span>
          <MFieldViewer morph={this.props.morph} schema={this.props.schema.openOption} database={this} path="_inputBoxValue" afterChange={(path: string, str: any, final: boolean) => {
            const matchEnum = this._enumFields.find(e => e.value === str);
            if (matchEnum) { // 不能让用户输入某个枚举值
              this._inputBoxValue = "";
              _.remove(data, (e) => !this._enumValues.includes(e))
              if (!data.includes(str)) {
                data.push(str);
              }
              super.changeValueEx(data, true, final);
            } else {
              const idx = data.findIndex(v => !this._enumValues.includes(v));
              if (!_.isNil(idx)) {
                this._inputBoxValue = str;
                data[idx] = str;
                super.changeValueEx(data, false, final);
              }
            }
          }} parent={this.props.schema} forceValid={false} disable={openIndex < 0} style={{ width: "inherit" }} />
        </Checkbox>,
        this._createBr()
      );
    }

    return checkboxs;
  }
}
