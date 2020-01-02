/*
*  CriminalCaseDoc.js 刑事案件档案列表
* author：lyp
* 20181224
* */
import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Row, Col, Form, Select, TreeSelect, Input, Button, DatePicker, Tabs, message, Cascader, Card, Icon} from 'antd';
import moment from 'moment/moment';
import styles from './index.less';
import RenderTable from '../../../components/NewCaseRealData/RenderTable';
import SeniorSearchModal from '../../../components/NewCaseRealData/SeniorSearchModal';
import {exportListDataMaxDays, getQueryString, tableList} from '../../../utils/utils';
import SyncTime from '../../../components/Common/SyncTime';
import stylescommon1 from "@/pages/common/common.less";
import stylescommon2 from "@/pages/common/commonLight.less";

const FormItem = Form.Item;
const {Option} = Select;
const {RangePicker} = DatePicker;
const TabPane = Tabs.TabPane;
const TreeNode = TreeSelect.TreeNode;

let timeout;
let currentValue;

@connect(({common, CaseData, loading, global}) => ({
    CaseData, loading, common, global
    // loading: loading.models.alarmManagement,
}))
@Form.create()
export default class CriminalFile extends PureComponent {
    state = {
        showDataView: true, // 控制显示图表或者列表（true显示图表）
        ajzt: '',
        bardw: '',
        formValues: {
            is_area: window.configUrl.is_area,
        },
        activeKey: '0',
        arrayDetail: [],
        allPolice: [],
        zxlb: '',
        caseAllType: [], // 案件类别
        caseTypeTree: [], // 案件类别树
        typeButtons: 'week', // 图表展示类别（week,month）
        treeDefaultExpandedKeys: [], // 办案单位树默认展开keys
        seniorSearchModalVisible: false, // 高级查询框
        isY: '0', // 判断是高级查询还是普通查询，0是普通查询，1是高级查询
        statusDate: '102', // 初始状态下，查询项默认为立案日期（code = 102），
        path: this.props.location.pathname,
        isReset: false,
        isEmpty: false,
    };

    componentDidMount() {
        this.handleFormReset();
        const org = getQueryString(this.props.location.search, 'org') || '';
        const larq_ks = getQueryString(this.props.location.search, 'startTime') || '';
        const larq_js = getQueryString(this.props.location.search, 'endTime') || '';
        const jigouArea = sessionStorage.getItem('user');
        const newjigouArea = JSON.parse(jigouArea);
        if ((larq_ks !== '') && (larq_js !== '')) {
            this.props.form.setFieldsValue({
                larq: [moment(larq_ks, 'YYYY-MM-DD'), moment(larq_js, 'YYYY-MM-DD')],
            });
        }
        const obj = {
            pd: {
                org,
                larq_ks,
                larq_js,
            },
            currentPage: 1,
            showCount: tableList,
        };
        this.getCase(obj);
        this.getSpecialCaseType();
        // this.getCaseAllType();
        this.getCaseTypeTree(window.configUrl.is_area === '1' ? '1' : '0');
        this.getDepTree(newjigouArea.department);
        this.getCaseStatus();
        this.getEnforcementDictType();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.history.location.query.isReset && nextProps.history.location.pathname === '/lawEnforcement/File/CriminalFile') {
            if (nextProps.history.location.pathname === this.state.path) {
                this.setState({
                    isReset: !this.state.isReset,
                });
                this.props.history.replace(this.state.path);
            }
        }
    }

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
            type: 'CaseData/caseFetch',
            payload: param ? param : '',
        });
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
                code: '500719',
            },
        });
    };
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

    // 获取案件类别字典
    getCaseAllType = () => {
        this.props.dispatch({
            type: 'common/getDictType',
            payload: {
                appCode: window.configUrl.appCode,
                code: '1234',
            },
            callback: (data) => {
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
    getCaseTypeTree = (areaNum) => {
        this.props.dispatch({
            type: 'common/getCaseTypeTree',
            payload: {
                ajlb: 'xs', // 案件类别xs,xz
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
        const larqTime = values.larq;
        const tbsjTime = values.tbsj;
        const ysqsTime = values.ysqssj;
        const qzcslx = [];
        values.qzcslx && values.qzcslx.map((item) => {
            qzcslx.push("'" + item + "'");
        });
        const formValues = {
            ajbh: values.ajbh || '',
            ajmc: values.ajmc || '',
            bardw: values.bardw || '',
            barxm: values.bar || '',
            ajzt: values.ajzt || '',
            zxlb: values.zxlb || '',
            ajlb: values.ajlb ? values.ajlb[values.ajlb.length - 1] : '',
            ajlb_dl: values.ajlb ? values.ajlb[0] : '',
            csfs: values.csfs || '',
            is_tz: this.state.is_tz,
            qzcslx: qzcslx.toString() || '',
            is_area: window.configUrl.is_area,
            isY: '0', // 判断是高级查询还是普通查询，0是普通查询，1是高级查询
            sarq_ks: values.slrq && values.slrq.length > 0 ? values.slrq[0].format('YYYY-MM-DD') : '',
            sarq_js: values.slrq && values.slrq.length > 0 ? values.slrq[1].format('YYYY-MM-DD') : '',
            larq_ks: values.larq && values.larq.length > 0 ? values.larq[0].format('YYYY-MM-DD') : '',
            larq_js: values.larq && values.larq.length > 0 ? values.larq[1].format('YYYY-MM-DD') : '',
            parq_ks: values.parq && values.parq.length > 0 ? values.parq[0].format('YYYY-MM-DD') : '',
            parq_js: values.parq && values.parq.length > 0 ? values.parq[1].format('YYYY-MM-DD') : '',
            xarq_ks: values.xarq && values.xarq.length > 0 ? values.xarq[0].format('YYYY-MM-DD') : '',
            xarq_js: values.xarq && values.xarq.length > 0 ? values.xarq[1].format('YYYY-MM-DD') : '',
            jarq_ks: values.jarq && values.jarq.length > 0 ? values.jarq[0].format('YYYY-MM-DD') : '',
            jarq_js: values.jarq && values.jarq.length > 0 ? values.jarq[1].format('YYYY-MM-DD') : '',
            tbsj_ks: tbsjTime && tbsjTime.length > 0 ? tbsjTime[0].format('YYYY-MM-DD') : '',
            tbsj_js: tbsjTime && tbsjTime.length > 0 ? tbsjTime[1].format('YYYY-MM-DD') : '',
            qsrq_ks: ysqsTime && ysqsTime.length > 0 ? ysqsTime[0].format('YYYY-MM-DD') : '',
            qsrq_js: ysqsTime && ysqsTime.length > 0 ? ysqsTime[1].format('YYYY-MM-DD') : '',
        };
        this.setState({
            formValues,
            isY: '0',
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
                is_area: window.configUrl.is_area,
                isY: '0',
            },
            statusDate: '102',
            isEmpty:!this.state.isEmpty,
        });
        this.getCase();
    };
    // 导出
    exportData = () => {
        // const values = this.props.form.getFieldsValue();
        const {formValues} = this.state;
        // const sarqTime = values.slrq;
        // const larqTime = values.larq;
        // const parqTime = values.parq;
        // const xarqTime = values.xarq;
        // const jarqTime = values.jarq;
        const tbsjTime = formValues.tbsj;
        const ysqsTime = formValues.ysqssj;
        const qzcslx = [];
        formValues.qzcslx && formValues.qzcslx.map((item) => {
            qzcslx.push("'" + item + "'");
        });
        // const ajztd = [];
        // values.ajzt&&values.ajzt.map((item)=>{
        //   ajztd.push("'" + item + "'");
        // });
        const newformValues = {
            ajbh: formValues.ajbh || '',
            ajmc: formValues.ajmc || '',
            bardw: formValues.bardw || '',
            barxm: formValues.bar || '',
            ajzt: formValues.ajzt || '',
            zxlb: formValues.zxlb || '',
            ajlb: formValues.ajlb ? formValues.ajlb[formValues.ajlb.length - 1] : '',
            ajlb_dl: formValues.ajlb ? formValues.ajlb[0] : '',
            csfs: formValues.csfs || '',
            qzcslx: qzcslx.toString() || '',
            is_tz: this.state.is_tz,
            is_area: window.configUrl.is_area,
            isY: this.state.isY, // 判断是高级查询还是普通查询，0是普通查询，1是高级查询
            sarq_ks: formValues.sarq_ks,
            sarq_js: formValues.sarq_js,
            larq_ks: formValues.larq_ks,
            larq_js: formValues.larq_js,
            parq_ks: formValues.parq_ks,
            parq_js: formValues.parq_js,
            xarq_ks: formValues.xarq_ks,
            xarq_js: formValues.xarq_js,
            jarq_ks: formValues.jarq_ks,
            jarq_js: formValues.jarq_js,

            tbsj_ks: tbsjTime && tbsjTime.length > 0 ? tbsjTime[0].format('YYYY-MM-DD') : '',
            tbsj_js: tbsjTime && tbsjTime.length > 0 ? tbsjTime[1].format('YYYY-MM-DD') : '',
            qsrq_ks: ysqsTime && ysqsTime.length > 0 ? ysqsTime[0].format('YYYY-MM-DD') : '',
            qsrq_js: ysqsTime && ysqsTime.length > 0 ? ysqsTime[1].format('YYYY-MM-DD') : '',
        };
        if ((newformValues.jarq_ks && newformValues.jarq_js) || (newformValues.xarq_ks && newformValues.xarq_js) || (newformValues.parq_ks && newformValues.parq_js) || (newformValues.sarq_ks && newformValues.sarq_js) || (newformValues.larq_ks && newformValues.larq_js) || (ysqsTime && ysqsTime.length > 0)) {
            const saisAfterDate = newformValues.sarq_js && newformValues.sarq_ks ? moment(newformValues.sarq_js).isAfter(moment(newformValues.sarq_ks).add(exportListDataMaxDays, 'days')) : true;
            const laisAfterDate = newformValues.larq_js && newformValues.larq_ks ? moment(newformValues.larq_js).isAfter(moment(newformValues.larq_ks).add(exportListDataMaxDays, 'days')) : true;
            const paisAfterDate = newformValues.parq_js && newformValues.parq_ks ? moment(newformValues.parq_js).isAfter(moment(newformValues.parq_ks).add(exportListDataMaxDays, 'days')) : true;
            const xaisAfterDate = newformValues.xarq_js && newformValues.xarq_ks ? moment(newformValues.xarq_js).isAfter(moment(newformValues.xarq_ks).add(exportListDataMaxDays, 'days')) : true;
            const jaisAfterDate = newformValues.jarq_js && newformValues.jarq_ks ? moment(newformValues.jarq_js).isAfter(moment(newformValues.jarq_ks).add(exportListDataMaxDays, 'days')) : true;
            const isAfterDate2 = ysqsTime && ysqsTime.length > 0 ? moment(newformValues.qsrq_js).isAfter(moment(newformValues.qsrq_ks).add(exportListDataMaxDays, 'days')) : true;
            if (saisAfterDate && laisAfterDate && paisAfterDate && xaisAfterDate && jaisAfterDate && isAfterDate2) { // 选择时间间隔应小于exportListDataMaxDays
                message.warning(`日期间隔需小于${exportListDataMaxDays}天`);
            } else {
                this.props.dispatch({
                    type: 'common/exportData',
                    payload: {
                        tableType: '2',
                        lbqf: '全息执法档案-案件档案-刑事案件档案列表',
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
    // 渲染机构树
    renderloop = data => data.map((item) => {
        if (item.childrenList && item.childrenList.length) {
            return <TreeNode value={item.code} key={item.code}
                             title={item.name}>{this.renderloop(item.childrenList)}</TreeNode>;
        }
        return <TreeNode key={item.code} value={item.code} title={item.name}/>;
    });
    handleAllPoliceOptionChange = (value) => {
        this.getAllPolice(value);
    };
    // 级联加载数据
    cascaderLoadData = (selectedOptions) => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;

        this.props.dispatch({
            type: 'common/getDictType',
            payload: {
                appCode: window.configUrl.appCode,
                code: (targetOption.id).toString(),
            },
            callback: (data) => {
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
    specialCaseOnChange = (value) => {
        this.props.form.setFieldsValue({
            ajlb: null,
        });
    };
    // 修改案件状态改变查询的日期名称
    chooseStatus = (item) => {
        this.setState({
            statusDate: item,
        })
    }
    // 高级查询
    seniorSearch = () => {
        this.setState({
            seniorSearchModalVisible: true,
        })
    }
    SeniorSearchCancel = () => {
        this.setState({
            seniorSearchModalVisible: false,
        })
    }
    SearchSuccess = (value) => {
        this.props.form.resetFields();
        const ajzt = [];
        value.ajzt && value.ajzt.map((item) => {
            ajzt.push("'" + item + "'");
        });
        const formValues = {
            is_area: window.configUrl.is_area,
            is_tz: this.state.is_tz,
            isY: '1',// 判断是高级查询还是普通查询，0是普通查询，1是高级查询
            ajzt: ajzt.toString() || '',
            ladw: value.ladw || '',
            sadw: value.sadw || '',
            padw: value.padw || '',
            xadw: value.xadw || '',
            jadw_dm: value.jadw || '',
            sarq_ks: value.slrq && value.slrq.length > 0 ? value.slrq[0].format('YYYY-MM-DD') : '',
            sarq_js: value.slrq && value.slrq.length > 0 ? value.slrq[1].format('YYYY-MM-DD') : '',
            larq_ks: value.larq && value.larq.length > 0 ? value.larq[0].format('YYYY-MM-DD') : '',
            larq_js: value.larq && value.larq.length > 0 ? value.larq[1].format('YYYY-MM-DD') : '',
            parq_ks: value.parq && value.parq.length > 0 ? value.parq[0].format('YYYY-MM-DD') : '',
            parq_js: value.parq && value.parq.length > 0 ? value.parq[1].format('YYYY-MM-DD') : '',
            xarq_ks: value.xarq && value.xarq.length > 0 ? value.xarq[0].format('YYYY-MM-DD') : '',
            xarq_js: value.xarq && value.xarq.length > 0 ? value.xarq[1].format('YYYY-MM-DD') : '',
            jarq_ks: value.jarq && value.jarq.length > 0 ? value.jarq[0].format('YYYY-MM-DD') : '',
            jarq_js: value.jarq && value.jarq.length > 0 ? value.jarq[1].format('YYYY-MM-DD') : '',
        };
        const params = {
            currentPage: 1,
            showCount: tableList,
            pd: {
                ...formValues,
            },
        };
        this.setState({
            formValues,
            seniorSearchModalVisible: false,
            isY: '1',
        });
        this.getCase(params);
    }
    getSearchHeight = () => {
        this.setState({
            searchHeight: !this.state.searchHeight
        });
    }

    renderForm() {
        let stylescommon = this.props.global && this.props.global.dark ? stylescommon1 : stylescommon2;
        const {form: {getFieldDecorator}, common: {depTree, specialCaseType, CaseStatusType, enforcementTypeDict}} = this.props;
        const allPoliceOptions = this.state.allPolice.map(d => <Option key={`${d.idcard},${d.pcard}`}
                                                                       value={`${d.idcard},${d.pcard}$$`}
                                                                       title={d.name}>{`${d.name} ${d.pcard}`}</Option>);
        const formItemLayout = {
            labelCol: {xs: {span: 24}, md: {span: 8}, xl: {span: 6}, xxl: {span: 6}},
            wrapperCol: {xs: {span: 24}, md: {span: 16}, xl: {span: 18}, xxl: {span: 18}},
        };
        const rowLayout = {md: 8, xl: 16, xxl: 24};
        const colLayout = {sm: 24, md: 12, xl: 12, xxl: 8};
        const {statusDate} = this.state;
        let CaseStatusOption = [];
        if (CaseStatusType.length > 0) {
            for (let i = 0; i < CaseStatusType.length; i++) {
                const item = CaseStatusType[i];
                CaseStatusOption.push(
                    <Option key={item.id} value={item.code}>{item.name}</Option>,
                );
            }
        }
        let specialCaseTypeOptions = [];
        if (specialCaseType.length > 0) {
            for (let i = 0; i < specialCaseType.length; i++) {
                const item = specialCaseType[i];
                specialCaseTypeOptions.push(
                    <Option key={item.id} value={item.code}>{item.name}</Option>,
                );
            }
        }
        let enforcementTypeDictGroup = [];
        if (enforcementTypeDict.length > 0) {
            for (let i = 0; i < enforcementTypeDict.length; i++) {
                const item = enforcementTypeDict[i];
                enforcementTypeDictGroup.push(
                    <Option key={item.id} value={item.code}>{item.name}</Option>,
                );
            }
        }
        return (
            <Card className={stylescommon.listPageWrap} id={'formCriminalFile'}>
                <Form onSubmit={this.handleSearch} style={{height: this.state.searchHeight ? 'auto' : '50px'}}>
                    <Row gutter={rowLayout} className={stylescommon.searchForm}>
                        <Col {...colLayout}>
                            <FormItem label="案件编号" {...formItemLayout}>
                                {getFieldDecorator('ajbh', {
                                    // initialValue: this.state.caseType,
                                    rules: [
                                        {pattern: /^[A-Za-z0-9]+$/, message: '请输入正确的案件编号！'},
                                        {max: 32, message: '最多输入32个字！'},
                                    ],
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
                        {
                            (statusDate === '102' || statusDate === '') ? <Col {...colLayout}>
                                <FormItem label={'立案日期'} {...formItemLayout}>
                                    {getFieldDecorator('larq', {
                                        initialValue: this.state.larq ? this.state.larq : undefined,
                                    })(
                                        <RangePicker
                                            disabledDate={this.disabledDate}
                                            style={{width: '100%'}}
                                            getCalendarContainer={() => document.getElementById('formCriminalFile')}
                                        />,
                                    )}
                                </FormItem>
                            </Col> : ''
                        }
                        {
                            (statusDate === '101' || statusDate === '103' || statusDate === '106') ?
                                <Col {...colLayout}>
                                    <FormItem label={'受理日期'} {...formItemLayout}>
                                        {getFieldDecorator('slrq')(
                                            <RangePicker
                                                disabledDate={this.disabledDate}
                                                style={{width: '100%'}}
                                                getCalendarContainer={() => document.getElementById('formCriminalFile')}
                                            />,
                                        )}
                                    </FormItem>
                                </Col> : ''
                        }
                        {
                            (statusDate === '104') ?
                                <Col {...colLayout}>
                                    <FormItem label={'破案日期'} {...formItemLayout}>
                                        {getFieldDecorator('parq')(
                                            <RangePicker
                                                disabledDate={this.disabledDate}
                                                style={{width: '100%'}}
                                                getCalendarContainer={() => document.getElementById('formCriminalFile')}
                                            />,
                                        )}
                                    </FormItem>
                                </Col> : ''
                        }
                        {
                            (statusDate === '105') ?
                                <Col {...colLayout}>
                                    <FormItem label={'撤案日期'} {...formItemLayout}>
                                        {getFieldDecorator('xarq')(
                                            <RangePicker
                                                disabledDate={this.disabledDate}
                                                style={{width: '100%'}}
                                                getCalendarContainer={() => document.getElementById('formCriminalFile')}
                                            />,
                                        )}
                                    </FormItem>
                                </Col> : ''
                        }
                        {
                            (statusDate === '107' || statusDate === '108' || statusDate === '109') ?
                                <Col {...colLayout}>
                                    <FormItem label={'结案日期'} {...formItemLayout}>
                                        {getFieldDecorator('jarq')(
                                            <RangePicker
                                                disabledDate={this.disabledDate}
                                                style={{width: '100%'}}
                                                getCalendarContainer={() => document.getElementById('formCriminalFile')}
                                            />,
                                        )}
                                    </FormItem>
                                </Col> : ''
                        }
                        <Col {...colLayout}>
                            <FormItem label="办案单位" {...formItemLayout}>
                                {getFieldDecorator('bardw', {
                                    // initialValue: this.state.bardw,
                                })(
                                    <TreeSelect
                                        showSearch
                                        style={{width: '100%'}}
                                        dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                                        placeholder="请输入办案单位"
                                        allowClear
                                        key='badwSelect'
                                        treeDefaultExpandedKeys={this.state.treeDefaultExpandedKeys}
                                        treeNodeFilterProp="title"
                                        getPopupContainer={() => document.getElementById('formCriminalFile')}
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
                                    <Select placeholder="请选择案件状态" style={{width: '100%'}} onChange={this.chooseStatus}
                                            getPopupContainer={() => document.getElementById('formCriminalFile')}>
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
                                        optionLabelProp='title'
                                        showArrow={false}
                                        filterOption={false}
                                        placeholder="请输入办案人"
                                        onChange={this.handleAllPoliceOptionChange}
                                        onFocus={this.handleAllPoliceOptionChange}
                                        getPopupContainer={() => document.getElementById('formCriminalFile')}
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
                                        getPopupContainer={() => document.getElementById('formCriminalFile')}
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
                        <Col {...colLayout}>
                            <FormItem label="专项类别" {...formItemLayout}>
                                {getFieldDecorator('zxlb', {
                                    initialValue: this.state.zxlb,
                                })(
                                    <Select placeholder="请选择专项类别" style={{width: '100%'}}
                                            getPopupContainer={() => document.getElementById('formCriminalFile')}
                                            onChange={this.specialCaseOnChange}>
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
                                        getCalendarContainer={() => document.getElementById('formCriminalFile')}
                                    />,
                                )}
                            </FormItem>
                        </Col>
                        {window.configUrl.is_area === '1' ?
                            <Col {...colLayout}>
                                <FormItem label="强制措施" {...formItemLayout}>
                                    {getFieldDecorator('qzcslx', {})(
                                        <Select placeholder="请选择强制措施" style={{width: '100%'}} mode={'multiple'}
                                                getPopupContainer={() => document.getElementById('formCriminalFile')}>
                                            <Option value="">全部</Option>
                                            {enforcementTypeDictGroup}
                                        </Select>,
                                    )}
                                </FormItem>
                            </Col>
                            :
                            <Col {...colLayout} />
                        }
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
        const {CaseData: {returnData, loading}} = this.props;
        return (
            <div>
                <RenderTable
                    loading={loading}
                    data={returnData}
                    onChange={this.handleTableChange}
                    dispatch={this.props.dispatch}
                    newDetail={this.newDetail}
                    getCase={(param) => this.getCase(param)}
                    location={this.props.location}
                    formValues={this.state.formValues}
                    isDocument={true}
                    isReset={this.state.isReset}
                    global={this.props.global}
                />
            </div>
        );
    }

    render() {
        const newAddDetail = this.state.arrayDetail;
        const {CaseData: {returnData, loading}, common: {depTree, CaseStatusType}} = this.props;
        const {showDataView, typeButtons, seniorSearchModalVisible} = this.state;
        let stylescommon = this.props.global && this.props.global.dark ? stylescommon1 : stylescommon2;
        let dark = this.props.global && this.props.global.dark;
        return (
            <div className={dark ? '' : styles.ligthBox}>
                <Card className={stylescommon.titleArea}>
                    <Button onClick={this.exportData} icon="download">
                        导出表格
                    </Button>
                    <div className={styles.btnHeightSearch}>
                        {window.configUrl.is_area==='1'?
                            <Button onClick={this.seniorSearch}>高级查询</Button>
                            :
                            ''
                        }
                    </div>
                </Card>
                {this.renderForm()}
                {this.renderTable()}
                <SyncTime dataLatestTime={returnData.tbCount ? returnData.tbCount.tbsj : ''} {...this.props} />
                <SeniorSearchModal
                    visible={seniorSearchModalVisible}
                    SeniorSearchCancel={this.SeniorSearchCancel}
                    treeDefaultExpandedKeys={this.state.treeDefaultExpandedKeys}
                    depTree={depTree}
                    SearchSuccess={this.SearchSuccess}
                    CaseStatusType={CaseStatusType}
                    id='xsajda'
                    isEmpty={this.state.isEmpty}
                    handleFormReset={this.handleFormReset}
                />
            </div>
        );
    }
}
