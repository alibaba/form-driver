import React from "react";
import { BaseViewer } from "form-driver";
import QuillEditor from '@/components/QuillEditor/index';

class DecorationHtml extends BaseViewer {
    element() {
        const val = super.getValue() || {}

        return (
            <div>
                <QuillEditor key="HTML" options={{
                    maxHeight: '350px',
                    ossKeyPath: `m3DesignerRichtext`,
                    isPublic: true,
                    imgClassName: 'headImage',
                    placeholder: '请输入',
                    toolbar: ['image'],
                    initialValue: val.HTML,
                    changeHandle: (el, v) => {
                        val.HTML = v || ''
                        console.log(val)
                        super.changeValue(val)
                    },
                }} />
            </div>
        )
    }
}

export default DecorationHtml
