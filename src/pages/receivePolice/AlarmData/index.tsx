/*
* AlarmData/index.js 接处警警情数据
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
    Radio,
    message,
    Cascader,
    Icon,
    Card
} from 'antd';
import moment from 'moment/moment';
import styles from './index.less';
import RenderTable from '../../../components/ReceivePolice/RenderTable';
import PoliceDataView from '../../../components/ReceivePolice/PoliceDataView';
import DataViewButtonArea from '../../../components/Common/DataViewButtonArea';
import {exportListDataMaxDays, getQueryString, tableList} from '../../../utils/utils';
import SyncTime from '../../../components/Common/SyncTime';

const FormItem = Form.Item;
const {Option} = Select;
const {RangePicker} = DatePicker;
const TabPane = Tabs.TabPane;
const TreeNode = TreeSelect.TreeNode;
const RadioGroup = Radio.Group;
let timeout;
let currentValue;

@connect(({policeData, loading, common, global}) => ({
    policeData, loading, common, global
    // loading: loading.models.alarmManagement,
}))
@Form.create()
export default class Index extends PureComponent {
    state = {
        jjly: '',
        jjdw: '',
        cjdw: '',
        formValues: {},
        activeKey: '0',
        arrayDetail: [],
        sfsa: '0',
        sfcj: '',
        showDataView: true, // 控制显示图表或者列表（true显示图表）
        typeButtons: 'day', // 图表展示类别（week,month）
        allPolice: [],
        cjrPolice: [],
        is_tz: '0',
        selectedDateVal: null, // 手动选择的日期
        selectedDeptVal: '', // 手动选择机构
        treeDefaultExpandedKeys: [], // 办案单位树默认展开keys
        caseTypeTree: [], // 警情类别树
        searchHeight: false, // 查询条件展开筛选
    };


    componentDidMount() {
        if (this.props.location.query && this.props.location.query.id) {
            this.setState({
                showDataView: false,
            });
        }
        if (this.props.location.state && this.props.location.state.rqType) {
            let data_ks = '';
            let data_js = '';
            let rqType = this.props.location.state.rqType;
            if (rqType === '3') {
                data_ks = moment(new Date()).add(-1, 'days').format('YYYY-MM-DD 08:00:00');
                data_js = moment(new Date()).format('YYYY-MM-DD 08:00:00');
            } else if (rqType === '6') {
                data_ks = moment().subtract('days', 31).format('YYYY-MM-DD 00:00:00');
                data_js = moment().subtract('days', 1).format('YYYY-MM-DD 23:59:59');
            } else if (rqType === '9') {
                data_ks = moment().subtract('days', 90).format('YYYY-MM-DD 00:00:00');
                data_js = moment().subtract('days', 1).format('YYYY-MM-DD 23:59:59');
            }
            this.props.form.setFieldsValue({
                jjsj: [moment(data_ks > '2019-06-01 00:00:00' ? data_ks : '2019-06-01 00:00:00'), moment(data_js)],
                cjdw: this.props.location.state.res.dw_code,
            });
            this.setState({
                showDataView: false,
                is_tz: '1',
                sfsa: '',
            }, () => {
                this.handleSearch();
            });
        } else {
            this.handleFormReset();
            const org = getQueryString(this.props.location.search, 'org') || '';
            const jjsj_js = getQueryString(this.props.location.search, 'jjsj_js') || '';
            const jjsj_ks = getQueryString(this.props.location.search, 'jjsj_ks') || '';
            const system_id = getQueryString(this.props.location.search, 'system_id') || '';
            if ((jjsj_js !== '') && (jjsj_ks !== '')) {
                this.props.form.setFieldsValue({
                    jjsj: [moment(jjsj_ks, 'YYYY-MM-DD'), moment(jjsj_js, 'YYYY-MM-DD')],
                });
            }
            const obj = {
                currentPage: 1,
                showCount: tableList,
                pd: {
                    org,
                    jjsj_js,
                    jjsj_ks,
                    system_id,
                    is_sa: '0',
                },
            };
            // this.getPolice(obj);
        }
        const jigouArea = sessionStorage.getItem('user');
        const newjigouArea = JSON.parse(jigouArea);
        this.getSourceOfAlarmDict(newjigouArea.department);
        this.getHandleStatusDict();
        this.getDepTree(newjigouArea.department);
        this.getCaseTypeTree(window.configUrl.is_ssds);
    }

    componentWillReceiveProps(nextProps) {
      // console.log('nextProps',nextProps);
        if (this.props.global.isResetList.isReset !== nextProps.global.isResetList.isReset && nextProps.global.isResetList.url ===  '/receivePolice/AlarmData') {
            // this.handleFormReset();
          const params = {
            currentPage: 1,
            showCount: tableList,
            pd: {
              ...this.state.formValues,
            },
          };
          this.getPolice(params);
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

    // 获取报警类别树
    getCaseTypeTree = (areaNum) => {
        this.setState({
            caseTypeTree: [],
        })
        this.props.dispatch({
            type: 'common/getPoliceTypeTree',
            payload: {
                ssds: areaNum,
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
    onChange = (activeKey) => {
        this.setState({
            activeKey,
        });
    };

    // 关闭页面
    onEdit = (targetKey, action) => {
        this[action](targetKey);  // this.remove(targetKey);
    };

    // 获取警情类别树
    getCaseTypeTree = (areaNum) => {
        this.setState({
            caseTypeTree: [],
        })
        this.props.dispatch({
            type: 'common/getPoliceTypeTree',
            payload: {
                ssds: areaNum,
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

    getPolice(param) {
        this.props.dispatch({
            type: 'policeData/policeFetch',
            payload: param ? param : '',
        });
    }

    // 获取所有警员
    getAllPolice = (name, cjr) => {
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
                        if (cjr) {
                            that.setState({
                                cjrPolice: data.slice(0, 50),
                            });
                        } else {
                            that.setState({
                                allPolice: data.slice(0, 50),
                            });
                        }
                    }
                },
            });
        }, 300);

    };
    handleAllPoliceOptionChange = (value, cjr) => {
        this.getAllPolice(value, cjr);
    };
    // 获取接警来源字典
    getSourceOfAlarmDict = (area) => {
        const org6 = area ? area.substring(0, 6) : '';
        this.props.dispatch({
            type: 'common/getDictTypeOld',
            payload: {
                // appCode: window.configUrl.appCode,
                // code: '2000',
                // org6,
                currentPage: 1,
                pd: {
                    pid: '2000',
                    org6,
                },
                showCount: 999,
            },
        });
    };
    // 获取警情处理状态字典
    getHandleStatusDict = () => {
        this.props.dispatch({
            type: 'common/getCaseManagementDicts',
            payload: {
                currentPage: 1,
                pd: {
                    zdbh: '3',
                },
                showCount: 999,
            },
        });
    };
    onRadioChange = (e) => {
        // console.log('radio checked', e.target.value);
        this.setState({
            sfsa: e.target.value,
        });
    };
    onRadioChange1 = (e) => {
        // console.log('radio checked', e.target.value);
        this.setState({
            sfcj: e.target.value,
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
    // 关闭页面链接的函数
    remove = (targetKey) => {
        let {activeKey} = this.state;
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
                break;
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
        this.getPolice(params);
    };
    // 查询
    handleSearch = (e) => {
        if (e) e.preventDefault();
        const values = this.props.form.getFieldsValue();
        const jjTime = values.jjsj;
        const tbTime = values.tbsj;
        const formValues = {
            bar: values.bar || '',
            cjdw: values.cjdw || '',
            cjr: values.cjr || '',
            jjdw: values.jjdw || '',
            jjly_dm: values.jjly || '',
            jjr: values.jjr || '',
            is_sa: values.sfsa || '',
            is_cj: values.sfcj || '',
            jqzt_dm: values.clzt || '',
            jqlb: values.jqlb ? values.jqlb[values.jqlb.length - 1] : '',
            jqlbdj: values.jqlb ? values.jqlb.length : '',
            jjsj_ks: jjTime && jjTime.length > 0 ? jjTime[0].format('YYYY-MM-DD HH:mm:ss') : '',
            jjsj_js: jjTime && jjTime.length > 0 ? jjTime[1].format('YYYY-MM-DD HH:mm:ss') : '',
            tbsj_ks: tbTime && tbTime.length > 0 ? tbTime[0].format('YYYY-MM-DD HH:mm:ss') : '',
            tbsj_js: tbTime && tbTime.length > 0 ? tbTime[1].format('YYYY-MM-DD HH:mm:ss') : '',
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
        this.getPolice(params);
        return false;
    };
    // 重置
    handleFormReset = () => {
        this.props.form.resetFields();
        this.props.form.setFieldsValue({
          // jjsj: [moment().format("YYYY-MM-DD 00:00:00"), moment().format("YYYY-MM-DD 23:59:59")],
          jjsj: [moment(moment().subtract(3, "days").format("YYYY-MM-DD 00:00:00"), 'YYYY-MM-DD 00:00:00'), moment(moment(), 'YYYY-MM-DD HH:mm:ss')],
        });
        this.setState({
            formValues: {
                is_sa: '0',
            },
            sfsa: '0',
            sfcj: '',
            allPolice: [],
            cjrPolice: [],
        });
        const obj = {
            currentPage: 1,
            showCount: tableList,
            pd: {
                is_sa: '0',
                is_tz: '0',
                jjsj_ks: moment(moment().subtract(3, "days").format("YYYY-MM-DD 00:00:00"),'YYYY-MM-DD 00:00:00'),
                jjsj_js: moment(moment(),'YYYY-MM-DD HH:mm:ss'),
            },
        };
        this.getPolice(obj);
    };
    // 导出
    exportData = () => {
        const values = this.props.form.getFieldsValue();
        const jjTime = values.jjsj;
        const tbTime = values.tbsj;
        const formValues = {
            bar: values.bar || '',
            cjdw: values.cjdw || '',
            cjr: values.cjr || '',
            jjdw: values.jjdw || '',
            jjly_dm: values.jjly || '',
            jjr: values.jjr || '',
            is_sa: values.sfsa || '',
            is_cj: values.sfcj || '',
            jqzt_dm: values.clzt || '',
            jqlb: values.jqlb ? values.jqlb[values.jqlb.length - 1] : '',
            jqlbdj: values.jqlb ? values.jqlb.length : '',
            jjsj_ks: jjTime && jjTime.length > 0 ? jjTime[0].format('YYYY-MM-DD HH:mm:ss') : '',
            jjsj_js: jjTime && jjTime.length > 0 ? jjTime[1].format('YYYY-MM-DD HH:mm:ss') : '',
            tbsj_ks: tbTime && tbTime.length > 0 ? tbTime[0].format('YYYY-MM-DD HH:mm:ss') : '',
            tbsj_js: tbTime && tbTime.length > 0 ? tbTime[1].format('YYYY-MM-DD HH:mm:ss') : '',

        };
        if (jjTime && jjTime.length > 0) {
            const isAfterDate = moment(formValues.jjsj_js).isAfter(moment(formValues.jjsj_ks).add(exportListDataMaxDays, 'days'));
            if (isAfterDate) { // 选择时间间隔应小于exportListDataMaxDays
                message.warning(`日期间隔需小于${exportListDataMaxDays}天`);
            } else {
                this.props.dispatch({
                    type: 'common/exportData',
                    payload: {
                        tableType: '1',
                        sqdd_type: '2',
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
    // 改变显示图表或列表
    changeListPageHeader = () => {
        const {showDataView} = this.state;
        this.setState({
            showDataView: !showDataView,
            // typeButtons: 'day',
        });
        // if(showDataView) this.handleFormReset();
    };
    // 设置手动选择日期
    setSelectedDate = (val) => {
        this.setState({
            typeButtons: 'selectedDate',
            selectedDateVal: val,
        });
    };
    // 设置手动选择机构
    setSelectedDep = (val) => {
        this.setState({
            selectedDeptVal: val,
        });
    };
    // 设置手动选择接警单位
    setJjdw = (val) => {
        this.setState({
            jjdw: val,
        });
    };
    // 设置手动选择处警单位
    setCjdw = (val) => {
        this.setState({
            cjdw: val,
        });
    };
    // 改变图表类别
    changeTypeButtons = (val) => {
        this.setState({
            typeButtons: val,
        });
    };
    // 图表点击跳转到列表页面
    changeToListPage = (name, dateArry) => {
        this.props.form.resetFields();
        this.setState({
            formValues: {
                is_sa: '0',
            },
            sfsa: '0',
            sfcj: '',
            allPolice: [],
            cjrPolice: [],
            showDataView: false,
            searchHeight:true,
        }, () => {
            this.props.form.setFieldsValue({
                jjsj: [moment(`${dateArry[0]} 00:00:00`, 'YYYY-MM-DD hh:mm:ss '), moment(`${dateArry[1]} 23:59:59`, 'YYYY-MM-DD hh:mm:ss')],
                sfsa: '',
                cjdw: this.state.cjdw || null,
                jjdw: this.state.jjdw || null,
                ...name,
            });
            this.handleSearch();
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

    filter = (inputValue, path) => {
        return (path.some(items => (items.searchValue).toLowerCase().indexOf(inputValue.toLowerCase()) > -1));
    };

    // 展开筛选和关闭筛选
    getSearchHeight = () => {
        this.setState({
            searchHeight: !this.state.searchHeight,
        });
    };

    renderForm() {
        const {form: {getFieldDecorator}, common: {sourceOfAlarmDict, depTree, handleStatusDict}} = this.props;
        const allPoliceOptions = this.state.allPolice.map(d => <Option key={`${d.idcard},${d.pcard}`}
                                                                       value={`${d.idcard},${d.pcard}$$`}
                                                                       title={d.name}>{`${d.name} ${d.pcard}`}</Option>);
        const cjrPoliceOptions = this.state.cjrPolice.map(d => <Option key={`${d.idcard},${d.pcard}`}
                                                                       value={`${d.idcard},${d.pcard}$$`}
                                                                       title={d.name}>{`${d.name} ${d.pcard}`}</Option>);
        const {caseTypeTree} = this.state;
        let sourceOfAlarmDictOptions = [];
        if (sourceOfAlarmDict.length > 0) {
            for (let i = 0; i < sourceOfAlarmDict.length; i++) {
                const item = sourceOfAlarmDict[i];
                sourceOfAlarmDictOptions.push(
                    <Option key={item.id} value={item.code}>{item.name}</Option>,
                );
            }
        }
        const handleStatusDictOptions = [];
        if (handleStatusDict && handleStatusDict.length > 0) {
            for (let i = 0; i < handleStatusDict.length; i++) {
                const item = handleStatusDict[i];
                handleStatusDictOptions.push(
                    <Option key={item.id} value={item.code}>{item.name}</Option>,
                );
            }
        }
        const formItemLayout = {
            labelCol: {xs: {span: 24}, md: {span: 8}, xl: {span: 6}, xxl: {span: 4}},
            wrapperCol: {xs: {span: 24}, md: {span: 16}, xl: {span: 18}, xxl: {span: 20}},
        };
        const rowLayout = {md: 8, xl: 16, xxl: 24};
        const colLayout = {sm: 24, md: 12, xl: 8};
        return (
            <Form onSubmit={this.handleSearch} style={{height: this.state.searchHeight ? 'auto' : '50px',}}>
                <Row gutter={rowLayout} className={styles.searchForm}>
                    <Col {...colLayout}>
                        <FormItem label="接警来源" {...formItemLayout}>
                            {getFieldDecorator('jjly', {
                                initialValue: this.state.jjly,
                            })(
                                <Select placeholder="请选择接警来源" style={{width: '100%'}}
                                        getPopupContainer={() => document.getElementById('tableListForm')}>
                                    <Option value="">全部</Option>
                                    {/*{involvedType !== undefined ? this.Option() : ''}*/}
                                    {sourceOfAlarmDictOptions}
                                </Select>,
                            )}
                        </FormItem>
                    </Col>
                    <Col {...colLayout}>
                        <FormItem label="管辖单位" {...formItemLayout}>
                            {getFieldDecorator('jjdw', {})(
                                <TreeSelect
                                    showSearch
                                    style={{width: '100%'}}
                                    dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                                    placeholder="请输入管辖单位"
                                    allowClear
                                    key='jjdwSelect'
                                    treeDefaultExpandedKeys={this.state.treeDefaultExpandedKeys}
                                    treeNodeFilterProp="title"
                                    getPopupContainer={() => document.getElementById('tableListForm')}
                                >
                                    {depTree && depTree.length > 0 ? this.renderloop(depTree) : []}
                                </TreeSelect>,
                            )}
                        </FormItem>
                    </Col>
                    <Col {...colLayout}>
                        <FormItem label="接警人" {...formItemLayout}>
                            {getFieldDecorator('jjr', {
                                // initialValue: this.state.caseType,
                                rules: [{max: 32, message: '最多输入32个字！'}],
                            })(
                                <Select
                                    mode="combobox"
                                    defaultActiveFirstOption={false}
                                    optionLabelProp='title'
                                    showArrow={false}
                                    filterOption={false}
                                    placeholder="请输入接警人"
                                    onChange={(value) => this.handleAllPoliceOptionChange(value, false)}
                                    onFocus={(value) => this.handleAllPoliceOptionChange(value, false)}
                                    getPopupContainer={() => document.getElementById('tableListForm')}
                                >
                                    {allPoliceOptions}
                                </Select>,
                            )}
                        </FormItem>
                    </Col>
                    <Col {...colLayout}>
                        <FormItem label="接警时间" {...formItemLayout}>
                            {getFieldDecorator('jjsj', {
                                // initialValue: this.state.jjsj,
                            })(
                                <RangePicker
                                    disabledDate={this.disabledDate}
                                    style={{width: '100%'}}
                                    showTime={{format: 'HH:mm:ss'}}
                                    format="YYYY-MM-DD HH:mm:ss"
                                    getCalendarContainer={() => document.getElementById('tableListForm')}
                                />,
                            )}
                        </FormItem>
                    </Col>
                    <Col {...colLayout}>
                        <FormItem label="处警单位" {...formItemLayout}>
                            {getFieldDecorator('cjdw', {
                                // initialValue: this.state.cjdw,
                            })(
                                <TreeSelect
                                    showSearch
                                    style={{width: '100%'}}
                                    dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                                    placeholder="请输入处警单位"
                                    allowClear
                                    key='cjdwSelect'
                                    treeDefaultExpandedKeys={this.state.treeDefaultExpandedKeys}
                                    treeNodeFilterProp="title"
                                    getPopupContainer={() => document.getElementById('tableListForm')}
                                >
                                    {depTree && depTree.length > 0 ? this.renderloop(depTree) : []}
                                </TreeSelect>,
                            )}
                        </FormItem>
                    </Col>
                    <Col {...colLayout}>
                        <FormItem label="处警人" {...formItemLayout}>
                            {getFieldDecorator('cjr', {
                                // initialValue: this.state.gzry,
                                rules: [{max: 32, message: '最多输入32个字！'}],
                            })(
                                <Select
                                    mode="combobox"
                                    defaultActiveFirstOption={false}
                                    optionLabelProp='title'
                                    showArrow={false}
                                    filterOption={false}
                                    placeholder="请输入处警人"
                                    onChange={(value) => this.handleAllPoliceOptionChange(value, true)}
                                    onFocus={(value) => this.handleAllPoliceOptionChange(value, true)}
                                    getPopupContainer={() => document.getElementById('tableListForm')}
                                >
                                    {cjrPoliceOptions}
                                </Select>,
                            )}
                        </FormItem>
                    </Col>
                    <Col {...colLayout}>
                        <FormItem label="报警类别" {...formItemLayout}>
                            {getFieldDecorator('jqlb', {})(
                                <Cascader
                                    options={caseTypeTree}
                                    placeholder="请选择报警类别"
                                    changeOnSelect={true}
                                    showSearch={
                                        {
                                            filter: (inputValue, path) => {
                                                return (path.some(items => (items.searchValue).indexOf(inputValue) > -1));
                                            },
                                            limit: 5,
                                        }
                                    }
                                    getPopupContainer={() => document.getElementById('tableListForm')}
                                />,
                            )}
                        </FormItem>
                    </Col>
                    <Col {...colLayout}>
                        <FormItem label="是否受案" {...formItemLayout}>
                            {getFieldDecorator('sfsa', {
                                initialValue: this.state.sfsa,
                            })(
                                <Radio.Group onChange={this.onRadioChange}>
                                    <Radio value=''>全部</Radio>
                                    <Radio value='1'>是</Radio>
                                    <Radio value='0'>否</Radio>
                                </Radio.Group>,
                            )}
                        </FormItem>
                    </Col>
                    <Col {...colLayout}>
                        <FormItem label={window.configUrl.is_area === '2' ? '是否分流' : '是否处警'} {...formItemLayout}>
                            {getFieldDecorator('sfcj', {
                                initialValue: this.state.sfcj,
                            })(
                                <Radio.Group onChange={this.onRadioChange1}>
                                    <Radio value=''>全部</Radio>
                                    <Radio value='1'>是</Radio>
                                    <Radio value='0'>否</Radio>
                                </Radio.Group>,
                            )}
                        </FormItem>
                    </Col>
                    <Col {...colLayout}>
                        <FormItem label="处理状态" {...formItemLayout}>
                            {getFieldDecorator('clzt', {})(
                                <Select placeholder="请选择处理状态" style={{width: '100%'}}
                                        getPopupContainer={() => document.getElementById('tableListForm')}>
                                    <Option value="">全部</Option>
                                    {handleStatusDictOptions}
                                </Select>,
                            )}
                        </FormItem>
                    </Col>
                </Row>

                <Row className={styles.search}>
            <span style={{float: 'right', marginBottom: 24, marginTop: 5}}>
              <Button
                  style={{marginLeft: 8}}
                  type="primary"
                  htmlType="submit"
              >
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


    // newArray() {
    //
    // }
    renderTable() {
        const {policeData: {police, loading}} = this.props;
        // console.log('policeData', this.props.policeData);
        return (
            <div>
                <RenderTable
                    loading={loading}
                    data={police}
                    onChange={this.handleTableChange}
                    dispatch={this.props.dispatch}
                    newDetail={this.newDetail}
                    getPolice={(params) => this.getPolice(params)}
                    location={this.props.location}
                    formValues={this.state.formValues}
                />
            </div>
        );
    }

    render() {
        const {policeData: {police, loading}, common: {depTree}} = this.props;
        const {arrayDetail} = this.state;
        const {showDataView, typeButtons, selectedDeptVal, selectedDateVal, jjdw, cjdw, treeDefaultExpandedKeys} = this.state;
        const orgcodeVal = selectedDeptVal !== '' ? JSON.parse(selectedDeptVal).id : '';
        let className = this.props.global && this.props.global.dark ? styles.listPageWrap : styles.listPageWrap + ' ' + styles.lightBox;
        return (
            <div className={this.props.location.query && this.props.location.query.id ? styles.onlyDetail : ''}>

                <div className={className}>
                    <div className={styles.listPageHeader}>
                        {
                            showDataView ? (
                                <a className={styles.listPageHeaderCurrent}><span>●</span>数据统计</a>
                            ) : (
                                <a className={styles.UnlistPageHeaderCurrent}
                                   onClick={this.changeListPageHeader}>数据统计</a>
                            )
                        }
                        <span className={styles.borderCenter}>|</span>
                        {
                            showDataView ? (
                                <a className={styles.UnlistPageHeaderCurrent}
                                   onClick={this.changeListPageHeader}>数据列表</a>
                            ) : (
                                <a className={styles.listPageHeaderCurrent}><span>●</span>数据列表</a>
                            )
                        }
                        {
                            showDataView ?
                                '' :
                                <div style={{float: 'right'}}>
                                    <Button className={styles.downloadBtn} icon="download"
                                            onClick={this.exportData}>导出表格</Button>
                                </div>
                        }

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
                            isPolice
                            setJjdw={this.setJjdw}
                            setCjdw={this.setCjdw}
                            treeDefaultExpandedKeys={treeDefaultExpandedKeys}
                            {...this.props}
                        />
                    </div>
                    <PoliceDataView
                        showDataView={showDataView}
                        searchType={typeButtons}
                        changeToListPage={this.changeToListPage}
                        orgcode={orgcodeVal}
                        selectedDateVal={selectedDateVal}
                        jjdw={jjdw}
                        cjdw={cjdw}
                        {...this.props}
                    />
                    <div style={showDataView ? {display: 'none'} : {display: 'block'}}>
                        <div className={styles.tableListForm} id='tableListForm'>
                            {this.renderForm()}
                        </div>
                        <div className={styles.tableListOperator}>
                            {this.renderTable()}
                        </div>
                    </div>
                </div>
                <SyncTime dataLatestTime={police.tbCount ? police.tbCount.tbsj : ''} {...this.props} />
            </div>
        );
    }
}
