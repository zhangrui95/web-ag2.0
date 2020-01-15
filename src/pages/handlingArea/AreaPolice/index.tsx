/*
 * handlingArea/index.tsx 办案区告警数据
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
} from 'antd';
import moment from 'moment/moment';
import styles from '../../common/listPage.less';
import RenderTable from '../../../components/UnAreaRealData/RenderTable';
import {
    exportListDataMaxDays,
    getQueryString, getUserInfos,
    tableList,
    userResourceCodeDb,
} from '../../../utils/utils';
// import SuperviseModal from '../../components/NewUnCaseRealData/SuperviseModal';
import UnAreaDataView from '../../../components/UnAreaRealData/UnAreaDataView';
import DataViewButtonArea from '../../../components/Common/DataViewButtonArea';
import MessageState from '../../../components/Common/MessageState';
import {authorityIsTrue} from '../../../utils/authority';

const FormItem = Form.Item;
const {Option} = Select;
const {RangePicker} = DatePicker;
const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;
const TreeNode = TreeSelect.TreeNode;
let timeout;
let currentValue;

@connect(({UnareaData, loading, common, MySuperviseData, global}) => ({
    UnareaData,
    loading,
    common,
    MySuperviseData,
    global
    // loading: loading.models.alarmManagement,
}))
@Form.create()
export default class Index extends PureComponent {
    state = {
        NowDataPage: '', // 督办完成时当前督办的数据在第几页
        NowShowCount: '', // 督办完成时当前督办的数据每页显示几条
        // 督办模态框
        superviseVisibleModal: false,
        salx: '',
        badw: '',
        formValues: {},
        activeKey: '0',
        arrayDetail: [],
        is_tz: '0',
        // 点击列表的督办显示的基本信息
        superviseWtlx: '',
        superviseZrdw: '',
        superviseZrr: '',
        superviseZrdwId: '',
        id: '',
        sfzh: '',
        wtlx: '',
        dbzt: '00',
        allPolice: [],
        opendata: '', // 点击督办的案件
        showDataView: true, // 控制显示图表或者列表（true显示图表）
        wtid: '',
        UnareaDatas: '',
        isDb: authorityIsTrue(userResourceCodeDb.baq), // 督办权限
        selectedDateVal: null, // 手动选择的日期
        selectedDeptVal: '', // 手动选择机构
        typeButtons: 'day', // 图表展示类别（week,month）
        treeDefaultExpandedKeys: [], // 办案单位树默认展开keys
        searchHeight: false, // 查询条件展开筛选
    };

    componentDidMount() {
        const jigouArea = sessionStorage.getItem('user');
        const newjigouArea = JSON.parse(jigouArea);
        this.getDepTree(newjigouArea.department);
        if (this.props.location.query && this.props.location.query.id) {
            this.setState({
                showDataView: false,
            });
        }
        this.getAllList(this.props);
        this.getProblemTypeDict();
        this.getInvolvedType();
        this.getSuperviseStatusDict();
        this.getRectificationStatusDict();
        this.getBaqTree();
    }

    getAllList = (props) => {
        if (props.location.state && props.location.state.code) {
            this.setState({
                showDataView: false,
                dbzt: '',
                bardw: props.location.state.code,
                gjsj: [
                    props.location.state.kssj ? moment(props.location.state.kssj) : null,
                    props.location.state.jssj ? moment(props.location.state.jssj) : null,
                ],
                searchHeight:true,
            });
            this.props.form.setFieldsValue({
                bar: props.location.state.bar_name,
            });
            const formValues = {
                bardw: props.location.state.code,
                gjsj_ks: props.location.state.kssj,
                gjsj_js: props.location.state.jssj,
                is_tz: props.location.state.is_tz ? props.location.state.is_tz : '1',
                barxm: props.location.state.bar_name || '',
            };
            this.setState({
                formValues,
                is_tz: props.location.state.is_tz ? props.location.state.is_tz : '1',
            });
            const params = {
                currentPage: 1,
                showCount: tableList,
                pd: {
                    ...formValues,
                },
            };
            this.getUnArea(params);
        } else {
            this.handleFormReset();
            const org = getQueryString(props.location.search, 'org') || '';
            const rqsj_ks = getQueryString(props.location.search, 'startTime') || '';
            const rqsj_js = getQueryString(props.location.search, 'endTime') || '';
            const code = getQueryString(props.location.search, 'code') || '';
            const wtid = getQueryString(props.location.search, 'wtid') || '';
            const old_id = getQueryString(props.location.search, 'old_id') || '';
            if (rqsj_ks !== '' && rqsj_js !== '') {
                this.props.form.setFieldsValue({
                    rqsj: [moment(rqsj_ks, 'YYYY-MM-DD'), moment(rqsj_js, 'YYYY-MM-DD')],
                });
            }
            if (code !== '') {
                this.props.form.setFieldsValue({
                    wtlx: code,
                });
            }
            const obj = {
                currentPage: 1,
                showCount: tableList,
                pd: {
                    org,
                    rqsj_ks,
                    rqsj_js,
                    wtlx_id: code,
                    wtid,
                    old_id,
                    dbzt: '00',
                },
            };
            this.getUnArea(obj);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.global.isResetList.isReset !== nextProps.global.isResetList.isReset && nextProps.global.isResetList.url === '/handlingArea/AreaPolice') {
            if (nextProps.global.isResetList.state){
                this.getAllList(nextProps.global.isResetList.state);
            }else{
                const params = {
                    currentPage: 1,
                    showCount: tableList,
                    pd: {
                        ...this.state.formValues,
                    },
                };
                this.getUnArea(params);
            }
            this.setState({
                searchHeight:true,
            });
        }
    }

    // 获取办案区树
    getBaqTree = () => {
        this.props.dispatch({
            type: 'common/getBaqTree',
            payload: {
                ssxt:'106307',
                code:getUserInfos().department,
            },
        });
    };
    // 获取问题类型
    getProblemTypeDict = () => {
        this.props.dispatch({
            type: 'common/getDictType',
            payload: {
                appCode: window.configUrl.appCode,
                code: '3',
            },
        });
    };
    // 获取人员类型字典
    getInvolvedType = () => {
        this.props.dispatch({
            type: 'common/getDictType',
            payload: {
                appCode: window.configUrl.appCode,
                code: '24',
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

    onChange = activeKey => {
        this.setState({
            activeKey,
        });
    };

    // 关闭页面
    onEdit = (targetKey, action) => {
        this[action](targetKey); // this.remove(targetKey);
    };

    getUnArea(param) {
        const defaultParams = {
            currentPage: 1,
            showCount: tableList,
            pd: {
                dbzt: '00',
            },
        };
        this.props.dispatch({
            type: 'UnareaData/UnareaFetch',
            payload: param ? param : defaultParams,
            callback: data => {
                if (data) {
                    this.setState({
                        UnareaDatas: data,
                    });
                }
            },
        });
    }

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
        this.getUnArea(params);
    };
    // 查询
    handleSearch = e => {
        if (e) e.preventDefault();
        const values = this.props.form.getFieldsValue();
        const gjTime = values.gjsj;
        const formValues = {
            gjsj_ks: gjTime && gjTime.length > 0 && gjTime[0] ? gjTime[0].format('YYYY-MM-DD') : '',
            gjsj_js: gjTime && gjTime.length > 0 && gjTime[1] ? gjTime[1].format('YYYY-MM-DD') : '',
            wtlx_id: values.wtlx || '',
            barxm: values.bar || '',
            bardw: values.badw || '',
            salx: values.salx || '',
            ajbh: values.ajbh || '',
            ajmc: values.ajmc || '',
            ha_name: values.ssbaq || '',
            dbzt: values.dbzt && values.dbzt.dbzt ? values.dbzt.dbzt : '',
            cljg_dm: values.dbzt && values.dbzt.zgzt ? values.dbzt.zgzt : '',
            csfs: values.csfs || '',
            sary: values.sary || '',
            is_tz: this.state.is_tz,
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
        this.getUnArea(params);
    };
    // 重置
    handleFormReset = () => {
        this.props.form.resetFields();
        this.setState({
            formValues: {
                dbzt: '00',
            },
            dbzt: '00',
            bardw: null,
            gjsj: null,
        });
        this.getUnArea();
    };
    // 导出
    exportData = () => {
        const values = this.props.form.getFieldsValue();
        const gjTime = values.gjsj;
        const formValues = {
            gjsj_ks: gjTime && gjTime.length > 0 ? gjTime[0].format('YYYY-MM-DD') : '',
            gjsj_js: gjTime && gjTime.length > 0 ? gjTime[1].format('YYYY-MM-DD') : '',
            wtlx_id: values.wtlx || '',
            barxm: values.bar || '',
            bardw: values.badw || '',
            salx: values.salx || '',
            ajbh: values.ajbh || '',
            ajmc: values.ajmc || '',
            ha_name: values.ssbaq || '',
            dbzt: values.dbzt && values.dbzt.dbzt ? values.dbzt.dbzt : '',
            cljg_dm: values.dbzt && values.dbzt.zgzt ? values.dbzt.zgzt : '',
            csfs: values.csfs || '',
            sary: values.sary || '',
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
                        tableType: '9',
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
            showCount: NowShowCount !== '' ? NowShowCount : tableList,
            pd: {
                ...formValues,
            },
        };
        this.getUnArea(saveparam);
    };
    // 渲染办案区树
    renderBaqloop = data =>
        data.map(item => {
            if (item.children && item.children.length) {
                return (
                    <TreeNode
                        value={item.name}
                        key={item.id}
                        title={item.name}
                        // selectable={item.code === 'null'}
                    >
                        {this.renderBaqloop(item.children)}
                    </TreeNode>
                );
            }
            return (
                <TreeNode
                    key={item.id}
                    value={item.name}
                    title={item.name}
                    // selectable={item.code === 'null'}
                />
            );
        });
    // 打开督办模态框
    openModal = (opendata, flag, record) => {
        // alert(1)
        this.setState({
            superviseVisibleModal: !!flag,
            opendata: opendata,
            superviseWtlx: record.wtlxMc,
            superviseZrdw: record.badwMc,
            superviseZrdwId: record.badwDm,
            superviseZrr: record.barxm,
            id: record.id,
            sfzh: record.barzjhm,
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
                searchHeight:true,
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
                WtlxBaqTypeData,
                superviseStatusDict,
                depTree,
                involvedType,
                baqTree,
                rectificationStatusDict,
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
            involvedTypeOptions = [];
        if (WtlxBaqTypeData.length > 0) {
            for (let i = 0; i < WtlxBaqTypeData.length; i++) {
                const item = WtlxBaqTypeData[i];
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
        let rectificationStatusOptions = [];
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
        if (involvedType.length > 0) {
            for (let i = 0; i < involvedType.length; i++) {
                const item = involvedType[i];
                involvedTypeOptions.push(
                    <Option key={item.id} value={item.code}>
                        {item.name}
                    </Option>,
                );
            }
        }
        const formItemLayout = {
            labelCol: {xs: {span: 24}, md: {span: 8}, xl: {span: 6}, xxl: {span: 5}},
            wrapperCol: {xs: {span: 24}, md: {span: 16}, xl: {span: 18}, xxl: {span: 19}},
        };
        const rowLayout = {md: 8, xl: 16, xxl: 24};
        const colLayout = {sm: 24, md: 12, xl: 8};
        return (
            <Form
                onSubmit={this.handleSearch}
                style={{height: this.state.searchHeight ? 'auto' : '50px', position: 'relative'}}
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
                                    getPopupContainer={() => document.getElementById('baqgjsjtableListForm')}
                                >
                                    <Option value="">全部</Option>
                                    {problemTypeOptions}
                                </Select>,
                            )}
                        </FormItem>
                    </Col>
                    <Col {...colLayout}>
                        <FormItem label="涉案人员" {...formItemLayout}>
                            {getFieldDecorator('sary', {
                                // initialValue: this.state.caseType,
                                rules: [{max: 32, message: '最多输入32个字！'}],
                            })(<Input placeholder="请输入涉案人员"/>)}
                        </FormItem>
                    </Col>
                    <Col {...colLayout}>
                        <FormItem label="人员类型" {...formItemLayout}>
                            {getFieldDecorator('salx', {
                                initialValue: this.state.salx,
                            })(
                                <Select
                                    placeholder="请选择人员类型"
                                    style={{width: '100%'}}
                                    getPopupContainer={() => document.getElementById('baqgjsjtableListForm')}
                                >
                                    <Option value="">全部</Option>
                                    {involvedTypeOptions}
                                </Select>,
                            )}
                        </FormItem>
                    </Col>
                    <Col {...colLayout}>
                        <FormItem label="案件编号" {...formItemLayout}>
                            {getFieldDecorator('ajbh', {
                                // initialValue: this.state.caseType,
                                // rules: [
                                //     {pattern: /^[A-Za-z0-9]+$/, message: '请输入正确的案件编号！'},
                                //     {max: 32, message: '最多输入32个字！'},
                                // ],
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
                        <FormItem label="&nbsp;&nbsp;&nbsp;办案人" {...formItemLayout}>
                            {getFieldDecorator('bar', {
                                // initialValue: this.state.caseType,
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
                                    getPopupContainer={() => document.getElementById('baqgjsjtableListForm')}
                                >
                                    {allPoliceOptions}
                                </Select>,
                            )}
                        </FormItem>
                    </Col>
                    <Col {...colLayout}>
                        <FormItem label="办案单位" {...formItemLayout}>
                            {getFieldDecorator('badw', {
                                initialValue: this.state.bardw ? this.state.bardw : undefined,
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
                                    getPopupContainer={() => document.getElementById('baqgjsjtableListForm')}
                                >
                                    {depTree && depTree.length > 0 ? this.renderloop(depTree) : []}
                                </TreeSelect>,
                            )}
                        </FormItem>
                    </Col>
                    <Col {...colLayout}>
                        <FormItem label="所属办案区" {...formItemLayout}>
                            {getFieldDecorator('ssbaq', {
                                // initialValue: this.state.caseType,
                            })(
                                <TreeSelect
                                    showSearch
                                    style={{width: '100%'}}
                                    // value={this.state.value}
                                    dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                                    placeholder="请输入办案区"
                                    allowClear
                                    // treeDefaultExpandAll
                                    key="cjdwSelect"
                                    treeNodeFilterProp="title"
                                    // onChange={this.onChange}
                                    getPopupContainer={() => document.getElementById('baqgjsjtableListForm')}
                                >
                                    {baqTree&&baqTree.length > 0 ? this.renderBaqloop(baqTree) : []}
                                </TreeSelect>,
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
                                    newId="baqgjsjtableListForm"
                                />,
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={rowLayout} className={styles.searchForm}>
                    <Col {...colLayout}>
                        <FormItem label="告警时间" {...formItemLayout}>
                            {getFieldDecorator('gjsj', {
                                initialValue: this.state.gjsj ? this.state.gjsj : undefined,
                            })(
                                <RangePicker
                                    disabledDate={this.disabledDate}
                                    style={{width: '100%'}}
                                    getCalendarContainer={() => document.getElementById('baqgjsjtableListForm')}
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
                                    getPopupContainer={() => document.getElementById('baqgjsjtableListForm')}
                                >
                                    <Option value="">全部</Option>
                                    <Option value="系统判定">系统判定</Option>
                                    <Option value="人工判定">人工判定</Option>
                                </Select>,
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row className={styles.search} style={{position: 'absolute', top: 0, right: 32}}>
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
        );
    }

    renderTable() {
        const {
            UnareaData: {Unarea, loading},
        } = this.props;
        return (
            <div>
                <RenderTable
                    {...this.props}
                    data={Unarea}
                    onChange={this.handleTableChange}
                    newDetail={this.newDetail}
                    // 打开督办模态框
                    openModal={this.openModal}
                    refreshTable={this.refreshTable}
                    getUnArea={params => this.getUnArea(params)}
                    formValues={this.state.formValues}
                    isDb={this.state.isDb}
                />
            </div>
        );
    }

    render() {
        let className = this.props.global && this.props.global.dark ? styles.listPageWrap : styles.listPageWrap + ' ' + styles.lightBox;
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
                <div className={className}>
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
                         <span className={styles.borderCenter}>|</span>
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
                                    className={styles.downloadBtn}
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
                    <UnAreaDataView
                        style={{display: 'none'}}
                        changeToListPage={this.changeToListPage}
                        showDataView={showDataView}
                        searchType={typeButtons}
                        orgcode={selectedDeptVal}
                        selectedDateVal={selectedDateVal}
                        {...this.props}
                    />
                    <div style={showDataView ? {display: 'none'} : {display: 'block'}}>
                        <div className={styles.tableListForm} id="baqgjsjtableListForm">
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
