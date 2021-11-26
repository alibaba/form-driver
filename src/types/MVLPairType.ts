
import { MFieldSchemaAnonymity, MValidationResult } from "../framework/Schema";
import { EmtpyType, MType} from "./MType";
import { validateRequired } from "../framework/Validator";
import { Assembly } from "../framework/Assembly";
import _ from "lodash";

function vlValidator(assembly:Assembly, schema:MFieldSchemaAnonymity, value:any, path:string): MValidationResult {
  if(!value.label) {
    return {message: "缺少标题，请重选此项", path}
  } else if(!value.value) {
    return {message: "缺少值，请重选此项", path}
  } else{
    return undefined;
  }
}

/**
 * 数据示例 { "value": 608793, "label": "test小二" }
 */
export const MVLPairType: MType = _.assign({}, EmtpyType, {
  validators: [validateRequired, vlValidator],

  toReadable: (assembly:Assembly, s:MFieldSchemaAnonymity, vs:any):string => {
    if(_.isNil(vs)){
      return assembly.theme.READABLE_BLANK;
    }
    if(_.isObject(vs) && !_.isArray(vs)) {
      // @ts-ignore
      return vs.label ?? vs.value ?? assembly.theme.READABLE_INVALID;
    } else {
      return assembly.theme.READABLE_INVALID;
    } 
  },
});
