
import _ from "lodash";
import { Button, message, Popconfirm } from 'antd';
import { CaretDownOutlined, CaretUpOutlined, CloseOutlined } from '@ant-design/icons';
import { BaseViewer } from '../../BaseViewer';
import { MUtil } from "../../../framework/MUtil";
import { MFieldViewer } from "../../../framework/MFieldViewer";
import React from "react";
import { assembly } from '../../../framework/Assembly';

/**
 * 数据表格
 * 数据是这样的数组：
 *  [
 *    {from:"1606997544611",to:"", tillNow:true, company:"阿里巴巴", position:"CEO"},
 *    {from:"1606997544611",to:"", tillNow:true, company:"阿里巴巴", position:"CEO"},
 *  ]
 */
export class AArrayGrid extends BaseViewer {
  element() {
    const schema = this.props.schema;

    if(!schema.arrayMember) {
      return MUtil.error("arrayMember未定义", schema);
    }

    const members = schema.arrayMember.objectFields  // 成员是复杂结构
      || [{name:undefined, ...schema.arrayMember}]; // 成员是简单结构
    // if(!members) {
    //   return MUtil.error("AArrayGrid只适用于对象数组", schema);
    // }

    let data = super.getValue();
    if(!_.isArray(data)){ // 只接受数组
      data = [];
    }

    const cols = 1 + members.length;

    //let headTh = [<td key=":操作栏" width="40px" align="center" style={{backgroundImage: "linear-gradient(to bottom left, transparent calc(50% - 1px), #d3d3d3, transparent calc(50% + 1px))"}}></td>]

    let rows = [];
    for(let idx = 0; idx < data.length; idx ++){
      const i = idx;
      rows.push(<tr key={i}>
        {/* 各个字段 */}
        {
          members.map((f,idx)=>
            <td key={f.name + idx}>
              <MFieldViewer key={this.state.ctrlVersion + "." + f.name} parent={schema} morph={this.props.morph} schema={f} database={data} path={MUtil.jsonPath("[" + i + "]", f.name)} hideBorder={true} afterChange={(path, v, final):void => {
                super.changeValueEx(data, false, final);
              }}/> 
            </td>)
        }

        {/* 操作栏 */}
        <td key=":option" align="center">
          <CaretUpOutlined style={{display: "block"}}  hidden={data.length <= 1} onClick={()=>{
            if(i === 0){
              message.warn("已经到顶了");
            } else {
              const prev = data[i-1];
              data[i-1] = data[i];
              data[i] = prev;
              super.changeValueEx(data, true, true);
            }
          }}/>
          <Popconfirm
            title="确定要删除吗这一项吗？"
            onConfirm={()=>{
              data.splice(i,1);
              super.changeValueEx(data, true, true);
            }}
            okText="删除"
            cancelText="不删">
            <CloseOutlined style={{display: "block"}} hidden={ data.length == (schema.min ?? 0) }/>
          </Popconfirm>
          <CaretDownOutlined style={{display: "block"}} hidden={data.length <= 1} onClick={()=>{
            if(i === data.length - 1){
              message.warn("已经到底了");
            } else {
              const prev = data[i+1];
              data[i+1] = data[i];
              data[i] = prev;
              super.changeValueEx(data, true, true);
            }
          }}/>
        </td>
      </tr>);
    }

    const isMax = data.length >= (schema.max ?? Number.MAX_VALUE);
    return (
      <table key={this.props.path} className="AExperience M3_table" style={{width: "100%"}}><tbody>
        <tr key=":header">
          {members.map((f,i)=><th key={f.name + i + ":first"}>{f.label ?? f.name}</th>)}
          <td key=":操作栏" width="40px" align="center"></td>
        </tr>
        {rows}
        <tr key=":footer">
          {/* 增加按钮 */}
          <th key=":add" colSpan={cols}>
            <Button disabled={isMax}  key=":add" onClick={()=>{
              data.push(
                assembly.types[schema.arrayMember.type]?.createDefaultValue(assembly, schema.arrayMember)
              );
              super.changeValue(data);
            }}>增加一项</Button>
            {this.props.extra}
          </th>
        </tr>
      </tbody></table>
    )
  }
}
