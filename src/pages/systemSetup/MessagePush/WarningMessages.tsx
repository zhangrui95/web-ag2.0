/*
* 消息推送配置——告警
* author：lyp
* 20190513
* */

import React, {Component, PureComponent} from 'react';
import {Tabs, Form, Input, Button, Modal, Card} from 'antd';
import MessageInput from './MessageInput';
import style from './systemSetup.less';
import {connect} from "dva";

const {TabPane} = Tabs;
const confirm = Modal.confirm;

class WarningMessages extends Component {
    constructor(props){
        super(props);
        this.state={
            values:{},
        }
    }
    // 保存确认框
    showConfirm = (e) => {
        e.preventDefault();
        const that = this;
        this.props.form.validateFields((errors, values) => {
            this.setState({
                values:values,
            });
            if (!errors &&
                !(values.gj_wsajq&&!values.gj_wsajq.mData&&values.gj_wsajq.sfqy==1)&&
                !(values.gj_wczjg&&!values.gj_wczjg.mData&&values.gj_wczjg.sfqy==1)&&
                !(values.gj_qbhscq&&!values.gj_qbhscq.mData&&values.gj_qbhscq.sfqy==1)&&
                !(values.gj_jccq&&!values.gj_jccq.mData&&values.gj_jccq.sfqy==1)&&
                !(values.gj_dbcq&&!values.gj_dbcq.mData&&values.gj_dbcq.sfqy==1)&&
                !(values.gj_xsjlcq&&!values.gj_xsjlcq.mData&&values.gj_xsjlcq.sfqy==1)&&
                !(values.gj_jsjzcq&&!values.gj_jsjzcq.mData&&values.gj_jsjzcq.sfqy==1)&&
                !(values.gj_wcfjg&&!values.gj_wcfjg.mData&&values.gj_wcfjg.sfqy==1)&&
                !(values.gj_cswja&&!values.gj_cswja.mData&&values.gj_cswja.sfqy==1)
            ) {
                confirm({
                    title: '确定要保存告警推送消息吗？',
                    okText: '确定',
                    cancelText: '取消',
                    centered: true,
                    getContainer: document.getElementById('boxSend1'),
                    onOk() {
                        that.saveWarningMessage();
                    },
                });
            }
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
    onChange = (value,id) =>{
        let values = this.state.values;
        values[id] = value;
        this.setState({
            values,
        });
    }
    render() {
        const {formItemLayout, form: {getFieldDecorator}, systemSetup: {systemSetup: {messageList}}, splitMessage} = this.props;
        return (
            <div id={'boxSend1'}>
                <Card className={style.cardBox}>
                    <Form>
                        <div className={style.moduleBottom}>
                            <h6 className={style.title}>警情</h6>
                            <Form.Item label="未受案警情" {...formItemLayout} validateStatus={this.state.values&&this.state.values.gj_wsajq&&!this.state.values.gj_wsajq.mData&&this.state.values.gj_wsajq.sfqy==1 ? "error" : "success"} help={this.state.values&&this.state.values.gj_wsajq&&!this.state.values.gj_wsajq.mData&&this.state.values.gj_wsajq.sfqy==1 ? "请输入未受案警情消息推送格式!" : ''}>
                                {getFieldDecorator('gj_wsajq', {
                                    initialValue: splitMessage(messageList, 'gj_wsajq'),
                                    rules: [{
                                        required: true, message: '请输入未受案警情!',
                                    }],
                                })(
                                    <MessageInput onChange={this.onChange} id={'gj_wsajq'}/>,
                                )}
                            </Form.Item>
                            <Form.Item label="无处置结果" {...formItemLayout} validateStatus={this.state.values&&this.state.values.gj_wczjg&&!this.state.values.gj_wczjg.mData&&this.state.values.gj_wczjg.sfqy==1 ? "error" : "success"} help={this.state.values&&this.state.values.gj_wczjg&&!this.state.values.gj_wczjg.mData&&this.state.values.gj_wczjg.sfqy==1 ? "请输入无处置结果消息推送格式!" : ''}>
                                {getFieldDecorator('gj_wczjg', {
                                    initialValue: splitMessage(messageList, 'gj_wczjg'),
                                    rules: [{
                                        required: true, message: '请输入无处置结果!',
                                    }],
                                })(
                                    <MessageInput onChange={this.onChange} id={'gj_wczjg'}/>,
                                )}
                            </Form.Item>
                        </div>
                        <div className={style.moduleBottom}>
                            <h6 className={style.title}>刑事案件</h6>
                            <Form.Item label="取保候审超期" {...formItemLayout} validateStatus={this.state.values&&this.state.values.gj_qbhscq&&!this.state.values.gj_qbhscq.mData&&this.state.values.gj_qbhscq.sfqy==1 ? "error" : "success"} help={this.state.values&&this.state.values.gj_qbhscq&&!this.state.values.gj_qbhscq.mData&&this.state.values.gj_qbhscq.sfqy==1 ? "请输入取保候审超期消息推送格式!" : ''}>
                                {getFieldDecorator('gj_qbhscq', {
                                    initialValue: splitMessage(messageList, 'gj_qbhscq'),
                                    rules: [{
                                        required: true, message: '请输入取保候审超期!',
                                    }],
                                })(
                                    <MessageInput onChange={this.onChange} id={'gj_qbhscq'}/>,
                                )}
                            </Form.Item>
                            <Form.Item label="拘传超期" {...formItemLayout} validateStatus={this.state.values&&this.state.values.gj_jccq&&!this.state.values.gj_jccq.mData&&this.state.values.gj_jccq.sfqy==1 ? "error" : "success"} help={this.state.values&&this.state.values.gj_jccq&&!this.state.values.gj_jccq.mData&&this.state.values.gj_jccq.sfqy==1 ? "请输入拘传超期消息推送格式!" : ''}>
                                {getFieldDecorator('gj_jccq', {
                                    initialValue: splitMessage(messageList, 'gj_jccq'),
                                    rules: [{
                                        required: true, message: '请输入拘传超期!',
                                    }],
                                })(
                                    <MessageInput onChange={this.onChange} id={'gj_jccq'}/>,
                                )}
                            </Form.Item>
                            <Form.Item label="逮捕超期" {...formItemLayout} validateStatus={this.state.values&&this.state.values.gj_dbcq&&!this.state.values.gj_dbcq.mData&&this.state.values.gj_dbcq.sfqy==1 ? "error" : "success"} help={this.state.values&&this.state.values.gj_dbcq&&!this.state.values.gj_dbcq.mData&&this.state.values.gj_dbcq.sfqy==1 ? "请输入逮捕超期消息推送格式!" : ''}>
                                {getFieldDecorator('gj_dbcq', {
                                    initialValue: splitMessage(messageList, 'gj_dbcq'),
                                    rules: [{
                                        required: true, message: '请输入逮捕超期!',
                                    }],
                                })(
                                    <MessageInput onChange={this.onChange} id={'gj_dbcq'}/>,
                                )}
                            </Form.Item>
                            <Form.Item label="刑事拘留超期" {...formItemLayout} validateStatus={this.state.values&&this.state.values.gj_xsjlcq&&!this.state.values.gj_xsjlcq.mData&&this.state.values.gj_xsjlcq.sfqy==1 ? "error" : "success"} help={this.state.values&&this.state.values.gj_xsjlcq&&!this.state.values.gj_xsjlcq.mData&&this.state.values.gj_xsjlcq.sfqy==1 ? "请输入刑事拘留超期消息推送格式!" : ''}>
                                {getFieldDecorator('gj_xsjlcq', {
                                    initialValue: splitMessage(messageList, 'gj_xsjlcq'),
                                    rules: [{
                                        required: true, message: '请输入刑事拘留超期!',
                                    }],
                                })(
                                    <MessageInput onChange={this.onChange} id={'gj_xsjlcq'}/>,
                                )}
                            </Form.Item>
                            <Form.Item label="监视居住超期" {...formItemLayout} validateStatus={this.state.values&&this.state.values.gj_jsjzcq&&!this.state.values.gj_jsjzcq.mData&&this.state.values.gj_jsjzcq.sfqy==1 ? "error" : "success"} help={this.state.values&&this.state.values.gj_jsjzcq&&!this.state.values.gj_jsjzcq.mData&&this.state.values.gj_jsjzcq.sfqy==1 ? "请输入监视居住超期消息推送格式!" : ''}>
                                {getFieldDecorator('gj_jsjzcq', {
                                    initialValue: splitMessage(messageList, 'gj_jsjzcq'),
                                    rules: [{
                                        required: true, message: '请输入监视居住超期!',
                                    }],
                                })(
                                    <MessageInput onChange={this.onChange} id={'gj_jsjzcq'}/>,
                                )}
                            </Form.Item>
                        </div>
                        <div>
                            <h6 className={style.title}>行政案件</h6>
                            <Form.Item label="无处罚结果" {...formItemLayout} validateStatus={this.state.values&&this.state.values.gj_wcfjg&&!this.state.values.gj_wcfjg.mData&&this.state.values.gj_wcfjg.sfqy==1 ? "error" : "success"} help={this.state.values&&this.state.values.gj_wcfjg&&!this.state.values.gj_wcfjg.mData&&this.state.values.gj_wcfjg.sfqy==1 ? "请输入无处罚结果消息推送格式!" : ''}>
                                {getFieldDecorator('gj_wcfjg', {
                                    initialValue: splitMessage(messageList, 'gj_wcfjg'),
                                    rules: [{
                                        required: true, message: '请输入无处罚结果!',
                                    }],
                                })(
                                    <MessageInput onChange={this.onChange} id={'gj_wcfjg'}/>,
                                )}
                            </Form.Item>
                            <Form.Item label="超时未结案" {...formItemLayout} validateStatus={this.state.values&&this.state.values.gj_cswja&&!this.state.values.gj_cswja.mData&&this.state.values.gj_cswja.sfqy==1 ? "error" : "success"} help={this.state.values&&this.state.values.gj_cswja&&!this.state.values.gj_cswja.mData&&this.state.values.gj_cswja.sfqy==1 ? "请输入超时未结案消息推送格式!" : ''}>
                                {getFieldDecorator('gj_cswja', {
                                    initialValue: splitMessage(messageList, 'gj_cswja'),
                                    rules: [{
                                        required: true, message: '请输入超时未结案!',
                                    },
                                    ],
                                })(
                                    <MessageInput onChange={this.onChange} id={'gj_cswja'}/>,
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
    connect((systemSetup, common) => ({systemSetup, common}))(WarningMessages),
);
