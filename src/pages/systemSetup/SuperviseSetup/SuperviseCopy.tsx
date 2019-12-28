/*
 * 监管点复用弹框
 * author：zr
 * 20190314
 * */
import React, {PureComponent} from 'react';
import {
    Card,
    Col,
    Table,
    Radio,
    Tooltip,
    Icon,
    message,
    Modal,
    Form,
    Row,
    Select,
    Transfer, Empty, Button,
} from 'antd';
import {connect} from 'dva';
import styles from './index.less';
import {getUserInfos} from '../../../utils/utils';
import noList from "@/assets/viewData/noList.png";
import {NavigationItem} from "@/components/Navigation/navigation";
import {routerRedux} from "dva/router";
import noListLight from "@/assets/viewData/noListLight.png";
const { Option, OptGroup } = Select;
const FormItem = Form.Item;
@Form.create()
@connect(({SuperviseSetup, common, share, global}) => ({
    SuperviseSetup,
    common,
    share,
    global
}))
export default class SuperviseCopy extends PureComponent {
    constructor(props) {
        super(props);
        let query = props.location.query;
        let res = query.fyxzjg;
        if (typeof res == 'string') {
            query = JSON.parse(sessionStorage.getItem('query')).query;
        }
        this.state = {
            fyjgList: [],
            fyjgsxList: [],
            ssjg_dm: '',
            fyjgdList: [],
            yyjgdList: [],
            list: [],
            listKey: [],
            selectedKeys: [],
            query: query,
        }
    }

    componentDidMount() {
        this.getfyJg();
    }

    // componentWillReceiveProps(next) {
    //     if (this.state.query.yyjgdList !== next.yyjgdList) {
    //         this.setState({
    //             fyjgsxList: [],
    //             selectedKeys: [],
    //             list: [],
    //             listKey: [],
    //         });
    //         this.props.form.resetFields();
    //         this.getJgd(next);
    //         this.getfyJg();
    //     }
    // }

    getfyJg = () => {
        this.props.dispatch({
            type: 'SuperviseSetup/getfyJg',
            payload: {
                ssjg_dm: this.state.query.fyxzjg.id,
            },
            callback: res => {
                this.setState({
                    fyjgList: res.data,
                });
            },
        });
    };
    getJgd = next => {
        let list = [];
        next.yyjgdList &&
        next.yyjgdList.map(event => {
            list.push({
                key: event.id,
                title: `${event.jgd_mc}(${
                    event.jglx === '0' ? '告警' : event.jglx === '1' ? '预警' : event.jglx
                    })`,
                description: '',
                disabled: true,
            });
        });
        this.setState({
            list: list,
            listKey: [],
        });
    };
    choiceJg = e => {
        this.getJgd(this.props);
        this.props.form.resetFields(['fyjgsx']);
        this.setState({
            ssjg_dm: e.key,
            listKey: [],
        });
        this.props.dispatch({
            type: 'SuperviseSetup/getfyJgsx',
            payload: {
                ssjg_dm: e.key,
            },
            callback: res => {
                this.setState({
                    fyjgsxList: res.data,
                });
            },
        });
    };
    choiceJgsx = e => {
        let yyjgd = [];
        let list1 = [];
        this.state.query.yyjgdList &&
        this.state.query.yyjgdList.map(event => {
            yyjgd.push({
                key: event.id,
                title: `${event.jgd_mc}(${
                    event.jglx === '0' ? '告警' : event.jglx === '1' ? '预警' : event.jglx
                    })`,
                description: '',
                disabled: true,
            });
        });
        this.setState({
            list: yyjgd,
            listKey: [],
            selectedKeys: [],
        });
        this.props.dispatch({
            type: 'SuperviseSetup/getfyJgd',
            payload: {
                jgsx_dm: e,
                ssjg_dm: this.state.ssjg_dm,
            },
            callback: res => {
                let torf = true;
                res.data.map(event => {
                    if (this.state.query.yyjgdList.length > 0) {
                        this.state.query.yyjgdList.map(e => {
                            if (e.id === event.id || e.jgd_mc === event.jgd_mc) {
                                torf = false;
                            }
                        });
                        if (torf) {
                            yyjgd.push({
                                key: event.id,
                                title: `${event.jgd_mc}(${
                                    event.jglx === '0' ? '告警' : event.jglx === '1' ? '预警' : event.jglx
                                    })`,
                                description: '',
                                disabled: false,
                            });
                            list1.push(event.id);
                        }
                    } else {
                        yyjgd.push({
                            key: event.id,
                            title: `${event.jgd_mc}(${
                                event.jglx === '0' ? '告警' : event.jglx === '1' ? '预警' : event.jglx
                                })`,
                            description: '',
                            disabled: false,
                        });
                        list1.push(event.id);
                    }
                });
                this.setState({
                    fyjgdList: res.data,
                    list: yyjgd,
                    listKey: list1,
                });
            },
        });
    };

    handleChange = (nextTargetKeys, direction, moveKeys) => {
        this.setState({listKey: nextTargetKeys});
    };
    handleOks = () => {
        let ids = [];
        this.state.list.map(res => {
            let torf = false;
            if (this.state.listKey.length > 0) {
                this.state.listKey.map(event => {
                    if (res.key === event || res.disabled) {
                        torf = true;
                    }
                });
                if (!torf) {
                    ids.push(res.key);
                }
            } else {
                if (!res.disabled) {
                    ids.push(res.key);
                }
            }
        });
        if (ids.length > 0) {
            this.props.dispatch({
                type: 'SuperviseSetup/getSaveFy',
                payload: {
                    id: ids.toString(),
                    ssjg_dm: this.state.query.fyxzjg.id,
                    ssjg_mc: this.state.query.fyxzjg.label,
                    sf_qjjg: this.state.query.qjjg ? '1' : '0',
                },
                callback: res => {
                    if (!res.error) {
                        message.success('添加成功');
                        this.onEdit(true);
                    } else {
                        message.warn('操作失败，请重试');
                        return false;
                    }
                },
            });
        } else {
            message.warn('请选择复用监管点');
        }
    };
    handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
        this.setState({selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys]});
    };
    onEdit = (isReset) => {
        let key = '/systemSetup/SuperviseSetup/Copy' + this.state.query.id;
        const {dispatch} = this.props;
        if (dispatch) {
            if (isReset) {
                dispatch(routerRedux.push({
                    pathname: '/systemSetup/SuperviseSetup',
                    query: {isReset, type: '0'},
                }))
            } else {
                dispatch(routerRedux.push({
                    pathname: '/systemSetup/SuperviseSetup/Add',
                    query: {id: '1', record: {type: 0}},
                }))
            }
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
        const rowLayout = {md: 8, xl: 16, xxl: 24};
        const {
            form: {getFieldDecorator},
        } = this.props;
        const modleLayouts = {
            labelCol: {span: 5},
            wrapperCol: {span: 19},
        };
        return (
            <div className={this.props.global && this.props.global.dark ? '' : styles.lightBox}>
                <Card style={{padding: 24, marginBottom: '12px'}} id={'SupCopyform'}>
                    <Form>
                        <Row gutter={rowLayout}>
                            <Col span={6}>
                                <div style={{
                                    color: this.props.global && this.props.global.dark ? '#fff' : '#4d4d4d',
                                    margin: '16px'
                                }}>机构：{this.state.query.fyxzjg.label}</div>
                            </Col>
                            <Col span={9}>
                                <FormItem label="复用机构" {...modleLayouts}>
                                    {getFieldDecorator('fyjg', {})(
                                        <Select
                                            labelInValue
                                            placeholder="请选择"
                                            style={{width: '100%'}}
                                            onChange={e => this.choiceJg(e)}
                                            getPopupContainer={() => document.getElementById('SupCopyform')}
                                        >
                                            {this.state.fyjgList &&
                                            this.state.fyjgList.map(event => {
                                                return <Option value={event.ssjg_dm}>{event.ssjg_mc}</Option>;
                                            })}
                                        </Select>,
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={9}>
                                <FormItem label="监管事项" {...modleLayouts}>
                                    {getFieldDecorator('fyjgsx', {})(
                                        <Select
                                            placeholder="请选择"
                                            style={{width: '100%'}}
                                            onChange={e => this.choiceJgsx(e)}
                                            getPopupContainer={() => document.getElementById('SupCopyform')}
                                        >
                                            {this.state.fyjgsxList &&
                                            this.state.fyjgsxList.map(event => {
                                                return (
                                                    <Option
                                                        value={event.jgsx_dm}
                                                    >{`${event.jgsx_mc}(${event.jglx_mc})`}</Option>
                                                );
                                            })}
                                        </Select>,
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={24} className={styles.transfer}>
                                <Transfer
                                    titles={['已有监管点', '待选监管点']}
                                    operations={['移除', '添加']}
                                    dataSource={this.state.list}
                                    targetKeys={this.state.listKey}
                                    onChange={this.handleChange}
                                    selectedKeys={this.state.selectedKeys}
                                    onSelectChange={this.handleSelectChange}
                                    render={item => item.title}
                                    locale={{
                                        notFoundContent: <Empty
                                            image={this.props.global && this.props.global.dark ? noList : noListLight}
                                            description={'暂无数据'}/>
                                    }}
                                />
                            </Col>
                        </Row>
                    </Form>
                </Card>
                <Card>
                    <div className={styles.btns}>
                        {/*<Button type="primary" style={{marginLeft: 8}} className={styles.qxBtn}*/}
                        {/*        onClick={() => this.onEdit(false)}>*/}
                        {/*    取消*/}
                        {/*</Button>*/}
                        <Button type="primary" style={{marginLeft: 8}} className={styles.okBtn}
                                onClick={this.handleOks}>
                            确定
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }
}
