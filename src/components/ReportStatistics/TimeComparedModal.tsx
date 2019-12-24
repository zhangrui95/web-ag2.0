import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Modal, Table, Divider, Button, Popconfirm, message, Icon, Tag, Tooltip, Row, Col, Form, Select} from 'antd';
import {routerRedux} from 'dva/router';
import {getSysAuthority} from '../../utils/authority';
import styles from './TimeComparedModal.less';
import {DatePicker} from 'antd/lib/index';

const FormItem = Form.Item;
const {RangePicker} = DatePicker;

@connect(({common}) => ({
    common,
    // loading: loading.models.alarmManagement,
}))
@Form.create()
export default class TimeComparedModal extends PureComponent {
    state = {
        // SureModalVisible:false,
        formValues: {},
    };

    componentDidMount() {
    }

    onCancel = () => {
        this.props.closeModal(false);
    };
    timeCompared = (e) => {
        e.preventDefault();
        let values = this.props.form.getFieldsValue();
        let comparedRq1 = values.comparedRq1;
        let comparedRq2 = values.comparedRq2;
        let comparedRq1_ks = comparedRq1 && comparedRq1.length > 0 ? comparedRq1[0].format('YYYY-MM-DD') : '';
        let comparedRq1_js = comparedRq1 && comparedRq1.length > 0 ? comparedRq1[1].format('YYYY-MM-DD') : '';
        let comparedRq2_ks = comparedRq2 && comparedRq2.length > 0 ? comparedRq2[0].format('YYYY-MM-DD') : '';
        let comparedRq2_js = comparedRq2 && comparedRq2.length > 0 ? comparedRq2[1].format('YYYY-MM-DD') : '';
        //判断时间不可相同
        if (comparedRq1_ks == '' && comparedRq1_js == '') {
            message.warning('选择日期不可为空！');
        } else if (comparedRq2_ks == '' && comparedRq2_js == '') {
            message.warning('对比日期不可为空！');
        } else if ((comparedRq1_ks === comparedRq2_ks) && (comparedRq1_js === comparedRq2_js)) {
            message.warning('选择日期和对比日期不可相同!');
        } else {
            this.props.timeComparedModalSearch(false, comparedRq1_ks, comparedRq1_js, comparedRq2_ks, comparedRq2_js);
        }
    };
    // 无法选择的日期
    disabledDate = (current) => {
        // Can not select days before today and today
        return current && current.valueOf() > Date.now();
    };

    render() {
        const {form: {getFieldDecorator}, common: {WtlxBaqTypeData, superviseStatusDict, depTree, involvedType}} = this.props;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 8},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            },
        };
        return (
            <div>
                <Modal
                    maskClosable={false}
                    visible={this.props.visible}
                    onCancel={() => this.onCancel()}
                    width={800}
                    className={styles.indexmodal}
                    centered={true}
                    footer={null}
                >
                    <div>
                        {/*<Form  onSubmit={this.handleSearch}>*/}
                        <Row gutter={{md: 8, lg: 24, xl: 48}} style={{padding: '20px 0 0 160px'}}>
                            <Col md={10} sm={30}>
                                <FormItem label="&nbsp;&nbsp;&nbsp;选择日期" {...formItemLayout}>
                                    {getFieldDecorator('comparedRq1', {
                                        // initialValue: this.state.badw,
                                    })(
                                        <RangePicker
                                            disabledDate={this.disabledDate}
                                            style={{width: '200%'}}
                                        />,
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row sgutter={{md: 8, lg: 24, xl: 48}} style={{margin: '30px 0 0 160px'}}>
                            <Col md={9} sm={30}>
                                <FormItem label="&nbsp;&nbsp;&nbsp;对比日期" {...formItemLayout}>
                                    {getFieldDecorator('comparedRq2', {
                                        // initialValue: this.state.badw,
                                    })(
                                        <RangePicker
                                            disabledDate={this.disabledDate}
                                            style={{width: '200%'}}
                                        />,
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Button type="primary" style={{margin: '40px 0 0 350px'}}
                                    onClick={this.timeCompared}>确认</Button>
                        </Row>
                    </div>
                </Modal>
            </div>
        );
    }
}

