import React, { useState } from "react";
import { AFTER_CHANGE_CALLBACK, CHANGE_SCHEMA_CALLBACK, MFieldSchema, M3UISpec } from "../framework/Schema";
import { Button, message, Modal } from "antd";
import "./MViewer.less";
import { MFieldViewer } from "./MFieldViewer";
import { MUtil } from './MUtil';
import { assembly, MORPH } from './Assembly';
import _ from "lodash";
import { ensureM3 } from './Init';
import { MContext } from './MContext';
import { PersistantTool, PersistantConf } from "./Persistant";

export interface MViewerProp {
  schema: MFieldSchema,
  database: any,
  layout?: M3UISpec,
  style?: React.CSSProperties,
  morph: MORPH,
  onSubmit?: (finalData: any) => Promise<any>;
  afterChange?: AFTER_CHANGE_CALLBACK,
  changeSchema?: CHANGE_SCHEMA_CALLBACK,
  wrapper?: (elem: React.ReactElement, schema: Partial<MFieldSchema>) => React.ReactElement,
  formItemWrapper?: (elem: React.ReactElement, schema: Partial<MFieldSchema>) => React.ReactElement,
  /** 持久存储选项，nil表示不持久存储 */
  persistant?: PersistantConf
}

export interface M3Prop {
  schema: MFieldSchema | MFieldSchema[],
  database: any,
  layout?: M3UISpec,
  style?: React.CSSProperties,
  morph: MORPH,
  onSubmit?: (finalData: any) => Promise<any>;
  afterChange?: AFTER_CHANGE_CALLBACK,
  changeSchema?: CHANGE_SCHEMA_CALLBACK,
  wrapper?: (elem: React.ReactElement, schema: Partial<MFieldSchema>) => React.ReactElement,
  formItemWrapper?: (elem: React.ReactElement, schema: Partial<MFieldSchema>) => React.ReactElement,
  /** 持久存储选项，nil表示不持久存储 */
  persistant?: PersistantConf
}

interface State {
  forceValid: boolean;
  ctrlVersion: number;
}
/**
 * 一个完整的表单
 */
export class MViewer extends React.Component<MViewerProp, State> {
  database: any;

  constructor(p: MViewerProp) {
    super(p);
    this.state = {
      forceValid: false,
      ctrlVersion: 1,
    }

    ensureM3();

    const props = this.props;

    // 值类型兼容预处理
    this.database = assembly.types[props.schema.type]?.standardValue(assembly, props.schema, props.database, false);

    // 填入默认值
    MUtil.applyDefaultValue(props.schema, props.database, "");
    // 填入本地缓存值
    this.recover()
  }

  recover() {
    const { ctrlVersion } = this.state
    const { persistant } = this.props
    PersistantTool.load(this.database, persistant, () => {
      this.setState({
        ctrlVersion: ctrlVersion + 1
      })
    });
  }

  render() {
    const props = this.props;
    const database = this.database;
    const { ctrlVersion, forceValid } = this.state
    // console.log('MViewer', props.changeSchema);
    
    return <MContext.Provider value={{
      rootProps: props,
      forceValid, setForceValid: (b) => { this.setState({ forceValid: true }) }
    }}>
      <div key={ctrlVersion} className={MUtil.phoneLike() ? "MEditor_p" : "MEditor"} style={props.style}>
        <MFieldViewer schema={props.schema} database={database} path="" morph={props.morph} afterChange={PersistantTool.patchAfterChange(props.afterChange, props.persistant)} changeSchema={props.changeSchema}/>
        {props.children}
      </div>
    </MContext.Provider>
  }
}

/**
 * 提交按钮
  示例1，使用默认的提交样式：
  <MViewer schema={schema} database={database} morph="editor">
    <SubmitBar onSubmit={(d:any) => ...返回一个Promise} />
  </MViewer>

  示例2，自定义样式：
  <MViewer schema={schema} database={database} morph="editor">
    <SubmitBar onSubmit={(d:any) => ...返回一个Promise} >
      <Button>提交</Button>
    </SubmitBar>
  </MViewer>

  示例3，提交完成前，禁用提交按钮：
  <MViewer schema={schema} database={database} morph="editor">
    <SubmitBar onSubmit={(d:any) => ...返回一个Promise} >
      {
        loading => <Button loading={loading}>提交</Button>
      }
    </SubmitBar>
  </MViewer>
 * @param props 
 */
export function SubmitBar(props: {
  style?: React.CSSProperties,
  onSubmit?: (finalData: any) => Promise<any>,
  children?: React.ReactNode | ((loading: boolean) => React.ReactNode)
}): JSX.Element {

  const [loading, setLoading] = useState(false);
  let style: React.CSSProperties = props.children ? undefined : { textAlign: "center", ...props.style }

  return <MContext.Consumer>{
    ctx => {
      const onClick = () => {
        if (loading) {
          message.warn("正在提交，请稍候");
          return;
        }
        const r = assembly.validate(ctx.rootProps.schema, ctx.rootProps.database);
        const submit = props.onSubmit ?? ctx.rootProps.onSubmit;
        ctx.setForceValid(true);
        if (r) {
          Modal.warning({
            content: '还没填完呢',
            onOk: () => {
              const viewer = document.getElementById(r.path);
              if (viewer) {
                viewer.scrollIntoView({ behavior: 'smooth', block: 'start' });
              } else {
                console.error("viewer not found", r);
              }
            }
          });
        } else {
          if (submit) {
            setLoading(true);
            const finalData = MUtil.filterHide(ctx.rootProps.schema, ctx.rootProps.database)
            submit(finalData).then(() => {
              PersistantTool.clear(ctx.rootProps.persistant)
            }).finally(() => {
              setLoading(false);
            });
          } else {
            message.success("填是填完了，但提交功能还在开发中，请联系程序员解决");
          }
        }
      };
      return <div style={style} onClick={props.children ? onClick : undefined}>
        {
          props.children
            ? (_.isFunction(props.children) ? props.children(loading) : props.children)
            : <Button style={{ width: "40%" }} type="primary" loading={loading} onClick={props.children ? undefined : onClick}>提交</Button>
        }
      </div>
    }
  }</MContext.Consumer>
}

export function useM3Database(initValue) {
  return useState(initValue);
}
