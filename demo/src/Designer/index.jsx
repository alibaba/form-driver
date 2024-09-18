import React, { useEffect, useState, useRef } from 'react';
import { Modal } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import M3Designer from "../M3Designer/index";
import './index.less'

// 记录打开设计器前的滚动高度
let pageScrollTop = 0

{/* 问卷设计器 */ }
const Designer = ({ curSchema, setCurSchema, designItem, type, callback }) => {

    const childRef = useRef(null); // 父组件定义一个对子组件的引用

    useEffect(() => {
        pageScrollTop = window.document.documentElement.scrollTop
        window.document.documentElement.scrollTop = 0
    }, [])

    const closeDesignerAction = () => {
        window.document.documentElement.scrollTop = pageScrollTop
        setCurSchema(false)
    }

    const closeDesigner = () => {
        const isChange = childRef.current.questIsChange();
        if (isChange) {
            Modal.confirm({
                content: '存在未保存的修改',
                okText: '保存并退出',
                cancelText: '直接退出',
                closable: false,
                maskClosable: false,
                onCancel() {
                    closeDesignerAction()
                },
                onOk() {
                    childRef.current.submit(closeDesignerAction)
                },
            });
        } else {
            closeDesignerAction()
        }
    }

    return <div className={curSchema ? 'm3-designer-drawer-wraper m3-designer-drawer-wraper-open' : 'm3-designer-drawer-wraper'} style={{ display: curSchema ? 'block' : 'none' }}>
        <div className='m3-designer-drawer-header'>
            <span className='m3-designer-drawer-header-title'>{designItem?.name}</span>
            {
                designItem?.templateId ? <span className='m3-designer-drawer-header-tip'>（已选择问卷模版：<span className="orange">{designItem?.templateName}</span>）</span> : null
            }
            <span className='m3-designer-drawer-header-close' onClick={closeDesigner}><CloseOutlined style={{ fontSize: '18px' }} /></span>
        </div>
        <div className='m3-designer-drawer-content'>
            <M3Designer ref={childRef} designItem={designItem} fieldsSchema={curSchema} onOK={(res) => {
                const result = res.map((e, index) => {
                    return {
                        component: e,
                        label: e.label,
                        id: e.id,
                        type: e.type === "decoration" ? 1 : 2,
                        order: index
                    }
                })
                return callback({ id: designItem?.id, finalData: result });
            }} onCancle={closeDesigner} />
        </div>
    </div>
}

export default Designer;