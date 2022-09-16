import { MUtil } from "../framework/MUtil";
import {MValidationResult, MFieldSchemaAnonymity} from '../framework/Schema';
import { MType} from "./MType";
import { validateRequired } from "../framework/Validator";
import { Assembly, assembly } from '../framework/Assembly';
import _ from "lodash";

// 选项是否合法、开放选项是否合法
function validateCandidate(a:Assembly, schema:MFieldSchemaAnonymity, value:any, path:string): MValidationResult {
  let fs = MUtil.option(schema);
  console.log('validateCandidate', value)
  for(let f of fs){
    // @ts-ignore
    if(MUtil.isEquals(f.value, _.isObject(value) ? value?.value : value, schema.tolerate)){
      return undefined;
    }
  }
  const openOption = _.clone(schema.openOption ?? schema.enumOpen)
  if(openOption){
    openOption.required = true; // 既然勾上了开放选项，就必须填， TODO 把开放选项标注成必填，可以在schema预处理做
    return assembly.validate(openOption, value, "")
  }
  return {message:'请选择一个选项', path}
}

export const MEnumType: MType = {
  validators: [validateRequired, validateCandidate],

  createDefaultValue: (assembly:Assembly, s:MFieldSchemaAnonymity):any =>{
    if(s.defaultValue){
      return _.clone(s.defaultValue);
    } else {
      return undefined;
    }
  },

  toReadable: (assembly:Assembly, s:MFieldSchemaAnonymity, v:any):string => {
    const fs = MUtil.option(s);
    for(let f of fs) {
      if(f.value === v){
        return f.label ?? v;
      }
    }
    if(s.openOption){
      return v;
    } else {
      return assembly.theme.READABLE_BLANK;
    }
  },

  standardValue: (assembly:Assembly, s:MFieldSchemaAnonymity, v:any, strict:boolean):any => {
    if(!strict) { // value的类型各种可能都有，如果不要求严格，就不用处理了
      return v;
    }
    const fs = MUtil.option(s);
    for(let f of fs){
      if(MUtil.isEquals(f.value, v, s.tolerate)){
        return v;
      }
    }
    if(s.openOption || s.enumOpen) {
      return v;
    } else {
      return undefined;
    }
  }
}
