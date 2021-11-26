
import { MFieldSchemaAnonymity, MValidationResult } from '../framework/Schema';
import { EmtpyType, MType} from "./MType";
import { validateRequired, validateNumberMinMax, generateRegexValidate } from '../framework/Validator';
import { Assembly } from "../framework/Assembly";
import _ from 'lodash';

export const MIntType: MType = _.assign({}, EmtpyType, {
  validators: [validateRequired, generateRegexValidate(/(^-?\d+$)/, "请输入整数"), validateNumberMinMax],

  standardValue: (assembly:Assembly, s:MFieldSchemaAnonymity, v:any, strict: boolean):any => {
    let r:number;

    // 类型不能错
    if(_.isString(v)) {
      v = Math.round(parseInt(v));
    }
    
    if(_.isNaN(v) || v === Infinity){
      return s.defaultValue
    } else if(_.isNumber(v)) {
      r = v;
    } else if(_.isBoolean(v)){
      r = v ? 1 : 0
    } else if(_.isDate(v)) { // 日期转换成时间戳
      r = v.getTime();
    } else {
      return s.defaultValue;
    }

    if(!strict) {
      return r;
    }
  
    // 数值不能错
    if(r < s.min) {
      r = s.min;
    } else if(r > s.max) {
      r = s.max;
    }
    return v;
  },

});
