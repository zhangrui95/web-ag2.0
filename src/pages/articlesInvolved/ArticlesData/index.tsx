/*
 * ItemRealData/index.js 涉案物品数据
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
    message,
    Input,
    Button,
    DatePicker,
    Tabs,
    TreeSelect,
    Icon,
} from 'antd';
import styles from '../../common/listPage.less';
import RenderTable from '../../../components/ItemRealData/RenderTable';
import {
    exportListDataMaxDays,
    getTimeDistance,
    getUserInfos,
    tableList,
} from '../../../utils/utils';
import ItemDataView from '../../../components/ItemRealData/ItemDataView';
import DataViewButtonArea from '../../../components/Common/DataViewButtonArea';
import moment from 'moment/moment';
import SyncTime from '../../../components/Common/SyncTime';

const FormItem = Form.Item;
const {Option} = Select;
const {RangePicker} = DatePicker;
const TabPane = Tabs.TabPane;
const TreeNode = TreeSelect.TreeNode;
let timeout;
let currentValue;

@connect(({itemData, loading, common, global}) => ({
    itemData,
    loading,
    common,
    global
    // loading: loading.models.alarmManagement,
}))
@Form.create()
export default class Index extends PureComponent {
    state = {
        wplx: '',
        wpzt: '',
        szkf: '',
        formValues: {},
        activeKey: '0',
        arrayDetail: [],
        allStorage: [],
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
        if (
            this.props.location.state &&
            this.props.location.state.code &&
            this.props.location.state.kssj &&
            this.props.location.state.jssj
        ) {
            this.setState({
                showDataView: false,
                dbzt: true,
                ccdw: this.props.location.state.code,
                rksj: [moment(this.props.location.state.kssj), moment(this.props.location.state.jssj)],
            });
            const formValues = {
                ccdw: this.props.location.state.code,
                rksj_ks: this.props.location.state.kssj,
                rksj_js: this.props.location.state.jssj,
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
            this.getItem(params);
        } else {
            const params = {
                currentPage: 1,
                showCount: tableList,
                pd: {},
            };
            this.itemFormReset();
            this.getItem(params);
            this.getItemsTypesDict();
            this.getItemsStorage();
            this.getItemStatus();
        }
        this.getDepTree(getUserInfos().department);
    }

    componentWillReceiveProps(nextProps) {
      if (this.props.global.isResetList.isReset !== nextProps.global.isResetList.isReset && nextProps.global.isResetList.url === '/articlesInvolved/ArticlesData') {
        const params = {
          currentPage: 1,
          showCount: tableList,
          pd: {
            ...this.state.formValues,
          },
        };
        this.getItem(params);
      }
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

    getItem(param) {
        this.props.dispatch({
            type: 'itemData/itemFetch',
            payload: param ? param : '',
        });
    }

    // 获取物品状态
    getItemStatus = () => {
        this.props.dispatch({
            type: 'common/getDictType',
            payload: {
                appCode: window.configUrl.appCode,
                code: '501126',
            },
        });
    };
    // 获取物品种类
    getItemsTypesDict = () => {
        this.props.dispatch({
            type: 'common/getDictType',
            payload: {
                appCode: window.configUrl.appCode,
                code: '501133',
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
                callback: data => {
                    if (data && currentValue === name) {
                        that.setState({
                            allStorage: data,
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
            if (item.childrenList && item.childrenList.length) {
                return (
                    <TreeNode value={item.code} key={item.code} title={item.name}>
                        {this.renderloop(item.childrenList)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.code} value={item.code} title={item.name}/>;
        });
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
    itemTableChange = (pagination, filtersArg, sorter) => {
        const {formValues} = this.state;
        const params = {
            pd: {
                ...formValues,
            },
            currentPage: pagination.current,
            showCount: pagination.pageSize,
        };
        this.getItem(params);
    };
    // 查询
    itemSearch = e => {
        e && e.preventDefault();
        const values = this.props.form.getFieldsValue();
        const rkTime = values.rksj;
        const djTime = values.djsj;
        const formValues = {
            wpmc: values.wpmc || '',
            wplx: values.wplx || '',
            ajbh: values.ajbh || '',
            szkf: values.szkf || '',
            ajmc: values.ajmc || '',
            wpzt: values.wpzt || '',
            ccdw: values.ccdw || '',
            rksj_ks: rkTime && rkTime.length > 0 ? rkTime[0].format('YYYY-MM-DD') : '',
            rksj_js: rkTime && rkTime.length > 0 ? rkTime[1].format('YYYY-MM-DD') : '',
            djrq_ks: djTime && djTime.length > 0 ? djTime[0].format('YYYY-MM-DD') : '',
            djrq_js: djTime && djTime.length > 0 ? djTime[1].format('YYYY-MM-DD') : '',
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
            formValues: {},
            rksj: null,
            ccdw: null,
            timeName: null,
        });
        const params = {
            currentPage: 1,
            showCount: tableList,
            pd: {},
        };
        this.getItem(params);
    };
    // 导出
    exportData = () => {
        const values = this.props.form.getFieldsValue();
        const rkTime = values.rksj;
        const djTime = values.djsj;
        const formValues = {
            wpmc: values.wpmc || '',
            wplx: values.wplx || '',
            ajbh: values.ajbh || '',
            szkf: values.szkf || '',
            ajmc: values.ajmc || '',
            wpzt: values.wpzt || '',
            ccdw: values.ccdw || '',
            rksj_ks: rkTime && rkTime.length > 0 ? rkTime[0].format('YYYY-MM-DD') : '',
            rksj_js: rkTime && rkTime.length > 0 ? rkTime[1].format('YYYY-MM-DD') : '',
            djrq_ks: djTime && djTime.length > 0 ? djTime[0].format('YYYY-MM-DD') : '',
            djrq_js: djTime && djTime.length > 0 ? djTime[1].format('YYYY-MM-DD') : '',
        };
        if ((rkTime && rkTime.length > 0) || (djTime && djTime.length > 0)) {
            const isAfterDate =
                rkTime && rkTime.length > 0
                    ? moment(formValues.rksj_js).isAfter(
                    moment(formValues.rksj_ks).add(exportListDataMaxDays, 'days'),
                    )
                    : moment(formValues.djrq_js).isAfter(
                    moment(formValues.djrq_ks).add(exportListDataMaxDays, 'days'),
                    );
            if (isAfterDate) {
                // 选择时间间隔应小于exportListDataMaxDays
                message.warning(`日期间隔需小于${exportListDataMaxDays}天`);
            } else {
                this.props.dispatch({
                    type: 'common/exportData',
                    payload: {
                        tableType: '5',
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
    handleAllStorageOptionChange = val => {
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
            // typeButtons:'week',
        });
        // if(showDataView) this.itemFormReset();
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
    // 展开筛选和关闭筛选
    getSearchHeight = () => {
        this.setState({
            searchHeight: !this.state.searchHeight,
        });
    };

    renderForm() {
        const {
            form: {getFieldDecorator},
            common: {itemsTypesDict, depTree, itemsStorage, itemStatusS, itemsTypesDictNew},
        } = this.props;
        let itemsTypesOptions = [],
            itemsStorageOptions = [],
            itemStatusOption = [];
        if (itemsTypesDictNew.length > 0) {
            for (let i = 0; i < itemsTypesDictNew.length; i++) {
                const item = itemsTypesDictNew[i];
                itemsTypesOptions.push(
                    <Option key={item.id} value={item.name}>
                        {item.name}
                    </Option>,
                );
            }
        }
        const allStorage = this.state.allStorage;
        if (allStorage.length > 0) {
            for (let i = 0; i < allStorage.length; i++) {
                const item = allStorage[i];
                itemsStorageOptions.push(
                    <Option key={item.kf_id} title={item.kf_name} value={item.kf_id.toString()}>
                        {item.kf_name}
                    </Option>,
                );
            }
        }
        if (itemStatusS.length > 0) {
            for (let i = 0; i < itemStatusS.length; i++) {
                const item = itemStatusS[i];
                itemStatusOption.push(
                    <Option key={item.id} value={item.name}>
                        {item.name}
                    </Option>,
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
            <Form
                onSubmit={this.itemSearch}
                style={{height: this.state.searchHeight ? 'auto' : '50px'}}
            >
                <Row gutter={rowLayout} className={styles.searchForm}>
                    <Col {...colLayout}>
                        <FormItem label="物品名称" {...formItemLayout}>
                            {getFieldDecorator('wpmc', {
                                // initialValue: this.state.caseType,
                                rules: [{max: 32, message: '最多输入32个字！'}],
                            })(<Input placeholder="请输入物品名称"/>)}
                        </FormItem>
                    </Col>
                    <Col {...colLayout}>
                        <FormItem label="物品种类" {...formItemLayout}>
                            {getFieldDecorator('wplx', {
                                initialValue: this.state.wplx,
                            })(
                                <Select placeholder="请选择" style={{width: '100%'}}
                                        getPopupContainer={() => document.getElementById('sawpsjtableListForm')}>
                                    <Option value="">全部</Option>
                                    {itemsTypesOptions}
                                </Select>,
                            )}
                        </FormItem>
                    </Col>
                    <Col {...colLayout}>
                        <FormItem label="所在库房" {...formItemLayout}>
                            {getFieldDecorator('szkf', {
                                // initialValue: this.state.szkf,
                            })(
                                <Select
                                    mode="combobox"
                                    placeholder="请输入所在库房"
                                    style={{width: '100%'}}
                                    defaultActiveFirstOption={false}
                                    optionLabelProp="title"
                                    showArrow={false}
                                    filterOption={false}
                                    onChange={this.handleAllStorageOptionChange}
                                    getPopupContainer={() => document.getElementById('sawpsjtableListForm')}
                                >
                                    {itemsStorageOptions}
                                </Select>,
                            )}
                        </FormItem>
                    </Col>
                    <Col {...colLayout}>
                        <FormItem label="案件编号" {...formItemLayout}>
                            {getFieldDecorator('ajbh', {
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
                        <FormItem label="物品状态" {...formItemLayout}>
                            {getFieldDecorator('wpzt', {
                                initialValue: this.state.wpzt,
                            })(
                                <Select placeholder="请选择" style={{width: '100%'}}
                                        getPopupContainer={() => document.getElementById('sawpsjtableListForm')}>
                                    <Option value="">全部</Option>
                                    {/*{involvedType !== undefined ? this.Option() : ''}*/}
                                    {itemStatusOption}
                                </Select>,
                            )}
                        </FormItem>
                    </Col>
                    {this.state.timeName && this.state.timeName === 'djsj' ? (
                        <Col {...colLayout}>
                            <FormItem label="登记时间" {...formItemLayout}>
                                {getFieldDecorator('djsj')(
                                    <RangePicker disabledDate={this.disabledDate} style={{width: '100%'}}
                                                 getCalendarContainer={() => document.getElementById('sawpsjtableListForm')}/>,
                                )}
                            </FormItem>
                        </Col>
                    ) : (
                        <Col {...colLayout}>
                            <FormItem label="入库时间" {...formItemLayout}>
                                {getFieldDecorator('rksj', {
                                    initialValue: this.state.rksj ? this.state.rksj : undefined,
                                })(<RangePicker disabledDate={this.disabledDate} style={{width: '100%'}}
                                                getCalendarContainer={() => document.getElementById('sawpsjtableListForm')}/>)}
                            </FormItem>
                        </Col>
                    )}
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
                                    key="badwSelect"
                                    treeDefaultExpandedKeys={this.state.treeDefaultExpandedKeys}
                                    treeNodeFilterProp="title"
                                    getPopupContainer={() => document.getElementById('sawpsjtableListForm')}
                                >
                                    {depTree && depTree.length > 0 ? this.renderloop(depTree) : null}
                                </TreeSelect>,
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row className={styles.search}>
          <span style={{float: 'right', marginBottom: 24, marginTop: 5}}>
            <Button style={{marginLeft: 8}} type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{marginLeft: 8}} onClick={this.itemFormReset} className={styles.empty}>
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
            itemData: {item, loading},
        } = this.props;
        return (
            <div>
                <RenderTable
                    loading={loading}
                    data={item}
                    onChange={this.itemTableChange}
                    dispatch={this.props.dispatch}
                    newDetail={this.newDetail}
                    tabBarStyle={{margin: 0}}
                    getItem={params => this.getItem(params)}
                    location={this.props.location}
                    formValues={this.state.formValues}
                />
            </div>
        );
    }

    // 图表点击跳转到列表页面
    changeToListPage = (name, dateArry) => {
        this.props.form.resetFields();
        this.setState({
            showDataView: false,
            timeName: name && name.timeName ? name.timeName : null,
            searchHeight:true,
        });
        this.props.form.setFieldsValue({
            [name && name.timeName ? name.timeName : 'rksj']: [
                moment(dateArry[0], 'YYYY-MM-DD'),
                moment(dateArry[1], 'YYYY-MM-DD'),
            ],
            ccdw: this.state.selectedDeptVal || null,
            ...name,
        });
        this.itemSearch();
    };

    render() {
        const {
            itemData: {item, loading},
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
        const orgcodeVal = selectedDeptVal !== '' ? JSON.parse(selectedDeptVal).id : '';
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
                    <ItemDataView
                        searchType={typeButtons}
                        showDataView={showDataView}
                        orgcode={selectedDeptVal}
                        selectedDateVal={selectedDateVal}
                        changeToListPage={this.changeToListPage}
                        {...this.props}
                    />
                    <div style={showDataView ? {display: 'none'} : {display: 'block'}}>
                        <div className={styles.tableListForm} id='sawpsjtableListForm'>{this.renderForm()}</div>
                        <div className={styles.tableListOperator}>{this.renderTable()}</div>
                    </div>
                </div>

                <SyncTime dataLatestTime={item.tbCount ? item.tbCount.tbsj : ''} {...this.props} />
            </div>
        );
    }
}
