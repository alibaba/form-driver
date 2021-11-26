import { MFieldSchemaAnonymity } from '../framework/Schema';
import { VALIDATOR } from "../framework/Validator";
import { Assembly } from '../framework/Assembly';
import _ from 'lodash';
import { ClassType } from 'react';

/**
 * 定义一个数据类型的处理规则
 */
export interface MType {
  /** 这种数据类型的验证器 */
  validators: VALIDATOR[];

  /** 将字段值转换成可读字符串的表达式 */
  toReadable: (assembly:Assembly, s:MFieldSchemaAnonymity, v:any)=>string;

  /**
   * 预处理数据，使其符合schema描述
   *  1. strict=true：处理后完全符合schema描述，例如set中option未出现的值，对于有tolerate配置的enum选项转换成option中的值 
   *  2. strict=false：处理后数据类型符合schema描述，但值未必符合，例如保证set值是数组，但可能并非都是schema中定义的候选值
   *  3. 即使strict模式，nil也是被允许的，表示值未填
   *  4. 如果数据类型不正确，此方法应返回defaultValue
   * @param strict 严格模式 
   */
  standardValue: (assembly:Assembly, s:MFieldSchemaAnonymity, v:any, strict:boolean)=>any;

  /**
   * 获取此类型的默认值
   */
  createDefaultValue:(assembly:Assembly, s:MFieldSchemaAnonymity)=>any;
}

/**
 * 定义一个插件类型
 */
export interface PluginType {
  /** 数据类型的字段 */
  name: string;

  /** 数据类型的处理规则 */
  type: MType;

   /** 数据类型的编辑模式 */
   editor: ClassType<any, any, any> | string;

   /** 数据类型的展示模式 */
   readable: ClassType<any, any, any> | string;
}

export const EmtpyType = {
  validators: [],
  
  createDefaultValue: (assembly:Assembly, s:MFieldSchemaAnonymity):any =>{
    if(s.defaultValue){
      return _.clone(s.defaultValue);
    } else {
      return undefined;
    }
  },

  standardValue: (assembly:Assembly, s:MFieldSchemaAnonymity, v:any, strict:boolean):any => v,

  toReadable: (assembly:Assembly, s:MFieldSchemaAnonymity, vs:any):string => {
    if(_.isNil(vs)){
      return assembly.theme.READABLE_BLANK;
    }
    return vs;
  }
}

export function createDefaultValue(assembly:Assembly, s:MFieldSchemaAnonymity) {
  if(s.defaultValue){
    return _.clone(s.defaultValue);
  } else {
    return undefined;
  }
}