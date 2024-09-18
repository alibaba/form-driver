import React from "react";
import { BaseViewer } from "../../../src";
import { Input } from 'antd';

export class RateProps extends BaseViewer {
    element() {
        const val = super.getValue()

        return (
            <div>
                <Input key="leftTip" addonBefore="左侧描述:" defaultValue={val?.leftTip ?? ''} onChange={(e) => {
                    const res = e.target.value
                    super.changeValue({
                        ...val,
                        leftTip: res,
                    })
                }}></Input>
                <Input key="centerTip" addonBefore="中间描述:" defaultValue={val?.leftTip ?? ''} onChange={(e) => {
                    const res = e.target.value
                    super.changeValue({
                        ...val,
                        centerTip: res,
                    })
                }}></Input>
                <Input key="rightTip" addonBefore="右侧描述:" defaultValue={val?.rightTip ?? ''} onChange={(e) => {
                    const res = e.target.value
                    super.changeValue({
                        ...val,
                        rightTip: res,
                    })
                }}></Input>
            </div>
        )
    }
}