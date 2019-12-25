import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Row, Col, Form, Select, TreeSelect, Input, Button, DatePicker, Tabs, message, Cascader, Card, Icon} from 'antd';
import moment from 'moment/moment';
import styles from '../listPage.less';
import RenderTable from '../../../components/XzCaseRealData/RenderTable';
import {exportListDataMaxDays, getQueryString, tableList} from '../../../utils/utils';
import SyncTime from '../../../components/Common/SyncTime';
import stylescommon1 from "@/pages/common/common.less";
import stylescommon2 from "@/pages/common/commonLight.less";
import noList from "@/assets/viewData/noList.png";
import noListLight from "@/assets/viewData/noListLight.png";

const FormItem = Form.Item;
const {Option} = Select;
const {RangePicker} = DatePicker;
const TabPane = Tabs.TabPane;
const TreeNode = TreeSelect.TreeNode;

let timeout;
let currentValue;

@connect(({XzCaseData, loading, common, global}) => ({
    XzCaseData, loading, common, global
    // loading: loading.models.alarmManagement,
}))
@Form.create()
export default class AdministrativeCaseDoc extends PureComponent {
    state = {
        ajzt: '',
        sldw: '',
        formValues: {},
        activeKey: '0',
        arrayDetail: [],
        allPolice: [],
        showDataView: true, // 控制显示图表或者列表（true显示图表）
        typeButtons: 'week', // 图表展示类别（week,month）
        treeDefaultExpandedKeys: [], // 办案单位树默认展开keys
        caseTypeTree: [], // 案件类别树
    };

    componentDidMount() {
        if (this.props.location.query && this.props.location.query.id) {
            this.setState({
                showDataView: false,
            });
        }
        this.handleFormReset();
        const org = getQueryString(this.props.location.search, 'org') || '';
        const slrq_ks = getQueryString(this.props.location.search, 'startTime') || '';
        const slrq_js = getQueryString(this.props.location.search, 'endTime') || '';
        const jigouArea = sessionStorage.getItem('user');
        const newjigouArea = JSON.parse(jigouArea);
        if ((slrq_ks !== '') && (slrq_js !== '')) {
            this.props.form.setFieldsValue({
                slrq: [moment(slrq_ks, 'YYYY-MM-DD'), moment(slrq_js, 'YYYY-MM-DD')],
            });
        }
        const obj = {
            pd: {
                org,
                slrq_ks,
                slrq_js,
            },
            currentPage: 1,
            showCount: tableList,
        };
        this.getCase(obj);
        this.getDepTree(newjigouArea.department);
        this.getCaseStatus();
        this.getCaseTypeTree(window.configUrl.is_area === '1' ? '1' : '0');
    }

    // 获取案件类别树
    getCaseTypeTree = (areaNum) => {
        this.props.dispatch({
            type: 'common/getCaseTypeTree',
            payload: {
                ajlb: 'xz', // 案件类别xs,xz
                is_area: areaNum,
            },
            callback: (data) => {
                if (data.list) {
                    this.setState({
                        caseTypeTree: data.list,
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
        timeout = setTimeout(function () {

            that.props.dispatch({
                type: 'common/getAllPolice',
                payload: {
                    search: name,
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

    getCase(param) {
        this.props.dispatch({
            type: 'XzCaseData/caseFetch',
            payload: param ? param : '',
        });
    }

    handleAllPoliceOptionChange = (value) => {
        this.getAllPolice(value);
    };
    // 关闭页面链接的函数
    remove = (targetKey) => {
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
    handleSearch = (e) => {
        if (e) e.preventDefault();
        const values = this.props.form.getFieldsValue();
        const slrqTime = values.slrq;
        const tbsjTime = values.tbsj;
        const jarqTime = values.jarq;
        const formValues = {
            ajbh: values.ajbh || '',
            ajmc: values.ajmc || '',
            sldw: values.sldw || '',
            bar: values.bar || '',
            ajzt: values.ajzt || '',
            csfs: values.csfs || '',
            ajlb_dm: values.ajlb ? values.ajlb[values.ajlb.length - 1] : '',
            slrq_ks: slrqTime && slrqTime.length > 0 ? slrqTime[0].format('YYYY-MM-DD') : '',
            slrq_js: slrqTime && slrqTime.length > 0 ? slrqTime[1].format('YYYY-MM-DD') : '',
            tbsj_ks: tbsjTime && tbsjTime.length > 0 ? tbsjTime[0].format('YYYY-MM-DD') : '',
            tbsj_js: tbsjTime && tbsjTime.length > 0 ? tbsjTime[1].format('YYYY-MM-DD') : '',
            jarq_ks: jarqTime && jarqTime.length > 0 ? jarqTime[0].format('YYYY-MM-DD') : '',
            jarq_js: jarqTime && jarqTime.length > 0 ? jarqTime[1].format('YYYY-MM-DD') : '',
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
        const tbsjTime = values.tbsj;
        const jarqTime = values.jarq;
        const formValues = {
            ajbh: values.ajbh || '',
            ajmc: values.ajmc || '',
            sldw: values.sldw || '',
            bar: values.bar || '',
            ajzt: values.ajzt || '',
            csfs: values.csfs || '',
            ajlb_dm: values.ajlb ? values.ajlb[values.ajlb.length - 1] : '',
            slrq_ks: slrqTime && slrqTime.length > 0 ? slrqTime[0].format('YYYY-MM-DD') : '',
            slrq_js: slrqTime && slrqTime.length > 0 ? slrqTime[1].format('YYYY-MM-DD') : '',
            tbsj_ks: tbsjTime && tbsjTime.length > 0 ? tbsjTime[0].format('YYYY-MM-DD') : '',
            tbsj_js: tbsjTime && tbsjTime.length > 0 ? tbsjTime[1].format('YYYY-MM-DD') : '',
            jarq_ks: jarqTime && jarqTime.length > 0 ? jarqTime[0].format('YYYY-MM-DD') : '',
            jarq_js: jarqTime && jarqTime.length > 0 ? jarqTime[1].format('YYYY-MM-DD') : '',
        };
        if (slrqTime && slrqTime.length > 0) {
            const isAfterDate = moment(formValues.slrq_js).isAfter(moment(formValues.slrq_ks).add(exportListDataMaxDays, 'days'));
            if (isAfterDate) { // 选择时间间隔应小于exportListDataMaxDays
                message.warning(`日期间隔需小于${exportListDataMaxDays}天`);
            } else {
                this.props.dispatch({
                    type: 'common/exportData',
                    payload: {
                        tableType: '3',
                        lbqf: '全息执法档案-案件档案-行政案件档案列表',
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
    // 重置
    handleFormReset = () => {
        this.props.form.resetFields();
        this.setState({
            formValues: {},
        });
        this.getCase();
    };
    getSearchHeight = () => {
        this.setState({
            searchHeight: !this.state.searchHeight
        });
    }

    renderForm() {
        let stylescommon = this.props.global && this.props.global.dark ? stylescommon1 : stylescommon2;
        const {form: {getFieldDecorator}, common: {depTree, XzCaseStatusType}} = this.props;
        const allPoliceOptions = this.state.allPolice.map(d => <Option key={`${d.idcard},${d.pcard}`}
                                                                       value={`${d.idcard},${d.pcard}$$`}
                                                                       title={d.name}>{`${d.name} ${d.pcard}`}</Option>);
        const formItemLayout = {
            labelCol: {xs: {span: 24}, md: {span: 8}, xl: {span: 6}, xxl: {span: 4}},
            wrapperCol: {xs: {span: 24}, md: {span: 16}, xl: {span: 18}, xxl: {span: 20}},
        };
        const rowLayout = {md: 8, xl: 16, xxl: 24};
        const colLayout = {sm: 24, md: 12, xl: 12, xxl: 8};
        let XzCaseStatusOption = [];
        if (XzCaseStatusType.length > 0) {
            for (let i = 0; i < XzCaseStatusType.length; i++) {
                const item = XzCaseStatusType[i];
                XzCaseStatusOption.push(
                    <Option key={item.id} value={item.code}>{item.name}</Option>,
                );
            }
        }
        return (
            <Card className={stylescommon.listPageWrap} id={'formAdministrativeFile'}>
                <Form onSubmit={this.handleSearch} style={{height: this.state.searchHeight ? 'auto' : '50px'}}>
                    <Row gutter={rowLayout} className={stylescommon.searchForm}>
                        <Col {...colLayout}>
                            <FormItem label="案件编号" {...formItemLayout}>
                                {getFieldDecorator('ajbh', {
                                    // initialValue: this.state.caseType,
                                    rules: [{pattern: /^[A-Za-z0-9]+$/, message: '请输入正确的案件编号！'},
                                        {max: 32, message: '最多输入32个字！'}],
                                })(
                                    <Input placeholder="请输入案件编号"/>,
                                )}
                            </FormItem>
                        </Col>
                        <Col {...colLayout}>
                            <FormItem label="案件名称" {...formItemLayout}>
                                {getFieldDecorator('ajmc', {
                                    // initialValue: this.state.caseType,
                                    rules: [{max: 128, message: '最多输入128个字！'}],
                                })(
                                    <Input placeholder="请输入案件名称"/>,
                                )}
                            </FormItem>
                        </Col>
                        <Col {...colLayout}>
                            <FormItem label="受理日期" {...formItemLayout}>
                                {getFieldDecorator('slrq', {
                                    // initialValue: this.state.ssbaq,
                                })(
                                    <RangePicker
                                        disabledDate={this.disabledDate}
                                        style={{width: '100%'}}
                                        getCalendarContainer={() => document.getElementById('formAdministrativeFile')}
                                    />,
                                )}
                            </FormItem>
                        </Col>
                        <Col {...colLayout}>
                            <FormItem label="结案日期" {...formItemLayout}>
                                {getFieldDecorator('jarq', {})(
                                    <RangePicker
                                        disabledDate={this.disabledDate}
                                        style={{width: '100%'}}
                                        getCalendarContainer={() => document.getElementById('formAdministrativeFile')}
                                    />,
                                )}
                            </FormItem>
                        </Col>
                        <Col {...colLayout}>
                            <FormItem label="受理单位" {...formItemLayout}>
                                {getFieldDecorator('sldw', {
                                    // initialValue: this.state.sldw,
                                })(
                                    <TreeSelect
                                        showSearch
                                        style={{width: '100%'}}
                                        dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                                        placeholder="请输入受理单位"
                                        allowClear
                                        treeDefaultExpandedKeys={this.state.treeDefaultExpandedKeys}
                                        treeNodeFilterProp="title"
                                        key='cjdwSelect'
                                        getPopupContainer={() => document.getElementById('formAdministrativeFile')}
                                    >
                                        {depTree && depTree.length > 0 ? this.renderloop(depTree) : null}
                                    </TreeSelect>,
                                )}
                            </FormItem>
                        </Col>
                        <Col {...colLayout}>
                            <FormItem label="案件状态" {...formItemLayout}>
                                {getFieldDecorator('ajzt', {
                                    initialValue: this.state.ajzt,
                                })(
                                    <Select placeholder="请选择案件状态" style={{width: '100%'}}
                                            getPopupContainer={() => document.getElementById('formAdministrativeFile')}>
                                        <Option value="">全部</Option>
                                        {XzCaseStatusOption}
                                    </Select>,
                                )}
                            </FormItem>
                        </Col>
                        <Col {...colLayout}>
                            <FormItem label="&nbsp;&nbsp;&nbsp; 办案人" {...formItemLayout}>
                                {getFieldDecorator('bar', {
                                    rules: [{max: 32, message: '最多输入32个字！'}],
                                })(
                                    <Select
                                        mode="combobox"
                                        defaultActiveFirstOption={false}
                                        optionLabelProp='title'
                                        showArrow={false}
                                        filterOption={false}
                                        placeholder="请输入办案人"
                                        onChange={this.handleAllPoliceOptionChange}
                                        onFocus={this.handleAllPoliceOptionChange}
                                        getPopupContainer={() => document.getElementById('formAdministrativeFile')}
                                    >
                                        {allPoliceOptions}
                                    </Select>,
                                )}
                            </FormItem>
                        </Col>
                        <Col {...colLayout}>
                            <FormItem label="案件类别" {...formItemLayout}>
                                {getFieldDecorator('ajlb', {
                                    // initialValue: this.state.caseAllType,
                                })(
                                    <Cascader
                                        options={this.state.caseTypeTree}
                                        placeholder="请选择案件类别"
                                        changeOnSelect={true}
                                        getPopupContainer={() => document.getElementById('formAdministrativeFile')}
                                        showSearch={
                                            {
                                                filter: (inputValue, path) => {
                                                    return (path.some(items => (items.searchValue).indexOf(inputValue) > -1));
                                                },
                                                limit: 5,
                                            }
                                        }
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
                          <Button style={{marginLeft: 8}} onClick={this.handleFormReset} className={stylescommon.empty}>
                            重置
                          </Button>
                          <Button style={{marginLeft: 8}} onClick={this.getSearchHeight} className={stylescommon.empty}>
                              {this.state.searchHeight ? '收起筛选' : '展开筛选'} <Icon
                              type={this.state.searchHeight ? "up" : "down"}/>
                          </Button>
                        </span>
                    </Row>
                </Form>
            </Card>
        );
    }

    renderTable() {
        const {XzCaseData: {returnData, loading}} = this.props;
        return (
            <div>
                <RenderTable
                    loading={loading}
                    data={returnData}
                    onChange={this.handleTableChange}
                    dispatch={this.props.dispatch}
                    newDetail={this.newDetail}
                    getCase={(params) => this.getCase(params)}
                    location={this.props.location}
                    formValues={this.state.formValues}
                    isDocument
                    global={this.props.global}
                />
            </div>
        );
    }

    render() {
        const {XzCaseData: {returnData, loading}} = this.props;
        const newAddDetail = this.state.arrayDetail;
        let stylescommon = this.props.global && this.props.global.dark ? stylescommon1 : stylescommon2;
        return (
            <div>
                {this.renderForm()}
                <div className={stylescommon.btnTableBox}>
                    <Button onClick={this.exportData} icon="download">
                        导出表格
                    </Button>
                </div>
                {this.renderTable()}
                <SyncTime dataLatestTime={returnData.tbCount ? returnData.tbCount.tbsj : ''} {...this.props} />
            </div>
        );
    }
}
