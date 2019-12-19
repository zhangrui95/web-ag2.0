import React, { PureComponent } from 'react';
import { Modal, Form, Input, Select, message, button, Spin } from 'antd';
import styles from './ShareModal.less';

const { TextArea } = Input;
const Option = Select.Option;
import { connect } from 'dva';
import { getUserInfos } from '../../utils/utils';

const FormItem = Form.Item;

@connect(({ share }) => ({
    share,
}))
class ShareModal extends PureComponent {
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
                this.setState({
                    btnLoading: true,
                });
                this.props.dispatch({
                    type: 'share/getMyFollow',
                    payload: {
                        fx_sfzh: card.toString(),
                        fx_dwdm: dirNum.toString(),
                        fx_dwmc: dirName.toString(),
                        fx_xm: name.toString(),
                        agid: this.props.location.query.tzlx === 'jqwt' || this.props.location.query.tzlx === 'jzwt' ? this.props.shareItem.wtid : this.props.shareItem.id,
                        fxjy: values.shareSuggest,
                        lx: this.props.location.query.lx,
                        sx: this.props.location.query.sx,
                        type: 2,
                        tzlx: this.props.location.query.tzlx,
                        wtid: this.props.location.query.record.wtid,
                        ajbh: this.props.location.query.record.ajbh,
                        system_id: this.props.location.query.tzlx === 'jqwt' ? this.props.location.query.record.id : this.props.location.query.tzlx === 'jzwt' || this.props.location.query.tzlx === 'jzxx' ? this.props.location.record.dossier_id : this.props.location.query.tzlx === 'baqwt' ? this.props.location.record.baq_id : this.props.location.record.system_id,
                    },
                    callback: (res) => {
                        if (!res.error) {
                            this.props.handleCancel();
                            this.setState({
                                shareSuccess: true,
                                btnLoading: false,
                            });
                        } else {
                            message.error(res.error);
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
        const { getFieldDecorator } = this.props.form;
        return (
            <div className={styles.standardTable}>
                <Modal
                    title="分享"
                    visible={this.props.shareVisible}
                    onOk={this.handleOk}
                    onCancel={this.props.handleCancel}
                    className={styles.shareHeader}
                    okText='发起分享'
                    confirmLoading={this.state.btnLoading}
                    width={900}
                    maskClosable={false}
                    style={{ top: '250px' }}
                >
                    {this.props.detail ? this.props.detail : ''}
                    <Form id={'area' + this.state.key}>
                        <FormItem {...formItemLayout} label="分享人">
                            {getFieldDecorator('sharePerson')(
                                <Select
                                    labelInValue
                                    mode="multiple"
                                    filterOption={false}
                                    style={{ width: '100%' }}
                                    placeholder="请输入分享人"
                                    onSearch={this.handleSearch}
                                    onFocus={this.handleSearch}
                                    notFoundContent={this.state.loading ? <Spin size="small"/> : null}
                                    onBlur={this.getBlur}
                                    getPopupContainer={() => document.getElementById('area' + this.state.key)}
                                >
                                    {children}
                                </Select>,
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="分享建议">
                            {getFieldDecorator('shareSuggest')(<TextArea rows={4} placeholder='请输入不超过500字'/>)}
                        </FormItem>
                    </Form>
                </Modal>
                <Modal
                    title=" "
                    visible={this.state.shareSuccess}
                    className={styles.shareSuccess}
                    width={350}
                    style={{ top: '250px' }}
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
