import React from "react";
import { DatePicker } from "antd";
import { DatePicker as DatePickerM } from 'antd-mobile';
import moment from "moment";
import zhCN from 'antd/lib/date-picker/locale/zh_CN';
import _ from "lodash";
import { MDateTimeType } from "../../../types/MDateTimeType";
import { MUtil } from "../../../framework/MUtil";
import { BaseViewer } from '../../BaseViewer';
/**
 * 日期选择框
 * 配置示例：
 *  {label:"1.2 您的出生年份是",name:"birthday",        type:"AYearPicker"},
 *  {label:"1.14 您是什么时间来到现在这个城市的?",name:"enterCity", type:"yearAndMonth"},
 * 类型是year时，dataFormat默认是YYYY，例如: 2020，表示2020年
 * 类型是yearAndMonth时，dataFormat默认是YYYYMM，例如：202001，表示2020年1月
 * 类型是yearMonthDay时，dataFormat默认是YYYYMMDD，例如：20200101，表示2020年1月1号
 * 类型是dateTime时，dataFormat默认是x，例如1608897466955
 */
export class ADatetimePicker extends BaseViewer {
  element() {
    const antConf = MDateTimeType.antConf(this.props.schema);
    if (!antConf) {
      return MUtil.error(`无效的类型${this.props.schema.type}`, this.props.schema);
    }

    let data = this.getValue();

    const dataAsMoment = data ? moment(data, antConf.dataFormat) : undefined;
    const dataAsDate = dataAsMoment?.toDate();
    const onChange = (vv: Date | moment.Moment | null) => {
      if (vv) {
        const vvAsM = _.isDate(vv) ? moment(vv) : vv;
        super.changeValue(vvAsM.format(antConf.dataFormat))
      } else {
        super.changeValue(undefined);
      }
    };
    const p = this.props.schema.props ?? {};
    // 构造元素
    if (MUtil.phoneLike()) { // 手机
      return <DatePickerM
        disabled={this.props.disable}
        value={dataAsDate}
        key={this.props.path}
        minDate={this.props.schema.min ? moment(this.props.schema.min, antConf.dataFormat).toDate() : undefined}
        maxDate={this.props.schema.max ? moment(this.props.schema.max, antConf.dataFormat).toDate() : undefined}
        mode={antConf.mode}
        onChange={onChange}
        {...p}
        >
        <div className="backfill">{dataAsDate ? moment(dataAsDate).format(antConf.readableFormat) : "请点击选择"}</div>
      </DatePickerM>;
    } else { // 大屏
      return <DatePicker
        key={this.props.path}
        disabled={this.props.disable}
        bordered={this.props.hideBorder ? false : true}
        disabledDate={(m) => {
          const d =
            (this.props.schema.min && moment(this.props.schema.min, antConf.dataFormat).isAfter(m)) ||
            (this.props.schema.max && moment(this.props.schema.max, antConf.dataFormat).isBefore(m));
          return !!d;
        }}
        format={antConf.readableFormat}
        style={this.props.style}
        locale={zhCN}
        defaultValue={dataAsMoment}
        showTime={antConf.showTime}
        picker={antConf.mode}
        onChange={onChange}
        {...p}
      />;
    }
  }
}
