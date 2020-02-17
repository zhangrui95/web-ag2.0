/*
* 消息推送配置——预警
* author：lyp
* 20190513
* */

import React, {Component, PureComponent} from 'react';
import {Tabs, Form, Input, Button, Modal, Switch, Card} from 'antd';
import MessageInput from './MessageInput';
import style from './systemSetup.less';
import {connect} from "dva";

const {TabPane} = Tabs;
const confirm = Modal.confirm;

class EarlyWarningMessages extends Component {
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
                !(values.yj_wsajq&&!values.yj_wsajq.mData&&values.yj_wsajq.sfqy==1)&&
                !(values.yj_wczjg&&!values.yj_wczjg.mData&&values.yj_wczjg.sfqy==1)&&
                !(values.yj_qbhscq&&!values.yj_qbhscq.mData&&values.yj_qbhscq.sfqy==1)&&
                !(values.yj_jccq&&!values.yj_jccq.mData&&values.yj_jccq.sfqy==1)&&
                !(values.yj_dbcq&&!values.yj_dbcq.mData&&values.yj_dbcq.sfqy==1)&&
                !(values.yj_xsjlcq&&!values.yj_xsjlcq.mData&&values.yj_xsjlcq.sfqy==1)&&
                !(values.yj_jsjzcq&&!values.yj_jsjzcq.mData&&values.yj_jsjzcq.sfqy==1)&&
                !(values.yj_cswja&&!values.yj_cswja.mData&&values.yj_cswja.sfqy==1)
            ) {
                confirm({
                    title: '确定要保存预警推送消息吗？',
                    okText: '确定',
                    cancelText: '取消',
                    centered: true,
                    getContainer: document.getElementById('boxSend2'),
                    onOk() {
                        that.saveEarlyWarningMessages();
                    },
                });
            }
        });
    };
    // 保存预警推送消息
    saveEarlyWarningMessages = () => {
        this.props.form.validateFields((errors, values) => {
            if (!errors) {
                const valuesArry = Object.entries(values);
                const newArry = [];
                valuesArry.forEach((val, ind) => { // 将结果集拼成数组
                    if (val[0] === 'yj_tx') {
                        newArry.push({
                            key: val[0],
                            value: val[1] ? 1 : 0,
                            sf_qy: 1,
                        });
                    } else {
                        newArry.push({
                            key: val[0],
                            value: val[1].mData,
                            sf_qy: val[1].sfqy,
                        });
                    }

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
            <div id={'boxSend2'}>
                <Card className={style.cardBox}>
                    <Form>
                        <div className={style.moduleBottom}>
                            <h6 className={style.title}>警情</h6>
                            <Form.Item label="未受案警情" {...formItemLayout} validateStatus={this.state.values&&this.state.values.yj_wsajq&&!this.state.values.yj_wsajq.mData&&this.state.values.yj_wsajq.sfqy==1 ? "error" : "success"} help={this.state.values&&this.state.values.yj_wsajq&&!this.state.values.yj_wsajq.mData&&this.state.values.yj_wsajq.sfqy==1 ? "请输入未受案警情消息推送格式!" : ''}>
                                {getFieldDecorator('yj_wsajq', {
                                    initialValue: splitMessage(messageList, 'yj_wsajq'),
                                    rules: [{
                                        required: true, message: '未受案警情!',
                                    }],
                                })(
                                    <MessageInput onChange={this.onChange} id={'yj_wsajq'}/>,
                                )}
                            </Form.Item>
                            <Form.Item label="无处置结果" {...formItemLayout}  validateStatus={this.state.values&&this.state.values.yj_wczjg&&!this.state.values.yj_wczjg.mData&&this.state.values.yj_wczjg.sfqy==1 ? "error" : "success"} help={this.state.values&&this.state.values.yj_wczjg&&!this.state.values.yj_wczjg.mData&&this.state.values.yj_wczjg.sfqy==1 ? "请输入无处置结果消息推送格式!" : ''}>
                                {getFieldDecorator('yj_wczjg', {
                                    initialValue: splitMessage(messageList, 'yj_wczjg'),
                                    rules: [{
                                        required: true, message: '无处置结果!',
                                    }],
                                })(
                                    <MessageInput onChange={this.onChange} id={'yj_wczjg'}/>,
                                )}
                            </Form.Item>
                        </div>
                        <div className={style.moduleBottom}>
                            <h6 className={style.title}>刑事案件</h6>
                            <Form.Item label="取保候审超期" {...formItemLayout} validateStatus={this.state.values&&this.state.values.yj_qbhscq&&!this.state.values.yj_qbhscq.mData&&this.state.values.yj_qbhscq.sfqy==1 ? "error" : "success"} help={this.state.values&&this.state.values.yj_qbhscq&&!this.state.values.yj_qbhscq.mData&&this.state.values.yj_qbhscq.sfqy==1 ? "请输入取保候审超期消息推送格式!" : ''}>
                                {getFieldDecorator('yj_qbhscq', {
                                    initialValue: splitMessage(messageList, 'yj_qbhscq'),
                                    rules: [{
                                        required: true, message: '取保候审超期!',
                                    }],
                                })(
                                    <MessageInput  onChange={this.onChange} id={'yj_qbhscq'}/>,
                                )}
                            </Form.Item>
                            <Form.Item label="拘传超期" {...formItemLayout}  validateStatus={this.state.values&&this.state.values.yj_jccq&&!this.state.values.yj_jccq.mData&&this.state.values.yj_jccq.sfqy==1 ? "error" : "success"} help={this.state.values&&this.state.values.yj_jccq&&!this.state.values.yj_jccq.mData&&this.state.values.yj_jccq.sfqy==1 ? "请输入拘传超期消息推送格式!" : ''}>
                                {getFieldDecorator('yj_jccq', {
                                    initialValue: splitMessage(messageList, 'yj_jccq'),
                                    rules: [{
                                        required: true, message: '拘传超期!',
                                    }],
                                })(
                                    <MessageInput onChange={this.onChange} id={'yj_jccq'}/>,
                                )}
                            </Form.Item>
                            <Form.Item label="逮捕超期" {...formItemLayout}  validateStatus={this.state.values&&this.state.values.yj_dbcq&&!this.state.values.yj_dbcq.mData&&this.state.values.yj_dbcq.sfqy==1 ? "error" : "success"} help={this.state.values&&this.state.values.yj_dbcq&&!this.state.values.yj_dbcq.mData&&this.state.values.yj_dbcq.sfqy==1 ? "请输入逮捕超期消息推送格式!" : ''}>
                                {getFieldDecorator('yj_dbcq', {
                                    initialValue: splitMessage(messageList, 'yj_dbcq'),
                                    rules: [{
                                        required: true, message: '逮捕超期!',
                                    }],
                                })(
                                    <MessageInput onChange={this.onChange} id={'yj_dbcq'}/>,
                                )}
                            </Form.Item>
                            <Form.Item label="刑事拘留超期" {...formItemLayout} validateStatus={this.state.values&&this.state.values.yj_xsjlcq&&!this.state.values.yj_xsjlcq.mData&&this.state.values.yj_xsjlcq.sfqy==1 ? "error" : "success"} help={this.state.values&&this.state.values.yj_xsjlcq&&!this.state.values.yj_xsjlcq.mData&&this.state.values.yj_xsjlcq.sfqy==1 ? "请输入刑事拘留超期消息推送格式!" : ''}>
                                {getFieldDecorator('yj_xsjlcq', {
                                    initialValue: splitMessage(messageList, 'yj_xsjlcq'),
                                    rules: [{
                                        required: true, message: '刑事拘留超期!',
                                    }],
                                })(
                                    <MessageInput  onChange={this.onChange} id={'yj_xsjlcq'}/>,
                                )}
                            </Form.Item>
                            <Form.Item label="监视居住超期" {...formItemLayout} validateStatus={this.state.values&&this.state.values.yj_jsjzcq&&!this.state.values.yj_jsjzcq.mData&&this.state.values.yj_jsjzcq.sfqy==1 ? "error" : "success"} help={this.state.values&&this.state.values.yj_jsjzcq&&!this.state.values.yj_jsjzcq.mData&&this.state.values.yj_jsjzcq.sfqy==1 ? "请输入监视居住超期消息推送格式!" : ''}>
                                {getFieldDecorator('yj_jsjzcq', {
                                    initialValue: splitMessage(messageList, 'yj_jsjzcq'),
                                    rules: [{
                                        required: true, message: '监视居住超期!',
                                    }],
                                })(
                                    <MessageInput onChange={this.onChange} id={'yj_jsjzcq'}/>,
                                )}
                            </Form.Item>
                        </div>
                        <div className={style.moduleBottom}>
                            <h6 className={style.title}>行政案件</h6>
                            <Form.Item label="超时未结案" {...formItemLayout} validateStatus={this.state.values&&this.state.values.yj_cswja&&!this.state.values.yj_cswja.mData&&this.state.values.yj_cswja.sfqy==1 ? "error" : "success"} help={this.state.values&&this.state.values.yj_cswja&&!this.state.values.yj_cswja.mData&&this.state.values.yj_cswja.sfqy==1 ? "请输入超时未结案消息推送格式!" : ''}>
                                {getFieldDecorator('yj_cswja', {
                                    initialValue: splitMessage(messageList, 'yj_cswja'),
                                    rules: [{
                                        required: true, message: '超时未结案!',
                                    }],
                                })(
                                    <MessageInput onChange={this.onChange} id={'yj_cswja'}/>,
                                )}
                            </Form.Item>
                        </div>
                        <div>
                            <h6 className={style.title}>其他</h6>
                            <Form.Item label="提醒是否推送" {...formItemLayout}>
                                {getFieldDecorator('yj_tx', {
                                    valuePropName: 'checked',
                                    initialValue: parseInt(splitMessage(messageList, 'yj_tx').mData) || 0,
                                })(
                                    <Switch/>,
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
    connect((systemSetup, common) => ({systemSetup, common}))(EarlyWarningMessages),
);
