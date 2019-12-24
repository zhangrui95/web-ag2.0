import React, {PureComponent} from 'react';
import {Modal, Form, Input, Select, message, Button, Spin, DatePicker, Row, Col, Card} from 'antd';
import moment from 'moment';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import styles from './RetrieveModal.less';
import {connect} from 'dva';
import {getUserInfos} from '../../utils/utils';
import {NavigationItem} from "@/components/Navigation/navigation";
import {routerRedux} from "dva/router";

const {TextArea} = Input;
const Option = Select.Option;
const FormItem = Form.Item;

@connect(({share, global}) => ({
    share, global
}))
class RetrieveModal extends PureComponent {
    constructor(props, context) {
        super(props);
        let RetrieveRecord = props.location.query.record;
        if (typeof RetrieveRecord == 'string') {
            RetrieveRecord = JSON.parse(sessionStorage.getItem('query')).query.record;
        }
        this.state = {
            key: 0,
            btnLoading: false,
            RetrieveRecord:RetrieveRecord,
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
                this.props.dispatch({
                    type: 'share/getTb',
                    payload: {
                        ajbh: this.state.RetrieveRecord.ajbh,
                        tbrq: values.sharePerson.format('YYYY-MM-DD'),
                        tbyy: values.retrieveSuggest,
                    },
                    callback: (data) => {
                        if (data.error === null) {
                            message.success('退补成功！');
                            this.onEdit(true);
                        }
                        // this.props.refreshPage();
                    },
                });
            }
        });
    };

    // 无法选择的日期
    disabledDate = (current) => {
        // Can not select days before today and today
        if (this.state.RetrieveRecord.tbrq1) return current && (current > moment().endOf('day') || current < moment(this.state.RetrieveRecord.tbrq1));
        return current && (current > moment().endOf('day') || current < moment(this.state.RetrieveRecord.qsrq)); // 退补日期必须小于移送起诉日期
    };

    onEdit = async (isReset) => {
        let RetrieveRecord = this.state.RetrieveRecord;
        let key = '/Retrieve' + this.props.location.query.id;
        // 删除当前tab并且将路由跳转至前一个tab的path
        const {dispatch} = this.props;
        if (dispatch) {
            let query = isReset ? (this.props.location.query.isDetail ? {
                isReset,
                id: this.props.location.query.id
            } : {isReset}) : (this.props.location.query.isDetail ? {id: this.props.location.query.id} : {});
            dispatch(routerRedux.push({pathname: RetrieveRecord.url, query: query}));
            dispatch({
                type: 'global/changeSessonNavigation',
                payload: {
                    key,
                    isShow: false,
                },
            });
            dispatch({
                type: 'global/changeNavigation',
                payload: {
                    key,
                    isShow: false,
                },
            });
        }
    };

    render() {
        const formItemLayout = {
            labelCol: {
                xs: {span: 3},
                sm: {span: 3},
            },
            wrapperCol: {
                xs: {span: 20},
                sm: {span: 20},
            },
        };
        const rowLayout = {md: 8, xl: 16, xxl: 24};
        const colLayout = {sm: 24, md: 12, xl: 8};
        const children = [];
        if (this.state.personList && this.state.personList.length > 0) {
            this.state.personList.map((event, idx) => {
                if (event.idcard !== getUserInfos().idCard) {
                    children.push(<Option key={event.idcard} label={event.depname}><span>{event.name}</span><span
                        style={{color: '#ccc'}}>&nbsp;&nbsp;{event.depname}</span><span
                        style={{display: 'none'}}>{event.department}</span></Option>);
                }
            });
        }
        const {form: {getFieldDecorator}, RetrieveVisible, handleCancel, tbDetail} = this.props;
        let RetrieveRecord = this.state.RetrieveRecord;
        return (
            <div id={'RetrieveForm' + RetrieveRecord.ajbh}
                 className={this.props.global && this.props.global.dark ? '' : styles.lightBox}>
                <Card className={styles.standardTable}>
                    <div className={styles.title}>退补侦查设置</div>
                    <Row style={{
                        width: '82%',
                        margin: '0 9% 10px',
                        lineHeight: '36px',
                        color: this.props.global && this.props.global.dark ? '#fff' : '#4D4D4D',
                    }}>
                        <Col span={12}>
                            案件名称：{RetrieveRecord && RetrieveRecord.ajmc ? RetrieveRecord.ajmc : ''}
                        </Col>
                        <Col span={12}>
                            办案单位：{RetrieveRecord && RetrieveRecord.bardwmc ? RetrieveRecord.bardwmc : tbDetail && tbDetail.bardwmc ? tbDetail.bardwmc : ''}
                        </Col>
                        <Col span={12}>案件状态：{RetrieveRecord && RetrieveRecord.ajzt ? RetrieveRecord.ajzt : ''}</Col>
                        <Col
                            span={12}>办案民警：{RetrieveRecord && RetrieveRecord.barxm ? RetrieveRecord.barxm : tbDetail && tbDetail.barxm ? tbDetail.barxm : ''}</Col>
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
                                    style={{width: '40%'}}
                                    getCalendarContainer={() => document.getElementById('RetrieveForm' + RetrieveRecord.ajbh)}
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
                </Card>
                <Card>
                    <div className={styles.btns}>
                        {/*<Button type="primary" style={{marginLeft: 8}} className={styles.qxBtn}*/}
                        {/*        onClick={() => this.onEdit(false)}>*/}
                        {/*    取消*/}
                        {/*</Button>*/}
                        <Button type="primary" style={{marginLeft: 8}} className={styles.okBtn} onClick={this.handleOk}>
                            确定
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }
}

export default Form.create()(RetrieveModal);
