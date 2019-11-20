import React, { PureComponent } from 'react';
import { Modal, Form, Input, Select, message, button, Switch, Table, Checkbox, Row, Col } from 'antd';
import { connect } from 'dva';
import styles from './DispatchModal.less';

const { TextArea } = Input;
const Option = Select.Option;
const FormItem = Form.Item;

@connect(({ Dispatch }) => ({
    Dispatch,
}))
class DispatchModal extends PureComponent {
    constructor(props, context) {
        super(props);
        this.state = {
            shareSuccess: false,
            loading: false,
            key: 0,
            btnLoading: false,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.shareVisible !== nextProps.shareVisible) {
            this.props.form.resetFields();
            this.setState({
                key: this.state.key + 1,
                btnLoading: false,
            });
        }
    }

    handleOk = () => {
      const { shareItem } = this.props;
        this.props.form.validateFields((err, values) => {
            if (!values.suggest) {
                message.warn('请填写调度意见！');
            } else if (values.suggest && values.suggest.length > 500) {
                message.warn('调度意见不可超过500字');
            } else {
                this.setState({
                    btnLoading: true,
                });
                let ddxh = '';
                if(shareItem.qtpdlx === ""){
                  ddxh = '第一次调度'
                }
                else if(shareItem.qtpdlx === "第一次调度未处理"){
                  ddxh = '第二次调度'
                }
                else if(shareItem.qtpdlx === "第二次调度未处理"){
                  ddxh = '督办'
                }
                else if(!shareItem.qtpdlx){
                  ddxh = '';
                }
                this.props.dispatch({
                    type: 'Dispatch/getAddDd',
                    payload: {
                        dd_type: this.props.tzlx,
                        is_xcdd: values.isLiveDispatch === undefined ? undefined : (values.isLiveDispatch ? '1' : '0'),
                        ddyj: values.suggest,
                        glid: this.props.tzlx === 'xsaj' || this.props.tzlx === 'xzaj' ? this.props.shareItem.wtid : this.props.shareItem.id,
                        is_zdgz: values.zdgz ? '1' : '0',
                        ddxh: ddxh,
                    },
                    callback: (res) => {
                        if (!res.error) {
                            this.props.closehandleCancel();
                            if(shareItem.qtpdlx === ''||shareItem.qtpdlx === null || shareItem.qtpdlx === undefined){
                              this.props.handleSearch('','0')
                            }
                            else {
                              this.props.handleSearch('','1')
                            }
                            this.setState({
                                shareSuccess: true,
                                btnLoading: false,
                            });
                        } else {
                            message.error(res.error.text);
                            this.setState({
                                btnLoading: false,
                            });
                        }
                    },
                });
            }
        });
    };
    handleCancel = () => {
        this.setState({
            shareSuccess: false,
        });
        this.props.handleSearch(null);
        if (this.props.hideDispatchButton) this.props.hideDispatchButton();
    };

    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 3 },
                sm: { span: 3 },
            },
            wrapperCol: {
                xs: { span: 20 },
                sm: { span: 20 },
            },
        };
        const formItemLayouts = {
            labelCol: {
                xs: { span: 6 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 14 },
                sm: { span: 14 },
            },
        };
        const { getFieldDecorator } = this.props.form;
        const { shareItem } = this.props;
        return (
            <div className={styles.standardTable}>
                <Modal
                    title={shareItem&&shareItem.qtpdlx === '第二次调度未处理'?'警情督办':this.props.title}
                    visible={this.props.shareVisible}
                    onOk={this.handleOk}
                    onCancel={this.props.handleCancel}
                    className={styles.shareHeader}
                    okText='确定'
                    confirmLoading={this.state.btnLoading}
                    width={900}
                    maskClosable={false}
                    centered={true}
                >
                    {this.props.detail ? this.props.detail : ''}
                    <Form>
                        {
                            this.props.isPoliceDispatch ? (
                                <Row>
                                    <Col span={12}>
                                        <FormItem {...formItemLayouts} label="现场调度">
                                            {getFieldDecorator('isLiveDispatch', {
                                                initialValue: true,
                                                valuePropName: 'checked',
                                            })(
                                                <Switch/>,
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem {...formItemLayouts}>
                                            {getFieldDecorator('zdgz', {
                                                initialValue: false,
                                                valuePropName: 'checked',
                                            })(
                                                <Checkbox>重点关注</Checkbox>,
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                            ) : null
                        }
                        <FormItem {...formItemLayout} label={shareItem&&shareItem.qtpdlx === '第二次调度未处理'?'督办意见':"调度意见"}>
                            {getFieldDecorator('suggest')(<TextArea rows={4} placeholder='请输入不超过500字'/>)}
                        </FormItem>
                    </Form>
                </Modal>
                <Modal
                    title=" "
                    visible={this.state.shareSuccess}
                    className={styles.shareSuccess}
                    width={350}
                    centered={true}
                    maskClosable={false}
                    cancelText={null}
                    onCancel={this.handleCancel}
                    footer={<button onClick={this.handleCancel} className={styles.successBtn}>确定</button>}
                >
                    调度完成！
                </Modal>
            </div>
        );
    }
}

export default Form.create()(DispatchModal);
