/*
 * DailyRecord/index.tsx 提醒
 * author：jhm
 * 20191216
 * */

import React, {PureComponent} from 'react';
import {Modal, Form, Input, Select, message, button, Card, Button, Row, Col} from 'antd';
import styles from './index.less';

const {TextArea} = Input;
const {Option, OptGroup} = Select;
import {connect} from 'dva';
import {getUserInfos} from '../../../utils/utils';
import {routerRedux} from "dva/router";

const FormItem = Form.Item;

@connect(({share, itemData, global}) => ({
    share, itemData, global
}))
class Index extends PureComponent {
    constructor(props, context) {
        super(props);
        let res = props.location.query.record;
        let location = props.location;
        if (typeof res == 'string') {
            location = JSON.parse(sessionStorage.getItem('query'));
        }
        this.state = {
            shareSuccess: false,
            location: location,
        };
    }


    componentWillReceiveProps(nextProps) {
        if (this.props.txVisible !== nextProps.txVisible) {
            this.props.form.resetFields();
        }
    }


    onEdit = (isReset) => {
        const {query: {record, detail, tab, fromPath, id}} = this.state.location;
        // console.log('fromPath',fromPath);
        // console.log('isReset',isReset);
        let key = '/ModuleAll/Remind' + this.state.location.query.id;
        const {dispatch} = this.props;
        if (dispatch) {
            dispatch(routerRedux.push({pathname: fromPath ? fromPath : '',
                query: isReset ? {
                    isReset,
                    id: tab === '表格' ? '' : id,
                    record: tab === '表格' ? '' : record
                } : {id: tab === '表格' ? '' : id, record: tab === '表格' ? '' : record}
            }));
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
    handleOk = () => {
        const {query: {record, from}} = this.state.location;
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
                this.props.dispatch({
                    type: 'share/getTx',
                    payload: {
                        ag_id: record.ag_id || '',
                        jsdw: newjsdw,
                        jsdw_dm: newjsdwdm,
                        jsr: newjsr,
                        jsr_jh: newjsr_jh,
                        jsr_sfzh: newjsr_sfzh,
                        txjy: values.shareSuggest,
                        yj_id: record.id || '',
                        yjlxdm: record.yjlxdm || '',
                        yjlxmc: record.yjlxmc || '',
                        yjmc: from || '',
                        yjnr: record.yjnr || '',
                        yjsj: record.yjsj || '',
                        yjjbdm: record.yjjbdm || '',
                        ajbh: record.ajbh || '',
                        ajmc: record.ajmc || '',
                        jjdw_mc: record.jjdw_mc || '',
                        yj_type: record.yj_type || '',
                        jjr: record.jjr || '',
                        xyrxm: record.xyrxm || '',
                        jqbh: record.jqbh || '',
                        jzmc: record.jzmc || '',
                        wpmc: record.wpmc || '',
                        yjjbmc: record.yjjbmc || '',
                    },
                    callback: (res) => {
                        if (!res.error) {
                            // this.props.handleCancel();
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
        // this.props.getResult();
        this.onEdit(true);
    };

    render() {
        const {query: {record, id, itemDetails}} = this.state.location;
        const formItemLayout = {
            labelCol: {
                xs: {span: 3},
                sm: {span: 2},
            },
            wrapperCol: {
                xs: {span: 21},
                sm: {span: 22},
            },
        };
        let zrrTreeNodeTypeOptions = '';
        if (itemDetails && itemDetails.zrrList) {
            let jsrList = itemDetails.zrrList;
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
            <div className={this.props.global && this.props.global.dark ? '' : styles.lightBox}>
                <Card className={styles.standardTable} id='RemindModule'>
                    <Row style={{lineHeight: '50px', paddingLeft: 66}}>
                        {
                            record && record.detail && record.detail.length > 0 && record.detail.map((item) => {
                                return <Col span={item.length > 40 ? 24 : 12}>{item}</Col>
                            })
                        }
                    </Row>
                    <Form>
                        <FormItem {...formItemLayout} label="接收人">
                            {getFieldDecorator('sharePerson')(
                                <Select
                                    mode="multiple"
                                    style={{width: '100%'}}
                                    placeholder="请选择接收人"
                                    getPopupContainer={() => document.getElementById('RemindModule')}
                                >
                                    {zrrTreeNodeTypeOptions}
                                </Select>,
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="提醒建议">
                            {getFieldDecorator('shareSuggest')(<TextArea rows={4} style={{resize: 'none'}}
                                                                         placeholder='请输入不超过500字'/>)}
                        </FormItem>
                    </Form>
                </Card>
                <Card>
                    <div className={styles.btns}>
                        <Button type="primary" style={{marginLeft: 8}} className={styles.qxBtn}
                                onClick={() => this.onEdit(false)}>
                            取消
                        </Button>
                        <Button type="primary" style={{marginLeft: 8}} onClick={this.handleOk} className={styles.okBtn}>
                            确定
                        </Button>
                    </div>
                </Card>
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

export default Form.create()(Index);



