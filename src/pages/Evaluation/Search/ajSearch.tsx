import React, {PureComponent} from 'react';
import {
    Modal,
    Form,
    Input,
    Select,
    message,
    button,
    Spin,
    Row,
    Col,
    TreeSelect,
    Cascader,
    Button,
    Card,
    DatePicker, Table, Tooltip, Empty, Icon,
} from 'antd';
import {connect} from 'dva';
import styles from './ajSearch.less';
import stylescommon1 from "@/pages/common/common.less";
import stylescommon2 from "@/pages/common/commonLight.less";
import noList from "@/assets/viewData/noList.png";
import {NavigationItem} from "@/components/Navigation/navigation";
import {routerRedux} from "dva/router";
import noListLight from "@/assets/viewData/noListLight.png";

const {RangePicker} = DatePicker;
const FormItem = Form.Item;
const TreeNode = TreeSelect.TreeNode;
const {Option} = Select;
let timeout;
let currentValue;

@connect(({common, AllCaseData,global}) => ({
    common, AllCaseData,global
}))
class AjSearch extends PureComponent {
    constructor(props, context) {
        super(props);
        let res = props.location.query.record;
        if (typeof res == 'string') {
            res = JSON.parse(sessionStorage.getItem('query')).query.record;
        }
        this.state = {
            allPolice: [],
            personList: [],
            selectedRowKeys: [],
            listChoice: [],
            selectedRows: [],
            treeDefaultExpandedKeys: [], // 办案单位树默认展开keys
            formValues: {
                is_area: window.configUrl.is_area,
            },
            record:res,
        };
    }

    componentDidMount() {
        const jigouArea = sessionStorage.getItem('user');
        const newjigouArea = JSON.parse(jigouArea);
        this.getSpecialCaseType();
        this.getCaseStatus(this.state.record.ajType);
        this.getCaseTypeTree(window.configUrl.is_area);
        this.getDepTree(newjigouArea.department);
        this.setState({
            first: true,
            ajType: this.state.record.ajType,
            ajlx: this.state.record.ajType,
        });
    }

    // componentWillReceiveProps(nextProps, nextContext) {
    //     if (this.props.srcName !== nextProps.srcName || this.props.ajType !== nextProps.ajType) {
    //         this.setState({
    //             first: true,
    //             ajType: nextProps.ajType ? nextProps.ajType : '',
    //             ajlx: nextProps.ajType,
    //         });
    //         this.handleFormReset(nextProps.ajType);
    //         this.getCaseStatus(nextProps.ajType);
    //     }
    // }

    getCase(param) {
        this.props.dispatch({
            type: 'AllCaseData/caseFetch',
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
    getCaseStatus = (ajType) => {
        this.props.dispatch({
            type: 'common/getDictType',
            payload: {
                appCode: window.configUrl.appCode,
                code: ajType === 'xs' ? '500719' : '500729',
            },
        });
    };
    // 获取案件类别树
    getCaseTypeTree = (areaNum) => {
        this.props.dispatch({
            type: areaNum === '2' ? 'common/getPlCaseTypeTree' : 'common/getCaseTypeTree',
            payload: {
                ajlb: this.state.ajType === 'xs' ? 'xs' : this.state.ajType === 'xz' ? 'xz' : 'xs,xz', // 案件类别xs,xz
                is_area: areaNum === '1' ? '1' : '0',
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
                    name,
                },
                callback: (data) => {
                    if (data && (currentValue === name)) {
                        that.setState({
                            allPolice: data,
                        });
                    }
                },
            });
        }, 300);

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
    handleSearch = (e, ajType) => {
        if (e) e.preventDefault();
        const values = this.props.form.getFieldsValue();
        const larqTime = values.larq;
        const tbsjTime = values.tbsj;
        const slrqTime = values.slrq;
        const formValues = {
            ajbh: values.ajbh ? values.ajbh.trim() : '',
            ajmc: values.ajmc ? values.ajmc.trim() : '',
            bardw_dm: values.bardw || '',
            bar: values.bar || '',
            ajzt_dm: values.ajzt || '',
            zxlb: values.zxlb || '',
            is_area: window.configUrl.is_area,
            ajlb_dm: values.ajlb ? values.ajlb[values.ajlb.length - 1] : '',
            larq_ks: larqTime && larqTime.length > 0 ? larqTime[0].format('YYYY-MM-DD') : '',
            larq_js: larqTime && larqTime.length > 0 ? larqTime[1].format('YYYY-MM-DD') : '',
            tbsj_ks: tbsjTime && tbsjTime.length > 0 ? tbsjTime[0].format('YYYY-MM-DD') : '',
            tbsj_js: tbsjTime && tbsjTime.length > 0 ? tbsjTime[1].format('YYYY-MM-DD') : '',
            slrq_ks: slrqTime && slrqTime.length > 0 ? slrqTime[0].format('YYYY-MM-DD') : '',
            slrq_js: slrqTime && slrqTime.length > 0 ? slrqTime[1].format('YYYY-MM-DD') : '',
            sldw_dm: values.sldw || '',
            ajlx: ajType && ajType === 'xs' ? '0' : ajType && ajType === 'xz' ? '1' : '',
        };
        this.setState({
            formValues,
            first: false,
        });
        const params = {
            currentPage: 1,
            showCount: 10,
            pd: {
                ...formValues,
            },
        };
        this.getCase(params);
    };
    // 重置
    handleFormReset = (ajType) => {
        this.props.form.resetFields();
        this.setState({
            formValues: {
                is_area: window.configUrl.is_area,
            },
            selectedRowsId: [],
            first: true,
        });
        const obj = {
            currentPage: 1,
            pd: {
                ajlx: ajType && ajType === 'xs' ? '0' : ajType && ajType === 'xz' ? '1' : '',
            },
            showCount: 10,
        };
        this.getCase(obj);
        // this.props.resetJz();
        // this.props.getChangeTables([], 0);
    };
    // 无法选择的日期
    disabledDate = (current) => {
        // Can not select days before today and today
        return current && current.valueOf() > Date.now();
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
    // 专项类别选择回调
    specialCaseOnChange = (value) => {
        this.props.form.setFieldsValue({
            ajlb: null,
        });
    };
    //确认选择
    getOk = () => {
        // this.props.handleCancel();
        // this.props.getChangeTables(this.state.selectedRowsId, 0);
        this.onEdit(true, this.state.selectedRowsId);
    };
    changeAjType = (e) => {
        this.setState({
            ajType: e,
        });
        this.handleFormReset(e);
    };
    getSearchHeight = () => {
        this.setState({
            searchHeight: !this.state.searchHeight,
        });
    };
    onEdit = (isReset, selectedRowsId) => {
        let key = '/Evaluation/File/Search/ajSearch' + this.props.location.query.id;
        // 删除当前tab并且将路由跳转至前一个tab的path
        const {dispatch} = this.props;
        if (dispatch) {
            dispatch(routerRedux.push({
                pathname: this.state.record.url,
                query: isReset ? {selectedRowsId: selectedRowsId,typeId:this.props.location.query.id} : {}
            }));
            if(isReset){
                dispatch({
                    type: 'global/changeResetList',
                    payload: {
                        isReset: !this.props.global.isResetList.isReset,
                        url:this.state.record.url
                    },
                });
            }
            dispatch({
                type: 'global/changeSessonNavigation',
                payload: {
                    key,
                    isShow: false,
                },
            });
            dispatch({
                type: 'global/changeNavigation',
                payload: {
                    key,
                    isShow: false,
                },
            });
        }
    };

    renderForm() {
        const {form: {getFieldDecorator}, common: {depTree, specialCaseType, CaseStatusType, XzCaseStatusType}} = this.props;
        const allPoliceOptions = this.state.allPolice.map(d => <Option key={`${d.idcard},${d.pcard}`}
                                                                       value={`${d.idcard},${d.pcard}$$`}
                                                                       title={d.name}>{`${d.name} ${d.pcard}`}</Option>);
        const formItemLayout = {
            labelCol: {xs: {span: 24}, md: {span: 8}, xl: {span: 7}, xxl: {span: 5}},
            wrapperCol: {xs: {span: 24}, md: {span: 16}, xl: {span: 17}, xxl: {span: 19}},
        };
        const rowLayout = {md: 8, xl: 16, xxl: 24};
        const colLayout = {sm: 24, md: 12, xl: 8};
        let specialCaseTypeOptions = [];
        if (specialCaseType.length > 0) {
            for (let i = 0; i < specialCaseType.length; i++) {
                const item = specialCaseType[i];
                specialCaseTypeOptions.push(
                    <Option key={item.id} value={item.code}>{item.name}</Option>,
                );
            }
        }
        let CaseStatusOption = [];
        if (CaseStatusType.length > 0) {
            for (let i = 0; i < CaseStatusType.length; i++) {
                const item = CaseStatusType[i];
                // if (item.code === '101' || item.code === '102') {
                    CaseStatusOption.push(
                        <Option key={item.id} value={item.code}>{item.name}</Option>,
                    );
                // }
            }
        }
        let XzCaseStatusOption = [];
        if (XzCaseStatusType.length > 0) {
            for (let i = 0; i < XzCaseStatusType.length; i++) {
                const item = XzCaseStatusType[i];
                XzCaseStatusOption.push(
                    <Option key={item.id} value={item.code}>{item.name}</Option>,
                );
            }
        }
        let stylescommon = this.props.global && this.props.global.dark ? stylescommon1 : stylescommon2;
        return (
            <Card style={{padding: '10px 0'}}>
                <Form onSubmit={(e) => this.handleSearch(e, this.state.ajType)}
                      style={{height: this.state.searchHeight ? 'auto' : '50px'}}>
                    <Row gutter={rowLayout} className={stylescommon.searchForm}>
                        {this.state.ajlx ? '' : <Col {...colLayout}>
                            <FormItem label="案件类型" {...formItemLayout}>
                                {getFieldDecorator('ajlx', {
                                    initialValue: this.state.ajType,
                                })(
                                    <Select placeholder="请选择" style={{width: '100%'}} onChange={this.changeAjType}
                                            getPopupContainer={() => document.getElementById('ajSearchBox'+this.props.location.query.id)}>
                                        <Option value="">全部</Option>
                                        <Option value="xs">刑事案件</Option>
                                        <Option value="xz">行政案件</Option>
                                    </Select>,
                                )}
                            </FormItem>
                        </Col>}
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
                        <Col md={8} sm={24}>
                            <FormItem label="案件名称" {...formItemLayout}>
                                {getFieldDecorator('ajmc', {
                                    // initialValue: this.state.caseType,
                                    // rules: [{max: 128, message: '最多输入128个字！'}],
                                })(
                                    <Input placeholder="请输入案件名称"/>,
                                )}
                            </FormItem>
                        </Col>
                        {this.state.ajType === 'xs' ? <Col {...colLayout}>
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
                                        getPopupContainer={() => document.getElementById('ajSearchBox'+this.props.location.query.id)}
                                        treeDefaultExpandedKeys={this.state.treeDefaultExpandedKeys}
                                        treeNodeFilterProp="title"
                                    >
                                        {depTree && depTree.length > 0 ? this.renderloop(depTree) : []}
                                    </TreeSelect>,
                                )}
                            </FormItem>
                        </Col> : ''}
                        {this.state.ajType === 'xz' ? <Col {...colLayout}>
                            <FormItem label="受理日期" {...formItemLayout}>
                                {getFieldDecorator('slrq', {
                                    initialValue: this.state.slrq ? this.state.slrq : undefined,
                                })(
                                    <RangePicker
                                        disabledDate={this.disabledDate}
                                        style={{width: '100%'}}
                                        getCalendarContainer={() => document.getElementById('ajSearchBox'+this.props.location.query.id)}
                                    />,
                                )}
                            </FormItem>
                        </Col> : ''}
                        {this.state.ajType === 'xs' ? <Col {...colLayout}>
                            <FormItem label="立案日期" {...formItemLayout}>
                                {getFieldDecorator('larq', {
                                    // initialValue: this.state.ssbaq,
                                })(
                                    <RangePicker
                                        disabledDate={this.disabledDate}
                                        style={{width: '100%'}}
                                        getCalendarContainer={() => document.getElementById('ajSearchBox'+this.props.location.query.id)}
                                    />,
                                )}
                            </FormItem>
                        </Col> : ''}
                        {this.state.ajType === 'xs' ? <Col {...colLayout}>
                            <FormItem label="案件状态" {...formItemLayout}>
                                {getFieldDecorator('ajzt', {
                                    initialValue: this.state.ajzt,
                                })(
                                    <Select placeholder="请选择" style={{width: '100%'}}
                                            getPopupContainer={() => document.getElementById('ajSearchBox'+this.props.location.query.id)}>
                                        <Option value="">全部</Option>
                                        {CaseStatusOption}
                                    </Select>,
                                )}
                            </FormItem>
                        </Col> : ''}
                        {this.state.ajType === 'xs' ? <Col {...colLayout}>
                            <FormItem label="&nbsp;&nbsp;&nbsp; 办案人" {...formItemLayout}>
                                {getFieldDecorator('bar', {
                                    // initialValue: this.state.gzry,
                                    //rules: [{max: 32, message: '最多输入32个字！'}],
                                })(
                                    <Select
                                        mode="combobox"
                                        defaultActiveFirstOption={false}
                                        optionLabelProp='title'
                                        showArrow={false}
                                        filterOption={false}
                                        placeholder="请输入办案人"
                                        onSearch={this.handleAllPoliceOptionChange}
                                        onFocus={this.handleAllPoliceOptionChange}
                                        getPopupContainer={() => document.getElementById('ajSearchBox'+this.props.location.query.id)}
                                    >
                                        {allPoliceOptions}
                                    </Select>,
                                )}
                            </FormItem>
                        </Col> : ''}
                        {this.state.ajType === 'xz' ? <Col {...colLayout}>
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
                                        key='cjdwSelect'
                                        treeDefaultExpandedKeys={this.state.treeDefaultExpandedKeys}
                                        getPopupContainer={() => document.getElementById('ajSearchBox'+this.props.location.query.id)}
                                        treeNodeFilterProp="title"
                                    >
                                        {depTree && depTree.length > 0 ? this.renderloop(depTree) : []}
                                    </TreeSelect>,
                                )}
                            </FormItem>
                        </Col> : ''}
                        {this.state.ajType === 'xz' ? <Col {...colLayout}>
                            <FormItem label="案件状态" {...formItemLayout}>
                                {getFieldDecorator('ajzt', {
                                    initialValue: this.state.ajzt,
                                })(
                                    <Select placeholder="请选择" style={{width: '100%'}}
                                            getPopupContainer={() => document.getElementById('ajSearchBox'+this.props.location.query.id)}>
                                        <Option value="">全部</Option>
                                        {XzCaseStatusOption}
                                    </Select>,
                                )}
                            </FormItem>
                        </Col> : ''}
                        {this.state.ajType === 'xz' ? <Col {...colLayout}>
                            <FormItem label="&nbsp;&nbsp;&nbsp; 办案人" {...formItemLayout}>
                                {getFieldDecorator('bar', {
                                    // initialValue: this.state.gzry,
                                    //rules: [{max: 32, message: '最多输入32个字！'}],
                                })(
                                    /*<Input placeholder="请输入办案人" />*/
                                    <Select
                                        mode="combobox"
                                        defaultActiveFirstOption={false}
                                        optionLabelProp='title'
                                        showArrow={false}
                                        filterOption={false}
                                        placeholder="请输入办案人"
                                        onSearch={this.handleAllPoliceOptionChange}
                                        onFocus={this.handleAllPoliceOptionChange}
                                        getPopupContainer={() => document.getElementById('ajSearchBox'+this.props.location.query.id)}
                                    >
                                        {allPoliceOptions}
                                    </Select>,
                                )}
                            </FormItem>
                        </Col> : ''}
                        {this.state.ajType === 'xs' ? <Col {...colLayout}>
                            <FormItem label="专项类别" {...formItemLayout}>
                                {getFieldDecorator('zxlb', {
                                    initialValue: this.state.zxlb,
                                })(
                                    <Select placeholder="请选择" style={{width: '100%'}}
                                            onChange={this.specialCaseOnChange}
                                            getPopupContainer={() => document.getElementById('ajSearchBox'+this.props.location.query.id)}>
                                        <Option value="">全部</Option>
                                        {specialCaseTypeOptions}
                                    </Select>,
                                )}
                            </FormItem>
                        </Col> : <Col {...colLayout}></Col>}
                        {this.state.ajType === 'xs' ? <Col {...colLayout}>
                            <FormItem label="案件类别" {...formItemLayout}>
                                {getFieldDecorator('ajlb', {
                                    // initialValue: this.state.caseAllType,
                                })(
                                    <Cascader
                                        options={this.state.caseTypeTree}
                                        placeholder="请选择案件类别"
                                        changeOnSelect={true}
                                        getPopupContainer={() => document.getElementById('ajSearchBox'+this.props.location.query.id)}
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
                        </Col> : <Col {...colLayout}></Col>}
                    </Row>
                    <Row className={stylescommon.search}>
                        <Col span={24}>
                        <span style={{float: 'right'}}>
                            <Button style={this.state.selectedRowsId && this.state.selectedRowsId.length > 0 ? {
                                marginLeft: 0,
                                color: this.props.global && this.props.global.dark ? '#2095FF' : '#4662d5',
                                border: this.props.global && this.props.global.dark ? '1px solid #2095FF' : '1px solid #4662d5',
                                background: 'transparent'
                            } : {marginLeft: 0}}
                                    type={this.state.selectedRowsId && this.state.selectedRowsId.length > 0 ? '' : 'primary'}
                                    htmlType="submit">查询</Button>
                            <Button style={{marginLeft: 8}}
                                    onClick={() => this.handleFormReset(this.state.ajType)}>重置</Button>
                            {this.state.ajType ? <Button
                                style={{marginLeft: 8}}
                                onClick={this.getSearchHeight}
                                className={stylescommon.empty}
                            >
                                {this.state.searchHeight ? '收起筛选' : '展开筛选'}{' '}
                                <Icon type={this.state.searchHeight ? 'up' : 'down'}/>
                            </Button> : ''}
                        </span>
                        </Col>
                    </Row>
                </Form>
            </Card>
        );
    }

    handleTableChanges = (pagination, filters, sorter) => {
        this.handleTableChange(pagination, filters, sorter);
        this.setState({
            current: pagination.current,
        });
    };

    renderTable() {
        const {AllCaseData: {returnData, loading}} = this.props;
        let data = this.state.first ? [] : returnData;
        let columns;
        let stylescommon = this.props.global && this.props.global.dark ? stylescommon1 : stylescommon2;
        columns = [
            {
                title: '案件编号',
                dataIndex: 'ajbh',
                render: (text) => {
                    return (
                        text && text.length <= 23 ? text :
                            <Tooltip title={text}>
                                <span>{text && text.substring(0, 23) + '...'}</span>
                            </Tooltip>
                    );
                },
            },
            {
                title: '案件名称',
                dataIndex: 'ajmc',
                render: (text) => {
                    return (
                        text && text.length <= 12 ? text :
                            <Tooltip title={text}>
                                <span>{text && text.substring(0, 12) + '...'}</span>
                            </Tooltip>
                    );
                },
            },
            {
                title: '案件类别',
                dataIndex: 'ajlb',
                render: (text) => {
                    return (
                        text && text.length <= 8 ? text :
                            <Tooltip title={text}>
                                <span>{text && text.substring(0, 8) + '...'}</span>
                            </Tooltip>
                    );
                },
            },
            this.state.ajType === 'xs' ? {
                title: '办案单位',
                dataIndex: 'bardwmc',
                render: (text) => {
                    return (
                        text && text.length <= 10 ? text :
                            <Tooltip title={text}>
                                <span>{text && text.substring(0, 10) + '...'}</span>
                            </Tooltip>
                    );
                },
            } : {
                title: '受理单位',
                dataIndex: 'sldw_name',
                render: (text) => {
                    return (
                        text && text.length <= 10 ? text :
                            <Tooltip title={text}>
                                <span>{text && text.substring(0, 10) + '...'}</span>
                            </Tooltip>
                    );
                },
            },
            {
                title: '办案人',
                dataIndex: 'bar',
                render: (text) => {
                    return (
                        text && text.length <= 8 ? text :
                            <Tooltip title={text}>
                                <span>{text && text.substring(0, 8) + '...'}</span>
                            </Tooltip>
                    );
                },
            },
            this.state.ajType === 'xs' ? {
                title: '立案日期',
                dataIndex: 'larq',
                render: (text) => {
                    return (
                        text && text.length <= 10 ? text :
                            <Tooltip title={text}>
                                <span>{text && text.substring(0, 10) + '...'}</span>
                            </Tooltip>
                    );
                },
            } : {
                title: '受理日期',
                dataIndex: 'slrq',
                render: (text) => {
                    return (
                        text && text.length <= 19 ? text :
                            <Tooltip title={text}>
                                <span>{text && text.substring(0, 19) + '...'}</span>
                            </Tooltip>
                    );
                },
            },
            {
                title: '案件状态',
                dataIndex: 'ajzt',
            },
        ];
        let paginationProps = {
            current: data && data.page ? data.page.currentPage : '',
            total: data && data.page ? data.page.totalResult : '',
            pageSize: data && data.page ? data.page.showCount : '',
            showTotal: (total, range) => (
                <span  className={stylescommon.pagination}>{`共 ${
                    data && data.page ? data.page.totalPage : 1
                    } 页，${data && data.page ? data.page.totalResult : 0} 条数据 `}</span>
            ),
        };
        const rowSelection = {
            selectedRowKeys: this.state.selectedRowsId,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRowsId: selectedRowKeys,
                    selectedRows,
                });
            },
            getCheckboxProps: record => ({
                disabled: record.name === 'Disabled User', // Column configuration not to be checked
            }),
        };
        return (
            <div id={'ajSearchBox'+this.props.location.query.id}>
                <div className={styles.standardTable}>
                    <Table
                        rowSelection={rowSelection}
                        loading={this.state.first ? false : loading}
                        rowKey={record => JSON.stringify(record)}
                        dataSource={this.state.first ? [] : data.list}
                        columns={columns}
                        pagination={paginationProps}
                        onChange={this.handleTableChanges}
                        locale={{
                            emptyText: <Empty image={this.props.global && this.props.global.dark ? noList : noListLight}
                                              description={'暂无数据'}/>
                        }}
                    />
                </div>
            </div>
        );
    }

    render() {
        let className = this.props.global && this.props.global.dark ? '' : styles.lightBox;
        return (
            <div className={className}>
                <div className={styles.tableListForm}>
                    {this.renderForm()}
                </div>
                <div className={styles.tableListOperator}>
                    {this.renderTable()}
                </div>
                <Card>
                    <div className={styles.btns}>
                        {/*<Button type="primary" style={{marginLeft: 8}} className={styles.qxBtn}*/}
                        {/*        onClick={() => this.onEdit(false)}>*/}
                        {/*    取消*/}
                        {/*</Button>*/}
                        <Button type="primary" style={{marginLeft: 8}}
                                className={this.state.selectedRowsId && this.state.selectedRowsId.length > 0 ? styles.okBtn : ''}
                                disabled={this.state.selectedRowsId && this.state.selectedRowsId.length > 0 ? false : true}
                                onClick={this.getOk}>
                            确认
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }
}

export default Form.create()(AjSearch);
