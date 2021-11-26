import React from "react";
import _ from "lodash";
import { BaseViewer } from "../../BaseViewer";
import { TreeSelect } from 'antd';

/**
 * antd 的树型选择控件 https://ant.design/components/tree-select-cn/
 *   {
 *      "type": "array", arrayMember: {type: 'vl'}, toReadable: 'value.map(i=>i.label).join(",")', 
 *       "editor": "ATreeSelect", "name": "tree1", "label": "多选树选择", props: {
 *        treeData: treeData,
 *         labelInValue: true,
 *        multiple: true
 *       }
 *    }
 */
export class ATreeSelect extends BaseViewer {
  value: string;

  constructor(p){
    super(p);
    this.value = super.getValue();
  }

  element() {
    const p = this.props.schema.props ?? {};
    const props = {
      defaultValue: this.value,
      onChange: (value, label, extra) => {
        if (p.onChange) p.onChange(value, label, extra)
        super.changeValue(value);
      },
      onBlur: () => {
        if (p.onBlur) p.onBlur()
        super.changeValue(super.getValue())
      },
      ...p,
    }
    return <TreeSelect style={{ width: "100%" }} {...props} />
  }
}
