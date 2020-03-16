/*
 * systemSetup/QuestionBankConfig/QuestionDefendTable.tsx 题库配置题库维护表格
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
  Icon, Modal,
} from 'antd';
import moment from 'moment/moment';
import styles from './index.less';
import QuestionDefendTable from '../../../components/QuestionBankConfig/QuestionDefendTable';
import AddDataVisibleModal from '../../../components/QuestionBankConfig/addDataVisibleModal';
import {exportListDataMaxDays, getUserInfos, tableList} from '../../../utils/utils';
import EvaluateTemplate from './EvaluateTemplate';


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
export default class Index extends PureComponent {
  state = {
    formValues: {},
    showDataView: true, // 控制显示图表或者列表（true显示图表）
    addDataVisible: false, // 题目添加模态框
    questionList:'', // 题目列表
    deletedata:[], // 选择删除的数据
    // addShowDelete:false, // 添加试题预览时是否删除
  };

  componentDidMount() {
    const param = {
      pd:{},
      currentPage:1,
      showCount:10,
    }
    this.getItemConfigList(param); // 获取题库列表
    this.getItemLabelList(); // 获取题目类型字典项
  }

  componentWillReceiveProps(nextProps) {

  }

  //获取题目类型字典项
  getItemLabelList = () => {
    this.props.dispatch({
      type:'common/getfbdwDictType',
      payload:{
        currentPage: 1,
        pd: {id: "117b5fb2-953e-4983-835d-c5d082feb9d5", name: "", appCode: "106305"},
        showCount: tableList,
      },
    })
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
          tmlx:values.tmlx,
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
        this.getItemConfigList(params);
      }
    });
  };
  // 重置
  handleFormReset = () => {
    this.props.form.resetFields();
    this.setState({
      formValues:'',
    })
    const params = {
      currentPage: 1,
      showCount: tableList,
      pd: {},
    };
    this.getItemConfigList(params);
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

  // 题目添加
  addData = (flag) => {
    this.setState({
      addDataVisible:!!flag,
    })
  };

  // 题目删除(多个)
  deleteData = () => {
    const { deletedata } = this.state;
    console.log('deletedata',deletedata);
    let that = this;
    let deleteId = [], objDeleteId={};
    if(deletedata&&deletedata.length>0){
      deletedata.map((item) => {
        objDeleteId = {
          tkid:item,
        }
        deleteId.push(objDeleteId);
      });
      confirm({
        title: '确定删除这'+deletedata.length+'条资料？',
        content: '',
        okText: '确定',
        cancelText: '取消',
        style: {top: 417},
        onOk() {
          that.delete(deleteId)
        },
      });
    }
    else{
      message.warning('请选择要删除的资料');
    }
  }

  // 删除题目（单个）
  deleteListData = (obj) => {
    let deleteId = [],that=this;
    let objDelete={
      tkid:obj.id,
    }
    deleteId.push(objDelete);
    confirm({
      title: '确定删除？',
      content: '',
      okText: '确定',
      cancelText: '取消',
      style: {top: 417},
      onOk() {
        that.delete(deleteId);
      },
    });
  }

  delete = (deleteId) => {
    this.props.dispatch({
      type:'QuestionBankConfig/getDeleteQuestion',
      payload:{
        tkxx:deleteId,
      },
      callback:(obj)=>{
        if(obj.error === null){
          message.success('删除成功');
          this.handleFormReset();
          this.setState({
            deletedata:[],

          })
        }
      }
    })
  }

  // 选择删除的数据
  chooseSelect = (deletedata) => {
    // console.log()
    this.setState({
      deletedata,
    })
  };
  renderForm() {
    const {
      form: {getFieldDecorator}, common: {TklxTypeData},} = this.props;
    let involvedTypeOptions = [];
    if (TklxTypeData.length > 0) {
      for (let i = 0; i < TklxTypeData.length; i++) {
        const item = TklxTypeData[i];
        involvedTypeOptions.push(
          <Option key={item.id} value={item.code}>
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
    const colLayouts = {sm: 24, md: 12, xl: 12};
    return (
      <Form
        onSubmit={this.handleSearch}
        style={{height:'auto'}}
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
          <Col {...colLayout}>
            <FormItem label="题目类型" {...formItemLayout}>
              {getFieldDecorator('tmlx', {
              })(
                <Select
                  placeholder="请选择"
                  style={{width: '100%'}}
                  getPopupContainer={() => document.getElementById('cptkpzsjtableListForm')}
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
              onClick={()=>this.addData(true)}
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
    const {questionList} = this.state;
    return (
      <div>
        <QuestionDefendTable
          data={questionList}
          onChange={this.handleTableChange} // 分页
          deleteListData={this.deleteListData} // 表格删除
          chooseSelect={this.chooseSelect} // 删除多条数据
        />
      </div>
    );
  }

  // 题库维护和测评模板切换
  changeListPageHeader = () => {
    const {showDataView} = this.state;
    this.setState({
      showDataView: !showDataView,
    });
  };

  // 关闭题目添加模态框
  closeCancel = () => {
    this.setState({
      addDataVisible:false,
    })
  }

  //关闭题目添加模态框
  closeAddDataVisibleModal = () => {
    this.setState({
      addDataVisible:false,
    })
  }
  render() {
    const {common: {depTree}} = this.props;
    const {showDataView,addDataVisible} = this.state;
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
          <div style={showDataView ? {display: 'none'} : {display: 'block'}}>
            <EvaluateTemplate
              {...this.props}
              showDataView={showDataView}
            />
          </div>
          <div style={showDataView ? {display: 'block'} : {display: 'none'}}>
            <div className={styles.tableListForm} id="cptkpzsjtableListForm">
              {this.renderForm()}
            </div>
            <div className={styles.tableListOperator}>{this.renderTable()}</div>
          </div>
        </div>

        {addDataVisible?
          <AddDataVisibleModal
            title="题目添加"
            visible={addDataVisible}
            CloseCancelModal={this.closeCancel} // 关闭题目添加模态框
            getItemConfigList={this.getItemConfigList} // 刷新表格
            closeAddDataVisibleModal={this.closeAddDataVisibleModal} // 题目添加完毕关闭'题目添加'模态框
            deleteListData={this.deleteListData} // 删除添加的题目
            // addShowDelete={addShowDelete} // 添加试题预览时是否执行删除
            delete={this.delete}
            dark={this.props.global?this.props.global.dark:''}
          />
          :
          ''
        }
      </div>
    );
  }
}
