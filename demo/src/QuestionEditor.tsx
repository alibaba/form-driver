import React, { useState, useEffect } from "react";
import { Ajax } from '../../src/framework/Ajax';
import { message } from 'antd';
import { M3, SubmitBar } from "../../src";

const QuestionEditor = () => {
  const [database, setDatabase] = useState({})
  useEffect(() => {
    setTimeout(() => {
      setDatabase([])
    }, 1000)
  }, []);

  return <div>
    <M3
      morph={'editor'}
      debug={true}
      schema={{
        name: 'quest',
        type: 'object',
        objectFields: [{
            label: "课程", name: "courseList", required: true, type: "array", placeholder: "请输入", editor: "ARemoteSelector",
            remote: {
                url: "/academy/hom/course/list?title=${q}",
                dataPath: "data",
                valuePath: "id",
                labelExpr: "title"
            },
            props: {
                onChange(v) {
                    console.log(v);
                },
                async preOnChange(v) {
                    const id = v[v.length - 1].value
                    const data =  await fetch(`/academy/hom/course?courseId=${id}`).then(res => res.json())
                    return data.data
                }
            }
        }]
      }
      }
      database={database}>
      <SubmitBar onSubmit={async (d: any) => {
        return new Promise(function (resolve, reject) {
          setTimeout(() => {
            message.success("提交成功");
            resolve(null);
          }, 2000);
        });
      }} />
    </M3>
  </div>
}
export default QuestionEditor