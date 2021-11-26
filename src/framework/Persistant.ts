// 在本地持久保存表单，防止丢失
import _ from "lodash";
import { AFTER_CHANGE_CALLBACK } from "./Schema";
import { Modal } from "antd"
/**
 * MViewer的配置
 */
export interface PersistantConf {
  /** 持久存储的localStorageKey前缀 */
  localStorageKeyPrefix: string;
  /** 是否询问恢复至缓存 */
  useConfirm?: Boolean;
  /** 如何合并database和persistant数据，默认是local覆盖database */
  override?: (database:any, local:any) => void;
}

let confirming = false

export const PersistantTool = {
  load: function initPersistant(database:any, persistant?: PersistantConf, updateViewer?: any){
    // 填入本地缓存值
    const prefix = persistant?.localStorageKeyPrefix;
    const useConfirm = persistant?.useConfirm;
    if(prefix) {
      const successCb = () => {
        let localDb = {};
        for(let key in localStorage) {
          try {
            if(_.startsWith(key, prefix)) {
              _.set(localDb, key.substr(prefix.length), JSON.parse(localStorage[key]))
            }
          } catch(e){ // 加载值错了不能影响表单填写
            console.log(e);
          }
        }
        (persistant.override ?? _.assign)(database, localDb);
      }
      if(useConfirm && Object.keys(localStorage).find(f=> f.indexOf(prefix) === 0) && !confirming) {
        // 防止同时多次弹框
        confirming = true
        Modal.confirm({
          content: '是否恢复您上次填写过但未提交的内容？',
          okText: '恢复',
          cancelText: '取消',
          onOk: () => {
            confirming = false
            successCb()
            updateViewer()
          },
          onCancel: () => {
            confirming = false
            this.clear(persistant)
          }
        });
      } else {
        successCb()
      }
    }
  },

  patchAfterChange: function(afterChange: AFTER_CHANGE_CALLBACK, persistant?: PersistantConf){
    const prefix = persistant?.localStorageKeyPrefix;
    return prefix ? (path, v, final) => {
        if(final){
          if(_.isNil(v)){
            localStorage.removeItem(prefix + path)
          } else {
            localStorage.setItem(prefix + path, JSON.stringify(v))
          }
        }
        afterChange?.(path, v, final);
      }
      :  afterChange;
  },

  clear: function(persistant?: PersistantConf){
    const pprefix = persistant?.localStorageKeyPrefix;
    if(pprefix) { // 提交成功，删掉所有的本地存储
      for(let key of Object.keys(localStorage)){
        try {
          if(_.startsWith(key, pprefix)) {
            localStorage.removeItem(key);
          }
        } catch(e) { // 出错不能影响主流程
          console.log(e);
        }
      }
    }
  }
}
