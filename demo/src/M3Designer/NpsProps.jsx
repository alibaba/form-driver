import React from "react";
import { BaseViewer } from "../../../src";
import { Input } from 'antd';

export class NpsProps extends BaseViewer {
    element() {
        const val = super.getValue()

        return (
            <div>
                <Input key="leftTip" addonBefore="左侧描述:" defaultValue={val?.leftTip ?? '不可能'} onChange={(e) => {
                    const res = e.target.value
                    super.changeValue({
                        ...val,
                        leftTip: res,
                    })
                }}></Input>
                <Input key="rightTip" addonBefore="右侧描述:" defaultValue={val?.rightTip ?? '极有可能'} onChange={(e) => {
                    const res = e.target.value
                    super.changeValue({
                        ...val,
                        rightTip: res,
                    })
                }}></Input>
                <div style={{paddingTop: '10px', 'font-weight': 'bold', color: '#000000d9'}}>备注</div>
                <Input.TextArea key="remark" placeholder='请填写备注' defaultValue={val?.remark ?? ''} onChange={(e) => {
                    const res = e.target.value
                    super.changeValue({
                        ...val,
                        remark: res,
                    })
                }}></Input.TextArea>
            </div>
        )
    }
}