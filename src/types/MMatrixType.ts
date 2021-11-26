
import { MFieldSchemaAnonymity, MValidationResult } from "../framework/Schema";
import { EmtpyType, MType} from "./MType";
import { validateRequired } from "../framework/Validator";
import { MUtil } from "../framework/MUtil";
import _ from "lodash";
import { Assembly } from '../framework/Assembly';

export function validateMatrix(a:Assembly, schema:MFieldSchemaAnonymity, value:any, path:string): MValidationResult {
  if(_.isNil(value)){
    return undefined;
  }

  if(schema.matrix?.minY) {
    let allXValue = MUtil.standardFields(schema.matrix?.x).map(e=>e.value);
    let selectedXValue:any[] = [];
    for(let k in value){
      if(!k){
        continue;
      }
      const xv = value[k];
      if(_.isArray(xv)){
        selectedXValue = selectedXValue.concat(xv);
      } else {
        selectedXValue.push(xv);
      }
    }
    selectedXValue = _.uniq(selectedXValue);
    const diff = _.difference(allXValue, selectedXValue);
    if(diff.length > 0){
      return {message: `您还没有填"${_.join(diff, ",")}"`, path}
    }
  }

  if(schema.matrix?.minX) {
    const yy = MUtil.standardFields(schema.matrix?.y);
    for(let y of yy){
      const yv = value[y.value?.toString()];
      const n = _.isArray(yv) ? yv.length : (yv ? 1 : 0);
      if(n < schema.matrix.minX){
        return {message: `您还没有为"${y.label ?? y.value}"做选择`, path}
      }
    }
  }
  return undefined;
}

export const MMatrixType: MType = _.assign({}, EmtpyType, {
  validators: [validateRequired, validateMatrix],

  standardValue: (assembly:Assembly, s:MFieldSchemaAnonymity, v:any, strict:boolean):any => v, // TODO,矩阵要考虑 tolerate,strict 选项
});
