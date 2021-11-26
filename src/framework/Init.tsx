import { assembly } from './Assembly';
import { MEnumType } from "../types/MEnumType";
import { MGB2260Type } from "../types/MGB2260Type";
import { MDateTimeType } from '../types/MDateTimeType';
import { MSetType } from '../types/MSetType';
import { MArrayType } from "../types/MArrayType";
import { MStringType } from '../types/MStringType';
import { MIntDiffType } from '../types/MIntDiffType';
import { MIntType } from '../types/MIntType';
import { MMatrixType } from "../types/MMatrixType";
import { MObjectType } from "../types/MObjectType";
import { MExperienceType } from "../types/MExperienceType";
import { MCnAddress } from "../types/MCnAddressType";
import { MTelType, MCnPhoneType, MEmailType } from '../types/MTelType';
import { MDateRangeType } from "../types/MDateRangeType";
import { ArrayViewer } from '../ui/readable/ArrayViewer';
import { ADatetimePicker } from "../ui/editor/basic/ADatetimePicker";
import { AGB2260 } from "../ui/editor/basic/AGB2260";
import { ARadio } from "../ui/editor/basic/ARadio";
import { ARate } from "../ui/editor/basic/ARate";
import { AUpload } from "../ui/editor/basic/AUpload";
import { ATreeSelect } from "../ui/editor/basic/ATreeSelect";
import { NPS } from "../ui/editor/basic/NPS";
import { AIntBox } from "../ui/editor/basic/AIntBox";
import { ACheckBox } from "../ui/editor/basic/ACheckBox";
import { AInputBox } from "../ui/editor/basic/AInputBox";
import { AMatrix } from '../ui/editor/complex/AMatrix';
import { ASpecInputBox } from '../ui/editor/basic/ASpecInputBox';
import { AForm } from '../ui/editor/complex/AForm';
import { DivViewer } from '../ui/readable/DivViewer';
import { ASelector } from "../ui/editor/basic/ASelector";
import { ASetSelector } from '../ui/editor/basic/ASetSelector';
import { AExperience } from '../ui/editor/complex/AExperience';
import { ACnAddress } from '../ui/editor/complex/ACnAddress';
import { AArray } from '../ui/editor/complex/AArray';
import { AArrayGrid } from '../ui/editor/complex/AArrayGrid';
import { ARangePicker } from '../ui/editor/basic/ARangePicker';
import { AIntDiff } from '../ui/editor/complex/AIntDiff';
import { MFloatType } from '../types/MFloatType';
import { MDecorationType } from '../types/MDecorationType';
import { DecorationViewer } from '../ui/readable/DecorationViewer';
import { ATable } from '../ui/editor/complex/ATable';
import { ARemoteSelector } from '../ui/editor/basic/ARemoteSelector';
import { JsonEditor } from '../ui/editor/complex/JsonEditor';
import _ from "lodash";
import { A } from '../ui/readable/A';
import { ADialogForm } from '../ui/editor/complex/ADialogForm';
import { MVLPairType } from '../types/MVLPairType';
import { MKvSetType } from '../types/MKvSetType';
import { AKvSet } from '../ui/editor/basic/AKvSet';
import { ACascadePicker } from '../ui/editor/basic/ACascadePicker';
import { MCascadeType } from '../types/MCascadeType';
import editorMap from './editorMap';


let init = false;
/**
 * 确保m3已经初始化ensureM3
 */
export function ensureM3(){
  if(init){
    return;
  }
  init = true;
  assembly.types = _.merge(assembly.types, {
    "enum":             MEnumType,
    "gb2260":           MGB2260Type,
    "datetime":         MDateTimeType,
    "year":             MDateTimeType,
    "yearMonth":        MDateTimeType,
    "yearMonthDay":     MDateTimeType,
    "set":              MSetType,
    "array":            MArrayType,
    "string":           MStringType,
    "intDiff":          MIntDiffType,
    "int":              MIntType,
    "float":            MFloatType,
    "matrix":           MMatrixType,
    "object":           MObjectType,
    "experience":       MExperienceType,
    "cnAddress":        MCnAddress,
    "tel":              MTelType,
    "email":            MEmailType,
    "cnPhone":          MCnPhoneType,
    "dateRange":        MDateRangeType,
    "decoration":       MDecorationType,
    "vl":               MVLPairType,
    "kvSet":            MKvSetType,
    "cascade":          MCascadeType,
  });
  
  // 实验性组件 AArray、ATable、ADialogForm、AForm、ASetSelector、JsonEditor
  assembly.viewers = _.merge(assembly.viewers, {
    "ADatetimePicker":  ADatetimePicker,
    "AGB2260":          AGB2260,
    "ARadio":           ARadio,
    "ARate":            ARate,
    "AUpload":          AUpload,
    "ATreeSelect":      ATreeSelect,
    "NPS":              NPS,
    "ACheckBox":        ACheckBox,
    "AIntBox":          AIntBox,
    "AInputBox":        AInputBox,
    "AMatrix":          AMatrix,
    "ASpecInputBox":    ASpecInputBox,
    "AForm":            AForm,
    "AArray":           AArray,
    "AArrayGrid":       AArrayGrid,
    "ARangePicker":     ARangePicker,
    "AIntDiff":         AIntDiff,
    "ACnAddress":       ACnAddress,
    "AExperience":      AExperience,
    "ASetSelector":     ASetSelector,
    "ASelector":        ASelector,
    "DivViewer":        DivViewer,
    "ArrayViewer":      ArrayViewer,
    "DecorationViewer": DecorationViewer,
    "ATable":           ATable,
    "ARemoteSelector":  ARemoteSelector,
    "JsonEditor":       JsonEditor,
    "A":                A,
    "ADialogForm":      ADialogForm,
    "AKvSet":           AKvSet,
    "ACascadePicker": ACascadePicker,
  });

  assembly.morph = _.merge(assembly.morph, {
    // 编辑
    "editor": {
      "enum": "ASelector",
      "gb2260":"AGB2260",
      "datetime": "ADatetimePicker",
      "year": "ADatetimePicker",
      "yearMonth": "ADatetimePicker",
      "yearMonthDay": "ADatetimePicker",
      "set": "ACheckBox",
      "array": "AArray",
      "string": "AInputBox",
    
      "intDiff": "AIntDiff",
      "int": "AIntBox",
      "float": "AIntBox",
      
      "matrix": "AMatrix",
      "object": "AForm",
      
      "experience": "AExperience",
      "kvSet": "AKvSet",
      
      // TODO 这些类型还没有校验
      "cnAddress": "ACnAddress",
      "tel": "ASpecInputBox",
      "email": "ASpecInputBox",
      "cnPhone": "ASpecInputBox",
      "dateRange": "ARangePicker",
      "decoration": "DecorationViewer",

      "vl": "ARemoteSelector",
      "cascade": "ACascadePicker"
    },
    // 详情
    "readable": {
      "enum": "DivViewer",
      "gb2260": "DivViewer",
      "datetime": "DivViewer",
      "year": "DivViewer",
      "yearMonth": "DivViewer",
      "yearMonthDay": "DivViewer",

      "set": "DivViewer",
      "array": "ArrayViewer",
      "string": "DivViewer",

      "intDiff": "DivViewer",
      "int": "DivViewer",
      "float": "DivViewer",

      "matrix": "DivViewer",
      "object": "AForm",
      "experience": "DivViewer",
      "kvSet": "DivViewer",

      "cnAddress": "DivViewer",
      "tel": "DivViewer",
      "email": "DivViewer",
      "cnPhone": "DivViewer",
      "dateRange":"DivViewer",
      "decoration": "DecorationViewer",
      "vl": "DivViewer",

      "cascade": "DivViewer"
    }
  })
  
  assembly.editors = _.merge(assembly.editors, editorMap)
}