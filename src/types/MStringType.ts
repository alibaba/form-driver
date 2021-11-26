
import { MFieldSchemaAnonymity } from "../framework/Schema";
import { EmtpyType, MType} from "./MType";
import { validateRequired, validateStringMinMax, generateRegexValidate } from '../framework/Validator';
import { Assembly } from '../framework/Assembly';
import _ from "lodash";

export const MStringType: MType = _.assign({}, EmtpyType, {
  validators: [validateRequired, generateRegexValidate(/[^\s]|(^$)/, "不能全都填空格"), validateStringMinMax],

  createDefaultValue: (assembly:Assembly, s:MFieldSchemaAnonymity):any =>{
    return s.defaultValue ?? "";
  },

  toReadable: (assembly:Assembly, s:MFieldSchemaAnonymity, vs:any):string => {
    if(_.isNil(vs)){
      return assembly.theme.READABLE_BLANK;
    }

    if(!_.isString(vs)){
      return assembly.theme.READABLE_INVALID;
    }

    return vs;
  },

});
