/*
 * Share/index.tsx 分享功能弹窗
 * author：jhm
 * 20191211
 * */

import React, {PureComponent} from 'react';
import {Modal, Form, Input, Select, message, button, Spin, Row, Col, Tooltip, Button, Card} from 'antd';
import styles from './index.less';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';

const {TextArea} = Input;
const Option = Select.Option;
import {connect} from 'dva';
import {getUserInfos} from '../../../utils/utils';
import {routerRedux} from "dva/router";
import {NavigationItem} from "@/components/Navigation/navigation";

const FormItem = Form.Item;

@connect(({share, global}) => ({
    share, global
}))
class ShareModal extends PureComponent {
    constructor(props, context) {
        super(props);
        let res = props.location.query.record;
        let location = props.location;
        if (typeof res == 'string') {
            location = JSON.parse(sessionStorage.getItem('query'));
        }
        this.state = {
            shareSuccess: false,
            loading: false,
            key: 0,
            location: location,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.shareVisible !== nextProps.shareVisible) {
            this.props.form.resetFields();
            this.setState({
                key: this.state.key + 1,
            });
        }
    }

    handleOk = () => {
        const {query: {record, from, tzlx, sx}} = this.state.location;
        this.props.form.validateFields((err, values) => {
            if (!values.sharePerson || values.sharePerson.length === 0) {
                message.warn('请选择分享人');
            } else if (values.shareSuggest && values.shareSuggest.length > 500) {
                message.warn('分享建议不可超过500字');
            } else {
                let card = [];
                let name = [];
                let dirName = [];
                let dirNum = [];
                values.sharePerson.map((item) => {
                    card.push(item.key);
                    name.push(item.label[0].props.children);
                    dirName.push(item.label[1].props.children[1]);
                    dirNum.push(item.label[2].props.children);
                });
                this.props.dispatch({
                    type: 'share/getMyFollow',
                    payload: {
                        fx_sfzh: card.toString(),
                        fx_dwdm: dirNum.toString(),
                        fx_dwmc: dirName.toString(),
                        fx_xm: name.toString(),
                        agid: record && (record.tzlx === 'jqwt' || record.tzlx === 'jzwt') ? record.wtid : record.id,
                        fxjy: values.shareSuggest,
                        lx: from ? from : '',
                        sx: sx ? sx : '',
                        type: 2,
                        tzlx: tzlx ? tzlx : '',
                        wtid: record && record.wtid ? record.wtid : '',
                        ajbh: record && record.ajbh ? record.ajbh : '',
                        system_id: tzlx === 'jqwt' ? record.id : tzlx === 'jzwt' || tzlx === 'jzxx' ? record.dossier_id : tzlx === 'baqwt' ? record.baq_id : record.system_id,
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
        this.onEdit(true)
    };
    handleSearch = (value) => {
        this.setState({
            personList: [],
            loading: true,
        });
        this.props.dispatch({
            type: 'share/sharePerson',
            payload: {
                pd: {
                    code: getUserInfos().department,
                    name: value,
                },
                showCount: 999999,
            },
            callback: (res) => {
                this.setState({
                    personList: res.list,
                    loading: false,
                });
            },
        });
        // this.setState({
        // shareVisible: true,
        // shareItem: res,
        // })
    };
    getBlur = () => {
        this.setState({
            personList: [],
        });
    };
    onEdit = (isReset) => {
        const {query: {record, tab}} = this.state.location;
        let key = '/ModuleAll/Share' + this.state.location.query.id;
        const {dispatch} = this.props;
        if (dispatch) {
            dispatch(routerRedux.push({
                pathname: this.state.location.query.fromPath,
                query: isReset ? {
                    isReset,
                    id: tab === '表格' ? '' : this.state.location.query.id,
                    record: tab === '表格' ? '' : this.state.location.query.record
                } : {
                    id: tab === '表格' ? '' : this.state.location.query.id,
                    record: tab === '表格' ? '' : this.state.location.query.record
                }
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

    render() {
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
        const {getFieldDecorator} = this.props.form;
        const {query: {record}} = this.state.location;
        // console.log('record',record)
        let className = this.props.global && this.props.global.dark ? '' : styles.lightBox;
        return (
            <div className={className}>
                <Card className={styles.standardTable} id='shareModule'>
                    <Row style={{lineHeight: '50px', paddingLeft: 66}}>
                        {
                            record && record.detail && record.detail.length > 0 && record.detail.map((item) => {
                                return <Col span={item.length > 40 ? 24 : 12}>{item}</Col>
                            })
                        }
                    </Row>
                    <Form style={{padding: 0}}>
                        <FormItem {...formItemLayout} label="分享人">
                            {getFieldDecorator('sharePerson')(
                                <Select
                                    labelInValue
                                    mode="multiple"
                                    filterOption={false}
                                    style={{width: '100%'}}
                                    placeholder="请输入分享人"
                                    onSearch={this.handleSearch}
                                    onFocus={this.handleSearch}
                                    notFoundContent={this.state.loading ? <Spin size="small"/> : null}
                                    onBlur={this.getBlur}
                                    getPopupContainer={() => document.getElementById('shareModule')}
                                >
                                    {children}
                                </Select>,
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="分享建议">
                            {getFieldDecorator('shareSuggest')(<TextArea rows={8} style={{resize: 'none'}}
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
                        <Button type="primary" style={{marginLeft: 8}} className={styles.okBtn} onClick={this.handleOk}>
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
                    分享完成！
                </Modal>
            </div>
        );
    }
}

export default Form.create()(ShareModal);

