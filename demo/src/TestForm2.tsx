import React, { useState, useEffect } from "react";
import { M3, SubmitBar } from "../../src";
import { message } from 'antd';

let db = {
  "participantList": [
    {
      "archiveId": {
        "value": 37160,
        "label": "柳青(青青) / 北京小桔科技有限公司"
      },
      "role": "哈哈光",
      "coConstructionTime": 2
    }
  ],
  "archiveId": {
    "value": 37160,
    "label": "柳青(青青) / 北京小桔科技有限公司"
  },
}
const TestForm2 = () => {
  const [database, setDatabase] = useState(db)
  useEffect(() => {

  }, []);

  return <div>
    <M3
      morph={'editor'}
      debug={true}
      schema={{
        name: 'quest',
        type: 'object',
        objectFields: [
          // {
          //   name: "participantList", type: "array", editor: "AArrayGrid",
          //   arrayMember: {
          //     column: 3,
          //     // 新增时指定带下来的字段
          //     copyFields: ['role', 'coConstructionTime'],
          //     objectFields: [
          //       {
          //         label: "人物档案", name: "archiveId", placeholder: '请选择人物档案', type: "vl", editor: "ARemoteSelector", required: true,
          //         remote: {
          //           url: "/academy/hom/lyg/archive/search?type=1&keywords=${q}",
          //           dataPath: "data.list",
          //           valuePath: "id",
          //           labelExpr: "name +  ' / ' + brief"
          //         }, readable: 'A', a: {
          //           labelExpr: (val) => {
          //             console.log('lableExpr:' + String(val))
          //             return <span>fdasfasa</span>
          //           },
          //           onClick: (val) => {
          //             window.open(`/#/archive-detail?id=${val.value}`)
          //           }
          //         }
          //       },
          //       { label: "角色", name: "role", type: "string", required: true, },
          //       { label: "共建时", name: "coConstructionTime", type: "int" },
          //     ]
          //   }
          // },
          {
            label: "人物档案", name: "archiveId", placeholder: '请选择人物档案', type: "vl", editor: "ARemoteSelector", required: true,
            remote: {
              url: "/academy/hom/lyg/archive/search?type=1&keywords=${q}",
              dataPath: "data.list",
              valuePath: "id",
              // labelExpr: "name +  ' / ' + brief",
              labelExpr: (val) => {
                console.log('lableExpr:', val)
                // return <span>{val.name +  ' / ' + val.brief}</span>
                return  val.name +  ' / ' + val.brief
              },
            }, readable: 'A', a: {
              labelExpr: (val, p) => {
                console.log('lableExpr:', val, p)
                return <span>{val.label}</span>
              },
              onClick: (val) => {
                window.open(`/#/archive-detail?id=${val.value}`)
              }
            }
          },
        ],
        // uispec: {
        //   type: "segmentForm",
        //   layout: "horizontal",
        //   comma: "：",
        //   segments: [
        //     { label: "参与人信息", fields: ["participantList"] }
        //     // { label: "资料信息", fields: ["resourceList"] },
        //   ]
        // }
      }
      }
      database={database}>
      <SubmitBar onSubmit={async (d: any) => {
        return new Promise(function (resolve, reject) {
          setTimeout(() => {
            message.success("提交成功");
            resolve(null);
          }, 5000);
        });
      }} />
    </M3>
  </div>
}
export default TestForm2