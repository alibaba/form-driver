import React from "react";
import { Checkbox } from "antd";
import _ from "lodash";
import { MUtil } from "../../../framework/MUtil";
import { BaseViewer } from '../../BaseViewer';
import { MEnumField, MProp, ValueConst, MFieldSchemaAnonymity } from '../../../framework/Schema';
import { MFieldViewer } from "../../../framework/MFieldViewer";
import "./AKvSet.less";

const defaultBoxSchema = {type:"string", name:""} as MFieldSchemaAnonymity;

/**
 * 可以填值的多选，max=1时可以当单选用
 * B8: 您现在在做的事业务部门的岗位吗？
 * 1. 是，具体职位是 _______
 * 2. 否，我的部门是 _______
 */
export class AKvSet extends BaseViewer {
  _enumFields: MEnumField[];
  _enumValues: ValueConst[];

  /** 这个是开放输入框的值 */ 
  _inputBoxValue: ValueConst[];

  constructor(p:MProp){
    super(p);

    const data = super.getValue();
    this._enumFields = MUtil.option(this.props.schema);
    this._enumValues = this._enumFields.map(e=>e.value);
    this._inputBoxValue = this._enumFields.map(f=> data?.[f.value.toString()]);
  }

  _createBr(){
    return this.props.schema.layoutHint == "h" ? undefined: <div key={MUtil.unique()}/>;
  }

  element() {
    let data = super.getValue();
    if(!_.isPlainObject(data)) {
      data = {};
    }

    let checkboxs = this._enumFields.map((m, index)=>{
      const select = _.has(data, m.value.toString());
      const itemKey = m.value?.toString();
      return <div key={itemKey} className={`kvSet_${this.props.schema.layoutHint}`}>
       <Checkbox disabled={this.props.disable} checked={select} onChange={(e)=>{
        let c = e.target.checked;
        let update = false;
        if(c) {
          data[itemKey] = this._inputBoxValue?.[index];
          const keys = Object.keys(data);
          for(let k of keys) {
            if(Object.keys(data).length > this.props.schema.max) {
              if( k != itemKey ) {
                delete data[k];
                update = true;
              }
            } else {
              break;
            }
          }
        } else {
          delete data[m.value?.toString()]
        }
        super.changeValueEx(data, update, true);
      }}/>
      
      <div style={{display: "inline-block", marginLeft:5, marginRight:10, marginBottom:3}}>
        {m.label ?? m.value}
        <div style={{display:"inline-block", paddingLeft: 10}}>
          <MFieldViewer
            morph={this.props.morph}
            schema={this.props.schema.openOption ?? defaultBoxSchema}
            database={this}
            parent={this.props.schema} forceValid={false} 
            disable={this.props.disable || !select}
            path={"_inputBoxValue[" + index + "]"} afterChange={(path:string, str:any, final:boolean) => {
              data[m.value?.toString()] = this._inputBoxValue[index];
              super.changeValueEx(data, false, final);
            }} />
        </div>
      </div>
      {this._createBr()}
      </div>
    });
    return checkboxs;
  }
}
