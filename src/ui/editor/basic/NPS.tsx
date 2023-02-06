import React from "react";
import _ from "lodash";
import { BaseViewer } from "../../BaseViewer";
import { Rate } from 'antd';
import './ARate.less';
import { MProp } from "../../../framework/Schema";

/**
 * NPS 打分组件，基于 antd 的评分组件 https://ant.design/components/rate-cn/
 * 定义示例：{ editor: 'NPS', name: 'possibility', label: "您向朋友或同事推荐本堂课程的可能性有多大?", required: true },
 */
export class NPS extends BaseViewer {
  value: string;

  constructor(p: MProp) {
    super(p);
    // rate 组件从 1 开始计算
    this.value = super.getValue() == -1 ? null : super.getValue() + 1;
  }
  element() {
    const p = this.props.schema.props ?? {};
    const props = {
      count: 11,
      character: ({ index }) => index,
      defaultValue: this.value,
      onChange: (value, label, extra) => {
        // nps 从 0 开始计算
        let v = value - 1
        if (v == -1) v = null
        if (p.onChange) p.onChange(v, label, extra)
        super.changeValue(v);
      },
      onBlur: () => {
        if (p.onBlur) p.onBlur()
        super.changeValue(super.getValue())
      },
      ...p,
    }
    return <div className="m3-nps-wrapper">
      <div className="m3-nps-tip">
        <span className="m3-nps-tip-left">{p.leftTip ?? '不可能'}</span>
        <span className="m3-nps-tip-right">{p.rightTip ?? '极有可能'}</span>
      </div>
      <Rate className="m3-nps-rate" {...props} />
    </div>
  }
}
