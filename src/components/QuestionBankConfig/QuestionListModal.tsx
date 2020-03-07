/*
 * systemSetup/QuestionBankConfig/QuestionListModal.tsx 测评模板添加题目模态框
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
  Icon, Modal,Table,Empty,
} from 'antd';
import moment from 'moment/moment';
import styles from './QuestionListModal.less';
import {exportListDataMaxDays, getUserInfos, tableList} from '../../utils/utils';
import noList from '@/assets/viewData/noList.png';
import noListLight from '@/assets/viewData/noListLight.png';

const FormItem = Form.Item;
const confirm = Modal.confirm;
const {Option} = Select;
const {RangePicker} = DatePicker;
const TabPane = Tabs.TabPane;
const TreeNode = TreeSelect.TreeNode;
const RadioGroup = Radio.Group;
let timeout;
let currentValue;

@connect(({QuestionBankConfig, loading, common, global}) => ({
  QuestionBankConfig,
  loading,
  common,
  global
  // loading: loading.models.alarmManagement,
}))
@Form.create()
export default class QuestionListModal extends PureComponent {
  constructor(props){
    super(props);
    // console.log('props',props);
    let showDataListId =[];
    props.questionTypeLabel==='00001'&&props.showDataList1&&props.showDataList1.length>0?(
      props.showDataList1.map((item)=>{
        const showDataListIdchild = item.id;
        showDataListId.push(showDataListIdchild)
      })
    ):'';
    props.questionTypeLabel==='00002'&&props.showDataList2&&props.showDataList2.length>0?(
      props.showDataList2.map((item)=>{
        const showDataListIdchild = item.id;
        showDataListId.push(showDataListIdchild)
      })
    ):'';
    props.questionTypeLabel==='00003'&&props.showDataList3&&props.showDataList3.length>0?(
      props.showDataList3.map((item)=>{
        const showDataListIdchild = item.id;
        showDataListId.push(showDataListIdchild)
      })
    ):'';
    this.state = {
      formValues: {},
      questionList:'', // 题目详情
      deletedata:[], // 选择删除的数据
      questionTypeLabel:props.questionTypeLabel, // 需要添加的题目类型
      selectedRows1:[], // 选中要添加的单选题目集合
      selectedRows2:[], // 选中要添加的多选题目集合
      selectedRows3:[], // 选中要添加的简答题目集合
      // showDataList1:props.showDataList1, // 已经选择过的单选题目集合
      // showDataList2:props.showDataList2, // 已经选择过的多选题目集合
      // showDataList3:props.showDataList3, // 已经选择过的简答题目集合
      selectedRowKeys:showDataListId, // 之前选择过的id集合
    }
    const param = {
      pd:{
        tmlx:props.questionTypeLabel,
      },
      currentPage:1,
      showCount:10,
    }
    this.getItemConfigList(param); // 获取题库列表
  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {

  }


  //获取题库列表
  getItemConfigList = (param) => {
    this.props.dispatch({
      type:'QuestionBankConfig/getQuestionList',
      payload:param?param:'',
      callback:(data)=>{
        // console.log('data',data);
        if(data){
          this.setState({
            questionList:data,
          })
        }
      }
    })
  }

  // 表格分页
  handleTableChange = (pagination, filtersArg, sorter) => {
    const {formValues} = this.state;
    const params = {
      pd: {
        ...formValues,
        tmlx:this.state.questionTypeLabel,
      },
      currentPage: pagination.current,
      showCount: pagination.pageSize,
    };
    this.getItemConfigList(params);
  };
  // 查询
  handleSearch = e => {
    if (e) e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if(!err){
        const formValues = {
          tm:values.tm,
        };
        this.setState({
          formValues,
        });
        const params = {
          currentPage: 1,
          showCount: tableList,
          pd: {
            ...formValues,
            tmlx:this.state.questionTypeLabel,
          },
        };
        this.getItemConfigList(params);
      }
    });
  };

  // 取消关闭题目列表模态框
  addCancel = () => {
    this.props.closeAddCancel(false)
  }

  // 确认添加的题目
  addSure = () => {
    const {selectedRows1,selectedRows2,selectedRows3,questionTypeLabel} = this.state;
    if(selectedRows1.length>0){
      this.props.chooseSelect(selectedRows1,questionTypeLabel);
      this.setState({
        selectedRows1:[],
      })
    }
    else if(selectedRows2.length>0){
      this.props.chooseSelect(selectedRows2,questionTypeLabel);
      this.setState({
        selectedRows2:[],
      })
    }
    else if(selectedRows3.length>0){
      this.props.chooseSelect(selectedRows3,questionTypeLabel);
      this.setState({
        selectedRows3:[],
      })
    }
    else {
      message.warning('请选择要添加的题目');
    }

  }

  renderForm() {
    const {
      form: {getFieldDecorator}} = this.props;
    const formItemLayout = {
      labelCol: {xs: {span: 24}, md: {span: 8}, xl: {span: 6}, xxl: {span: 4}},
      wrapperCol: {xs: {span: 24}, md: {span: 16}, xl: {span: 18}, xxl: {span: 20}},
    };
    const rowLayout = {md: 8, xl: 16, xxl: 24};
    const colLayout = {sm: 24, md: 12, xl: 8};
    const colLayouts = {sm: 24, md: 12, xl: 12};
    return (
      <Form
        onSubmit={this.handleSearch}
        style={{height:'auto',overflow:'hidden'}}
      >
        <Row gutter={rowLayout} className={styles.searchForm}>
          <Col {...colLayout}>
            <FormItem label="题目" {...formItemLayout}>
              {getFieldDecorator('tm', {
                // initialValue: this.state.caseType,
                //rules: [{max: 32, message: '最多输入32个字！'}],
              })(<Input placeholder="请输入题目"/>)}
            </FormItem>
          </Col>
        </Row>
        <Row className={styles.search}>
          <span style={{ marginTop: 5}}>
            <Button style={{marginLeft: 8}} type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{marginLeft: 8}} onClick={this.addSure}>
              添加
            </Button>
            <Button style={{marginLeft: 8}} onClick={this.addCancel}>
              取消
            </Button>
          </span>
        </Row>
      </Form>
    );
  }

  renderTable() {
    const {questionList,questionTypeLabel,selectedRowKeys} = this.state;
    let columns ;
    columns = [
      {
        title: '序号',
        dataIndex: 'xh',
        // width: 100,
      },
      {
        title: '题目类型',
        dataIndex: 'tmlxzw',
        // width: 100,
      },
      {
        title: '题目',
        dataIndex: 'tm',
        // width: 100,
      },
      {
        title: '答案解析',
        dataIndex: 'dajx',
        // width: 100,
      },
    ];
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        // console.log('selectedRowKeys',selectedRowKeys);
        // console.log('selectedRows',selectedRows);

        // if(this.props.chooseSelect){
        //   this.props.chooseSelect(selectedRowKeys);
        // }
        if(questionTypeLabel==='00001'){
          this.setState({
            selectedRows1:selectedRows,
            selectedRowKeys:selectedRowKeys,
          })
        }
        else if(questionTypeLabel==='00002'){
          this.setState({
            selectedRows2:selectedRows,
            selectedRowKeys:selectedRowKeys,
          })
        }
        else if(questionTypeLabel==='00003'){
          this.setState({
            selectedRows3:selectedRows,
            selectedRowKeys:selectedRowKeys,
          })
        }
      },
      selectedRowKeys: [...selectedRowKeys],
      // getCheckboxProps: record => ({
      //   disabled: record.name === 'Disabled User', // Column configuration not to be checked
      //   name: record.name,
      // }),
    };
    const paginationProps = {
      // showSizeChanger: true,
      // showQuickJumper: true,
      current: questionList.page ? questionList.page.currentPage : '',
      total: questionList.page ? questionList.page.totalResult : '',
      pageSize: questionList.page ? questionList.page.showCount : '',
      showTotal: (total, range) => (
        <span className={styles.pagination}  style={{
          color: this.props.global && this.props.global.dark ? '#999' : '#999'
        }}>{`共 ${questionList.page ? questionList.page.totalPage : 1} 页， ${
          questionList.page ? questionList.page.totalResult : 0
          } 条记录 `}</span>
      ),
    };
    return (
      <div>
        <Table
          rowKey={record => record.id}
          dataSource={questionList.list}
          columns={columns}
          rowSelection={rowSelection}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          className={styles.showTable}
          locale={{
            emptyText: (
              <Empty
                image={this.props.global && this.props.global.dark ? noList : noListLight}
                description={'暂无数据'}
              />
            ),
          }}
        />
      </div>
    );
  }

  render() {
    const {common: {depTree},visible} = this.props;
    const {addDataVisible} = this.state;
    // console.log('addDataVisible',addDataVisible)
    let className = this.props.global && this.props.global.dark ? styles.listPageWrap : styles.listPageWrap + ' ' + styles.lightBox;
    return (
      <Modal
        visible={visible}
        title=""
        className={this.props.global && this.props.global.dark ? styles.success : styles.successLight}
        width={1200}

        maskClosable={false}
        cancelText={null}
        footer={null}
      >
        <div>
          <div className={className} style={{height:770}}>
            <div style={{padding:24}}>
              <div className={styles.tableListForm} id="QuestionListForm">
                {this.renderForm()}
              </div>
              <div className={styles.tableListOperator}>{this.renderTable()}</div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}
