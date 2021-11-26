
import { Radio } from "antd";
import React, { CSSProperties } from "react";
import "./AMatrix.less";
import _ from "lodash";
import { BaseViewer } from "../../BaseViewer";
import { CompactArray, MUtil } from "../../../framework/MUtil";
import { UnderlineInputBox } from "../../widget/UnderlineInputBox";
import { SelectBox } from "../../widget/SelectBox";
import { MEnumField } from "../../../framework/Schema";

/**
 * 单选矩阵.
 * 暂不支持字符串以外的值。
 * 示例：{label:"3.3 您是否愿意与农村人",name:"countryman", type:"matrix", editor:"ARadioMatrix", matrix: {x:"很愿意 比较愿意 不太愿意 很不愿意 不好说", y:"聊天 一起工作 成为邻居 成为亲密朋友 结成亲家"}},
 * 数据: 
 *  {"聊天":["很愿意", "比较愿意"], "一起工作":"比较愿意"}
 */
export class AMatrix extends BaseViewer {
  private _inputBoxValue?: string;
  /**
   * 当某个值被选中时，将其设置到数据上。
   * 例如:
   *  let data = {}
   *  _setDataForKey(data, "foo", "bar", ["foo"])
   *  // data会变成 {foo:bar}
   * 
   *  let data = {"foo": "bar1"}
   *  _setDataForKey(data, "foo", "bar2", ["foo"])
   *  // data会变成 {foo:["bar1", "bar2"]}
   * 
   *  let data = {"foo": "bar1"}
   *  _setDataForKey(data, "foo", "bar2", ["foo"])
   *  // data会变成 {foo:["bar1", "bar2"]}
   * 
   *  let data = {"foo": "bar1", "open":"before"}
   *  _setDataForKey(data, nil, "bar2", ["foo"])
   *  // 假如此时文本框内是foo3
   *  // data会变成 {foo:"bar1", foo3:"bar2"}
   * 
   * @param data 这个控件的数据，这个函数会讲key/value存入data，例如：{"聊天":["很愿意", "比较愿意"], "一起工作":"比较愿意", "开放-用户填的":"比较愿意"}
   * @param key 字符串表示  nil表示设置开放选项，此时key不固定，以_inputBoxValue为准
   * @param value 
   * @param yyClosed 非开放选项的值，传进来免得再计算
   */
  private _setDataForKey(data:any, key:string, value:string, yyClosed: (string|boolean|number)[]){
    const maxX = this.props.schema.matrix?.maxX ?? 1;
    const maxY = this.props.schema.matrix?.maxY ?? Number.MAX_VALUE;

    // 预先处理好开放选项
    let prevValues;
    let actualKey;
    if(!key) { // 设置开放选项
      // 先找到原来的开放选项并删除掉，因为key可能会变的
      const prevOpenKey = _openKey(data, yyClosed);
      if(!_.isNil(prevOpenKey)) {
        prevValues = data[prevOpenKey];
        delete data[prevOpenKey];
      }

      actualKey = this._inputBoxValue ?? ""; 
      if(prevValues) {
        data[actualKey] = prevValues;
      }
    } else { // 设置备选项
      actualKey = key; 
      prevValues = data[key];
    }

    // 再考虑maxX的情况下，设置数据
    switch(typeof prevValues) {
      case "undefined":
        data[actualKey] = value;
        break;
      case "string"://"..."
        if(maxX === 1) {
          data[actualKey] = value;
        } else {
          data[actualKey] = [prevValues, value];
        }
        break;
      case "object":// ["...","..."]
        if(prevValues.length >= maxX) {
          data[actualKey].shift(); 
        }
        data[actualKey] = [...prevValues, value];
        break;
    }

    // 再考虑maxY，如果超了，要去掉一个勾
    let n = 0;
    for(let key in data) {
      const row = data[key];
      if(row === value || row?.includes(value)){
        n ++;
        if(n >= maxY && key !== actualKey){
          if(data[key] === value){
            delete data[key];
          } else {
            data[key] = MUtil.arrayRemove(data[key], value);
          }
          n --;
        }
      }
    }
  }

  /**
   * 渲染成矩阵
   */
  _renderAsMatrix(){
    let data = super.getValue() ?? {};
    
    // const minX = this.props.schema.matrix?.minX ?? 1;
    // const minY = this.props.schema.matrix?.minY ?? 1;
    
    const style = {};
    const xx = MUtil.standardFields(this.props.schema.matrix?.x);
    const yy = MUtil.standardFields(this.props.schema.matrix?.y);
    const yyClosed = yy.map(e=>e.value);

    if(this.props.schema.matrix?.open) {
      yy.push({value:"", label:this.props.schema.matrix.open.label});
    }

    let trs:JSX.Element[] = [];
    let titleRow = [<td key={"空的格子"}></td>];
    for(let x of xx) {
      titleRow.push(<td key={x.value?.toString()} style={style}>{x.label}</td>);
    }
    trs.push(<tr key={"标题"}>{titleRow}</tr>);

    const openKey = _openKey(data, yyClosed);
    for(let y of yy) {
      let dataRow:JSX.Element[] = [];
      let key: string|undefined = y.value?.toString();
      
      if(y.value) { // 候选项
        dataRow.push(<td key={y.value + ":label"}>{y.label}</td>);
      } else { // 开放选项
        dataRow.push(<td key={"open:label"} className="AMatrixOpenTd">
          {y.label}
          <UnderlineInputBox defaultValue={openKey} disabled={_.isNil(openKey)} onChange={(v)=>{
            const openKeyOnClick = _openKey(data, yyClosed);
            const str = v.target.value;
            const matchEnum = yy.find(e=>e.value === str);
            if(matchEnum){ // 不能让用户输入了某个枚举值
              alert("请不要直接输入，您可以勾选 " + (matchEnum.label ?? matchEnum.value)); // TODO 用校验解决此问题，chrome解析不了反撇号
            } else {
              this._inputBoxValue = str;
              super.changeValue(this._inputBoxValue);
              if(!_.isNil(openKeyOnClick)) {
                const prev = data[openKeyOnClick];
                delete data[openKeyOnClick];
                data[this._inputBoxValue] = prev;
              }
              super.changeValue(data);
            }
          }}/>
        </td>);

        // 开放选项的key不固定
        key = openKey;
      }

      for(let x of xx) {
        const checked = CompactArray.indexOf(MUtil.get(data, key), x.value) >= 0; // _.isNil(key) ? false : data[key] === x.value || data[key]?.includes(x.value);
        dataRow.push(<td key={x.value?.toString()} style={style}><Radio key={x.value?.toString()} checked={checked} onChange={(vv)=>{
          if(vv.target.checked) {
            this._setDataForKey(data, y.value?.toString(), x.value?.toString(), yyClosed);
          }
          super.changeValue(data);
        }}/></td>);
      }
      trs.push(<tr key={y.value?.toString()}>{dataRow}</tr>);
    }

    return <table className="M3_table" style={{width:"100%", textAlign:"center"}}><tbody>{trs}</tbody></table>;
  }

  /**
   * 渲染成一组下拉框
   */
  _renderAsDropdownList(){
    let data = super.getValue() ?? {};
    const xx = MUtil.standardFields(this.props.schema.matrix?.x);
    const yy = MUtil.standardFields(this.props.schema.matrix?.y);

    const getLabelLength = (e?:MEnumField) => e ? (e.label ?? e.value?.toString()).length : 0;
    const maxXLen = _.maxBy(xx, getLabelLength);
    const maxYLen = _.maxBy(yy, getLabelLength);

    const sameLine = (getLabelLength(maxXLen) + getLabelLength(maxYLen)) < 19;  // 超过19个字符就要折行
    const toOption = (x:any) => {return {label: x.label??x.value, value: x.value}};

    let jsx = [];

    if(this.props.schema.matrix?.minX === 1) { // 每行只能选一个，可以渲染成一组下拉框
      const options = xx.map(toOption);
      for(let y of yy) {
        jsx.push(
          <div key={y.value?.toString()} className={sameLine ? "AMatrix_DropdownList_sameLine" : "AMatrix_DropdownList_wrap"}>
            <span key="label" style={{width: MUtil.antdTextWidth(maxYLen?.label ?? maxXLen?.value?.toString())}}>{y.label ?? y.value}</span>
            <SelectBox key="selector" data={data[y.value?.toString()]} options={options} onChange={(v)=>{
              data[y.value?.toString()] = v;
              super.changeValue(data);
            }}/>
          </div> 
        )
      }
    } else if(this.props.schema.matrix?.minY ===1){
      const options = yy.map(toOption);
      const x2y:any = _.invert(data);
      for(let x of xx) {
        jsx.push(
          <div key={x.value?.toString()} className={sameLine ? "AMatrix_DropdownList_sameLine" : "AMatrix_DropdownList_wrap"}>
            <span key="label" style={{width: MUtil.antdTextWidth(maxXLen?.label)}}>{x.label ?? x.value}</span>
            <SelectBox key="selector" data={x2y[x.value?.toString()]} options={options} onChange={(v)=>{
              x2y[x.value?.toString()] = v;
              super.changeValue(_.invert(x2y));
            }}/>
          </div> 
        )
      }
    }
    return jsx;
  }

  element() {
    let screenAdaption = this.props.schema.screenAdaption ?? (MUtil.phoneLike() ? "phone" : "big");

    if(screenAdaption === "phone"){ // 手机空间不足，只能各种想办法转换选项形式
      return this._renderAsDropdownList();
    } else {
      return this._renderAsMatrix();
    }
  }
}

function _openKey(data:any, yyClosed: (string|boolean|number)[]){
  return _.first(_.difference(_.keys(data), yyClosed))?.toString();
}