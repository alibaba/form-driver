
import React from "react";
import _ from "lodash";
import "./AForm.less";
import { Viewer, ViewerState } from '../../BaseViewer';
import { M3UISpec, MFieldSchema, MProp } from '../../../framework/Schema';
import { HideMap, MUtil } from "../../../framework/MUtil";
import { MFieldViewer } from '../../../framework/MFieldViewer';
import { Segment } from '../../widget/Segment';
import { MORPH } from '../../../framework/Assembly';
import { SegmentEditSwitch } from "../../widget/SegmentEditSwitch";
import { Modal, Popover } from "antd";
import { QuestionCircleTwoTone } from "@ant-design/icons";
import { MContext } from "../../../framework/MContext";
import { Collapsible } from "../../widget/Collapsible";

function ItemLabel(props: { uispec?: M3UISpec, schema: MFieldSchema, labelWidth?: number, morph: MORPH }): JSX.Element {
  // label自动加冒号功能 uispec.comma
  let label = props.schema.label;
  if (props.uispec?.comma) {
    // @ts-ignore trimEnd支持正则的，但lodash的声明写得不对
    label = _.trimEnd(label, new RegExp(":：" + props.uispec.comma)) + props.uispec.comma;
  }

  // 必填label加星号
  const star = (props.schema.required && props.morph === "editor") ? <span style={{ color: "red" }}>*</span> : undefined;

  if (!props.schema.label) {
    return <></>;
  }

  let popoverDesc = undefined;
  if (props.schema.popoverDesc) {
    popoverDesc = <Popover key=":popoverDesc" content={props.schema.popoverDesc}>
      <QuestionCircleTwoTone style={{ marginLeft: 5 }} />
    </Popover>
  }

  if (props.labelWidth) {
    return <span className="ItemLabel" style={{ display: "inline-block", width: props.labelWidth + 20 }}>{star}{label}{popoverDesc}</span>;
  } else {
    return <div className="ItemLabel" key={"字段标题:" + props.schema.name}>{star}{label}{popoverDesc}</div>;
  }
}

interface State extends ViewerState {
  /** 编辑中的分组label，以及编辑前的数据 */
  editing: { [label: string]: any };

  /** 保存中的分组label */
  saving: { [segmentLabel: string]: boolean };

  // /** 上一个状态时的hideMap */
  // shouldAnimation: {[n:string]: boolean};
}

// /**
//  * 判断是否应该使用动画。
//  * 
//  * 当相邻的题，状态变化不同向（都是隐藏，或者都是出现）时，不能使用折叠动画，否则会出现抖动
//  * 这个函数判断所有的字段，是否需要折叠动画
//  */
// function shouldAnimation(prevHideMap:HideMap, hideMap:HideMap, fields: MFieldSchema[]): {[n:string]: boolean}{
//   // 变化方向：隐藏->展现=1  展现->隐藏=-1  状态不变=0
//   const direction = fields.map(f=> {
//     const prev = ! (prevHideMap?.[f.name]);
//     const now = ! (hideMap[f.name]);
//     if(!prev && now) {
//       return 1;
//     } else if(prev && !now) {
//       return -1;
//     } else {
//       return 0;
//     }
//   })
  
//   // 监视哨
//   direction[-1] = 0;
//   direction[fields.length] = 0;

//   // 计算动画是否会抖动
//   let anim = {};
//   fields.map((f,idx)=>{
//     if(direction[idx] + direction[idx - 1] != 0 && direction[idx] + direction[idx + 1] != 0){
//       anim[f.name] = true;
//     } else {
//       anim[f.name] = false;
//     }
//   });
//   console.log(anim)
//   return anim;
// }
export class AForm extends Viewer<State> {
  constructor(p: MProp) {
    super(p);
    this.state = { 
      //shouldAnimation:{}, 
      editing: {}, saving: {}, ctrlVersion: 1, noValidate: true };
  }

  /**
   * 表单项，包括label和viewer
   * @param hideField 
   * @param hideMap 
   * @param f 
   * @param objectFields 
   * @param uispec 
   * @param morph 
   * @param labelWidth 
   * @param invalidLayoutMsg 
   * @param column
   * @returns 
   */
  private formItem(hideField: boolean, hideMap:HideMap, f: MFieldSchema, objectFields: MFieldSchema[], uispec, morph: MORPH,
    labelWidth: number, invalidLayoutMsg: string, column: number): JSX.Element {

    const path = MUtil.jsonPath(this.props.path, f.name)
    const wrapperProp = {
      style: {
        display: undefined,
        marginBottom: 15,
        content: f.name // debug用
      },
      open: !hideField,
      //ms: this.state.shouldAnimation?.[f.name] ? 500 : null,
      ms: 500,
      key: f.name,
      id: path,
      name: f.name
    };
    if (column > 1) {
      // 计算每项的宽度（保留2位有效数字）
      Object.assign(wrapperProp.style, {
        width: Math.floor(100 / column * 100) / 100 + '%'
      })
    }

    const fieldViewer = <MFieldViewer morph={morph ?? "readable"} key={path} schema={f} database={this.props.database} path={path} afterChange={(p, v: any, blur) => {
      this.props.afterChange?.(path, v, blur);
      const newHideMap = MUtil.hideMap(MUtil.get(this.props.database, this.props.path), objectFields, uispec);
      if (!_.isEqual(newHideMap, hideMap)) { // 如果有字段依赖导致表单项展示与否变化
        //this.setState({shouldAnimation: shouldAnimation(hideMap, newHideMap, objectFields)});
        this.setState({});
      }
    }} parent={this.props.schema} changeSchema={this.props.changeSchema} changeDatabase={this.props.changeDatabase} forceValid={this.props.forceValid} style={{ width: "100%" }} />

    let ele;
    if(uispec.layout === "vertical") { // label在字段上面的分段布局
      ele = <Collapsible {...wrapperProp}>
        <ItemLabel uispec={uispec} schema={f} morph={morph}/>
        {fieldViewer}
      </Collapsible>
    } else if(uispec.layout === "horizontal") { // label在字段左边的分段布局 TODO
      wrapperProp.style.display = "flex";
      ele = <Collapsible {...wrapperProp}>
        <ItemLabel uispec={uispec} schema={f} labelWidth={labelWidth} morph={morph}/>
        <span style={{flex: 1}}>{fieldViewer}</span>
      </Collapsible>
    } else {
      ele = MUtil.error(invalidLayoutMsg);
    }

    return <MContext.Consumer key={f.name}>
      {ctx => {
        if (ctx.rootProps.formItemWrapper) {
          return ctx.rootProps.formItemWrapper(ele, f)
        } else {
          return ele
        }
      }}
    </MContext.Consumer>
  }

  /**
   * 分段表单
   * @param objectFields 
   * @param uispec 
   */
  private _segmentForm(objectFields: MFieldSchema[], uispec: M3UISpec, column: number) {
    const objectFieldMap = _.chain(objectFields).keyBy('name').value();
    const hideMap = MUtil.hideMap(MUtil.get(this.props.database, this.props.path), objectFields, uispec);
    if (!uispec.segments) {
      return MUtil.error("分段未定义");
    }

    // 先计算一遍label的宽度，即使有隐藏的字段，确保展示出来时也不会因为label太长布局变化。
    let labelWidth = 0;
    if (uispec.layout === "horizontal") {
      for (let segment of uispec.segments) {
        for (let fieldName of segment.fields) {
          let f = objectFieldMap[fieldName];
          if (!f) {
            return MUtil.error(`segments中的${fieldName}未定义`);
          }
          let label = f.label;
          labelWidth = Math.max(labelWidth, MUtil.antdTextWidth(label ?? ""))
        }
      }
    }

    // 然后再把表单表格画出来
    const segments = [];
    let fno = 0;
    for (let segment of uispec.segments) {
      const segHide = hideMap["segment:" + segment.label];
      const items = [];
      const segmentFieldNames: string[] = [];

      for (let fieldName of segment.fields) {
        let f = objectFieldMap[fieldName];
        if (!f) {
          items.push(MUtil.error(`字段不存在：${fieldName}`));
          continue;
        }

        const hideField = segHide || hideMap[f.name];

        // segment里的字段名都记下来
        segmentFieldNames.push(fieldName);

        items.push(this.formItem(hideField, hideMap, f, objectFields, uispec,
          ((this.props.morph === "editor" || this.state.editing[segment.label]) ? "editor" : "readable"),
          labelWidth, `${segment.label}的layout值无效：${uispec.layout}`, column))
      }

      let topRight: React.ReactNode = undefined;
      if (segment.onSubmit) {
        const onSubmit = segment.onSubmit;
        if (this.state.editing[segment.label]) {
          const saving = this.state.saving[segment.label];
          const cancel = () => {
            const prev = this.state.editing[segment.label];
            _.assign(this.props.database, prev);
            delete this.state.editing[segment.label];
            this.setState({});
          }
          topRight = <SegmentEditSwitch state={saving ? "saving" : "editor"} onClick={(e) => {
            if (e) {
              this.state.saving[segment.label] = true; // 先展示loading动画
              onSubmit(segment, _.pick(this.props.database, segmentFieldNames), () => {
                // 保存完了以后移除loading状态，并且改回readable模式
                this.setState({
                  saving: _.omit(this.state.saving, segment.label),
                  editing: _.omit(this.state.saving, segment.label),
                });
              })
            } else {
              const prev = this.state.editing[segment.label];
              const current = _.pick(this.props.database, segmentFieldNames);
              if (!_.isEqual(prev, current)) {
                Modal.confirm({
                  content: '会丢失刚才的修改，确定吗？',
                  okText: "刚才的修改不要了",
                  cancelText: "继续编辑",
                  onOk: cancel
                });
              } else {
                cancel();
              }
            }
          }} />
        } else {
          topRight = <SegmentEditSwitch state={"readable"} onClick={(e) => {
            this.setState({
              editing: _.set(this.state.editing, segment.label, _.pick(this.props.database, segmentFieldNames))
            });
          }} />
        }
      }

        segments.push(<Segment column={column} style={{ ...segment.style, display: segHide ? "none" : undefined }} key={fno++} mainTitle={segment.label} labelName={"segment_" + fno} topRight={topRight}>
          {items}
        </Segment>);
    }
    return <div className="AForm">{segments}</div>
  }

  /**
   * 不分段的表单
   * @param objectFields 
   * @param uispec 
   * @param column 
   */
  private _flowForm(objectFields: MFieldSchema[], uispec: M3UISpec, column: number) {
    const hideMap = MUtil.hideMap(MUtil.get(this.props.database, this.props.path), objectFields, uispec);

    // 先计算一遍label的宽度，即使有隐藏的字段，确保展示出来时也不会因为label太长布局变化。
    // table防止折行是保底的
    let labelWidth = 0;
    if (uispec.layout === "horizontal") {
      for (let f of objectFields) {
        let label = f.label;
        labelWidth = Math.max(labelWidth, MUtil.antdTextWidth(label ?? ""))
      }
    }

    // 然后再把表单表格画出来
    const items = [];
    for (let f of objectFields) {
      items.push(this.formItem(hideMap[f.name], hideMap, f, objectFields, uispec,
        this.props.morph, labelWidth, `layout值无效：${uispec.layout}`, column
      ))
    }
    if (column > 1) {
      return <div className="AForm" style={{
        display: 'flex',
        flexFlow: 'row wrap',
        alignContent: 'flex-start',
      }}>
        {items}
      </div>
    } else {
      return <div className="AForm">{items}</div>
    }
  }

  element() {
    const objectFields = this.props.schema.objectFields;
    if (!objectFields) {
      return MUtil.error(`表单是空的`, this.props.schema);
    }

    const uispec = this.props.schema.uispec ?? { type: "flowForm", layout: "vertical" };
    const column = this.props.schema.column ?? 1;
    switch (this.props.schema.uispec?.type) {
      case "segmentForm": // 分段的表单
        if (!uispec) {
          return MUtil.error(`uispec未定义`);
        }
        return this._segmentForm(objectFields, uispec, column);
      case "flowForm": // 不分段的表单
        return this._flowForm(objectFields, uispec, column);
      case null:
      case undefined:
      default:
        return this._flowForm(objectFields, uispec, column);
    }
  }
}