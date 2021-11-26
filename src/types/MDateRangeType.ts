


import { MFieldSchemaAnonymity } from "../framework/Schema";
import { EmtpyType, MType} from "./MType";
import { validateRequired } from "../framework/Validator";
import { Assembly } from "../framework/Assembly";
import moment from "moment";
import _ from "lodash";

function timeExpr(assembly:Assembly, v:any, tillNow:boolean, readableFormat):string {
  if(tillNow){
    return "至今";
  }
  if(!v){
    return assembly.theme.READABLE_UNKNOWN;
  }
  return moment(v, "x").format(readableFormat);
}

export function timeRangeExpr(assembly:Assembly, from:number|string, to:number|string, tillNow:boolean, readableFormat:string = "YYYY年MM月DD日"):string {
  return timeExpr(assembly, from, false, readableFormat) + " ~ " + timeExpr(assembly, to, tillNow, readableFormat)
}

export const MDateRangeType: MType & {toReadableN: (assembly:Assembly, s:MFieldSchemaAnonymity, vs:any)=>string|undefined} = _.assign({}, EmtpyType, {
  validators: [validateRequired],
  
  toReadable: (assembly:Assembly, s:MFieldSchemaAnonymity, vs:any):string => {
    if(_.isNil(vs)){
      return assembly.theme.READABLE_BLANK
    }
    if(!_.isArray(vs)){
      return assembly.theme.READABLE_INVALID;
    }

    return timeRangeExpr(assembly, vs[0], vs[1], vs[2], s.dateRange?.showTime ? "YYYY年MM月DD日 HH:mm:ss" : "YYYY年MM月DD日");
  },

  /**
   * 同toReadable，但数据无效时返回nil
   * @param assembly 
   * @param s 
   * @param vs 
   * @returns 
   */
  toReadableN: (assembly:Assembly, s:MFieldSchemaAnonymity, vs:any):string|undefined => {
    if(!_.isNil(vs) && _.isArray(vs)) {
      return timeRangeExpr(assembly, vs[0], vs[1], vs[2], s.dateRange?.showTime ? "YYYY年MM月DD日 HH:mm:ss" : "YYYY年MM月DD日");
    }
    return undefined;
  }
});
