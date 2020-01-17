import React, { PureComponent } from 'react';
import { connect } from 'dva';
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
  Card,
  Icon,
} from 'antd';
import moment from 'moment/moment';
import styles from './index.less';
import EvaluationTable from '../../../components/AjEvaluation/EvaluationTable';
import EvaluationChats from '../../../components/AjEvaluation/EvaluationChats';
import { exportListDataMaxDays, getUserInfos } from '../../../utils/utils';
// import SuperviseModal from '../../components/NewUnCaseRealData/SuperviseModal';
import { routerRedux } from 'dva/router';
import stylescommon1 from '@/pages/common/common.less';
import stylescommon2 from '@/pages/common/commonLight.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const TabPane = Tabs.TabPane;
const TreeNode = TreeSelect.TreeNode;
const RadioGroup = Radio.Group;
const { SHOW_PARENT } = TreeSelect;
let timeout;
let currentValue;
const formItemLayout = {
  labelCol: { xs: { span: 24 }, md: { span: 8 }, xl: { span: 6 }, xxl: { span: 5 } },
  wrapperCol: { xs: { span: 24 }, md: { span: 16 }, xl: { span: 18 }, xxl: { span: 19 } },
};
const rowLayout = { md: 8, xl: 16, xxl: 24 };
const colLayout = { sm: 24, md: 12, xl: 8 };
const colLayouts = { sm: 12, md: 12, xl: 10, xxl: 9 };
const colLayoutBox = { sm: 15, md: 15, xl: 14, xxl: 15 };
const formItemLayoutRadio = {
  labelCol: { xs: { span: 24 }, md: { span: 10 }, xl: { span: 4 }, xxl: { span: 7 } },
  wrapperCol: { xs: { span: 24 }, md: { span: 14 }, xl: { span: 18 }, xxl: { span: 17 } },
};
const formItemLayoutRadios = {
  labelCol: { xs: { span: 8 }, md: { span: 6 }, xl: { span: 4 }, xxl: { span: 3 } },
  wrapperCol: { xs: { span: 14 }, md: { span: 16 }, xl: { span: 18 }, xxl: { span: 18 } },
};
const formItemLayoutShow = {
  labelCol: { xs: { span: 24 }, md: { span: 10 }, xl: { span: 6 }, xxl: { span: 5 } },
  wrapperCol: { xs: { span: 24 }, md: { span: 14 }, xl: { span: 18 }, xxl: { span: 19 } },
};
const colLayoutShow = { sm: 24, md: 12, xl: 14, xxl: 6 };
let start = moment(
  moment()
    .subtract('month', 1)
    .format('YYYY-MM') + '-01',
);
let end = moment(
  moment(start)
    .subtract('month', -1)
    .add('days', -1)
    .format('YYYY-MM-DD'),
);
@connect(({ Evaluation, common, global }) => ({
  Evaluation,
  common,
  global,
}))
@Form.create()
export default class Index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      formValues: {
        is_area: window.configUrl.is_area,
      },
      activeKey: '0',
      chartIdx: '1',
      tjfw: getUserInfos().department.substring(4) === '00000000' ? '0' : '1',
      arrayDetail: [],
      showDataView: true, // 控制显示图表或者列表（true显示图表）
      kprqTb: [start, end],
      allPolice: [],
      cjrPolice: [],
      caseAllType: [], // 案件类别
      loading: false,
      kfxList: [],
      caseTypeTree: [], // 案件类别树
      pageSize: 10,
      bkpdwTb: getUserInfos().group.code,
      tjnr: '3',
      tjnrXm: '0',
      tjnrRedio: '3',
      isSearch: false,
      reset: false,
      treeDefaultExpandedKeys: [], // 办案单位树默认展开keys
      tbtz: '0',
    };
    const jigouArea = sessionStorage.getItem('user');
    const newjigouArea = JSON.parse(jigouArea);
    this.getdepTrees(newjigouArea.department);
    this.getQk();
  }

  componentDidMount() {
    this.getKfxList();
    const params = {
      pd: {
        tbtz: '0',
      },
      currentPage: 1,
      showCount: 10,
    };
    this.getAllPolice('', '', getUserInfos().department);
    this.getList(params);
    this.getCaseTypeTree(window.configUrl.is_area);
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.global.isResetList.isReset !== nextProps.global.isResetList.isReset &&
      nextProps.global.isResetList.url === '/Evaluation/CaseEvaluation'
    ) {
      const params = {
        pd: {
          tbtz: '0',
        },
        currentPage: 1,
        showCount: 10,
      };
      this.getList(params);
    }
  }

  getQk = () => {
    this.props.dispatch({
      type: 'common/getDictType',
      payload: {
        appCode: window.configUrl.appCode,
        code: '501051',
      },
    });
  };
  getKfxList = zddmzw => {
    this.setState({
      kfxList: [],
    });
    this.props.dispatch({
      type: 'Evaluation/getDictPgListPage',
      payload: {
        currentPage: 1,
        showCount: 50,
        pd: {
          zdbh: '204',
          zddmzw: zddmzw ? zddmzw : '',
        },
      },
      callback: data => {
        this.setState({
          kfxList: data.list ? data.list : [],
        });
      },
    });
  };
  // 表格分页
  handleTableChange = (pagination, filtersArg, sorter) => {
    let current = pagination.current;
    if (this.state.pageSize !== pagination.pageSize) {
      current = 1;
      this.setState({
        pageSize: pagination.pageSize,
      });
    }
    const { formValues } = this.state;
    const params = {
      pd: {
        ...formValues,
      },
      currentPage: current,
      showCount: pagination.pageSize,
    };
    this.getList(params);
  };
  //列表
  getList = params => {
    this.setState({
      loading: true,
    });
    this.props.dispatch({
      type: 'Evaluation/getAssessmentPgListPage',
      payload: params,
      callback: data => {
        this.setState({
          loading: false,
        });
      },
    });
  };
  onChange = activeKey => {
    this.setState({
      activeKey,
    });
  };
  // 获取机构树
  getdepTrees = area => {
    let orgList = [];
    getUserInfos().groupList &&
      getUserInfos().groupList.map(item => {
        orgList.push(item.code);
      });
    this.props.dispatch({
      type: 'common/getDepAndGxTree',
      payload: {
        department: area,
        groupList: orgList,
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
  // 无法选择的日期
  disabledDate = current => {
    // Can not select days before today and today
    return current && current.valueOf() > Date.now();
  };
  // 查询
  handleSearch = (e, bkprCode, tbtz) => {
    const values = this.props.form.getFieldsValue();
    const kprqTime = values.kprq;
    const formValues = {
      bkpdw_dm: values.bkpdw ? values.bkpdw : '',
      kprq_ks: kprqTime && kprqTime.length > 0 ? kprqTime[0].format('YYYY-MM-DD') : '',
      kprq_js: kprqTime && kprqTime.length > 0 ? kprqTime[1].format('YYYY-MM-DD') : '',
      ajbh: values.ajbh ? values.ajbh.trim() : '',
      ajmc: values.ajmc || '',
      ajlb_dm: values.ajlb && values.ajlb.length > 0 ? values.ajlb[values.ajlb.length - 1] : '',
      bkpr: bkprCode ? bkprCode : values.bkpr || '',
      kfxm_mc: values.kfxm || '',
      tbtz: tbtz ? tbtz : this.state.tbtz ? this.state.tbtz : '0',
    };
    this.setState({
      formValues,
      kprq: values.kprq,
    });
    const params = {
      pd: {
        ...formValues,
      },
      currentPage: 1,
      showCount: this.state.pageSize,
    };
    this.getList(params);
    return false;
  };
  // 查询图表
  handleSearchTb = e => {
    const values = this.props.form.getFieldsValue();
    const kprqTime = values.kprqTb;
    this.setState({
      kprqTb: kprqTime,
      bkpdwTb:
        values.bkpdwTb && values.bkpdwTb.length > 0 ? values.bkpdwTb : getUserInfos().group.code,
      tjfw: values.tjfw,
      tjnrCode: this.state.tjnrXm,
      tjnrRedio: values.tjnr,
      isSearch: !this.state.isSearch,
      is_area: window.configUrl.is_area,
    });
    return false;
  };
  // 重置
  handleFormReset = () => {
    this.props.form.resetFields(['ajbh', 'ajmc', 'bkpdw', 'kprq', 'ajlb', 'bkpr']);
    const params = {
      pd: {
        tbtz: '0',
      },
      currentPage: 1,
      showCount: 10,
    };
    this.setState({
      kprq: '',
      tbtz: '0',
      formValues: { is_area: window.configUrl.is_area },
      pageSize: 10,
    });
    this.getList(params);
  };
  handleFormResetTb = () => {
    this.props.form.resetFields(['bkpdwTb', 'tjfw', 'kprqTb', 'tjnr']);
    this.setState({
      kprqTb: [start, end],
      bkpdwTb: getUserInfos().group.code.toString(),
      tjnrCode: '0',
      tjnrXm: '0',
      tjnr: '3',
      tjnrRedio: '3',
      reset: !this.state.reset,
    });
  };
  // 导出
  exportData = () => {
    const values = this.props.form.getFieldsValue();
    const kprqTime = values.kprq;
    const formValues = {
      bkpdw_dm: values.bkpdw ? values.bkpdw : '',
      kprq_ks: kprqTime && kprqTime.length > 0 ? kprqTime[0].format('YYYY-MM-DD') : '',
      kprq_js: kprqTime && kprqTime.length > 0 ? kprqTime[1].format('YYYY-MM-DD') : '',
      ajbh: values.ajbh ? values.ajbh.trim() : '',
      ajmc: values.ajmc || '',
      ajlb_dm: values.ajlb && values.ajlb.length > 0 ? values.ajlb[values.ajlb.length - 1] : '',
      bkpr: values.bkpr || '',
      kfxm_mc: values.kfxm || '',
      tbtz: this.state.chartIdx ? this.state.chartIdx : '0',
      is_area: window.configUrl.is_area,
    };
    if (kprqTime && kprqTime.length > 0) {
      const isAfterDate = moment(formValues.kprq_js).isAfter(
        moment(formValues.kprq_ks).add(exportListDataMaxDays, 'days'),
      );
      if (isAfterDate) {
        // 选择时间间隔应小于exportListDataMaxDays
        message.warning(`日期间隔需小于${exportListDataMaxDays}天`);
      } else {
        this.props.dispatch({
          type: 'common/exportData',
          payload: {
            tableType: '34',
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
      return <TreeNode key={item.code} value={item.code} title={item.name} />;
    });
  // 获取案件类别树
  getCaseTypeTree = areaNum => {
    this.props.dispatch({
      type: 'common/getCaseTypeTree',
      payload: {
        ajlb: 'xs,xz',
        is_area: areaNum === '1' ? '1' : '0',
      },
      callback: data => {
        if (data.list) {
          this.setState({
            caseTypeTree: data.list,
          });
        }
      },
    });
  };
  // 改变显示图表或列表
  changeListPageHeader = () => {
    const { showDataView } = this.state;
    if (showDataView) {
      this.getAllPolice();
    } else {
      this.getAllPolice('', '', getUserInfos().department);
    }
    this.setState({
      showDataView: !showDataView,
    });
    // this.handleFormReset();
  };
  // 图表点击跳转到列表页面
  changeToListPage = (params, idx) => {
    this.props.form.resetFields();
    let kprq_ks =
      this.state.kprqTb && this.state.kprqTb.length > 0
        ? this.state.kprqTb[0].format('YYYY-MM-DD')
        : '';
    let kprq_js =
      this.state.kprqTb && this.state.kprqTb.length > 0
        ? this.state.kprqTb[1].format('YYYY-MM-DD')
        : '';
    let location = {
      location: {
        state: {
          code: idx === '0' ? params.code : params.bkpr_dwdm ? params.bkpr_dwdm : '',
          kssj: kprq_ks,
          jssj: kprq_js,
          dbzt: '',
          bar_name: idx === '2' ? params.bkpr_name : '',
          is_tz: '2',
        },
      },
    };
    if (params) {
      if (params.typeGj) {
        let pathname =
          params.typeGj === '0'
            ? '/newcaseFiling/casePolice/AdministrationPolice'
            : params.typeGj === '1'
            ? '/newcaseFiling/casePolice/CriminalPolice'
            : params.typeGj === '2'
            ? '/articlesInvolved/ArticlesPolice'
            : params.typeGj === '3'
            ? '/handlingArea/AreaPolice'
            : params.typeGj === '4'
            ? '/dossierPolice/DossierPolice'
            : '';
        this.props.dispatch({
          type: 'global/changeResetList',
          payload: {
            isReset: !this.props.global.isResetList.isReset,
            url: pathname,
            state: location,
          },
        });
        this.props.dispatch(
          routerRedux.push({
            pathname: pathname,
            state: {
              code: idx === '0' ? params.code : params.bkpr_dwdm ? params.bkpr_dwdm : '',
              kssj: kprq_ks,
              jssj: kprq_js,
              dbzt: '',
              bar_name: idx === '2' ? params.bkpr_name : '',
              is_tz: '2',
            },
            // query: {isReset: true}
          }),
        );
      } else {
        this.setState(
          {
            showDataView: false,
            searchHeight: true,
            chartIdx: idx,
            tbtz: this.state.tjnrRedio === '0' ? '2' : '1',
          },
          () => {
            let bkprCode = '';
            if (idx === '0') {
              let code = params.code || null;
              this.props.form.setFieldsValue({
                kprq: this.state.kprqTb,
                bkpdw: code,
              });
            } else {
              this.props.form.setFieldsValue({
                kprq: this.state.kprqTb,
                bkpdw: params.bkpr_dwdm || '',
                bkpr: params.bkpr_name,
              });
              bkprCode = params.code;
            }
            this.handleSearch(null, bkprCode);
          },
        );
      }
    }
  };
  //考评成功刷新考评时间
  getKpSearch = () => {
    this.props.form.resetFields(['kprq']);
    this.handleSearch();
  };
  // 获取所有接警人和处警人
  getAllPolice = (name, cjr, code) => {
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
          // code:code ? code : ''
        },
        callback: data => {
          if (data && currentValue === name) {
            if (cjr) {
              that.setState({
                cjrPolice: data.slice(0, 100),
              });
            } else {
              that.setState({
                allPolice: data.slice(0, 100),
              });
            }
          }
        },
      });
    }, 300);
  };
  handleAllPoliceOptionChange = (value, cjr, code) => {
    this.getAllPolice(value, cjr, code);
  };
  getTjnr = e => {
    this.setState({
      tjnr: e.target.value,
    });
  };
  getTjnrXm = e => {
    this.setState({
      tjnrXm: e,
    });
  };
  getSearchHeightTb = () => {
    this.setState({
      searchHeightTb: !this.state.searchHeightTb,
    });
  };
  getSearchHeight = () => {
    this.setState({
      searchHeight: !this.state.searchHeight,
    });
  };

  tbrenderForm() {
    const {
      form: { getFieldDecorator },
      common: { deptrees, xmType },
    } = this.props;
    let xmOption = xmType.map(item => {
      return (
        <Option key={item.code} value={item.code}>
          {item.name}情况
        </Option>
      );
    });
    let stylescommon = this.props.global && this.props.global.dark ? stylescommon1 : stylescommon2;
    return (
      <Card className={stylescommon.cardArea} style={{ padding: '10px 0' }}>
        <Form style={{ height: this.state.searchHeightTb ? 'auto' : '50px' }}>
          <Row gutter={rowLayout} className={stylescommon.searchForm}>
            <Col {...colLayouts}>
              <FormItem label="被考评单位" {...formItemLayoutShow}>
                {getFieldDecorator('bkpdwTb', {
                  initialValue: this.state.bkpdwTb,
                })(
                  <TreeSelect
                    showSearch
                    // multiple
                    treeCheckable={true}
                    style={{ width: '100%' }}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    placeholder="请输入被考评单位"
                    allowClear={false}
                    key="bkpdwTbSelect"
                    maxTagCount={1}
                    treeNodeFilterProp={'title'}
                    showCheckedStrategy={SHOW_PARENT}
                    treeDefaultExpandedKeys={this.state.treeDefaultExpandedKeys}
                    getPopupContainer={() => document.getElementById('formCaseEvaluation')}
                  >
                    {deptrees && deptrees.length > 0 ? (
                      this.renderloop(deptrees)
                    ) : (
                      <TreeNode
                        key={getUserInfos().group.code}
                        value={getUserInfos().group.code}
                        title={getUserInfos().group.name}
                      />
                    )}
                  </TreeSelect>,
                )}
              </FormItem>
            </Col>
            <Col {...colLayoutShow}>
              <FormItem label="统计范围" {...formItemLayoutRadio}>
                {getFieldDecorator('tjfw', {
                  initialValue: this.state.tjfw,
                })(
                  <RadioGroup>
                    <Radio
                      value="0"
                      disabled={
                        getUserInfos().department.substring(4) === '00000000' ? false : true
                      }
                    >
                      分县局
                    </Radio>
                    <Radio value="1">派出所</Radio>
                  </RadioGroup>,
                )}
              </FormItem>
            </Col>
            <Col {...colLayouts}>
              <FormItem label="考评日期" {...formItemLayoutShow}>
                {getFieldDecorator('kprqTb', {
                  initialValue: this.state.kprqTb,
                })(
                  <RangePicker
                    disabledDate={this.disabledDate}
                    style={{ width: '100%' }}
                    getCalendarContainer={() => document.getElementById('formCaseEvaluation')}
                  />,
                )}
              </FormItem>
            </Col>
            <Col {...colLayoutBox}>
              <FormItem label="统计内容" {...formItemLayoutRadios}>
                {getFieldDecorator('tjnr', {
                  initialValue: this.state.tjnr,
                })(
                  <div>
                    <RadioGroup defaultValue={'3'} onChange={this.getTjnr} value={this.state.tjnr}>
                      <Radio value="0">案件数量</Radio>
                      <Radio value="1">告警数量</Radio>
                      <Radio value="3">
                        <Select
                          disabled={this.state.tjnr === '3' ? false : true}
                          value={this.state.tjnrXm}
                          placeholder="请选择"
                          style={{ width: '120px' }}
                          onChange={this.getTjnrXm}
                          defaultValue={xmType && xmType.length > 0 ? '0' : ''}
                          getPopupContainer={() => document.getElementById('formCaseEvaluation')}
                        >
                          {xmOption}
                        </Select>
                      </Radio>
                    </RadioGroup>
                  </div>,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row className={stylescommon.search}>
            <span style={{ float: 'right', marginBottom: 24 }}>
              <Button style={{ marginLeft: 8 }} type="primary" onClick={this.handleSearchTb}>
                查询
              </Button>
              <Button
                style={{ marginLeft: 8 }}
                onClick={this.handleFormResetTb}
                className={stylescommon.empty}
              >
                重置
              </Button>
              <Button
                style={{ marginLeft: 8 }}
                onClick={this.getSearchHeightTb}
                className={stylescommon.empty}
              >
                {this.state.searchHeightTb ? '收起筛选' : '展开筛选'}{' '}
                <Icon type={this.state.searchHeightTb ? 'up' : 'down'} />
              </Button>
            </span>
          </Row>
        </Form>
      </Card>
    );
  }

  renderForm() {
    const {
      form: { getFieldDecorator },
      common: { deptrees },
    } = this.props;
    const allPoliceOptions =
      this.state.allPolice &&
      this.state.allPolice.map(d => (
        <Option
          key={`${d.pcard}`}
          value={`${d.pcard}`}
          title={d.name}
        >{`${d.name} ${d.pcard}`}</Option>
      ));
    let stylescommon = this.props.global && this.props.global.dark ? stylescommon1 : stylescommon2;
    return (
      <Card className={stylescommon.cardArea} style={{ padding: '10px 0' }}>
        <Form style={{ height: this.state.searchHeight ? 'auto' : '50px' }}>
          <Row gutter={rowLayout} className={stylescommon.searchForm}>
            <Col {...colLayout}>
              <FormItem label="案件编号" {...formItemLayout}>
                {getFieldDecorator('ajbh')(<Input placeholder="请输入案件编号" />)}
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem label="案件名称" {...formItemLayout}>
                {getFieldDecorator('ajmc')(<Input placeholder="请输入案件名称" />)}
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem label="被考评单位" {...formItemLayout}>
                {getFieldDecorator('bkpdw')(
                  <TreeSelect
                    showSearch
                    style={{ width: '100%' }}
                    dropdownStyle={{ maxHeight: 400, overflowY: 'auto', overflowX: 'hidden' }}
                    dropdownMatchSelectWidth
                    placeholder="请输入被考评单位"
                    allowClear
                    key="bkpdwSelect"
                    treeNodeFilterProp={'title'}
                    treeDefaultExpandedKeys={this.state.treeDefaultExpandedKeys}
                    getPopupContainer={() => document.getElementById('formCaseEvaluation')}
                  >
                    {deptrees && deptrees.length > 0 ? this.renderloop(deptrees) : null}
                  </TreeSelect>,
                )}
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem label="考评日期" {...formItemLayout}>
                {getFieldDecorator('kprq')(
                  <RangePicker
                    disabledDate={this.disabledDate}
                    style={{ width: '100%' }}
                    getCalendarContainer={() => document.getElementById('formCaseEvaluation')}
                  />,
                )}
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem label="案件类别" {...formItemLayout}>
                {getFieldDecorator(
                  'ajlb',
                  {},
                )(
                  <Cascader
                    options={this.state.caseTypeTree}
                    placeholder="请选择案件类别"
                    changeOnSelect={true}
                    getPopupContainer={() => document.getElementById('formCaseEvaluation')}
                    showSearch={{
                      filter: (inputValue, path) => {
                        return path.some(items => items.searchValue.indexOf(inputValue) > -1);
                      },
                      limit: 5,
                    }}
                  />,
                )}
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem label="被考评人" {...formItemLayout}>
                {getFieldDecorator('bkpr', {
                  rules: [{ max: 32, message: '最多输入32个字！' }],
                })(
                  <Select
                    mode="combobox"
                    defaultActiveFirstOption={false}
                    optionLabelProp="title"
                    showArrow={false}
                    filterOption={false}
                    placeholder="请输入被考评人"
                    onChange={value => this.handleAllPoliceOptionChange(value, false)}
                    onFocus={value => this.handleAllPoliceOptionChange(value, false)}
                    getPopupContainer={() => document.getElementById('formCaseEvaluation')}
                  >
                    {allPoliceOptions}
                  </Select>,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row className={stylescommon.search}>
            <span style={{ float: 'right', marginBottom: 24 }}>
              <Button
                style={{ marginLeft: 8 }}
                type="primary"
                onClick={e => this.handleSearch(e, null, '0')}
              >
                查询
              </Button>
              <Button
                style={{ marginLeft: 8 }}
                onClick={this.handleFormReset}
                className={stylescommon.empty}
              >
                重置
              </Button>
              <Button
                style={{ marginLeft: 8 }}
                onClick={this.getSearchHeight}
                className={stylescommon.empty}
              >
                {this.state.searchHeight ? '收起筛选' : '展开筛选'}{' '}
                <Icon type={this.state.searchHeight ? 'up' : 'down'} />
              </Button>
            </span>
          </Row>
        </Form>
      </Card>
    );
  }

  // 级联选择完成后的回调
  cascaderOnChange = (value, selectedOptions) => {
    this.props.form.setFieldsValue({
      zxlb: '',
    });
  };
  // 级联加载数据
  cascaderLoadData = selectedOptions => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    this.props.dispatch({
      type: 'common/getDictType',
      payload: {
        appCode: window.configUrl.appCode,
        code: targetOption.id.toString(),
      },
      callback: data => {
        targetOption.loading = false;
        if (data.length > 0) {
          targetOption.childrenList = [];
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
  // 关闭页面
  onEdit = (targetKey, action) => {
    this[action](targetKey); // this.remove(targetKey);
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

  render() {
    const {
      Evaluation: { AssessmentPgList },
    } = this.props;
    const newAddDetail = this.state.arrayDetail;
    const { showDataView, superviseVisibleModal } = this.state;
    let stylescommon = this.props.global && this.props.global.dark ? stylescommon1 : stylescommon2;
    let boxStyle =
      this.props.global && this.props.global.dark
        ? this.props.location.query && this.props.location.query.id
          ? styles.onlyDetail
          : ''
        : this.props.location.query && this.props.location.query.id
        ? styles.onlyDetail + ' ' + styles.boxLight
        : styles.boxLight;
    return (
      <div className={boxStyle} id={'formCaseEvaluation'}>
        <div className={styles.listPageWrap}>
          <Card className={styles.listPageHeader}>
            {showDataView ? (
              <a className={styles.listPageHeaderCurrent}>
                <span>●</span>考评数据展示
              </a>
            ) : (
              <a onClick={this.changeListPageHeader}>考评数据展示</a>
            )}
            <span className={styles.border}>|</span>
            {showDataView ? (
              <a onClick={this.changeListPageHeader}>考评数据列表</a>
            ) : (
              <a className={styles.listPageHeaderCurrent}>
                <span>●</span>考评数据列表
              </a>
            )}
          </Card>

          <div style={showDataView ? {} : { display: 'none' }}>
            {this.tbrenderForm()}
            <EvaluationChats
              changeToListPage={this.changeToListPage}
              handleAllPoliceOptionChange={this.handleAllPoliceOptionChange}
              {...this.props}
              {...this.state}
            />
          </div>
          <div style={!showDataView ? {} : { display: 'none' }}>
            {this.renderForm()}
            <div className={stylescommon.btnTableBox}>
              <Button onClick={this.exportData} icon="download">
                导出表格
              </Button>
            </div>
            <EvaluationTable
              onChange={this.handleTableChange}
              newDetail={this.newDetail}
              handleSearch={this.handleSearch}
              getKpSearch={this.getKpSearch}
              data={AssessmentPgList}
              {...this.props}
              {...this.state}
            />
          </div>
        </div>
      </div>
    );
  }
}
