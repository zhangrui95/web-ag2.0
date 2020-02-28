/*
 *  受立案刑事案件预警
 *  author：zr
 *  20181222
 * */
import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {
    Row,
    Col,
    Form,
    Select,
    Table,
    TreeSelect,
    Tag,
    Button,
    DatePicker,
    Tabs,
    message,
    Divider,
    Radio,
    Tooltip,
    Dropdown,
    Menu,
    Icon, Empty,
} from 'antd';
import moment from 'moment/moment';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import styles from '../../common/listPage.less';
import {exportListDataMaxDays, getUserInfos, tableList} from '../../../utils/utils';
import {routerRedux} from "dva/router";
import noList from "@/assets/viewData/noList.png";
import noListLight from "@/assets/viewData/noListLight.png";
// import Detail from '../../routes/CaseRealData/caseDetail';
// import RemindModal from '../../../components/RemindModal/RemindModal';
// import AnnouncementModal from '../../../src/components/AnnouncementModal/AnnouncementModal';
// import ShareModal from '../../components/ShareModal/ShareModal';

const {Option} = Select;
const {RangePicker} = DatePicker;
const TabPane = Tabs.TabPane;
const TreeNode = TreeSelect.TreeNode;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

let timeout;
let currentValue;

@connect(({EarlyWarning, loading, common}) => ({
    EarlyWarning,
    common,
    loading: loading.models.EarlyWarning,
}))
@Form.create()
export default class Index extends PureComponent {
    state = {
        yjjb: '',
        formValues: {yj_type: 'xsaj', ssmk: '1'}, // 查询条件
        activeKey: '0',
        arrayDetail: [],
        allPolice: [],
        jzlb: '',
        yjlx: '',
        txzt: '',
        shareVisible: false,
        shareItem: null,
        personList: [],
        lx: '案件信息',
        tzlx: 'xsajyj1',
        sx: '',
        current: 1,
        AnnouncementVisible: false,
        RzList: [],
        caseDetails: '',
        searchHeight: false, // 查询条件展开筛选
    };

    componentDidMount() {
        if (this.props.location.query && this.props.location.query.record) {
            this.details(this.props.location.query.record);
        }
        this.getDossier({pd: {yj_type: 'xsaj', ssmk: '1'}});
        this.getSuperviseStatusDict();
        this.getYjjbDictionary();
        this.props.dispatch({
            type: 'common/getDictType',
            payload: {
                appCode: window.configUrl.appCode,
                code: '20160003',//5007726
            },
        });
    }

    // 切换tab
    onTabChange = activeKey => {
        this.setState({
            activeKey,
        });
    };
    // 关闭页面
    onTabEdit = (targetKey, action) => {
        this[action](targetKey); // this.remove(targetKey);
    };
    // 获取预警级别字典项
    getYjjbDictionary = () => {
        this.props.dispatch({
            type: 'common/getDictType',
            payload: {
                appCode: window.configUrl.appCode,
                code: '500847',
            },
        });
    };
    // 关闭页面链接的函数
    remove = targetKey => {
        let activeKey = this.state.activeKey;
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
                activeKey: activeKey,
            });
        } else {
            this.setState({
                arrayDetail: panes,
                activeKey: '0',
            });
        }
    };
    // 获取数据
    getDossier = param => {
        this.props.dispatch({
            type: 'EarlyWarning/getList',
            payload: param || '',
        });
    };
    // 获取督办状态
    getSuperviseStatusDict = () => {
        this.props.dispatch({
            type: 'common/getDictType',
            payload: {
                appCode: window.configUrl.appCode,
                code: '2039',
            },
        });
    };
    // 获取所有警员
    getAllPolice = name => {
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
                callback: data => {
                    if (data && currentValue === name) {
                        that.setState({
                            allPolice: data.slice(0, 50),
                        });
                    }
                },
            });
        }, 300);
    };

    // 重置
    handleFormReset = () => {
        this.props.form.resetFields();
        this.setState({
            formValues: {yj_type: 'xsaj', ssmk: '1'},
        });
        this.getDossier({pd: {yj_type: 'xsaj', ssmk: '1'}});
    };
    // 导出
    exportData = () => {
        const values = this.props.form.getFieldsValue();
        const yjsjTime = values.yjsj;
        const formValues = {
            txzt: values.txzt || '',
            yjjbdm: values.yjjb || '',
            yjlxdm: values.yjlx || '',
            yjsj_ks: yjsjTime && yjsjTime.length > 0 ? yjsjTime[0].format('YYYY-MM-DD') : '',
            yjsj_js: yjsjTime && yjsjTime.length > 0 ? yjsjTime[1].format('YYYY-MM-DD') : '',
            yj_type: 'xsaj',
            ssmk: '1',
        };
        if (yjsjTime && yjsjTime.length > 0) {
            const isAfterDate = moment(formValues.yjsj_js).isAfter(
                moment(formValues.yjsj_ks).add(exportListDataMaxDays, 'days'),
            );
            if (isAfterDate) {
                // 选择时间间隔应小于exportListDataMaxDays
                message.warning(`日期间隔需小于${exportListDataMaxDays}天`);
            } else {
                this.props.dispatch({
                    type: 'common/exportData',
                    payload: {
                        tableType: '29',
                        ...formValues,
                    },
                    callback: data => {
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

    // 查询
    handleSearch = e => {
        e.preventDefault();
        const values = this.props.form.getFieldsValue();
        const yjsjTime = values.yjsj;
        const formValues = {
            txzt: values.txzt || '',
            yjjbdm: values.yjjb || '',
            yjlxdm: values.yjlx || '',
            yjsj_ks: yjsjTime && yjsjTime.length > 0 ? yjsjTime[0].format('YYYY-MM-DD') : '',
            yjsj_js: yjsjTime && yjsjTime.length > 0 ? yjsjTime[1].format('YYYY-MM-DD') : '',
            yj_type: 'xsaj',
            ssmk: '1',
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
        this.getDossier(params);
    };
    // 获取办案人信息
    handleAllPoliceOptionChange = value => {
        this.getAllPolice(value);
    };
    // 表格分页功能
    handleTableChange = (pagination, filters, sorter) => {
        const {formValues} = this.state;
        const params = {
            pd: {
                ...formValues,
                yj_type: 'xsaj',
            },
            currentPage: pagination.current,
            showCount: pagination.pageSize,
        };
        this.getDossier(params);
        this.setState({
            current: pagination.current,
        });
    };
    // 打开新的详情页面
    details = record => {
        // const divs = (
        //   <div>
        //     <Detail
        //       {...this.props}
        //       id={record.system_id}
        //       systemId={record.ag_id}
        //       record={record}
        //       sfgz={record.sfgz}
        //       gzid={record.gzid}
        //       tzlx={this.state.tzlx}
        //       ajbh={record.ajbh}
        //       details={this.deatils}
        //       current={this.state.current}
        //       newDetail={this.newDetail}
        //       getCase={() => this.getDossier({ pd: { yj_type: 'xsaj', ssmk: '1' } })}
        //       yjid={record.id}
        //       yjType="yj"
        //     />
        //   </div>
        // );
        // const AddNewDetail = { title: '刑事案件预警详情', content: divs, key: record.id };
        // this.newDetail(AddNewDetail);
        this.props.dispatch({
            type: 'global/changeNavigation',
            payload: {
                key: record && record.id ? record.id : '1',
                name: '刑事案件详情',
                path: '/caseFiling/caseData/CriminalData/caseDetail',
                isShow: true,
                query: {record, id: record && record.id ? record.id : '1'},
            },
            callback: () => {
                this.props.dispatch(
                    routerRedux.push({
                        pathname: '/caseFiling/caseData/CriminalData/caseDetail',
                        query: {record: record, id: record && record.id ? record.id : '1'},
                    }),
                )
            },
        });
    };
    // 打开新的详情页面
    newDetail = addDetail => {
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
    disabledDate = current => {
        // Can not select days before today and today
        return current && current.valueOf() > Date.now();
    };
    // 请求当前数据的详情（提醒弹窗中的回显数据从此处获取）
    thisNewDetails = res => {
        this.props.dispatch({
            type: 'CaseData/getAjxxXqById',
            payload: {
                system_id: res.system_id,
            },
            callback: data => {
                if (data) {
                    this.setState({
                        caseDetails: data,
                    });
                }
            },
        });
    };
    // 渲染机构树
    renderloop = data =>
        data.map(item => {
            const obj = {
                id: item.code,
                label: item.name,
            };
            const objStr = JSON.stringify(obj);
            if (item.childrenList && item.childrenList.length) {
                return (
                    <TreeNode value={objStr} key={objStr} title={item.name}>
                        {this.renderloop(item.childrenList)}
                    </TreeNode>
                );
            }
            return <TreeNode key={objStr} value={objStr} title={item.name}/>;
        });
    saveShare = (res, type, ajGzLx) => {
        this.setState({
            sx:
                (res.ajmc ? res.ajmc + '、' : '') +
                (res.yjlxmc ? res.yjlxmc + '、' : '') +
                (res.yjsj ? res.yjsj : ''),
            shareRecord: res,
        });
        if (type === 3) {
            this.setState({
                txVisible: true,
                txItem: res,
            });
            this.thisNewDetails(res);
        } else if (type === 2) {
            this.setState({
                shareVisible: true,
                shareItem: res,
            });
            this.thisNewDetails(res);
        } else {
            this.props.dispatch({
                type: 'share/getMyFollow',
                payload: {
                    agid: res.id,
                    lx: this.state.lx,
                    sx:
                        (res.ajmc ? res.ajmc + '、' : '') +
                        (res.yjlxmc ? res.yjlxmc + '、' : '') +
                        (res.yjsj ? res.yjsj : ''),
                    type: type,
                    tzlx: this.state.tzlx,
                    wtid: res.wtid,
                    ajbh: res.ajbh,
                    system_id: res.system_id,
                    ajGzLx: ajGzLx,
                    ssmk: '1',
                    is_fxgz:'0',
                },
                callback: res => {
                    if (!res.error) {
                        message.success('关注成功');
                        this.getDossier({currentPage: this.state.current, pd: this.state.formValues});
                    }
                },
            });
        }
    };
    handleCancel = () => {
        this.setState({
            shareVisible: false,
            txVisible: false,
        });
    };
    handleCancels = () => {
        this.setState({
            AnnouncementVisible: false,
        });
    };
    getTg = record => {
        this.setState({
            AnnouncementVisible: true,
        });
        this.props.dispatch({
            type: 'share/getRz',
            payload: {
                ag_id: record.ag_id,
                yj_id: record.id,
            },
            callback: res => {
                this.setState({
                    RzList: res.list,
                });
            },
        });
    };
    noFollow = record => {
        this.props.dispatch({
            type: 'share/getNoFollow',
            payload: {
                id: record.gzid,
                tzlx: record.tzlx,
                ajbh: record.ajbh,
                ajGzlx: record.ajgzlx,
            },
            callback: res => {
                if (!res.error) {
                    message.success('取消关注成功');
                    this.getDossier({currentPage: this.state.current, pd: this.state.formValues});
                }
            },
        });
    };

    // 展开筛选和关闭筛选
    getSearchHeight = () => {
        this.setState({
            searchHeight: !this.state.searchHeight,
        });
    };

    render() {
        const {
            form: {getFieldDecorator},
            common: {depTree, superviseStatusDict, YJJBType, XsyjType},
            EarlyWarning: {
                data: {page, list, tbCount},
            },
            loading,
        } = this.props;
        const newAddDetail = this.state.arrayDetail;
        const allPoliceOptions = this.state.allPolice.map(d => (
            <Option
                key={`${d.idcard},${d.pcard}`}
                value={`${d.idcard},${d.pcard}$$`}
                title={d.name}
            >{`${d.name} ${d.pcard}`}</Option>
        ));
        const formItemLayout = {
            labelCol: {xs: {span: 24}, md: {span: 8}, xl: {span: 6}, xxl: {span: 4}},
            wrapperCol: {xs: {span: 24}, md: {span: 16}, xl: {span: 18}, xxl: {span: 20}},
        };
        const rowLayout = {md: 8, xl: 16, xxl: 24};
        const colLayout = {sm: 24, md: 12, xl: 8};
        const colLayouts = {sm: 24, md: 12, xl: 16};

        const columns = [
            {
                title: '预警时间',
                dataIndex: 'yjsj',
            },
            {
                title: '预警级别',
                dataIndex: 'yjjbmc',
                render: (text, index) => {
                    let indexName = '';
                    switch (index.yjjbdm) {
                        case '5008473':
                            indexName = '一级';
                            break;
                        case '5008472':
                            indexName = '二级';
                            break;
                        case '5008471':
                            indexName = '三级';
                            break;
                        default:
                            indexName = '失效';
                    }
                    return <Tag color={text}>{indexName}</Tag>;
                },
            },
            {
                title: '预警类型',
                dataIndex: 'yjlxmc',
            },
            {
                title: '案件名称',
                dataIndex: 'ajmc',
                render: text => {
                    return (
                        <Ellipsis length={25} tooltip>
                            {text}
                        </Ellipsis>
                    );
                },
            },
            {
                title: '案件编号',
                dataIndex: 'ajbh',
            },
            {
                title: '预警内容',
                dataIndex: 'yjnr',
                render: text => {
                    return (
                        <Ellipsis length={25} tooltip>
                            {text}
                        </Ellipsis>
                    );
                },
            },
            {
                title: '提醒状态',
                dataIndex: 'txzt',
                render: text => {
                    return <span>{text === '0' ? '未提醒' : '已提醒'}</span>;
                },
            },
            {
                title: '操作',
                render: record => (
                    <div>
                        {record.yjjbdm === '5008474' ? (
                            ''
                        ) : (
                            <span>
                <a href="javascript:;" onClick={() => this.saveShare(record, 3)}>
                  提醒
                </a>
                <Divider type="vertical"/>
              </span>
                        )}
                        <a onClick={() => this.details(record)}>详情</a>
                        <Divider type="vertical"/>
                        <a href="javascript:;" onClick={() => this.getTg(record)}>
                            日志
                        </a>
                        <Divider type="vertical"/>
                        {record.sfgz === 0 ? (
                            <Dropdown
                                overlay={
                                    <Menu>
                                        <Menu.Item key="0">
                                            <a onClick={() => this.saveShare(record, 1, 0)}>本案件关注</a>
                                        </Menu.Item>
                                        <Menu.Item key="1">
                                            <a onClick={() => this.saveShare(record, 1, 1)}>全要素关注</a>
                                        </Menu.Item>
                                    </Menu>
                                }
                                trigger={['click']}
                            >
                                <a href="javascript:;">关注</a>
                            </Dropdown>
                        ) : (
                            <a href="javascript:;" onClick={() => this.noFollow(record)}>
                                取消{record.ajgzlx && record.ajgzlx === '0' ? '本案件' : '全要素'}关注
                            </a>
                        )}
                        <Divider type="vertical"/>
                        <a href="javascript:;" onClick={() => this.saveShare(record, 2)}>
                            分享
                        </a>
                    </div>
                ),
            },
        ];
        let superviseStatusOptions = [];
        if (superviseStatusDict.length > 0) {
            for (let i = 0; i < superviseStatusDict.length; i++) {
                const item = superviseStatusDict[i];
                superviseStatusOptions.push(
                    <Option key={item.id} value={item.code}>
                        {item.name}
                    </Option>,
                );
            }
        }
        let YJJBStatusOptions = [];
        if (YJJBType.length > 0) {
            for (let a = 0; a < YJJBType.length; a++) {
                const item = YJJBType[a];
                YJJBStatusOptions.push(
                    <Option key={item.id} value={item.code}>
                        {item.name}
                    </Option>,
                );
            }
        }
        const paginationProps = {
            // showSizeChanger: true,
            // showQuickJumper: true,
            current: page ? page.currentPage : '',
            total: page ? page.totalResult : '',
            pageSize: page ? page.showCount : '',
            showTotal: (total, range) => (
                <span className={styles.listPagination}>{`共 ${page ? page.totalPage : 1} 页，${page ? page.totalResult : 0} 条记录`}</span>
            ),
        };
        return (
            <div>
                <div className={styles.tableListForm} id="slaxsajyj">
                    <Form
                        onSubmit={this.handleSearch}
                        style={{height: this.state.searchHeight ? 'auto' : '59px'}}
                    >
                        <Row gutter={rowLayout} className={styles.searchForm}>
                            <Col {...colLayout}>
                                <FormItem label="预警类型" {...formItemLayout}>
                                    {getFieldDecorator('yjlx', {
                                        initialValue: this.state.yjlx,
                                    })(
                                        <Select
                                            placeholder="请选择预警类型"
                                            style={{width: '100%'}}
                                            getPopupContainer={() => document.getElementById('slaxsajyj')}
                                        >
                                            <Option value="">全部</Option>
                                            {XsyjType.map(event => {
                                                return <Option value={event.code}>{event.name}</Option>;
                                            })}
                                        </Select>,
                                    )}
                                </FormItem>
                            </Col>
                            <Col {...colLayout}>
                                <FormItem label="预警级别" {...formItemLayout}>
                                    {getFieldDecorator('yjjb', {
                                        initialValue: this.state.yjjb,
                                    })(
                                        <Select
                                            placeholder="请选择预警级别"
                                            style={{width: '100%'}}
                                            getPopupContainer={() => document.getElementById('slaxsajyj')}
                                        >
                                            <Option value="">全部</Option>
                                            {YJJBStatusOptions}
                                        </Select>,
                                    )}
                                </FormItem>
                            </Col>
                            <Col {...colLayout}>
                                <FormItem label="提醒状态" {...formItemLayout}>
                                    {getFieldDecorator('txzt', {
                                        initialValue: this.state.txzt,
                                    })(
                                        <RadioGroup>
                                            <Radio value="">全部</Radio>
                                            <Radio value="1">已提醒</Radio>
                                            <Radio value="0">未提醒</Radio>
                                        </RadioGroup>,
                                    )}
                                </FormItem>
                            </Col>
                            <Col {...colLayout}>
                                <FormItem label="预警时间" {...formItemLayout}>
                                    {getFieldDecorator('yjsj')(
                                        <RangePicker
                                            disabledDate={this.disabledDate}
                                            style={{width: '100%'}}
                                            getCalendarContainer={() => document.getElementById('slaxsajyj')}
                                        />,
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row className={styles.search}>
              <span style={{float: 'right', marginBottom: 24, marginTop: 5}}>
                <Button style={{marginLeft: 8}} type="primary" htmlType="submit">
                  查询
                </Button>
                <Button
                    style={{marginLeft: 8}}
                    onClick={this.handleFormReset}
                    className={styles.empty}
                >
                  重置
                </Button>
                <Button
                    style={{marginLeft: 8}}
                    onClick={this.getSearchHeight}
                    className={styles.empty}
                >
                  {this.state.searchHeight ? '收起筛选' : '展开筛选'}{' '}
                    <Icon type={this.state.searchHeight ? 'up' : 'down'}/>
                </Button>
              </span>
                        </Row>
                    </Form>
                </div>
                <div className={styles.tableListOperator}>
                    <Button style={{borderColor: '#2095FF', marginBottom: 16}} icon="download"
                            onClick={this.exportData}>
                        导出表格
                    </Button>
                    <Table
                        className={styles.listStandardTable}
                        // size="middle"
                        loading={loading}
                        rowKey={record => record.wtid}
                        dataSource={list}
                        columns={columns}
                        pagination={paginationProps}
                        onChange={this.handleTableChange}
                        locale={{
                            emptyText: <Empty image={this.props.global && this.props.global.dark ? noList : noListLight}
                                              description={'暂无数据'}/>
                        }}
                    />
                    {/*<RemindModal caseDetails={this.state.caseDetails} txVisible={this.state.txVisible}*/}
                    {/*detail={detail} handleCancel={this.handleCancel} txItem={this.state.txItem}*/}
                    {/*yjmc="案件预警" getResult={() => this.getDossier({*/}
                    {/*currentPage: this.state.current,*/}
                    {/*pd: this.state.formValues,*/}
                    {/*})}/>*/}
                    {/*<AnnouncementModal visible={this.state.AnnouncementVisible}*/}
                    {/*handleCancel={this.handleCancels} RzList={this.state.RzList}/>*/}
                    {/*<ShareModal title="案件信息分享" detail={detail} shareVisible={this.state.shareVisible}*/}
                    {/*handleCancel={this.handleCancel} shareItem={this.state.shareItem}*/}
                    {/*personList={this.state.personList}*/}
                    {/*lx={this.state.lx} tzlx={this.state.tzlx} sx={this.state.sx}/>*/}
                </div>
            </div>
        );
    }
}
