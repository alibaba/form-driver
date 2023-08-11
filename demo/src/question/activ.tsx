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

  return <M3 schema={input.schema} database={input.database} morph="editor"/>
};

export default Answer;
