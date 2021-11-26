
import { MFieldSchemaAnonymity, MValidationResult } from '../framework/Schema';
import { createDefaultValue, EmtpyType, MType} from "./MType";
import { validateRequired, validateNumberMinMax, generateRegexValidate } from '../framework/Validator';
import { Assembly } from "../framework/Assembly";
import _ from 'lodash';

export const MFloatType: MType = _.assign({}, EmtpyType, {
  validators: [validateRequired, generateRegexValidate(/(^(-?\d+)([.]\d+)?$)/, "请输入数字"), validateNumberMinMax],
});
