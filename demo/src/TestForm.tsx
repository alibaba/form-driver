import React, { useState, useEffect } from "react";
import { message } from 'antd';
import { M3, SubmitBar } from "../../src";

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
      morph={'editor'}
      debug={true}
      schema={{
        name: 'quest',
        type: 'object',
        objectFields: [
          {label:"测试单选",name:"textASelector",type:"enum",  required: true, editor:"ASelector", props: {labelInValue: true}, style: { width: '100px' }, option: [
            { value: 1, label: '超级管理员' },
            { value: 2, label: '招生' },
            { value: 3, label: '课程' },
          ]},
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
          // {
          //   editor: 'NPS', name: 'possibility', label: "您向朋友或同事推荐本堂课程的可能性有多大?", required: true, props: {
          //     leftTip: '不推荐',
          //     rightTip: '非常推荐'
          //   }
          // },
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