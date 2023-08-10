import _ from 'lodash';
import { MFieldSchema,ensureM3,Ajax } from "../../../src";

/**
 * 一个问卷的数据
 */
export interface QFormData {
  fieldSchema:MFieldSchema[],
  database: any[],
  formInfo: {
    id: number;
    gmtCreate: number;
    gmtModified: number;
    uniqueId: string;
    name: string;
    startTime: number;
    endTime: number;
    bizType: number;
    bizId: number;
    bizExtension: any;
    permission: number;
    resultCount?: any;
  }
}

export const QUtil = {
  /**
   * 服务端发回来的数据都是字符串，先转换成json
   * @param portalRespDataItem 这个对象成员会被改变
   * @returns 转换后的结果，就是portalRespDataItem实例修改后返回
   */
  decode: function(portalRespDataItem:any) {
    if(!portalRespDataItem){
      return {}
    }
    for(let key in portalRespDataItem){
      try{
        portalRespDataItem[key] = JSON.parse(portalRespDataItem[key]);
      } catch(e) { // 解析不了，只好原样返回 
        console.warn("parse json value failed", portalRespDataItem[key], e);
      }
    }
    return portalRespDataItem;
  },

  /**
   * // M3的database转换成问卷接口的数据
   * @param m3databaseItem 这个对象成员会被改变
   * @returns 转换后的结果，就是m3databaseItem实例修改后返回
   */
  encode: function(m3databaseItem: any){
    if(!m3databaseItem){
      return {}
    }
    // @ts-ignore
    for(let key in m3databaseItem) {
      m3databaseItem[key] = JSON.stringify(m3databaseItem[key]);
    }
    return m3databaseItem;
  },

  loadForm: async function loadForm(formId:string): Promise<QFormData> {
    ensureM3();
    const formDetail = await Ajax.get("/academy/hom/questionnaire/formDetail?id=" + formId);
  
    const unitListResp = (await Ajax.get("/academy/hom/questionnaire/unitList?formId=" + formId)).data;
    const fieldSchema = _.compact(unitListResp.map(e => {
      if(e.component.type === 'decoration'){
        return undefined;
      }
      e.component.tolerate = true; // 不能强类型一致，因为问卷服务端只认字符串
      return e.component;
    }));
  
    const validColumns = _.keyBy(unitListResp, "id");
  
    const data: {[key:string]: any} = {};
    let page = 0;
    let totalPage = Number.MAX_VALUE;
    while(page < totalPage) {
      const cellResp = await Ajax.get("/academy/hom/questionnaire/resultList?formId=" + formId + "&page=" + page);
      totalPage = _.min([cellResp.data.pagination.totalPage, 1000]); // 不能超过1000页
  
      const db = cellResp.data.list.map(QUtil.decode);
      for(let c of db){
        const colDef = validColumns[c.unitId];
        if(!colDef) { // 题目已经不在问卷里了
          continue;
        }
  
        const key = c.userType + ":" + c.userId;
        if(!data[key]) {
          data[key] = {key};
        }
        data[key][colDef.component.name] = c.result
      }
      page ++;
    }
    const database = Object.values(data).map(QUtil.decode);
    // for(let i = 0; i < 10000; i ++){
    //   database.push({...database[0], key:"f" + i});
    // }
    return {database, fieldSchema: fieldSchema as MFieldSchema[], formInfo: formDetail.data};
  }
}


