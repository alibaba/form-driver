import React, { ReactNode } from "react";
import { MProp } from "../framework/Schema";
import _ from "lodash";
import { assembly } from '../framework/Assembly';
import { MContext } from '../framework/MContext';
import { MUtil } from "../framework/MUtil";

export interface ViewerState {
  // 纯粹是用来刷新控件内容的
  ctrlVersion?: number;
  // true表示不校验，比如子form就不需要校验
  noValidate?: boolean;
}

/**
 * 每一个Viewer，都用来表达（展示readable/编辑editor）json上的一个值 / 或者不会改变数据的装饰物
 * 这个类负责展示校验错误，提供数据存取api
 */
export abstract class Viewer<S extends ViewerState> extends React.Component<MProp, S> {
  /**
   * 获取此字段在database中的值
   */
  getValue(){
    return MUtil.get(this.props.database, this.props.path);
  }

  getParentValue(){
    return MUtil.get(this.props.database, MUtil.parentPath(this.props.path));
  }

  /**
   * 当字段值变化时，调用此方法把值写回database，并且回调afterChange
   * 调用changeValue后Editor会刷新，不需要额外再setState了
   * @param v - 编辑器在数组中时，子编辑器changeValue(undefined)表示它要删除此元素
   * @param updateCtrlVersion - 子类可以用state.ctrlVersion作为key的一部分，在数据变化时用changeValue(value, true)改变输入框的内容
   * @param final - 参考AFTER_CHANGE_CALLBACK
   */
  changeValueEx(v:any, updateCtrlVersion:boolean, final:boolean) {
    // 字段校验状态是否变化
    MUtil.set(this.props.database, this.props.path, v);
    this.props.afterChange?.(this.props.path, v, final);
    this.setState((p) =>{
      return {ctrlVersion: updateCtrlVersion? (p.ctrlVersion ?? 0 )+1 : (p.ctrlVersion ?? 0)}
    });
  }

  /**
   * changeValueEx(v, false, true)的快捷方式
   * @param v 
   */
  changeValue(v:any) {
    this.changeValueEx(v, false, true);
  }

  /**
   * 子类实现编辑器元素的渲染，render根据这个元素再加上校验
   */
  protected abstract element(ctx?: any):ReactNode;

  render() {
    return <MContext.Consumer>{
      ctx =>{
        // const isShow = MUtil.isShow(this.props.database, ctx.rootProps.schema?.objectFields, this.props.schema.showIf)
        // // 隐藏的字段不展示
        // if (!isShow) return null
        const childElement = this.element(ctx);
        if(this.props.morph === "readable" || this.state?.noValidate){
          return childElement;
        } else {
          // 加上校验错误提示
          if(!ctx?.forceValid) {
            return childElement;
          }
          const v = assembly.validate(this.props.schema, this.getValue(), this.props.path);
          return [
            childElement,
            v?.message ? <div key="错误提示" className="ant-form-item-explain ant-form-item-explain-error">{v.message}</div> : undefined
          ];
        }
      }
    }</MContext.Consumer>
  }

  getPlaceholder(index:number = 0): string|undefined {
    let p = this.props.schema.placeholder;
    if(_.isString(p)){
      return p;
    } else if(p) {
      return p[index];
    } else {
      return undefined;
    }
  }

  antProp(useVersionCtrl:boolean = false){
    return {
      key: useVersionCtrl ? this.props.path + "/" + this.state.ctrlVersion : this.props.path,
      placeholder: this.getPlaceholder(),
      bordered: !this.props.hideBorder,
      disabled: this.props.disable
    }
  }
}

export abstract class BaseViewer extends Viewer<ViewerState> {
  constructor(p:MProp){
    super(p);
    this.state = {ctrlVersion: 1, noValidate: false};
  }
};
