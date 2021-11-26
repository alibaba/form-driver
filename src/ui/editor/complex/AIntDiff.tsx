
import React from "react";
import { Radio } from 'antd';
import { BaseViewer } from "../../BaseViewer";
import { MUtil } from "../../../framework/MUtil";
import { UnderlineInputBox } from '../../widget/UnderlineInputBox';

/**
 * 类似这样分正负的数字：
 * 
 * 与去年同期(2019 年 1 月初-6 月底)相比，您的收入
 * (1)增长了(具体数字:约___万元) (2)下降了(具体数字:约___万元) (3) 基本没有变化
 */
export class AIntDiff extends BaseViewer {
  _posInputBoxValue?: number;
  _negInputBoxValue?: number;
  _radio?: number;

  element() {
    const value = super.getValue();
    const sign = this._radio ?? MUtil.sign(value);
    const radioStyle = {
      display: 'block',
      marginBottom: 3
    };

    return <Radio.Group key={this.state.ctrlVersion} defaultValue={sign} onChange={(v)=>{
      const sign = v.target.value;
      if(sign < 0){
        super.changeValue(this._negInputBoxValue);
      } else if(sign > 0){
        super.changeValue(this._posInputBoxValue);
      } else {
        super.changeValue(0);
      }
      this._radio = sign;
      }}>
      <Radio style={radioStyle} key={1} value={1}> 
        {this.props.schema.intDiff?.incLabel}
        <UnderlineInputBox pattern="\d*" type="number" style={{width:"5em"}} min={1} defaultValue={this._posInputBoxValue || undefined } onChange={(v)=> {
          const nv = parseInt(v.target.value);
          if(nv === 0){
            this._posInputBoxValue = undefined;
            super.changeValueEx(nv, true, false)
            this._radio = 0;
          } else {
            this._posInputBoxValue = nv;
            super.changeValue(nv)
          }
        }} disabled={!sign || sign <= 0} onBlur={()=>{
          super.changeValue(value)
        }}/>
        {this.props.schema.intDiff?.incLabelPostfix}
      </Radio>
      <Radio style={radioStyle} key={-1} value={-1}>
        {this.props.schema.intDiff?.decLabel}
        <UnderlineInputBox pattern="\d*" type="number" style={{width:"5em"}} size={10} min={1} defaultValue={this._negInputBoxValue || undefined} onChange={(v)=> {
          const nv = parseInt(v.target.value);
          if(nv === 0){
            this._negInputBoxValue = undefined;
            super.changeValueEx(nv, true, false)
            this._radio = 0;
          } else {
            this._negInputBoxValue = nv;
            super.changeValue(-nv)
          }
        }} disabled={!sign || sign >= 0} onBlur={()=>{
          super.changeValue(value)
        }}/>
        {this.props.schema.intDiff?.decLabelPostfix}
      </Radio>
      <Radio style={radioStyle} key={0} value={0} onClick={()=>super.changeValue(0)}>
        {this.props.schema.intDiff?.keep}
      </Radio>
    </Radio.Group>
  }
}
