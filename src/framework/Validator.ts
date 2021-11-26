import _ from "lodash";
import { Assembly, assembly } from './Assembly';
import { MFieldSchemaAnonymity, MValidationResult} from './Schema';

export type VALIDATOR = (a:Assembly, schema:MFieldSchemaAnonymity, value:any, path:string)=> MValidationResult;

/**
 * 非空校验，数据不能是null/undefined/""/NaN/[]
 * 要在其他条件之前，以便required=false时短路掉nil的数据，否则后面的校验全都得处理nil
 * @param a 
 * @param schema 
 * @param value 
 * @param path 
 * @returns 
 */
export function validateRequired(a:Assembly, schema:MFieldSchemaAnonymity, value:any, path:string): MValidationResult {
  if(schema.required){
    if(_.isNil(value) || value === "" || _.isNaN(value) || (_.isArray(value) && value.length == 0)) {
      return {message:'您还没有填完这一项', path};
    }
    // 凡是总有例外
    if(schema.type === "set" && schema.openOption) {
      if(value.length === 1 && !value[0]){
        return {message:'您还没有填完这一项', path}; // 开放set，只勾了开放选项，没有填内容，也要算空
      }
    }
  } else {
    if(_.isNil(value)) {
      return "pass";
    }
  }
  return undefined;
}

/** 和validateRequired相同，但不短路 */
export function validateRequiredNS(a:Assembly, schema:MFieldSchemaAnonymity, value:any, path:string): MValidationResult {
  const v = validateRequired(a, schema, value, path);
  if(v === "pass"){
    return undefined;
  }
}

export function validateDateMinMax(a:Assembly, schema:MFieldSchemaAnonymity, value:any, path:string): MValidationResult {
  if(schema.min){
    if(!value || value < schema.min) {
      return {message: `请选择${schema.min}之后的时间`, path};
    }
  }
  if(schema.max){
    if(!value || value > schema.max) {
      return {message: `请选择${schema.min}之前的时间`, path};
    }
  }
  return undefined;
}

/**
 * 数组项数不超过[min, max]
 * @param schema
 * @param value 应该是个数组
 */
export function validateArrayItemMinMax(a:Assembly, schema:MFieldSchemaAnonymity, value:any, path:string): MValidationResult {
  if(schema.min){
    if(!value || value.length < schema.min) {
      return {message: `至少选择${schema.min}项`, path};
    }
  }
  if(schema.max){
    if(!value || value.length > schema.max) {
      return {message: `最多选择${schema.max}项`, path};
    }
  }
  return undefined;
}

/**
 * 字符串长度不超过[min, max]
 * @param schema
 * @param value 应该是个字符串
 */
export function validateStringMinMax(a:Assembly, schema:MFieldSchemaAnonymity, value:any, path:string): MValidationResult {
  if(schema.min){
    if(!value || value.length < schema.min) {
      return {message: `至少${schema.min}个字`, path};
    }
  }
  if(schema.max){
    if(value && value.length > schema.max) {
      return {message: `最多${schema.max}个字`, path};
    }
  }
  return undefined;
}

/**
 * 数字不超过[min, max]
 * @param schema
 * @param value 应该是个数字
 */
export function validateNumberMinMax(a:Assembly, schema:MFieldSchemaAnonymity, value:any, path:string): MValidationResult {
  const temp = Number(value)
  if(!_.isNil(schema.max)){
    if(!_.isFinite(temp) || temp > schema.max) {
      return {message: `最多${schema.max}`, path};
    }
  }
  if(!_.isNil(schema.min)){
    if(!_.isFinite(temp) || temp < schema.min) {
      return {message: `最少${schema.min}`, path};
    }
  }
  return undefined;
}

export function generateRegexValidate(regex:RegExp, mismatchMsg:string):VALIDATOR {
  return function (a:Assembly, schema:MFieldSchemaAnonymity, value:any, path:string): MValidationResult {
    const asstr = _.toString(value);
    if( !regex.test(asstr) ){
      return {message: mismatchMsg, path};
    }
    return undefined;
  }
}

/**
 * 数据用Object.prototype.toString.call返回的类型是预期的
 * 可以用Object.prototype.toString.call(<预期的类型>)来查看你想要的数据类型的expectType
 * @param expectType 预期类型，例如："[object Object]" "[object Null]" "[object Number]" "[object Date]" "[object Array]"
 * @param mismatchMsg 如果不匹配，提示的错误信息
 * @returns 
 */
export function generateJsPrototypeValidate(expectType:string, mismatchMsg:string = "数据有误，请重填此项"):VALIDATOR {
  return function (a:Assembly, schema:MFieldSchemaAnonymity, value:any, path:string): MValidationResult {
    if(Object.prototype.toString.call(value) == expectType){
      return undefined
    } else {
      return {message: mismatchMsg, path};
    }
  }
}

export function generateSchemaValidate(valueSchema:MFieldSchemaAnonymity, mismatchMsg?:string):VALIDATOR {
  return function (a:Assembly, schema:MFieldSchemaAnonymity, value:any, path:string): MValidationResult {
    const r = assembly.validate(valueSchema,value, "");
    if(!r){
      return r;
    } else {
      return {message: mismatchMsg ?? r.message, path};
    }
  }
}

export default {
  validateRequired,
  validateRequiredNS,
  validateDateMinMax,
  validateStringMinMax,
  validateNumberMinMax,
  generateRegexValidate
}