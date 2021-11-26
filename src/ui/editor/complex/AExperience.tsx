


import _ from "lodash";
import { AArrayGrid } from './AArrayGrid';
import React from 'react';
import Button from 'antd/lib/button';
import { BaseViewer } from '../../BaseViewer';
import { MUtil } from "../../../framework/MUtil";
import { MFieldSchemaAnonymity } from "../../../framework/Schema";

const RANGE_FNAME = "_range";

/**
 * 经历，可以用于教育经历、工作经历等
 * 数据类似以下数组：
 *  [
 *    {from:"1606997544611",to:"", tillNow:true, company:"阿里巴巴", position:"CEO"},
 *    {from:"1606997544611",to:"", tillNow:true, company:"阿里巴巴", position:"CEO"},
 *      ...
 *  ]
 * 
 */
export class AExperience extends BaseViewer {
  _submitData(arrayGridData: any, sort:boolean){
    // 修改后，把数据转换回来再提交
    let experienceData = arrayGridData.map((e: any) => {
      let item = {
        ...e,
        from: _.get(e, RANGE_FNAME + "[0]"),
        to: _.get(e, RANGE_FNAME + "[1]"),
        tillNow: _.get(e, RANGE_FNAME + "[2]"),
      }
      delete item[RANGE_FNAME];
      return item;
    });

    if(sort){
      experienceData.sort((a:any,b:any) => a.from - b.from)
    }
    super.changeValueEx(experienceData, !!sort, true);
  }

  element() {
    if(!this.props.schema.experience) {
      return MUtil.error("experience未定义", this.props.schema);
    }
    
    // 复用AArrayGrid，下面构造个schema给它
    const arrayGridSchema:MFieldSchemaAnonymity = {
      type:"array",
      dataFormat: this.props.schema.dataFormat,
      arrayMember:{
        type:"object",
        objectFields:[
          {name: RANGE_FNAME, type: "dateRange", label:"起止时间", dateRange: this.props.schema.dateRange },
          ...this.props.schema.experience.members
        ]
      }
    };
    // 转换一套数据给arrayGrid
    let data = super.getValue();
    if(!_.isArray(data)){ // 只接受数组
      data = [];
    }
    const arrayGridData = data.map((e: any)=>{
      let a = _.clone(e);
      a[RANGE_FNAME] = [e.from, e.to, e.tillNow]
      delete a.from;
      delete a.to;
      delete a.tillNow;
      return a
    });

    return <AArrayGrid key={this.state.ctrlVersion} schema={arrayGridSchema} database={arrayGridData} path="" 
      morph={this.props.morph}
      extra={<Button onClick={()=>{
        this._submitData(arrayGridData, true);
      }} >自动排序</Button>}
      afterChange={(path,v, blur) => {
        this._submitData(arrayGridData, false);
      }
    }/>;
  }
}
