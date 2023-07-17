import React from "react";
import { message, Button } from 'antd';
import 'form-driver/dist/m3.css'
// import { M3, SubmitBar, assembly, MFieldSchema } from '../../../../src/index';
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
        // HTML: "这是修改返回数据结构的案例",
        // more: true,
        // HTML2: "<p>这是<strong> form-dirver</strong> 的 富文本插件,</p><p>基于<strong> quill </strong></p>"
        "HTML": "<img src=\"http://daily-sec.oss-cn-hangzhou.aliyuncs.com/m3DesignerRichtext/1689305705999-0.png?OSSAccessKeyId=STS.NSwyVcxqxKT2mAoZdS5YD6hM1&amp;Expires=1689307507&amp;Signature=v9PdWWzC2LQR%2FowTaLjfxl1RCOE%3D&amp;security-token=CAISzAJ1q6Ft5B2yfSjIr5DCMuzXla5Z%2FJbZb2fevmQGOdZo2a3m0zz2IHFMdHVsB%2B8bt%2F83m21W7vcflqVoRpJeREvCKM1565kPKs1wnneY6aKP9rUhpMCP%2FgHxYkeJPaawDsz9SNTCAKnPD3nPii50x5bjaDymRCbLGJaViJlhHKJ1Ow6jdmh%2BGctxLAlvo9N4UHzKLqSCPwLNiGjdB1YSmmgas25k7rmlycCx8wfXiEaAqtUYvIPsOJOpHY0Ofp50SIWyx%2FckNPiDgiJZ6hxbsbx7h%2BtBohvKpdCSBVRL2RSNM%2FbZ4sEobi0BP%2FFnSvUf9aajxKcl5b2Myb6akUgdYbtnNA3EX52lzcf%2BH%2BekC800b76TOQ6Wg4jfasWr7F59OipEaV0SKoc7WXZ0CA0xTDbBMbOg%2B13MbQqlRrKMzKYsy51xwkV4Hx9lsPxgKRqAAWrqKETt3yfbByd4jHcztR5uwt8vGrSrbUFmlF6vcvYJwRzOtJ9KU7EiMOBBGzls0smZkpXQNhgwYTlntVIks39Vk%2FMxFr8MpbhKYnW0W7xazAwD9odH9Ea7lD80e19WBMOh7xXl6iyzGG6IXe20FGtF699N%2B%2B3JQeyi8DpMom3t\" class=\"richTextImage\"><p>图文展示如何为他们新获得的阿拉伯领土设计切实可行的行政架构，是奥斯曼人面对的一个实际挑战。阿拉伯人并入奥斯曼帝国时，帝国正迅速向波斯、黑海地区和巴尔干地区扩张。帝国政府为新领土培训和任命合格行政官员的能力不足以应对帝国疆域的迅速扩张。只有那些最接近奥斯曼帝国腹地的地区</p>",
        "more": true,
        "HTML2": "<p>图文展示如何为他们新获得的阿拉伯领土设计切实可行的行政架构，是奥斯曼人面对的一个实际挑战。阿拉伯人并入奥斯曼帝国时，帝国正迅速向波斯、黑海地区和巴尔干地区扩张。帝国政府为新领土培训和任命合格行政官员的能力不足以应对帝国疆域的迅速扩张。只有那些最接近奥斯曼帝国腹地的地区</p>"
    },
    p_brief2: "<p>这是<strong> form-dirver</strong> 的 富文本插件,</p><p>基于<strong> quill </strong></p>"
}

export class TestForm extends React.Component<any, any> {
    render() {
        return <M3 schema={schema} database={database} morph="readable">
        {/* return <M3 schema={schema} database={database} morph="editor"> */}
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