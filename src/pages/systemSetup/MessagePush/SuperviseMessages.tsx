/*
* 消息推送配置——督办
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

@Form.create()

class SuperviseMessages extends Component {
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
                !(this.state.values&&this.state.values.db_zg_jq&&!this.state.values.db_zg_jq.mData&&this.state.values.db_zg_jq.sfqy==1)&&
                !(this.state.values&&this.state.values.db_zg_aj&&!this.state.values.db_zg_aj.mData&&this.state.values.db_zg_aj.sfqy==1)&&
                !(this.state.values&&this.state.values.db_gq_jq&&!this.state.values.db_gq_jq.mData&&this.state.values.db_gq_jq.sfqy==1)&&
                !(this.state.values&&this.state.values.db_gq_aj&&!this.state.values.db_gq_aj.mData&&this.state.values.db_gq_aj.sfqy==1)
            ) {
                confirm({
                    title: '确定要保存督办消息推送吗？',
                    okText: '确定',
                    cancelText: '取消',
                    centered: true,
                    getContainer: document.getElementById('boxSend3'),
                    onOk() {
                        that.saveSuperviseMessages();
                    },
                });
            }
         });
    };
    // 保存督办推送消息
    saveSuperviseMessages = () => {
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
            <div id={'boxSend3'}>
                <Card className={style.cardBox}>
                    <Form>
                        <div className={style.moduleBottom}>
                            <h6 className={style.title}>需要整改</h6>
                            <Form.Item label="警情" {...formItemLayout}  validateStatus={this.state.values&&this.state.values.db_zg_jq&&!this.state.values.db_zg_jq.mData&&this.state.values.db_zg_jq.sfqy==1 ? "error" : "success"} help={this.state.values&&this.state.values.db_zg_jq&&!this.state.values.db_zg_jq.mData&&this.state.values.db_zg_jq.sfqy==1 ? "请输入警情需要整改消息推送格式!" : ''}>
                                {getFieldDecorator('db_zg_jq', {
                                    initialValue: splitMessage(messageList, 'db_zg_jq'),
                                    rules: [{
                                        required: true, message: '警情!',
                                    }],
                                })(
                                    <MessageInput onChange={this.onChange} id={'db_zg_jq'}/>,
                                )}
                            </Form.Item>
                            <Form.Item label="案件" {...formItemLayout} validateStatus={this.state.values&&this.state.values.db_zg_aj&&!this.state.values.db_zg_aj.mData&&this.state.values.db_zg_aj.sfqy==1 ? "error" : "success"} help={this.state.values&&this.state.values.db_zg_aj&&!this.state.values.db_zg_aj.mData&&this.state.values.db_zg_aj.sfqy==1 ? "请输入案件需要整改消息推送格式!" : ''}>
                                {getFieldDecorator('db_zg_aj', {
                                    initialValue: splitMessage(messageList, 'db_zg_aj'),
                                    rules: [{
                                        required: true, message: '案件!',
                                    }],
                                })(
                                    <MessageInput onChange={this.onChange} id={'db_zg_aj'}/>,
                                )}
                            </Form.Item>
                        </div>
                        <div>
                            <h6 className={style.title}>挂起</h6>
                            <Form.Item label="警情" {...formItemLayout}   validateStatus={this.state.values&&this.state.values.db_gq_jq&&!this.state.values.db_gq_jq.mData&&this.state.values.db_gq_jq.sfqy==1 ? "error" : "success"} help={this.state.values&&this.state.values.db_gq_jq&&!this.state.values.db_gq_jq.mData&&this.state.values.db_gq_jq.sfqy==1 ? "请输入警情挂起消息推送格式!" : ''}>
                                {getFieldDecorator('db_gq_jq', {
                                    initialValue: splitMessage(messageList, 'db_gq_jq'),
                                    rules: [{
                                        required: true, message: '警情!',
                                    }],
                                })(
                                    <MessageInput onChange={this.onChange} id={'db_gq_jq'}/>,
                                )}
                            </Form.Item>
                            <Form.Item label="案件" {...formItemLayout} validateStatus={this.state.values&&this.state.values.db_gq_aj&&!this.state.values.db_gq_aj.mData&&this.state.values.db_gq_aj.sfqy==1 ? "error" : "success"} help={this.state.values&&this.state.values.db_gq_aj&&!this.state.values.db_gq_aj.mData&&this.state.values.db_gq_aj.sfqy==1 ? "请输入案件挂起息推送格式!" : ''}>
                                {getFieldDecorator('db_gq_aj', {
                                    initialValue: splitMessage(messageList, 'db_gq_aj'),
                                    rules: [{
                                        required: true, message: '案件!',
                                    }],
                                })(
                                    <MessageInput onChange={this.onChange} id={'db_gq_aj'}/>,
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
    connect((systemSetup, common) => ({systemSetup, common}))(SuperviseMessages),
);
