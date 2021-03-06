/*
 * handlingArea/index.tsx 办案区数据
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
    Icon,
} from 'antd';
import moment from 'moment/moment';
import styles from '../../common/listPage.less';
import RenderTable from '../../../components/AreaRealData/RenderTable';
import {exportListDataMaxDays, getUserInfos, tableList} from '../../../utils/utils';
import AreaDataView from '../../../components/AreaRealData/AreaDataView';
import DataViewButtonArea from '../../../components/Common/DataViewButtonArea';
import SyncTime from '../../../components/Common/SyncTime';

const FormItem = Form.Item;
const {Option} = Select;
const {RangePicker} = DatePicker;
const TabPane = Tabs.TabPane;
const TreeNode = TreeSelect.TreeNode;
const RadioGroup = Radio.Group;
let timeout;
let currentValue;

@connect(({areaData, loading, common, global}) => ({
    areaData,
    loading,
    common,
    global
    // loading: loading.models.alarmManagement,
}))
@Form.create()
export default class Index extends PureComponent {
    state = {
        salx: '',
        badw: '',
        zqzt: '',
        formValues: {},
        activeKey: '0',
        arrayDetail: [],
        allPolice: [],
        baqValue: [],
        typeButtons: 'week', // 图表展示类别（week,month）
        showDataView: true, // 控制显示图表或者列表（true显示图表）
        selectedDateVal: null, // 手动选择的日期
        selectedDeptVal: '', // 手动选择机构
        is_tz: '0',
        treeDefaultExpandedKeys: [], // 办案单位树默认展开keys
        searchHeight: false, // 查询条件展开筛选
    };

    componentDidMount() {
        if (this.props.location.query && this.props.location.query.id) {
            this.setState({
                showDataView: false,
            });
        }
        this.getAllList(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.global.isResetList.isReset !== nextProps.global.isResetList.isReset && nextProps.global.isResetList.url === '/handlingArea/AreaData') {
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
                this.getArea(params);
            }
        }
    }
    getAllList = (props) => {
        if (
            props.location.state &&
            props.location.state.code &&
            props.location.state.kssj &&
            props.location.state.jssj
        ) {
            this.setState({
                showDataView: false,
                dbzt: true,
                badw: props.location.state.code,
                rqsj: [moment(props.location.state.kssj), moment(props.location.state.jssj)],
                searchHeight:true,
            });
            const formValues = {
                badw: props.location.state.code,
                rqsj_ks: props.location.state.kssj,
                rqsj_js: props.location.state.jssj,
                is_tz: '1',
            };
            this.setState({
                formValues,
                is_tz: '1',
            });
            const params = {
                currentPage: 1,
                showCount: tableList,
                pd: {
                    ...formValues,
                },
            };
            this.getArea(params);
        } else {
            this.handleFormReset();
            const jigouArea = sessionStorage.getItem('user');
            const newjigouArea = JSON.parse(jigouArea);
            this.getArea();
            this.getInvolvedType();
            this.getRqyyType();
            this.getDepTree(newjigouArea.department);
            this.getBaqTree();
        }
    }
    onChange = activeKey => {
        this.setState({
            activeKey,
        });
    };
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
    // 关闭页面
    onEdit = (targetKey, action) => {
        this[action](targetKey); // this.remove(targetKey);
    };

    getArea(param) {
        this.props.dispatch({
            type: 'areaData/areaFetch',
            payload: param ? param : '',
        });
    }

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
    // 获取入区原因字典
    getRqyyType = () => {
        this.props.dispatch({
            type: 'common/getDictType',
            payload: {
                appCode: window.configUrl.appCode,
                code: '21',
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
        this.getArea(params);
    };
    // 查询
    handleSearch = e => {
        if (e) e.preventDefault();
        const values = this.props.form.getFieldsValue();
        const rqsj = values.rqsj;
        const formValues = {
            ajbh: values.ajbh ? values.ajbh.trim() : '',
            ajmc: values.ajmc ? values.ajmc.trim() : '',
            badw: values.badw || '',
            bar: values.bar || '',
            name: values.xm || '',
            salx: values.salx || '',
            ha_name: values.ssbaq || '',
            zt: values.zqzt || '',
            rqyy_dm: values.rqyy || '',
            rqsj_ks: rqsj && rqsj.length > 0 ? rqsj[0].format('YYYY-MM-DD') : '',
            rqsj_js: rqsj && rqsj.length > 0 ? rqsj[1].format('YYYY-MM-DD') : '',
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
        this.getArea(params);
    };
    // 重置
    handleFormReset = () => {
        this.props.form.resetFields();
        this.setState({
            formValues: {},
            zqzt: '',
            badw: null,
            rqsj: null,
        });
        this.getArea();
    };
    // 导出
    exportData = () => {
        const values = this.props.form.getFieldsValue();
        const rqsj = values.rqsj;
        const formValues = {
            ajbh: values.ajbh ? values.ajbh.trim() : '',
            ajmc: values.ajmc ? values.ajmc.trim() : '',
            badw: values.badw || '',
            bar: values.bar || '',
            name: values.xm || '',
            salx: values.salx || '',
            ha_name: values.ssbaq || '',
            zt: values.zqzt || '',
            rqyy_dm: values.rqyy || '',
            rqsj_ks: rqsj && rqsj.length > 0 ? rqsj[0].format('YYYY-MM-DD') : '',
            rqsj_js: rqsj && rqsj.length > 0 ? rqsj[1].format('YYYY-MM-DD') : '',
        };
        if (rqsj && rqsj.length > 0) {
            const isAfterDate = moment(formValues.rqsj_js).isAfter(
                moment(formValues.rqsj_ks).add(exportListDataMaxDays, 'days'),
            );
            if (isAfterDate) {
                // 选择时间间隔应小于exportListDataMaxDays
                message.warning(`日期间隔需小于${exportListDataMaxDays}天`);
            } else {
                this.props.dispatch({
                    type: 'common/exportData',
                    payload: {
                        tableType: '4',
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
    // 改变显示图表或列表
    changeListPageHeader = () => {
        const {showDataView} = this.state;
        this.setState({
            showDataView: !showDataView,
            // typeButtons:'week',
        });
        // if(showDataView) this.handleFormReset();
    };
    // 改变图表类别
    changeTypeButtons = val => {
        this.setState({
            typeButtons: val,
        });
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
    // 图表点击跳转到列表页面
    changeToListPage = (name, timeArry) => {
        // console.log('name',name);
        this.props.form.resetFields();
        this.setState(
            {
                showDataView: false,
                searchHeight:true,
            },
            () => {
                this.props.form.setFieldsValue({
                    rqsj: [moment(timeArry[0], 'YYYY-MM-DD'), moment(timeArry[1], 'YYYY-MM-DD')],
                    badw: this.state.selectedDeptVal || null,
                    ...name,
                });
                this.handleSearch();
            },
        );
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
            common: {involvedType, depTree, baqTree, rqyyType},
        } = this.props;
        const allPoliceOptions = this.state.allPolice.map(d => (
            <Option
                key={`${d.idcard},${d.pcard}`}
                value={`${d.idcard},${d.pcard}$$`}
                title={d.name}
            >{`${d.name} ${d.pcard}`}</Option>
        ));
        let involvedTypeOptions = [];
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
        let rqyyTypeOptions = [];
        if (rqyyType.length > 0) {
            rqyyType.map(item => {
                rqyyTypeOptions.push(
                    <Option key={item.id} value={item.code}>
                        {item.name}
                    </Option>,
                );
            });
        }
        const formItemLayout = {
            labelCol: {xs: {span: 24}, md: {span: 8}, xl: {span: 6}, xxl: {span: 5}},
            wrapperCol: {xs: {span: 24}, md: {span: 16}, xl: {span: 18}, xxl: {span: 19}},
        };
        const formItemLayouts = {
            labelCol: {xs: {span: 24}, md: {span: 8}, xl: {span: 4}, xxl: {span: 3}},
            wrapperCol: {xs: {span: 24}, md: {span: 16}, xl: {span: 19}, xxl: {span: 20}},
        };
        const rowLayout = {md: 8, xl: 16, xxl: 24};
        const colLayout = {sm: 24, md: 12, xl: 8};
        const colLayouts = {sm: 24, md: 12, xl: 12};
        return (
            <Form
                onSubmit={this.handleSearch}
                style={{height: this.state.searchHeight ? 'auto' : '50px'}}
            >
                <Row gutter={rowLayout} className={styles.searchForm}>
                    <Col {...colLayout}>
                        <FormItem label="涉案人员" {...formItemLayout}>
                            {getFieldDecorator('xm', {
                                // initialValue: this.state.caseType,
                                //rules: [{max: 32, message: '最多输入32个字！'}],
                            })(<Input placeholder="请输入涉案人员"/>)}
                        </FormItem>
                    </Col>
                    <Col {...colLayout}>
                        <FormItem label="人员类型" {...formItemLayout}>
                            {getFieldDecorator('salx', {
                                initialValue: this.state.salx,
                            })(
                                <Select
                                    placeholder="请选择"
                                    style={{width: '100%'}}
                                    getPopupContainer={() => document.getElementById('baqsjtableListForm')}
                                >
                                    <Option value="">全部</Option>
                                    {involvedTypeOptions}
                                </Select>,
                            )}
                        </FormItem>
                    </Col>
                    <Col {...colLayout}>
                        <FormItem label="&nbsp;&nbsp;&nbsp;&nbsp;办案人" {...formItemLayout}>
                            {getFieldDecorator('bar', {
                                // initialValue: this.state.caseType,
                                //rules: [{max: 32, message: '最多输入32个字！'}],
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
                                    getPopupContainer={() => document.getElementById('baqsjtableListForm')}
                                >
                                    {allPoliceOptions}
                                </Select>,
                            )}
                        </FormItem>
                    </Col>
                    <Col {...colLayout}>
                        <FormItem label="办案单位" {...formItemLayout}>
                            {getFieldDecorator('badw', {
                                initialValue: this.state.badw ? this.state.badw : undefined,
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
                                    getPopupContainer={() => document.getElementById('baqsjtableListForm')}
                                >
                                    {depTree && depTree.length > 0 ? this.renderloop(depTree) : []}
                                </TreeSelect>,
                            )}
                        </FormItem>
                    </Col>
                    <Col {...colLayout}>
                        <FormItem label="案件名称" {...formItemLayout}>
                            {getFieldDecorator('ajmc', {
                                // initialValue: this.state.caseType,
                                // rules: [{max: 128, message: '最多输入128个字！'}],
                            })(<Input placeholder="请输入案件名称"/>)}
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
                        <FormItem label="入区时间" {...formItemLayout}>
                            {getFieldDecorator('rqsj', {
                                initialValue: this.state.rqsj ? this.state.rqsj : undefined,
                            })(
                                <RangePicker
                                    disabledDate={this.disabledDate}
                                    style={{width: '100%'}}
                                    getCalendarContainer={() => document.getElementById('baqsjtableListForm')}
                                />,
                            )}
                        </FormItem>
                    </Col>
                    <Col {...colLayout}>
                        <FormItem label="所属办案区" {...formItemLayout}>
                            {getFieldDecorator('ssbaq', {
                                // initialValue: this.state.cjdw,
                            })(
                                <TreeSelect
                                    showSearch
                                    style={{width: '100%'}}
                                    // value={this.state.value}
                                    dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                                    placeholder="请输入办案区"
                                    allowClear
                                    key="cjdwSelect"
                                    treeNodeFilterProp="title"
                                    // onChange={this.onChange}
                                    getPopupContainer={() => document.getElementById('baqsjtableListForm')}
                                >
                                    {baqTree&&baqTree.length > 0 ? this.renderBaqloop(baqTree) : []}
                                </TreeSelect>,
                            )}
                        </FormItem>
                    </Col>
                    <Col {...colLayout}>
                        <FormItem label="入区原因" {...formItemLayout}>
                            {getFieldDecorator('rqyy', {
                                initialValue: this.state.rqyy,
                            })(
                                <Select
                                    placeholder="请选择"
                                    style={{width: '100%'}}
                                    getPopupContainer={() => document.getElementById('baqsjtableListForm')}
                                >
                                    <Option value="">全部</Option>
                                    {rqyyTypeOptions}
                                </Select>,
                            )}
                        </FormItem>
                    </Col>
                    <Col {...colLayouts} style={{marginLeft:8}}>
                        <FormItem label="在区状态" {...formItemLayouts}>
                            {getFieldDecorator('zqzt', {
                                initialValue: this.state.zqzt,
                            })(
                                <Radio.Group onChange={this.onRadioChange}>
                                    <Radio value="">全部</Radio>
                                    <Radio value="在区">在区</Radio>
                                    <Radio value="临时离区">临时离区</Radio>
                                    <Radio value="离区">离区</Radio>
                                    <Radio value="返回办案区">返回办案区</Radio>
                                </Radio.Group>,
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row className={styles.search}>
          <span style={{float: 'right', marginBottom: 24, marginTop: 5}}>
            <Button
                style={{marginLeft: 8}}
                type="primary"
                onClick={this.handleSearch}
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

    renderTable() {
        const {
            areaData: {area, loading},
        } = this.props;
        return (
            <div>
                <RenderTable
                    loading={loading}
                    data={area}
                    onChange={this.handleTableChange}
                    dispatch={this.props.dispatch}
                    newDetail={this.newDetail}
                    getArea={param => this.getArea(param)}
                    location={this.props.location}
                    formValues={this.state.formValues}
                />
            </div>
        );
    }

    render() {
        const newAddDetail = this.state.arrayDetail;
        const {
            areaData: {area, loading},
            common: {depTree},
        } = this.props;
        const {
            showDataView,
            typeButtons,
            selectedDeptVal,
            selectedDateVal,
            treeDefaultExpandedKeys,
        } = this.state;
        let className = this.props.global && this.props.global.dark ? styles.listPageWrap : styles.listPageWrap + ' ' + styles.lightBox;
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
                                <span>●</span>办案区列表
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
                            hideDayButton
                            treeDefaultExpandedKeys={treeDefaultExpandedKeys}
                            {...this.props}
                        />
                    </div>
                    <AreaDataView
                        searchType={typeButtons}
                        showDataView={showDataView}
                        orgcode={selectedDeptVal}
                        selectedDateVal={selectedDateVal}
                        changeListPageHeader={this.changeToListPage}
                        {...this.props}
                    />
                    <div style={showDataView ? {display: 'none'} : {display: 'block'}}>
                        <div className={styles.tableListForm} id="baqsjtableListForm">
                            {this.renderForm()}
                        </div>
                        <div className={styles.tableListOperator}>{this.renderTable()}</div>
                    </div>
                </div>
                <SyncTime dataLatestTime={area.tbCount ? area.tbCount.tbsj : ''} {...this.props} />
            </div>
        );
    }
}
