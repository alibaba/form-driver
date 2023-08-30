import React from 'react';
import { Row, Col, Divider, Image, Button, Checkbox, Modal, Spin } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import moment from 'moment';
import _ from 'lodash';
import { BaseViewer, Ajax } from "../../../../../src";
import './courseLink.css';

// 判断课程时间是否存在冲突
const determineTime = (currentCourse, controlGroup) => {
    if(currentCourse.eTime < controlGroup.bTime || currentCourse.bTime > controlGroup.eTime || !controlGroup.checkConflict){
        return false
    }else{
        return true
    }
}

class CourseLinkEditor extends BaseViewer {
    constructor(props) {
        super(props);
        this.state = {
            list: props.schema.courseDetailList,
            checkedList: [],
            detailVisible: false,
            loading: false,
        }
    }

    element() {
        // 设置disabled和checked状态
        const checkedCourse = this.state.list.filter(item => item.appley === 1 || item.appley === 2)
        this.state.list.map(item => {
            item.checked = item.appay === 1 || item.apply === 2 || item.checked || false
            item.conflictList = item.conflictList || []
            checkedCourse.map(i => {
                if(determineTime(i, item)){
                    item.conflictList.push(i)
                }
            })
        })

        return <>
            {
                (this.state.list ?? []).length > 0 ?
                    this.state.list.map(i => {
                        // 报名状态文字
                        let applyStatus = ''
                        // 报名状态背景颜色
                        let applyStatusBgColor = ''
                        // 报名状态字体颜色
                        let applyStatusColor = ''
                        if (Date.now() < i.enrolledBTime) { // 报名开始前
                            applyStatusBgColor = "#F0E6DC"
                            applyStatusColor = "#FA9628";
                            applyStatus = "报名未开始";
                        } else if (Date.now() > i.enrolledBTime && Date.now() < i.enrolledETime) { // 报名中
                            if (i.enrolled >= i.maximum) { // 已报满
                                if (i.allowCancelApply) { // 可取消报名
                                    if (i.apply == 0 || i.apply == 3 || i.apply == 4) { // 未报名的状态
                                        applyStatusBgColor = '#E8D8D8'
                                        applyStatusColor = "#990000";
                                        applyStatus = "名额暂满，可排队";
                                    } else if (i.apply == 1) { // 已报名
                                        applyStatusBgColor = '#DCECDC'
                                        applyStatusColor = "#5AC850";
                                        applyStatus = "已报名";
                                    } else if (i.apply == 2) { // 排队中
                                        applyStatusBgColor = '#E8D8D8'
                                        applyStatusColor = "#990000";
                                        applyStatus = "排队中";
                                    } else { // 其他(已失效状态)
                                        applyStatusBgColor = "#E8E8E8"
                                        applyStatusColor = "#9C9C9C";
                                        applyStatus = "报名结束";
                                    }
                                } else { // 未报满
                                    if (i.apply == 1) { // 已报名
                                        applyStatusBgColor = '#DCECDC'
                                        applyStatusColor = "#5AC850";
                                        applyStatus = "已报名";
                                    } else { // 未报名
                                        applyStatusBgColor = "#E8E8E8"
                                        applyStatusColor = "#9C9C9C";
                                        applyStatus = "报名结束";
                                    }
                                }
                            } else { // 未报满
                                if (i.apply == 1) { // 已报名
                                    applyStatusBgColor = '#DCECDC'
                                    applyStatusColor = "#5AC850";
                                    applyStatus = "已报名";
                                } else { // 未报名
                                    applyStatusBgColor = '#E8D8D8'
                                    applyStatusColor = "#990000";
                                    applyStatus = "可报名";
                                }
                            }
                        } else { // 报名结束后
                            if (i.apply == 1) { // 已报名
                                applyStatusBgColor = '#DCECDC'
                                applyStatusColor = "#5AC850";
                                applyStatus = "已报名";
                            } else { // 未报名
                                applyStatusBgColor = "#E8E8E8"
                                applyStatusColor = "#9C9C9C";
                                applyStatus = "报名结束";
                            }
                        }
                        return <div key={i.id} className='item-container'>
                            <Row>
                                <Col span={24}>{moment(i.bTime).format('YYYY-MM-DD HH:mm')} ~ {moment(i.eTime).format('YYYY-MM-DD HH:mm')}</Col>
                            </Row>
                            <Divider className='divider' />
                            <Row gutter={24}>
                                <Col span={8}>
                                    <Image src={i.smallPoster}/>
                                </Col>
                                <Col span={16}>
                                    <Row>
                                        <Col span={24} className='title'>{i.title}</Col>
                                        <Col span={24} style={{ margin: '8px 0' }}>
                                            <span><UserOutlined style={{ marginRight: '5px' }} /></span><span>{i.lecturer || '--'}</span>
                                        </Col>
                                        <Col span={24}>
                                            <span className='apply-status' style={{backgroundColor: applyStatusBgColor, color: applyStatusColor}}>{applyStatus}</span>
                                        </Col>
                                        <Col span={24} style={{ marginTop: '8px' }}>
                                            <span type="link" className='detail-button' onClick={async () => {
                                                this.setState({ detailVisible: i, loading: true })
                                                const { data } = await Ajax.get(`/academy/course/detail?courseId=${i.id}&channel=1`)
                                                this.setState({ detailVisible: data, loading: false })
                                            }}>详情</span>
                                            <Checkbox
                                                checked={i.checked}
                                                disabled={i.conflictList && i.conflictList.length > 0}
                                                onChange={async e => {
                                                    // 选中状态为可控的，改变选中状态
                                                    i.checked = e.target.checked
                                                    // 如果有问卷，请求问卷
                                                    if (i.formUniqueId) {
                                                        const { data } = await Ajax.get(`/academy/questionnaire/detail?uniqueId=${i.formUniqueId}`)
                                                        // 处理schema
                                                        const questionList = _.get(data, 'unitList');
                                                        let newObjectFields = []
                                                        if (e.target.checked) {
                                                            newObjectFields = [
                                                                ...this.props.parent.objectFields, 
                                                                ...questionList.map(({ component, id }) => {
                                                                    component.courseId = i.id
                                                                    component.tolerate = true;
                                                                    if (component.type === 'attachment') {
                                                                        component.props.getTokenUrl = `/academy/oss/getSTSToken`
                                                                        component.props.keyPath = `questionnaire/${data.id}/${id}`
                                                                    }
                                                                    // console.log('component', component);
                                                                    return component;
                                                                })
                                                            ]
                                                        } else {
                                                            newObjectFields = this.props.parent.objectFields.filter(item => !item.courseId || item.courseId !== i.id)
                                                        }
                                                        // console.log('this.props.changeSchema', this.props.changeSchema, newObjectFields);
                                                        this.props.changeSchema(newObjectFields)
                                                    }
                                                    // 判断互斥课程，将对应的互斥课程设置为disabled
                                                    let tempChecktList = []
                                                    if(e.target.checked){
                                                        tempChecktList = [...this.state.checkedList, i]
                                                        this.state.list.filter(item => !item.checked).map(course => {
                                                            tempChecktList.map(checkedCourse => {
                                                                const needAdd = course.conflictList.filter(c => c.id === checkedCourse.id).length === 0
                                                                if(determineTime(course, checkedCourse) && needAdd){
                                                                    course.conflictList.push(checkedCourse)
                                                                }
                                                            })
                                                        })
                                                    }else{
                                                        tempChecktList = this.state.checkedList.filter(item => item.id !== i.id)
                                                        this.state.list.filter(item => item.conflictList && item.conflictList.length > 0).map(course => {
                                                            course.conflictList = course.conflictList.filter(item => item.id !== i.id)
                                                        })
                                                    }
                                                    this.setState({checkedList: tempChecktList})
                                                }}
                                            >
                                                <span className='apply-checkbox'>报名</span>
                                            </Checkbox>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </div>
                    }) :
                    <div style={{ textAlign: 'center' }}>
                        <img className="img" style={{ height: '76px' }} src="https://hupan-web.oss-cn-hangzhou.aliyuncs.com/static/image/no-data.png" alt="" />
                    </div>
            }

            <Modal
                title={`【${this.state.detailVisible.title}】详情`}
                visible={this.state.detailVisible}
                centered
                bodyStyle={{
                    maxHeight: '600px',
                    overflow: 'scroll'
                }}
                onCancel={() => this.setState({ detailVisible: false })}
                footer={<Row>
                    <Col span={24} style={{ textAlign: 'center' }}>
                        <Button onClick={() => this.setState({ detailVisible: false })}>关闭</Button>
                    </Col>
                </Row>}
            >
                {
                    this.state.loading ? <Spin /> :
                    <div>
                        <div>
                            <span>老师简介：</span><span dangerouslySetInnerHTML={{__html: this.state.detailVisible.brief || '--'}} />
                        </div>
                        <div>
                            <span>课程简介：</span><span dangerouslySetInnerHTML={{__html: this.state.detailVisible.lecturerBrief || '--'}}/>
                        </div>
                        {
                            this.state.detailVisible.selections && this.state.detailVisible.selections.length > 0 ?
                            <div>
                                <span>已报名学员：</span><span>{this.state.detailVisible.selections.map(item => item.user.userName).join('、')}</span>
                            </div> : ''
                        }
                        {
                            this.state.detailVisible.queues && this.state.detailVisible.queues.length > 0 ?
                            <div>
                                <span>排队中学员：</span><span>{this.state.detailVisible.queues.map(item => item.user.userName).join('、')}</span>
                            </div> : ''
                        }
                    </div>
                }
            </Modal>
        </>
    }
}

export default CourseLinkEditor