/*
* ArticlesPolice/index.tsx 涉案财物告警数据
* author：jhm
* 20180605
* */

import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Row, Col, Form, Select, message, Input, Button, DatePicker, Radio, Tabs, TreeSelect, Icon} from 'antd';
import moment from 'moment/moment';
import styles from '../../common/listPage.less';
import RenderTable from '../../../components/UnItemRealData/RenderTable';
import {exportListDataMaxDays, getQueryString, getUserInfos, tableList, userResourceCodeDb} from '../../../utils/utils';
// import SuperviseModal from '../../components/NewUnCaseRealData/SuperviseModal';
import UnItemDataView from '../../../components/UnItemRealData/UnItemDataView';
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

@connect(({UnItemData, loading, common, MySuperviseData, global}) => ({
    UnItemData, loading, common, MySuperviseData, global
    // loading: loading.models.alarmManagement,
}))
@Form.create()
export default class Index extends PureComponent {
    state = {
        NowDataPage: '', // 督办完成时当前督办的数据在第几页
        NowShowCount: '', // 督办完成时当前督办的数据每页显示几条
        // 督办模态框
        superviseVisibleModal: false,
        allPolice: [],
        wtlx: '',
        kwlx: '',
        wpzl: '',
        dbzt: '00',
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
        wpzt: '',
        allStorage: [],
        opendata: '', // 点击督办的案件
        showDataView: true, // 控制显示图表或者列表（true显示图表）
        wtid: '',
        Unitem: '',
        isDb: authorityIsTrue(userResourceCodeDb.item), // 督办权限
        selectedDateVal: null, // 手动选择的日期
        selectedDeptVal: '', // 手动选择机构
        typeButtons: 'day', // 图表展示类别（week,month）
        treeDefaultExpandedKeys: [], // 办案单位树默认展开keys
        searchHeight: false, // 查询条件展开筛选
    };

    componentDidMount() {
        this.getDepTree(getUserInfos().department);
        if (this.props.location.query && this.props.location.query.id) {
            this.setState({
                showDataView: false,
            });
        }
        this.getAllList(this.props);
        this.getProblemTypeDict();
        this.getSuperviseStatusDict();
        this.getRectificationStatusDict();
        this.getItemsTypesDict();
        this.getItemsStorage();
        this.getLibraryPositionType();
        this.getItemStatus();
    }

    getAllList = (props) => {
        if (props.location.state && props.location.state.code) {
            this.setState({
                showDataView: false,
                dbzt: '',
                ccdw: props.location.state.code,
                gjsj: [props.location.state.kssj ? moment(props.location.state.kssj) : null, props.location.state.jssj ? moment(props.location.state.jssj) : null],
                searchHeight:true,
            });
            this.props.form.setFieldsValue({
                kfgly: props.location.state.bar_name,
            });
            const formValues = {
                ccdw: props.location.state.code,
                gjsj_ks: props.location.state.kssj,
                gjsj_js: props.location.state.jssj,
                is_tz: props.location.state.is_tz ? props.location.state.is_tz : '1',
                kfgly: props.location.state.bar_name || '',
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
            this.getItem(params);
        } else {
            this.itemFormReset();
            const wtid = getQueryString(props.location.search, 'wtid') || '';
            if (wtid !== '') {
                const params = {
                    currentPage: 1,
                    showCount: tableList,
                    pd: {
                        wtid,
                    },
                };
                this.getItem(params);
            } else {
                this.getItem();
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.global.isResetList.isReset !== nextProps.global.isResetList.isReset && nextProps.global.isResetList.url === '/articlesInvolved/ArticlesPolice') {
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
                this.getItem(params);
            }
            this.setState({
                searchHeight:true,
            });
        }
    }

    // 获取问题类型
    getProblemTypeDict = () => {
        this.props.dispatch({
            type: 'common/getDictType',
            payload: {
                appCode: window.configUrl.appCode,
                code: '2017',
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
    // 获取物品种类
    getItemsTypesDict = () => {
        this.props.dispatch({
            type: 'common/getDictType',
            payload: {
                appCode: window.configUrl.appCode,
                code: '5308000',
            },
        });
    };
    // 获取库位类型
    getLibraryPositionType = () => {
        this.props.dispatch({
            type: 'common/getDictType',
            payload: {
                appCode: window.configUrl.appCode,
                code: '2049',
            },
        });
    };
    // 获取物品状态
    getItemStatus = () => {
        this.props.dispatch({
            type: 'common/getDictType',
            payload: {
                appCode: window.configUrl.appCode,
                code: '5315000',
            },
        });
    };
    // 获取仓库列表
    getItemsStorage = (name = '') => {
        const that = this;
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
        currentValue = name;
        timeout = setTimeout(function () {
            that.props.dispatch({
                type: 'common/getItemsStorage',
                payload: {
                    kf_name: name,
                },
                callback: (data) => {
                    if (data && (currentValue === name)) {
                        that.setState({
                            allStorage: data,
                        });
                    }
                },
            });
        }, 300);
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

    getItem(param) {
        const defaultParams = {
            currentPage: 1,
            showCount: tableList,
            pd: {
                dbzt: '00',
            },
        };
        this.props.dispatch({
            type: 'UnItemData/UnitemFetch',
            payload: param ? param : defaultParams,
            callback: (data) => {
                if (data) {
                    this.setState({
                        Unitem: data,
                    });
                }
            },
        });
    }

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
    itemTableChange = (pagination, filtersArg, sorter) => {
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
        this.getItem(params);
    };
    // 查询
    itemSearch = (e) => {
        if (e) e.preventDefault();
        const values = this.props.form.getFieldsValue();
        const gjTime = values.gjsj;
        const formValues = {
            gjsj_ks: gjTime && gjTime.length > 0 && gjTime[0] ? gjTime[0].format('YYYY-MM-DD') : '',
            gjsj_js: gjTime && gjTime.length > 0 && gjTime[1] ? gjTime[1].format('YYYY-MM-DD') : '',
            wtlx_id: values.wtlx || '',
            szkf_id: values.szkf ?  values.szkf.trim() : '',
            ajbh: values.ajbh ? values.ajbh.trim() : '',
            ajmc: values.ajmc ? values.ajmc.trim() : '',
            wpzt: values.wpzt || '',
            wpzl: values.wpzl || '',
            ccdw: values.ccdw || '',
            kfgly: values.kfgly || '',
            dbzt: values.dbzt && values.dbzt.dbzt ? values.dbzt.dbzt : '',
            cljg_dm: values.dbzt && values.dbzt.zgzt ? values.dbzt.zgzt : '',
            csfs: values.csfs || '',
            wpmc: values.wpmc ? values.wpmc.trim() : '',
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
        this.getItem(params);
    };
    // 重置
    itemFormReset = () => {
        this.props.form.resetFields();
        this.setState({
            formValues: {
                dbzt: '00',
            },
            gjsj: null,
            ccdw: null,
            dbzt: '00',
        });
        this.getItem();
    };
    // 导出
    exportData = () => {
        const values = this.props.form.getFieldsValue();
        const gjTime = values.gjsj;
        const formValues = {
            gjsj_ks: gjTime && gjTime.length > 0 ? gjTime[0].format('YYYY-MM-DD') : '',
            gjsj_js: gjTime && gjTime.length > 0 ? gjTime[1].format('YYYY-MM-DD') : '',
            wtlx_id: values.wtlx || '',
            szkf_id: values.szkf ?  values.szkf.trim() : '',
            ajbh: values.ajbh ? values.ajbh.trim() : '',
            ajmc: values.ajmc ? values.ajmc.trim() : '',
            wpzt: values.wpzt || '',
            wpzl: values.wpzl || '',
            ccdw: values.ccdw || '',
            kfgly: values.kfgly || '',
            dbzt: values.dbzt && values.dbzt.dbzt ? values.dbzt.dbzt : '',
            cljg_dm: values.dbzt && values.dbzt.zgzt ? values.dbzt.zgzt : '',
            csfs: values.csfs || '',
            wpmc: values.wpmc ? values.wpmc.trim() : '',
        };
        if (gjTime && gjTime.length > 0) {
            const isAfterDate = moment(formValues.gjsj_js).isAfter(moment(formValues.gjsj_ks).add(exportListDataMaxDays, 'days'));
            if (isAfterDate) { // 选择时间间隔应小于exportListDataMaxDays
                message.warning(`日期间隔需小于${exportListDataMaxDays}天`);
            } else {
                this.props.dispatch({
                    type: 'common/exportData',
                    payload: {
                        tableType: '10',
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
        this.getItem(saveparam);
    };
    // 打开督办模态框
    openModal = (opendata, flag, record) => {
        // alert(1)
        this.setState({
            superviseVisibleModal: !!flag,
            opendata: opendata,
            superviseWtlx: record.wtlxMc,
            superviseZrdw: record.kfgly_dwmc,
            superviseZrdwId: record.kfgly_dwdm,
            superviseZrr: record.kfgly,
            id: record.id,
            sfzh: record.kfgly_zjhm,
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
    Refresh = (flag) => {
        this.setState({
            superviseVisibleModal: !!flag,
        });
        this.refreshTable();
    };
    handleAllStorageOptionChange = (val) => {
        if (val.length > 64) {
            message.error('请输入小于64个字符！');
        } else {
            this.getItemsStorage(val);
        }
    };
    // 改变显示图表或列表
    changeListPageHeader = () => {
        const {showDataView} = this.state;
        this.setState({
            showDataView: !showDataView,
        });
        // if(showDataView) this.itemFormReset();
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
    // 改变图表类别
    changeTypeButtons = (val) => {
        this.setState({
            typeButtons: val,
        });
    };
    // 获取库管员信息
    handleAllPoliceOptionChange = (value) => {
        this.getAllPolice(value);
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
    // 图表点击跳转到列表页面
    changeToListPage = (name, dateArry) => {
        this.props.form.resetFields();
        this.setState({
            showDataView: false,
            searchHeight:true,
        }, () => {
            this.props.form.setFieldsValue({
                gjsj: [moment(dateArry[0], 'YYYY-MM-DD'), moment(dateArry[1], 'YYYY-MM-DD')],
                ccdw: this.state.selectedDeptVal || null,
                ...name,
            });

            this.itemSearch();
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
    getCsfs = (e) => {
        if (e !== '') {
            this.props.form.resetFields(['dbzt']);
            this.setState({
                dbzt: '',
            })
        }
    }
    // 展开筛选和关闭筛选
    getSearchHeight = () => {
        this.setState({
            searchHeight: !this.state.searchHeight,
        });
    };

    renderForm() {
        const {form: {getFieldDecorator}, common: {WtlxSawpTypeData, superviseStatusDict, itemsTypesDict, itemsStorage, libraryPositionType, itemStatusS, rectificationStatusDict, depTree}} = this.props;
        let problemTypeOptions = [], superviseStatusOptions = [], itemsTypesOptions = [], itemsStorageOptions = [],
            libraryPositionTypeOption = [], itemStatusOption = [];
        const allPoliceOptions = this.state.allPolice.map(d => <Option key={`${d.idcard},${d.pcard}`}
                                                                       value={`${d.idcard},${d.pcard}$$`}
                                                                       title={d.name}>{`${d.name} ${d.pcard}`}</Option>);
        if (WtlxSawpTypeData.length > 0) {
            for (let i = 0; i < WtlxSawpTypeData.length; i++) {
                const item = WtlxSawpTypeData[i];
                problemTypeOptions.push(
                    <Option key={item.id} value={item.code}>{item.name}</Option>,
                );
            }
        }
        if (superviseStatusDict.length > 0) {
            for (let i = 0; i < superviseStatusDict.length; i++) {
                const item = superviseStatusDict[i];
                superviseStatusOptions.push(
                    <Option key={item.id} value={item.code}>{item.name}</Option>,
                );
            }
        }
        let rectificationStatusOptions = [];
        if (rectificationStatusDict.length > 0) {
            for (let i = 0; i < rectificationStatusDict.length; i++) {
                const item = rectificationStatusDict[i];
                rectificationStatusOptions.push(
                    <Option key={item.id} value={item.code}>{item.name}</Option>,
                );
            }
        }
        if (itemsTypesDict.length > 0) {
            for (let i = 0; i < itemsTypesDict.length; i++) {
                const item = itemsTypesDict[i];
                itemsTypesOptions.push(
                    <Option key={item.id} value={item.code}>{item.name}</Option>,
                );
            }
        }
        const allStorage = this.state.allStorage;
        if (allStorage.length > 0) {
            for (let i = 0; i < allStorage.length; i++) {
                const item = allStorage[i];
                itemsStorageOptions.push(
                    <Option key={item.kf_id} title={item.kf_name}
                            value={(item.kf_id).toString()}>{item.kf_name}</Option>,
                );
            }
        }
        if (libraryPositionType.length > 0) {
            for (let i = 0; i < libraryPositionType.length; i++) {
                const item = libraryPositionType[i];
                libraryPositionTypeOption.push(
                    <Option key={item.id} value={item.code}>{item.name}</Option>,
                );
            }
        }
        if (itemStatusS.length > 0) {
            for (let i = 0; i < itemStatusS.length; i++) {
                const item = itemStatusS[i];
                itemStatusOption.push(
                    <Option key={item.id} value={item.name}>{item.name}</Option>,
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
            <Form onSubmit={this.itemSearch}
                  style={{height: this.state.searchHeight ? 'auto' : '50px', position: 'relative'}}>
                <Row gutter={rowLayout} className={styles.searchForm}>
                    <Col {...colLayout}>
                        <FormItem label="问题类型" {...formItemLayout}>
                            {getFieldDecorator('wtlx', {
                                initialValue: this.state.wtlx,
                            })(
                                <Select placeholder="请选择问题类型" style={{width: '100%'}}
                                        getPopupContainer={() => document.getElementById('sawpgjtableListForm')}>
                                    <Option value="">全部</Option>
                                    {problemTypeOptions}
                                </Select>,
                            )}
                        </FormItem>
                    </Col>
                    <Col {...colLayout}>
                        <FormItem label="物品名称" {...formItemLayout}>
                            {getFieldDecorator('wpmc', {
                                // initialValue: this.state.caseType,
                                // rules: [{max: 128, message: '最多输入128个字！'}],
                            })(
                                <Input placeholder="请输入案件名称"/>,
                            )}
                        </FormItem>
                    </Col>
                    <Col {...colLayout}>
                        <FormItem label="物品种类" {...formItemLayout}>
                            {getFieldDecorator('wpzl', {
                                initialValue: this.state.wpzl,
                            })(
                                <Select placeholder="请选择物品种类" style={{width: '100%'}}
                                        getPopupContainer={() => document.getElementById('sawpgjtableListForm')}>
                                    <Option value="">全部</Option>
                                    {itemsTypesOptions}
                                </Select>,
                            )}
                        </FormItem>
                    </Col>
                    <Col {...colLayout}>
                        <FormItem label="所在库房" {...formItemLayout}>
                            {getFieldDecorator('szkf', {
                                // initialValue: this.state.caseType,
                            })(
                                <Select
                                    mode="combobox"
                                    placeholder="请输入所在库房"
                                    style={{width: '100%'}}
                                    defaultActiveFirstOption={false}
                                    optionLabelProp='title'
                                    showArrow={false}
                                    filterOption={false}
                                    onChange={this.handleAllStorageOptionChange}
                                    getPopupContainer={() => document.getElementById('sawpgjtableListForm')}
                                >
                                    {itemsStorageOptions}
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
                            })(
                                <Input placeholder="请输入案件编号"/>,
                            )}
                        </FormItem>
                    </Col>
                    <Col {...colLayout}>
                        <FormItem label="案件名称" {...formItemLayout}>
                            {getFieldDecorator('ajmc', {
                                // initialValue: this.state.caseType,
                                // rules: [{max: 128, message: '最多输入128个字！'}],
                            })(
                                <Input placeholder="请输入案件名称"/>,
                            )}
                        </FormItem>
                    </Col>
                    <Col {...colLayout}>
                        <FormItem label="物品状态" {...formItemLayout}>
                            {getFieldDecorator('wpzt', {
                                initialValue: this.state.wpzt,
                            })(
                                <Select placeholder="请选择物品状态" style={{width: '100%'}}
                                        getPopupContainer={() => document.getElementById('sawpgjtableListForm')}>
                                    <Option value="">全部</Option>
                                    {/*{involvedType !== undefined ? this.Option() : ''}*/}
                                    {itemStatusOption}
                                </Select>,
                            )}
                        </FormItem>
                    </Col>
                    <Col {...colLayout}>
                        <FormItem label="消息状态" {...formItemLayout}>
                            {getFieldDecorator('dbzt', {
                                initialValue: {dbzt: this.state.dbzt, zgzt: ''},
                            })(
                                <MessageState superviseStatusOptions={superviseStatusOptions}
                                              rectificationStatusOptions={rectificationStatusOptions}
                                              newId='sawpgjtableListForm'/>,
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
                                    getCalendarContainer={() => document.getElementById('sawpgjtableListForm')}
                                />,
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={rowLayout} className={styles.searchForm}>
                    <Col {...colLayout}>
                        <FormItem label="产生方式" {...formItemLayout}>
                            {getFieldDecorator('csfs', {
                                initialValue: '',
                            })(
                                <Select placeholder="请选择产生方式" style={{width: '100%'}} onChange={this.getCsfs}
                                        getPopupContainer={() => document.getElementById('sawpgjtableListForm')}>
                                    <Option value="">全部</Option>
                                    <Option value="系统判定">系统判定</Option>
                                    <Option value="人工判定">人工判定</Option>
                                </Select>,
                            )}
                        </FormItem>
                    </Col>
                    <Col {...colLayout}>
                        <FormItem label="存储单位" {...formItemLayout}>
                            {getFieldDecorator('ccdw', {
                                initialValue: this.state.ccdw ? this.state.ccdw : undefined,
                            })(
                                <TreeSelect
                                    showSearch
                                    style={{width: '100%'}}
                                    dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                                    placeholder="请输入存储单位"
                                    allowClear
                                    key='badwSelect'
                                    treeDefaultExpandedKeys={this.state.treeDefaultExpandedKeys}
                                    treeNodeFilterProp="title"
                                    getPopupContainer={() => document.getElementById('sawpgjtableListForm')}
                                >
                                    {depTree && depTree.length > 0 ? this.renderloop(depTree) : []}
                                </TreeSelect>,
                            )}
                        </FormItem>
                    </Col>
                    <Col {...colLayout}>
                        <FormItem label="库管员" {...formItemLayout}>
                            {getFieldDecorator('kfgly', {
                                //rules: [{max: 32, message: '最多输入32个字！'}],
                            })(
                                <Select
                                    mode="combobox"
                                    defaultActiveFirstOption={false}
                                    optionLabelProp='title'
                                    showArrow={false}
                                    filterOption={false}
                                    placeholder="请输入库管员"
                                    onChange={this.handleAllPoliceOptionChange}
                                    onFocus={this.handleAllPoliceOptionChange}
                                    getPopupContainer={() => document.getElementById('sawpgjtableListForm')}
                                >
                                    {allPoliceOptions}
                                </Select>,
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row className={styles.search} style={{position: 'absolute', top: 0, right: 32}}>
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
                  onClick={this.itemFormReset}
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
        const {UnItemData: {Unitem, loading}} = this.props;
        return (
            <div>
                <RenderTable
                    data={Unitem}
                    onChange={this.itemTableChange}
                    newDetail={this.newDetail}
                    // 打开督办模态框
                    openModal={this.openModal}
                    refreshTable={this.refreshTable}
                    {...this.props}
                    getItem={(params) => this.getItem(params)}
                    formValues={this.state.formValues}
                    isDb={this.state.isDb}
                />
            </div>
        );
    }

    render() {
        const newAddDetail = this.state.arrayDetail;
        const {superviseVisibleModal, showDataView, typeButtons, selectedDeptVal, selectedDateVal, treeDefaultExpandedKeys} = this.state;
        const {common: {depTree}} = this.props;
        let className = this.props.global && this.props.global.dark ? styles.listPageWrap : styles.listPageWrap + ' ' + styles.lightBox;
        return (
            <div className={this.props.location.query && this.props.location.query.id ? styles.onlyDetail : ''}>
                <div className={className}>
                    <div className={styles.listPageHeader}>
                        {
                            showDataView ? (
                                <a className={styles.listPageHeaderCurrent}><span>●</span>告警统计</a>
                            ) : (
                                <a className={styles.UnlistPageHeaderCurrent}
                                   onClick={this.changeListPageHeader}>告警统计</a>
                            )
                        }
                         <span className={styles.borderCenter}>|</span>
                        {
                            showDataView ? (
                                <a className={styles.UnlistPageHeaderCurrent}
                                   onClick={this.changeListPageHeader}>告警列表</a>
                            ) : (
                                <a className={styles.listPageHeaderCurrent}><span>●</span>告警列表</a>
                            )
                        }
                        {
                            showDataView ?
                                '' :
                                <div style={{float: 'right'}}>
                                    <Button className={styles.downloadBtn}
                                            onClick={this.exportData}
                                            icon="download">导出表格</Button>
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
                            hideWeekButton={true}
                            hideMonthButton={true}
                            treeDefaultExpandedKeys={treeDefaultExpandedKeys}
                            {...this.props}
                        />
                    </div>
                    <UnItemDataView
                        style={{display: 'none'}}
                        changeToListPage={this.changeToListPage}
                        showDataView={showDataView}
                        searchType={typeButtons}
                        orgcode={selectedDeptVal}
                        selectedDateVal={selectedDateVal}
                        {...this.props}
                    />
                    <div style={showDataView ? {display: 'none'} : {display: 'block'}}>
                        <div className={styles.tableListForm} id='sawpgjtableListForm'>
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
                {/*// saveModal={this.saveModal}*/}
                {/*caseDetails={this.state.opendata}*/}
                {/*getRefresh={this.Refresh}*/}
                {/*// 点击列表的督办显示的四个基本信息*/}
                {/*wtlx={this.state.superviseWtlx}*/}
                {/*wtid={this.state.wtid}*/}
                {/*// zrdw={this.state.superviseZrdw}*/}
                {/*// zrdwId={this.state.superviseZrdwId}*/}
                {/*// zrr={this.state.superviseZrr}*/}
                {/*id={this.state.id}*/}
                {/*// zjhm={this.state.sfzh}*/}
                {/*from='督办'*/}
                {/*/>*/}
                {/*: ''*/}
                {/*}*/}
            </div>
        );
    }
}
