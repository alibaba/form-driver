import React, { useState, useEffect } from "react";
import { M3, SubmitBar, useForm } from "../../src";
import { message } from 'antd';

let db = {
    upload_file1234: [{
        uid: 'rc-upload-1715741152318-134567',
        name: '774KB.m4a',
        keyPath: "业务数据/速记/录音/370/774KB.m4a",
        size: 308049,
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
                        "editor": "ACheckBox",
                        "min": 2,
                        "max": 2,
                        "name": "t_CA223B10",
                        "label": "请选择你心目中的组长（选择5位）",
                        "type": "set",
                        "required": true,
                        "openOption": {
                            "type": "string",
                            "label": "其他补充"
                        },
                        "option": [
                            {
                                "label": "蔡铁强（德尔玛集团）",
                                "value": "4752530E"
                            },
                            {
                                "label": "崔鹏（菲鹏集团）",
                                "value": "7F350281"
                            },
                            {
                                "label": "单卫钧（沪上阿姨）",
                                "value": "AF887DEA"
                            },
                            {
                                "label": "翟健（雷霆游戏）",
                                "value": "A6EB6FDC"
                            },
                            {
                                "label": "杜建（银店小秘）",
                                "value": "26EA8854"
                            },
                            {
                                "label": "杜庆东（上嘉物流）",
                                "value": "658D73A1"
                            },
                            {
                                "label": "冯斌（黄天鹅鸡蛋）",
                                "value": "6189EE79"
                            },
                            {
                                "label": "高德福（喜家德水饺）",
                                "value": "D354181E"
                            }
                        ]
                    },
                    {
                        "name": "AEmailBox",
                        "label": "邮箱",
                        editor: 'ASpecInputBox',
                        type: 'email',
                    },
                    {
                        "name": "ATelBox",
                        editor: 'ASpecInputBox',
                        type: 'tel',
                        "label": "手机号",
                    },
                    {
                        "type": "ossupload",
                        "name": "upload_file1234",
                        "label": "录音文件上传",
                        props: {
                            oss_upload_token: {
                                url: '/academy/hom/shorthand/course/production/oss_upload_token',
                                params: { shorthandId: 370 }
                            },
                            checkSame: true,
                            showSize: true,
                            multiple: true,
                            maxSize: 1000,
                            accept: ".mp3,.m4a,.wav"
                        }
                    },
                ]
            }}
            database={db}>
            <SubmitBar onSubmit={async (d: any) => {
                return new Promise(function (resolve, reject) {
                    console.log('testform2-form', form);
                    console.log('testform2-form', d);
                    console.log('testform2-form', d[1].name);
                    console.log('testform2-form', d[1].size);
                    if (localStorage["m3-plugin-ossupload-loading"]) {
                        message.error("请等待文件上传完成后提交");
                        reject(null)
                        return
                    }
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