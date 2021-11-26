import React, { Component, RefObject } from "react";
import { DatePicker } from "antd";
import zhCN from 'antd/lib/date-picker/locale/zh_CN';
import moment from "moment";
import { Button, Calendar } from "antd-mobile";
import ReactDOM from "react-dom";
import { RangePickerProps } from "antd/lib/date-picker";
import _ from "lodash";
import { Viewer, ViewerState } from '../../BaseViewer';
import { MUtil } from '../../../framework/MUtil';
import { MProp } from "../../../framework/Schema";
import { MDateRangeType } from '../../../types/MDateRangeType';
import { assembly } from '../../../framework/Assembly';

export type ARangePickerData = [
  // 开始时间
  string | null | undefined,
  // 结束时间
  string | null | undefined,
  // 是否至今，如果true，结束时间是无效的
  boolean | null | undefined
];

type AntData = [moment.Moment | null, moment.Moment | null];

interface State extends ViewerState {
  mobileDlg: boolean;
}

export class ARangePicker extends Viewer<State> {
  _pickerRef: RefObject<Component<RangePickerProps, any, any>> = React.createRef();
  _onCalendarChangeValue?: AntData | null;

  constructor(p: MProp) {
    super(p);
    this.state = { ctrlVersion: 1, noValidate: false, mobileDlg: false };
  }

  componentDidUpdate() {
    this._patchTillnow();
  }

  componentDidMount() {
    this._patchTillnow();
  }

  _patchTillnow() {
    const v = super.getValue();
    if (_.get(v, "[2]")) { // tillnow
      const dom = ReactDOM.findDOMNode(this._pickerRef.current);
      if (dom) {
        // @ts-ignore
        let r = dom.querySelector(":nth-child(3)");
        r.innerHTML = "<input readonly disabled size='12' autocomplete='off' value='至今' style='color: black'>";
      }
    }
  }

  /**
   * RangePicker的数据转换成json上的数据类型
   * @param r 
   */
  _rangePicker2Data(v: AntData | null | undefined, tillNow: boolean): ARangePickerData | undefined {
    if (!v) {
      return undefined;
    }
    const dataFormat = this.props.schema.dataFormat ?? "x";
    return [v[0]?.format(dataFormat), v[1]?.format(dataFormat), tillNow];
  }

  /**
   * json上的数据转换成RangePicker的数据
   * @param d 
   */
  _data2rangePicker(d: ARangePickerData): AntData {
    const dataFormat = this.props.schema.dataFormat ?? "x";
    return [d[0] ? moment(d[0], dataFormat) : null, d[1] ? moment(d[1], dataFormat) : null];
  }

  element() {
    const p = this.props.schema.props ?? {};
    let rangePickerData = this._data2rangePicker(this.getValue() ?? []);
    if (MUtil.phoneLike()) {
      let show = MDateRangeType.toReadableN(assembly, this.props.schema, super.getValue());

      return <>
        <div className="backfill" onClick={() => this.setState({ mobileDlg: true })}> {show ?? '请点击选择'} </div>
        <Calendar
          visible={this.state.mobileDlg}
          pickTime={this.props.schema.dateRange?.showTime}
          minDate={this.props.schema.min ? new Date(this.props.schema.min) : undefined}
          maxDate={this.props.schema.min ? new Date(this.props.schema.max) : undefined}
          onCancel={() => this.setState({ mobileDlg: false })}
          onConfirm={(start, end) => {
            super.changeValueEx(this._rangePicker2Data([moment(start), moment(end)], false), true, true)
            this.setState({ mobileDlg: false })
          }}
          {...p}
        />
      </>
    } else {
      // 构造元素
      return <DatePicker.RangePicker
        ref={this._pickerRef}
        showTime={this.props.schema.dateRange?.showTime}
        key={this.state.ctrlVersion}
        renderExtraFooter={this.props.schema.dateRange?.hideTillNow || this.props.schema.dateRange?.showTime // TODO 显示时间时，“至今”无法支持
          ? undefined
          : (mode) => <div style={{ textAlign: "right" }} {...p}>
            <Button
              size="small" style={{ width: "100px", display: "inline-block", marginTop: "5px" }}
              onClick={() => {
                super.changeValueEx(this._rangePicker2Data(this._onCalendarChangeValue, true), true, true);
              }}>至今</Button>
          </div>
        }
        bordered={this.props.hideBorder ? false : true}
        style={{ minWidth: "240px" }}
        locale={zhCN}
        defaultValue={rangePickerData}
        onCalendarChange={(d) => {
          this._onCalendarChangeValue = d;
        }}
        onChange={(vv) => {
          super.changeValueEx(this._rangePicker2Data(vv, false), true, true)
        }} />;
    }
  }
}
