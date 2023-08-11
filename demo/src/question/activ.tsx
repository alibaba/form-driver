// import 'form-driver/dist/m3.css';
import React, { useEffect, useState } from "react";
import _ from "lodash";
import { Ajax, M3, MFieldSchema, MUtil, assembly } from "../../../src";
import { QUtil } from "./QUtils";
import CourseLink from "./m3Plugin/courseLink";

assembly.addType(CourseLink);

interface Input {
  schema: MFieldSchema,
  database: any,
}

const Answer = () => {
  function getCookie(name, cusCookie) {
    let arr = null;
    const reg = new RegExp(`(^| )${name}=([^;]*)(;|$)`);
    const cok = cusCookie || document.cookie;
    // eslint-disable-next-line no-cond-assign
    if (arr = cok.match(reg)) {
      return unescape(arr[2]);
    }
    return null;
  }

  const cok = 'tfstk=cH3NBg2NDrDIFJmGzyU2GICfpWYOCYliiwP7jLZsDledrZXrLf501tFnHyVUG6W0j; hupan-hom_USER_COOKIE=96B0B0F93469C0CBF3CE47B157045CC7078AE02F1B7389594BD674FB5CC34772D743F406D640699721F52A2056ED4F3FBFE71176C179E35A59EB38A52C248196B2853ED4095AF83A2E9F5B00EFE0DEFA48400182A386237E5C6BFB06E01149240BEA17CAF6C7A5D3219B00A3626522178B2DBFE2736881A5FB564EDE3E07809C21BA4CA7CB933812FCCCD4386446E56BF6E35703B8EC036AF4AB4D697A9A1B7A898239407E384A80AF1FB6B4803F7A7B803AF0C1A34E66E8628685ABDC4985CB1EA9F9ACED0B7ADC343B408A166A9E8B858C2F332F3AE066C88E38816B5315B9912ED2205AE486FE485777AEED7397BBC9C9A3F9DE75A48E5D2886154011BAC6935B12A60C0DCD38264E724A63483E01A5CD7D88D912E4F384FD3756F589D4B92D932DC0945BC809BA239F6595F5319F8062E55CE4D07509661D65DF1D75C85A; XSRF-TOKEN=47ea8cc1-776c-4f76-aba3-bd5f6bd7261c; JSESSIONID=64B18DEB98AB06E722FA1961C90B4419; SSO_LANG_V2=ZH-CN; sid=E294163E3E7B3FF73EA1F5B52260F282.hupan-hom011159174187.nt12; hupan-hom_SSO_TOKEN_V2=DA69F0AFF6F24AF58750B0B5F2FB8BF2BB17A0780E326002B8A24EF7DE12B1CD44331A5DDDE1C72BE9050FE5DD530ECD5A984C70A70040120C7F80F82838645B'
  const keys = ['cna', 'isg', 'SSO_LANG_V2', 'SSO_EMPID_HASH_V2', 'sid', 'JSESSIONID', 'hupan-hom_USER_COOKIE', 'hupan-hom_SSO_TOKEN_V2'];
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    const v = getCookie(k, cok);
    document.cookie = `${k}=${v}`;
  }

  async function onLoad() {
    const { data } = await Ajax.get(`/academy/questionnaire/detail?uniqueId=jTfaRx6`)
    const list = _.get(data, 'unitList');
    const prevServerData = QUtil.decode(_.get(data, 'data'));
    const name2id = {};
    list.forEach(i => name2id[i.component.name] = i.id);
    for(let i = 0; i < list.length; i++){
      const component = JSON.parse(JSON.stringify(list[i].component))
      const id = JSON.parse(JSON.stringify(list[i].id))
      component.tolerate = true;
      if (component.type === 'attachment') {
        component.props.getTokenUrl = `/academy/oss/getSTSToken`
        component.props.keyPath = `questionnaire/${data.id}/${id}`
      }
      if(component.type === 'courseLink') {
        const courseIdList = JSON.parse(JSON.stringify(component.courseList.map(c => c.value)))
        let requests = []
        for(let i = 0; i < courseIdList.length; i++){
          const req = new Promise(resolve => Ajax.get(`/academy/course/detail?courseId=${courseIdList[i]}&channel=1`).then(res => resolve(res.data)))
          requests.push(req)
        }
        const courseDetailList = await Promise.all(requests)
        component.courseDetailList = courseDetailList
      }
      list[i].component = component
    }   
    const schema = {
      name:"quest", 
      type:"object", 
      objectFields: list.map(item => item.component)
    };
    
    // 处理database
    const database = _.assign({}, MUtil.renameKey(prevServerData, _.invert(name2id)));
    setInput({schema, database})
  }
  const [input, setInput] = useState<Input>({schema: {
    name:"quest", 
    type:"object", 
    objectFields: []
  }, database: []})
  useEffect(() => { onLoad() }, []);

  return <M3 schema={input.schema} database={input.database} morph="editor" changeSchema={v => v}/>
};

export default Answer;
