/*
 * AdministrationPolice/index.tsx 执法办案行政案件告警
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
    Tabs,
    message,
    Card,
    Icon,
} from 'antd';
import moment from 'moment/moment';
import stylescommon from '../../common/common.less';
import styles from '../../common/listPage.less';
import RenderTable from '../../../components/UnXzCaseRealData/RenderTable';
// import SuperviseModal from '../../../components/NewUnCaseRealData/SuperviseModal';
import {
    exportListDataMaxDays,
    getQueryString,
    tableList,
    userResourceCodeDb,
} from '../../../utils/utils';
import UnXzCaseDataView from '../../../components/UnXzCaseRealData/UnXzCaseEnforcementDataView';
import DataViewButtonArea from '../../../components/Common/DataViewButtonArea';
import MessageState from '../../../components/Common/MessageState';
import {authorityIsTrue} from '../../../utils/authority';

const FormItem = Form.Item;
const {Option} = Select;
const {RangePicker} = DatePicker;
const TabPane = Tabs.TabPane;
const TreeNode = TreeSelect.TreeNode;

let timeout;
let currentValue;

@connect(({UnXzCaseData, loading, common, UnCaseData}) => ({
    UnXzCaseData,
    loading,
    common,
    UnCaseData, // 督办和刑事案件用一个
    // loading: loading.models.alarmManagement,
}))
@Form.create()
export default class Index extends PureComponent {
    state = {
        ajzt: '',
        sldw: '',
        wtxl: '',
        dbzt: '00',
        formValues: {},
        activeKey: '0',
        arrayDetail: [],

        // 复制UnCaseRealData/index.js
        NowDataPage: '', // 督办完成时当前督办的数据在第几页
        NowShowCount: '', // 督办完成时当前督办的数据每页显示几条
        // 督办模态框
        superviseVisibleModal: false,

        wtlx: '',
        ajlx: '',
        // dbzt: '',
        // formValues: {},
        // activeKey: '0',
        // arrayDetail: [],

        // 点击列表的督办显示的基本信息
        superviseWtlx: '',
        superviseZrdw: '',
        superviseZrr: '',
        superviseZrdwId: '',
        id: '',
        sfzh: '',
        allPolice: [],
        showDataView: true, // 控制显示图表或者列表（true显示图表）
        opendata: '',
        wtid: '',
        unXzCaseDatas: '',
        isDb: authorityIsTrue(userResourceCodeDb.zfba_xz), // 督办权限
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
        if (
            this.props.location.state &&
            this.props.location.state.code &&
            this.props.location.state.kssj &&
            this.props.location.state.jssj
        ) {
            this.setState({
                showDataView: false,
                sldw: this.props.location.state.code,
                gjsj: [moment(this.props.location.state.kssj), moment(this.props.location.state.jssj)],
                dbzt: this.props.location.state.dbzt,
            });
            const formValues = {
                sldw_dm: this.props.location.state.code,
                gjsj_ks: this.props.location.state.kssj,
                gjsj_js: this.props.location.state.jssj,
                // dbzt:this.props.location.state.dbzt,
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
            this.getCase(params);
        } else {
            this.handleFormReset();
            const wtid = getQueryString(this.props.location.search, 'wtid') || '';
            if (wtid !== '') {
                const params = {
                    currentPage: 1,
                    showCount: tableList,
                    pd: {
                        wtid,
                        ssmk: '2',
                    },
                };
                this.getCase(params);
            } else {
                this.getCase();
            }
        }
        const jigouArea = sessionStorage.getItem('user');
        const newjigouArea = JSON.parse(jigouArea);
        this.getDepTree(newjigouArea.department);
        this.getSuperviseStatusDict();
        this.getRectificationStatusDict();
        this.getXzajQuestionLabel();
        this.getCaseStatus();
    }

    // 获取案件状态字典
    getCaseStatus = () => {
        this.props.dispatch({
            type: 'common/getDictType',
            payload: {
                appCode: window.configUrl.appCode,
                code: '500729',
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
            let obj = {
                id: item.code,
                label: item.name,
            };
            let objStr = JSON.stringify(obj);
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
    getXzajQuestionLabel = () => {
        this.props.dispatch({
            type: 'common/getDictType',
            payload: {
                appCode: window.configUrl.appCode,
                code: '6001',
            },
        });
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

    getCase(param) {
        const defaultParams = {
            currentPage: 1,
            showCount: tableList,
            pd: {
                dbzt: '00',
                ssmk: '2',
            },
        };
        this.props.dispatch({
            type: 'UnXzCaseData/caseFetch',
            payload: param ? param : defaultParams,
            callback: data => {
                if (data) {
                    this.setState({
                        unXzCaseDatas: data,
                    });
                }
            },
        });
    }

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
        this.getCase(params);
    };
    // 查询
    handleSearch = e => {
        if (e) e.preventDefault();
        const values = this.props.form.getFieldsValue();
        const tbsjTime = values.tbsj;
        const gjTime = values.gjsj;
        const formValues = {
            wtlx_id: values.wtlx || '',
            ajbh: values.ajbh || '',
            ajmc: values.ajmc || '',
            sldw_dm: values.sldw || '',
            bar_name: values.bar || '',
            ajzt: values.ajzt || '',
            dbzt: values.dbzt && values.dbzt.dbzt ? values.dbzt.dbzt : '',
            cljg_dm: values.dbzt && values.dbzt.zgzt ? values.dbzt.zgzt : '',
            csfs: values.csfs || '',
            gjsj_ks: gjTime && gjTime.length > 0 ? gjTime[0].format('YYYY-MM-DD') : '',
            gjsj_js: gjTime && gjTime.length > 0 ? gjTime[1].format('YYYY-MM-DD') : '',
            tbsj_ks: tbsjTime && tbsjTime.length > 0 ? tbsjTime[0].format('YYYY-MM-DD') : '',
            tbsj_js: tbsjTime && tbsjTime.length > 0 ? tbsjTime[1].format('YYYY-MM-DD') : '',
            ssmk: '2',
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
        this.getCase(params);
    };
    // 重置
    handleFormReset = () => {
        this.props.form.resetFields();
        this.setState({
            formValues: {
                dbzt: '00',
                ssmk: '2',
            },
            dbzt: '00',
            sldw: null,
            gjsj: null,
        });
        this.getCase();
    };
    // 导出
    exportData = () => {
        const values = this.props.form.getFieldsValue();
        const tbsjTime = values.tbsj;
        const gjTime = values.gjsj;
        const formValues = {
            wtlx_id: values.wtlx || '',
            ajbh: values.ajbh || '',
            ajmc: values.ajmc || '',
            sldw_dm: values.sldw || '',
            bar_name: values.bar || '',
            ajzt: values.ajzt || '',
            dbzt: values.dbzt && values.dbzt.dbzt ? values.dbzt.dbzt : '',
            cljg_dm: values.dbzt && values.dbzt.zgzt ? values.dbzt.zgzt : '',
            csfs: values.csfs || '',
            gjsj_ks: gjTime && gjTime.length > 0 ? gjTime[0].format('YYYY-MM-DD') : '',
            gjsj_js: gjTime && gjTime.length > 0 ? gjTime[1].format('YYYY-MM-DD') : '',
            tbsj_ks: tbsjTime && tbsjTime.length > 0 ? tbsjTime[0].format('YYYY-MM-DD') : '',
            tbsj_js: tbsjTime && tbsjTime.length > 0 ? tbsjTime[1].format('YYYY-MM-DD') : '',
            ssmk: '2',
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
                        tableType: '8',
                        lbqf: '执法办案-案件告警-行政案件告警',
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
        this.getCase(saveparam);
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
                    sldw: this.state.selectedDeptVal || null,
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
                depTree,
                superviseStatusDict,
                WtlxXzAjTypeData,
                XzCaseStatusType,
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
        const formItemLayout = {
            labelCol: {xs: {span: 24}, md: {span: 8}, xl: {span: 6}, xxl: {span: 4}},
            wrapperCol: {xs: {span: 24}, md: {span: 16}, xl: {span: 18}, xxl: {span: 20}},
        };
        const rowLayout = {md: 8, xl: 16, xxl: 24};
        const colLayout = {sm: 24, md: 12, xl: 8};
        let XzCaseStatusOption = [];
        if (XzCaseStatusType.length > 0) {
            for (let i = 0; i < XzCaseStatusType.length; i++) {
                const item = XzCaseStatusType[i];
                XzCaseStatusOption.push(
                    <Option key={item.id} value={item.code}>
                        {item.name}
                    </Option>,
                );
            }
        }
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
        let XzajSuperviseStatusOptions = [];
        if (WtlxXzAjTypeData.length > 0) {
            for (let i = 0; i < WtlxXzAjTypeData.length; i++) {
                const item = WtlxXzAjTypeData[i];
                XzajSuperviseStatusOptions.push(
                    <Option key={item.id} value={item.code}>
                        {item.name}
                    </Option>,
                );
            }
        }
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
                                    initialValue: this.state.wtxl,
                                })(
                                    <Select
                                        placeholder="请选择问题类型"
                                        style={{width: '100%'}}
                                        getPopupContainer={() => document.getElementById('zfbaxzajgjtableListForm')}
                                    >
                                        <Option value="">全部</Option>
                                        {XzajSuperviseStatusOptions}
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
                            <FormItem label="受理单位" {...formItemLayout}>
                                {getFieldDecorator('sldw', {
                                    initialValue: this.state.sldw ? this.state.sldw : undefined,
                                })(
                                    <TreeSelect
                                        showSearch
                                        style={{width: '100%'}}
                                        dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                                        placeholder="请输入受理单位"
                                        allowClear
                                        key="cjdwSelect"
                                        treeDefaultExpandedKeys={this.state.treeDefaultExpandedKeys}
                                        treeNodeFilterProp="title"
                                        getPopupContainer={() => document.getElementById('zfbaxzajgjtableListForm')}
                                    >
                                        {depTree && depTree.length > 0 ? this.renderloop(depTree) : []}
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
                                        getPopupContainer={() => document.getElementById('zfbaxzajgjtableListForm')}
                                    >
                                        {allPoliceOptions}
                                    </Select>,
                                )}
                            </FormItem>
                        </Col>
                        <Col {...colLayout}>
                            <FormItem label="案件状态" {...formItemLayout}>
                                {getFieldDecorator('ajzt', {
                                    initialValue: this.state.ajzt,
                                })(
                                    <Select
                                        placeholder="请选择案件状态"
                                        style={{width: '100%'}}
                                        getPopupContainer={() => document.getElementById('zfbaxzajgjtableListForm')}
                                    >
                                        <Option value="">全部</Option>
                                        {XzCaseStatusOption}
                                    </Select>,
                                )}
                            </FormItem>
                        </Col>
                        <Col {...colLayout}>
                            <FormItem label="告警时间" {...formItemLayout}>
                                {getFieldDecorator('gjsj', {
                                    initialValue: this.state.gjsj ? this.state.gjsj : undefined,
                                })(
                                    <RangePicker
                                        disabledDate={this.disabledDate}
                                        style={{width: '100%'}}
                                        getCalendarContainer={() => document.getElementById('zfbaxzajgjtableListForm')}
                                    />,
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
                                        newId="zfbaxzajgjtableListForm"
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
                                        getPopupContainer={() => document.getElementById('zfbaxzajgjtableListForm')}
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
            UnXzCaseData: {returnData, loading},
        } = this.props;
        return (
            <div>
                <RenderTable
                    {...this.props}
                    loading={loading}
                    data={returnData}
                    onChange={this.handleTableChange}
                    newDetail={this.newDetail}
                    // 打开督办模态框
                    openModal={this.openModal}
                    refreshTable={this.refreshTable}
                    getCase={params => this.getCase(params)}
                    formValues={this.state.formValues}
                    isDb={this.state.isDb}
                    belongTo="执法办案"
                    ssmk={'2'}
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
                                    style={{
                                        color: '#3285FF',
                                        backgroundColor: '#171925',
                                        border: '1px solid #3285FF',
                                        borderRadius: '5px',
                                    }}
                                    onClick={this.exportData}
                                    // icon="download"
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
                    <UnXzCaseDataView
                        style={{display: 'none'}}
                        changeToListPage={this.changeToListPage}
                        showDataView={showDataView}
                        searchType={typeButtons}
                        orgcode={selectedDeptVal}
                        selectedDateVal={selectedDateVal}
                        {...this.props}
                    />
                    <div style={showDataView ? {display: 'none'} : {display: 'block'}}>
                        <div
                            className={styles.tableListForm}
                            style={{position: 'relative'}}
                            id="zfbaxzajgjtableListForm"
                        >
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
