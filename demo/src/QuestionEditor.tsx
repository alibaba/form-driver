import React, { useState, useEffect } from "react";
import { Ajax } from '../../src/framework/Ajax';
import { message } from 'antd';
import { M3, SubmitBar } from "../../src";

const QuestionEditor = () => {
  const [database, setDatabase] = useState({})
  useEffect(() => {
    setTimeout(() => {
      setDatabase({
        courseList: [],
      })
    }, 1000)
  }, []);

  return <div>
    <M3
      morph={'editor'}
      debug={true}
      schema={{
        name: 'quest',
        type: 'object',
        objectFields: [
          {
            label: "vl", name: "vl", placeholder: '请选择关联资料', type: "vl", editor: "ARemoteSelector", required: true,
            readable: 'A',
            a: {
              onClick: val => {
                console.log('val', val);
              }
            },
            remote: {
                url: "/academy/hom/lyg/event/resource/search?keyword=${q}",
                dataPath: "data",
                valuePath: "resourceId",
                labelExpr: "resourceName"
            },
            props: {
              onChange(v) {
                // console.log(v);
              },
              async preOnChange(v) {
                return {vlaue: v.value, label: v.label, id: v.label}
              }
            }
          },
          {
            label: "array", name: "array", required: true, type: "array", placeholder: "请输入", editor: "ARemoteSelector",
            remote: {
              url: "/academy/hom/course/list?title=${q}",
              dataPath: "data",
              valuePath: "id",
              labelExpr: "title"
            },
            props: {
              onChange(v) {
                // console.log(v);
              },
              async preOnChange(v) {
                const ids = v.map(i => i.value)
                const payload = ids.join('&courseIds=')
                const data = await fetch(`/academy/hom/course/list?courseIds=${payload}`).then(res => res.json())
                const result = data.data.map(item => ({ ...item, label: item.title, value: item.id }))
                return result
              }
            }
          },
          {
            label: "string", name: "string", required: true, type: "string", placeholder: "请输入", editor: "ARemoteSelector",
            remote: {
              url: "/academy/hom/course/list?title=${q}",
              dataPath: "data",
              valuePath: "id",
              labelExpr: "title"
            },
            props: {
              onChange(v) {
                // console.log(v);
              },
              async preOnChange(v) {
                return v.value
              }
            }
          }
        ]
      }}
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