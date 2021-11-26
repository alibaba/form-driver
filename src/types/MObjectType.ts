import { MUtil } from "../framework/MUtil";
import { MFieldSchemaAnonymity, MValidationResult } from "../framework/Schema";
import { MType } from "./MType";
import { validateRequired } from "../framework/Validator";
import _, { result } from "lodash";
import { Assembly } from '../framework/Assembly';

export function validateObject(assembly:Assembly, schema:MFieldSchemaAnonymity, value:any, path:string): MValidationResult {
  if(schema.objectFields){
    let objectFieldMap = _.chain(schema.objectFields).keyBy('name').value();
    if(schema.uispec?.segments){
      const fields = _.flatten(schema.uispec?.segments.map(e=>e.fields)).filter(e=>_.isString(e)) as string[];
      objectFieldMap = _.pick(objectFieldMap, fields);
    }

    const hideMap = MUtil.hideMap(value, schema.objectFields);    
    for(let k in objectFieldMap){
      const f = objectFieldMap[k];
      if(hideMap[k]){ // 隐藏的字段不要校验
        continue;
      }
      const r = assembly.validate(f, _.get(value, f.name), path ? path + "." + f.name : f.name);
      if(r){
        return r;
      }
    }
  } else if(!_.isNil(value) && !_.isObject(value)){
    return {message: "不是有效JSON", path};
  }
  return undefined;
}

/**
 * JSON对象
 * 注意：
 * 1. string/number/boolean等不算有效的JSON对象
 * 2. undefined/null在required=false时是有效的
 */
export const MObjectType: MType = {
  validators: [validateRequired, validateObject],

  /**
   * 对象转换成readable文案时，会默认选择展示对象的label/name/id，如果都没有，展示JSON.stringify后的字符串
   * @param assembly 
   * @param s 
   * @param vs 
   */
  toReadable: (assembly:Assembly, s:MFieldSchemaAnonymity, vs:any):string => {
    if(_.isNil(vs)){
      return assembly.theme.READABLE_BLANK;
    } else if(_.isObject(vs)) {
      return vs["label"] ?? vs["name"] ?? vs["id"] ?? JSON.stringify(vs);
    } else {
      return result.toString();
    }
  },

  standardValue: (assembly:Assembly, s:MFieldSchemaAnonymity, v:any, strict: boolean):any => {
    // 类型正确
    if(!_.isObject(v)) {
      return s.defaultValue;
    }

    // 数值正确
    // 注意，m3的object是开放的，允许数据中出现未定义的字段，所以只处理在schema里有的字段，不会改变schema里没有的字段
    for(let f of s.objectFields) {
      const type = assembly.types[f.type];
      if(!type){
        console.warn(`对象成员字段${f.name}的类型无效：${f.type}`)
        continue;
      }
      v[f.name] = type.standardValue(assembly, f, v[f.name], strict);
    }
    return v;
  },

  createDefaultValue: (assembly:Assembly, schema:MFieldSchemaAnonymity):any =>{
    let newItem;
    if(schema.defaultValue){
      newItem = _.cloneDeep(schema.defaultValue);
    } else {
      newItem = {};
      for(let memberField of schema.objectFields){
        newItem[memberField.name] = assembly.types[memberField.type]?.createDefaultValue(assembly, memberField);
      }
    }
    return newItem;
  }
};
