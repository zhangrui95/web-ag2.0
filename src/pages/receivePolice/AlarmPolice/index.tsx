import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Select, TreeSelect, Input, Button, DatePicker, Tabs, Radio, message } from 'antd';
import moment from 'moment/moment';
import styles from '../../common/listPage.less';
import RenderTable from '../../../components/UnPoliceRealData/RenderTable';
import UnPoliceDataView from '../../../components/UnPoliceRealData/UnPoliceDataView';
import { exportListDataMaxDays, getQueryString, tableList, userResourceCodeDb } from '../../../utils/utils';
import SuperviseModal from '../../../components/UnCaseRealData/SuperviseModal';
import MessageState from '../../../components/Common/MessageState';
import DataViewButtonArea from '../../../components/Common/DataViewButtonArea';
import { authorityIsTrue } from '../../../utils/authority';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const TabPane = Tabs.TabPane;
const TreeNode = TreeSelect.TreeNode;
const RadioGroup = Radio.Group;

let timeout;
let currentValue;

@connect(({ UnPoliceData, loading, common }) => ({
  UnPoliceData, loading, common,
  // loading: loading.models.alarmManagement,
}))
@Form.create()
export default class Index extends PureComponent {
  state = {
    jjly: '',
    jjdw: '',
    cjdw: '',
    formValues: { dbzt: '00' },
    activeKey: '0',
    arrayDetail: [],
    wtlx: '',
    dbzt: '00',
    sfsa: '',
    returnWtlxProblemType: [],
    showDataView: true, // 控制显示图表或者列表（true显示图表）

    NowDataPage: '', // 督办完成时当前督办的数据在第几页
    NowShowCount: '', // 督办完成时当前督办的数据每页显示几条

    // 督办模态框
    superviseVisibleModal: false,
    opendata: '', // 点击督办的案件
    sabar: '',
    superviseWtlx: '',
    superviseZrdw: '',
    superviseZrr: '',
    superviseZrdwId: '',
    id: '',
    sfzh: '',
    wtid: '',
    allPolice: [],
    cjrPolice: [],
    policeDetails: '',
    isDb: authorityIsTrue(userResourceCodeDb.police), // 督办权限
    selectedDateVal: null, // 手动选择的日期
    selectedDeptVal: '', // 手动选择机构
    typeButtons: 'day', // 图表展示类别（week,month）
    treeDefaultExpandedKeys: [], // 办案单位树默认展开keys
  };


  componentDidMount() {
    if (this.props.location.query && this.props.location.query.id) {
      this.setState({
        showDataView: false,
      });
    }
    // this.dictionary();
    // this.handleFormReset();
    const org = getQueryString(this.props.location.search, 'org') || '';
    const jjsj_js = getQueryString(this.props.location.search, 'jjsj_js') || '';
    const jjsj_ks = getQueryString(this.props.location.search, 'jjsj_ks') || '';
    const wtid = getQueryString(this.props.location.search, 'wtid') || '';
    const jigouArea = sessionStorage.getItem('user');
    const newjigouArea = JSON.parse(jigouArea);
    let obj;
    if ((jjsj_js !== '') && (jjsj_ks !== '')) {
      this.props.form.setFieldsValue({
        jjsj: [moment(jjsj_ks, 'YYYY-MM-DD HH:mm:ss'), moment(jjsj_js, 'YYYY-MM-DD HH:mm:ss')],
      });
      obj = {
        currentPage: 1,
        showCount: tableList,
        pd: {
          org,
          jjsj_js,
          jjsj_ks,
          wtid,
        },
      };
    } else {
      this.props.form.setFieldsValue({
        gjsj: [moment().startOf('day'), moment()],
      });
      obj = {
        currentPage: 1,
        showCount: tableList,
        pd: {
          gjsj_ks: moment().format('YYYY-MM-DD'),
          gjsj_js: moment().format('YYYY-MM-DD'),
          dbzt: '00',
        },
      };
    }

    this.getPolice(obj);
    this.getSourceOfAlarmDict(newjigouArea.department);
    this.dicType1();
    this.getSuperviseStatusDict();
    this.getRectificationStatusDict();
    this.getDepTree(newjigouArea.department);
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
  getCsfs = (e) =>{
    if(e !== ''){
      this.props.form.resetFields(['dbzt']);
      this.setState({
        dbzt:'',
      })
    }
  }
  getPolice(param) {
    const defaultParams = {
      currentPage: 1,
      showCount: tableList,
      pd: {
        dbzt: '00',
      },
    };
    this.props.dispatch({
      type: 'UnPoliceData/UnPoliceFetch',
      payload: param ? param : defaultParams,
      callback: (data) => {
        if (data) {
          this.setState({
            policeDetails: data,
          });
        }
      },
    });
  }

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
  // 获取接警来源字典
  getSourceOfAlarmDict = (area) => {
    const org6 = area ? area.substring(0, 6) : '';
    this.props.dispatch({
      type: 'common/getDictType',
      payload: {
        currentPage: 1,
        pd: {
          pid: '2000',
          org6,
        },
        showCount: 999,
      },
    });
  };
  // 获取督办状态
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
  onRadioChange = (e) => {
    this.setState({
      sfsa: e.target.value,
    });
  };

  // 获取问题类型字典表
  dicType1() {
    this.props.dispatch({
      type: 'common/getDictType',
      payload: {
        currentPage: 1,
        pd: {
          pid: '2068',
        },
        showCount: 9999,
      },
      callback: (data) => {
        if (data) {
          this.setState({
            returnWtlxProblemType: data.data.list,
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
    this.getPolice(params);
  };
  // 查询
  handleSearch = (e) => {
    if (e) e.preventDefault();
    const values = this.props.form.getFieldsValue();
    const jjTime = values.jjsj;
    const gjTime = values.gjsj;
    const formValues = {
      gjsj_ks: gjTime && gjTime.length > 0 ? gjTime[0].format('YYYY-MM-DD') : '',
      gjsj_js: gjTime && gjTime.length > 0 ? gjTime[1].format('YYYY-MM-DD') : '',
      cjdw: values.cjdw || '',
      cjr: values.cjr || '',
      jjdw: values.jjdw || '',
      jjly_dm: values.jjly || '',
      jjr: values.jjr || '',
      is_sa: values.sfsa || '',
      dbzt: values.dbzt && values.dbzt.dbzt ? values.dbzt.dbzt : '',
      cljg_dm: values.dbzt && values.dbzt.zgzt ? values.dbzt.zgzt : '',
      csfs: values.csfs || '',
      wtlx_id: values.wtlx || '',
      jjsj_ks: jjTime && jjTime.length > 0 ? jjTime[0].format('YYYY-MM-DD HH:mm:ss') : '',
      jjsj_js: jjTime && jjTime.length > 0 ? jjTime[1].format('YYYY-MM-DD HH:mm:ss') : '',
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
    this.setState({
      formValues: {
        dbzt: '00',
      },
      sfsa: '',
      allPolice: [],
      cjrPolice: [],
    });
    this.getPolice();
  };
  // 导出
  exportData = () => {
    const values = this.props.form.getFieldsValue();
    const jjTime = values.jjsj;
    const gjTime = values.gjsj;
    const formValues = {
      gjsj_ks: gjTime && gjTime.length > 0 ? gjTime[0].format('YYYY-MM-DD') : '',
      gjsj_js: gjTime && gjTime.length > 0 ? gjTime[1].format('YYYY-MM-DD') : '',
      cjdw: values.cjdw || '',
      cjr: values.cjr || '',
      jjdw: values.jjdw || '',
      jjly_dm: values.jjly || '',
      jjr: values.jjr || '',
      is_sa: values.sfsa || '',
      dbzt: values.dbzt && values.dbzt.dbzt ? values.dbzt.dbzt : '',
      cljg_dm: values.dbzt && values.dbzt.zgzt ? values.dbzt.zgzt : '',
      csfs: values.csfs || '',
      wtlx_id: values.wtlx || '',
      jjsj_ks: jjTime && jjTime.length > 0 ? jjTime[0].format('YYYY-MM-DD HH:mm:ss') : '',
      jjsj_js: jjTime && jjTime.length > 0 ? jjTime[1].format('YYYY-MM-DD HH:mm:ss') : '',
    };
    if ((jjTime && jjTime.length > 0) || (gjTime && gjTime.length > 0)) {
      let dateArry = [];
      let dateArry2 = [];
      if (jjTime && jjTime.length > 0) {
        dateArry = [...jjTime];
      }
      if (gjTime && gjTime.length > 0) {
        dateArry2 = [...gjTime];
      }
      const isAfterDate = dateArry.length > 0 ? moment(dateArry[1].format('YYYY-MM-DD')).isAfter(moment(dateArry[0].format('YYYY-MM-DD')).add(exportListDataMaxDays, 'days')) : true;
      const isAfterDate2 = dateArry2.length > 0 ? moment(dateArry2[1].format('YYYY-MM-DD')).isAfter(moment(dateArry2[1].format('YYYY-MM-DD')).add(exportListDataMaxDays, 'days')) : true;
      if (isAfterDate && isAfterDate2) { // 选择时间间隔应小于exportListDataMaxDays
        message.warning(`日期间隔需小于${exportListDataMaxDays}天`);
      } else {
        this.props.dispatch({
          type: 'common/exportData',
          payload: {
            tableType: '6',
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
  // 改变显示图表或列表
  changeListPageHeader = () => {
    const { showDataView } = this.state;
    this.setState({
      showDataView: !showDataView,
    });
    // if(showDataView)this.handleFormReset();
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
  // 图表点击跳转到列表页面
  changeToListPage = (name, dateArry) => {
    this.props.form.resetFields();
    this.setState({
      formValues: {
        dbzt: '00',
      },
      sfsa: '',
      allPolice: [],
      cjrPolice: [],
      showDataView: false,
    }, () => {
      this.props.form.setFieldsValue({
        gjsj: [moment(dateArry[0], 'YYYY-MM-DD'), moment(dateArry[1], 'YYYY-MM-DD')],
        cjdw: this.state.selectedDeptVal || null,
        ...name,
      });

      this.handleSearch();
    });
  };
  // 获取所有接警人和处警人
  getAllPolice = (name, cjr) => {
    const that = this;
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    currentValue = name;
    timeout = setTimeout(function() {
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

  renderForm() {
    const { form: { getFieldDecorator }, common: { sourceOfAlarmDict, depTree, superviseStatusDict, rectificationStatusDict } } = this.props;
    const { returnWtlxProblemType } = this.state;
    const allPoliceOptions = this.state.allPolice.map(d => <Option key={`${d.idcard},${d.pcard}`}
                                                                   value={`${d.idcard},${d.pcard}$$`}
                                                                   title={d.name}>{`${d.name} ${d.pcard}`}</Option>);
    const cjrPoliceOptions = this.state.cjrPolice.map(d => <Option key={`${d.idcard},${d.pcard}`}
                                                                   value={`${d.idcard},${d.pcard}$$`}
                                                                   title={d.name}>{`${d.name} ${d.pcard}`}</Option>);
    let sourceOfAlarmDictOptions = [], rectificationStatusOptions = [];
    if (sourceOfAlarmDict.length > 0) {
      for (let i = 0; i < sourceOfAlarmDict.length; i++) {
        const item = sourceOfAlarmDict[i];
        sourceOfAlarmDictOptions.push(
          <Option key={item.id} value={item.code}>{item.name}</Option>,
        );
      }
    }
    let wtlxOptions = [];
    if (returnWtlxProblemType.length > 0) {
      for (let a = 0; a < returnWtlxProblemType.length; a++) {
        const item = returnWtlxProblemType[a];
        wtlxOptions.push(
          <Option key={item.id} value={item.code}>{item.name}</Option>,
        );
      }
    }
    let superviseStatusOptions = [];
    if (superviseStatusDict.length > 0) {
      for (let i = 0; i < superviseStatusDict.length; i++) {
        const item = superviseStatusDict[i];
        superviseStatusOptions.push(
          <Option key={item.id} value={item.code}>{item.name}</Option>,
        );
      }
    }
    if (rectificationStatusDict.length > 0) {
      for (let i = 0; i < rectificationStatusDict.length; i++) {
        const item = rectificationStatusDict[i];
        rectificationStatusOptions.push(
          <Option key={item.id} value={item.code}>{item.name}</Option>,
        );
      }
    }
    const formItemLayout = {
      labelCol: { xs: { span: 24 }, md: { span: 8 }, xl: { span: 6 }, xxl: { span: 4 } },
      wrapperCol: { xs: { span: 24 }, md: { span: 16 }, xl: { span: 18 }, xxl: { span: 20 } },
    };
    const rowLayout = { md: 8, xl: 16, xxl: 24 };
    const colLayout = { sm: 24, md: 12, xl: 8 };
    return (
      <Form>
        <Row gutter={rowLayout}>
          <Col {...colLayout}>
            <FormItem label="告警时间" {...formItemLayout}>
              {getFieldDecorator('gjsj', {
                // initialValue: this.state.ssbaq,
              })(
                <RangePicker
                  disabledDate={this.disabledDate}
                  style={{ width: '100%' }}
                />,
              )}
            </FormItem>
          </Col>
          <Col {...colLayout}>
            <FormItem label="问题类型" {...formItemLayout}>
              {getFieldDecorator('wtlx', {
                initialValue: this.state.wtlx,
              })(
                <Select placeholder="请选择问题类型" style={{ width: '100%' }}>
                  <Option value="">全部</Option>
                  {wtlxOptions}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col {...colLayout}>
            <FormItem label="&nbsp;&nbsp;&nbsp; 接警人" {...formItemLayout}>
              {getFieldDecorator('jjr', {
                // initialValue: this.state.caseType,
                rules: [{ max: 32, message: '最多输入32个字！' }],
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
                >
                  {allPoliceOptions}
                </Select>,
              )}
            </FormItem>

          </Col>
        </Row>
        <Row gutter={rowLayout}>
          <Col {...colLayout}>
            <FormItem label="接警来源" {...formItemLayout}>
              {getFieldDecorator('jjly', {
                initialValue: this.state.jjly,
              })(
                <Select placeholder="请选择接警来源" style={{ width: '100%' }}>
                  <Option value="">全部</Option>
                  {/*{involvedType !== undefined ? this.Option() : ''}*/}
                  {sourceOfAlarmDictOptions}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col {...colLayout}>
            <FormItem label="管辖单位" {...formItemLayout}>
              {getFieldDecorator('jjdw', {
                // initialValue: this.state.jjdw,
              })(
                <TreeSelect
                  showSearch
                  style={{ width: '100%' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  placeholder="请输入管辖单位"
                  allowClear
                  key='jjdwSelect'
                  treeDefaultExpandedKeys={this.state.treeDefaultExpandedKeys}
                  treeNodeFilterProp="title"
                >
                  {depTree && depTree.length > 0 ? this.renderloop(depTree) : null}
                </TreeSelect>,
              )}
            </FormItem>
          </Col>
          <Col {...colLayout}>
            <FormItem label="&nbsp;&nbsp;&nbsp; 处警人" {...formItemLayout}>
              {getFieldDecorator('cjr', {
                // initialValue: this.state.gzry,
                rules: [{ max: 32, message: '最多输入32个字！' }],
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
                >
                  {cjrPoliceOptions}
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={rowLayout}>
          <Col {...colLayout}>
            <FormItem label="处警单位" {...formItemLayout}>
              {getFieldDecorator('cjdw', {
                // initialValue: this.state.cjdw,
              })(
                <TreeSelect
                  showSearch
                  style={{ width: '100%' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  placeholder="请输入处警单位"
                  allowClear
                  key='cjdwSelect'
                  treeDefaultExpandedKeys={this.state.treeDefaultExpandedKeys}
                  treeNodeFilterProp="title"
                >
                  {depTree && depTree.length > 0 ? this.renderloop(depTree) : null}
                </TreeSelect>,
              )}
            </FormItem>

          </Col>
          <Col {...colLayout}>
            <FormItem label="接警时间" {...formItemLayout}>
              {getFieldDecorator('jjsj', {
                // initialValue: this.state.ssbaq,
              })(
                <RangePicker
                  disabledDate={this.disabledDate}
                  style={{ width: '100%' }}
                  showTime={{ format: 'HH:mm:ss' }}
                  format="YYYY-MM-DD HH:mm:ss"
                />,
              )}
            </FormItem>
          </Col>
          <Col {...colLayout}>
            <FormItem label="消息状态" {...formItemLayout}>
              {getFieldDecorator('dbzt', {
                initialValue: { dbzt: this.state.dbzt, zgzt: '' },
              })(
                <MessageState superviseStatusOptions={superviseStatusOptions}
                              rectificationStatusOptions={rectificationStatusOptions}/>,
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={rowLayout}>
          <Col {...colLayout}>
            <FormItem label="产生方式" {...formItemLayout}>
              {getFieldDecorator('csfs', {
                initialValue: '',
              })(
                <Select placeholder="请选择产生方式" style={{ width: '100%' }} onChange={this.getCsfs}>
                  <Option value="">全部</Option>
                  <Option value="系统判定">系统判定</Option>
                  <Option value="人工判定">人工判定</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col {...colLayout}>
            <FormItem label="是否受案" {...formItemLayout}>
              {getFieldDecorator('sfsa', {
                initialValue: this.state.sfsa,
              })(
                <RadioGroup onChange={this.onRadioChange}>
                  <Radio value="">全部</Radio>
                  <Radio value="1">是</Radio>
                  <Radio value="0">否</Radio>
                </RadioGroup>,
              )}
            </FormItem>
          </Col>
          <Col {...colLayout}>
                        <span style={{ float: 'right', marginBottom: 24 }}>
                            <Button style={{ color: '#2095FF', borderColor: '#2095FF' }}
                                    onClick={this.exportData}>导出表格</Button>
                            <Button style={{ marginLeft: 8 }} type="primary" htmlType='submit'
                                    onClick={this.handleSearch}>查询</Button>
                            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
                        </span>
          </Col>
        </Row>
      </Form>
    );
  }

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
  // 刷新列表
  refreshTable = () => {
    const { NowDataPage, NowShowCount, formValues } = this.state;
    const saveparam = {
      currentPage: NowDataPage !== '' ? NowDataPage : 1,
      showCount: NowShowCount !== '' ? NowShowCount : 10,
      pd: {
        ...formValues,
      },
    };
    this.getPolice(saveparam);
  };
  // 打开督办模态框
  openModal = (opendata, flag, record) => {
    this.setState({
      superviseVisibleModal: !!flag,
      opendata: opendata,
      superviseWtlx: record.wtlxMc,
      superviseZrdw: record.bardwmc,
      superviseZrdwId: record.bardw,
      superviseZrr: record.barxm,
      id: record.id,
      sfzh: record.barzjhm,
      sabar: record.sabar,
      wtid: record.wtid,
    });
  };

  renderTable() {
    const { UnPoliceData: { unPoliceDatas, loading } } = this.props;
    const { isDb } = this.state;
    return (
      <div>
        <RenderTable
          loading={loading}
          data={unPoliceDatas}
          onChange={this.handleTableChange}
          dispatch={this.props.dispatch}
          newDetail={this.newDetail}
          getPolice={(param) => this.getPolice(param)}
          location={this.props.location}
          formValues={this.state.formValues}
          // 打开督办模态框
          openModal={this.openModal}
          refreshTable={this.refreshTable}
          isDb={isDb}
        />
      </div>
    );
  }

  render() {
    const newAddDetail = this.state.arrayDetail;
    const { showDataView, superviseVisibleModal, typeButtons, selectedDeptVal, selectedDateVal, treeDefaultExpandedKeys } = this.state;
    const { common: { depTree } } = this.props;
    // const orgcodeVal = selectedDeptVal !== '' ? JSON.parse(selectedDeptVal).id : '';
    return (
      <div className={this.props.location.query && this.props.location.query.id ? styles.onlyDetail : ''}>
        <Tabs
          hideAdd
          onChange={this.onChange}
          activeKey={this.state.activeKey}
          type="editable-card"
          onEdit={this.onEdit}
          tabBarStyle={{ margin: 0 }}
          // className={this.props.location.query&&this.props.location.query.id ? styles.onlyDetail:''}
        >
          <TabPane tab='警情告警' key='0' closable={false}>
            <div className={styles.listPageWrap}>
              <div className={styles.listPageHeader}>
                {
                  showDataView ? (
                    <a className={styles.listPageHeaderCurrent}><span>●</span>告警统计</a>
                  ) : (
                    <a onClick={this.changeListPageHeader}>告警统计</a>
                  )
                }
                <span>|</span>
                {
                  showDataView ? (
                    <a onClick={this.changeListPageHeader}>告警列表</a>
                  ) : (
                    <a className={styles.listPageHeaderCurrent}><span>●</span>告警列表</a>
                  )
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
                />
              </div>
              <UnPoliceDataView
                style={{ display: 'none' }}
                changeToListPage={this.changeToListPage}
                showDataView={showDataView}
                searchType={typeButtons}
                orgcode={selectedDeptVal}
                selectedDateVal={selectedDateVal}
                {...this.props}
              />
              <div style={showDataView ? { display: 'none' } : { display: 'block' }}>
                <div className={styles.tableListForm}>
                  {this.renderForm()}
                </div>
                <div className={styles.tableListOperator} style={{ marginBottom: 0 }}>
                  {this.renderTable()}
                </div>
              </div>
            </div>
          </TabPane>
          {newAddDetail.map((pane, idx) => <TabPane tab={pane.title} key={pane.key}
                                                    closable={this.props.location.query && this.props.location.query.id && idx === 0 ? false : true}>{pane.content}</TabPane>)}
        </Tabs>

        {superviseVisibleModal ?
          <SuperviseModal
            visible={superviseVisibleModal}
            closeModal={this.closeModal}
            caseDetails={this.state.opendata}
            getRefresh={this.Refresh}
            // 点击列表的督办显示的四个基本信息
            wtlx={this.state.superviseWtlx}
            wtid={this.state.wtid}
            id={this.state.id}
            from='督办'
          />
          : ''
        }
      </div>
    );
  }
}
