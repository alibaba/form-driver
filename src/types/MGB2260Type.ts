
import { MFieldSchemaAnonymity } from "../framework/Schema";
import { EmtpyType, MType} from "./MType";
import gb2260 from './gb2260.json';
import { Assembly } from "../framework/Assembly";
import _ from "lodash";
import { validateRequired } from "../framework/Validator";

export interface GB2260CodeInfo {
  label: string[];
  code: string[];
}

export const MGB2260Type: MType & {lookup: (code: number|string)=>GB2260CodeInfo|undefined, gb2260:any} = _.assign({}, EmtpyType, {
  validators: [validateRequired],
  
  toReadable: (assembly:Assembly, s:MFieldSchemaAnonymity, v:any):string => {
    let ci = MGB2260Type.lookup(v);
    if(!ci){
      return assembly.theme.READABLE_INVALID;
    }
    return ci.label.join("/");
  },

  gb2260,

  lookup: (code: number|string): GB2260CodeInfo|undefined => {
    for(let prv of gb2260){
      // @ts-ignore prv.value全是数字，ts并不知道
      const pdiff = code - prv.value;
      if(pdiff >= 0 && pdiff < 10000){
        if(prv.children.length <= 0) { // 只有省级
          return {label: [prv.label], code: [prv.value]};
        }

        for(let city of prv.children){
          // @ts-ignore city.value全是数字，ts并不知道
          const cdiff = code - city.value;
          // @ts-ignore
          if(cdiff === 0){
            return {label: [prv.label, city.label], code: [prv.value, city.value]};
          } else if(cdiff >0 && cdiff < 100){
            // @ts-ignore
            for(let dst of city.children ?? []){
              // eslint-disable-next-line eqeqeq
              if(dst.value == code) {
                return {label: [prv.label, city.label, dst.label], code: [prv.value, city.value, dst.value]};
              }
            }
          }
        }
      }
    }
    return undefined;
  }
})
