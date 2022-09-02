import React from "react";
import { message, Button } from 'antd';
import 'form-driver/dist/m3.css'
import { M3, SubmitBar, assembly, MFieldSchema } from 'form-driver';
import OssUpload from "../../src/index";

// 在 m3 中注册文本插件
assembly.addType(OssUpload);

const schema: MFieldSchema = {
    type: "object",
    name: 'question',
    objectFields: [
        {
            "type": "attachment",
            "name": "upload_file",
            "label": "文件上传",
            props: {
                getTokenUrl: `/academy/oss/getSTSToken`,
                keyPath: 'questionnaire/123/23801',
                maxSize: 1000,
                maxCount: 2,
                mimeTypes: [ //只允许上传图片和zip文件
                    { title: "Image files", extensions: "jpg,gif,png,bmp" },
                    { title: "Zip files", extensions: "zip" }
                ],
            }
        },
    ]
}

const database = {
    upload_file: [
        {
            name: 'hahahah.jpg',
            osskey: 'questionnaire/123/23801/hahahah.jpg'
        }
    ],
}

export class TestForm extends React.Component<any, any> {
    render() {
        return <M3 schema={schema} database={database} morph="editor">
            <SubmitBar onSubmit={async (d: any) => {
                console.log(d);
                return new Promise(function (resolve, reject) {
                    setTimeout(() => {
                        message.success("提交成功");
                        resolve(null);
                    }, 1000);
                });
            }}>
                {loading => <div style={{ color: loading ? "gray" : "black" }}>
                    <Button>提交</Button>
                </div>}
            </SubmitBar>
        </M3>
    }
}