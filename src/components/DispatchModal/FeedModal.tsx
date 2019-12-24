/*
* FeedModal.js 警情三清问题警情反馈模态框
* author：jhm
* 20190905
* */

import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Modal, Timeline, Row, Col, Form, Input, Button, message} from 'antd';
import styles from './DispatchModal.less';

const FormItem = Form.Item;
const {TextArea} = Input;

@connect(({Dispatch}) => ({
    Dispatch,
}))
@Form.create()
export default class FeedModal extends PureComponent {

    feedHandleSure = () => {
        const {NowRecord} = this.props;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.dispatch({
                    type: 'Dispatch/feedBackModel',
                    payload: {
                        fkjg: values.fkjg,
                        fkyj: values.fkyj,
                        glid: NowRecord.id,
                    },
                    callback: (data) => {
                        if (data) {
                            message.success('反馈成功')
                            this.props.feedhandleCancel();
                            this.props.handleSearch('', '1');
                        }
                    },
                })
            }
        })
    }
    foot = () => {
        return (
            <div>
                <Button onClick={this.props.feedhandleCancel}>取消</Button>
                <Button type='primary' onClick={this.feedHandleSure}>确定</Button>
            </div>
        )
    }

    render() {
        const {form: {getFieldDecorator}} = this.props;
        const formItemLayout = {
            labelCol: {xs: {span: 24}, md: {span: 8}, xl: {span: 6}, xxl: {span: 3}},
            wrapperCol: {xs: {span: 24}, md: {span: 16}, xl: {span: 18}, xxl: {span: 21}},
        };
        const rowLayout = {md: 24, xl: 24, xxl: 24};
        const colLayout = {sm: 24, md: 24, xl: 24};
        return (
            <div className={styles.standardTable}>
                <Modal
                    title="反馈"
                    visible={this.props.visible}
                    onCancel={this.props.feedhandleCancel}
                    className={styles.shareHeader}
                    footer={this.foot()}
                    width={900}
                    maskClosable={false}
                    style={{top: '200px'}}
                >
                    <Form>
                        <Row gutter={rowLayout}>
                            <Col {...colLayout}>
                                <FormItem label="反馈结果" {...formItemLayout}>
                                    {getFieldDecorator('fkjg', {
                                        rules: [{required: true, message: '请输入反馈结果'}, {
                                            max: 255,
                                            message: '最多输入255个字！'
                                        }],
                                    })(
                                        <Input placeholder="请输入反馈结果"/>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={rowLayout}>
                            <Col {...colLayout}>
                                <FormItem label="反馈意见" {...formItemLayout}>
                                    {getFieldDecorator('fkyj', {
                                        rules: [{required: true, message: '请输入反馈意见'}, {
                                            max: 1000,
                                            message: '最多输入1000个字！'
                                        }],
                                    })(
                                        <TextArea placeholder="请输入反馈意见" rows={3}/>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </div>
        );
    }
}

