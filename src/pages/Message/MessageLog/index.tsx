
/*
*  MessagePushLog.js 消息推送日志
* author：lyp
* 20190617
* */

import React, { Component } from 'react';
import { connect } from 'dva';
import {Row, Col, DatePicker, Table, Tabs, Form, Select, TreeSelect, Button, Radio, message, Card, Icon} from 'antd';
import moment from 'moment';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import stylescommon from '../../common/common.less';
// import MessagePushLogModal from './MessagePushLogModal';
import styles from './index.less';
import { exportListDataMaxDays, tableList } from '../../../utils/utils';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const TabPane = Tabs.TabPane;
const TreeNode = TreeSelect.TreeNode;

let timeout;
let currentValue;

class MessageLog extends Component {
    state = {
        arrayDetail: [], // tab内容
        allPolice: [],
        activeKey: '0', // 默认显示tab
        logDetailVisible: false, // 日志详情modal
        logDetail: null, // 日志详情
        formValues: {}, // 查询条件
        userOrgCode: JSON.parse(sessionStorage.getItem('user')) ? JSON.parse(sessionStorage.getItem('user')).department : '',
        treeDefaultExpandedKeys: [], // 办案单位树默认展开keys
    };

    componentDidMount() {
        this.getDepTree(this.state.userOrgCode);
        this.getPushMattersDict();
        this.getPushTypeDict();
        this.getPushWayDict();
        this.handleSearch();
    }

    // 获取日志列表
    getMessagePushLogList = (param) => {
        this.props.dispatch({
            type: 'messagePushLog/getMessagePushLogList',
            payload: param ? param : '',
        });
    };
    // 获取推送事项字典
    getPushMattersDict = () => {
        this.props.dispatch({
            type: 'common/getDictType',
            payload: {
                currentPage: 1,
                pd: {
                    pid: '2032',
                },
                showCount: 999,
            },
        });
    };
    // 获取推送类型字典
    getPushTypeDict = () => {
        this.props.dispatch({
            type: 'common/getDictType',
            payload: {
                currentPage: 1,
                pd: {
                    pid: '500967',
                },
                showCount: 999,
            },
        });
    };
    // 获取推送方式字典
    getPushWayDict = () => {
        this.props.dispatch({
            type: 'common/getDictType',
            payload: {
                currentPage: 1,
                pd: {
                    pid: '500971',
                },
                showCount: 999,
            },
        });
    };

    // 获取机构树
    getDepTree = (area) => {
        const areaNum = [];
        if (area) {
            areaNum.push(area);
        }
        this.props.dispatch({
            type: 'common/getDepTree',
            payload: {
                departmentNum: areaNum,
            },
            callback: (data) => {
                if (data) {
                    this.setState({
                        treeDefaultExpandedKeys: [data[0].code],
                    });
                }
            },
        });
    };
    // 获取所有警员
    getAllPolice = (name) => {
        const that = this;
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
        currentValue = name;
        timeout = setTimeout(() => {

            that.props.dispatch({
                type: 'common/getAllPolice',
                payload: {
                    name,
                },
                callback: (data) => {
                    if (data && (currentValue === name)) {
                        that.setState({
                            allPolice: data.slice(0, 50),
                        });
                    }
                },
            });
        }, 300);

    };

    // 关闭页面链接的函数
    remove = (targetKey) => {
        let { activeKey } = this.state;
        let lastIndex;
        this.state.arrayDetail.forEach((pane, i) => {
            if (pane.key === targetKey) {
                if (i === 0) {
                    lastIndex = 0;
                } else {
                    lastIndex = i - 1;
                }
            }
        });
        const panes = this.state.arrayDetail.filter(pane => pane.key !== targetKey);
        if (panes.length > 0) {
            if (lastIndex >= 0 && activeKey === targetKey) {
                activeKey = panes[lastIndex].key;
            }
            this.setState({
                arrayDetail: panes,
                activeKey,
            });
        } else {
            this.setState({
                arrayDetail: panes,
                activeKey: '0',
            });
        }
    };
    // 打开新的详情页面
    newDetail = (addDetail) => {
        let newDetail = [];
        let isDetail = true;
        newDetail = [...this.state.arrayDetail];
        for (let a = 0; a < newDetail.length; a++) {
            if (addDetail.key === newDetail[a].key) {
                isDetail = false;
            }
        }
        if (isDetail) {
            newDetail.push(addDetail);
            this.setState({
                arrayDetail: newDetail,
                activeKey: addDetail.key,
            });
        } else {
            this.setState({
                activeKey: addDetail.key,
            });
        }

    };
    // 无法选择的日期
    disabledDate = (current) => {
        // Can not select days before today and today
        return current && current.valueOf() > Date.now();
    };
    // 表格分页
    handleTableChange = (pagination) => {
        const { formValues } = this.state;
        const params = {
            pd: {
                ...formValues,
            },
            currentPage: pagination.current,
            showCount: pagination.pageSize,
        };
        this.getMessagePushLogList(params);
    };
    // 查询
    handleSearch = (e) => {
        if (e) e.preventDefault();
        const values = this.props.form.getFieldsValue();
        const tssjTime = values.tssj;
        const formValues = {
            jsdw_dm: values.jsjg || '',
            jsr: values.jsr || '',
            tslx_dm: values.tslx || '',
            tsfs_dm: values.tsfs || '',
            tssx_dm: values.tssx || '',
            tssj_ks: tssjTime && tssjTime.length > 0 ? tssjTime[0].format('YYYY-MM-DD') : '',
            tssj_js: tssjTime && tssjTime.length > 0 ? tssjTime[1].format('YYYY-MM-DD') : '',
        };
        this.setState({
            formValues,
        });
        const params = {
            currentPage: 1,
            showCount: tableList,
            pd: {
                ...formValues,
            },
        };
        this.getMessagePushLogList(params);
    };
    // 重置
    handleFormReset = () => {
        this.props.form.resetFields();
        this.handleSearch();
    };
    // 导出
    exportData = () => {
        const values = this.props.form.getFieldsValue();
        const tssjTime = values.tssj;
        const formValues = {
            jsdw_dm: values.jsjg || '',
            jsr: values.jsr || '',
            tslx_dm: values.tslx || '',
            tsfs_dm: values.tsfs || '',
            tssx_dm: values.tssx || '',
            tssj_ks: tssjTime && tssjTime.length > 0 ? tssjTime[0].format('YYYY-MM-DD') : '',
            tssj_js: tssjTime && tssjTime.length > 0 ? tssjTime[1].format('YYYY-MM-DD') : '',
        };
        if (tssjTime && tssjTime.length > 0) {
            const isAfterDate = moment(formValues.tssj_js).isAfter(moment(formValues.tssj_ks).add(exportListDataMaxDays, 'days'));
            if (isAfterDate) { // 选择时间间隔应小于exportListDataMaxDays
                message.warning(`日期间隔需小于${exportListDataMaxDays}天`);
            } else {
                this.props.dispatch({
                    type: 'common/exportData',
                    payload: {
                        tableType: '37',
                        ...formValues,
                    },
                    callback: (data) => {
                        if (data.text) {
                            message.error(data.text);
                        } else {
                            window.open(configUrl.serverUrl + data.url);
                        }
                    },
                });
            }
        } else {
            message.warning(`请选择需要导出的数据日期，日期间隔需小于${exportListDataMaxDays}天`);
        }

    };

    handleAllPoliceOptionChange = (value) => {
        this.getAllPolice(value);
    };

    // 展示日志详情
    showLogDetail = (record) => {
        this.setState({
            logDetail: record,
        }, () => {
            this.showLogDetailVisible(true);
        });
    };
    // 显示、关闭日志详情modal
    showLogDetailVisible = (visible) => {
        this.setState({
            logDetailVisible: !!visible,
        });
    };
    // 渲染机构树
    renderloop = data => data.map((item) => {
        if (item.childrenList && item.childrenList.length) {
            return <TreeNode value={item.code} key={item.code}
                             title={item.name}>{this.renderloop(item.childrenList)}</TreeNode>;
        }
        return <TreeNode key={item.code} value={item.code} title={item.name}/>;
    });

    onChange = (activeKey) => {
        this.setState({
            activeKey,
        });
    };
    // 关闭页面
    onEdit = (targetKey, action) => {
        this[action](targetKey);  // this.remove(targetKey);
    };
    getSearchHeight = () => {
        this.setState({
            searchHeight:!this.state.searchHeight
        });
    }
    renderForm() {
        console.log('this.props===========>',this.props)
        const { form: { getFieldDecorator }, common: {common: { depTree, pushMattersDict, pushTypeDict, pushWayDict }} } = this.props;
        const allPoliceOptions = this.state.allPolice.map(d => <Option key={`${d.idcard},${d.pcard}`}
                                                                       value={`${d.idcard},${d.pcard}$$`}
                                                                       title={d.name}>{`${d.name} ${d.pcard}`}</Option>);
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, md: { span: 8 }, xl: { span: 6 }, xxl: { span: 4 } },
            wrapperCol: { xs: { span: 24 }, md: { span: 16 }, xl: { span: 18 }, xxl: { span: 20 } },
        };
        const rowLayout = { md: 8, xl: 16, xxl: 24 };
        const colLayout = { sm: 24, md: 12, xl: 8 };
        const pushMattersDictOptions = [];
        const pushTypeDictOptions = [];
        const pushWayDictOptions = [];
        if (pushMattersDict&&pushMattersDict.length > 0) {
            for (let i = 0; i < pushMattersDict.length; i++) {
                const item = pushMattersDict[i];
                pushMattersDictOptions.push(
                    <Option key={item.id} value={item.code}>{item.name}</Option>,
                );
            }
        }
        if (pushTypeDict&&pushTypeDict.length > 0) {
            for (let i = 0; i < pushTypeDict.length; i++) {
                const item = pushTypeDict[i];
                pushTypeDictOptions.push(
                    <Radio key={item.id} value={item.code}>{item.name}</Radio>,
                );
            }
        }
        if (pushWayDict&&pushWayDict.length > 0) {
            for (let i = 0; i < pushWayDict.length; i++) {
                const item = pushWayDict[i];
                pushWayDictOptions.push(
                    <Radio key={item.id} value={item.code}>{item.name}</Radio>,
                );
            }
        }

        return (
            <Card  className={stylescommon.listPageWrap} id={'form'}>
                <Form onSubmit={this.handleSearch} style={{height:this.state.searchHeight ?  'auto' : '50px'}}>
                <Row gutter={rowLayout}  className={stylescommon.searchForm}>
                    <Col {...colLayout}>
                        <FormItem label="接收机构" {...formItemLayout}>
                            {getFieldDecorator('jsjg', {
                                // initialValue: this.state.bardw,
                            })(
                                <TreeSelect
                                    showSearch
                                    style={{ width: '100%' }}
                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                    placeholder="请选择接收机构"
                                    allowClear
                                    key='jsdwSelect'
                                    treeDefaultExpandedKeys={this.state.treeDefaultExpandedKeys}
                                    treeNodeFilterProp="title"
                                    getPopupContainer={() => document.getElementById('form')}
                                >
                                    {depTree && depTree.length > 0 ? this.renderloop(depTree) : null}
                                </TreeSelect>,
                            )}
                        </FormItem>
                    </Col>
                    <Col {...colLayout}>
                        <FormItem label="&nbsp;&nbsp;&nbsp; 接收人" {...formItemLayout}>
                            {getFieldDecorator('jsr', {
                                // initialValue: this.state.gzry,
                                rules: [{ max: 32, message: '最多输入32个字！' }],
                            })(
                                <Select
                                    mode="combobox"
                                    defaultActiveFirstOption={false}
                                    optionLabelProp='title'
                                    showArrow={false}
                                    filterOption={false}
                                    placeholder="请输入接收人"
                                    onChange={this.handleAllPoliceOptionChange}
                                    onFocus={this.handleAllPoliceOptionChange}
                                    getPopupContainer={() => document.getElementById('form')}
                                >
                                    {allPoliceOptions}
                                </Select>,
                            )}
                        </FormItem>
                    </Col>
                    <Col {...colLayout}>
                        <FormItem label="推送时间" {...formItemLayout}>
                            {getFieldDecorator('tssj', {
                                // initialValue: this.state.ssbaq,
                            })(
                                <RangePicker
                                    disabledDate={this.disabledDate}
                                    style={{ width: '100%' }}
                                    getCalendarContainer={() => document.getElementById('form')}
                                />,
                            )}
                        </FormItem>
                    </Col>
                    <Col {...colLayout}>
                        <FormItem label="推送类型" {...formItemLayout}>
                            {getFieldDecorator('tslx', {
                                initialValue: '',
                            })(
                                <Radio.Group onChange={this.onRadioChange}>
                                    <Radio value=''>全部</Radio>
                                    {pushTypeDictOptions}
                                </Radio.Group>,
                            )}
                        </FormItem>
                    </Col>
                    <Col {...colLayout}>
                        <FormItem label="推送方式" {...formItemLayout}>
                            {getFieldDecorator('tsfs', {
                                initialValue: '',
                            })(
                                <Radio.Group onChange={this.onRadioChange}>
                                    <Radio value=''>全部</Radio>
                                    {pushWayDictOptions}
                                </Radio.Group>,
                            )}
                        </FormItem>
                    </Col>
                    <Col {...colLayout}>
                        <FormItem label="推送事项" {...formItemLayout}>
                            {getFieldDecorator('tssx', {
                                // initialValue: this.state.gzry,
                                rules: [{ max: 32, message: '最多输入32个字！' }],
                            })(
                                <Select placeholder="请选择推送事项" style={{ width: '100%' }}  getPopupContainer={() => document.getElementById('form')}>
                                    <Option value="">全部</Option>
                                    {pushMattersDictOptions}
                                </Select>,
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row className={stylescommon.search}>
                    <span style={{ float: 'right', marginBottom: 24 }}>
                          <Button style={{ marginLeft: 8 }} type="primary" onClick={this.handleSearch}>
                            查询
                          </Button>
                          <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset} className={stylescommon.empty}>
                            重置
                          </Button>
                          <Button style={{ marginLeft: 8 }} onClick={this.getSearchHeight} className={stylescommon.empty}>
                              {this.state.searchHeight ? '收起筛选' : '展开筛选'} <Icon type={this.state.searchHeight ? "up" :"down"}/>
                          </Button>
                        </span>
                </Row>
            </Form>
            </Card>
        );
    }

    render() {
        console.log('this.props----->',this.props.common.messagePushLog)
        const { arrayDetail: newAddDetail, activeKey, logDetailVisible, logDetail } = this.state;
        const {common: {messagePushLog: { data }, loading} } = this.props;
        console.log('data=====>',data)
        const columns = [
            {
                title: '问题类型',
                dataIndex: 'wtlx_mc',
            }, {
                title: '推送事项',
                dataIndex: 'tssx_mc',
            }, {
                title: '推送类型',
                dataIndex: 'tslx_mc',
            }, {
                title: '接收单位',
                dataIndex: 'jsdw_mc',
                render: (text) => {
                    return <Ellipsis length={20} tooltip>{text}</Ellipsis>;
                },
            }, {
                title: '接收人',
                dataIndex: 'jsr',
                render: (text) => {
                    return <Ellipsis length={20} tooltip>{text}</Ellipsis>;
                },
            }, {
                title: '推送时间',
                dataIndex: 'tssj',
            }, {
                title: '推送方式',
                dataIndex: 'tsfs_mc',
            }, {
                title: '推送结果',
                dataIndex: 'tsjg',
            }, {
                title: '操作',
                render: (text, record) => {
                    return <a onClick={() => this.showLogDetail(record)}>详情</a>;
                },
            },
        ];
        const paginationProps = {
            current: data&&data.page ? data.page.currentPage : '',
            total: data&&data.page ? data.page.totalResult : '',
            pageSize: data&&data.page ? data.page.showCount : '',
            showTotal: (total, range) => (
                <span className={stylescommon.pagination}>{`共 ${
                    data && data.page ?data.page.totalPage : 1
                    } 页，${
                    data && data.page ? data.page.totalResult : 0
                    } 条数据 `}</span>
            ),
        };
        return (
            <div>
                {this.renderForm()}
                <div className={stylescommon.btnTableBox}>
                    <Button onClick={this.exportData} icon="download">
                        导出表格
                    </Button>
                </div>
                <Card className={stylescommon.cardArea}>
                    <Table
                        loading={loading.global}
                        rowKey={record => record.key}
                        dataSource={data&&data.list ? data.list : []}
                        columns={columns}
                        pagination={paginationProps}
                        onChange={this.handleTableChange}
                    />
                </Card>
                {/*{newAddDetail.map(pane => <TabPane tab={pane.title} key={pane.key}>{pane.content}</TabPane>)}*/}
                {/*{*/}
                {/*    logDetailVisible ? (*/}
                {/*        <MessagePushLogModal*/}
                {/*            {...this.props}*/}
                {/*            logDetail={logDetail}*/}
                {/*            logDetailVisible={logDetailVisible}*/}
                {/*            showLogDetailVisible={this.showLogDetailVisible}*/}
                {/*            newDetail={this.newDetail}*/}
                {/*            renderDiv={() => document.getElementById('messagePushLogTableDiv')}*/}
                {/*        />*/}
                {/*    ) : null*/}
                {/*}*/}
            </div>
        );
    }
}
export default Form.create()(
    connect((common, messagePushLog, loading) => ({ common, messagePushLog, loading }))(MessageLog),
);
