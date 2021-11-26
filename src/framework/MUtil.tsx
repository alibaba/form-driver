import _ from "lodash";
import moment from "moment";
import { M3UISpec, MEnumField, MFieldSchema, MFieldSchemaAnonymity, MValidationFail } from './Schema';
import { JSONSchema6 } from 'json-schema';
import React from "react";
import { SchemaFunc } from './SchemaFunc';

export type HideMap = { [fieldName: string]: boolean };

let next = Date.now() - 1617265950471;

// /** 用来测量字符串长度 */
// let _messurer: HTMLCanvasElement|undefined;

export let MUtil = {
  /**
   * 每次调用，返回不一样的数字
   * @returns 
   */
  unique(){
    return next ++;
  },

  /** 
   * 枚举字段可以写成空格分隔的字符串，也能写成MEnumField[]，这个函数将两种形式转换成统一的MEnumField[]
   * @deprecated 改成用MUtils.option
   */
  standardFields: (fs: string | MEnumField[] | undefined): MEnumField[] => {
    if (typeof fs === 'string') {
      return fs.split(" ").map(
        aEnum => {
          const kv = aEnum.split("=");
          return { label: kv[0], value: kv[1] ?? kv[0] };
        }
      );
    } else if (fs) {
      return fs;
    } else {
      return [];
    }
  },

  /**
   * 获取enumFields或者setFields，返回标准的MEnumField[]
   * @param f 如果f是nil，返回[]
   */
  option: (f:MFieldSchemaAnonymity):MEnumField[] => {
    let result: MEnumField[];
    if(_.isArray(f.option)){
      result = f.option;
    } else {
      let ori;
      if(f.type == "set"){
        ori = f.setFields;
      } else if(f.type == "enum"){
        ori = f.enumFields
      } else {
        ori = f.option ?? f.setFields ?? f.enumFields; // 只是为了保险
      }

      if (typeof ori === 'string') {
        f.option = result = ori.split(" ").map(
          aEnum => {
            const kv = aEnum.split("=");
            return { label: kv[0], value: kv[1] ?? kv[0] };
          }
        );
      } else {
        f.option = result = ori; // TODO children 可能有递归的，还是得靠预处理解决
      }
    }

    return result ?? [];
  },

  /** 如果出错了，返回这么个元素，可能用在BaseEditor子类或者其他的东西上 */
  error: function (msg: string, schema?: MFieldSchema | MFieldSchemaAnonymity): JSX.Element {
    return <div key={Date.now()} style={{ color: "white", border: "1px solid darkgrey", background: "red", textAlign: "center", borderRadius: "5px" }}>
      {msg}
      {schema ? <pre style={{ whiteSpace: "pre-wrap", textAlign: "left" }}>{JSON.stringify(schema)}</pre> : undefined}
    </div>;
  },

  sign: function (v: number | null | undefined): number | null {
    if (_.isNil(v)) {
      return null;
    }
    return Math.sign(v);
  },

  /**
   * 当前设备是不是个手机（或者类似手机的设备，比如ipad上运行iphone app中的webview）
   */
  phoneLike: function () {
    // eslint-disable-next-line no-restricted-globals
    return screen.height / screen.width > 1.5;
  },

  // /**
  //  * 计算文字的宽度
  //  * @param text 文字
  //  * @param font 字体
  //  * @returns 宽度，单位是px
  //  */
  // getTextWidth(text:string, font?:string) {
  //   var canvas = _messurer ?? (_messurer = document.createElement("canvas"));
  //   var context = canvas.getContext("2d");
  //   if(!context) {
  //     console.error('神奇的事情发生了：canvas.getContext("2d")居然能返回null');
  //     return text.length * 10; // 总比出不来好
  //   }
  //   if(font){
  //     context.font = font;
  //   }
  //   var metrics = context.measureText(text);
  //   return metrics.width;
  // }

  /**
   * 计算文字的宽度
   * @param text 
   */
  antdTextWidth(text?: string) {
    if (!text) {
      return 0;
    }
    return text.length * 16;
  },

  /**
   * 从数组中删掉一个元素
   * @param a 这个数组会被改变的
   * @param element 要删的元素
   * @returns 修改后的数组（如果它不是nil）
   */
  arrayRemove: function (a: any[] | null | undefined, element: any): typeof a {
    if (a) {
      const idx = a.indexOf(element);
      if (idx >= 0) {
        a.splice(idx, 1);
      }
      return a;
    } else {
      return a;
    }
  },

  fieldOfLayout: function (fields: MFieldSchema[], spec: M3UISpec): MFieldSchema[] {
    const objectFieldMap = _.chain(fields).keyBy('name').value();
    let r: { [key: string]: MFieldSchema } = {};
    for (let s of spec.segments ?? []) {
      for (let f of s.fields ?? []) {
        if (_.isString(f)) {
          const def = objectFieldMap[f];
          if (def) {
            r[f] = def;
          }
        }
      }
    }
    return _.values(r);
  },

  /**
   * 跟lodash的get一样，除了：
   * 1. path是nil时返回undefined
   * 2. path是""时返回原始对象
   * @param a 
   * @param path 
   */
  get: function (a?: any | null, path?: string | null) {
    if (_.isNil(a) || _.isNil(path)) {
      return undefined;
    } else if (path === "") {
      return a;
    }
    return _.get(a, path);
  },

  /**
   * a : database
   * v : newValue
   * 跟lodash的set一样，除了path是""时等效于_.assign(a, v)
   */
  set: function (a: any | null, path: string | null, v: any) {
    if (path === "") {
      // 如果 database 是数组，需要特殊处理
      if (_.isArray(a)) a.length = v.length
      _.assign(a, v);
    } else {
      _.set(a, path, v);
    }
  },

  debug: function (d: any, ...optionalParams: any[]) {
    console.log(d, optionalParams);
  },

  /**
   * 填入默认值
   * @param schema 你懂得
   * @param database 数据库，会被修改的
   * @param path 路径
   */
  applyDefaultValue: function (schema: MFieldSchema, database: any, path: string) { // FIXME 多测试下，type是object或其他简单类型的情况
    if (schema.type === "object") {
      for (let f of schema.objectFields ?? []) {
        this.applyDefaultValue(f, database, (path ? path + "." : "") + f.name);
      }
    } else {
      if (!_.isNil(schema.defaultValue) && _.isNil(_.get(database, path))) {
        _.set(database, path, schema.defaultValue);
      }
    }
  },

  filterHide: function (schema: MFieldSchema, database: any[] | object) { // TODO 要改成递归的
    const hm = MUtil.hideMap(database, schema.objectFields ?? [], schema.uispec);
    let finalData: any = _.isArray(database) ? [] : {};
    for (let k in database) {
      if (!hm[k]) {
        finalData[k] = database[k];
      }
    }
    return finalData;
  },

  /**
   * 计算哪些field、segment需要隐藏
   * 支持ShowIfFunc里的函数
   * TODO 如果segment隐藏，里面的字段全都要隐藏
   * @returns 示例：
   * let {name,role,gender,alias,birthday,company,position,tel,email,citizenship,politicsCode,companyArch,address,work,edu,assistant,student,mib} = data; 
   * return {politicsCode: !(citizenship=='中国大陆'),"segment:学员信息": !(_.intersection(role, ['校友']).length > 0))}
   * @param objectFields 
   * @param uispec 用来计算segment是不是要展示，不填就不计算
   */
  hideMap: function (database: any, objectFields: MFieldSchema[], uispec?: M3UISpec): HideMap {
    // 构造字段依赖计算的脚本，类似这样：
    // let {name,role,gender,alias,tel,email,citizenship,student} = {"name":"aaa","alias":"bbb","tel":"1"};citizenship=='中国大陆'

    let l1fields = _.uniq( // 名字要唯一
      objectFields
        .filter(e => !!e.name) // 过滤掉没有名字的字段
        .map(e => _.first(e.name.split("."))) // 对于objectFields里类似student.no/student.state的字段，这里只要拼一个student就可以了
    );
    let showIfScript = `let {${l1fields.join(",")}} = data || {};\nlet hide = {`;
    for (let f of objectFields) {
      if (f.showIf) {
        showIfScript += `'${f.name}': !(${f.showIf}),`;
      }
    }
    for (let s of uispec?.segments ?? []) {
      if (s.showIf) {
        showIfScript += `"segment:${s.label}": !(${s.showIf}),`;
      }
    }
    showIfScript += "}\n";

    // 如果一个segment里的所有字段都隐藏，segment就要隐藏
    for (let s of uispec?.segments ?? []) {
      const cond = s.fields.map(f => "(hide['" + f + "'])").join(" && ");
      showIfScript += `if(${cond}) { hide["segment:${s.label}"] = true }\n`;
    }

    showIfScript += "return hide;\n";

    // eslint-disable-next-line no-new-func
    try {
      const fn = Object.keys(SchemaFunc)
      const fv = Object.values(SchemaFunc)
      let hideMap = new Function("_", "data", ...fn, showIfScript)(_, database, ...fv);
      return hideMap;
    } catch (e) {
      console.error("Calc hideMap failed: " + e.message, "function(_,data){" + showIfScript + "}", database);
      return {};
    }
  },

  /**
   * 计算 showIf 的值
   * @returns Boolean
   * @param database 
    * @param objectFields 
   */
  isShow: function (database: any, objectFields: MFieldSchema[], showIfExpr: string) {
    if (!showIfExpr) return true
    let l1fields = _.uniq(
      objectFields
        .filter(e => !!e.name)
        .map(e => _.first(e.name.split(".")))
    );
    let showIfScript = `let {${l1fields.join(",")}} = data || {};\n return ${showIfExpr}`;
    try {
      const fn = Object.keys(SchemaFunc)
      const fv = Object.values(SchemaFunc)
      let res = new Function("_", "data", ...fn, showIfScript)(_, database, ...fv);
      return res;
    } catch (e) {
      console.error("Calc isShow failed: " + e.message, "function(_,data){" + showIfScript + "}", database);
      return true;
    }
  },

  scoreOf: function(f:MFieldSchema, database:any) {
    const v = _.get(database, f.name);
    if(f.type == "enum"){
      return _.toNumber(MUtil.standardFields(f.enumFields)?.find(e=>e.value == v)?.score);
    } else if(f.type == "set"){
      let score = 0;
      const opts = MUtil.standardFields(f.setFields);
      for(let s of opts){
        if(_.find(opts, {value:v})) {
          score += _.toNumber(s.score);
        }
      }
      return score;
    } else {
      return 0;
    }
  },

  /**
   * 查找fs依赖（通过showIf）的所有字段
   * @param fs
   * @param all 
   * @returns fs依赖的所有字段，包含fs。这个数组中下标小的元素，依赖下标大的元素
   */
   dependency: function (fs:MFieldSchema[], all:MFieldSchema[]) {
    // 先建个索引
    const allFieldsIdx = _.keyBy(all, "name");
    
    // 构造未被依赖的集合
    let ndep = _.keyBy(all, "name"); // 全体
    ndep = _.omit(ndep, fs.map(f=>f.name)); // 去掉fs
    
    // 构造被依赖的集合
    let dep = new Map<string, MFieldSchema>();
    fs.forEach(f => dep[f.name] = f);
    
    // 循环从ndep里把被依赖的字段放到dep中，直到dep不再增加
    // 算法有点粗暴，将就用吧
    for(let i = 0; i < all.length; i ++) { //  轮数最多all.length，防止卡死
      let newDepNames = []
      for(let dn in dep) {
        const i = _.intersection( dep[dn].showIf?.split(/[^a-zA-Z0-9_$]/), Object.keys(ndep) );
        newDepNames = newDepNames.concat(i);
      }

      let prevSize = Object.keys(dep).length;
      for(let n of newDepNames){
        dep[n] = allFieldsIdx[n];
        delete  ndep[n];
      }
      let afterSize = Object.keys(dep).length;
      if(prevSize == afterSize) {
        break; // 如果找不到更多依赖，就可以结束了
      }
    }
    return Object.values(dep);
  },

  /**
   * 用moment格式化
   * @param s 原始数据，参见moment
   * @param srcFormat 原始数据的格式，默认x(时间戳)
   * @param dstFormat 转换成的数据格式，默认YYYY年MM月DD日
   * @param fallback 如果原始数据是nil，返回fallback
   */
  momentFormat: function (s: moment.MomentInput, srcFormat: string = "x", dstFormat: string = "YYYY年MM月DD日", fallback: string = "不详") {
    if (_.isNil(s)) {
      return fallback;
    }
    return moment(s, srcFormat).format(dstFormat)
  },

  /**
   * 将标准的json schema转换成m3的schema
   * @param e json schema
   * @param base 如果填了一个对象，转换出的属性会放在这个对象上
   * @param template 如果有子结构，创建子结构的模板
   */
  jsonSchema2MFieldSchema: function (e: JSONSchema6, base: MFieldSchema = { name: "", type: "string" }, template: Partial<MFieldSchema> = {}): MFieldSchema {
    switch (e.type) {
      case 'string':
        if (e.enum) {
          base.type = "enum";
          base.enumFields = base.enumFields ?? e.enum.map(v => ({ value: (v ?? "").toString() }))
        } else {
          base.type = "string"
          base.max = e.maxLength
        }
        break;
      case 'number':
      case 'integer':
        base.type = "int";
        break;
      case 'object':
        base.type = "object"
        base.objectFields = [];
        base.uispec = {
          type: "flowForm",
          layout: MUtil.phoneLike() ? "vertical" : "horizontal",
          comma: "：",
        };
        for (let key in e.properties) {
          let jsmField = e.properties[key];
          let m3Field: MFieldSchema = _.assign({}, template, { name: key, label: key, type: "object" });
          if (!_.isBoolean(jsmField)) {
            m3Field.label = jsmField.title ?? key;
            this.jsonSchema2MFieldSchema(jsmField, m3Field, template);
            base.objectFields.push(m3Field);
          } else {
            m3Field.type = "不支持的json schema：object.properties的value是boolean";
            base.objectFields.push()
          }
        }
        break;
      case 'array':
        base.type = "array"
        base.arrayMember = { label: "", type: "array" };
        if (_.isArray(e.items)) {
          base.arrayMember.type = "不支持的json schema：array.items是数组";
        } else if (_.isBoolean(e.items)) {
          base.arrayMember.type = "不支持的json schema：array.items是boolean";
        } else if (e.items) {
          this.jsonSchema2MFieldSchema(e.items, base, template);
        } else {
          base.arrayMember.type = "不支持的json schema：array.items是undefined";
        }
        break;
      case 'null':
      case 'any':
      case 'boolean':
      default:
        base.type = "不支持的json schema：array.items是" + e.type;
        break;
    }
    return base;
  },

  /**
   * 修改一个对象里的key
   * @param object 要修改的对象，
   * @param renameTo 
   * @param removeNotExistKey 是否在结果里面去除renameTo里不存在的key
   * @returns 返回一个改过key名字的新对象
   */
  renameKey: function (object: any, renameTo: { [oldKey: string]: string }, removeNotExistKey: boolean = false): any {
    let result: any = {};
    for (let oldKey in object) {
      let newKey = renameTo[oldKey];
      if (!newKey) {
        if (removeNotExistKey) {
          continue;
        } else {
          newKey = oldKey;
        }
      }
      result[newKey] = object[oldKey];
    }
    return result;
  },

  /** 啥也不干的空回调 */
  doNothing: function () { },

  /**
   * 去掉arr中的undefined和null，拼出来一个json path
   */
  jsonPath: function (...arr) {
    return _.compact(arr).join(".");
  },

  /**
   * 获取一个json path的父path。
   * @param path 如果path是空的返回也是空的
   */
  parentPath: function (path: string): string {
    const split = path.replace(/]/g, '').split(/[.\\[]/);
    split.splice(-1, 1);
    return split.join(".");
  },

  /**
   * 校验一个schema
   * @param s 要校验的schema
   * @returns 空数组表示校验通过，否则返回校验错误信息
   */
  validateSchema: function (s: MFieldSchema, parentPath?: string): MValidationFail[] {
    let result: MValidationFail[] = [];
    const error = (msg: string) => result.push({ message: msg, path: MUtil.jsonPath(parentPath, s.name) });
    const checkDup = (a: any[], msgIfFail: string) => {
      if (_.uniq(a).length !== a.length) {
        error(msgIfFail);
      }
    };
    const checkVL = (fs: MEnumField[]) => {
      checkDup(fs.map(f => f.value), s.name + "值有重复");
      checkDup(fs.map(f => f.label).filter(l => l), s.name + "文案有重复");
    }
    const stringOnlyEnum = (candidate: string | MEnumField[] | undefined) => {
      const ns = MUtil.standardFields(candidate).find(f => !_.isString(f.value))
      if (ns) {
        error("暂不支持的选项数据类型：" + JSON.stringify(ns) + ": " + (typeof ns))
      }
    }

    if (s.type === "decoration") {
      return [];
    } else if (s.type === "enum") {
      checkVL(MUtil.standardFields(s.enumFields))
    } else if (s.type === "set") {
      checkVL(MUtil.standardFields(s.setFields))
    } else if (s.type === "matrix") {
      stringOnlyEnum(s.matrix.x);
      stringOnlyEnum(s.matrix.y);
    } else if (s.type === "object") {
      if (!s.objectFields) {
        error("object类型未定义成员");
      } else {
        checkDup(s.objectFields.filter(f => f.type !== 'decoration').map(f => f.name), "字段名有重复");
        for (let f of s.objectFields) {
          result = _.concat(result, MUtil.validateSchema(f, MUtil.jsonPath(parentPath, s.name)));
        }

        if (s.uispec?.type === "segmentForm") {
          if (!s.uispec.segments) {
            error("分段未定义");
          } else {
            checkDup(s.uispec.segments.map(f => f.label), "分段文案有重复");
            const fieldsInSegments = _.flatten(s.uispec.segments.map(f => f.fields));
            checkDup(fieldsInSegments, "分段字段有重复");
            const fields = s.objectFields.map(f => f.name);
            checkDup(fields, "字段名有重复");
            const notInSegment = _.difference(fields, fieldsInSegments);
            if (notInSegment.length > 0) {
              error("字段" + notInSegment.join(",") + "未体现在分段中");
            }
            const fieldNotExist = _.difference(fieldsInSegments, fields);
            if (fieldNotExist.length > 0) {
              error("分段字段名无效：" + notInSegment.join(","));
            }
          }
        }
      }
    }
    return result;
  },

  /**
   * 参考https://stackoverflow.com/questions/3362471/how-can-i-call-a-javascript-constructor-using-call-or-apply
   * 示例： var d = applyToConstructor(Date, [2008, 10, 8, 00, 16, 34, 254]);
   * @param constructor 
   * @param argArray 
   */
  applyToConstructor: function (constructor, argArray) {
    var args = [null, ...argArray];
    var factoryFunction = constructor.bind.apply(constructor, args);
    return new factoryFunction();
  },

  /**
   * 执行表达式或者回调函数
   * @param exprOrFunction 表达式或者回调函数
   * @param paramName 参数名字
   * @param paramValue 参数值
   * @param fallback 如果exprOrFunction无效，返回fallback
   * @param _this this指针
   */
  evalExprOrFunction: function (exprOrFunction, paramName: string[], paramValue: any[], fallback: any = undefined, _this: any = undefined) {
    if (_.isFunction(exprOrFunction)) {
      return exprOrFunction.apply(_this, paramValue);
    } else if (_.isString(exprOrFunction)) {
      //return new Function("_", "value", "parent", "return (" + labelExpr + ");")(_, value, parent);
      const func = MUtil.applyToConstructor(Function, [...paramName, "return (" + exprOrFunction + ")"]);
      return func.apply(_this, paramValue);
    } else {
      return fallback;
    }
  },

  /**
   * 读取url参数，转换成map
   * @param hashPrefix nil表示不读取hash里的参数，字符串表示读取hash里的参数，并加上这个前缀返回。默认是返回，但前缀是空字符串
   */
  getQuery: function (hashPrefix: string = ""): any {
    const arrs = [...window.location.search.split(/[?&]/), ...window.location.hash.split(/[#?&]/)];
    const result = {};
    arrs.forEach((item) => {
      const kv = item.split(/=/);
      if (kv.length <= 2 && kv[0]) {
        result[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1]);
      }
    });
    return result;
  },

  /**
   * 动态创建一个CSS样式
   * @param css css内容，会被写进style标签里
   * @param id <style>的id，可以没有。如果已经存在，会被覆盖掉。
   */
  setCss: function (css: string, id?: string) {
    const s = document.getElementById(id) as HTMLStyleElement ?? document.createElement('style');
    s.id = id;
    s.type = 'text/css';
    s.innerHTML = css;
    document.getElementsByTagName('head')[0].appendChild(s);
  },

  /**
   * escape数值
   * @param str - 字符串 
   * @returns 会带上引号，类似"abc"，str=nil时会返回""
   */
  escapeCsv: function (str?: string) {
    if (!_.isString(str)) {
      str = _.toString(str);
    }
    return '"' + str.replace(/["]/g, '""') + '"';
  },

  /**
   * 判断两个值是否相同
   * @param v1 一个值
   * @param v2 另一个值
   * @param tolerate true用==判断，false用===判断
   */
  isEquals: function(v1, v2, tolerate: boolean) {
    if(tolerate) {
      return v1 == v2;
    } else {
      return v1 === v2;
    }
  }
}

/** 压缩数组，如果只有一个元素时，它是数据本身，多于一个元素时才是数组 */
export type CompactArrayType<T> = T | T[];

export let CompactArray = {
  indexOf: function <T>(ca?: CompactArrayType<T> | null, d?: T | null): -1 | number {
    if (_.isNil(d) || _.isNil(ca)) {
      return -1;
    }
    if (_.isArray(ca)) {
      return ca.indexOf(d);
    } else {
      return ca === d ? 0 : -1
    }
  }
}
