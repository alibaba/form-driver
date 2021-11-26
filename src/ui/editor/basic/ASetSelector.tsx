import React from "react";
import { Select } from "antd";
import { MUtil } from "../../../framework/MUtil";
import { BaseViewer } from "../../BaseViewer";
import _ from "lodash";
import { MSetType } from '../../../types/MSetType';
import { assembly } from '../../../framework/Assembly';

/**
 * 下拉框多选
 * 示例：{label:"1.13 除爱人/对象之外，目前和您一起生活的家庭成员包括(多选):",name:"familyAccompany",type:"set", editor:"ASetSelector", option: "父亲 母亲 孩子 爱人/对象的父亲 爱人/对象的母亲 兄弟姐妹"},
 * 值：["孩子", "父亲"]
 */
export class ASetSelector extends BaseViewer {
  element() {
    if(this.props.schema.openOption){
      return MUtil.error("尚不支持openOption", this.props.schema);
    }
    let initValues = super.getValue();
    
    // 给字段定义加上序号
    const option:any[] = MUtil.option(this.props.schema);
    option.forEach((e,index)=> e.index =index)

    // 把value数组转换成序号数组
    const value2Fields = _.keyBy(option, "value");
    const initIndexes = initValues?.map(v => value2Fields[v].index);

    const p = this.props.schema.props ?? {};
    return <Select
      key={this.props.path + "/" + this.state.ctrlVersion}
      mode="multiple"
      placeholder={this.props.schema.placeholder}
      optionFilterProp="children"
      style={this.props.style}
      defaultValue={initIndexes}
      onChange={(newIndexes: any)=>{
        let add = []; // 新加进去的
        let baseValues = [] // 原来就有的
        newIndexes.forEach(idx => {
          const v = option[idx].value;
          if(initValues?.indexOf(v) >= 0){
            baseValues.push(v);
          } else {
            add.push(v);
          }
        });

        if(add.length > 0){
          add.forEach(newOne => {
            baseValues = MSetType.change(true, newOne, baseValues, this.props.schema);
          });
        }
        super.changeValueEx(baseValues, newIndexes?.length != baseValues.length, true);
      }}
      {...p}
      >
      {option.map((item,index) => (
        <Select.Option key={index} value={index}>
          {item.label ?? item.value}
        </Select.Option>
      ))}
    </Select>;
  }
}
