import React from "react";
import { Cascader } from 'antd';
import _ from 'lodash';
import { Picker } from 'antd-mobile';
import { MUtil } from "../../../framework/MUtil";
import { BaseViewer } from '../../BaseViewer';
import { MGB2260Type } from '../../../types/MGB2260Type';
/**
 * 选择中国的省市县
 * 示例：{label:"1.5 您目前的居住地",name:"reside", type:"gb2260"},
 * 数据是gb2260的地区代码
 */
export class AGB2260 extends BaseViewer {
  element() {
    const v = super.getValue();
    const empty = { label: ["请选择"], code: undefined };
    const looked = _.isNil(v) ? empty : (MGB2260Type.lookup(v) ?? empty);
    const p = this.props.schema.props ?? {};

    if (MUtil.phoneLike()) { // 手机  
      return <Picker
        extra={super.getPlaceholder()}
        disabled={this.props.disable}
        key={this.props.path}
        className="AGB2260"
        data={MGB2260Type.gb2260}
        value={looked.code}
        title={this.props.schema.label}
        onDismiss={() => console.log('dismiss')}
        onOk={e => super.changeValue(_.last(e))}
        {...p}
      >
        <div className="backfill" style={this.props.style}>{looked?.label?.join("/")}</div>
      </Picker>
    } else { // PC
      return <Cascader
        options={MGB2260Type.gb2260}
        disabled={this.props.disable}
        key={this.props.path}
        placeholder={super.getPlaceholder()}
        bordered={this.props.hideBorder ? false : true}
        className="AGB2260"
        style={this.props.style}
        defaultValue={looked.code}
        onChange={(vv) => {
          super.changeValue(_.last(vv));
        }}
        {...p}
        />;
    }
  }
}
