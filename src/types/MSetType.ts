
import { MUtil } from "../framework/MUtil";
import { MFieldSchemaAnonymity, MValidationResult } from "../framework/Schema";
import { MType} from "./MType";

import { validateArrayItemMinMax, validateRequired } from "../framework/Validator";
import { assembly, Assembly } from "../framework/Assembly";
import _ from "lodash";

// 选项是否合法、开放选项是否合法
function validateCandidate(a:Assembly, schema:MFieldSchemaAnonymity, value:any, path:string): MValidationResult {
  let fs = MUtil.option(schema);
  const openOption = _.clone(schema.openOption ?? schema.setOpen)
  
  for(let v of value){
    let vIsOk = false;
    for(let f of fs){
      if(MUtil.isEquals(f.value, v, schema.tolerate)){
        vIsOk = true;
        break; // v校验ok
      }
    }
    if(!vIsOk) {
      if(openOption) {
        openOption.required = true; // 既然勾上了开放选项，就必须填
        const vr = assembly.validate(openOption, v, path);
        if(vr) { // 开放值无效
          return vr;
        }
      } else {
        return {message:"请重新选择", path};
      }
    }
  }
  return undefined;
}

export const MSetType: MType & {
    change: (isAdd:boolean, newValue:any, value:any[], s:MFieldSchemaAnonymity)=>any[],
    openValueIndex: (s:MFieldSchemaAnonymity, vs: any[])=>number,
    clearOpenValue: (s:MFieldSchemaAnonymity, vs: any[], keepOne:boolean)=>any[]
  } = {
  validators: [validateRequired, validateCandidate, validateArrayItemMinMax],

  toReadable: (assembly:Assembly, s:MFieldSchemaAnonymity, vs:any):string => {
    const fs = MUtil.option(s);
    if(_.isNil(vs)){
      return assembly.theme.READABLE_BLANK;
    } else if(!_.isArray(vs)){
      return assembly.theme.READABLE_ERROR;
    }
    return vs.map((v:any) => {
      for(let f of fs) {
        if(f.value === v){
          return f.label ?? v;
        }
      }
      return s.openOption ? v : assembly.theme.READABLE_INVALID
    }).join(", ");
  },

  standardValue: (a:Assembly, s:MFieldSchemaAnonymity, vs:any, strict:boolean):any => {
    // 类型正确
    if(!_.isArray(vs)){
      return s.defaultValue;
    }
    if(!strict){
      return vs;
    }

    // 数值正确
    const fs = MUtil.option(s);
    const result = [];
    let openValueFound = false; // 只能有一个开放值
    for(let v of vs) {
      let matched = false;
      for(let f of fs){
        if(MUtil.isEquals(f.value, v, s.tolerate)){
          result.push(v)
          matched = true;
          break;
        }
      }
      if((s.openOption ?? s.setOpen)&& !matched && !openValueFound && !_.isNil(v)) { // 使用第一个非nil的开放值
        openValueFound = true;
        result.push(v);
      }
    }
    return result;
  },

  /**
   * 考虑exclusive和max的情况下，计算新增/删除一个值以后集合应该变成什么
   * @param isAdd true=要向prevValue里新增newValue，false=要从prevValue里去除newValue
   * @param newValue 要加入或者去除的值
   * @param prevValue 数组形式的newValue加入或者去除前的集合
   * @param s schema
   * @returns 修改后的集合，可能不是newValue对象
   */
  change: (isAdd:boolean, newValue:any, prevValue:any[], s:MFieldSchemaAnonymity):any[] => {
    if(isAdd) {
      // 如果有多个不在option中的值，就只保留一个
      prevValue = MSetType.clearOpenValue(s, prevValue, true);

      if(prevValue?.indexOf(newValue) >= 0){ // 如果要add的值已经存在了，直接返回即可
        return prevValue;
      }

      // 处理排他选项
      const option = MUtil.option(s);
      const newFs = _.find(option, {value:newValue});
      // 把所有exclusive跟自己不同的都清掉（newFs空是开放选项，不用管）
      if(newFs) { 
        prevValue = prevValue?.filter(v => {
          const fs = _.find(option, {value:v});
          if(fs && fs.exclusive !== newFs.exclusive) {
            return false;
          }
          return  true;
        })
      }

      // 新值加入
      if(!_.isArray(prevValue)){
        prevValue = [];
      }
      prevValue.push(newValue);

      // 处理max限制
      const max = s.max ?? Number.MAX_VALUE;
      while(max > 0 && prevValue.length > max) { // 超过上限了，要删到上限为止，但不能删新加的那条
        for(let d of prevValue) {
          if(d !== newValue){
            MUtil.arrayRemove(prevValue, d);
            break;
          }
        }
      }
    } else {
      MUtil.arrayRemove(prevValue, newValue);

      // 如果有多个不在option中的值，就只保留一个
      prevValue = MSetType.clearOpenValue(s, prevValue, true);
    }
    if(!prevValue?.length) { // 如果删光了，或者只剩个开放选项，但是没有填
      prevValue = undefined;
    }
    return prevValue;
  },

  /**
   * 清除不在option中的选项
   * @param s schema
   * @param vs 值
   * @param keepOne 是否在schema允许的情况下（有openOption）保留一个有意义的（尽量非nil）开放选项
   */
  clearOpenValue: (s:MFieldSchemaAnonymity, vs: any[], keepOne:boolean):any[] =>{
    if(!vs){
      return;
    }
    const opt = MUtil.option(s);
    const result = [];
    
    let openValue;
    let openValueFound = false;

    for(let i = 0; i < vs.length; i ++) {
      const matched = opt.find(o => MUtil.isEquals(vs[i], o.value, s.tolerate));
      if(matched) {
        result.push(matched.value);
      } else {
        openValue = openValue ?? vs[i]
        openValueFound = true;
      }
    }

    if(openValueFound && keepOne && (s.openOption ?? s.setOpen)) {
      result.push(openValue);
    }

    return result;
  },

  /**
   * 获取开放选项的下标。
   * @param s 
   * @param vs 
   *   1. 优先把nil值作为开放选项（为了尽量保留有意义的值）
   *   2. 如果没有nil，最后一个在option中未出现的值作为开放选项
   *   例如
   *    openValueIndex(assembly, [a,b,c], [a, e, null, f]) = 2
   *    openValueIndex(assembly, [a,b,c], [a, e, d,    f]) = 3
   * @returns -1表示没有找到开放选项
   */
  openValueIndex: (s:MFieldSchemaAnonymity, vs: any[]):number =>{
    if(!vs){
      return -1;
    }
    const opt = MUtil.option(s);
    let openIdx = -1;
    for(let i = 0; i < vs.length; i ++) {
      const v = vs[i];
      if(_.isNil(v)) {
        return i;
      }
      if(! opt.find(o => MUtil.isEquals(v, o.value, s.tolerate)) ) {
        openIdx = i;
      }
    }
    return openIdx;
  },

  createDefaultValue: (assembly:Assembly, s:MFieldSchemaAnonymity):any =>{
    if(s.defaultValue){
      return _.clone(s.defaultValue);
    } else {
      return []; // 默认不选
    }
  },
};
