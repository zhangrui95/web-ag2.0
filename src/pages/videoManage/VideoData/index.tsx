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
import RenderTable from '../../../components/videoManage/RenderTable';
import DataView from '../../../components/videoManage/DataView';
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
        this.getDepTree(newjigouArea.department);
        this.getCaseStatus();
      this.getCaseTypeTree(window.configUrl.is_area);
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

    onChange = (activeKey) => {
        this.setState({
            activeKey,
        });
    };

    // 关闭页面
    onEdit = (targetKey, action) => {
        this[action](targetKey);  // this.remove(targetKey);
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
        // const values = this.props.form.getFieldsValue();
        this.props.form.validateFields((err, values) => {
          if (!err) {
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
          }
        })
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
            is_fl: window.configUrl.is_area === '2' ? '1' : '0',
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
      console.log('val-------->',val)
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
  // 获取案件类别树
  getCaseTypeTree = (areaNum) => {
    this.props.dispatch({
      type: areaNum === '2' ? 'common/getPlCaseTypeTree' : 'common/getCaseTypeTree',
      payload: {
        ajlb: 'xs,xz', // 案件类别xs,xz
        is_area: '0',
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
            labelCol: {xs: {span: 12}, md: {span: 8}, xl: {span: 7}, xxl: {span: 8}},
            wrapperCol: {xs: {span: 12}, md: {span: 16}, xl: {span: 17}, xxl: {span: 16}},
        };
        const rowLayout = {md: 8, xl: 16, xxl: 24};
        const colLayout = {sm: 24, md: 12, xl: 12, xxl:8};
      const {common: { XzCaseStatusType}} = this.props;
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
            <Form onSubmit={this.handleSearch} style={{height: this.state.searchHeight ? 'auto' : '50px',}}>
                <Row gutter={rowLayout} className={styles.searchForm}>
                  <Col {...colLayout}>
                    <FormItem label="案件编号" {...formItemLayout}>
                      {getFieldDecorator('ajbh', {
                        // initialValue: this.state.MySuperviseType,
                      })(
                        <Input placeholder="请输入案件编号"/>,
                      )}
                    </FormItem>
                  </Col>
                  <Col {...colLayout}>
                    <FormItem label="案件名称" {...formItemLayout}>
                      {getFieldDecorator('ajmc')(
                        <Input placeholder="请输入案件名称"/>,
                      )}
                    </FormItem>
                  </Col>
                    <Col {...colLayout}>
                        <FormItem label="办案单位" {...formItemLayout}>
                            {getFieldDecorator('badw', {})(
                                <TreeSelect
                                    showSearch
                                    style={{width: '100%'}}
                                    dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                                    placeholder="请输入办案单位"
                                    allowClear
                                    key='jjdwSelect'
                                    treeDefaultExpandedKeys={this.state.treeDefaultExpandedKeys}
                                    treeNodeFilterProp="title"
                                    getPopupContainer={() => document.getElementById('videoListForm')}
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
                        <Select placeholder="请选择案件状态" style={{width: '100%'}}
                                getPopupContainer={() => document.getElementById('videoListForm')}>
                          <Option value="">全部</Option>
                          {XzCaseStatusOption}
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
                          getPopupContainer={() => document.getElementById('videoListForm')}
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
                        <FormItem label="办案人" {...formItemLayout}>
                            {getFieldDecorator('bar', {
                                // initialValue: this.state.caseType,
                                //rules: [{max: 32, message: '最多输入32个字！'}],
                            })(
                                <Select
                                    mode="combobox"
                                    defaultActiveFirstOption={false}
                                    optionLabelProp='title'
                                    showArrow={false}
                                    filterOption={false}
                                    placeholder="请输入办案人"
                                    onChange={(value) => this.handleAllPoliceOptionChange(value, false)}
                                    onFocus={(value) => this.handleAllPoliceOptionChange(value, false)}
                                    getPopupContainer={() => document.getElementById('videoListForm')}
                                >
                                    {allPoliceOptions}
                                </Select>,
                            )}
                        </FormItem>
                    </Col>
                  <Col {...colLayout}>
                    <FormItem label="警情编号" {...formItemLayout}>
                      {getFieldDecorator('wjmc', {
                      })(
                        <Input placeholder="请输入警情编号"/>,
                      )}
                    </FormItem>
                  </Col>
                    <Col {...colLayout}>
                        <FormItem label="视频录制/上传日期" {...formItemLayout}>
                            {getFieldDecorator('lzrq', {
                                // initialValue: this.state.jjsj,
                            })(
                                <RangePicker
                                    disabledDate={this.disabledDate}
                                    style={{width: '100%'}}
                                    showTime={{format: 'HH:mm:ss'}}
                                    format="YYYY-MM-DD HH:mm:ss"
                                    getCalendarContainer={() => document.getElementById('videoListForm')}
                                />,
                            )}
                        </FormItem>
                    </Col>
                    <Col {...colLayout}>
                        <FormItem label="音视频来源" {...formItemLayout}>
                            {getFieldDecorator('ysply', {
                                initialValue: this.state.ysply,
                            })(
                                <Radio.Group onChange={this.onRadioChange}>
                                    <Radio value=''>全部</Radio>
                                    <Radio value='1'>办案区</Radio>
                                    <Radio value='0'>执法记录仪</Radio>
                                </Radio.Group>,
                            )}
                        </FormItem>
                    </Col>
                  <Col {...colLayout}>
                    <FormItem label="文件名称" {...formItemLayout}>
                      {getFieldDecorator('wjmc', {
                      })(
                        <Input placeholder="请输入文件名称"/>,
                      )}
                    </FormItem>
                  </Col>
                  <Col {...colLayout}>
                    <FormItem label="是否关联" {...formItemLayout}>
                      {getFieldDecorator('sfgl', {
                        initialValue: this.state.sfgl,
                      })(
                        <Radio.Group onChange={this.onRadioChange}>
                          <Radio value=''>全部</Radio>
                          <Radio value='1'>已关联</Radio>
                          <Radio value='0'>未关联</Radio>
                        </Radio.Group>,
                      )}
                    </FormItem>
                  </Col>
                  <Col {...colLayout}>
                    <FormItem label="文件类型" {...formItemLayout}>
                      {getFieldDecorator('wjlx', {
                        initialValue: this.state.wjlx,
                      })(
                        <Radio.Group onChange={this.onRadioChange}>
                          <Radio value=''>全部</Radio>
                          <Radio value='1'>视频</Radio>
                          <Radio value='0'>音频</Radio>
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
       let data = {list:[
         {id:'dssyueyhfhsagg1',wj_mc:'20191203打架视频',wjlbmc:'视频',sprq:'2019-12-03',sply:'办案区',ajmc:'孙军殴打李芳案',ajlb:'殴打他人',badw:'抚顺公安局',bar:'张扬',ajzt:'受案',sfgl:'是',ajbh:'A4503305100002019120020',jqbh:'J450330550000201912000033'},
         {id:'dsakfoieurjbhs2',wj_mc:'20200121审讯音频',wjlbmc:'音频',sprq:'2020-01-22',sply:'执法记录仪',ajmc:'李阳诈骗案',ajlb:'诈骗案',badw:'盘锦公安局',bar:'刘峰',ajzt:'破案',sfgl:'否',ajbh:'A4503305700002019120004',jqbh:'J450330070000201912000101'},
         ],page: { showCount: 10,
           totalPage: 1,
           totalResult: 2,
           currentPage: 1,
           currentResult: 0,
           entityOrField: true,
           pageStr: ""}
      }
        return (
            <div>
                <RenderTable
                    loading={loading}
                    data={data}
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
        console.log('selectedDeptVal----->',selectedDeptVal)
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
                            setJjdw={this.setJjdw}
                            setCjdw={this.setCjdw}
                            treeDefaultExpandedKeys={treeDefaultExpandedKeys}
                            {...this.props}
                        />
                    </div>
                    <DataView
                        showDataView={showDataView}
                        searchType={typeButtons}
                        changeToListPage={this.changeToListPage}
                        orgcode={selectedDeptVal}
                        selectedDateVal={selectedDateVal}
                        {...this.props}
                    />
                    <div style={showDataView ? {display: 'none'} : {display: 'block'}}>
                        <div className={styles.tableListForm} id='videoListForm'>
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
