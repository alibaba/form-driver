import { Button, Modal } from 'antd';

import React from "react";
import jsonUt from './case.json';
import _ from 'lodash';
import { M3 } from '../../../src/';
import { SubmitBar } from '../../../src/framework/MViewer';
import { MFieldSchema } from '../../../src/framework/Schema';
import { MUtil } from '../../../src/framework/MUtil';
import { UtProps } from './withCode/utprops';
import { IntBadData } from './withCode/intbaddata';

const codeUt = [
    UtProps,
    IntBadData
]

function buttonList(list, prefix) {
    return list.map((c,idx)=> {
        const key = prefix + idx;
        return <Button key={key} style={{display:"block", marginBottom: 10}} onClick={()=>{
            location.href = location.href + "&name=" + key
        }}> {key}: {c.name ?? "未命名"} </Button>
    })
}

export function UTDriver() {
    const q = MUtil.getQuery();
    if(q.name?.indexOf('ju') == 0){
        const idx = parseInt(q.name.substr(2))
        try {
            const {schema, database} = jsonUt[idx]
            return <div style={{margin: 5}}>
                <Button onClick={()=> location.href = "/?UTDriver"}>返回测试用例列表</Button>
                <M3 key={q.name} schema={schema as MFieldSchema} database={database} morph="editor" afterChange={console.log}>
                    <SubmitBar onSubmit={async(finalData) => {
                        return new Promise(function(resolve, reject){
                            setTimeout(()=>{
                                Modal.confirm({
                                    title: '是否让它成功？',
                                    content: <pre>{JSON.stringify(finalData, null, 2)}</pre>,
                                    okText: '模拟提交成功',
                                    cancelText: '模拟提交失败',
                                    onOk(){
                                        resolve(null)
                                    },
                                    onCancel(){
                                        reject(null);
                                    },
                                });
                            }, 1000);
                        });
                    }}/>
                </M3>
            </div>
        } catch(e){
            return <div> 测试用例无效 {q.name} </div>
        }
    } else if(q.name?.indexOf('cu') == 0){
        const idx = parseInt(q.name.substr(2))
        return <>
            <Button onClick={()=> location.href = "/?UTDriver"}>返回测试用例列表</Button>
            <div>
                {React.createElement(codeUt[idx], {}, null)}
            </div>
        </>
    } else {
        return <>
            {buttonList(jsonUt, "ju")}
            {buttonList(codeUt, "cu")}
        </>
    }
}




