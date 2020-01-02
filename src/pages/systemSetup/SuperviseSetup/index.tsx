/*
 * 监管配置
 * author：zr
 * 20190313
 * */
import React, {Component, useState, useEffect} from 'react';
import {connect} from 'dva';
import stylescommon1 from '../../common/common.less';
import stylescommon2 from '../../common/commonLight.less';
import styles from './index.less';
import {
    Card,
    Divider,
    Table,
    Button,
    Row,
    Col,
    Select,
    Radio,
    Form,
    DatePicker,
    Modal,
    Menu,
    Dropdown,
    TreeSelect,
    message,
    Checkbox,
    Tag,
    Icon,
    Tooltip,
    Empty,
} from 'antd';
import moment from 'moment';
import {getUserInfos, userAuthorityCode} from '../../../utils/utils';
// import SuperviseCopy from '../../../components/Supervise/SuperviseCopy';
import {routerRedux} from 'dva/router';
import {authorityIsTrue} from '../../../utils/authority';
import noList from '@/assets/viewData/noList.png';
import noListLight from "@/assets/viewData/noListLight.png";

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const TreeNode = TreeSelect.TreeNode;
const Option = Select.Option;
const confirm = Modal.confirm;
const {RangePicker} = DatePicker;

class SuperviseSetup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            current: 1,
            count: 10,
            jg: '',
            jgsx: '',
            jgd: '',
            jgfs: '',
            jgdzt: '',
            jgqx: '',
            addjgqx: '',
            visible: false,
            Fyvisible: false,
            data: null,
            detailBtn: false,
            updateBtn: false,
            fyxzjg: '',
            personList: [],
            yyjgdList: [],
            qjjg: false,
            treeDefaultExpandedKeys: [], // 办案单位树默认展开keys
            searchHeight: false,
            isTJJGD: authorityIsTrue(userAuthorityCode.TIANJIAJIANGUANDIAN), // 添加监管点权限
            isSCJGD: authorityIsTrue(userAuthorityCode.SHANCHUJIANGUANDIAN), // 删除监管点权限
            isUse: '',
            NoticeNote: '', // 监管点具体算法说明
        };
    }

    componentDidMount() {
        this.getJgdList();
        // this.getCommon('500830');//监管事项
        this.getCommon('500800'); //监管点
        this.getCommon('500804'); //时间间隔
        this.getCommon('500820'); //提前时间
        this.getCommon('500808'); //一级颜色
        this.getCommon('500812'); //二级颜色
        this.getCommon('500816'); //三级颜色
        this.getCommon('500852'); //提醒人员
        this.getDepTree(JSON.parse(sessionStorage.getItem('user')).department);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.history.location.query.isReset && nextProps.history.location.pathname === '/systemSetup/SuperviseSetup') {
            this.getJgdList(this.state.pd, nextProps.history.location.query.type === '0' ? 1 : this.state.current);
            this.props.history.replace(nextProps.history.location.pathname);
        }
    }

    //监管点列表展示
    getJgdList = (pd, current) => {
        this.setState({
            loading: true,
        });
        this.props.dispatch({
            type: 'SuperviseSetup/getJgList',
            payload: {
                currentPage: current ? current : this.state.current,
                showCount: this.state.count,
                pd: pd ? pd : {},
            },
            callback: res => {
                this.setState({
                    data: res,
                    loading: false,
                });
            },
        });
    };
    getCommon = pid => {
        this.props.dispatch({
            type: 'common/getDictType',
            payload: {
                appCode: window.configUrl.appCode,
                code: pid,
            },
        });
    };
    getSupervise = pid => {
        if (pid) {
            this.props.dispatch({
                type: 'SuperviseSetup/getDictType',
                payload: {
                    appCode: window.configUrl.appCode,
                    code: pid,
                },
            });
        }
    };

    // 表格分页
    handleTableChange = pagination => {
        this.setState({
            current: pagination.current,
            count: pagination.pageSize,
        });
        this.getJgdList(this.state.pd, pagination.current);
    };
    handleSearch = () => {
        this.props.form.validateFields((err, values) => {
            let pd = {
                jgd_dm: values.jgd && values.jgd.key ? values.jgd.key : '',
                jgdzt_dm: values.jgdzt ? values.jgdzt : '',
                jgqx_js: values.jgqx[1] ? moment(values.jgqx[1]).format('YYYY-MM-DD') : '',
                jgqx_ks: values.jgqx[0] ? moment(values.jgqx[0]).format('YYYY-MM-DD') : '',
                jgsx_dm: values.jgsx && values.jgsx.key ? values.jgsx.key : '',
                ssjg_dm: values.jg ? JSON.parse(values.jg).id : '',
                jglx: values.jglx ? values.jglx : '',
            };
            this.setState({
                pd: pd,
            });
            this.getJgdList(pd, 1);
        });
    };
    handleFormReset = () => {
        this.setState({
            pd: {},
        });
        this.props.form.resetFields();
        this.props.SuperviseSetup.SuperviseSetup.JgdType = [];
        this.props.SuperviseSetup.common.JgsxType = [];
        this.handleSearch();
    };
    getChoisePerson = (resSfz, resName) => {
        let person = [];
        if (resSfz && resSfz.length > 0) {
            resSfz.split(',').map((event, idx) => {
                person.push({key: event, label: resName.split(',')[idx]});
            });
        }
        return person;
    };
    addList = (type, reson) => {
        reson.type = type;
        let res = reson;
        this.props.history.replace("/");
        this.props.dispatch(
            routerRedux.push({
                pathname: type === 0 ? '/systemSetup/SuperviseSetup/Add' : type === 2 ? '/systemSetup/SuperviseSetup/Update' : '/systemSetup/SuperviseSetup/Detail',
                query: {id: reson && reson.id ? reson.id : '1', record: res},
            }),
        );
    };
    handleCancel = () => {
        this.props.form.validateFields((err, values) => {
            if (values.jglx && values.jglx === '0') {
                this.getCommon('500830'); //告警监管事项
            } else if (values.jglx && values.jglx === '1') {
                this.getCommon('500772'); //预警监管事项
            } else {
                this.props.SuperviseSetup.common.JgsxType = [];
            }
            if (values.jgsx) {
                this.getSupervise(
                    values.jgsx.key === '5008301'
                        ? '2068'
                        : values.jgsx.key === '5008302'
                        ? '2016'
                        : values.jgsx.key === '5008303'
                            ? '3'
                            : values.jgsx.key === '5008304'
                                ? '2017'
                                : values.jgsx.key === '5008305'
                                    ? '6001'
                                    : values.jgsx.key === '5008306'
                                        ? '5007725'
                                        : values.jgsx.key,
                );
            } else {
                this.props.SuperviseSetup.SuperviseSetup.JgdType = [];
            }
        });
        this.setState({
            visible: false,
        });
    };
    handleCancels = () => {
        this.setState({
            Fyvisible: false,
            visible: true,
        });
    };
    handleMenuClick = e => {
        this.setState({
            xsys1: e.key,
        });
    };
    handleMenuClick2 = e => {
        this.setState({
            xsys2: e.key,
        });
    };
    handleMenuClick3 = e => {
        this.setState({
            xsys3: e.key,
        });
    };
    changeJglx = e => {
        this.props.form.resetFields([
            'addjgsx',
            'addjgd',
            'addjgqx',
            'addtxjg',
            'dyctxry1',
            'dyctxry2',
            'dyctxry3',
            'dyjtxry1',
            'dyjtxry2',
            'dyjtxry3',
            'tqsj1',
            'tqsj2',
            'tqsj3',
        ]);
        this.props.SuperviseSetup.SuperviseSetup.JgdType = [];
        this.getClear();
        this.setState({
            jgdDm: null,
            jgdMc: null,
            tqsj1: null,
            tqsj2: null,
            tqsj3: null,
            NoticeNote: null,
        });
        if (e.target.value === '0') {
            this.getCommon('500830'); //告警监管事项
        } else {
            this.getCommon('500772'); //预警监管事项
        }
        this.setState({
            addjglx: e.target.value,
        });
    };
    changeJglx1 = e => {
        this.props.form.resetFields(['jgsx', 'jgd']);
        this.props.SuperviseSetup.SuperviseSetup.JgdType = [];
        this.props.SuperviseSetup.common.JgsxType = [];
        this.setState({
            jgdDm: null,
            jgdMc: null,
            dyjtxry1: [],
            dyjtxry2: [],
            dyjtxry3: [],
            dyctxry1: [],
            dyctxry2: [],
            dyctxry3: [],
            tqsj1: null,
            tqsj2: null,
            tqsj3: null,
            NoticeNote: null,
        });
        if (e === '0') {
            this.getCommon('500830'); //告警监管事项
        } else if (e === '1') {
            this.getCommon('500772'); //预警监管事项
        }
    };
    del = (id, modleType) => {
        this.handleCancel();
        let that = this;
        confirm({
            title: '确认删除该监管点？',
            content: null,
            okText: '确定',
            cancelText: '取消',
            centered: true,
            getContainer: document.getElementById('box'),
            onOk() {
                that.props.dispatch({
                    type: 'SuperviseSetup/getdelJgd',
                    payload: {
                        id: id,
                    },
                    callback: res => {
                        if (!res.error) {
                            message.success('删除成功');
                            let keyList = ['/systemSetup/SuperviseSetup/Detail','/systemSetup/SuperviseSetup/Update'];
                            keyList.map((url)=>{
                                let key = url + id;
                                const { dispatch } = that.props;
                                if (dispatch) {
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
                            })
                            that.getJgdList(that.state.pd, that.state.current);
                        } else {
                            message.warn('操作失败，请重试');
                        }
                    },
                });
            },
            onCancel() {
                if (modleType && modleType === 1) {
                    that.setState({
                        visible: true,
                    });
                }
            },
        });
    };
    getJgd = e => {
        this.props.form.resetFields([
            'addjgd',
            'addjgqx',
            'addtxjg',
            'dyctxry1',
            'dyctxry2',
            'dyctxry3',
            'dyjtxry1',
            'dyjtxry2',
            'dyjtxry3',
            'tqsj1',
            'tqsj2',
            'tqsj3',
            'jgd',
        ]);
        this.props.SuperviseSetup.SuperviseSetup.JgdType = [];
        this.setState({
            jgdDm: null,
            jgdMc: null,
            NoticeNote: null,
        });
        this.getSupervise(
            e.key === '5008301'
                ? '2068'
                : e.key === '5008302'
                ? '2016'
                : e.key === '5008303'
                    ? '3'
                    : e.key === '5008304'
                        ? '2017'
                        : e.key === '5008305'
                            ? '6001'
                            : e.key === '5008306'
                                ? '5007725'
                                : e.key,
        );
    };
    // 获取机构树
    getDepTree = area => {
        const areaNum = [];
        if (area) {
            areaNum.push(area);
        }
        this.props.dispatch({
            type: 'common/getDepTree',
            payload: {
                departmentNum: areaNum,
            },
            callback: data => {
                if (data) {
                    let obj = {
                        id: data[0].code,
                        label: data[0].name,
                    };
                    let objStr = JSON.stringify(obj);
                    this.setState({
                        treeDefaultExpandedKeys: [objStr],
                    });
                }
            },
        });
    };
    // 渲染机构树
    renderloop = data =>
        data.map(item => {
            let obj = {
                id: item.code,
                label: item.name,
            };
            let objStr = JSON.stringify(obj);
            if (item.childrenList && item.childrenList.length) {
                return (
                    <TreeNode value={objStr} key={objStr} title={item.name}>
                        {this.renderloops(item.childrenList)}
                    </TreeNode>
                );
            }
            // return <TreeNode key={objStr} value={objStr} title={item.name}/>;
        });
    renderloops = data =>
        data.map(item => {
            if (item.code && item.code.substring(6) === '000000') {
                let obj = {
                    id: item.code,
                    label: item.name,
                };
                let objStr = JSON.stringify(obj);
                return <TreeNode key={objStr} value={objStr} title={item.name}/>;
            }
        });
    //清空事项
    getClear = () => {
        this.setState({
            res: null,
            xsys1: this.props.SuperviseSetup.common.ColorType1[0]
                ? this.props.SuperviseSetup.common.ColorType1[0].name
                : '',
            xsys2: this.props.SuperviseSetup.common.ColorType2[0]
                ? this.props.SuperviseSetup.common.ColorType2[0].name
                : '',
            xsys3: this.props.SuperviseSetup.common.ColorType3[0]
                ? this.props.SuperviseSetup.common.ColorType3[0].name
                : '',
            dyjtxry1: [],
            dyjtxry2: [],
            dyjtxry3: [],
            dyctxry1: [],
            dyctxry2: [],
            dyctxry3: [],
        });
    };
    getTqsj = (e, tqsj) => {
        this.state[tqsj] = e;
    };
    // 导出
    exportData = () => {
        const {formValues} = this.state;
        this.props.dispatch({
            type: 'common/exportData',
            payload: {
                tableType: '33',
                ...formValues,
            },
            callback: data => {
                if (data.text) {
                    message.error(data.text);
                } else {
                    window.open(window.configUrl.serverUrl + data.url);
                }
            },
        });
    };
    disabledEndDate = current => current && current < moment().startOf('day');
    onChangeQjjg = e => {
        this.setState({
            qjjg: e.target.checked,
            fs_qjjg: e.target.checked,
        });
    };
    // 启用禁用功能切换
    accessUse = (record, obj) => {
        let that = this;
        this.props.dispatch({
            type: 'SuperviseSetup/changeJgPzXx',
            payload: {
                scbj: obj,
                id: record.id,
            },
            callback: res => {
                if (!res.error) {
                    // this.handleCancel();
                    message.success('修改成功');
                    if(obj === '0'){
                        let key = '/systemSetup/SuperviseSetup/Update' + record.id;
                        const { dispatch } = that.props;
                        if (dispatch) {
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
                        record.scbj = obj;
                        this.getChangeDetail(record);
                    }
                    this.getJgdList(this.state.pd, this.state.current);
                } else {
                    message.warn('操作失败，请重试');
                }
            },
        });
    };
    getChangeDetail = (payload) =>{
        this.props.dispatch({
            type: 'SuperviseSetup/getResetId',
            payload: {
                isReset: !this.props.SuperviseSetup.SuperviseSetup.isReset,
                detail: payload,
            },
        });
    }
    getSearchHeight = () => {
        this.setState({
            searchHeight: !this.state.searchHeight,
        });
    };

    render() {
        let stylescommon = this.props.SuperviseSetup.global.dark ? stylescommon1 : stylescommon2;
        const {
            form: {getFieldDecorator},
            SuperviseSetup: {
                common: {
                    JgsxType,
                    JgdztType,
                    depTree,
                    SjjgType,
                    TqsjType,
                    ColorType1,
                    ColorType2,
                    ColorType3,
                    TxryType,
                },
                SuperviseSetup: {JgdType},
            },
        } = this.props;
        const {isTJJGD, isSCJGD} = this.state;
        const paginationProps = {
            current: this.state.data && this.state.data.page ? this.state.data.page.currentPage : '',
            total: this.state.data && this.state.data.page ? this.state.data.page.totalResult : '',
            pageSize: this.state.data && this.state.data.page ? this.state.data.page.showCount : '',
            showTotal: (total, range) => (
                <span className={stylescommon.pagination}>{`共 ${
                    this.state.data && this.state.data.page ? this.state.data.page.totalPage : 1
                    } 页，${
                    this.state.data && this.state.data.page ? this.state.data.page.totalResult : 0
                    } 条数据 `}</span>
            ),
        };
        const columns = [
            {
                title: '监管点',
                dataIndex: 'jgd_mc',
                render: (text, record) => {
                    return (
                        text ?
                            <div>
                                <span>{text}</span>
                                <Tooltip title={record.lxsm}><Icon type="info-circle"
                                                                   className={styles.lxsm}/></Tooltip>
                            </div>
                            :
                            ''
                    )
                },
            },
            {
                title: '监管类型',
                render: (record) => (
                    <div>{record.jglx === '0' ? '告警' : record.jglx === '1' ? '预警' : record.jglx}</div>),
            },
            {
                title: '所属机构',
                dataIndex: 'ssjg_mc',
            },
            {
                title: '监管事项',
                dataIndex: 'jgsx_mc',
            },
            {
                title: '监管期限',
                // render: (record) => (<div>{record.jgqx_ks}至{record.jgqx_js}</div>),
                render: (text, record) => {
                    return (
                        record.jgqx_ks && record.jgqx_js ?
                            <div>{record.jgqx_ks} 至 {record.jgqx_js}</div>
                            :
                            ''
                    )
                },
            },
            {
                title: '监管状态',
                render: (record) => (<Tag
                    color={record.jgdzt_dm === '5008002'&&record.scbj==='1' ? record.sf_qy && record.sf_qy === '1' ? '#00cc00' : '#EE5655' : '#ccc'}>{record.jgdzt_mc}</Tag>),
            },
            {
                title: '操作',
                render: (record) => (
                    <div>
                        {
                            record.scbj === '1' ?
                                <a onClick={() => this.accessUse(record, '0')}>禁用</a>
                                :
                                <a onClick={() => this.accessUse(record, '1')}>启用</a>
                        }
                        <Divider type="vertical"/>
                        <a onClick={() => this.addList(1, record)}>详情</a>
                        <Divider type="vertical"/>
                        {
                            record.scbj === '1' ?
                                <a onClick={() => this.addList(2, record)}>修改</a>
                                :
                                <span style={{color: '#C3C3C3'}}>修改</span>
                        }
                        {isSCJGD ?
                            <span>
                            <Divider type="vertical"/>
                                {
                                    record.scbj === '1' ?
                                        <a onClick={() => this.del(record.id)}>删除</a>
                                        :
                                        <span style={{color: '#C3C3C3'}}>删除</span>
                                }
                          </span>
                            : null
                        }
                    </div>
                ),
            },
        ];
        const formItemLayout = {
            labelCol: {xs: {span: 24}, md: {span: 8}, xl: {span: 6}, xxl: {span: 5}},
            wrapperCol: {xs: {span: 24}, md: {span: 16}, xl: {span: 18}, xxl: {span: 19}},
        };
        const rowLayout = {md: 8, xl: 16, xxl: 24};
        const colLayout = {sm: 24, md: 12, xl: 8};
        const colLayouts = {sm: 24, md: 12, xl: 16, xxl: 24};
        const modleLayouts = {
            labelCol: {span: 8},
            wrapperCol: {span: 14},
        };
        const modleLayout = {
            labelCol: {span: 9},
            wrapperCol: {span: 12},
        };
        const modleLayoutjg = {
            labelCol: {span: 7},
            wrapperCol: {span: 14},
        };
        const modleLayoutsqx = {
            labelCol: {span: 7},
            wrapperCol: {span: 15},
        };
        const modleLayoutColor = {
            labelCol: {span: 14},
            wrapperCol: {span: 10},
        };
        const menu = (
            <Menu onClick={this.handleMenuClick}>
                {ColorType1 &&
                ColorType1.map(event => {
                    return (
                        <Menu.Item style={{padding: '5px 4px'}} key={event.name}>
                            <div style={{width: '20px', height: '20px', background: `${event.name}`}}></div>
                        </Menu.Item>
                    );
                })}
            </Menu>
        );
        const menu2 = (
            <Menu onClick={this.handleMenuClick2}>
                {ColorType2 &&
                ColorType2.map(event => {
                    return (
                        <Menu.Item style={{padding: '5px 4px'}} key={event.name}>
                            <div style={{width: '20px', height: '20px', background: `${event.name}`}}></div>
                        </Menu.Item>
                    );
                })}
            </Menu>
        );
        const menu3 = (
            <Menu onClick={this.handleMenuClick3}>
                {ColorType3 &&
                ColorType3.map(event => {
                    return (
                        <Menu.Item style={{padding: '5px 4px'}} key={event.name}>
                            <div style={{width: '20px', height: '20px', background: `${event.name}`}}></div>
                        </Menu.Item>
                    );
                })}
            </Menu>
        );
        return (
            <div className={stylescommon.statistics} id={'messageBox'}>
                <Card className={stylescommon.titleArea}>
                    {isTJJGD ? (
                        <Button type="primary" onClick={() => this.addList(0, {})}>
                            添加监管点
                        </Button>
                    ) : (
                        ''
                    )}
                    <div className={styles.btnAdd}>
                        <Button onClick={this.exportData} icon="download">
                            导出表格
                        </Button>
                    </div>
                </Card>
                <Card className={stylescommon.cardArea} id={'Superviseform'} style={{padding: '10px 0'}}>
                    <Form style={{height: this.state.searchHeight ? 'auto' : '50px'}}>
                        <Row gutter={rowLayout} className={stylescommon.searchForm}>
                            <Col {...colLayout}>
                                <FormItem label="机构" {...formItemLayout}>
                                    {getFieldDecorator('jg', {
                                        // initialValue: this.state.jg,
                                    })(
                                        <TreeSelect
                                            showSearch
                                            style={{width: '100%'}}
                                            dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                                            placeholder="请选择机构"
                                            allowClear
                                            treeDefaultExpandedKeys={this.state.treeDefaultExpandedKeys}
                                            key="badwSelect"
                                            treeNodeFilterProp="title"
                                            getPopupContainer={() => document.getElementById('Superviseform')}
                                        >
                                            {depTree && depTree.length > 0 ? this.renderloop(depTree) : null}
                                        </TreeSelect>,
                                    )}
                                </FormItem>
                            </Col>
                            <Col {...colLayout}>
                                <FormItem label="监管类型" {...formItemLayout}>
                                    {getFieldDecorator('jglx', {
                                        initialValue: '',
                                    })(
                                        <Select
                                            placeholder="请选择"
                                            style={{width: '100%'}}
                                            onChange={this.changeJglx1}
                                            getPopupContainer={() => document.getElementById('Superviseform')}
                                        >
                                            <Option value={''}>全部</Option>
                                            <Option value={'0'}>告警</Option>
                                            <Option value={'1'}>预警</Option>
                                        </Select>,
                                    )}
                                </FormItem>
                            </Col>
                            <Col {...colLayout}>
                                <FormItem label="监管事项" {...formItemLayout}>
                                    {getFieldDecorator('jgsx', {
                                        initialValue: {key: '', name: ''},
                                    })(
                                        <Select
                                            labelInValue
                                            placeholder="请选择"
                                            style={{width: '100%'}}
                                            onChange={e => this.getJgd(e)}
                                            getPopupContainer={() => document.getElementById('Superviseform')}
                                        >
                                            <Option value="">全部</Option>
                                            {JgsxType &&
                                            JgsxType.map(event => {
                                                return <Option value={event.code}>{event.name}</Option>;
                                            })}
                                        </Select>,
                                    )}
                                </FormItem>
                            </Col>
                            <Col {...colLayout}>
                                <FormItem label="监管点" {...formItemLayout}>
                                    {getFieldDecorator('jgd', {
                                        initialValue: {key: '', name: ''},
                                    })(
                                        <Select
                                            labelInValue
                                            placeholder="请选择"
                                            style={{width: '100%'}}
                                            getPopupContainer={() => document.getElementById('Superviseform')}
                                        >
                                            <Option value="">全部</Option>
                                            {JgdType &&
                                            JgdType.map(event => {
                                                return <Option value={event.code}>{event.name}</Option>;
                                            })}
                                        </Select>,
                                    )}
                                </FormItem>
                            </Col>
                            <Col {...colLayout}>
                                <FormItem label="监管点状态" {...formItemLayout}>
                                    {getFieldDecorator('jgdzt', {
                                        initialValue: '',
                                    })(
                                        <Select
                                            placeholder="请选择"
                                            style={{width: '100%'}}
                                            getPopupContainer={() => document.getElementById('Superviseform')}
                                        >
                                            <Option value="">全部</Option>
                                            {JgdztType &&
                                            JgdztType.map(event => {
                                                return <Option value={event.code}>{event.name}</Option>;
                                            })}
                                        </Select>,
                                    )}
                                </FormItem>
                            </Col>
                            <Col {...colLayout}>
                                <FormItem label="监管期限" {...formItemLayout}>
                                    {getFieldDecorator('jgqx', {
                                        initialValue: this.state.jgqx,
                                    })(
                                        <RangePicker
                                            style={{width: '100%'}}
                                            getCalendarContainer={() => document.getElementById('Superviseform')}
                                        />,
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row className={stylescommon.search}>
              <span style={{float: 'right', marginBottom: 24}}>
                <Button style={{marginLeft: 8}} type="primary" onClick={this.handleSearch}>
                  查询
                </Button>
                <Button
                    style={{marginLeft: 8}}
                    onClick={this.handleFormReset}
                    className={stylescommon.empty}
                >
                  重置
                </Button>
                <Button
                    style={{marginLeft: 8}}
                    onClick={this.getSearchHeight}
                    className={stylescommon.empty}
                >
                  {this.state.searchHeight ? '收起筛选' : '展开筛选'}{' '}
                    <Icon type={this.state.searchHeight ? 'up' : 'down'}/>
                </Button>
              </span>
                        </Row>
                    </Form>
                </Card>
                <Card className={stylescommon.cardArea} id={'box'}>
                    <Table
                        loading={this.state.loading}
                        rowKey={record => record.id}
                        pagination={paginationProps}
                        onChange={this.handleTableChange}
                        columns={columns}
                        dataSource={this.state.data ? this.state.data.list : []}
                        locale={{
                            emptyText: <Empty image={this.props.SuperviseSetup.global.dark ? noList : noListLight}
                                              description={'暂无数据'}/>
                        }}
                    />
                </Card>
                {/*<SuperviseCopy*/}
                {/*  qjjg={this.state.qjjg}*/}
                {/*  Fyvisible={this.state.Fyvisible}*/}
                {/*  fyxzjg={this.state.fyxzjg}*/}
                {/*  yyjgdList={this.state.yyjgdList}*/}
                {/*  handleCancels={this.handleCancels}*/}
                {/*  handleSuccess={this.handleSuccess}*/}
                {/*/>*/}
            </div>
        );
    }
}

export default Form.create()(
    connect((SuperviseSetup, common, global) => ({SuperviseSetup, common, global}))(SuperviseSetup),
);
