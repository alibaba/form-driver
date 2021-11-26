
import { MFieldSchemaAnonymity } from "../framework/Schema";
import { MType} from "./MType";
import _ from "lodash";
import { generateSchemaValidate, validateRequired } from "../framework/Validator";
import { Assembly } from '../framework/Assembly';

/**
 * 级联多选的值示例：
 * 值类型：
 * [ 
 *  { "label": "jiangsu", "value": "jiangsu" },
 *  { "label": "nanjing", "value": "nanjiong, chi" },
 *  { "label": "nanjing", "value": "zhong hua men" }
 * ]
 */
export const MCascadeType: MType = {
  validators: [validateRequired, generateSchemaValidate({type:"array", arrayMember: {type: "vl"}, min:1}, "请重新填写") ],

  toReadable: (assembly:Assembly, s:MFieldSchemaAnonymity, vs:any):string => {
    return vs?.map(e=>e.label)?.join("/") ?? assembly.theme.READABLE_BLANK;
  },

  standardValue: (assembly:Assembly, s:MFieldSchemaAnonymity, v:any, strict:boolean):any => { // TODO 尚未实现
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
