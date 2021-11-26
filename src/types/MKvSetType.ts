
import { MEnumField, MFieldSchemaAnonymity, MValidationResult } from "../framework/Schema";
import { EmtpyType, MType } from "./MType";
import _ from "lodash";
import { Assembly } from '../framework/Assembly';
import { MUtil } from '../framework/MUtil';

/**
 * 类似这种题：
 * B8: 您现在在做的事业务部门的岗位吗？
 * 1. 是，具体职位是 _______
 * 2. 否，我的部门是 _______
 * 
 * 数据结构
 * {1:'CEO', 2:'营销'}
 */
export const MKvSetType: MType = _.assign({}, EmtpyType, {
  validators: [(a:Assembly, schema:MFieldSchemaAnonymity, value:any, path:string): MValidationResult => {
    if(schema.required){
      if(_.isNil(value) || Object.keys(value).length == 0) {
        return {message:'您还没有填完这一项', path};
      }
      for(let k in value){
        if(_.isNil(value[k]) || value[k] == ""){
          return {message:'您还没有填完这一项', path};
        }
      }
    }
    return undefined;
  }],

  /**
   * 对象转换成readable文案时，会默认选择展示对象的label/name/id，如果都没有，展示JSON.stringify后的字符串
   * @param assembly 
   * @param s 
   * @param vs 
   */
  toReadable: (assembly:Assembly, s:MFieldSchemaAnonymity, vs:any):string => {
    if(_.isNil(vs)){
      return assembly.theme.READABLE_BLANK;
    } else if(_.isObject(vs)){
      let fds = MUtil.standardFields(s.option);
      return Object.keys(vs).map(k => {
        return (_.find(fds, {"name": k}) as MEnumField)?.label ?? k + ":" + vs[k];
      }).join(",");
    } else {
      return assembly.theme.READABLE_INVALID
    }
  }
});
