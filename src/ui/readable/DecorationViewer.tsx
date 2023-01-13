import React from "react";
import { useState } from 'react';
import { MProp } from '../../framework/Schema';
import { Button, Modal, message, Space} from 'antd';
import { MUtil } from '../../framework/MUtil';
import { assembly } from '../../framework/Assembly';
import { MContext } from '../../framework/MContext';
import _ from "lodash";

export function DecorationViewer(props:MProp){
  let subType = props.schema?.decoration?.subType;

  if (!subType) {
    if(_.isString(props.schema?.decoration?.HTML)) {
      subType = "rich";
    } else if ( _.isString(props.schema?.decoration?.segmentLabel)) {
      subType = "segmentLabel";
    } else if (_.isString(props.schema?.decoration?.submitLabel)) {
      subType = "submitBar";
    } else if (props.schema?.decoration?.operations) {
      subType = "operations";
    }
  }


  const s = props.schema.style

  if(subType === 'rich') {
    // HTML 片段
    return <div style={{...s}} dangerouslySetInnerHTML={{ __html: props.schema.decoration.HTML}}></div>
  } else if(subType === 'submitBar') {
    // 提交按钮
    const [loading, setLoading] = useState(false);
    return <MContext.Consumer>
      {
        ctx => <div style={{textAlign: "center", ...s}}>
          <Button type="primary" loading={loading} onClick={()=>{
            const finalData = MUtil.filterHide(ctx.rootProps.schema, props.database)
            const r = assembly.validate(ctx.rootProps.schema, finalData);
            ctx.setForceValid(true);
            if(r){ // 校验有问题
              Modal.warning({
                content: '还没填完呢',
                onOk:()=> document.getElementById(r.path)?.scrollIntoView({behavior: 'smooth', block: 'start'})
              });
            } else {
              if(ctx.rootProps.onSubmit){
                setLoading(true);
                ctx.rootProps.onSubmit(finalData).finally(() => {
                  setLoading(false);
                })
              } else {
                message.success("填完了，但提交功能还在开发中，请联系技术支持人员");
              }
            }
          }}>{props.schema.decoration.submitLabel}</Button>
        </div>
      }
    </MContext.Consumer>
  } else if(subType === 'segmentLabel'){
    // 分段标题
    return <div style={{borderBottom: "1px solid #d9d9d9", padding: "0 0 10px",  margin: "20px 0 15px", fontSize: 19, fontWeight: "bold", ...s}}>
      {props.schema.decoration.segmentLabel}
    </div>
  } else if(subType === 'operations'){
    return <Space size="middle" style={{...s}}>
      {props.schema.decoration.operations.map((o,index)=>
        <a key={index} onClick={()=>{
          const ppath = MUtil.parentPath(props.path);
          o.handler(ppath ? _.get(props.database, ppath): props.database)
          }}>
          {o.label}
        </a>
      )}
    </Space>
  } else {
    return MUtil.error("无效的Decoration", props.schema);
  }
}
