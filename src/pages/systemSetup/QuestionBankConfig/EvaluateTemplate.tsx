/*
 * QuestionBankConfig/EvaluateTemplate.tsx 题库配置测评模板
 * author：jhm
 * 20200302
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
export default class EvaluateTemplate extends PureComponent {
  state = {
    formValues: {},
    showDataView: true, // 控制显示图表或者列表（true显示图表）
  };

  componentDidMount() {
    if (this.props.location.query && this.props.location.query.id) {
      this.setState({
        showDataView: false,
      });
    }

  }

  componentWillReceiveProps(nextProps) {

  }
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
      bar: values.bar || '',
      name: values.xm || '',
      ha_name: values.ssbaq || '',
      rqyy_dm: values.rqyy || '',
      rqsj_ks: rqsj && rqsj.length > 0 ? rqsj[0].format('YYYY-MM-DD') : '',
      rqsj_js: rqsj && rqsj.length > 0 ? rqsj[1].format('YYYY-MM-DD') : '',
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
      bar: values.bar || '',
      name: values.xm || '',
      ha_name: values.ssbaq || '',
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



  renderForm() {
    const {
      form: {getFieldDecorator},
      common: {involvedType, depTree, baqTree, rqyyType},
    } = this.props;
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
            <FormItem label="题目" {...formItemLayout}>
              {getFieldDecorator('tm', {
                // initialValue: this.state.caseType,
                //rules: [{max: 32, message: '最多输入32个字！'}],
              })(<Input placeholder="请输入涉案人员"/>)}
            </FormItem>
          </Col>
          <Col {...colLayout}>
            <FormItem label="题目类型" {...formItemLayout}>
              {getFieldDecorator('tmlx', {
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

        </Row>
        <Row className={styles.search}>
          <span style={{ marginTop: 5}}>
            <Button style={{marginLeft: 8}} type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>
              重置
            </Button>
            <Button
              style={{ borderColor: '#2095FF',marginLeft: 8 }}
              onClick={this.exportData}
              icon="download"
            >
              导出表格
            </Button>
          </span>
        </Row>
        <Row className={styles.search}>
          <span style={{marginTop: 5}}>
            <Button
              style={{ borderColor: '#2095FF', marginLeft: 8 }}
              onClick={()=>this.importData(true)}
              // icon="download"
            >
              题目添加
            </Button>
            <Button
              style={{ borderColor: '#2095FF', marginLeft: 8 }}
              onClick={this.deleteData}
              // icon="download"
            >
              题目删除
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
    const {areaData: {area, loading}, common: {depTree}} = this.props;
    const {
      showDataView,
    } = this.state;
    let className = this.props.global && this.props.global.dark ? styles.listPageWrap : styles.listPageWrap + ' ' + styles.lightBox;
    return (
      <div className={this.props.location.query && this.props.location.query.id ? styles.onlyDetail : ''}>
        <div className={className}>
          <div className={styles.listPageHeader}>
            {showDataView ? (
              <a className={styles.listPageHeaderCurrent}>
                <span>●</span>题库维护
              </a>
            ) : (
              <a className={styles.UnlistPageHeaderCurrent} onClick={this.changeListPageHeader}>
                题库维护
              </a>
            )}
            <span className={styles.borderCenter}>|</span>
            {showDataView ? (
              <a className={styles.UnlistPageHeaderCurrent} onClick={this.changeListPageHeader}>
                测评模板
              </a>
            ) : (
              <a className={styles.listPageHeaderCurrent}>
                <span>●</span>测评模板
              </a>
            )}
          </div>
          <EvaluateTemplate
            {...this.props}
            showDataView={showDataView}
          />
          <div style={showDataView ? {display: 'none'} : {display: 'block'}}>
            <div className={styles.tableListForm} id="baqsjtableListForm">
              {this.renderForm()}
            </div>
            <div className={styles.tableListOperator}>{this.renderTable()}</div>
          </div>
        </div>
      </div>
    );
  }
}
