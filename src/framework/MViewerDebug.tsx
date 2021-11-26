import React from "react";
import { Tabs, Button, message } from 'antd';
import _ from 'lodash';
import { useState } from "react";
import { MViewerProp, MViewer } from './MViewer';
import { MUtil } from './MUtil';

const TEXTAREAKEY = "tk";
const FINALDATAKEY = "fd";
const OTHERMORPH = "om";

/**
 * 调试和理解MViewer，使用时除了多一个debug props，完全和MViewer一样
 * debug=true时，通过tab同时展示viewer及其database和schema
 * debug=false时，仅展示viewer
 * @param props 用来调试viewer
 */
export function MViewerDebug(props: React.PropsWithChildren<MViewerProp & {debug?: boolean}>):JSX.Element {
  const [dataVersion, setDataVersion] = useState(0);
  const debug = props.debug ?? (window.location.search.indexOf("debug")>=0 || window.location.hash.indexOf("debug")>=0);
  if(!debug){
    return <MViewer {...props}/>;
  }

  function finalData(){
    return MUtil.filterHide(props.schema, props.database);
  }

  return <Tabs style={props.style} onTabClick={(key:string)=>{
    if(key === TEXTAREAKEY){
      setTimeout(() => { // 让编辑器满屏
        const textarea = document.querySelector("#_data");
        // @ts-ignore
        const h = document.body.clientHeight - textarea.offsetTop;
        // @ts-ignore
        textarea.style.height=(h - 10) + "px";
        // @ts-ignore
        textarea.value =  JSON.stringify(props.database, null, 2);
      })
    } else if(key === FINALDATAKEY) {
      setTimeout(() => {
        let myContainer = document.getElementById('finalData') as HTMLInputElement;
        myContainer.innerHTML = JSON.stringify(finalData() , null, 2);
      });
    } else if(key == OTHERMORPH) {
      setDataVersion(dataVersion + 1);
    }
  }}>
  <Tabs.TabPane tab="页面" key="fk">
    <MViewer {..._.omit(props,"style")} key={dataVersion} />
  </Tabs.TabPane>

  {
    props.morph === "readable"
    ? <Tabs.TabPane tab="编辑模式" key={OTHERMORPH}>
        <MViewer {..._.omit(props,"style")} morph="editor" key={dataVersion} />
      </Tabs.TabPane>
    :  <Tabs.TabPane tab="阅读模式" key={OTHERMORPH}>
        <MViewer {..._.omit(props,"style")} morph="readable" key={dataVersion} />
      </Tabs.TabPane>
  }

  <Tabs.TabPane tab="数据" key={TEXTAREAKEY}>
    <Button onClick={()=>{    // 刷新数据到表单
      try{
        // @ts-ignore
        const json = JSON.parse(document.querySelector("#_data").value);
        for(let k in props.database){
          delete props.database[k];
        }
        _.assign(props.database, json);
        message.success('成了');
        setDataVersion(dataVersion+1);
      } catch(e){
        message.error(<pre>{'json解析失败了\n' + e}</pre>);
      }
    }}>修改</Button>
    <textarea id="_data" style={{width:"100%", padding:"0"}}/>
  </Tabs.TabPane>
  <Tabs.TabPane tab="最终数据" key={FINALDATAKEY}>
    <pre id="finalData" className="ant-input" style={{"width": "100%"}}/>
  </Tabs.TabPane>
  <Tabs.TabPane tab="Schema" key="schema">
    <pre className="ant-input" style={{"width": "100%"}}>
      {MUtil.validateSchema(props.schema).map(r=><div key="warn" style={{color: "red"}}>{r.message}</div>)}
      {JSON.stringify(props.schema, null, 2)}
    </pre>
  </Tabs.TabPane>
  <Tabs.TabPane tab="UT" key="ut">
    <div key="ut" className="ant-input" style={{"width": "100%"}}>
      {JSON.stringify({name:`debug-${Date.now()}`, schema: props.schema, database: props.database})},
    </div>
  </Tabs.TabPane>
  </Tabs>
}
