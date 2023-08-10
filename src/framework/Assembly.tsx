import React, { ClassType } from "react";
import { MValidationResult, MFieldSchemaAnonymity, MProp, MValidationFail } from './Schema';
import { CHANGE_SCHEMA_CALLBACK } from "../framework/Schema";
import _ from "lodash";
import { MUtil } from './MUtil';
import { MType, PluginType } from "../types/MType";

export type MORPH = "readable" | "editor";
export type VIEWER = ClassType<MProp, any, any>

/** 统一的视觉样式 */
export interface MTheme {
  // 负向数据展示文案
  /** 数据未知时展示 */
  readonly READABLE_UNKNOWN: string;
  /** 数据为空的时候展示 */
  readonly READABLE_BLANK: string;
  /** 数据有问题时展示 */
  readonly READABLE_INVALID: string;
  /** 代码有问题时展示 */
  readonly READABLE_ERROR: string;

  /** @deprecated theme的名字 */
  readonly themeName: "antMiddle" | string;
}

export interface EDITOR {
  // 编辑器
  editor: string;
  // 数据类型
  type: string;
  // 阅读器
  readable: string;
}

const defaultTheme: MTheme = {
  READABLE_UNKNOWN: "?",
  READABLE_BLANK: "-",
  READABLE_INVALID: "❓",
  READABLE_ERROR: "❗",

  themeName: "antMiddle"
}

/**
 * 注册viewer，type，morph（viewer和type之间的关联）
 */
export class Assembly {
  types: { [name: string]: MType } = {};
  viewers: { [name: string]: VIEWER } = {};
  editors: { [name: string]: EDITOR } = {};
  morph: { [name: /*MORPH*/ string]: { [typeName: string]: string | ClassType<MProp, any, any> /* viewer name or viewer */ } } = {}

  theme: MTheme = defaultTheme;

  toReadable = (s: MFieldSchemaAnonymity, v: any, parent: any): string => {
    const t = this.types[s.type];
    if (t) {
      let r;
      if (_.isString(s.toReadable)) {
        // eslint-disable-next-line no-new-func
        r = new Function("_", "value", "theme",
          "const {READABLE_UNKNOWN, READABLE_BLANK, READABLE_INVALID, READABLE_ERROR} = theme; return " + s.toReadable)(_, v, this.theme);
      } else if (_.isFunction(s.toReadable)) {
        r = s.toReadable(v, parent, this);
      }
      r = r ?? t.toReadable(this, s, v);

      if (s.postfix) {
        r += s.postfix;
      }
      return r;
    } else {
      return s.type + "类型无效"
    }
  }

  /** 根据定义返回View，返回nil表示没有可用的View */
  getViewerOf(f: MFieldSchemaAnonymity, morph: MORPH): ClassType<any, any, any> {
    console.log('getviewof', f, morph)
    if (f.editor && morph === "editor") {
      if (_.isString(f.editor)) {
        return _.get(this.viewers, f.editor);
      } else {
        return f.editor;
      }
    } else if (f.readable && morph === "readable") {
      if (_.isString(f.readable)) {
        return _.get(this.viewers, f.readable);
      } else {
        return f.readable;
      }
    } else {
      const viewer: string | ClassType<MProp, any, any>  = _.get(this.morph, morph + "." + f.type);
      if (_.isString(viewer)) {
        return _.get(this.viewers, viewer);
      } else {
        return viewer
      }
    }
  }

  validate(s: MFieldSchemaAnonymity, v: any, path: string = ""): MValidationFail | undefined {
    let result: MValidationResult = undefined;
    for (let validator of this.types[s.type].validators) {
      result = validator(this, s, v, path);
      if (result === "pass") {
        return undefined;
      } else if (result) {
        MUtil.debug("校验", path, result.message);
        return result;
      }
    }
    return undefined;
  }

  addViewer(name: string, v: VIEWER) {
    if (this.viewers[name]) {
      console.error(`addViewer: 已经存在名为 ${name} 的 Viewer，无法再次添加！`)
      return
    } else {
      this.viewers[name] = v;
    }
  }

  addEditor(name: string, v: EDITOR) {
    if (this.editors[name]) {
      console.error(`addEditor: 已经存在名为 ${name} 的 Editor，无法再次添加！`)
      return
    } else {
      this.editors[name] = v;
    }
  }

  /**
   * 增加一种数据类型
   * 例：
   *  const hpOrg = {name: "hpOrg", type: {validators: ..., toReadable: ...}, editor: HPOrgEditor, readable: "DivViewer"}
   *  addType(hpOrg)
   * @param typeParam 类型的描述对象
   */
  addType(typeParam: PluginType) {
    const { name, type, editor, readable = "DivViewer" } = typeParam
    this.types[name] = type;
    _.set(this.morph, "editor." + name, editor);
    _.set(this.morph, "readable." + name, readable);

  }

  constructor() {
    // 校验types是否使用了无效的编辑器名字
    for (let morphName in this.morph) {
      for (let typeName in this.morph[morphName]) {
        if (!this.types[typeName]) {
          throw SyntaxError(`类型${typeName}未定义`);
        }
        const viewerName = this.morph[morphName][typeName];
        if (!this.viewers[viewerName]) {
          throw SyntaxError(`视图${viewerName}未定义`);
        }
      }
    }
  }
}

export const assembly: Assembly = new Assembly();
