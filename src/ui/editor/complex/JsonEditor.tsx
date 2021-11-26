import React, { CSSProperties } from "react";
import _ from "lodash";
import { BaseViewer } from '../../BaseViewer';
import TextArea from 'antd/lib/input/TextArea';

/**
 * 用文本框编辑json object或者json array
 */
export class JsonEditor extends BaseViewer {
  error:string;

  element() {
    const value = super.getValue();
    let styles:CSSProperties = _.merge({minHeight:  "10em"}, this.props.style, this.props.schema.style);
    if(this.props.hideBorder){
      styles.border = "1px solid transparent";
    }
    if(this.error) {
      styles.border = "1px solid red";
    }

    return <TextArea style={styles} key={this.props.path} defaultValue={JSON.stringify(value,null,2)} onBlur={(v)=>{
      try{
        this.changeValue(JSON.parse(v.target.value));
      }catch(e){
      }
    }} onChange={(v)=>{
      try{
        JSON.parse(v.target.value);
        this.error = undefined;
      }catch(e){
        this.error = e.message;
      }
      this.setState({});
    }}/>
  }
}