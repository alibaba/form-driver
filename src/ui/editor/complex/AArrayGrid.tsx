
import _ from "lodash";
import { Button, message, Popconfirm } from 'antd';
import { CaretDownOutlined, CaretUpOutlined, CloseOutlined } from '@ant-design/icons';
import { BaseViewer } from '../../BaseViewer';
import { MUtil } from "../../../framework/MUtil";
import { MFieldViewer } from "../../../framework/MFieldViewer";
import React from "react";
import { assembly } from '../../../framework/Assembly';

function uuid(len = 8, radix = 16) {
  let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  let uuid = [];
  let i = 0;
  radix = radix || chars.length;

  if (len) {
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
  } else {
      let r;
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';

      for (i = 0; i < 36; i++) {
          if (!uuid[i]) {
              r = 0 | Math.random() * 16;
              uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
          }
      }
  }

  return uuid.join('');
}


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

    if (!schema.arrayMember) {
      return MUtil.error("arrayMember未定义", schema);
    }

    const members = schema.arrayMember.objectFields  // 成员是复杂结构
      || [{ name: undefined, ...schema.arrayMember }]; // 成员是简单结构
    // if(!members) {
    //   return MUtil.error("AArrayGrid只适用于对象数组", schema);
    // }

    let data = super.getValue();
    if (!_.isArray(data)) { // 只接受数组
      data = [];
    }

    const cols = 1 + members.length;

    //let headTh = [<td key=":操作栏" width="40px" align="center" style={{backgroundImage: "linear-gradient(to bottom left, transparent calc(50% - 1px), #d3d3d3, transparent calc(50% + 1px))"}}></td>]

    let rows = [];
    for (let idx = 0; idx < data.length; idx++) {
      const i = idx;
      rows.push(<tr key={i}>
        {/* 各个字段 */}
        {
          members.map((f, idx) =>
            <td key={f.name + idx}>
              <MFieldViewer key={this.state.ctrlVersion + "." + f.name} parent={schema} morph={this.props.morph} schema={f} database={data} path={MUtil.jsonPath("[" + i + "]", f.name)} hideBorder={true} afterChange={(path, v, final): void => {
                super.changeValueEx(data, false, final);
              }} />
            </td>)
        }

        {/* 操作栏 */}
        <td key=":option" align="center">
          <CaretUpOutlined style={{ display: "block" }} hidden={data.length <= 1} onClick={() => {
            if (i === 0) {
              message.warn("已经到顶了");
            } else {
              const prev = data[i - 1];
              data[i - 1] = data[i];
              data[i] = prev;
              super.changeValueEx(data, true, true);
            }
          }} />
          <Popconfirm
            title="确定要删除吗这一项吗？"
            onConfirm={() => {
              data.splice(i, 1);
              super.changeValueEx(data, true, true);
            }}
            okText="删除"
            cancelText="不删">
            <CloseOutlined style={{ display: "block" }} hidden={data.length == (schema.min ?? 0)} />
          </Popconfirm>
          <CaretDownOutlined style={{ display: "block" }} hidden={data.length <= 1} onClick={() => {
            if (i === data.length - 1) {
              message.warn("已经到底了");
            } else {
              const prev = data[i + 1];
              data[i + 1] = data[i];
              data[i] = prev;
              super.changeValueEx(data, true, true);
            }
          }} />
        </td>
      </tr>);
    }

    const isMax = data.length >= (schema.max ?? Number.MAX_VALUE);
    return (
      <table key={this.props.path} className="AExperience M3_table" style={{ width: "100%" }}><tbody>
        <tr key=":header">
          {members.map((f, i) => <th key={f.name + i + ":first"}>{f.label ?? f.name}</th>)}
          <td key=":操作栏" width="40px" align="center"></td>
        </tr>
        {rows}
        <tr key=":footer">
          {/* 增加按钮 */}
          <th key=":add" colSpan={cols}>
            <Button disabled={isMax} key=":add" onClick={() => {
              let newItem = assembly.types[schema.arrayMember.type]?.createDefaultValue(assembly, schema.arrayMember)
              {/* 新增时支持要带入上一项的数据 */}
              if (schema.arrayMember.copyFields && data.length > 0) {
                const last = data[data.length - 1]
                if (last) {
                  newItem = {}
                  schema.arrayMember.copyFields.forEach(item => {
                    newItem[item] = last[item]
                  })
                }
              }
              data.push(newItem);
              if (schema.autoValue) {
                // 自动增加 value 属性
                data.forEach(element => {
                  if (!element.value) element.value = uuid()
                });
              }
              console.log('data', data)
              super.changeValue(data);
            }}>增加一项</Button>
            {this.props.extra}
          </th>
        </tr>
      </tbody></table>
    )
  }
}
