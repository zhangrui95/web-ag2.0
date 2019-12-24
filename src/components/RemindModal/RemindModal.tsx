import React, {PureComponent} from 'react';
import {Modal, Form, Input, Select, message, button} from 'antd';
import styles from './RemindModal.less';

const {TextArea} = Input;
const {Option, OptGroup} = Select;
import {connect} from 'dva';
import {getUserInfos} from '../../utils/utils';

const FormItem = Form.Item;

@connect(({share}) => ({
    share,
}))
class RemindModal extends PureComponent {
    constructor(props, context) {
        super(props);
        this.state = {
            shareSuccess: false,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.txVisible !== nextProps.txVisible) {
            this.props.form.resetFields();
        }
    }

    handleOk = () => {
        this.props.form.validateFields((err, values) => {
            if (!values.sharePerson || values.sharePerson.length === 0) {
                message.warn('请选择接收人');
            } else if (values.shareSuggest && values.shareSuggest.length > 500) {
                message.warn('提醒建议不可超过500字');
            } else {
                const jsr = [], jsdw_dm = [], jsr_sfzh = [], jsdw = [], jsr_jh = [];
                values.sharePerson.map((item) => {
                    jsr.push(item.split(',')[0]);
                    jsdw_dm.push(item.split(',')[2]);
                    jsdw.push(item.split(',')[3]);
                    jsr_sfzh.push(item.split(',')[1]);
                    jsr_jh.push(item.split(',')[4]);
                });
                const newjsr = jsr.join(',');
                const newjsdwdm = jsdw_dm.join(',');
                const newjsdw = jsdw.join(',');
                const newjsr_sfzh = jsr_sfzh.join(',');
                const newjsr_jh = jsr_jh.join(',');
                // console.log('this.props.txItem------>', this.props.txItem);
                this.props.dispatch({
                    type: 'share/getTx',
                    payload: {
                        ag_id: this.props.txItem.ag_id || '',
                        jsdw: newjsdw,
                        jsdw_dm: newjsdwdm,
                        jsr: newjsr,
                        jsr_jh: newjsr_jh,
                        jsr_sfzh: newjsr_sfzh,
                        txjy: values.shareSuggest,
                        yj_id: this.props.txItem.id || '',
                        yjlxdm: this.props.txItem.yjlxdm || '',
                        yjlxmc: this.props.txItem.yjlxmc || '',
                        yjmc: this.props.yjmc || '',
                        yjnr: this.props.txItem.yjnr || '',
                        yjsj: this.props.txItem.yjsj || '',
                        yjjbdm: this.props.txItem.yjjbdm || '',
                        ajbh: this.props.txItem.ajbh || '',
                        ajmc: this.props.txItem.ajmc || '',
                        jjdw_mc: this.props.txItem.jjdw_mc || '',
                        yj_type: this.props.txItem.yj_type || '',
                        jjr: this.props.txItem.jjr || '',
                        xyrxm: this.props.txItem.xyrxm || '',
                        jqbh: this.props.txItem.jqbh || '',
                        jzmc: this.props.txItem.jzmc || '',
                        wpmc: this.props.txItem.wpmc || '',
                        yjjbmc: this.props.txItem.yjjbmc || '',
                    },
                    callback: (res) => {
                        if (!res.error) {
                            this.props.handleCancel();
                            this.setState({
                                shareSuccess: true,
                            });
                        } else {
                            message.error(res.error);
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
        this.props.getResult();
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
        let zrrTreeNodeTypeOptions = '';
        if (this.props.caseDetails && this.props.caseDetails.zrrList) {
            let jsrList = this.props.caseDetails.zrrList;
            let hash = {};
            let i = 0;
            let res = [];
            jsrList.map(function (item) {
                let jsrdw_mc = item.zrr_dwmc;
                hash[jsrdw_mc] ? res[hash[jsrdw_mc] - 1].zrrList.push(item) : hash[jsrdw_mc] = ++i && res.push({
                    zrrList: [item],
                });
            });
            zrrTreeNodeTypeOptions =
                res.map(item => (
                    <OptGroup label={item.zrrList[0].zrr_dwmc}>
                        {
                            item.zrrList.map((zrrItem) => {
                                    const newDatazrr = [zrrItem.zrr_name, zrrItem.zrr_sfzh, zrrItem.zrr_dwid, zrrItem.zrr_dwmc, zrrItem.zrr_jh].join(',');
                                    return (
                                        <Option value={newDatazrr}>{zrrItem.zrr_name}</Option>
                                    );
                                },
                            )
                        }
                    </OptGroup>
                ));
        } else {
            zrrTreeNodeTypeOptions = '';
        }
        const {getFieldDecorator} = this.props.form;
        return (
            <div className={styles.standardTable}>
                <Modal
                    title="提醒"
                    visible={this.props.txVisible}
                    onOk={this.handleOk}
                    onCancel={this.props.handleCancel}
                    className={styles.shareHeader}
                    okText='提醒'
                    width={900}
                    maskClosable={false}
                    style={{top: '250px'}}
                >
                    {this.props.detail ? this.props.detail : ''}
                    <Form>
                        <FormItem {...formItemLayout} label="接收人">
                            {getFieldDecorator('sharePerson')(
                                <Select
                                    mode="multiple"
                                    style={{width: '100%'}}
                                    placeholder="请选择接收人"
                                >
                                    {zrrTreeNodeTypeOptions}
                                </Select>,
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="提醒建议">
                            {getFieldDecorator('shareSuggest')(<TextArea rows={4} placeholder='请输入不超过500字'/>)}
                        </FormItem>
                    </Form>
                </Modal>
                <Modal
                    title=" "
                    visible={this.state.shareSuccess}
                    className={styles.shareSuccess}
                    width={350}
                    style={{top: '250px'}}
                    maskClosable={false}
                    cancelText={null}
                    onCancel={this.handleCancel}
                    footer={<button onClick={this.handleCancel} className={styles.successBtn}>确定</button>}
                >
                    已提醒
                </Modal>
            </div>
        );
    }
}

export default Form.create()(RemindModal);
