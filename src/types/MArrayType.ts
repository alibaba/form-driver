
import { MFieldSchemaAnonymity, MValidationResult } from "../framework/Schema";
import { MType} from "./MType";
import _ from "lodash";
import { generateJsPrototypeValidate, validateRequired } from "../framework/Validator";
import { Assembly } from '../framework/Assembly';

function arrayValidator(assembly:Assembly, schema:MFieldSchemaAnonymity, value:any, path:string): MValidationResult {
  // 校验一下数组元素
  if(schema.arrayMember){
    for(let i = 0; i < value.length; i++){
      let item = value[i];
      const r = assembly.validate(schema.arrayMember, item, path + "[" + i + "]");
      if(r){
        return {message: "", path};; // 子元素校验没过，数组上不用展示信息
      }
    }
  }
  const min = schema.min ?? (schema.required ? 1: 0);
  const max = schema.max ?? Number.MAX_VALUE;
  if(value.length < min){
    return {message: "最少" + min + "项", path};;
  }
  if(value.length > max) {
    return {message: "最多" + schema.max + "项", path};
  }
  
  return undefined;
}

export const MArrayType: MType = {
  validators: [validateRequired, generateJsPrototypeValidate("[object Array]"), arrayValidator],

  toReadable: (assembly:Assembly, s:MFieldSchemaAnonymity, vs:any):string => {
    if(s.arrayMember?.type === "object"){
      const olfs = s.arrayMember.objectLabelFields ?? [_.get(s.arrayMember, "objectFields[0].name") as string];
      return vs?.map((v:any)=>{
        const itemValueArr = [];
        for(let ofs of olfs){
          itemValueArr.push(v[ofs]);
        }
        return itemValueArr.join(",");
      })?.join("\n") ?? assembly.theme.READABLE_BLANK;
    } else {
      return vs?.join(",") ?? assembly.theme.READABLE_BLANK;
    }
  },

  standardValue: (assembly:Assembly, s:MFieldSchemaAnonymity, v:any, strict: boolean):any => {
    if(!_.isArray(v)){
      return s.defaultValue;
    }
    
    const def = assembly.types[s.arrayMember?.type];
    if(!def){
      return v;
    }
    
    for(let i = 0; i < v.length; i ++){
      v[i] = def.standardValue(assembly, s.arrayMember, v[i], strict);
    }

    return v;
  },

  createDefaultValue:(assembly:Assembly, s:MFieldSchemaAnonymity) => {
    if(s.defaultValue){
      return _.cloneDeep(s.defaultValue);
    } else {
      return [];
    }
  }
};
