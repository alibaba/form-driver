import React from "react";
import { BaseViewer } from "../../../src";
import { InputNumber } from "antd";

// const arr = [
//     { label: "至多上传文件数", name: "maxAmount", type: "int", min: 1, max: 20, defaultValue: 1, placeholder: "请填写数字" },
//     { label: "文件大小上限(MB)", name: "maxSize", type: "int", defaultValue: 100, placeholder: "请填写数字" }
// ]

export class OssuploadProps extends BaseViewer {
    constructor(p) {
        super(p);
        const val = super.getValue()
        if (!val) {
            super.changeValue({
                maxSize: 100,
                maxAmount: 1
            })
        }
    }

    element() {
        const val = super.getValue()

        return (
            <div>
                <InputNumber key="maxAmount" addonBefore={<div style={{ textAlign: 'left', width: '120px' }}>至多上传文件数</div>} min={1} max={99} defaultValue={val?.maxAmount ?? 1} onChange={(e) => {
                    super.changeValue({
                        ...val,
                        maxAmount: e,
                    })
                }}></InputNumber>
                {/* oss 简单上传最大 0.5G */}
                <InputNumber key="maxSize" addonBefore={<div style={{ textAlign: 'left', width: '120px' }}>文件大小上限(MB)</div>} min={1} max={512} defaultValue={val?.maxSize ?? 100} onChange={(e) => {
                    super.changeValue({
                        ...val,
                        maxSize: e,
                    })
                }}></InputNumber>
            </div>
        )
    }
}