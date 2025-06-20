import React from "react";
import _ from "lodash";
import { BaseViewer } from "../../BaseViewer";
import { Rate } from 'antd';
import './ARate.less';
import { MProp } from "../../../framework/Schema";

/**
 * antd 的评分组件 https://ant.design/components/rate-cn/
 * { editor: 'ARate', name: 'score', label: "评分", required: true, props: {count: 8} }
 */
export class ARate extends BaseViewer {
  value: string;

  constructor(p: MProp) {
    super(p);
    this.value = super.getValue() == 0 ? null : super.getValue();
  }
  element() {
    const p = this.props.schema.props ?? {};
    const props = {
      count: this.props.schema.max,
      defaultValue: this.value,
      onChange: (value, label, extra) => {
        if (value == 0) value = null
        if (p.onChange) p.onChange(value, label, extra)
        super.changeValue(value);
      },
      onBlur: () => {
        if (p.onBlur) p.onBlur()
        super.changeValue(super.getValue())
      },
      ...p,
    }
    return <div className="m3-nps-wrapper">
      {
        p.centerTip || p.leftTip || p.rightTip ?
          <div className="m3-nps-tip">
            <span className="m3-nps-tip-left">{p.leftTip}</span>
            <span className="m3-nps-tip-center">{p.centerTip}</span>
            <span className="m3-nps-tip-right">{p.rightTip}</span>
          </div> : null
      }
      <Rate className="m3-nps-rate" {...props} />
      {/* <Rate {...props} /> */}
    </div>
  }
}
