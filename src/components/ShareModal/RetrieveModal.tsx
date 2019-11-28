import React, { PureComponent } from 'react';
import { Modal, Form, Input, Select, message, Button, Spin, DatePicker, Row, Col } from 'antd';
import moment from 'moment';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import styles from './ShareModal.less';
import { connect } from 'dva';
import { getUserInfos } from '../../utils/utils';

const { TextArea } = Input;
const Option = Select.Option;
const FormItem = Form.Item;

@connect(({ share }) => ({
    share,
}))
class RetrieveModal extends PureComponent {
    constructor(props, context) {
        super(props);
        this.state = {
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
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { RetrieveRecord } = this.props;
                this.props.dispatch({
                    type: 'share/getTb',
                    payload: {
                        ajbh: RetrieveRecord.ajbh,
                        tbrq: values.sharePerson.format('YYYY-MM-DD'),
                        tbyy: values.retrieveSuggest,
                    },
                    callback: (data) => {
                        if (data.error === null) {
                            message.success('退补成功！');
                        }
                        this.props.handleCancel();
                        this.props.refreshPage();
                    },
                });
            }
        });
    };

    // 无法选择的日期
    disabledDate = (current) => {
        // Can not select days before today and today
        const { RetrieveRecord: { tbrq1, qsrq } } = this.props;
        if (tbrq1) return current && (current > moment().endOf('day') || current < moment(tbrq1));
        return current && (current > moment().endOf('day') || current < moment(qsrq)); // 退补日期必须小于移送起诉日期
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
        const rowLayout = { md: 8, xl: 16, xxl: 24 };
        const colLayout = { sm: 24, md: 12, xl: 8 };
        const children = [];
        if (this.state.personList && this.state.personList.length > 0) {
            this.state.personList.map((event, idx) => {
                if (event.idcard !== getUserInfos().idCard) {
                    children.push(<Option key={event.idcard} label={event.depname}><span>{event.name}</span><span
                        style={{ color: '#ccc' }}>&nbsp;&nbsp;{event.depname}</span><span
                        style={{ display: 'none' }}>{event.department}</span></Option>);
                }
            });
        }
        const { form: { getFieldDecorator }, RetrieveVisible, handleCancel, RetrieveRecord,tbDetail } = this.props;
        return (
            <div className={styles.standardTable}>
                <Modal
                    title="退补侦查设置"
                    visible={RetrieveVisible}
                    onOk={this.handleOk}
                    onCancel={handleCancel}
                    className={styles.shareHeader}
                    // confirmLoading={this.state.btnLoading}
                    width={900}
                    maskClosable={false}
                    style={{ top: '250px' }}
                >
                    <Row style={{
                        width: '90%',
                        margin: '0 38px 10px',
                        lineHeight: '36px',
                        color: 'rgba(0, 0, 0, 0.85)',
                    }}>
                        <Col span={12}>
                            案件名称：
                            <Ellipsis length={20}
                                      tooltip>{RetrieveRecord && RetrieveRecord.ajmc ? RetrieveRecord.ajmc : ''}</Ellipsis>
                        </Col>
                        <Col span={12}>
                            办案单位：
                            <Ellipsis length={20}
                                      tooltip>{RetrieveRecord && RetrieveRecord.bardwmc ? RetrieveRecord.bardwmc : tbDetail && tbDetail.bardwmc ?  tbDetail.bardwmc : ''}</Ellipsis>
                        </Col>
                        <Col span={12}>案件状态：{RetrieveRecord && RetrieveRecord.ajzt ? RetrieveRecord.ajzt : ''}</Col>
                        <Col span={12}>办案民警：{RetrieveRecord && RetrieveRecord.barxm ? RetrieveRecord.barxm : tbDetail && tbDetail.barxm ?  tbDetail.barxm : ''}</Col>
                    </Row>
                    <Form>
                        <FormItem {...formItemLayout} label="退补日期">
                            {getFieldDecorator('sharePerson', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择退补日期！',
                                    },
                                ],
                            })(
                                <DatePicker
                                    disabledDate={this.disabledDate}
                                    style={{ width: '40%' }}
                                    // showTime={{ format: 'HH:mm:ss' }}
                                    // format="YYYY-MM-DD HH:mm:ss"
                                />,
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="退补原因">
                            {getFieldDecorator('retrieveSuggest', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请填写退补原因',
                                    },
                                    {
                                        max: 500,
                                        message: '最多输入500字',
                                    },
                                ],
                            })(
                                <TextArea rows={4} placeholder='请输入不超过500字'/>,
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        );
    }
}

export default Form.create()(RetrieveModal);
