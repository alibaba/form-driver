import React from 'react';
import { Row, Col, Divider, Image, Button, Checkbox } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import moment from 'moment';
import { BaseViewer } from "../../../../../src";
import './courseLink.css';

class CourseLinkReadable extends BaseViewer {
    element() {
        const list = this.props.schema.courseDetailList

        return list.length > 0 ? list.map(i => <div key={i.value} className='item-container'>
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
                        <Col span={24} style={{textAlign: 'center', marginTop: '8px' }}>
                            <Button type="link" style={{marginRight: '12px', fontSize: '16px', fontWeight: '500'}}>详情</Button>
                            <Checkbox><span style={{fontSize: '16px', fontWeight: '500'}}>报名</span></Checkbox>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>) : 
        <div style={{ textAlign: 'center' }}>
            <img className="img" style={{height: '76px'}} src="https://hupan-web.oss-cn-hangzhou.aliyuncs.com/static/image/no-data.png" alt="" />
        </div>
    }
}

export default CourseLinkReadable