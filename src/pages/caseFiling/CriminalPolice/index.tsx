/*
 * CriminalPolice/index.tsx 受立案刑事案件告警数据
 * author：jhm
 * 20180605
 * */

import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {
    Row,
    Col,
    Form,
    Select,
    TreeSelect,
    Input,
    Button,
    DatePicker,
    Radio,
    Tabs,
    message,
    Icon,
    Card,
} from 'antd';
import moment from 'moment/moment';
import styles from '../../common/listPage.less';
import stylescommon from '../../common/common.less';
import RenderTable from '../../../components/NewUnCaseRealData/RenderTable';
import {
    exportListDataMaxDays,
    getQueryString,
    tableList,
    userResourceCodeDb,
} from '../../../utils/utils';
// import SuperviseModal from '../../components/NewUnCaseRealData/SuperviseModal';
import UnCaseDataView from '../../../components/NewUnCaseRealData/UnCaseDataView';
import MessageState from '../../../components/Common/MessageState';
import DataViewButtonArea from '../../../components/Common/DataViewButtonArea';
import {authorityIsTrue} from '../../../utils/authority';

const FormItem = Form.Item;
const {Option} = Select;
const {RangePicker} = DatePicker;
const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;
const TreeNode = TreeSelect.TreeNode;
let timeout;
let currentValue;

@connect(({UnCaseData, loading, common, MySuperviseData}) => ({
    UnCaseData,
    loading,
    common,
    MySuperviseData,
    // loading: loading.models.alarmManagement,
}))
@Form.create()
export default class Index extends PureComponent {
    state = {
        NowDataPage: '', // 督办完成时当前督办的数据在第几页
        NowShowCount: '', // 督办完成时当前督办的数据每页显示几条
        // 督办模态框
        superviseVisibleModal: false,

        wtlx: '',
        ajlx: '',
        dbzt: '00',
        formValues: {},
        activeKey: '0',
        arrayDetail: [],

        // 点击列表的督办显示的基本信息
        superviseWtlx: '',
        superviseZrdw: '',
        superviseZrr: '',
        superviseZrdwId: '',
        id: '',
        sfzh: '',
        allPolice: [],
        ajzt: '',
        sabar: '',
        opendata: '', // 点击督办的案件
        showDataView: true, // 控制显示图表或者列表（true显示图表）
        wtid: '',
        unCaseData: '',
        isDb: authorityIsTrue(userResourceCodeDb.zfba_xs), // 督办权限
        selectedDateVal: null, // 手动选择的日期
        selectedDeptVal: '', // 手动选择机构
        typeButtons: 'day', // 图表展示类别（week,month）
        treeDefaultExpandedKeys: [], // 办案单位树默认展开keys
        searchHeight: false, // 查询条件展开筛选
    };

    componentDidMount() {
        if (this.props.location.query && this.props.location.query.id) {
            this.setState({
                showDataView: false,
            });
        }
        this.handleFormReset();
        const wtid = getQueryString(this.props.location.search, 'wtid') || '';
        const jigouArea = sessionStorage.getItem('user');
        const newjigouArea = JSON.parse(jigouArea);
        if (wtid !== '') {
            const params = {
                currentPage: 1,
                showCount: tableList,
                pd: {
                    wtid,
                    ssmk: '1',
                },
            };
            this.getUnCase(params);
        } else {
            this.getUnCase();
        }
        this.getDepTree(newjigouArea.department);
        this.getProblemTypeDict();
        this.getSuperviseStatusDict();
        this.getRectificationStatusDict();
        this.getCaseStatus();
    }

    onChange = activeKey => {
        this.setState({
            activeKey,
        });
    };

    // 关闭页面
    onEdit = (targetKey, action) => {
        this[action](targetKey); // this.remove(targetKey);
    };
    onChangeRadio = e => {
        this.setState({
            dbzt: e.target.value,
        });
    };
    // 获取案件状态字典
    getCaseStatus = () => {
        this.props.dispatch({
            type: 'common/getDictType',
            payload: {
                appCode: window.configUrl.appCode,
                code: '500719',
            },
        });
    };

    getUnCase(param) {
        const defaultParams = {
            currentPage: 1,
            showCount: tableList,
            pd: {
                dbzt: '00',
                ssmk: '1',
            },
        };
        this.props.dispatch({
            type: 'UnCaseData/UnCaseFetch',
            payload: param ? param : defaultParams,
            callback: data => {
                if (data) {
                    this.setState({
                        unCaseData: data,
                    });
                }
            },
        });
    }

    // 获取问题类型
    getProblemTypeDict = () => {
        this.props.dispatch({
            type: 'common/getDictType',
            payload: {
                appCode: window.configUrl.appCode,
                code: '2016',
            },
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
    // 获取整改完毕状态
    getRectificationStatusDict = () => {
        this.props.dispatch({
            type: 'common/getDictType',
            payload: {
                appCode: window.configUrl.appCode,
                code: '500740',
            },
        });
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
                    this.setState({
                        treeDefaultExpandedKeys: [data[0].code],
                    });
                }
            },
        });
    };
    // 渲染机构树
    renderloop = data =>
        data.map(item => {
            if (item.childrenList && item.childrenList.length) {
                return (
                    <TreeNode value={item.code} key={item.code} title={item.name}>
                        {this.renderloop(item.childrenList)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.code} value={item.code} title={item.name}/>;
        });
    // 获取所有警员
    getAllPolice = name => {
        const that = this;
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
        currentValue = name;
        timeout = setTimeout(function () {
            that.props.dispatch({
                type: 'common/getAllPolice',
                payload: {
                    search: name,
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
    handleAllPoliceOptionChange = value => {
        this.getAllPolice(value);
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
    // 表格分页
    handleTableChange = (pagination, filtersArg, sorter) => {
        const {formValues} = this.state;
        const params = {
            pd: {
                ...formValues,
            },
            currentPage: pagination.current,
            showCount: pagination.pageSize,
        };
        this.setState({
            NowDataPage: pagination.current,
            NowShowCount: pagination.pageSize,
        });
        this.getUnCase(params);
    };
    // 查询
    handleSearch = e => {
        if (e) e.preventDefault();
        const values = this.props.form.getFieldsValue();
        const gjTime = values.gjsj;
        const formValues = {
            gjsj_ks: gjTime && gjTime.length > 0 ? gjTime[0].format('YYYY-MM-DD') : '',
            gjsj_js: gjTime && gjTime.length > 0 ? gjTime[1].format('YYYY-MM-DD') : '',
            wtlx_id: values.wtlx || '',
            ajbh: values.ajbh || '',
            ajmc: values.ajmc || '',
            // ajlx: values.ajlx || '',
            ajzt: values.ajzt || '',
            bardw: values.badw || '',
            barxm: values.bar || '',
            dbzt: values.dbzt && values.dbzt.dbzt ? values.dbzt.dbzt : '',
            cljg_dm: values.dbzt && values.dbzt.zgzt ? values.dbzt.zgzt : '',
            csfs: values.csfs || '',
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
        this.getUnCase(params);
    };
    // 重置
    handleFormReset = () => {
        this.setState({
            formValues: {
                dbzt: '00',
                ssmk: '1',
            },
            dbzt: '00',
        });
        this.props.form.resetFields();
        this.getUnCase();
    };
    // 导出
    exportData = () => {
        const values = this.props.form.getFieldsValue();
        const gjTime = values.gjsj;
        const formValues = {
            gjsj_ks: gjTime && gjTime.length > 0 ? gjTime[0].format('YYYY-MM-DD') : '',
            gjsj_js: gjTime && gjTime.length > 0 ? gjTime[1].format('YYYY-MM-DD') : '',
            wtlx_id: values.wtlx || '',
            ajbh: values.ajbh || '',
            ajmc: values.ajmc || '',
            ajzt: values.ajzt || '',
            bardw: values.badw || '',
            barxm: values.bar || '',
            dbzt: values.dbzt && values.dbzt.dbzt ? values.dbzt.dbzt : '',
            cljg_dm: values.dbzt && values.dbzt.zgzt ? values.dbzt.zgzt : '',
            csfs: values.csfs || '',
            ssmk: '1',
        };
        if (gjTime && gjTime.length > 0) {
            const isAfterDate = moment(formValues.gjsj_js).isAfter(
                moment(formValues.gjsj_ks).add(exportListDataMaxDays, 'days'),
            );
            if (isAfterDate) {
                // 选择时间间隔应小于exportListDataMaxDays
                message.warning(`日期间隔需小于${exportListDataMaxDays}天`);
            } else {
                this.props.dispatch({
                    type: 'common/exportData',
                    payload: {
                        tableType: '7',
                        lbqf: '受立案-案件告警-刑事案件告警',
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
    // 刷新列表
    refreshTable = () => {
        const {NowDataPage, NowShowCount, formValues} = this.state;
        const saveparam = {
            currentPage: NowDataPage !== '' ? NowDataPage : 1,
            showCount: NowShowCount !== '' ? NowShowCount : 10,
            pd: {
                ...formValues,
            },
        };
        this.getUnCase(saveparam);
    };
    // 打开督办模态框
    openModal = (opendata, flag, record) => {
        this.setState({
            superviseVisibleModal: !!flag,
            opendata: opendata,
            superviseWtlx: record.wtlxMc,
            superviseZrdw: record.bardwmc,
            superviseZrdwId: record.bardw,
            superviseZrr: record.barxm,
            id: record.id,
            sfzh: record.barzjhm,
            sabar: record.sabar,
            wtid: record.wtid,
        });
    };
    // 关闭督办模态框
    closeModal = (flag, param) => {
        this.setState({
            superviseVisibleModal: !!flag,
        });
    };

    // 督办成功后刷新列表
    Refresh = flag => {
        this.setState({
            superviseVisibleModal: !!flag,
        });
        this.refreshTable();
    };
    // 改变显示图表或列表
    changeListPageHeader = () => {
        const {showDataView} = this.state;
        this.setState({
            showDataView: !showDataView,
        });
        // if(showDataView) this.handleFormReset();
    };
    // 设置手动选择日期
    setSelectedDate = val => {
        this.setState({
            typeButtons: 'selectedDate',
            selectedDateVal: val,
        });
    };
    // 设置手动选择机构
    setSelectedDep = val => {
        this.setState({
            selectedDeptVal: val,
        });
    };
    // 改变图表类别
    changeTypeButtons = val => {
        this.setState({
            typeButtons: val,
        });
    };
    // 图表点击跳转到列表页面
    changeToListPage = (name, dateArry) => {
        this.props.form.resetFields();
        this.setState(
            {
                showDataView: false,
                dbzt: '',
                formValues: {
                    dbzt: '',
                    ssmk: '1',
                },
            },
            () => {
                this.props.form.setFieldsValue({
                    gjsj: [moment(dateArry[0], 'YYYY-MM-DD'), moment(dateArry[1], 'YYYY-MM-DD')],
                    badw: this.state.selectedDeptVal || null,
                    ...name,
                });

                this.handleSearch();
            },
        );
    };
    getCsfs = e => {
        if (e !== '') {
            this.props.form.resetFields(['dbzt']);
            this.setState({
                dbzt: '',
            });
        }
    };
    // 展开筛选和关闭筛选
    getSearchHeight = () => {
        this.setState({
            searchHeight: !this.state.searchHeight,
        });
    };

    renderForm() {
        const {
            form: {getFieldDecorator},
            common: {
                problemTypeDict,
                superviseStatusDict,
                rectificationStatusDict,
                depTree,
                CaseStatusType,
            },
        } = this.props;
        const allPoliceOptions = this.state.allPolice.map(d => (
            <Option
                key={`${d.idcard},${d.pcard}`}
                value={`${d.idcard},${d.pcard}$$`}
                title={d.name}
            >{`${d.name} ${d.pcard}`}</Option>
        ));
        let problemTypeOptions = [],
            superviseStatusOptions = [],
            rectificationStatusOptions = [];
        if (problemTypeDict.length > 0) {
            for (let i = 0; i < problemTypeDict.length; i++) {
                const item = problemTypeDict[i];
                problemTypeOptions.push(
                    <Option key={item.id} value={item.code}>
                        {item.name}
                    </Option>,
                );
            }
        }
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
        if (rectificationStatusDict.length > 0) {
            for (let i = 0; i < rectificationStatusDict.length; i++) {
                const item = rectificationStatusDict[i];
                rectificationStatusOptions.push(
                    <Option key={item.id} value={item.code}>
                        {item.name}
                    </Option>,
                );
            }
        }
        let CaseStatusOption = [];
        if (CaseStatusType.length > 0) {
            for (let i = 0; i < CaseStatusType.length; i++) {
                const item = CaseStatusType[i];
                if (item.code === '101' || item.code === '102') {
                    CaseStatusOption.push(
                        <Option key={item.id} value={item.code}>
                            {item.name}
                        </Option>,
                    );
                }
            }
        }
        const formItemLayout = {
            labelCol: {xs: {span: 24}, md: {span: 8}, xl: {span: 6}, xxl: {span: 4}},
            wrapperCol: {xs: {span: 24}, md: {span: 16}, xl: {span: 18}, xxl: {span: 20}},
        };
        const rowLayout = {md: 8, xl: 16, xxl: 24};
        const colLayout = {sm: 24, md: 12, xl: 8};
        return (
            <Card
                className={stylescommon.listPageWrap}
                id="slaxsgjsearchForm"
                style={{border: '0px solid #ccc'}}
            >
                <Form
                    onSubmit={this.handleSearch}
                    style={{height: this.state.searchHeight ? 'auto' : '59px'}}
                >
                    <Row gutter={rowLayout} className={styles.searchForm}>
                        <Col {...colLayout}>
                            <FormItem label="问题类型" {...formItemLayout}>
                                {getFieldDecorator('wtlx', {
                                    initialValue: this.state.wtlx,
                                })(
                                    <Select
                                        placeholder="请选择问题类型"
                                        style={{width: '100%'}}
                                        getPopupContainer={() => document.getElementById('slaxsgjsearchForm')}
                                    >
                                        <Option value="">全部</Option>
                                        {problemTypeOptions}
                                    </Select>,
                                )}
                            </FormItem>
                        </Col>
                        <Col {...colLayout}>
                            <FormItem label="案件编号" {...formItemLayout}>
                                {getFieldDecorator('ajbh', {
                                    // initialValue: this.state.caseType,
                                    rules: [
                                        {pattern: /^[A-Za-z0-9]+$/, message: '请输入正确的案件编号！'},
                                        {max: 32, message: '最多输入32个字！'},
                                    ],
                                })(<Input placeholder="请输入案件编号"/>)}
                            </FormItem>
                        </Col>
                        <Col {...colLayout}>
                            <FormItem label="案件名称" {...formItemLayout}>
                                {getFieldDecorator('ajmc', {
                                    // initialValue: this.state.caseType,
                                    rules: [{max: 128, message: '最多输入128个字！'}],
                                })(<Input placeholder="请输入案件名称"/>)}
                            </FormItem>
                        </Col>
                        <Col {...colLayout}>
                            <FormItem label="办案单位" {...formItemLayout}>
                                {getFieldDecorator('badw', {
                                    initialValue: this.state.badw,
                                })(
                                    <TreeSelect
                                        showSearch
                                        style={{width: '100%'}}
                                        dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                                        placeholder="请输入办案单位"
                                        allowClear
                                        key="badwSelect"
                                        treeDefaultExpandedKeys={this.state.treeDefaultExpandedKeys}
                                        treeNodeFilterProp="title"
                                        getPopupContainer={() => document.getElementById('slaxsgjsearchForm')}
                                    >
                                        {depTree && depTree.length > 0 ? this.renderloop(depTree) : null}
                                    </TreeSelect>,
                                )}
                            </FormItem>
                        </Col>
                        <Col {...colLayout}>
                            <FormItem label="&nbsp;&nbsp;&nbsp; 办案人" {...formItemLayout}>
                                {getFieldDecorator('bar', {
                                    // initialValue: this.state.gzry,
                                    rules: [{max: 32, message: '最多输入32个字！'}],
                                })(
                                    <Select
                                        mode="combobox"
                                        defaultActiveFirstOption={false}
                                        optionLabelProp="title"
                                        showArrow={false}
                                        filterOption={false}
                                        placeholder="请输入办案人"
                                        onChange={this.handleAllPoliceOptionChange}
                                        onFocus={this.handleAllPoliceOptionChange}
                                        getPopupContainer={() => document.getElementById('slaxsgjsearchForm')}
                                    >
                                        {allPoliceOptions}
                                    </Select>,
                                )}
                            </FormItem>
                        </Col>
                        <Col {...colLayout}>
                            <FormItem label="消息状态" {...formItemLayout}>
                                {getFieldDecorator('dbzt', {
                                    initialValue: {dbzt: this.state.dbzt, zgzt: ''},
                                })(
                                    <MessageState
                                        superviseStatusOptions={superviseStatusOptions}
                                        rectificationStatusOptions={rectificationStatusOptions}
                                        newId="slaxsgjsearchForm"
                                    />,
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={rowLayout} className={styles.searchForm}>
                        <Col {...colLayout}>
                            <FormItem label="案件状态" {...formItemLayout}>
                                {getFieldDecorator('ajzt', {
                                    initialValue: this.state.ajzt,
                                })(
                                    <Select
                                        placeholder="请选择案件状态"
                                        style={{width: '100%'}}
                                        getPopupContainer={() => document.getElementById('slaxsgjsearchForm')}
                                    >
                                        <Option value="">全部</Option>
                                        {CaseStatusOption}
                                    </Select>,
                                )}
                            </FormItem>
                        </Col>
                        <Col {...colLayout}>
                            <FormItem label="告警时间" {...formItemLayout}>
                                {getFieldDecorator(
                                    'gjsj',
                                    {},
                                )(
                                    <RangePicker
                                        disabledDate={this.disabledDate}
                                        style={{width: '100%'}}
                                        getCalendarContainer={() => document.getElementById('slaxsgjsearchForm')}
                                    />,
                                )}
                            </FormItem>
                        </Col>
                        <Col {...colLayout}>
                            <FormItem label="产生方式" {...formItemLayout}>
                                {getFieldDecorator('csfs', {
                                    initialValue: '',
                                })(
                                    <Select
                                        placeholder="请选择产生方式"
                                        style={{width: '100%'}}
                                        onChange={this.getCsfs}
                                        getPopupContainer={() => document.getElementById('slaxsgjsearchForm')}
                                    >
                                        <Option value="">全部</Option>
                                        <Option value="系统判定">系统判定</Option>
                                        <Option value="人工判定">人工判定</Option>
                                    </Select>,
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row className={styles.search} style={{position: 'absolute', top: 10, right: 32}}>
            <span style={{float: 'right', marginBottom: 24, marginTop: 5}}>
              <Button style={{marginLeft: 8}} type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>
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
            </Card>
        );
    }

    renderTable() {
        const {
            UnCaseData: {unCaseData, loading},
        } = this.props;
        return (
            <div>
                <RenderTable
                    data={unCaseData}
                    onChange={this.handleTableChange}
                    newDetail={this.newDetail}
                    openModal={this.openModal} // 打开督办模态框
                    refreshTable={this.refreshTable}
                    getUnCase={param => this.getUnCase(param)}
                    formValues={this.state.formValues}
                    belongTo="受立案"
                    isDb={this.state.isDb}
                    {...this.props}
                    ssmk={'1'}
                />
            </div>
        );
    }

    render() {
        const newAddDetail = this.state.arrayDetail;
        const {
            superviseVisibleModal,
            showDataView,
            typeButtons,
            selectedDeptVal,
            selectedDateVal,
            treeDefaultExpandedKeys,
        } = this.state;
        const {
            common: {depTree},
        } = this.props;
        return (
            <div
                className={
                    this.props.location.query && this.props.location.query.id ? styles.onlyDetail : ''
                }
            >
                <div className={styles.listPageWrap}>
                    <div className={styles.listPageHeader}>
                        {showDataView ? (
                            <a className={styles.listPageHeaderCurrent}>
                                <span>●</span>告警统计
                            </a>
                        ) : (
                            <a className={styles.UnlistPageHeaderCurrent} onClick={this.changeListPageHeader}>
                                告警统计
                            </a>
                        )}
                        <span>|</span>
                        {showDataView ? (
                            <a className={styles.UnlistPageHeaderCurrent} onClick={this.changeListPageHeader}>
                                告警列表
                            </a>
                        ) : (
                            <a className={styles.listPageHeaderCurrent}>
                                <span>●</span>告警列表
                            </a>
                        )}
                        {showDataView ? (
                            ''
                        ) : (
                            <div style={{float: 'right'}}>
                                <Button
                                    style={{
                                        color: '#3285FF',
                                        backgroundColor: '#171925',
                                        border: '1px solid #3285FF',
                                        borderRadius: '5px',
                                    }}
                                    onClick={this.exportData}
                                    icon="download"
                                >
                                    导出表格
                                </Button>
                            </div>
                        )}
                        <DataViewButtonArea
                            showDataView={showDataView}
                            styles={styles}
                            typeButtons={typeButtons}
                            changeTypeButtons={this.changeTypeButtons}
                            disabledDate={this.disabledDate}
                            depTree={depTree}
                            renderloop={this.renderloop}
                            setSelectedDate={this.setSelectedDate}
                            setSelectedDep={this.setSelectedDep}
                            hideWeekButton={true}
                            hideMonthButton={true}
                            treeDefaultExpandedKeys={treeDefaultExpandedKeys}
                            {...this.props}
                        />
                    </div>
                    <UnCaseDataView
                        style={{display: 'none'}}
                        changeToListPage={this.changeToListPage}
                        showDataView={showDataView}
                        searchType={typeButtons}
                        orgcode={selectedDeptVal}
                        selectedDateVal={selectedDateVal}
                        {...this.props}
                    />
                    <div style={showDataView ? {display: 'none'} : {display: 'block'}}>
                        <div className={styles.tableListForm} style={{position: 'relative'}}>
                            {this.renderForm()}
                        </div>
                        <div className={styles.tableListOperator} style={{marginBottom: 0}}>
                            {this.renderTable()}
                        </div>
                    </div>
                </div>

                {/*{superviseVisibleModal ?*/}
                {/*<SuperviseModal*/}
                {/*visible={superviseVisibleModal}*/}
                {/*closeModal={this.closeModal}*/}
                {/*caseDetails={this.state.opendata}*/}
                {/*getRefresh={this.Refresh}*/}
                {/*// 点击列表的督办显示的四个基本信息*/}
                {/*wtlx={this.state.superviseWtlx}*/}
                {/*wtid={this.state.wtid}*/}
                {/*id={this.state.id}*/}
                {/*from='督办'*/}
                {/*/>*/}
                {/*: ''*/}
                {/*}*/}
            </div>
        );
    }
}
