
import { EmtpyType, MType} from "./MType";
import { validateRequired, generateRegexValidate } from '../framework/Validator';
import _ from "lodash";

export const MCnPhoneType: MType = _.assign({}, EmtpyType, {
  validators: [validateRequired, generateRegexValidate(/^1[3456789]\d{9}$/, "输入有效手机号")],
});

export const MEmailType: MType = _.assign({}, EmtpyType, {
  validators: [validateRequired, generateRegexValidate(/^.+[@].+[.].+$/, "输入有效电子邮件地址")],
});

export const MTelType = MCnPhoneType;
