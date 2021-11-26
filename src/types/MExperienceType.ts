
import { MFieldSchemaAnonymity, MValidationResult } from "../framework/Schema";
import { EmtpyType, MType } from "./MType";
import { validateRequired } from "../framework/Validator";
import moment from "moment";
import _ from "lodash";
import { Assembly } from '../framework/Assembly';
import { timeRangeExpr } from './MDateRangeType';

export function validateExperience(assembly:Assembly, schema:MFieldSchemaAnonymity, value:any, path:string): MValidationResult {
  // 空的不管，有validateRequired呢
  if(_.isNil(value)){
    return undefined
  }
  
  if(!_.isArray(value)){
    return {message: "数据损坏了", path};
  }
  const format = schema.dataFormat ?? "x";
  let dim = [];
  for(let item of value) {
    let from = moment(item["from"], format).valueOf();
    let to = moment(item["to"], format).valueOf();
    let tillNow = !! item["tillNow"];
    if(tillNow){
      to = Number.MAX_VALUE;
    }
    if(!_.isFinite(from) || !_.isFinite(to)){
      return {message: "没有填写完整", path};
    }
    dim.push({from, to, item});
  }

  dim.sort((a,b)=>{
    if(a.from>b.from){
      return 1 
    } else if(a.from < b.from) {
      return -1;
    } else {
      return 0;
    }
  });

  // 看时间区间是不是有重叠
  if(!schema.experience?.overlap) {
    let prevTo = Number.MIN_VALUE;
    for(let item of dim) {
      if(item.from < prevTo){
        return {message: "时间重叠了", path};
      }
      if(item.from > item.to) {
        return {message: "结束时间不能早于开始时间", path};
      }
      prevTo = item.to;
    }
  }
  return undefined;
}

export const MExperienceType: MType = _.assign({}, EmtpyType, {
  validators: [validateRequired, validateExperience],

  toReadable: (assembly:Assembly, s:MFieldSchemaAnonymity, vs:any):string => {
    const result = [];
    if(_.isNil(vs) || _.size(vs) < 1){
      return assembly.theme.READABLE_BLANK;
    }
    if(!_.isArray(vs)) {
      return assembly.theme.READABLE_INVALID;
    }

    for(let item of vs){
      let exp:string[] = [];
      for(let childschema of s.experience?.members ?? []){
        exp.push(assembly.toReadable(childschema, item[childschema.name], item));
      };
      result.push(timeRangeExpr(assembly, item.from, item.to, item.tillNow) + "："+ exp.join("/"))
    }
    return result.join("\n");
  }
})
