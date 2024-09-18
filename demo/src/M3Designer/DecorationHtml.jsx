import React from "react";
import { BaseViewer } from "form-driver";
import QuillEditor from '@/components/QuillEditor/index';
import { Radio } from "antd";
import { QuillToolbar2 } from '@/utils/constant';

class DecorationHtml extends BaseViewer {
    element() {
        console.log('DecorationHtml', this.props);
        const val = super.getValue() || {}

        return (
            <div>
                <QuillEditor key="HTML" options={{
                    maxHeight: '350px',
                    videoWidth: '100%',
                    videoHeight: '169px',
                    autoplay: false,
                    ossKeyPath: `m3DesignerRichtext`,
                    isPublic: true,
                    imgClassName: 'richTextImage',
                    useVideo: true,
                    placeholder: '请输入',
                    toolbar: QuillToolbar2,
                    initialValue: val.HTML,
                    changeHandle: (el, v) => {
                        val.HTML = v || ''
                        console.log(val)
                        super.changeValue(val)
                    },
                }} />
                <div style={{ margin: '10px 0' }}>
                    <span style={{ marginRight: "15px", fontWeight: 'bold' }}>展示更多</span>
                    <Radio.Group
                        defaultValue={!!val.more}
                        onChange={(vv) => {
                            let v = vv.target.value;
                            val.more = !!v
                            super.changeValue(val)
                        }}
                    >
                        <Radio value={true}><span style={{ marginRight: "10px" }}>是</span></Radio>
                        <Radio value={false}><span style={{ marginRight: "0px" }}>否</span></Radio>
                    </Radio.Group>
                </div>
                <div style={{
                    display: val.more ? 'block' : 'none'
                }} >
                    <QuillEditor key="HTML2" options={{
                        maxHeight: '350px',
                        ossKeyPath: `m3DesignerRichtext`,
                        isPublic: true,
                        imgClassName: 'richTextImage',
                        placeholder: '请输入',
                        toolbar: QuillToolbar2,
                        initialValue: val.HTML2,
                        changeHandle: (el, v) => {
                            val.HTML2 = v || ''  
                            super.changeValue(val)
                        },
                    }} />
                </div >
            </div>
        )
    }
}

export default DecorationHtml
