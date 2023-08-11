import React from 'react';
import { Row, Col, Divider, Image, Button, Checkbox, Modal } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import moment from 'moment';
import _ from 'lodash';
import { BaseViewer, Ajax } from "../../../../../src";
import './courseLink.css';

class CourseLinkEditor extends BaseViewer {
    constructor(){
        super();
        this.state = {
            detailVisible: false,
            key: 0
        }
    }

    element() {
        const list = this.props.schema.courseDetailList
        console.log('props', this.props);
        return <>
            {
                (list ?? []).length > 0 ? 
                list.map(i => {
                    let disabled = false
                    let checked = i.appay === 1 || i.apply === 2 || i.checked
                    return <div key={i.id + this.state.key} className='item-container'>
                        <Row>
                            <Col span={24}>{moment(i.bTime).format('YYYY-MM-DD HH:mm')} ~ {moment(i.eTime).format('YYYY-MM-DD HH:mm')}</Col>
                        </Row>
                        <Divider className='divider'/>
                        <Row gutter={24}>
                            <Col span={8}>
                                <Image src={i.smallPoster}/>
                            </Col>
                            <Col span={16}>
                                <Row>
                                    <Col span={24} className='title'>{i.title}</Col>
                                    <Col span={24} style={{margin: '8px 0'}}>
                                        <span><UserOutlined style={{marginRight: '5px'}}/></span><span>{i.lecturer || '--'}</span>
                                    </Col>
                                    <Col span={24}>
                                        <span className='apply-status'>可报名</span>
                                    </Col>
                                    <Col span={24} style={{ marginTop: '8px' }}>
                                        <span type="link" className='detail-button' onClick={() => {
                                            this.setState({detailVisible: i})
                                        }}>详情</span>
                                        <Checkbox 
                                            onChange={async e =>  {
                                                checked = e.target.checked
                                                i.checked = e.target.checked
                                                this.setState({
                                                    key: this.state.key + 1
                                                })
                                                if(i.applyFormUrl){
                                                    const uniqueId = i.applyFormUrl.split(/[?&]/)[1].split(/=/)[1]
                                                    const { data } = await Ajax.get(`/academy/questionnaire/detail?uniqueId=${uniqueId}`);
                                                    // 处理schema
                                                    const list = _.get(data, 'unitList');
                                                    let newObjectFields = []
                                                    if(e.target.checked){
                                                        newObjectFields = [...this.props.parent.objectFields, ...list.map(({component, id}) => {
                                                            component.courseId = i.id
                                                            component.tolerate = true;
                                                            if (component.type === 'attachment') {
                                                                component.props.getTokenUrl = `/academy/oss/getSTSToken`
                                                                component.props.keyPath = `questionnaire/${data.id}/${id}`
                                                            }
                                                            return component;
                                                        })]
                                                        
                                                    }else{
                                                        newObjectFields = this.props.parent.objectFields.filter(item => !item.courseId || item.courseId !== i.id)
                                                    }
                                                    // this.props.changeSchema(newObjectFields)
                                                } 
                                            }}
                                            checked={checked}
                                            disabled={disabled}
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
                    <img className="img" style={{height: '76px'}} src="https://hupan-web.oss-cn-hangzhou.aliyuncs.com/static/image/no-data.png" alt="" />
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
                onCancel={() => this.setState({detailVisible: false})}
                footer={<Row>
                    <Col span={24} style={{textAlign: 'center'}}>
                        <Button onClick={() => this.setState({detailVisible: false})}>关闭</Button>
                    </Col>
                </Row>}
            >
                <span>查看详情</span>
            </Modal>
        </>
    }
}

export default CourseLinkEditor