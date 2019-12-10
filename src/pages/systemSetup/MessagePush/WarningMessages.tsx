/*
* 消息推送配置——告警
* author：lyp
* 20190513
* */

import React, {Component, PureComponent} from 'react';
import { Tabs, Form, Input, Button, Modal,Card } from 'antd';
import MessageInput from './MessageInput';
import style from './systemSetup.less';
import {connect} from "dva";

const { TabPane } = Tabs;
const confirm = Modal.confirm;
class WarningMessages extends Component {
    // 保存确认框
    showConfirm = (e) => {
        e.preventDefault();
        const that = this;
        confirm({
            title: '确定要保存告警推送消息吗？',
            okText: '确定',
            cancelText: '取消',
            centered:true,
            getContainer:document.getElementById('boxSend1'),
            onOk() {
                that.saveWarningMessage();
            },
        });
    };
    // 保存告警推送消息
    saveWarningMessage = () => {
        this.props.form.validateFields((errors, values) => {
            if (!errors) {
                const valuesArry = Object.entries(values);
                const newArry = [];
                valuesArry.forEach((val, ind) => { // 将结果集拼成数组
                    newArry.push({
                        key: val[0],
                        value: val[1].mData,
                        sf_qy: val[1].sfqy,
                    });
                });
                this.props.setMessageData(newArry);
            }
        });
    };

    render() {
        const { formItemLayout, form: { getFieldDecorator }, systemSetup: {systemSetup: { messageList }} , splitMessage } = this.props;
        return (
            <div id={'boxSend1'}>
                <Card className={style.cardBox}>
                    <Form>
                        <div className={style.moduleBottom}>
                            <h6 className={style.title}>警情</h6>
                            <Form.Item label="未受案警情" {...formItemLayout}>
                                {getFieldDecorator('gj_wsajq', {
                                    initialValue: splitMessage(messageList, 'gj_wsajq'),
                                    rules: [{
                                        required: true, message: '未受案警情!',
                                    }],
                                })(
                                    <MessageInput/>,
                                )}
                            </Form.Item>
                            <Form.Item label="无处置结果" {...formItemLayout}>
                                {getFieldDecorator('gj_wczjg', {
                                    initialValue: splitMessage(messageList, 'gj_wczjg'),
                                    rules: [{
                                        required: true, message: '无处置结果!',
                                    }],
                                })(
                                    <MessageInput/>,
                                )}
                            </Form.Item>
                        </div>
                        <div className={style.moduleBottom}>
                            <h6 className={style.title}>刑事案件</h6>
                            <Form.Item label="取保候审超期" {...formItemLayout}>
                                {getFieldDecorator('gj_qbhscq', {
                                    initialValue: splitMessage(messageList, 'gj_qbhscq'),
                                    rules: [{
                                        required: true, message: '取保候审超期!',
                                    }],
                                })(
                                    <MessageInput/>,
                                )}
                            </Form.Item>
                            <Form.Item label="拘传超期" {...formItemLayout}>
                                {getFieldDecorator('gj_jccq', {
                                    initialValue: splitMessage(messageList, 'gj_jccq'),
                                    rules: [{
                                        required: true, message: '拘传超期!',
                                    }],
                                })(
                                    <MessageInput/>,
                                )}
                            </Form.Item>
                            <Form.Item label="逮捕超期" {...formItemLayout}>
                                {getFieldDecorator('gj_dbcq', {
                                    initialValue: splitMessage(messageList, 'gj_dbcq'),
                                    rules: [{
                                        required: true, message: '逮捕超期!',
                                    }],
                                })(
                                    <MessageInput/>,
                                )}
                            </Form.Item>
                            <Form.Item label="刑事拘留超期" {...formItemLayout}>
                                {getFieldDecorator('gj_xsjlcq', {
                                    initialValue: splitMessage(messageList, 'gj_xsjlcq'),
                                    rules: [{
                                        required: true, message: '刑事拘留超期!',
                                    }],
                                })(
                                    <MessageInput/>,
                                )}
                            </Form.Item>
                            <Form.Item label="监视居住超期" {...formItemLayout}>
                                {getFieldDecorator('gj_jsjzcq', {
                                    initialValue: splitMessage(messageList, 'gj_jsjzcq'),
                                    rules: [{
                                        required: true, message: '监视居住超期!',
                                    }],
                                })(
                                    <MessageInput/>,
                                )}
                            </Form.Item>
                        </div>
                        <div>
                            <h6 className={style.title}>行政案件</h6>
                            <Form.Item label="无处罚结果" {...formItemLayout}>
                                {getFieldDecorator('gj_wcfjg', {
                                    initialValue: splitMessage(messageList, 'gj_wcfjg'),
                                    rules: [{
                                        required: true, message: '无处罚结果!',
                                    }],
                                })(
                                    <MessageInput/>,
                                )}
                            </Form.Item>
                            <Form.Item label="超时未结案" {...formItemLayout}>
                                {getFieldDecorator('gj_cswja', {
                                    initialValue: splitMessage(messageList, 'gj_cswja'),
                                    rules: [{
                                        required: true, message: '超时未结案!',
                                    }],
                                })(
                                    <MessageInput/>,
                                )}
                            </Form.Item>
                        </div>
                    </Form>
                </Card>
                <Card>
                    <Button type="primary" className={style.submitButton} onClick={this.showConfirm}>提交</Button>
                </Card>
            </div>
        );
    }
}
export default Form.create()(
    connect((systemSetup, common) => ({ systemSetup, common }))(WarningMessages),
);
