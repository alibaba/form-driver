import React, { useState, useEffect } from "react";
import { M3, SubmitBar, useForm } from "../../src";
import { message } from 'antd';

let db = {
  upload_file1234: [{
    uid: 'rc-upload-1715741152318-134567',
    name: '774KB.m4a',
    keyPath: "业务数据/速记/录音/370/774KB.m4a",
    url: "https://daily-hp-mam.oss-cn-hangzhou.aliyuncs.com/%E4%B8%9A%E5%8A%A1%E6%95%B0%E6%8D%AE/%E9%80%9F%E8%AE%B0/%E5%BD%95%E9%9F%B3/370/774KB.m4a"
  }],
}
const TestForm3 = () => {
  const form = useForm()
  useEffect(() => {
  }, []);

  return <div>
    <M3
      form={form}
      morph={'editor'}
      debug={true}
      schema={{
        name: 'quest',
        type: 'object',
        objectFields: [
          {
            "type": "ossupload",
            "name": "upload_file1234",
            "label": "录音文件上传",
            props: {
              oss_upload_token: {
                url: '/academy/hom/shorthand/course/production/oss_upload_token',
                params: { shorthandId: 370 }
              },
              multiple: true,
              maxSize: 1000,
              accept:".mp3,.m4a,.wav" 
            }
          },
        ]
      }}
      database={db}>
      <SubmitBar onSubmit={async (d: any) => {
        return new Promise(function (resolve, reject) {
          console.log('testform2-form', form);
          console.log('testform2-form', d);
          setTimeout(() => {
            message.success("提交成功");
            resolve(null);
          }, 200);
        });
      }} />
    </M3>
  </div >
}
export default TestForm3