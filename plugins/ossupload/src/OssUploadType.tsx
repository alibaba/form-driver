import { Assembly, Validator,EmtpyType, MType, MFieldSchemaAnonymity } from 'form-driver';
import _ from "lodash";

const { validateRequired, validateStringMinMax, generateRegexValidate } = Validator

const OssUploadType: MType = _.assign({}, EmtpyType, {
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

export default OssUploadType