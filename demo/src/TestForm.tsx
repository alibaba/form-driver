import React, { useState, useEffect } from "react";
import { message } from 'antd';
import { M3, SubmitBar } from "../../src";


export const valueLabel = {
  type: "object",
  name: "-",
  objectFields: [
      { label: "文案", name: "label", type: "string" },
  ]
};

const treeData = [
  {
    title: 'Node1',
    value: '0-0',
    children: [
      {
        title: 'Child Node1',
        value: '0-0-1',
      },
      {
        title: 'Child Node2',
        value: '0-0-2',
      },
    ],
  },
  {
    title: 'Node2',
    value: '0-1',
  },
];

let db = {
  visitor222: '12313',
  "setWithMax": ["不存在的值"],
  // "inttest": 123,
  possibility: 2,
  textASelector: 2,
  orgList: [{ value: 123, label: '发送端接口号发送到发送' }],
  // description: 'fadafashfahslkfhafh',
  // score: 3
  // "tree1": [{
  //   "value": "0-0",
  //   "label": "Node1"
  // },
  // {
  //   "value": "0-0-1",
  //   "label": "Child Node1"
  // }],
  // "upload1": [
  //   {
  //     name: 'xxx.png',
  //     url: 'http://www.baidu.com/xxx.png',
  //   },
  //   {
  //     name: 'yyy.png',
  //     url: 'http://www.baidu.com/yyy.png',
  //   },
  //   {
  //     name: 'zzz.png',
  //     url: 'http://www.baidu.com/zzz.png',
  //   }
  // ]
}
const TestForm = () => {
  const [database, setDatabase] = useState({})
  useEffect(() => {
    setTimeout(() => {
      setDatabase(db)
    }, 1000)
  }, []);

  return <div>
    <M3
      // key={status}
      morph={'readable'}
      // morph={'editor'}
      debug={true}
      schema={{
        name: 'quest',
        type: 'object',
        objectFields: [
          {
            "editor": "ARate",
            "max": 5,
            "name": "t_AE08ED51",
            "label": "评分",
            "type": "int",
            "props": {
              "centerTip": "中立不可能发大水发大水发杀死放",
              "leftTip": "不可能发大水发大水发杀死放",
              "rightTip": "极有可发的发顺丰能"
            }
          },
          {
            "editor": "ARate",
            "max": 10,
            "name": "t_12313",
            "label": "评分",
            "type": "int",
          },
          {
            label: "测试单选", name: "textASelector", type: "enum", required: true, editor: "ASelector", props: { labelInValue: true }, style: { width: '100px' }, option: [
              { value: 1, label: '超级管理员' },
              { value: 2, label: '招生' },
              { value: 3, label: '课程' },
            ]
          },
          {
            label: "归属团队", name: "orgList", required: true, placeholder: '请选择归属团队', type: "array", editor: "ARemoteSelector",
            // style: {
            //     color: "rgba(0,0,0,0.6)",
            // },
            remote: {
              url: "/academy/hom/org/getOrgTree?orgId=6",
              dataPath: "data[0].data",
              valuePath: "id",
              labelExpr: "name",
            },
          },
          { label: "选项", name: `option`, type: "array", editor: "AArrayGrid", arrayMember: valueLabel, autoValue: true },
          {
              label: "事件简介", name: "description", required: true,
              type: "decoration",
              "decoration": {
                HTML: "<p>图文展示fdsfdasfsafafafasdasdf</p><p>fdsfasfs</p>",
                more: true,
                HTML2: "<p>hahhahhahahahahahahah</p><p>fd啊哈发货的哈发顺丰哈哈发哈大沙发萨哈发撒</p>"
              }
          },
          // { name: 'inttest', type: 'int', label: '数字框', max: 10, min: 0},
          // { label: "拜访人", name: "visitor222", type: "string", required: true, props: {
          //   // disabled: true
          // }},
          // {label:"除爱人",name:"familyAccompany",type:"set", editor:"ASetSelector", style: { width: '100px' }, option: "父亲 母亲 孩子 爱人/对象的父亲 爱人/对象的母亲 兄弟姐妹"},
          // {
          //   name: 'recordList', type: 'array', label: '小记', editor: "AArrayGrid",
          //   arrayMember: {
          //     type: "object",
          //     // @ts-ignore
          //     uispec: {
          //       layout: "horizontal", comma: "："
          //     },
          //     column: 3,
          //     objectFields: [
          //       { label: "拜访人", name: "visitor", type: "string", required: true },
          //       {label:"除爱人",name:"familyAccompany",type:"set", editor:"ASetSelector", style: { width: '100px' }, option: "父亲 母亲 孩子 爱人/对象的父亲 爱人/对象的母亲 兄弟姐妹"},
          //       {
          //         label: "测试", name: "test", type: "array", editor: "ARemoteSelector", placeholder: "aaa",
          //         remote: {
          //           url: "/academy/hom/lyg/archive/search?keywords=${q}",
          //           dataPath: "data.list",
          //           valuePath: "id",
          //           labelExpr: "name + '(' + brief + ')'"
          //         },
          //         props: {
          //           disabled: true
          //         }
          //       },
          //       {
          //         "name": "upload_go",
          //         "label": "文件上传_HP_GO",
          //         "type": "array", arrayMember: {
          //           type: 'object',
          //           readable: 'A',
          //           style: { display: 'block' },
          //           a: {
          //             urlExpr: "value.url",
          //             labelExpr: "value.name",
          //           },
          //         },
          //         "editor": "AUpload",
          //         ossFile: {
          //           type: "HP_GO",
          //           arguments: { appName: 'record' }
          //         }, props: {
          //           beforeUpload(file) {
          //             const isLt200M = file.size / 1024 / 1024 < 200;
          //             if (!isLt200M) {
          //               message.error('File must smaller than 200MB!');
          //             }
          //             return isLt200M;
          //           },
          //         }
          //       },
          //     ]
          //   }
          // },
          // {
          //   label: "角色", name: "roleListStr", type: 'set', editor: "ASetSelector", placeholder: '请选择角色',
          //   setFields: [
          //     { value: 1, label: '超级管理员' },
          //     { value: 2, label: '招生' },
          //     { value: 3, label: '课程' },
          //   ]
          // },
          // {
          //   "label": "多选，有最多",
          //   "name": "setWithMax",
          //   "max": 3,
          //   "type": "set",
          //   "option": "1324421467981624932134612414912634682164863214126432194612364796427368 选项2 选项3 选项4 选项5"
          // },
          {
            editor: 'NPS', name: 'possibility', label: "您向朋友或同事推荐本堂课程的可能性有多大?", required: true, props: {
              leftTip: '不推荐',
              rightTip: '非常推荐'
            }
          },
          // {
          //   editor: 'ARate', name: 'score', label: "评分", required: true, props: {
          //     count: 8
          //   }
          // },
        ]
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
export default TestForm