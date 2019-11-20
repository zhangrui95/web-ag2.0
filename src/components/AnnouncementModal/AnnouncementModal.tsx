import React, { PureComponent } from 'react';
import { Modal, Form, Input, Select, message, button, Timeline, Row, Col, Tooltip, Tag } from 'antd';
import styles from './AnnouncementModal.less';

const { TextArea } = Input;
const Option = Select.Option;
import { connect } from 'dva';
import { getUserInfos } from '../../utils/utils';
// import Ellipsis from '../../../src/components/Ellipsis';

const FormItem = Form.Item;

@connect(({ share }) => ({
    share,
}))
class AnnouncementModal extends PureComponent {
    constructor(props, context) {
        super(props);
        this.state = {
            shareSuccess: false,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.shareVisible !== nextProps.shareVisible) {
            this.props.form.resetFields();
        }
    }

    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 4 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 18 },
                sm: { span: 18 },
            },
        };
        const children = [];
        if (this.props.personList && this.props.personList.length > 0) {
            this.props.personList.map((event, idx) => {
                if (event.idcard !== getUserInfos().idCard) {
                    children.push(<Option key={event.idcard}>{event.name}</Option>);
                }
            });
        }
        const { getFieldDecorator } = this.props.form;
        let list = [];
        if (this.props.RzList) {
            this.props.RzList.map((item, idx) => {
                let yjName = '';
                if (item.yjjbdm === '5008473') {
                    yjName = '一级';
                } else if (item.yjjbdm === '5008472') {
                    yjName = '二级';
                } else if (item.yjjbdm === '5008471') {
                    yjName = '三级';
                } else if (item.yjjbdm === '5008474') {
                    yjName = '失效';
                }
                console.log('yjName', yjName);
                if (item.name_dm === '0') {
                    list.push(
                        <Timeline.Item
                            dot={
                                <div>
                                    <div style={{
                                        width: 30,
                                        height: 30,
                                        borderRadius: 30,
                                        backgroundColor: '#5858DF',
                                        textAlign: 'center',
                                        marginBottom: 7,
                                    }}>
                                        <p style={{ paddingTop: 7, color: '#fff' }}>{this.props.RzList.length - idx}</p>
                                    </div>
                                </div>
                            }
                            color='#00CC33'
                        >
                            <Row style={{ paddingLeft: 30, paddingBottom: 8 }}>
                                <Col md={3} span={24}>
                                    {item.name}
                                </Col>
                                <Col md={7} span={24}>
                                    <span>预警类型：{item.yjlxmc}</span>
                                </Col>
                            </Row>
                            <Row style={{ paddingLeft: 30, paddingBottom: 8 }}>
                                <Col md={3} span={24}>
                                    <Tag style={{
                                        background: item.yjjbmc,
                                        width: 74,
                                        textAlign: 'center',
                                        cursor: 'default',
                                        color: '#fff',
                                    }}>{yjName}</Tag>
                                </Col>
                                <Col md={7} span={24}>预警时间：{item.insertime}</Col>
                            </Row>
                        </Timeline.Item>,
                    );
                } else if (item.name_dm === '1') {
                    list.push(
                        <Timeline.Item
                            dot={
                                <div>
                                    <div style={{
                                        width: 30,
                                        height: 30,
                                        borderRadius: 30,
                                        backgroundColor: '#5858DF',
                                        textAlign: 'center',
                                        marginBottom: 7,
                                    }}>
                                        <p style={{ paddingTop: 7, color: '#fff' }}>{this.props.RzList.length - idx}</p>
                                    </div>
                                </div>
                            }
                            color='#00CC33'
                        >
                            <Row style={{ paddingLeft: 30, paddingBottom: 8 }}>
                                <Col md={3} span={24}>
                                    {item.name}
                                </Col>
                                {item.jsr.split(',').map((e, idx) => {
                                    return <Col md={7} span={24} key={idx}>
                                        <Row>
                                            <Col span={24} style={{ paddingBottom: 8 }}>接收单位：<Tooltip
                                                title={item.jsdw.split(',')[idx].length > 15 ? item.jsdw.split(',')[idx] : null}>{item.jsdw.split(',')[idx].length > 15 ? item.jsdw.split(',')[idx].substring(0, 15) + '...' : item.jsdw.split(',')[idx]}</Tooltip></Col>
                                            <Col span={24}>接收人：{e}</Col>
                                        </Row>
                                    </Col>;
                                })}
                            </Row>
                            <Row style={{ paddingLeft: 30, paddingBottom: 8 }}>
                                <Col md={3} span={24}>
                                    <Tag style={{
                                        background: item.yjjbmc,
                                        width: 74,
                                        textAlign: 'center',
                                        cursor: 'default',
                                        color: '#fff',
                                        position: 'absolute',
                                        top: '-28px',
                                    }}>{yjName}</Tag>
                                </Col>
                                <Col md={21} span={24}>发送时间：{item.insertime}</Col>
                            </Row>
                            <Row style={{ paddingLeft: 30, paddingBottom: 8 }}>
                                <Col md={3} span={24}/>
                                <Col md={21} span={24}>提醒建议：{item.txjy}</Col>
                            </Row>
                        </Timeline.Item>,
                    );
                } else if (item.name_dm === '2') {
                    list.push(<div>
                        <Timeline.Item
                            dot={
                                <div>
                                    <div style={{
                                        width: 30,
                                        height: 30,
                                        borderRadius: 30,
                                        backgroundColor: '#5858DF',
                                        textAlign: 'center',
                                        marginBottom: 7,
                                    }}>
                                        <p style={{ paddingTop: 7, color: '#fff' }}>{this.props.RzList.length - idx}</p>
                                    </div>
                                </div>
                            }
                            color='#00CC33'
                        >
                            <Row style={{ paddingLeft: 30, paddingBottom: 8 }}>
                                <Col span={3}>
                                    {item.name}
                                </Col>
                                <Col span={21}>
                                    <span>失效原因：{item.sxyy}</span>
                                </Col>
                            </Row>
                            <Row style={{ paddingLeft: 30, paddingBottom: 8 }}>
                                <Col span={3}>
                                    <Tag style={{
                                        background: '#aaa',
                                        width: 74,
                                        textAlign: 'center',
                                        cursor: 'default',
                                        color: '#fff',
                                    }}>{yjName}</Tag>
                                </Col>
                                <Col span={21}>失效时间：{item.insertime}</Col>
                            </Row>
                        </Timeline.Item>
                    </div>);
                }
            });
        }
        return (
            <div className={styles.standardTable}>
                <Modal
                    title="日志"
                    visible={this.props.visible}
                    onCancel={this.props.handleCancel}
                    className={styles.shareHeader}
                    footer={null}
                    width={1150}
                    maskClosable={false}
                    style={{ top: '200px' }}
                >
                    <Timeline style={{ marginTop: 20, marginLeft: 20 }}>
                        {list}
                    </Timeline>
                </Modal>
            </div>
        );
    }
}

export default Form.create()(AnnouncementModal);
