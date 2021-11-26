
import React from "react";
import { Ajax } from '../../../framework/Ajax';
import _ from "lodash";
import { MUtil } from '../../../framework/MUtil';
import { Cascader } from 'antd';
import { MFieldSchema } from '../../../framework/Schema';
import { Picker } from 'antd-mobile';
import { BaseViewer } from "../../..";


export function labelExpr(d: any, remote: MFieldSchema["remote"]) {
  let script = "const {" + _.keys(d).join(',') + "} = d; return " + remote.labelExpr;
  return new Function("d", "_", script)(d, _);
}

export function convert(node = {}, dataPath, valuePath, childPath) {
  var newNode = {};
  newNode['value'] = node[valuePath];
  newNode['label'] = node[dataPath];

  if (node[childPath] && node[childPath].length > 0) {
    let child = [];
    node[childPath].map((item) => {
      child.push(convert(item, dataPath, valuePath, childPath))
    })
    newNode['children'] = child
  }
  return newNode
}

/* 树的查找 如该数据格式下查找id为3的元素
  {id: 2, name: 'test', data: [{id: 3, name: 'yy'}]} => {id: 3, name: 'yy', type: 'ORG'}
*/
export function findById(node, id, labelPath, valuePath, childPath) {
  if (node[valuePath] == id) {
    let res = {
      label: node[labelPath],
      value: id
    }
    return res;
  }
  if (node[childPath] && node[childPath].length > 0) {
    for (var i = 0; i < node[childPath].length; i++) {
      let findItem = findById(node[childPath][i], id, labelPath, valuePath, childPath);
      if (findItem !== -1) {
        return findItem
      }
    }
  }
  return -1
}

export class ACascadePicker extends BaseViewer {
  fetchCandidate: (key: string) => void;

  constructor(props) {
    super(props);
  }

  element() {
    let show = super.getValue() || [];
    if (!_.isArray(show)) {
      show = [];
    }
    const candidate = MUtil.option(this.props.schema);

    const p = this.props.schema.props ?? {};

    if (MUtil.phoneLike()) {
      return <>
        {/* <Picker
            data={this.props.schema.option}
            extra="请选择(可选)"
            cols={2}
            value={show}
            onChange={v => {
              console.log(v);
              super.changeValue(v);
            }}
            onOk={v => {
              console.log(v);
              super.changeValue(v);
            }}
            {...p}
            >
                <div className="backfill"> {show.length > 0 ? show.join('-') : '请点击选择' } </div>
        </Picker> */}
      </>
    } else {
      return <Cascader
        key="v"
        options={candidate}
        defaultValue={show.map((item) => item.value)}
        changeOnSelect
        placeholder={super.getPlaceholder()}
        onChange={v => {
          const vLabel = [];
          v.map((item) => {
            let findItem;
            candidate.map((dataItem) => {
              findItem = findById(dataItem, item, 'label', 'value', 'children');
              if (findItem != -1) {
                vLabel.push(findItem)
              }
            })
          })
          super.changeValue(vLabel);
        }}
        {...p}
      />
    }
  }
}
