import React, { useState, useEffect } from "react";
import { M3, SubmitBar } from "../../src";
import { message } from 'antd';

let db = {
}
const TestForm2 = () => {
  const [database, setDatabase] = useState({})
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
          {
            name: "participantList", type: "array", editor: "AArrayGrid",
            arrayMember: {
              column: 3,
              // 新增时指定带下来的字段
              copyFields: ['role', 'coConstructionTime'],
              objectFields: [
                {
                  label: "人物档案", name: "archiveId", placeholder: '请选择人物档案', type: "vl", editor: "ARemoteSelector", required: true,
                  remote: {
                    url: "/academy/hom/lyg/archive/search?type=1&keywords=${q}",
                    dataPath: "data.list",
                    valuePath: "id",
                    labelExpr: "name +  ' / ' + brief"
                  }, readable: 'A', a: {
                    onClick: (val) => {
                      window.open(`/#/archive-detail?id=${val.value}`)
                    }
                  }
                },
                { label: "角色", name: "role", type: "string", required: true, },
                { label: "共建时", name: "coConstructionTime", type: "int" },
              ]
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