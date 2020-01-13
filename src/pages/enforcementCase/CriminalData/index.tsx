/*
 * Enforcement/index.js 执法办案刑事案件数据
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
import RenderTable from '../../../components/CaseRealData/RenderTable';
import CaseDataView from '../../../components/CaseRealData/CaseEnforcementDataView';
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

@connect(({common, CaseData, loading, global}) => ({
    CaseData,
    loading,
    common,
    global
    // loading: loading.models.alarmManagement,
}))
@Form.create()
export default class Index extends PureComponent {
    state = {
        showDataView: true, // 控制显示图表或者列表（true显示图表）
        ajzt: '',
        bardw: '',
        formValues: {
            is_area: '0',
        },
        activeKey: '0',
        arrayDetail: [],
        allPolice: [],
        zxlb: '',
        caseAllType: [], // 案件类别
        caseTypeTree: [], // 案件类别树
        typeButtons: 'week', // 图表展示类别（week,month）
        current: '',
        selectedDateVal: null, // 手动选择的日期
        selectedDeptVal: '', // 手动选择机构
        treeDefaultExpandedKeys: [], // 办案单位树默认展开keys
        statusDate: '102', // 初始状态下，查询项默认为立案日期（code = 102），
        linkToAjzt: '',
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
                bardw: this.props.location.state.code,
                larq: [moment(this.props.location.state.kssj), moment(this.props.location.state.jssj)],
            });
            const formValues = {
                bardw: this.props.location.state.code,
                larq_ks: this.props.location.state.kssj,
                larq_js: this.props.location.state.jssj,
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
            const larq_ks = getQueryString(this.props.location.search, 'startTime') || '';
            const larq_js = getQueryString(this.props.location.search, 'endTime') || '';
            const jigouArea = sessionStorage.getItem('user');
            const newjigouArea = JSON.parse(jigouArea);
            if (larq_ks !== '' && larq_js !== '') {
                this.props.form.setFieldsValue({
                    larq: [moment(larq_ks, 'YYYY-MM-DD'), moment(larq_js, 'YYYY-MM-DD')],
                });
            }
            const obj = {
                pd: {
                    org,
                    larq_ks,
                    larq_js,
                    ssmk: '2',
                },
                currentPage: 1,
                showCount: tableList,
            };
            this.getCase(obj);
            this.getEnforcementDictType();
            this.getSpecialCaseType();
            this.getCaseStatus();
            // this.getCaseAllType();
            this.getCaseTypeTree(window.configUrl.is_area);
            this.getDepTree(newjigouArea.department);
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
            type: 'CaseData/caseFetch',
            payload: param ? param : '',
        });
    }

    // 获取专项类别字典
    getSpecialCaseType = () => {
        this.props.dispatch({
            type: 'common/getDictType',
            payload: {
                appCode: window.configUrl.appCode,
                code: '11580',
            },
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
    // 获取案件类别字典
    getCaseAllType = () => {
        this.props.dispatch({
            type: 'common/getDictType',
            payload: {
                appCode: window.configUrl.appCode,
                code: '1234',
            },
            callback: data => {
                if (data) {
                    let caseAllTypeData = [];
                    if (data.length > 0) {
                        for (let i = 0; i < data.length; i++) {
                            const obj = {
                                label: data[i].name,
                                value: data[i].code,
                                id: data[i].id,
                                isLeaf: false,
                            };
                            caseAllTypeData.push(obj);
                        }
                    }
                    this.setState({
                        caseAllType: caseAllTypeData,
                    });
                }
            },
        });
    };
    // 获取案件类别树
    getCaseTypeTree = areaNum => {
        this.props.dispatch({
            type: areaNum === '2' ? 'common/getPlCaseTypeTree' : 'common/getPlCaseTypeTree',
            payload: {
                ajlb: 'xs', // 案件类别xs,xz
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
            current: pagination.current,
        });
        this.getCase(params);
    };
    // 查询
    handleSearch = e => {
        if (e) e.preventDefault();
        const values = this.props.form.getFieldsValue();
        const larqTime = values.larq;
        const saTime = values.slrq;
        const parqTime = values.parq;
        const carqTime = values.carq;
        const jarqTime = values.jarq;
        const tbsjTime = values.tbsj;
        const ysqsTime = values.ysqssj;
        const formValues = {
            ajbh: values.ajbh || '',
            ajmc: values.ajmc || '',
            bardw: values.bardw || '',
            barxm: values.bar || '',
            ajzt: values.ajzt || '',
            zxlb: values.zxlb || '',
            ajlb: values.ajlb ? values.ajlb[values.ajlb.length - 1] : '',
            ssmk: '2',
            is_area: '0',
            larq_ks: larqTime && larqTime.length > 0 ? larqTime[0].format('YYYY-MM-DD') : '',
            larq_js: larqTime && larqTime.length > 0 ? larqTime[1].format('YYYY-MM-DD') : '',
            parq_ks: parqTime && parqTime.length > 0 ? parqTime[0].format('YYYY-MM-DD') : '',
            parq_js: parqTime && parqTime.length > 0 ? parqTime[1].format('YYYY-MM-DD') : '',
            xarq_ks: carqTime && carqTime.length > 0 ? carqTime[0].format('YYYY-MM-DD') : '',
            xarq_js: carqTime && carqTime.length > 0 ? carqTime[1].format('YYYY-MM-DD') : '',
            jarq_ks: jarqTime && jarqTime.length > 0 ? jarqTime[0].format('YYYY-MM-DD') : '',
            jarq_js: jarqTime && jarqTime.length > 0 ? jarqTime[1].format('YYYY-MM-DD') : '',
            sarq_ks: saTime && saTime.length > 0 ? saTime[0].format('YYYY-MM-DD') : '',
            sarq_js: saTime && saTime.length > 0 ? saTime[1].format('YYYY-MM-DD') : '',
            tbsj_ks: tbsjTime && tbsjTime.length > 0 ? tbsjTime[0].format('YYYY-MM-DD') : '',
            tbsj_js: tbsjTime && tbsjTime.length > 0 ? tbsjTime[1].format('YYYY-MM-DD') : '',
            qsrq_ks: ysqsTime && ysqsTime.length > 0 ? ysqsTime[0].format('YYYY-MM-DD') : '',
            qsrq_js: ysqsTime && ysqsTime.length > 0 ? ysqsTime[1].format('YYYY-MM-DD') : '',
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
                ssmk: '2',
                is_area: '0',
            },
            bardw: null,
            larq: null,
            linkToAjzt: null,
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
    // 导出
    exportData = () => {
        const values = this.props.form.getFieldsValue();
        const larqTime = values.larq;
        const saTime = values.slrq;
        const parqTime = values.parq;
        const carqTime = values.carq;
        const jarqTime = values.jarq;
        const tbsjTime = values.tbsj;
        const ysqsTime = values.ysqssj;
        const formValues = {
            ajbh: values.ajbh || '',
            ajmc: values.ajmc || '',
            bardw: values.bardw || '',
            barxm: values.bar || '',
            ajzt: values.ajzt || '',
            zxlb: values.zxlb || '',
            ajlb: values.ajlb ? values.ajlb[values.ajlb.length - 1] : '',
            ssmk: '2',
            is_area: '0',
            larq_ks: larqTime && larqTime.length > 0 ? larqTime[0].format('YYYY-MM-DD') : '',
            larq_js: larqTime && larqTime.length > 0 ? larqTime[1].format('YYYY-MM-DD') : '',
            parq_ks: parqTime && parqTime.length > 0 ? parqTime[0].format('YYYY-MM-DD') : '',
            parq_js: parqTime && parqTime.length > 0 ? parqTime[1].format('YYYY-MM-DD') : '',
            xarq_ks: carqTime && carqTime.length > 0 ? carqTime[0].format('YYYY-MM-DD') : '',
            xarq_js: carqTime && carqTime.length > 0 ? carqTime[1].format('YYYY-MM-DD') : '',
            jarq_ks: jarqTime && jarqTime.length > 0 ? jarqTime[0].format('YYYY-MM-DD') : '',
            jarq_js: jarqTime && jarqTime.length > 0 ? jarqTime[1].format('YYYY-MM-DD') : '',
            sarq_ks: saTime && saTime.length > 0 ? saTime[0].format('YYYY-MM-DD') : '',
            sarq_js: saTime && saTime.length > 0 ? saTime[1].format('YYYY-MM-DD') : '',
            tbsj_ks: tbsjTime && tbsjTime.length > 0 ? tbsjTime[0].format('YYYY-MM-DD') : '',
            tbsj_js: tbsjTime && tbsjTime.length > 0 ? tbsjTime[1].format('YYYY-MM-DD') : '',
            qsrq_ks: ysqsTime && ysqsTime.length > 0 ? ysqsTime[0].format('YYYY-MM-DD') : '',
            qsrq_js: ysqsTime && ysqsTime.length > 0 ? ysqsTime[1].format('YYYY-MM-DD') : '',
        };
        if (
            (larqTime && larqTime.length > 0) ||
            (saTime && saTime.length > 0) ||
            (parqTime && parqTime.length > 0) ||
            (carqTime && carqTime.length > 0) ||
            (jarqTime && jarqTime.length > 0) ||
            (ysqsTime && ysqsTime.length > 0)
        ) {
            let dateArry = [];
            let dateArry2 = [];
            if (larqTime && larqTime.length > 0) {
                dateArry = [...larqTime];
            } else if (saTime && saTime.length > 0) {
                dateArry = [...saTime];
            } else if (parqTime && parqTime.length > 0) {
                dateArry = [...parqTime];
            } else if (carqTime && carqTime.length > 0) {
                dateArry = [...carqTime];
            } else if (jarqTime && jarqTime.length > 0) {
                dateArry = [...jarqTime];
            }
            if (ysqsTime && ysqsTime.length > 0) {
                dateArry2 = [...ysqsTime];
            }
            const isAfterDate =
                dateArry.length > 0
                    ? moment(dateArry[1].format('YYYY-MM-DD')).isAfter(
                    moment(dateArry[0].format('YYYY-MM-DD')).add(exportListDataMaxDays, 'days'),
                    )
                    : true;
            const isAfterDate2 =
                dateArry2.length > 0
                    ? moment(dateArry2[1].format('YYYY-MM-DD')).isAfter(
                    moment(dateArry2[1].format('YYYY-MM-DD')).add(exportListDataMaxDays, 'days'),
                    )
                    : true;
            if (isAfterDate && isAfterDate2) {
                // 选择时间间隔应小于exportListDataMaxDays
                message.warning(`日期间隔需小于${exportListDataMaxDays}天`);
            } else {
                this.props.dispatch({
                    type: 'common/exportData',
                    payload: {
                        tableType: '2',
                        lbqf: '执法办案-案件数据-刑事案件数据',
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
    handleAllPoliceOptionChange = value => {
        this.getAllPolice(value);
    };
    // 级联加载数据
    cascaderLoadData = selectedOptions => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;

        this.props.dispatch({
            type: 'common/getDictType',
            payload: {
                appCode: window.configUrl.appCode,
                code: targetOption.id.toString(),
            },
            callback: data => {
                targetOption.loading = false;
                if (data.length > 0) {
                    targetOption.children = [];
                    for (let i = 0; i < data.length; i++) {
                        const obj = {
                            label: data[i].name,
                            value: data[i].code,
                            id: data[i].id,
                            isLeaf: selectedOptions.length > 1,
                        };
                        targetOption.children.push(obj);
                    }
                    this.setState({
                        caseAllType: [...this.state.caseAllType],
                    });
                }
            },
        });
    };
    // 级联选择完成后的回调
    cascaderOnChange = (value, selectedOptions) => {
        this.props.form.setFieldsValue({
            zxlb: '',
        });
    };
    // 专项类别选择回调
    specialCaseOnChange = value => {
        this.props.form.setFieldsValue({
            ajlb: null,
        });
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
            statusDate: '102',
        });
        this.props.form.setFieldsValue({
            [name && name.ajzt
                ? name.ajzt === '101'
                    ? 'slrq'
                    : name.ajzt === '104'
                        ? 'parq'
                        : name.ajzt === '105'
                            ? 'carq'
                            : name.ajzt === '107'
                                ? 'jarq'
                                : 'larq'
                : 'larq']: [moment(dateArry[0], 'YYYY-MM-DD'), moment(dateArry[1], 'YYYY-MM-DD')],
            bardw: this.state.selectedDeptVal || null,
            ...name,
        });
        this.handleSearch();
    };
    chooseStatus = item => {
        this.setState({
            statusDate: item,
        });
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
            common: {depTree, specialCaseType, CaseStatusType, enforcementTypeDict},
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
            labelCol: {xs: {span: 24}, md: {span: 8}, xl: {span: 6}, xxl: {span: 5}},
            wrapperCol: {xs: {span: 24}, md: {span: 16}, xl: {span: 18}, xxl: {span: 19}},
        };
        const rowLayout = {md: 8, xl: 16, xxl: 24};
        const colLayout = {sm: 24, md: 12, xl: 8};
        let specialCaseTypeOptions = [];
        if (specialCaseType.length > 0) {
            for (let i = 0; i < specialCaseType.length; i++) {
                const item = specialCaseType[i];
                specialCaseTypeOptions.push(
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
                CaseStatusOption.push(
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
                    <Col md={8} sm={24}>
                        <FormItem label="案件名称" {...formItemLayout}>
                            {getFieldDecorator('ajmc', {
                                // initialValue: this.state.caseType,
                                rules: [{max: 128, message: '最多输入128个字！'}],
                            })(<Input placeholder="请输入案件名称"/>)}
                        </FormItem>
                    </Col>
                    {(!this.state.linkToAjzt || this.state.linkToAjzt === '102') &&
                    (!statusDate || statusDate === '102') ? (
                        <Col {...colLayout}>
                            <FormItem label={'立案日期'} {...formItemLayout}>
                                {getFieldDecorator('larq', {
                                    initialValue: this.state.larq ? this.state.larq : undefined,
                                })(
                                    <RangePicker
                                        disabledDate={this.disabledDate}
                                        style={{width: '100%'}}
                                        getCalendarContainer={() => document.getElementById('zfbaxsajtableListForm')}
                                    />,
                                )}
                            </FormItem>
                        </Col>
                    ) : (
                        ''
                    )}
                    {(this.state.linkToAjzt && this.state.linkToAjzt === '101') ||
                    statusDate === '101' || statusDate === '103' || statusDate === '106' ? (
                        <Col {...colLayout}>
                            <FormItem label={'受理日期'} {...formItemLayout}>
                                {getFieldDecorator('slrq')(
                                    <RangePicker
                                        disabledDate={this.disabledDate}
                                        style={{width: '100%'}}
                                        getCalendarContainer={() => document.getElementById('zfbaxsajtableListForm')}
                                    />,
                                )}
                            </FormItem>
                        </Col>
                    ) : (
                        ''
                    )}
                    {(this.state.linkToAjzt && this.state.linkToAjzt === '104') || statusDate === '104' ? (
                        <Col {...colLayout}>
                            <FormItem label={'破案日期'} {...formItemLayout}>
                                {getFieldDecorator('parq')(
                                    <RangePicker
                                        disabledDate={this.disabledDate}
                                        style={{width: '100%'}}
                                        getCalendarContainer={() => document.getElementById('zfbaxsajtableListForm')}
                                    />,
                                )}
                            </FormItem>
                        </Col>
                    ) : (
                        ''
                    )}
                    {(this.state.linkToAjzt && this.state.linkToAjzt === '105') || statusDate === '105' ? (
                        <Col {...colLayout}>
                            <FormItem label={'撤案日期'} {...formItemLayout}>
                                {getFieldDecorator('carq')(
                                    <RangePicker
                                        disabledDate={this.disabledDate}
                                        style={{width: '100%'}}
                                        getCalendarContainer={() => document.getElementById('zfbaxsajtableListForm')}
                                    />,
                                )}
                            </FormItem>
                        </Col>
                    ) : (
                        ''
                    )}
                    {(this.state.linkToAjzt && this.state.linkToAjzt === '107') ||
                    statusDate === '107' || statusDate === '108' || statusDate === '109' ? (
                        <Col {...colLayout}>
                            <FormItem label={'结案日期'} {...formItemLayout}>
                                {getFieldDecorator('jarq')(
                                    <RangePicker
                                        disabledDate={this.disabledDate}
                                        style={{width: '100%'}}
                                        getCalendarContainer={() => document.getElementById('zfbaxsajtableListForm')}
                                    />,
                                )}
                            </FormItem>
                        </Col>
                    ) : (
                        ''
                    )}
                    <Col {...colLayout}>
                        <FormItem label="办案单位" {...formItemLayout}>
                            {getFieldDecorator('bardw', {
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
                                    getPopupContainer={() => document.getElementById('zfbaxsajtableListForm')}
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
                                    placeholder="请选择"
                                    style={{width: '100%'}}
                                    onChange={this.chooseStatus}
                                    getPopupContainer={() => document.getElementById('zfbaxsajtableListForm')}
                                >
                                    <Option value="">全部</Option>
                                    {CaseStatusOption}
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
                                <Select
                                    mode="combobox"
                                    defaultActiveFirstOption={false}
                                    optionLabelProp="title"
                                    showArrow={false}
                                    filterOption={false}
                                    placeholder="请输入办案人"
                                    onChange={this.handleAllPoliceOptionChange}
                                    onFocus={this.handleAllPoliceOptionChange}
                                    getPopupContainer={() => document.getElementById('zfbaxsajtableListForm')}
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
                                    getPopupContainer={() => document.getElementById('zfbaxsajtableListForm')}
                                    showSearch={{
                                        filter: (inputValue, path) => {
                                            return path.some(items => items.searchValue.indexOf(inputValue) > -1);
                                        },
                                        limit: 5,
                                    }}
                                />,
                            )}
                        </FormItem>
                    </Col>
                    <Col {...colLayout}>
                        <FormItem label="专项类别" {...formItemLayout}>
                            {getFieldDecorator('zxlb', {
                                initialValue: this.state.zxlb,
                            })(
                                <Select
                                    placeholder="请选择"
                                    style={{width: '100%'}}
                                    onChange={this.specialCaseOnChange}
                                    getPopupContainer={() => document.getElementById('zfbaxsajtableListForm')}
                                >
                                    <Option value="">全部</Option>
                                    {specialCaseTypeOptions}
                                </Select>,
                            )}
                        </FormItem>
                    </Col>
                    <Col {...colLayout}>
                        <FormItem label="移送起诉时间" {...formItemLayout}>
                            {getFieldDecorator('ysqssj', {
                                // initialValue: this.state.larq ? this.state.larq : undefined,
                            })(
                                <RangePicker
                                    disabledDate={this.disabledDate}
                                    style={{width: '100%'}}
                                    getCalendarContainer={() => document.getElementById('zfbaxsajtableListForm')}
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
            CaseData: {returnData, loading},
        } = this.props;
        return (
            <div>
                <RenderTable
                    loading={loading}
                    data={returnData}
                    onChange={this.handleTableChange}
                    current={this.state.current}
                    dispatch={this.props.dispatch}
                    newDetail={this.newDetail}
                    getCase={param => this.getCase(param)}
                    location={this.props.location}
                    formValues={this.state.formValues}
                    isEnforcement={true}
                    from="执法办案"
                    ssmk={'2'}
                />
            </div>
        );
    }

    render() {
        const newAddDetail = this.state.arrayDetail;
        const {
            CaseData: {returnData, loading},
            common: {depTree},
        } = this.props;
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
                         <span className={styles.borderCenter}>|</span>
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
                    <CaseDataView
                        searchType={typeButtons}
                        showDataView={showDataView}
                        orgcode={selectedDeptVal}
                        selectedDateVal={selectedDateVal}
                        changeToListPage={this.changeToListPage}
                        {...this.props}
                    />
                    <div style={showDataView ? {display: 'none'} : {display: 'block'}}>
                        <div className={styles.tableListForm} id="zfbaxsajtableListForm">
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
