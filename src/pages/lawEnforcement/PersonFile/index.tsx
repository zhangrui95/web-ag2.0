/*
* PersonalDoc 人员档案列表
* author：lyp
* 20181225
* */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {Row, Col, Form, Select, TreeSelect, Input, Button, DatePicker, Tabs, message, Cascader, Card, Icon} from 'antd';
import moment from 'moment/moment';
import styles from './index.less';
import PersonalDocTable from '../../../components/AllDocuments/PersonalDocTable';
import { exportListDataMaxDays, getQueryString, tableList } from '../../../utils/utils';
import SyncTime from '../../../components/Common/SyncTime';
import stylescommon from "@/pages/common/common.less";

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const TabPane = Tabs.TabPane;
const TreeNode = TreeSelect.TreeNode;

@connect(({ personDocData, loading, common }) => ({
    personDocData, common,
    loading: loading.models.personDocData,
}))
@Form.create()
export default class PersonalDoc extends PureComponent {
    state = {
        formValues: {},
        activeKey: '0',
        arrayDetail: [],
        is_tz: '0',
        treeDefaultExpandedKeys: [], // 办案单位树默认展开keys
        caseTypeTreeXZ: [], // 案件类别树
        caseTypeTreeXS: [], // 案件类别树
        ajlbqf:'', // 查询案件类别时的区分是行政还是刑事
    };

    componentDidMount() {
        this.getDepTree(JSON.parse(sessionStorage.getItem('user')).department);
        this.getEnforcementDictType();
        if (this.props.location.state && this.props.location.state.code && this.props.location.state.kssj && this.props.location.state.jssj) {
            const formValues = {
                cjrq_ks: this.props.location.state.kssj,
                cjrq_js: this.props.location.state.jssj,
                tbdw: this.props.location.state.code,
                is_tz: '1',
            };
            this.setState({
                formValues,
                is_tz: '1',
                tbdw: this.props.location.state.code,
                cjsj: [moment(this.props.location.state.kssj), moment(this.props.location.state.jssj)],
                salx:this.props.location.state.params.name,
            });
            const params = {
                currentPage: 1,
                showCount: tableList,
                pd: {
                    ...formValues,
                },
            };
            this.getPersonData(params);
        }
        else if(this.props.location&&this.props.location.queryChange){
            const{searchTime,qzcsName,departmentId,from}=this.props.location.queryChange;
            const qzcsfxqssj = searchTime?moment(searchTime).startOf('month').format('YYYY-MM-DD HH:mm:ss'):'';
            const qzcsfxzzsj = searchTime?moment(searchTime).endOf('month').format('YYYY-MM-DD HH:mm:ss'):'';
            if(from==='rylx'){
                this.props.form.setFieldsValue({
                    salx: qzcsName,
                    slsj: [moment(moment(searchTime).startOf('month').format('YYYY-MM-DD HH:mm:ss')), moment(moment(searchTime).endOf('month').format('YYYY-MM-DD HH:mm:ss'))],
                });
                const formValues = {
                    slqssj:qzcsfxqssj,
                    slzzsj:qzcsfxzzsj,
                    tbdw: departmentId,
                    is_tz: '1',
                    salx:qzcsName,
                };
                this.setState({
                    formValues,
                    is_tz: '1',
                    tbdw: departmentId,
                });
                const params = {
                    currentPage: 1,
                    showCount: tableList,
                    pd: {
                        ...formValues,
                    },
                };
                this.getPersonData(params);
            }
            else{
                this.props.form.setFieldsValue({
                    qzcslx: qzcsName,
                    qzcsfxsj: [moment(moment(searchTime).startOf('month').format('YYYY-MM-DD HH:mm:ss')), moment(moment(searchTime).endOf('month').format('YYYY-MM-DD HH:mm:ss'))],
                });
                const formValues = {
                    qzcsfxqssj:qzcsfxqssj,
                    qzcsfxzzsj:qzcsfxzzsj,
                    tbdw: departmentId,
                    is_tz: '1',
                    qzcsdm:qzcsName,
                };
                this.setState({
                    formValues,
                    is_tz: '1',
                    tbdw: departmentId,
                });
                const params = {
                    currentPage: 1,
                    showCount: tableList,
                    pd: {
                        ...formValues,
                    },
                };
                this.getPersonData(params);
            }

        }
        else {
            this.handleFormReset();
            this.getInvolvedType();
            this.getPersonData();
        }
        this.getCaseTypeTree(window.configUrl.is_area);
    }

    // 获取案件类别树
    getCaseTypeTree = (area) => {
        this.props.dispatch({
            type: area==='2'?'common/getPlCaseTypeTree':'common/getCaseTypeTree',
            payload: {
                ajlb: 'xs', // 案件类别xs,xz
                is_area:'0',
            },
            callback: (data) => {
                if (data.list) {
                    data.list.map((item) => {
                        item.lb = 'xs'
                    })
                    this.setState({
                        caseTypeTreeXS: data.list,
                    });
                }
            },
        });
        this.props.dispatch({
            type: area==='2'?'common/getPlCaseTypeTree':'common/getCaseTypeTree',
            payload: {
                ajlb: 'xz', // 案件类别xs,xz
                is_area:'0',
            },
            callback: (data) => {
                if (data.list) {
                    data.list.map((item) => {
                        item.lb = 'xz'
                    })
                    this.setState({
                        caseTypeTreeXZ: data.list,
                    });
                }
            },
        });
    };
    // 获取人员类型字典
    getInvolvedType = () => {
        this.props.dispatch({
            type: 'common/getDictType',
            payload: {
                currentPage: 1,
                pd: {
                    pid: '24',
                },
                showCount: 999,
            },
        });
    };
    // 获取人员强制措施字典
    getEnforcementDictType = () => {
        this.props.dispatch({
            type: 'common/getDictType',
            payload: {
                currentPage: 1,
                pd: {
                    pid: '501028',
                },
                showCount: 999,
            },
        });
    };
    // Tab change
    onChange = (activeKey) => {
        this.setState({
            activeKey,
        });
    };
    // 关闭页面
    onEdit = (targetKey, action) => {
        this[action](targetKey);  // this.remove(targetKey);
    };

    getPersonData(param) {
        this.props.dispatch({
            type: 'personDocData/getPersonData',
            payload: param ? param : { pd: {} },
        });
    }

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

    // 表格分页
    handleTableChange = (pagination, filtersArg, sorter) => {
        const { formValues } = this.state;
        const params = {
            pd: {
                ...formValues,
            },
            currentPage: pagination.current,
            showCount: pagination.pageSize,
        };
        this.getPersonData(params);
    };
    // 查询
    handleSearch = (e) => {
        if (e) e.preventDefault();
        const{ ajlbqf } = this.state;
        const values = this.props.form.getFieldsValue();
        const time = values.cjsj;
        const fxtime = values.qzcsfxsj;
        const sltime = values.slsj;
        const formValues = {
            ajbh: values.ajbh || '',
            ajmc: values.ajmc || '',
            name: values.name || '',
            salx: values.salx || '',
            sex: values.sex || '',
            sfzh: values.sfzh || '',
            qzcsdm: values.qzcslx || '',
            ajlb: values.ajlb ? values.ajlb[values.ajlb.length - 1] : '',
            ajlb_dl:values.ajlb ? values.ajlb[0] : '',
            ajlbqf:ajlbqf?ajlbqf:'',
            cjrq_ks: time && time.length > 0 ? time[0].format('YYYY-MM-DD') : '',
            cjrq_js: time && time.length > 0 ? time[1].format('YYYY-MM-DD') : '',
            tbdw: values.tbdw || '',
            is_tz: this.state.is_tz,
            qzcsfxqssj:fxtime && fxtime.length > 0 ? fxtime[0].format('YYYY-MM-DD HH:mm:ss') : '',
            qzcsfxzzsj:fxtime && fxtime.length > 0 ? fxtime[1].format('YYYY-MM-DD HH:mm:ss') : '',
            slqssj:sltime && sltime.length > 0 ? sltime[0].format('YYYY-MM-DD HH:mm:ss') : '',
            slzzsj:sltime && sltime.length > 0 ? sltime[1].format('YYYY-MM-DD HH:mm:ss') : '',
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
        this.getPersonData(params);
    };
    // 导出
    exportData = () => {
        const values = this.props.form.getFieldsValue();
        const time = values.cjsj;
        const fxtime = values.qzcsfxsj;
        const sltime = values.slsj;
        const formValues = {
            ajbh: values.ajbh || '',
            ajmc: values.ajmc || '',
            name: values.name || '',
            salx: values.salx || '',
            sex: values.sex || '',
            sfzh: values.sfzh || '',
            qzcsdm: values.qzcslx || '',
            ajlb: values.ajlb ? values.ajlb[values.ajlb.length - 1] : '',
            ajlb_dl:values.ajlb ? values.ajlb[0] : '',
            cjrq_ks: time && time.length > 0 ? time[0].format('YYYY-MM-DD') : '',
            cjrq_js: time && time.length > 0 ? time[1].format('YYYY-MM-DD') : '',
            tbdw: values.tbdw || '',
            qzcsfxqssj:fxtime && fxtime.length > 0 ? fxtime[0].format('YYYY-MM-DD HH:mm:ss') : '',
            qzcsfxzzsj:fxtime && fxtime.length > 0 ? fxtime[1].format('YYYY-MM-DD HH:mm:ss') : '',
            slqssj:sltime && sltime.length > 0 ? sltime[0].format('YYYY-MM-DD HH:mm:ss') : '',
            slzzsj:sltime && sltime.length > 0 ? sltime[1].format('YYYY-MM-DD HH:mm:ss') : '',
        };
        if (time && time.length > 0) {
            const isAfterDate = moment(formValues.cjrq_js).isAfter(moment(formValues.cjrq_ks).add(exportListDataMaxDays, 'days'));
            if (isAfterDate) { // 选择时间间隔应小于exportListDataMaxDays
                message.warning(`日期间隔需小于${exportListDataMaxDays}天`);
            } else {
                this.props.dispatch({
                    type: 'common/exportData',
                    payload: {
                        tableType: '32',
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
            tbdw: null,
            cjsj: null,
        });
        this.getPersonData();
    };
    CascaderOnChange = (value, selectedOptions) => {
        if(selectedOptions&&selectedOptions.length>0)
            this.setState({
                ajlbqf:selectedOptions[0].lb,
            })
    }
    // 无法选择的日期
    disabledDate = (current) => {
        // Can not select days before today and today
        return current && current.valueOf() > Date.now();
    };
    getSearchHeight = () => {
        this.setState({
            searchHeight:!this.state.searchHeight
        });
    }
    renderForm() {
        const { form: { getFieldDecorator }, common: { depTree, involvedType, enforcementTypeDict } } = this.props;
        const {caseTypeTreeXZ,caseTypeTreeXS} = this.state;
        let involvedTypeOptions = [];
        if (involvedType.length > 0) {
            for (let i = 0; i < involvedType.length; i++) {
                const item = involvedType[i];
                involvedTypeOptions.push(
                    <Option key={item.id} value={item.code}>{item.name}</Option>,
                );
            }
        }
        const enforcementTypeDictGroup = [];
        if (enforcementTypeDict.length > 0) {
            for (let i = 0; i < enforcementTypeDict.length; i++) {
                const item = enforcementTypeDict[i];
                enforcementTypeDictGroup.push(
                    <Option key={item.id} value={item.code}>{item.name}</Option>,
                );
            }
        }
        const caseTypeTree = [];
        caseTypeTreeXZ.map(item => (
            caseTypeTree.push(item)
        ));
        caseTypeTreeXS.map(item => (
            caseTypeTree.push(item)
        ));
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, md: { span: 8 }, xl: { span: 6 }, xxl: { span: 6 } },
            wrapperCol: { xs: { span: 24 }, md: { span: 16 }, xl: { span: 18 }, xxl: { span: 18 } },
        };
        const rowLayout = { md: 8, xl: 16, xxl: 24 };
        const colLayout = { sm: 24, md: 12, xl: 8 };
        return (
            <Card className={stylescommon.listPageWrap} id={'formPersonFile'}>
            <Form onSubmit={this.handleSearch} style={{height:this.state.searchHeight ?  'auto' : '50px'}}>
                <Row gutter={rowLayout} className={stylescommon.searchForm}>
                    <Col {...colLayout}>
                        <FormItem label="涉案人员" {...formItemLayout}>
                            {getFieldDecorator('name', {
                                // initialValue: this.state.caseType,
                                rules: [{ max: 32, message: '最多输入32个字！' }],
                            })(
                                <Input placeholder="请输入涉案人员"/>,
                            )}
                        </FormItem>
                    </Col>
                    <Col {...colLayout}>
                        <FormItem label="人员性别" {...formItemLayout}>
                            {getFieldDecorator('sex', {})(
                                <Select placeholder="请选择人员性别" style={{ width: '100%' }} getPopupContainer={() => document.getElementById('formPersonFile')}>
                                    <Option value="">全部</Option>
                                    <Option value="男">男</Option>
                                    <Option value="女">女</Option>
                                    <Option value="未知的性别">未知的性别</Option>
                                    <Option value="未说明的性别">未说明的性别</Option>
                                </Select>,
                            )}
                        </FormItem>
                    </Col>
                    <Col {...colLayout}>
                        <FormItem label="人员类型" {...formItemLayout}>
                            {getFieldDecorator('salx', {
                                initialValue: this.state.salx,
                            })(
                                <Select placeholder="请选择人员类型" style={{ width: '100%' }} getPopupContainer={() => document.getElementById('formPersonFile')}>
                                    <Option value="">全部</Option>
                                    {/*{involvedTypeOptions}*/}
                                    <Option key='01' value="01">犯罪嫌疑人</Option>
                                    <Option key='02' value="02">违法行为人</Option>
                                </Select>,
                            )}
                        </FormItem>
                    </Col>
                    <Col {...colLayout}>
                        <FormItem label="涉案人证件号" {...formItemLayout}>
                            {getFieldDecorator('sfzh', {
                                // initialValue: this.state.caseType,
                                rules: [{ max: 128, message: '最多输入128个字！' }],
                            })(
                                <Input placeholder="请输入涉案人证件号"/>,
                            )}
                        </FormItem>
                    </Col>
                    <Col {...colLayout}>
                        <FormItem label="案件名称" {...formItemLayout}>
                            {getFieldDecorator('ajmc', {
                                // initialValue: this.state.caseType,
                                rules: [{ max: 128, message: '最多输入128个字！' }],
                            })(
                                <Input placeholder="请输入案件名称"/>,
                            )}
                        </FormItem>
                    </Col>
                    <Col {...colLayout}>
                        <FormItem label="案件编号" {...formItemLayout}>
                            {getFieldDecorator('ajbh', {
                                // initialValue: this.state.caseType,
                                rules: [{ pattern: /^[A-Za-z0-9]+$/, message: '请输入正确的案件编号！' },
                                    { max: 32, message: '最多输入32个字！' }],
                            })(
                                <Input placeholder="请输入案件编号"/>,
                            )}
                        </FormItem>
                    </Col>
                    <Col {...colLayout}>
                        <FormItem label="办案单位" {...formItemLayout}>
                            {getFieldDecorator('tbdw', {
                                initialValue: this.state.tbdw ? this.state.tbdw : undefined,
                            })(
                                <TreeSelect
                                    showSearch
                                    style={{ width: '100%' }}
                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                    placeholder="请输入办案单位"
                                    allowClear
                                    key='cjdwSelect'
                                    treeDefaultExpandedKeys={this.state.treeDefaultExpandedKeys}
                                    treeNodeFilterProp="title"
                                    getPopupContainer={() => document.getElementById('formPersonFile')}
                                >
                                    {depTree && depTree.length > 0 ? this.renderloop(depTree) : null}
                                </TreeSelect>,
                            )}
                        </FormItem>
                    </Col>
                    <Col {...colLayout}>
                        <FormItem label="登记日期" {...formItemLayout}>
                            {getFieldDecorator('cjsj', {
                                initialValue: this.state.cjsj ? this.state.cjsj : undefined,
                            })(
                                <RangePicker
                                    disabledDate={this.disabledDate}
                                    style={{ width: '100%' }}
                                    getCalendarContainer={() => document.getElementById('formPersonFile')}
                                />,
                            )}
                        </FormItem>
                    </Col>
                    <Col {...colLayout}>
                        <FormItem label="强制措施" {...formItemLayout}>
                            {getFieldDecorator('qzcslx', {})(
                                <Select placeholder="请选择强制措施" style={{ width: '100%' }} getPopupContainer={() => document.getElementById('formPersonFile')}>
                                    <Option value="">全部</Option>
                                    {enforcementTypeDictGroup}
                                </Select>,
                            )}
                        </FormItem>
                    </Col>
                    <Col {...colLayout}>
                        <FormItem label="案件类别" {...formItemLayout}>
                            {getFieldDecorator('ajlb', {})(
                                <Cascader
                                    options={caseTypeTree.length>0?caseTypeTree:[]}
                                    placeholder="请选择案件类别"
                                    changeOnSelect='true'
                                    onChange={this.CascaderOnChange}
                                    getPopupContainer={() => document.getElementById('formPersonFile')}
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
                        <FormItem label="强制措施时间" {...formItemLayout}>
                            {getFieldDecorator('qzcsfxsj', {
                            })(
                                <RangePicker
                                    disabledDate={this.disabledDate}
                                    style={{ width: '100%' }}
                                    getCalendarContainer={() => document.getElementById('formPersonFile')}
                                />,
                            )}
                        </FormItem>
                    </Col>
                    <Col {...colLayout}>
                        <FormItem label="受理时间" {...formItemLayout}>
                            {getFieldDecorator('slsj', {
                            })(
                                <RangePicker
                                    disabledDate={this.disabledDate}
                                    style={{ width: '100%' }}
                                    getCalendarContainer={() => document.getElementById('formPersonFile')}
                                />,
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row className={stylescommon.search}>
                        <span style={{ float: 'right', marginBottom: 24 }}>
                          <Button style={{ marginLeft: 8 }} type="primary" onClick={this.handleSearch}>
                            查询
                          </Button>
                          <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset} className={stylescommon.empty}>
                            重置
                          </Button>
                          <Button style={{ marginLeft: 8 }} onClick={this.getSearchHeight} className={stylescommon.empty}>
                              {this.state.searchHeight ? '收起筛选' : '展开筛选'} <Icon type={this.state.searchHeight ? "up" :"down"}/>
                          </Button>
                        </span>
                </Row>
            </Form>
            </Card>
        );
    }

    renderTable() {
        const { personDocData: { personData }, loading } = this.props;
        return (
            <div>
                <PersonalDocTable
                    loading={loading}
                    data={personData}
                    onChange={this.handleTableChange}
                    newDetail={this.newDetail}
                    getPersonData={(params) => this.getPersonData(params)}
                    formValues={this.state.formValues}
                    {...this.props}
                />
            </div>
        );
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
    // 渲染机构树
    renderloop = data => data.map((item) => {
        if (item.childrenList && item.childrenList.length) {
            return <TreeNode value={item.code} key={item.code}
                             title={item.name}>{this.renderloop(item.childrenList)}</TreeNode>;
        }
        return <TreeNode key={item.code} value={item.code} title={item.name}/>;
    });

    render() {
        const { personDocData: { personData }, loading } = this.props;
        const newAddDetail = this.state.arrayDetail;
        return (
            <div>
                {this.renderForm()}
                <div className={stylescommon.btnTableBox}>
                    <Button onClick={this.exportData} icon="download">
                        导出表格
                    </Button>
                </div>
                {this.renderTable()}
                    {/*{newAddDetail.map((pane, idx) => <TabPane tab={pane.title} key={pane.key}*/}
                    {/*                                          closable={this.props.location.query && this.props.location.query.id && idx === 0 ? false : true}>{pane.content}</TabPane>)}*/}
                <SyncTime dataLatestTime={personData.tbCount ? personData.tbCount.tbsj : ''} {...this.props} />
            </div>
        );
    }
}
