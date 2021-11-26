
import React from "react";
import { Button, List } from "antd";
import { CloseCircleFilled } from '@ant-design/icons';
import "./AArray.less";
import { BaseViewer } from '../../BaseViewer';
import { MFieldSchemaAnonymity } from "../../../framework/Schema";
import { MFieldViewer } from "../../../framework/MFieldViewer";
import { MUtil } from "../../../framework/MUtil";
import { assembly } from "../../../framework/Assembly";

const NO_REMOVE_BTN: {[type:string]:boolean} = {"string":true};

/** @deprecated Ant的list，也不好看 */
export class AArray extends BaseViewer {
  _removeClicked(index: number) {
    const value:any[] = super.getValue() ?? [];
    let nv:any[]|undefined = value.filter((v,idx)=>idx !== index);
    if(nv.length === 0) {
      nv = undefined;
    }
    super.changeValueEx(nv, true, true);
  }

  /** 不同的数组成员类型，有不同的渲染方式 */
  _renderItem(memberSchema:MFieldSchemaAnonymity, itemData: any, index: number, removeButton?: boolean){
    return [
      removeButton && !NO_REMOVE_BTN[memberSchema.type]
      ? <CloseCircleFilled key={"closebtn:" + index} style={{marginLeft: 10}} size={32} onClick={()=>{  // FIXME 删除按钮都移到元素上
        this._removeClicked(index);
      }}/>
      :undefined,

      <div key={index + ":" + this.state.ctrlVersion} className="AArray_item">
        <MFieldViewer morph={this.props.morph}  key={index} schema={memberSchema} database={this.props.database} path={this.props.path + "[" + index + "]"} afterChange={(path:string, newVal:any, blur:boolean) => {
          if(newVal === undefined) { // 删除
            this._removeClicked(index);
          } else { // 修改
            this.props.afterChange?.(path, newVal, blur);
            this.setState({}); // 子元素变化，可能影响校验状态，所以刷新下
          }
        }} parent={this.props.schema} forceValid={this.props.forceValid} removeButton={removeButton}/>
      </div>
    ]
  }

  element() {
    const schema = this.props.schema;
    const memberSchema = schema.arrayMember;
    if(!memberSchema) {
      return MUtil.error(`缺少arrayMember属性`, schema);
    }
    

    if(memberSchema.type === "object" || memberSchema.type==="string"){
      const data:any[] = super.getValue() ?? [];
      const isMax = data.length >= (schema.max ?? Number.MAX_VALUE);
      const min = schema.min ?? 0;
      const max = schema.max ?? Number.MAX_VALUE;
      
      if(memberSchema.type === "string") {
        const n = Math.max(min, data.length);
        const removeButton = max === min ? undefined : n > min;
        let arr = [];
        for(let i = 0; i < n; i ++) {
          arr.push(this._renderItem(memberSchema, data[i], i, removeButton));
        }
        if(n < max) {
          arr.push(<div key=":add" className="AArray_addBtn">
          <Button key=":加一项按钮" onClick={() => {
            const d = super.getValue() ?? [];
            while(d.length < n+1){
              d.push(undefined);
            }
            super.changeValue(d);
          }}>{schema.arrayAddLabel ?? "+"}</Button>
          </div>)
        }
        return arr;
      } else {
        return <List
          bordered
          footer={<Button disabled={isMax} key=":加一项按钮" onClick={()=>{
            data.push(
              assembly.types[schema.arrayMember.type]?.createDefaultValue(assembly, schema.arrayMember)
            );
            super.changeValue(data);
          }} >增加一项</Button>}
          dataSource={data}
          renderItem={  (valueItem,index) => {
            let noRemoveBtn = NO_REMOVE_BTN[memberSchema.type] // 为了美观，某些数组元素不需要关闭按钮
            if(schema.min && schema.min === schema.max){ // 最大项数=最小项数时，不要删除按钮
              noRemoveBtn = true;
            }
            return <List.Item key={index}>
            {this._renderItem(memberSchema, valueItem, index, !noRemoveBtn)}
            </List.Item>
          }}/>;
      }
    } else {
      return MUtil.error(`成员类型${memberSchema.type}，无法编辑`, schema);
    }
  }
}