import React, {Component, PureComponent} from 'react';
import moment from 'moment/moment';
import { connect } from 'dva';
import {Row, Col, Form, Select, Input, Button, Radio, DatePicker, Tabs, Card, Icon} from 'antd';
import styles from './index.less';
import RenderTable from '../../../components/MySuperviseRealData/RenderTable';
import { tableList, getQueryString, exportListDataMaxDays } from '../../../utils/utils';
import { message, TreeSelect } from 'antd/lib/index';
import stylescommon from '../../common/common.less';
import MessageState from '../../../components/Common/MessageState';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;
//
// @connect(({ MySuperviseData, loading, common }) => ({
//     MySuperviseData, loading, common,
//     // loading: loading.models.alarmManagement,
// }))
// @Form.create()
// export default class Index extends mySupervise {
class  mySupervise extends Component {
    state = {
        NowDataPage: '', // 督办完成时当前督办的数据在第几页
        NowShowCount: tableList, // 督办完成时当前督办的数据每页显示几条
        dbzt: getQueryString(this.props.location.search, 'dbzt') ? '20' : '',
        fkzt: getQueryString(this.props.location.search, 'fkzt') ? '1' : '',
        wtlxId: '',
        formValues: {},
        activeKey: '0',
        arrayDetail: [],
        searchHeight:false,
        yslx: '',
        zgzt:'',
    };

    componentDidMount() {
        if (getQueryString(this.props.location.search, 'fkzt') && getQueryString(this.props.location.search, 'dbzt')) {
            this.props.form.setFieldsValue({
                fkzt: getQueryString(this.props.location.search, 'fkzt'),
                dbzt: getQueryString(this.props.location.search, 'dbzt'),
            });
            this.handleSearch();
        } else {
            this.getMySupervise();
        }
        this.getProblemTypeDict();
        this.getBaqTypeDict();
        this.getSawpTypeDict();
        this.getJQTypeDict();
        this.getXZAJTypeDict();
        this.getWtlxDictionary();
        this.getSuperviseStatusDict();
        this.getYSLXTypeDic();
        this.getRectificationStatusDict();
        // const that = this;
        // window.addEventListener('keyup',function(e){
        //     if(e.which === 13){
        //         that.handleSearch();
        //     }
        // })
    }

    componentWillReceiveProps(nextProps) {
        if ((nextProps.location.pathname === this.props.location.pathname) && (nextProps.location.search !== this.props.location.search)) {
            // this.props.form.setFieldsValue({
            //   fkzt: getQueryString(nextProps.location.search, 'fkzt'),
            //   dbzt: getQueryString(nextProps.location.search, 'dbzt'),
            // })
            this.handleSearch();
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
    // 获取卷宗问题类型字典项
    getWtlxDictionary = () => {
        this.props.dispatch({
            type: 'common/getDictType',
            payload: {
                currentPage: 1,
                pd: {
                    pid: '5007725',
                },
                showCount: 999,
            },
        });
    };
    getYSLXTypeDic = () => {
        this.props.dispatch({
            type: 'common/getDictType',
            payload: {
                currentPage: 1,
                pd: {
                    pid: '2032',
                },
                showCount: 999,
            },
        });
    };
    // 获取整改完毕状态
    getRectificationStatusDict = () => {
        this.props.dispatch({
            type: 'common/getDictType',
            payload: {
                currentPage: 1,
                pd: {
                    pid: '500740',
                },
                showCount: 999,
            },
        });
    };
    // 获取问题类型字典项
    getProblemTypeDict = () => {
        this.props.dispatch({
            type: 'common/getDictType',
            payload: {
                currentPage: 1,
                pd: {
                    pid: '2016',
                },
                showCount: 999,
            },
        });
    };
    getBaqTypeDict = () => {
        this.props.dispatch({
            type: 'common/getDictType',
            payload: {
                currentPage: 1,
                pd: {
                    pid: '3',
                },
                showCount: 999,
            },
        });
    };
    getSawpTypeDict = () => {
        this.props.dispatch({
            type: 'common/getDictType',
            payload: {
                currentPage: 1,
                pd: {
                    pid: '2017',
                },
                showCount: 999,
            },
        });
    };
    getJQTypeDict = () => {
        this.props.dispatch({
            type: 'common/getDictType',
            payload: {
                currentPage: 1,
                pd: {
                    pid: '2068',
                },
                showCount: 999,
            },
        });


    };
    getXZAJTypeDict = () => {
        this.props.dispatch({
            type: 'common/getDictType',
            payload: {
                currentPage: 1,
                pd: {
                    pid: '6001',
                },
                showCount: 999,
            },
        });
    };
    // 获取督办状态类型字典项
    getSuperviseStatusDict = () => {
        this.props.dispatch({
            type: 'common/getDictType',
            payload: {
                currentPage: 1,
                pd: {
                    pid: '2039',
                },
                showCount: 999,
            },
        });
    };

    getMySupervise(param) {
        this.props.dispatch({
            type: 'MySuperviseData/MySuperviseFetch',
            payload: param ? param : '',
        });
    }

    // 刷新消息提示
    refreshNotice = () => {
        this.props.dispatch({
            type: 'MySuperviseData/MySuperviseCount',
            payload: {
                currentPage: 1,
                pd: {
                    dqzt: '0',
                    fkzt: '1',
                },
                showCount: 999999,
            },
        });
    };
    // 关闭页面链接的函数
    remove = (targetKey) => {
        let activeKey = this.state.activeKey;
        let lastIndex;
        this.state.arrayDetail.forEach((pane, i) => {
            if (pane.key === targetKey) {
                lastIndex = i - 1;
            }
        });
        const panes = this.state.arrayDetail.filter(pane => pane.key !== targetKey);
        if (lastIndex >= 0 && activeKey === targetKey) {
            activeKey = panes[lastIndex].key;
        }
        if (panes.length > 0) {
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
    onChangeRadio = (e) => {
        this.setState({
            fkzt: e.target.value,
        });
    };
    // 无法选择的日期
    disabledDate = (current) => {
        // Can not select days before today and today
        return current && current.valueOf() > Date.now();
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
        this.setState({
            NowDataPage: pagination.current,
            NowShowCount: pagination.pageSize,
        });
        this.getMySupervise(params);
    };
    // 查询
    handleSearch = (e) => {
        if (e) e.preventDefault();
        const values = this.props.form.getFieldsValue();
        const dbsjTime = values.dbsj;
        const fksjTime = values.fksj;
        const formValues = {
            ajbh: values.ajbh || '',
            ajmc: values.ajmc || '',
            wtlxId: values.wtlxId || '',
            fkzt: values.fkzt || '',
            dbzt: values.dbzt && values.dbzt.dbzt ? values.dbzt.dbzt : '',
            cljg_dm: values.dbzt && values.dbzt.zgzt ? values.dbzt.zgzt : '',
            dbsj_ks: dbsjTime && dbsjTime.length > 0 ? dbsjTime[0].format('YYYY-MM-DD') : '',
            dbsj_js: dbsjTime && dbsjTime.length > 0 ? dbsjTime[1].format('YYYY-MM-DD') : '',
            fksj_ks: fksjTime && fksjTime.length > 0 ? fksjTime[0].format('YYYY-MM-DD') : '',
            fksj_js: fksjTime && fksjTime.length > 0 ? fksjTime[1].format('YYYY-MM-DD') : '',
            wtflId: values.yslx || '',
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
        this.getMySupervise(params);
    };
    getSearchHeight = () => {
        this.setState({
            searchHeight:!this.state.searchHeight
        });
    }
    // 重置
    handleFormReset = () => {
        this.props.form.resetFields();
        this.setState({
            dbzt: '',
            fkzt: '',
            formValues: {},
        });
        this.getMySupervise();
    };
    // 导出
    exportData = () => {
        const values = this.props.form.getFieldsValue();
        const dbsjTime = values.dbsj;
        const fksjTime = values.fksj;
        const formValues = {
            ajbh: values.ajbh || '',
            ajmc: values.ajmc || '',
            wtlxId: values.wtlxId || '',
            fkzt: values.fkzt || '',
            dbzt: values.dbzt && values.dbzt.dbzt ? values.dbzt.dbzt : '',
            cljg_dm: values.dbzt && values.dbzt.zgzt ? values.dbzt.zgzt : '',
            dbsj_ks: dbsjTime && dbsjTime.length > 0 ? dbsjTime[0].format('YYYY-MM-DD') : '',
            dbsj_js: dbsjTime && dbsjTime.length > 0 ? dbsjTime[1].format('YYYY-MM-DD') : '',
            fksj_ks: fksjTime && fksjTime.length > 0 ? fksjTime[0].format('YYYY-MM-DD') : '',
            fksj_js: fksjTime && fksjTime.length > 0 ? fksjTime[1].format('YYYY-MM-DD') : '',
            wtflId: values.yslx || '',
        };
        if ((dbsjTime && dbsjTime.length > 0) || (fksjTime && fksjTime.length > 0)) {
            let dateArry = [];
            let dateArry2 = [];
            if (dbsjTime && dbsjTime.length > 0) {
                dateArry = [...dbsjTime];
            }
            if (fksjTime && fksjTime.length > 0) {
                dateArry2 = [...fksjTime];
            }
            const isAfterDate = dateArry.length > 0 ? moment(dateArry[1].format('YYYY-MM-DD')).isAfter(moment(dateArry[0].format('YYYY-MM-DD')).add(exportListDataMaxDays, 'days')) : true;
            const isAfterDate2 = dateArry2.length > 0 ? moment(dateArry2[1].format('YYYY-MM-DD')).isAfter(moment(dateArry2[1].format('YYYY-MM-DD')).add(exportListDataMaxDays, 'days')) : true;
            if (isAfterDate && isAfterDate2) { // 选择时间间隔应小于exportListDataMaxDays
                message.warning(`日期间隔需小于${exportListDataMaxDays}天`);
            } else {
                this.props.dispatch({
                    type: 'common/exportData',
                    payload: {
                        tableType: '11',
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

    renderForm() {
        console.log('this.props----->',this.props)
        const { form: { getFieldDecorator }, MySuperviseData: {common: { problemTypeDict, WtlxSawpTypeData, WtlxBaqTypeData, jqproblemTypeDict, WtlxXzAjTypeData, superviseStatusDict, JzCaseStatusType, YSLXType, rectificationStatusDict }} } = this.props;
        const ownSurpreWtlx = [];
        for (let a = 0; a < problemTypeDict.length; a++) {
            ownSurpreWtlx.push(problemTypeDict[a]);
        }
        for (let b = 0; b < WtlxSawpTypeData.length; b++) {
            ownSurpreWtlx.push(WtlxSawpTypeData[b]);
        }
        for (let c = 0; c < WtlxBaqTypeData.length; c++) {
            ownSurpreWtlx.push(WtlxBaqTypeData[c]);
        }
        for (let d = 0; d < jqproblemTypeDict.length; d++) {
            ownSurpreWtlx.push(jqproblemTypeDict[d]);
        }
        for (let f = 0; f < WtlxXzAjTypeData.length; f++) {
            ownSurpreWtlx.push(WtlxXzAjTypeData[f]);
        }
        for (let g = 0; g < JzCaseStatusType.length; g++) {
            ownSurpreWtlx.push(JzCaseStatusType[g]);
        }
        let problemTypeOptions = [];
        if (ownSurpreWtlx.length > 0) {
            for (let i = 0; i < ownSurpreWtlx.length; i++) {
                const item = ownSurpreWtlx[i];
                problemTypeOptions.push(
                    <Option key={item.id} value={item.code}>{item.name}</Option>,
                );
            }
        }
        let superviseStatusOptions = [];
        if (superviseStatusDict.length > 0) {
            for (let i = 0; i < superviseStatusDict.length; i++) {
                const item = superviseStatusDict[i];
                if (item.name !== '未督办') {
                    superviseStatusOptions.push(
                        <Option key={item.id} value={item.code}>{item.name}</Option>,
                    );
                }

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
        let YslxStatusOptions = [];
        if (YSLXType.length > 0) {
            for (let j = 0; j < YSLXType.length; j++) {
                const yslxOption = YSLXType[j];
                YslxStatusOptions.push(
                    <Option key={yslxOption.id} value={yslxOption.code}>{yslxOption.name}</Option>,
                );
            }
        }
        const colLayout = { sm: 24, md: 12, xl: 8 };
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, md: { span: 8 }, xl: { span: 6 }, xxl: { span: 5 } },
            wrapperCol: { xs: { span: 24 }, md: { span: 16 }, xl: { span: 18 }, xxl: { span: 19 } },
        };
        const rowLayout = { md: 8, xl: 16, xxl: 24 };
        return (
            <Card className={stylescommon.listPageWrap} id={'form'}>
                <Form onSubmit={this.handleSearch} layout="inline" style={{height:this.state.searchHeight ?  'auto' : '50px'}}>
                    <Row gutter={rowLayout} className={stylescommon.searchForm}>
                        <Col {...colLayout}>
                            <FormItem label="问题类型" {...formItemLayout}>
                                {getFieldDecorator('wtlxId', {
                                    initialValue: this.state.wtlxId,
                                })(
                                    <Select placeholder="请选择问题类型" style={{ width: '100%' }}  getPopupContainer={() => document.getElementById('form')}>
                                        <Option value="">全部</Option>
                                        {/*{involvedType !== undefined ? this.Option() : ''}*/}
                                        {problemTypeOptions}
                                    </Select>,
                                )}
                            </FormItem>
                        </Col>
                        <Col xl={8} md={12} sm={24}>
                            <FormItem label="案件名称" {...formItemLayout}>
                                {getFieldDecorator('ajmc', {
                                    // initialValue: this.state.MySuperviseType,
                                    rules: [{ max: 128, message: '最多输入128个字！' }],
                                })(
                                    <Input placeholder="请输入案件名称"/>,
                                )}
                            </FormItem>
                        </Col>
                        <Col xl={8} md={12} sm={24}>
                            <FormItem label="案件编号" {...formItemLayout}>
                                {getFieldDecorator('ajbh', {
                                    // initialValue: this.state.MySuperviseType,
                                    rules: [
                                        { pattern: /^[A-Za-z0-9]+$/, message: '请输入正确的案件编号！' },
                                        { max: 32, message: '最多输入32个字！' },
                                    ],
                                })(
                                    <Input placeholder="请输入案件编号"/>,
                                )}
                            </FormItem>
                        </Col>
                        <Col xl={8} md={12} sm={24}>
                            <FormItem label="督办时间" {...formItemLayout}>
                                {getFieldDecorator('dbsj', {
                                    // initialValue: this.state.ssbaq,
                                })(
                                    <RangePicker
                                        disabledDate={this.disabledDate}
                                        style={{ width: '100%' }}
                                        getCalendarContainer={() => document.getElementById('form')}
                                    />,
                                )}
                            </FormItem>
                        </Col>
                        <Col xl={8} md={12} sm={24}>
                            <FormItem label="反馈时间" {...formItemLayout}>
                                {getFieldDecorator('fksj', {
                                    // initialValue: this.state.ssbaq,
                                })(
                                    <RangePicker
                                        disabledDate={this.disabledDate}
                                        style={{ width: '100%' }}
                                        getCalendarContainer={() => document.getElementById('form')}
                                    />,
                                )}
                            </FormItem>
                        </Col>

                        <Col xl={8} md={12} sm={24}>
                            <FormItem label="是否反馈" {...formItemLayout}>
                                {getFieldDecorator('fkzt', {
                                    initialValue: this.state.fkzt,
                                })(
                                    <RadioGroup onChange={this.onChangeRadio}>
                                        <Radio value="">全部</Radio>
                                        <Radio value="1">反馈</Radio>
                                        <Radio value="0">未反馈</Radio>
                                    </RadioGroup>,
                                )}
                            </FormItem>
                        </Col>
                        <Col xl={8} md={12} sm={24}>
                            <FormItem label="督办状态" {...formItemLayout}>
                                {getFieldDecorator('dbzt', {
                                    initialValue: { dbzt: this.state.dbzt, zgzt: '' },
                                })(
                                    <MessageState superviseStatusOptions={superviseStatusOptions}
                                                  rectificationStatusOptions={rectificationStatusOptions}/>,
                                )}
                            </FormItem>
                        </Col>
                        <Col xl={8} md={12} sm={24}>
                            <FormItem label="要素类型" {...formItemLayout}>
                                {getFieldDecorator('yslx', {
                                    initialValue: this.state.yslx,
                                })(
                                    <Select placeholder="请选择要素类型" style={{ width: '100%' }}  getPopupContainer={() => document.getElementById('form')}>
                                        <Option value="">全部</Option>
                                        {YslxStatusOptions}
                                    </Select>,
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

    // 更新未读数据状态
    changeReadStatus = (id) => {
        this.props.dispatch({
            type: 'MySuperviseData/changeReadStatus',
            payload: {
                dbid: id,
            },
            callback: (data) => {
                if (data) {
                    this.refreshTable();
                    this.refreshNotice();
                }
            },
        });
    };
// 刷新列表
    refreshTable = () => {
        const { NowDataPage, NowShowCount, formValues } = this.state;
        const saveparam = {
            currentPage: NowDataPage !== '' ? NowDataPage : 1,
            showCount: NowShowCount !== '' ? NowShowCount : 1,
            pd: {
                ...formValues,
            },
        };
        this.getMySupervise(saveparam);
    };

    renderTable() {
        const { MySuperviseData: {MySuperviseData: { returnData, loading }} } = this.props;
        return (
            <div>
                <RenderTable
                    {...this.props}
                    loading={loading}
                    data={returnData}
                    onChange={this.handleTableChange}
                    dispatch={this.props.dispatch}
                    newDetail={this.newDetail}
                    refreshTable={this.refreshTable}
                    changeReadStatus={this.changeReadStatus}
                    formValues={this.state.formValues}
                />
            </div>
        );
    }

    render() {
        const newAddDetail = this.state.arrayDetail;
        return (
            <div className={stylescommon.statistics}>
                {/*<Card className={stylescommon.titleArea}>*/}
                {/*    我的督办*/}
                {/*    <div className={stylescommon.btnHeader}>*/}
                {/*        <Button*/}
                {/*            className={stylescommon.export}*/}
                {/*            onClick={this.exportData}*/}
                {/*        >*/}
                {/*            导出表格*/}
                {/*        </Button>*/}
                {/*    </div>*/}
                {/*</Card>*/}
                {this.renderForm()}
                <div className={stylescommon.btnTableBox}>
                    <Button onClick={this.exportData} icon="download">
                        导出表格
                    </Button>
                </div>
                {this.renderTable()}
                {/*<Tabs*/}
                {/*    hideAdd*/}
                {/*    onChange={this.onChange}*/}
                {/*    activeKey={this.state.activeKey}*/}
                {/*    type="editable-card"*/}
                {/*    onEdit={this.onEdit}*/}
                {/*    tabBarStyle={{ margin: 0 }}*/}
                {/*>*/}
                {/*    <TabPane tab='我的督办' key='0' closable={false}>*/}
                {/*        <div className={styles.listPageWrap}>*/}
                {/*            <div>*/}
                {/*                <div className={styles.tableListForm}>*/}
                {/*                    {this.renderForm()}*/}
                {/*                </div>*/}
                {/*                <div className={styles.tableListOperator}>*/}
                {/*                    {this.renderTable()}*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*    </TabPane>*/}
                {/*    {newAddDetail.map(pane => <TabPane tab={pane.title} key={pane.key}>{pane.content}</TabPane>)}*/}
                {/*</Tabs>*/}
            </div>
        );
    }
}
export default Form.create()(
    connect((MySuperviseData, loading, common) => ({ MySuperviseData, loading, common }))(mySupervise),
);
