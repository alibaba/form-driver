import React from "react";
import { message, Button } from 'antd';
import 'form-driver/dist/m3.css'
import { M3, SubmitBar, assembly, MFieldSchema } from 'form-driver';
import RichText from "../../src/index";

// 在 m3 中注册文本插件
assembly.addType(RichText);

const schema: MFieldSchema = {
    type: "object",
    name: 'question',
    objectFields: [
        {
            label: "简介",
            name: "p_brief",
            type: "rich",
            options: {
                resFormat: (res) => ({HTML: res}),
                srcFormat: (src) => src.HTML,
                changeHandle: (val) => {
                    console.log(val)
                },
                quillOptions: {
                    placeholder: '请输入简介',
                }
            }
        },
        {
            label: "简介2",
            name: "p_brief2",
            type: "rich",
            options: {
                quillOptions: {
                    placeholder: '请输入简介2',
                }
            }
        },
    ]
}

const database = {
    p_brief: {
        subType: "rich",
        HTML: "这是修改返回数据结构的案例"
    },
    p_brief2: "<p>这是<strong> form-dirver</strong> 的 富文本插件,</p><p>基于<strong> quill </strong></p>"
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
                    }, 5000);
                });
            }}>
                {loading => <div style={{ color: loading ? "gray" : "black" }}>
                    <Button>提交</Button>
                </div>}
            </SubmitBar>
        </M3>
    }
}