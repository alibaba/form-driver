import React from "react";
import { BaseViewer } from "form-driver";
import { Input } from 'antd';

export class DecorationSegmentLabel extends BaseViewer {
    element() {
        const val = super.getValue()

        return (
            <div>
                <Input defaultValue={val.segmentLabel} onChange={(e) => {
                    const res = e.target.value
                    super.changeValue({
                        segmentLabel: res,
                    })
                }}></Input>
            </div>
        )
    }
}