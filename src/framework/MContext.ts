import React from 'react';
import { MViewerProp } from './MViewer';

// 上下文定义
export interface MContextDef {
  /** 根配置 */
  rootProps: MViewerProp;

  /** 表单是否是强制校验状态 */
  forceValid: boolean;
  
  /** 将表单设置为强制校验*/
  setForceValid: (b:boolean)=>void;  
}
export const MContext = React.createContext<MContextDef|undefined>(undefined);
