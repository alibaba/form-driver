import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Button, Modal, Popconfirm, Checkbox, Tooltip, message } from 'antd';
import { WarningOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { M3, SubmitBar, MUtil, useForm, MViewerDebug } from "../../../src";
import _ from "lodash";
import { uuid, design2Api, api2Design } from "./utils";
import { generateItemSchema, unitEnum } from "./editFormSchemaMap";
import CusIcon from "./CusIcon";
import './index.less'

function scrollToBottom(elementId) {
    // 获取对应ID的DOM元素
    var element = document.getElementById(elementId);

    if (element) {
        element.scrollIntoView({
            behavior: "smooth",  // 平滑过渡
            block: "end"      // 下边框与视窗底部平齐
        });
    } else {
        console.log(`Element with id '${elementId}' not found.`);
    }
}

const M3Designer = ({ fieldsSchema, onOK, onCancle, designItem }, ref) => {
    const form = useForm()
    const leftForm = useForm()
    const [schema, setSchema] = useState({
        name: "design-form",
        type: "object",
        objectFields: []
    })
    const [schemaleft, setSchemaleft] = useState({})
    const [idx, setIdx] = useState(-1)
    const [optionIdx, setOptionIdx] = useState(0)
    const [submitLoading, setSubmitLoading] = useState(false)
    const [forbidSubmit, setForbidSubmit] = useState(false)
    const [editModalVisible, setEditModalVisible] = useState(false)
    const [order, setOrder] = useState(1);
    const [order2, setOrder2] = useState(1);
    const [order3, setOrder3] = useState(1);
    const [lastfields, setLastfields] = useState('');
    const [archives, setArchives] = useState([]);

    // 修改schema
    const changeSchema = (sch) => {
        if (sch) {
            form.setSchema(sch)
            setSchema(sch)
        } else {
            const sch = form.getSchema()
            setSchema(sch)
        }
    }

    const changeFormNoSetSchema = (sch) => {
        form.setSchema(sch)
    }

    const changeCurSchema = (index) => {
        const i = index ?? idx
        setIdx(i)
        const lSchema = i >= 0 && schema?.objectFields?.length > 0 ? schema.objectFields[i] : {};
        setSchemaleft(lSchema)
        console.log('lSchema', lSchema);
        setTimeout(() => {
            leftForm.setSchema(generateItemSchema(lSchema))
            leftForm.setDatabase(lSchema)
        }, 0);
    }

    useEffect(() => {
        // 初创问卷自带表单头图
        if (fieldsSchema?.length === 0) {
            fieldsSchema.push({
                "name": `t_${uuid()}`,
                "label": null,
                "type": "decoration",
                "decoration": {
                    "HTML": "<img class='headImage' src='https://online-academy.oss-cn-hangzhou.aliyuncs.com/img/hpwjbg.jpg?x-oss-process=image/resize,w_640/quality,q_50/format,jpg'/><p><br></p>"
                }
            })
        }
        // 转化schema数据
        const fields = api2Design(fieldsSchema, () => {
            // 如果无法解析表单，则弹出提示框并执行失败回调
            Modal.error({
                content: '该表单无法被解析，请使用高级配置修改！',
                maskClosable: false,
                // 点击报错弹窗的确认按钮时执行传入的回调
                onOk: () => { onCancle() }
            });
        })
        changeSchema({
            name: "design-form",
            type: "object",
            objectFields: fields
        })
        setLastfields(JSON.stringify(fields))

        return () => {
            changeCurSchema(-1)
        }
    }, [fieldsSchema])

    useEffect(() => {
    }, [designItem?.id])

    // 判断问卷是否产生改动 
    const questIsChange = () => {
        const schema = form.getSchema()
        return lastfields !== JSON.stringify(schema.objectFields)
    }
    // 通过 useImperativeHandle 函数，将 questIsChange 函数添加到父组件中的 ref.current 中
    useImperativeHandle(ref, () => ({ questIsChange, submit }));

    // 提交
    const submit = (callback) => {
        if (onOK && !submitLoading) {
            const schema = form.getSchema()
            // 如果 schema 有问题打印出来
            const validateResult = MUtil.validateSchema(schema)
            if (validateResult && validateResult.length > 0) {
                console.log(validateResult)
            }
            const res = design2Api(schema.objectFields);
            const cb = onOK(res)

            if (cb instanceof Promise) {
                setSubmitLoading(true)
                cb.then((r) => {
                    // 对新增的输入框回填id
                    schema.objectFields.forEach(e => {
                        if (!e.id) {
                            const item = r.find(ele => ele.component.name === e.name)
                            e.id = item.id
                        }
                    })
                    setLastfields(JSON.stringify(schema.objectFields))
                    message.success('保存成功', 1)
                    // setTimeout(() => {
                    //     changeSchema()
                    // }, 0);
                    callback && callback()
                }).finally(() => {
                    // changeCurSchema()
                    setSubmitLoading(false)
                })
            }
        }
    }

    // 添加选项
    const addInput = (obj) => {
        const schema = form.getSchema()
        const opt = { name: `t_${uuid()}`, relevance: {}, ...obj }
        // 无聚焦状态下，问题加在最后
        if (idx == -1) {
            const len = schema.objectFields.length
            schema.objectFields.splice(len, 0, opt);
            changeCurSchema(len)
            // 自动滑动到底部
            scrollToBottom("m3-designer-wrap");
        } else {
            schema.objectFields.splice(idx + 1, 0, opt);
            changeCurSchema(idx + 1)
        }
        console.log('schema', schema);
        // 修改schema
        changeSchema(schema)
        // setOrder(order + 1);
    }
    // 逻辑设置，关联问题的确认按钮
    const editHandleOk = () => {
        setEditModalVisible(true)
    }
    // 逻辑设置，关联问题的取消按钮
    const editHandleCancel = () => {
        setEditModalVisible(false)
    }

    const lSchema = idx >= 0 && schema?.objectFields?.length > 0 ? schema.objectFields[idx] : {};
    return <div id="m3-designer-wrap" className={'m3-designer-wrap'}>
        {/* 左侧题目的设计器 */}
        <div className={'left-operation'}>
            {
                schemaleft?.type ? (
                    <>
                        {
                            schemaleft?.editor == "NPS" ? (
                                schemaleft?.label2 == "课程评价NPS" ? (<div className={'top'}>
                                    <Tooltip title={'课程评价NPS，该数据会计入课评NPS报表中'}>
                                        课程评价NPS
                                    </Tooltip>
                                </div>) :
                                    schemaleft?.label2 == "老师评价NPS" ? (<div className={'top'}>
                                        <Tooltip title={'老师评价NPS，该数据会计入老师NPS报表中'}>
                                            老师评价NPS
                                        </Tooltip>
                                    </div>) : <div className={'top'}>普通NPS</div>
                            ) : null
                        }
                        {
                            <>
                                {/* leftForm 的 database 即为问卷中某项输入框的schema，在编辑 leftForm 时触发变更问卷的 schema */}
                                <MViewerDebug
                                    key={order3}
                                    form={leftForm}
                                    afterChange={function (path, v, a, cb) {
                                        if (path === 'max' || path === 'min') {
                                            if (_.isNumber(schemaleft.max) && _.isNumber(schemaleft.min) && schemaleft.max < schemaleft.min) {
                                                schemaleft.errorTip = '最大值不能小于最小值!'
                                                setForbidSubmit(true)
                                            } else {
                                                schemaleft.errorTip = ''
                                                setForbidSubmit(false)
                                            }
                                        }
                                        console.log('afterChange this', this, path, v, a, cb);
                                        if (path === 'archive') {
                                            // console.log('archive', v, this);
                                        }
                                        // setTimeout(() => {
                                        //     const db = leftForm.getDatabase()
                                        //     const sema = form.getSchema()
                                        //     const idx = sema.objectFields.findIndex(e => e.name == db.name)
                                        //     sema.objectFields[idx] = db
                                        //     changeFormNoSetSchema(sema)
                                        //     // changeSchema(sema)
                                        // })
                                        setOrder(order + 1);
                                        setOrder3(order3+ 1);
                                    }}
                                    schema={generateItemSchema(lSchema)}
                                    database={lSchema}
                                    // schema={{
                                    //     name: "left-form",
                                    //     type: "object",
                                    //     objectFields: []
                                    // }}
                                    // database={{}}
                                    morph="editor">
                                </MViewerDebug>
                                {
                                    // schemaleft.relevance 有值时，按钮高亮展示
                                    schemaleft?.type === 'set' || schemaleft?.type === 'enum' ?
                                        <div>
                                            <Button disabled={
                                                // @ts-ignore 选项值都不空时才开启关联功能
                                                schemaleft?.option.length > 0 && schemaleft?.option.every(item => item.label) ? false : true
                                            } key={order2} type={JSON.stringify(schemaleft?.relevance).match(/\[([^\]]+)\]/) ? 'primary' : 'default'} onClick={() => {
                                                if (_.isArray(schemaleft.option)) {
                                                    setEditModalVisible(true)
                                                }
                                            }}>
                                                关联问题
                                            </Button>
                                        </div> : null
                                }
                                {
                                    schemaleft?.errorTip ? <div className={'error-tip'}>{schemaleft.errorTip}</div> : null
                                }
                            </>
                        }
                    </>
                ) :
                    <div className={'none-box'}>
                        点击中间区域的控件设置字段
                    </div>
            }
        </div>

        {/* 中间预览窗口 */}
        <div id="middle-operation" className={`middle-operation ql-editor`}>
            {
                schema?.objectFields?.length > 0 ?
                    <div className={MUtil.phoneLike() ? `MEditor_p` : `MEditor`}>
                        <M3 key={order} form={form} debug={false} schema={schema} database={{}} morph={'editor'}
                            formItemWrapper={(ele, _schema) => {
                                const curIdx = schema.objectFields.findIndex(i => i.name === _schema.name)
                                return <div key={_schema.name}
                                    onClick={() => {
                                        changeSchema()
                                        changeCurSchema(curIdx)
                                    }}
                                    className={idx === curIdx ? `${'m3-designer-fliedbox'} ${'m3-designer-fliedbox-active'}` : `${'m3-designer-fliedbox'}`}>
                                    {schema.objectFields[curIdx]?.errorTip ? <div className={'field-state'}><WarningOutlined /></div> : null}
                                    <div className={'field-preview'}>{ele}</div>
                                    <div className={'operate-btn-box'}>
                                        <span className={'id-text'} >
                                            {_schema.name}
                                        </span>
                                        {
                                            curIdx !== 0 ? <div className={'operate-btn'} onClick={(e) => {
                                                const temp = schema.objectFields[curIdx]
                                                schema.objectFields[curIdx] = schema.objectFields[curIdx - 1]
                                                schema.objectFields[curIdx - 1] = temp
                                                changeFormNoSetSchema(schema)
                                                changeCurSchema(idx - 1)
                                                setOrder(order + 1);
                                                e.stopPropagation();
                                            }}>上移</div> : null
                                        }
                                        {
                                            curIdx !== schema.objectFields.length - 1 ? <div className={'operate-btn'} onClick={(e) => {
                                                const temp = schema.objectFields[curIdx]
                                                schema.objectFields[curIdx] = schema.objectFields[curIdx + 1]
                                                schema.objectFields[curIdx + 1] = temp
                                                changeFormNoSetSchema(schema)
                                                changeCurSchema(idx + 1)
                                                setOrder(order + 1);
                                                e.stopPropagation();
                                            }}>下移</div> : null
                                        }
                                        <div className={_schema.canDelete == false ? `${'operate-btn'} disable-link-text` : 'operate-btn'}>
                                            <Popconfirm
                                                title="确定要删除吗这一项吗？"
                                                onConfirm={() => {
                                                    schema.objectFields.splice(curIdx, 1)
                                                    changeSchema(schema)
                                                    setOrder(order + 1);
                                                }}
                                                okText="删除"
                                                cancelText="不删">
                                                删除
                                            </Popconfirm>
                                        </div>
                                        <div className={'operate-btn'} onClick={(e) => {
                                            const copySchema = _.cloneDeep(_schema)
                                            delete copySchema.id
                                            delete copySchema.canDelete
                                            copySchema.name = `t_${uuid()}`
                                            if (copySchema.type != "decoration") {
                                                copySchema.label = `${copySchema.label}(副本)`
                                            }
                                            schema.objectFields.splice(curIdx + 1, 0, copySchema)
                                            changeSchema(schema)
                                            e.stopPropagation()
                                        }}>复制</div>
                                    </div>
                                </div>
                            }}
                        />
                    </div> :
                    <div className={'none-box'}>
                        点击右侧控件添加字段
                    </div>
            }
        </div>

        {/* 右侧题目类型选项 */}
        <div className={'right-operation'}>
            <div className={'select-input-box'}>
                {
                    unitEnum.map((item, index) => {
                        return (
                            <div key={index} className={'select-input'} onClick={() => { addInput(_.cloneDeep(item)) }}>
                                <CusIcon type={item?.icon ?? item?.type}></CusIcon>
                                <span>{item.label ?? item.label2}</span>
                                {
                                    item?.tooltips ?
                                        <Tooltip title={item.tooltips}>
                                            <QuestionCircleOutlined style={{ color: "#1890ff", paddingLeft: '5px' }} />
                                        </Tooltip> : null
                                }
                            </div>
                        )
                    })
                }
            </div>
            <div className={'select-btn-box'}>
                <Button disabled={forbidSubmit} loading={submitLoading} onClick={() => { submit() }}>保存</Button>
            </div>
        </div>

        {/* 逻辑设置弹窗，关联问题设置 */}
        <Modal
            title="逻辑设置"
            width="80%"
            centered
            destroyOnClose
            maskClosable={false}
            className={`${'m3-designer-relevance-modal'}  with-interface-call-modal`}
            open={editModalVisible}
            onOk={editHandleOk}
            onCancel={editHandleCancel}
            footer={null}
        >
            <div className={'m3-designer-relevance'}>
                <div className={'select-value'}>
                    <div className={'title'}>如果本题选中<span style={{ color: 'red' }}>（数字表示该选项已关联题目个数）</span></div>
                    <div className={'select-wrap'}>
                        {
                            // @ts-ignore
                            _.isArray(schemaleft?.option) ? schemaleft.option.map((item, index) => {
                                const len = schemaleft.relevance ? (
                                    schemaleft.relevance[item.value] ? schemaleft.relevance[item.value].length : 0
                                ) : 0
                                return <div key={index} className={optionIdx === index ? `${'select-item'} ${'active'}` : 'select-item'} onClick={() => {
                                    setOptionIdx(index)
                                    setOrder2(order2 + 1)
                                }}>{item.label}({len})</div>
                            }) : null
                        }
                    </div>
                </div>
                <div className={'middle-icon'}>
                    <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3868" width="24" height="24"><path d="M502.88579318 562.12517926h265.32856415a124.27567408 124.27567408 0 1 0-16.777216-62.13783704h-248.55134815V143.937536h270.29959112a114.95499852 114.95499852 0 1 0 111.84810666-141.05289008 114.33362015 114.33362015 0 0 0-101.90605274 62.13783705H471.1954963a36.03994548 36.03994548 0 0 0-31.06891852 39.7682157v395.19664355H234.45033718a116.19775525 116.19775525 0 1 0-12.4275674 62.13783704h218.72518637v333.05880652a36.03994548 36.03994548 0 0 0 31.06891851 39.76821571h294.53334756a124.27567408 124.27567408 0 0 0 109.36259319 62.13783703 116.81913363 116.81913363 0 1 0 0-233.01688888 124.27567408 124.27567408 0 0 0-124.27567408 91.96399881h-248.55134815z m372.82702223-108.74121481a42.25372918 42.25372918 0 0 1 36.03994547 19.26272947 36.66132385 36.66132385 0 0 1 0 38.52545897 42.25372918 42.25372918 0 0 1-36.03994547 19.26272948 39.14683733 39.14683733 0 1 1 0-77.67229629z m9.32067555-372.82702223A39.14683733 39.14683733 0 1 1 844.02251851 117.83964445a38.52545897 38.52545897 0 0 1 41.01097245-37.28270223zM153.67114903 526.70661215a37.90408059 37.90408059 0 0 1-32.93305362 19.26272949 38.52545897 38.52545897 0 0 1 0-77.6722963 37.90408059 37.90408059 0 0 1 32.93305362 19.26272948 39.14683733 39.14683733 0 0 1 0 39.14683733z m722.04166638 314.41745541a39.14683733 39.14683733 0 1 1-41.63235083 38.52545896 40.38959408 40.38959408 0 0 1 41.63235083-38.52545896z" fill="#333333" p-id="3869"></path></svg>
                </div>
                <div className={'relevance-question'}>
                    <div className={'title'}>则展示以下选中的题目<span style={{ color: 'red' }}>（只能关联位于本题之后的题目）</span></div>
                    <div className={'select-wrap'}>
                        <Checkbox.Group
                            key={order2}
                            value={(schemaleft && schemaleft?.option && schemaleft.option[optionIdx] && schemaleft.option[optionIdx].value && schemaleft.relevance && schemaleft.relevance[schemaleft?.option[optionIdx].value]) ?? []}
                            onChange={(checkedValues) => {
                                if (schemaleft.relevance) {
                                    schemaleft.relevance[schemaleft?.option[optionIdx].value] = checkedValues
                                }
                                setOrder2(order2 + 1)
                            }}
                        >
                            {
                                (schema && schema.objectFields && schema.objectFields.slice(idx + 1) || []).map((item) => {
                                    return <div style={{ padding: '0 5px' }} key={item.value}>
                                        <Checkbox value={item.name}>{item.type === "decoration" ? `(图文展示${item.name})` : (item.label ? item.label : `(${item.name})`)}</Checkbox>
                                    </div>
                                })
                            }
                        </Checkbox.Group>
                    </div>
                </div>
            </div>
        </Modal>
    </div>
}

export default forwardRef(M3Designer)

