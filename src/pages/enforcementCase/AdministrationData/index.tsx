/*
 * XzEnforcementCaseRealData/index.js 执法办案行政案件数据
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
    Cascader,
    Icon,
} from 'antd';
import moment from 'moment/moment';
import styles from '../../common/listPage.less';
import RenderTable from '../../../components/NewXzCaseRealData/RenderTable';
import XzCaseDataView from '../../../components/NewXzCaseRealData/XzCaseEnforcementDataView';
import DataViewButtonArea from '../../../components/Common/DataViewButtonArea';
import {exportListDataMaxDays, getQueryString, tableList} from '../../../utils/utils';
import SyncTime from '../../../components/Common/SyncTime';

const FormItem = Form.Item;
const {Option} = Select;
const {RangePicker} = DatePicker;
const TabPane = Tabs.TabPane;
const TreeNode = TreeSelect.TreeNode;

let timeout;
let currentValue;

@connect(({XzCaseData, loading, common, global}) => ({
    XzCaseData,
    loading,
    common,
    global
    // loading: loading.models.alarmManagement,
}))
@Form.create()
export default class Index extends PureComponent {
    state = {
        ajzt: '',
        sldw: '',
        formValues: {
            is_area: '0',
        },
        activeKey: '0',
        arrayDetail: [],
        allPolice: [],
        caseTypeTree: [], // 案件类别树
        showDataView: true, // 控制显示图表或者列表（true显示图表）
        typeButtons: 'week', // 图表展示类别（week,month）
        selectedDateVal: null, // 手动选择的日期
        selectedDeptVal: '', // 手动选择机构
        treeDefaultExpandedKeys: [], // 办案单位树默认展开keys
        statusDate: '201', // 初始状态下，查询项默认为立案日期（code = 102），
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
                slrq: [moment(this.props.location.state.kssj), moment(this.props.location.state.jssj)],
            });
            const formValues = {
                slrq_ks: this.props.location.state.kssj,
                slrq_js: this.props.location.state.jssj,
                sldw: this.props.location.state.code,
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
            const org = getQueryString(this.props.location.search, 'org') || '';
            const slrq_ks = getQueryString(this.props.location.search, 'startTime') || '';
            const slrq_js = getQueryString(this.props.location.search, 'endTime') || '';
            const jigouArea = sessionStorage.getItem('user');
            const newjigouArea = JSON.parse(jigouArea);
            if (slrq_ks !== '' && slrq_js !== '') {
                this.props.form.setFieldsValue({
                    slrq: [moment(slrq_ks, 'YYYY-MM-DD'), moment(slrq_js, 'YYYY-MM-DD')],
                });
            }
            const obj = {
                pd: {
                    org,
                    slrq_ks,
                    slrq_js,
                    ssmk: '2',
                },
                currentPage: 1,
                showCount: tableList,
            };
            this.getCase(obj);
            this.getDepTree(newjigouArea.department);
            this.getEnforcementDictType();
            this.getCaseStatus();
            this.getCaseTypeTree(window.configUrl.is_area);
        }
    }

    // 获取人员强制措施字典
    getEnforcementDictType = () => {
        this.props.dispatch({
            type: 'common/getDictType',
            payload: {
                appCode: window.configUrl.appCode,
                code: '501028',
            },
        });
    };
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
        this.props.dispatch({
            type: 'XzCaseData/caseFetch',
            payload: param ? param : '',
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
    // 修改案件状态改变查询的日期名称
    chooseStatus = item => {
        this.setState({
            statusDate: item,
        });
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
        const slrqTime = values.slrq;
        const jarqTime = values.jarq;
        const tbsjTime = values.tbsj;
        const formValues = {
            ajbh: values.ajbh || '',
            ajmc: values.ajmc || '',
            sldw: values.sldw || '',
            bar: values.bar || '',
            ajzt: values.ajzt || '',
            ssmk: '2',
            is_area: '0',
            ajlb_dm: values.ajlb ? values.ajlb[values.ajlb.length - 1] : '',
            slrq_ks: slrqTime && slrqTime.length > 0 ? slrqTime[0].format('YYYY-MM-DD') : '',
            slrq_js: slrqTime && slrqTime.length > 0 ? slrqTime[1].format('YYYY-MM-DD') : '',
            jarq_ks: jarqTime && jarqTime.length > 0 ? jarqTime[0].format('YYYY-MM-DD') : '',
            jarq_js: jarqTime && jarqTime.length > 0 ? jarqTime[1].format('YYYY-MM-DD') : '',
            tbsj_ks: tbsjTime && tbsjTime.length > 0 ? tbsjTime[0].format('YYYY-MM-DD') : '',
            tbsj_js: tbsjTime && tbsjTime.length > 0 ? tbsjTime[1].format('YYYY-MM-DD') : '',
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
    // 导出
    exportData = () => {
        const values = this.props.form.getFieldsValue();
        const slrqTime = values.slrq;
        const jarqTime = values.jarq;
        const tbsjTime = values.tbsj;
        const formValues = {
            ajbh: values.ajbh || '',
            ajmc: values.ajmc || '',
            sldw: values.sldw || '',
            bar: values.bar || '',
            ajzt: values.ajzt || '',
            ssmk: '2',
            is_area: '0',
            ajlb_dm: values.ajlb ? values.ajlb[values.ajlb.length - 1] : '',
            slrq_ks: slrqTime && slrqTime.length > 0 ? slrqTime[0].format('YYYY-MM-DD') : '',
            slrq_js: slrqTime && slrqTime.length > 0 ? slrqTime[1].format('YYYY-MM-DD') : '',
            jarq_ks: jarqTime && jarqTime.length > 0 ? jarqTime[0].format('YYYY-MM-DD') : '',
            jarq_js: jarqTime && jarqTime.length > 0 ? jarqTime[1].format('YYYY-MM-DD') : '',
            tbsj_ks: tbsjTime && tbsjTime.length > 0 ? tbsjTime[0].format('YYYY-MM-DD') : '',
            tbsj_js: tbsjTime && tbsjTime.length > 0 ? tbsjTime[1].format('YYYY-MM-DD') : '',
        };
        if ((slrqTime && slrqTime.length > 0) || (jarqTime && jarqTime.length > 0)) {
            const isAfterDate =
                slrqTime && slrqTime.length > 0
                    ? moment(formValues.slrq_js).isAfter(
                    moment(formValues.slrq_ks).add(exportListDataMaxDays, 'days'),
                    )
                    : moment(formValues.jarq_js).isAfter(
                    moment(formValues.jarq_ks).add(exportListDataMaxDays, 'days'),
                    );
            if (isAfterDate) {
                // 选择时间间隔应小于exportListDataMaxDays
                message.warning(`日期间隔需小于${exportListDataMaxDays}天`);
            } else {
                this.props.dispatch({
                    type: 'common/exportData',
                    payload: {
                        tableType: '3',
                        lbqf: '执法办案-案件数据-行政案件数据',
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
    // 重置
    handleFormReset = () => {
        this.props.form.resetFields();
        this.setState({
            formValues: {
                ssmk: '2',
                is_area: '0',
            },
            sldw: null,
            slrq: null,
            linkToAjzt: null,
            statusDate: '201',
        });
        const obj = {
            pd: {
                ssmk: '2',
            },
            currentPage: 1,
            showCount: tableList,
        };
        this.getCase(obj);
    };
    // 改变显示图表或列表
    changeListPageHeader = () => {
        const {showDataView} = this.state;
        this.setState({
            showDataView: !showDataView,
            // typeButtons: 'week',
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
        this.setState({
            showDataView: false,
            linkToAjzt: name && name.ajzt ? name.ajzt : null,
        });
        this.props.form.setFieldsValue({
            [name && name.ajzt && name.ajzt === '206' ? 'jarq' : 'slrq']: [
                moment(dateArry[0], 'YYYY-MM-DD'),
                moment(dateArry[1], 'YYYY-MM-DD'),
            ],
            sldw: this.state.selectedDeptVal || null,
            ...name,
        });
        this.handleSearch();
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
            common: {depTree, XzCaseStatusType, enforcementTypeDict},
        } = this.props;
        const {statusDate} = this.state;
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
        let enforcementTypeDictGroup = [];
        if (enforcementTypeDict.length > 0) {
            for (let i = 0; i < enforcementTypeDict.length; i++) {
                const item = enforcementTypeDict[i];
                enforcementTypeDictGroup.push(
                    <Option key={item.id} value={item.code}>
                        {item.name}
                    </Option>,
                );
            }
        }
        return (
            <Form
                onSubmit={this.handleSearch}
                style={{height: this.state.searchHeight ? 'auto' : '59px'}}
            >
                <Row gutter={rowLayout} className={styles.searchForm}>
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
                    {(this.state.linkToAjzt && this.state.linkToAjzt === '206') ||
                    (statusDate &&
                        (statusDate === '206' ||
                            statusDate === '207' ||
                            statusDate === '208' ||
                            statusDate === '209')) ? (
                        <Col {...colLayout}>
                            <FormItem label="结案日期" {...formItemLayout}>
                                {getFieldDecorator('jarq')(
                                    <RangePicker
                                        disabledDate={this.disabledDate}
                                        style={{width: '100%'}}
                                        getCalendarContainer={() => document.getElementById('zfbaxzajtableListForm')}
                                    />,
                                )}
                            </FormItem>
                        </Col>
                    ) : (
                        <Col {...colLayout}>
                            <FormItem label="受理日期" {...formItemLayout}>
                                {getFieldDecorator('slrq', {
                                    initialValue: this.state.slrq ? this.state.slrq : undefined,
                                })(
                                    <RangePicker
                                        disabledDate={this.disabledDate}
                                        style={{width: '100%'}}
                                        getCalendarContainer={() => document.getElementById('zfbaxzajtableListForm')}
                                    />,
                                )}
                            </FormItem>
                        </Col>
                    )}
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
                                    getPopupContainer={() => document.getElementById('zfbaxzajtableListForm')}
                                >
                                    {depTree && depTree.length > 0 ? this.renderloop(depTree) : []}
                                </TreeSelect>,
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
                                    onChange={this.chooseStatus}
                                    getPopupContainer={() => document.getElementById('zfbaxzajtableListForm')}
                                >
                                    <Option value="">全部</Option>
                                    {XzCaseStatusOption}
                                </Select>,
                            )}
                        </FormItem>
                    </Col>
                    <Col {...colLayout}>
                        <FormItem label="&nbsp;&nbsp;&nbsp; 办案人" {...formItemLayout}>
                            {getFieldDecorator('bar', {
                                // initialValue: this.state.gzry,
                                rules: [{max: 32, message: '最多输入32个字！'}],
                            })(
                                /*<Input placeholder="请输入办案人" />*/
                                <Select
                                    mode="combobox"
                                    defaultActiveFirstOption={false}
                                    optionLabelProp="title"
                                    showArrow={false}
                                    filterOption={false}
                                    placeholder="请输入办案人"
                                    onChange={this.handleAllPoliceOptionChange}
                                    onFocus={this.handleAllPoliceOptionChange}
                                    getPopupContainer={() => document.getElementById('zfbaxzajtableListForm')}
                                >
                                    {allPoliceOptions}
                                </Select>,
                            )}
                        </FormItem>
                    </Col>
                    <Col {...colLayout}>
                        <FormItem label="案件类别" {...formItemLayout}>
                            {getFieldDecorator(
                                'ajlb',
                                {},
                            )(
                                <Cascader
                                    options={this.state.caseTypeTree}
                                    placeholder="请选择案件类别"
                                    changeOnSelect={true}
                                    getPopupContainer={() => document.getElementById('zfbaxzajtableListForm')}
                                    showSearch={{
                                        filter: (inputValue, path) => {
                                            return path.some(
                                                items =>
                                                    (items.searchValue ? items.searchValue : '').indexOf(inputValue) > -1,
                                            );
                                        },
                                        limit: 5,
                                    }}
                                />,
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row className={styles.search}>
          <span style={{float: 'right', marginBottom: 24, marginTop: 5}}>
            <Button style={{borderColor: '#2095FF'}} htmlType="submit">
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
            XzCaseData: {returnData, loading},
        } = this.props;
        return (
            <div>
                <RenderTable
                    loading={loading}
                    data={returnData}
                    onChange={this.handleTableChange}
                    dispatch={this.props.dispatch}
                    newDetail={this.newDetail}
                    getCase={params => this.getCase(params)}
                    location={this.props.location}
                    formValues={this.state.formValues}
                    isEnforcement={true}
                    ssmk={'2'}
                />
            </div>
        );
    }

    // 获取案件类别树
    getCaseTypeTree = areaNum => {
        this.props.dispatch({
            type: areaNum === '2' ? 'common/getPlCaseTypeTree' : 'common/getPlCaseTypeTree',
            payload: {
                ajlb: 'xz', // 案件类别xs,xz
                is_area: '0',
            },
            callback: data => {
                if (data.list) {
                    this.setState({
                        caseTypeTree: data.list,
                    });
                }
            },
        });
    };

    render() {
        const {
            XzCaseData: {returnData, loading},
            common: {depTree},
        } = this.props;
        const newAddDetail = this.state.arrayDetail;
        const {
            showDataView,
            typeButtons,
            selectedDeptVal,
            selectedDateVal,
            treeDefaultExpandedKeys,
        } = this.state;
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
                                <span>●</span>数据统计
                            </a>
                        ) : (
                            <a className={styles.UnlistPageHeaderCurrent} onClick={this.changeListPageHeader}>
                                数据统计
                            </a>
                        )}
                        <span>|</span>
                        {showDataView ? (
                            <a className={styles.UnlistPageHeaderCurrent} onClick={this.changeListPageHeader}>
                                数据列表
                            </a>
                        ) : (
                            <a className={styles.listPageHeaderCurrent}>
                                <span>●</span>数据列表
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
                            hideDayButton
                            treeDefaultExpandedKeys={treeDefaultExpandedKeys}
                            {...this.props}
                        />
                    </div>
                    <XzCaseDataView
                        searchType={typeButtons}
                        showDataView={showDataView}
                        orgcode={selectedDeptVal}
                        selectedDateVal={selectedDateVal}
                        changeToListPage={this.changeToListPage}
                        {...this.props}
                    />
                    <div style={showDataView ? {display: 'none'} : {display: 'block'}}>
                        <div className={styles.tableListForm} id="zfbaxzajtableListForm">
                            {this.renderForm()}
                        </div>
                        <div className={styles.tableListOperator}>{this.renderTable()}</div>
                    </div>
                </div>
                <SyncTime
                    dataLatestTime={returnData.tbCount ? returnData.tbCount.tbsj : ''}
                    {...this.props}
                />
            </div>
        );
    }
}
