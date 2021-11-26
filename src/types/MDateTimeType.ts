
import {validateDateMinMax, validateRequired} from '../framework/Validator';
import { MFieldSchemaAnonymity } from '../framework/Schema';
import { EmtpyType, MType} from "./MType";
import moment from 'moment';
import { Assembly } from '../framework/Assembly';
import _ from 'lodash';

export interface MDateTimeAntConf {
  dataFormat: string,
  readableFormat: string,
  mode: undefined | 'date' | 'year' | 'month' | 'time';
  showTime: boolean;
}

export const MDateTimeType:MType & {antConf:(schema:MFieldSchemaAnonymity)=>MDateTimeAntConf|undefined} = _.assign({}, EmtpyType, {
  validators: [validateRequired, validateDateMinMax],

  antConf: (schema:MFieldSchemaAnonymity):MDateTimeAntConf|undefined => {
    let dataFormat:string|undefined = schema.dataFormat;
    let readableFormat: string;
    let mode: undefined | 'date' | 'year' | 'month' | 'time';
    let showTime = false;
    switch(schema.type) {
      case "year": 
        mode = "year"; dataFormat = dataFormat ?? 'YYYY'; readableFormat = 'YYYY'; break;
      case "yearMonth": 
        mode = "month"; dataFormat = dataFormat ?? 'YYYYMM'; readableFormat = 'YYYY-MM'; break;
      case "yearMonthDay":  
        mode = "date"; dataFormat = dataFormat ?? 'YYYYMMDD'; readableFormat = 'YYYY-MM-DD'; break;
      case "datetime":  
        mode = undefined; dataFormat = dataFormat ?? 'x'; readableFormat = 'YYYY-MM-DD HH:mm'; showTime = true; break;
      // case "yearAndQuarter":
      // case "yearAndWeek":
      //   return MUtil.error(`移动端不支持${this.props.schema.type}`, this.props.schema);
      default:
        return undefined;
    }
    return {dataFormat, readableFormat, mode, showTime};
  },

  toReadable: (assembly:Assembly, schema:MFieldSchemaAnonymity, v:any):string => {
    if(_.isNil(v)){
      return assembly.theme.READABLE_BLANK;
    }
    let c = MDateTimeType.antConf(schema);
    if(!c) {
      return assembly.theme.READABLE_INVALID;
    }
    let asMoment = moment(v, c.dataFormat)
    return asMoment.format(c.readableFormat);
  }
});
