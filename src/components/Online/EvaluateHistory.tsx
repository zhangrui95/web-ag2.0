/*
* Online/EvaluateHistory.tsx 测评历史
* author：jhm
* 20200218
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
  Card, Icon, Upload, Modal,
} from 'antd';
import moment from 'moment/moment';
import styles from './EvaluateHistory.less';
import RenderTable from './EvaluateTable';
import {exportListDataMaxDays, getQueryString, tableList} from '../../utils/utils';
import {routerRedux} from "dva/router";


const confirm = Modal.confirm;
const FormItem = Form.Item;
const {Option} = Select;
const {RangePicker} = DatePicker;
const TabPane = Tabs.TabPane;
const TreeNode = TreeSelect.TreeNode;
const RadioGroup = Radio.Group;
let timeout;
let currentValue;

@connect(({Learning,common,global}) => ({
  Learning,common,global,
  // loading: loading.models.alarmManagement,
}))
@Form.create()
export default class EvaluateHistory extends PureComponent {
  state = {
    sfwc:'',
    formValues:'',
  };


  componentDidMount() {
    const jigouArea = sessionStorage.getItem('user');
    const newjigouArea = JSON.parse(jigouArea);
    const param = {
      currentPage: 1,
      pd: {},
      showCount: tableList,
    }
    this.getDataList(param) // 获取测评历史列表
    this.getDepTree(newjigouArea.department) // 获取测评机构

  }

  componentWillReceiveProps(nextProps) {

  }

  // 获取列表
  getDataList = (param) => {

  }
  // 获取测评机构
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

      },
    });
  };
  // 查询
  handleSearch = (e) => {
    if (e) e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log('values',values);
        const formValues = {

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
        this.getDataList(params);
      }
    })
  }

  // 重置
  handleFormReset = () => {
    this.props.form.resetFields();
    this.setState({
      formValues:'',
      sfwc:'',
    })
    const params = {
      currentPage: 1,
      showCount: tableList,
      pd: {

      },
    };
    this.getDataList(params);
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
    this.getDataList(params);
  };
  // 渲染机构树
  renderloop = data => data.map((item) => {
    const obj = {
      id: item.code,
      label: item.name,
    };
    const objStr = JSON.stringify(obj);
    if (item.childrenList && item.childrenList.length) {
      return <TreeNode value={objStr} key={objStr}
                       title={item.name}>{this.renderloop(item.childrenList)}</TreeNode>;
    }
    return <TreeNode key={objStr} value={objStr} title={item.name}/>;
  });
  renderForm() {
    const {form: {getFieldDecorator},TextLabel,common: {depTree},} = this.props;
    let TextLabelDictOptions = [];
    if (TextLabel.length > 0) {
      for (let i = 0; i < TextLabel.length; i++) {
        const item = TextLabel[i];
        TextLabelDictOptions.push(
          <Option key={item.id} value={JSON.stringify(item)}>{item.cpmbzw}</Option>,
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
        onSubmit={this.handleSearch}
        // style={{height: this.state.searchHeight ? 'auto' : '59px'}}
        style={{height:  'auto' }}
      >
        <Row gutter={rowLayout} className={styles.searchForm}>
          <Col {...colLayout}>
            <FormItem label="测评类型" {...formItemLayout}>
              {getFieldDecorator('cplx', {
                // initialValue: this.state.badw,
              })(
                <Select
                  placeholder="请选择测评类型"
                  style={{width: '100%'}}
                  getPopupContainer={() => document.getElementById('cplssearchForm')}
                >
                  <Option value="">全部</Option>
                  {TextLabelDictOptions}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col {...colLayout}>
            <FormItem label="测评人" {...formItemLayout}>
              {getFieldDecorator('cpr', {
                // initialValue: this.state.badw,
              })(
                <Input placeholder="请输入测评人"/>
              )}
            </FormItem>
          </Col>
          <Col {...colLayout}>
            <FormItem label="测评结果" {...formItemLayout}>
              {getFieldDecorator('cpjg', {
                // initialValue: this.state.badw,
              })(
                <Input placeholder="请输入测评结果"/>
              )}
            </FormItem>
          </Col>
          <Col {...colLayout}>
            <FormItem label="测评日期" {...formItemLayout}>
              {getFieldDecorator('cprq', {
                // initialValue: this.state.wtlx,
              })(
                <RangePicker
                  disabledDate={this.disabledDate}
                  style={{width: '100%'}}
                  getCalendarContainer={() => document.getElementById('cplssearchForm')}
                />,
              )}
            </FormItem>
          </Col>
          <Col {...colLayout}>
            <FormItem label="测评机构" {...formItemLayout}>
              {getFieldDecorator('cpjgo', {
                // initialValue: this.state.caseType,
              })(
                <TreeSelect
                  showSearch
                  style={{width: '100%'}}
                  dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                  placeholder="请选择机构"
                  allowClear
                  // onChange={this.treeChange}
                  key='cplsSelect'
                  // treeDefaultExpandedKeys={treeDefaultExpandedKeys}
                  treeNodeFilterProp="title"
                  getPopupContainer={() => document.getElementById('cplssearchForm')}
                >
                  {depTree && depTree.length > 0 ? this.renderloop(depTree) : []}
                </TreeSelect>,
              )}
            </FormItem>
          </Col>
          <Col {...colLayout}>
            <FormItem label="是否完成" {...formItemLayout}>
              {getFieldDecorator('sfwc', {
                initialValue: this.state.sfwc,
              })(
                <RadioGroup onChange={this.onRadioChange}>
                  <Radio value="">全部</Radio>
                  <Radio value="1">是</Radio>
                  <Radio value="0">否</Radio>
                </RadioGroup>,
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
          </span>
        </Row>
        <Row className={styles.search}>
          <span style={{marginTop: 5}}>
            <Button
              style={{ borderColor: '#2095FF',marginLeft: 8 }}
              onClick={this.exportData}
              icon="download"
            >
            导出表格
          </Button>
          </span>
        </Row>
      </Form>
    );
  }

  renderTable() {
    const {dataList, pagenow} = this.state;
    // console.log('pagenow',pagenow);
    return (
      <div>
        <RenderTable
          data={dataList}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }

  render() {
    const {ImportModal} = this.state;
    const {form: {getFieldDecorator}, common: {FbdwTypeData, ZllxTypeData}} = this.props;
    let className = this.props.global && this.props.global.dark ? styles.listPageWrap : styles.listPageWrap + ' ' + styles.lightBox;
    // console.log('dark',this.props)
    return (
      <div className={className} style={{minHeight:750}}>
        <div className={styles.tableListForm} id="cplssearchForm">
          {this.renderForm()}
        </div>
        <div className={styles.tableListOperator} style={{marginBottom: 0}}>
          {this.renderTable()}
        </div>
      </div>
    );
  }
}
